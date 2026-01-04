package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.TodoItemDTO;
import com.research.project.dto.TodoStatisticsDTO;
import com.research.project.entity.TodoItem;

public interface TodoItemService {
    
    /**
     * 分页查询待办事项
     */
    PageResult<TodoItemDTO> list(
            Integer page,
            Integer size,
            Long userId,
            String role,
            String type,
            String status,
            String keyword
    );
    
    /**
     * 获取待办统计信息
     */
    TodoStatisticsDTO getStatistics(Long userId, String role);
    
    /**
     * 根据ID获取待办详情
     */
    TodoItemDTO getById(Long id);
    
    /**
     * 创建待办事项
     */
    Long create(TodoItem todoItem);
    
    /**
     * 完成待办事项
     */
    void complete(Long id, String completedBy);
    
    /**
     * 取消待办事项
     */
    void cancel(Long id);
    
    /**
     * 批量创建待办（内部方法）
     */
    void batchCreate(java.util.List<TodoItem> todoItems);
    
    /**
     * 批量完成待办（根据业务）
     */
    void batchCompleteByBusiness(Long businessId, String businessType, String completedBy);
    
    /**
     * 获取用户未完成待办数量
     */
    Integer getUncompletedCount(Long userId);
}
