package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.research.project.common.PageResult;
import com.research.project.dto.TodoItemDTO;
import com.research.project.dto.TodoStatisticsDTO;
import com.research.project.entity.TodoItem;
import com.research.project.mapper.TodoItemMapper;
import com.research.project.service.TodoItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoItemServiceImpl implements TodoItemService {
    
    private final TodoItemMapper todoItemMapper;
    
    // 待办类型名称映射
    private static final Map<String, String> TYPE_NAME_MAP = new HashMap<>();
    static {
        TYPE_NAME_MAP.put("project_review", "项目评审");
        TYPE_NAME_MAP.put("taskbook_audit", "任务书审核");
        TYPE_NAME_MAP.put("change_audit", "变更审核");
        TYPE_NAME_MAP.put("midterm_review", "中期检查");
        TYPE_NAME_MAP.put("annual_review", "年报检查");
        TYPE_NAME_MAP.put("acceptance_review", "验收审核");
        TYPE_NAME_MAP.put("expert_audit", "专家审核");
        TYPE_NAME_MAP.put("institution_audit", "机构审核");
    }
    
    // 优先级名称映射
    private static final Map<String, String> PRIORITY_NAME_MAP = new HashMap<>();
    static {
        PRIORITY_NAME_MAP.put("urgent", "紧急");
        PRIORITY_NAME_MAP.put("high", "高");
        PRIORITY_NAME_MAP.put("normal", "普通");
        PRIORITY_NAME_MAP.put("low", "低");
    }
    
    // 状态名称映射
    private static final Map<String, String> STATUS_NAME_MAP = new HashMap<>();
    static {
        STATUS_NAME_MAP.put("pending", "待处理");
        STATUS_NAME_MAP.put("processing", "处理中");
        STATUS_NAME_MAP.put("completed", "已完成");
        STATUS_NAME_MAP.put("cancelled", "已取消");
    }
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    @Override
    public PageResult<TodoItemDTO> list(
            Integer page,
            Integer size,
            Long userId,
            String role,
            String type,
            String status,
            String keyword
    ) {
        // 计算分页偏移量
        int offset = (page - 1) * size;
        
        // 查询数据
        List<TodoItem> items = todoItemMapper.selectByConditions(
                userId, role, type, status, keyword, null, null, offset, size
        );
        
        // 统计总数
        Long total = todoItemMapper.countByConditions(
                userId, role, type, status, keyword, null, null
        );
        
        // 转换DTO
        List<TodoItemDTO> dtos = items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>( Long.parseLong(String.valueOf(page)), Long.parseLong(String.valueOf(size)),total, dtos);
    }
    
    @Override
    public TodoStatisticsDTO getStatistics(Long userId, String role) {
        TodoStatisticsDTO dto = new TodoStatisticsDTO();
        
        // 总数
        dto.setTotalCount(todoItemMapper.countByConditions(
                userId, role, null, null, null, null, null).intValue());
        
        // 待处理
        dto.setPendingCount(todoItemMapper.countByConditions(
                userId, role, null, "pending", null, null, null).intValue());
        
        // 处理中
        dto.setProcessingCount(todoItemMapper.countByConditions(
                userId, role, null, "processing", null, null, null).intValue());
        
        // 已完成
        dto.setCompletedCount(todoItemMapper.countByConditions(
                userId, role, null, "completed", null, null, null).intValue());
        
        // 紧急待办（优先级urgent且未完成）
        LambdaQueryWrapper<TodoItem> urgentWrapper = new LambdaQueryWrapper<>();
        urgentWrapper.eq(TodoItem::getUserId, userId)
                .eq(TodoItem::getPriority, "urgent")
                .in(TodoItem::getStatus, "pending", "processing");
        dto.setUrgentCount(todoItemMapper.selectCount(urgentWrapper).intValue());
        
        // 逾期待办
        LambdaQueryWrapper<TodoItem> overdueWrapper = new LambdaQueryWrapper<>();
        overdueWrapper.eq(TodoItem::getUserId, userId)
                .in(TodoItem::getStatus, "pending", "processing")
                .lt(TodoItem::getDeadline, LocalDateTime.now());
        dto.setOverdueCount(todoItemMapper.selectCount(overdueWrapper).intValue());
        
        // 今日到期
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().plusDays(1).atStartOfDay();
        LambdaQueryWrapper<TodoItem> todayWrapper = new LambdaQueryWrapper<>();
        todayWrapper.eq(TodoItem::getUserId, userId)
                .in(TodoItem::getStatus, "pending", "processing")
                .ge(TodoItem::getDeadline, todayStart)
                .lt(TodoItem::getDeadline, todayEnd);
        dto.setTodayCount(todoItemMapper.selectCount(todayWrapper).intValue());
        
        // 本周到期
        LocalDateTime weekEnd = LocalDate.now().plusDays(7).atStartOfDay();
        LambdaQueryWrapper<TodoItem> weekWrapper = new LambdaQueryWrapper<>();
        weekWrapper.eq(TodoItem::getUserId, userId)
                .in(TodoItem::getStatus, "pending", "processing")
                .ge(TodoItem::getDeadline, LocalDateTime.now())
                .lt(TodoItem::getDeadline, weekEnd);
        dto.setWeekCount(todoItemMapper.selectCount(weekWrapper).intValue());
        
        return dto;
    }
    
    @Override
    public TodoItemDTO getById(Long id) {
        TodoItem item = todoItemMapper.selectById(id);
        if (item == null) {
            throw new RuntimeException("待办事项不存在");
        }
        return convertToDTO(item);
    }
    
    @Override
    @Transactional
    public Long create(TodoItem todoItem) {
        todoItem.setCreateTime(LocalDateTime.now());
        todoItem.setUpdateTime(LocalDateTime.now());
        if (todoItem.getStatus() == null) {
            todoItem.setStatus("pending");
        }
        if (todoItem.getPriority() == null) {
            todoItem.setPriority("normal");
        }
        todoItemMapper.insert(todoItem);
        return todoItem.getId();
    }
    
    @Override
    @Transactional
    public void complete(Long id, String completedBy) {
        TodoItem item = todoItemMapper.selectById(id);
        if (item == null) {
            throw new RuntimeException("待办事项不存在");
        }
        item.setStatus("completed");
        item.setCompletedBy(completedBy);
        item.setCompletedTime(LocalDateTime.now());
        item.setUpdateTime(LocalDateTime.now());
        todoItemMapper.updateById(item);
    }
    
    @Override
    @Transactional
    public void cancel(Long id) {
        TodoItem item = todoItemMapper.selectById(id);
        if (item == null) {
            throw new RuntimeException("待办事项不存在");
        }
        item.setStatus("cancelled");
        item.setUpdateTime(LocalDateTime.now());
        todoItemMapper.updateById(item);
    }
    
    @Override
    @Transactional
    public void batchCreate(List<TodoItem> todoItems) {
        LocalDateTime now = LocalDateTime.now();
        for (TodoItem item : todoItems) {
            item.setCreateTime(now);
            item.setUpdateTime(now);
            if (item.getStatus() == null) {
                item.setStatus("pending");
            }
            if (item.getPriority() == null) {
                item.setPriority("normal");
            }
            todoItemMapper.insert(item);
        }
    }
    
    @Override
    @Transactional
    public void batchCompleteByBusiness(Long businessId, String businessType, String completedBy) {
        todoItemMapper.batchCompleteByBusiness(
                businessId,
                businessType,
                completedBy,
                LocalDateTime.now()
        );
    }
    
    @Override
    public Integer getUncompletedCount(Long userId) {
        LambdaQueryWrapper<TodoItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TodoItem::getUserId, userId)
                .in(TodoItem::getStatus, "pending", "processing");
        return todoItemMapper.selectCount(wrapper).intValue();
    }
    
    /**
     * Entity转DTO
     */
    private TodoItemDTO convertToDTO(TodoItem item) {
        TodoItemDTO dto = new TodoItemDTO();
        BeanUtils.copyProperties(item, dto);
        
        // 设置类型名称
        dto.setTypeName(TYPE_NAME_MAP.getOrDefault(item.getType(), item.getType()));
        
        // 设置优先级名称
        dto.setPriorityName(PRIORITY_NAME_MAP.getOrDefault(item.getPriority(), item.getPriority()));
        
        // 设置状态名称
        dto.setStatusName(STATUS_NAME_MAP.getOrDefault(item.getStatus(), item.getStatus()));
        
        if (item.getDeadline() != null) {
            dto.setDeadline(item.getDeadline());
            
            // 判断是否逾期
            dto.setIsOverdue(item.getDeadline().isBefore(LocalDateTime.now()));
            
            // 计算剩余天数
            long days = ChronoUnit.DAYS.between(LocalDateTime.now(), item.getDeadline());
            dto.setDaysRemaining((int) days);
        }
        
        if (item.getCreateTime() != null) {
            dto.setCreateTime(item.getCreateTime());
        }
        
        return dto;
    }
}
