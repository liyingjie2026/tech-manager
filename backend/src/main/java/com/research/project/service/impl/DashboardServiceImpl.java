package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.research.project.dto.DashboardDTO;
import com.research.project.entity.Acceptance;
import com.research.project.entity.Notice;
import com.research.project.entity.Project;
import com.research.project.entity.TodoItem;
import com.research.project.entity.User;
import com.research.project.mapper.AcceptanceMapper;
import com.research.project.mapper.NoticeMapper;
import com.research.project.mapper.ProjectMapper;
import com.research.project.mapper.TodoItemMapper;
import com.research.project.mapper.UserMapper;
import com.research.project.service.DashboardService;
import com.research.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 工作台服务实现类
 */
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    
    private final ProjectMapper projectMapper;
    private final TodoItemMapper todoItemMapper;
    private final NoticeMapper noticeMapper;
    private final UserMapper userMapper;
    private final AcceptanceMapper acceptanceMapper;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    @Override
    public DashboardDTO getDashboard(Long userId) {
        DashboardDTO dashboard = new DashboardDTO();
        
        // Get current user info to determine access scope
        User currentUser = userMapper.selectById(userId);
        if (currentUser == null) {
            currentUser = new User();
            currentUser.setUserType("researcher");
        }
        
        // 1. 获取项目统计数据（基于当前用户权限）
        dashboard.setProjectStats(getProjectStats(userId, currentUser));
        
        // 2. 获取待办事项（只显示未完成的，按临期情况排序）
        dashboard.setTodoItems(getTodoItems(userId));
        
        // 3. 获取通知公告
        dashboard.setNotifications(getNotifications());
        
        // 4. 获取最近项目（我参与的项目，按创建时间排序）
        dashboard.setRecentProjects(getRecentProjects(userId, currentUser));
        
        return dashboard;
    }
    
    /**
     * 获取项目统计数据（基于当前用户权限）
     */
    private DashboardDTO.ProjectStatsDTO getProjectStats(Long userId, User currentUser) {
        DashboardDTO.ProjectStatsDTO stats = new DashboardDTO.ProjectStatsDTO();
        
        LambdaQueryWrapper<Project> baseWrapper = new LambdaQueryWrapper<>();
        
        String userType = currentUser.getUserType();
        if ("admin".equals(userType) || "supervisor".equals(userType)) {
            // 超级管理员、监管端用户可以看到系统中所有的项目信息
            // No filter - see all projects
        } else if ("researcher".equals(userType)) {
            // 检查是否是机构管理员（通过roleName判断）
            if (currentUser.getRoleName() != null && currentUser.getRoleName().contains("管理员")) {
                // 机构管理员可以看到该机构下的所有项目信息
                baseWrapper.eq(Project::getInstitutionId, currentUser.getInstitutionId());
            } else {
                // 普通科研人员只能看到自己参与的项目
                baseWrapper.and(w -> w.eq(Project::getLeaderId, userId).or().eq(Project::getCreateBy, userId));
            }
        } else {
            // 其他用户（如专家）只能看到自己参与的项目
            baseWrapper.and(w -> w.eq(Project::getLeaderId, userId).or().eq(Project::getCreateBy, userId));
        }
        
        // 项目总数：非草稿状态的所有项目之和
        LambdaQueryWrapper<Project> totalWrapper = baseWrapper.clone();
        totalWrapper.ne(Project::getStatus, "draft");
        long total = projectMapper.selectCount(totalWrapper);
        stats.setTotal(total);
        
        // 已立项项目：完成项目申报的项目之和（状态为approved或running或executing）
        LambdaQueryWrapper<Project> approvedWrapper = baseWrapper.clone();
        approvedWrapper.in(Project::getStatus, "approved", "running", "executing");
        long approved = projectMapper.selectCount(approvedWrapper);
        stats.setInProgress(approved);
        
        // 已完成项目：已完成项目终验且通过的项目之和
        // Need to join with prj_acceptance table where status='accepted' and conclusion in ('excellent', 'qualified')
        List<Project> allProjects = projectMapper.selectList(baseWrapper);
        long completed = allProjects.stream()
                .filter(p -> {
                    // Check if project has acceptance record with qualified or excellent conclusion
                    Acceptance acceptance = acceptanceMapper.selectByProjectId(p.getId());
                    return acceptance != null 
                           && "accepted".equals(acceptance.getStatus())
                           && ("excellent".equals(acceptance.getConclusion()) || "qualified".equals(acceptance.getConclusion()));
                })
                .count();
        stats.setCompleted(completed);
        
        // 统计已验收项目数（状态为accepted的）
        LambdaQueryWrapper<Project> acceptedWrapper = baseWrapper.clone();
        acceptedWrapper.eq(Project::getWorkflowStage, "completed");
        long accepted = projectMapper.selectCount(acceptedWrapper);
        stats.setAccepted(accepted);
        
        // 统计总预算金额（万元）
        BigDecimal totalBudget = allProjects.stream()
                .map(Project::getTotalBudget)
                .filter(budget -> budget != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalBudget(totalBudget);
        
        return stats;
    }
    
    /**
     * 获取待办事项（只显示未完成的，按临期情况排序）
     */
    private List<DashboardDTO.TodoItemDTO> getTodoItems(Long userId) {
        LambdaQueryWrapper<TodoItem> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TodoItem::getUserId, userId)
                   .eq(TodoItem::getStatus, "pending")
                   .orderByAsc(TodoItem::getDeadline)
                   .last("LIMIT 5");
        
        List<TodoItem> todoItems = todoItemMapper.selectList(queryWrapper);
        
        return todoItems.stream().map(item -> {
            DashboardDTO.TodoItemDTO dto = new DashboardDTO.TodoItemDTO();
            dto.setId(item.getId());
            dto.setTitle(item.getTitle());
            dto.setDescription(item.getDescription());
            dto.setType(item.getType());
            dto.setTypeName(getTypeName(item.getType()));
            dto.setPriority(item.getPriority());
            dto.setPriorityName(getPriorityName(item.getPriority()));
            dto.setStatus(item.getStatus());
            dto.setStatusName("待处理");
            
            // 格式化截止时间（只显示日期）
            if (item.getDeadline() != null) {
                dto.setDeadline(item.getDeadline().format(DATE_FORMATTER));
                
                // 计算剩余天数
                long daysRemaining = ChronoUnit.DAYS.between(LocalDateTime.now(), item.getDeadline());
                dto.setDaysRemaining((int) daysRemaining);
                dto.setIsOverdue(daysRemaining < 0);
            }
            
            dto.setLinkUrl(item.getLinkUrl());
            
            return dto;
        }).collect(Collectors.toList());
    }
    
    /**
     * 获取通知公告
     */
    private List<DashboardDTO.NotificationDTO> getNotifications() {
        LambdaQueryWrapper<Notice> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Notice::getStatus, "published")
                   .orderByDesc(Notice::getIsTop)
                   .orderByDesc(Notice::getPublishTime)
                   .last("LIMIT 5");
        
        List<Notice> notices = noticeMapper.selectList(queryWrapper);
        
        return notices.stream().map(notice -> {
            DashboardDTO.NotificationDTO dto = new DashboardDTO.NotificationDTO();
            dto.setId(notice.getId());
            dto.setTitle(notice.getTitle());
            dto.setType(notice.getType());
            
            // 格式化发布时间（只显示日期）
            if (notice.getPublishTime() != null) {
                dto.setDate(notice.getPublishTime().format(DATE_FORMATTER));
            }
            
            return dto;
        }).collect(Collectors.toList());
    }
    
    /**
     * 获取最近项目（基于当前用户权限）
     */
    private List<DashboardDTO.RecentProjectDTO> getRecentProjects(Long userId, User currentUser) {
        LambdaQueryWrapper<Project> queryWrapper = new LambdaQueryWrapper<>();
        
        String userType = currentUser.getUserType();
        if ("admin".equals(userType) || "supervisor".equals(userType)) {
            // 超级管理员、监管端用户可以看到所有项目
            // No additional filter
        } else if ("researcher".equals(userType)) {
            if (currentUser.getRoleName() != null && currentUser.getRoleName().contains("管理员")) {
                // 机构管理员看本机构的项目
                queryWrapper.eq(Project::getInstitutionId, currentUser.getInstitutionId());
            } else {
                // 普通科研人员看自己参与的项目
                queryWrapper.and(w -> w.eq(Project::getLeaderId, userId).or().eq(Project::getCreateBy, userId));
            }
        } else {
            // 其他用户看自己参与的项目
            queryWrapper.and(w -> w.eq(Project::getLeaderId, userId).or().eq(Project::getCreateBy, userId));
        }
        
        queryWrapper.orderByDesc(Project::getCreateTime).last("LIMIT 3");
        
        List<Project> projects = projectMapper.selectList(queryWrapper);
        
        return projects.stream().map(project -> {
            DashboardDTO.RecentProjectDTO dto = new DashboardDTO.RecentProjectDTO();
            dto.setId(project.getId());
            dto.setProjectNo(project.getProjectNo());
            dto.setName(project.getName());
            dto.setStatus(getStatusName(project.getStatus()));
            dto.setProgress(calculateProgress(project));
            return dto;
        }).collect(Collectors.toList());
    }
    
    /**
     * 获取待办类型名称
     */
    private String getTypeName(String type) {
        if (type == null) return "未知";
        switch (type) {
            case "project_review": return "项目评审";
            case "taskbook_review": return "任务书评审";
            case "taskbook_sign": return "任务书签署";
            case "midterm_submit": return "中期检查提交";
            case "midterm_review": return "中期检查评审";
            case "annual_submit": return "年报提交";
            case "annual_review": return "年报评审";
            case "change_review": return "变更评审";
            case "acceptance_submit": return "验收提交";
            case "acceptance_review": return "验收评审";
            default: return type;
        }
    }
    
    /**
     * 获取优先级名称
     */
    private String getPriorityName(String priority) {
        if (priority == null) return "普通";
        switch (priority) {
            case "urgent": return "紧急";
            case "high": return "高";
            case "normal": return "普通";
            case "low": return "低";
            default: return priority;
        }
    }
    
    /**
     * 获取状态名称
     */
    private String getStatusName(String status) {
        if (status == null) return "未知";
        switch (status) {
            case "draft": return "草稿";
            case "pending": return "待审核";
            case "approved": return "已立项";
            case "running": return "执行中";
            case "executing": return "执行中";
            case "completed": return "已完成";
            case "accepted": return "已验收";
            case "rejected": return "已拒绝";
            case "cancelled": return "已取消";
            default: return status;
        }
    }
    
    /**
     * 计算项目进度
     */
    private Integer calculateProgress(Project project) {
        // 简单的进度计算逻辑
        if ("accepted".equals(project.getStatus())) {
            return 100;
        } else if ("completed".equals(project.getStatus())) {
            return 90;
        } else if ("running".equals(project.getStatus()) || "executing".equals(project.getStatus())) {
            return 50;
        } else if ("approved".equals(project.getStatus())) {
            return 30;
        } else if ("pending".equals(project.getStatus())) {
            return 10;
        }
        return 0;
    }
}
