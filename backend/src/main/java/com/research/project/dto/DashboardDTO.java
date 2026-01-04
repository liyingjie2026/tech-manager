package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 首页仪表板数据DTO
 */
@Data
public class DashboardDTO {
    /**
     * 项目统计
     */
    private ProjectStatsDTO projectStats;
    
    /**
     * 待办事项列表
     */
    private List<TodoItemDTO> todoItems;
    
    /**
     * 通知公告列表
     */
    private List<NotificationDTO> notifications;
    
    /**
     * 最近项目列表
     */
    private List<RecentProjectDTO> recentProjects;
    
    @Data
    public static class ProjectStatsDTO {
        private Long total;          // 已立项项目数
        private Long inProgress;     // 申报中项目数
        private Long completed;      // 已完成项目数
        private Long accepted;       // 已验收项目数
        private BigDecimal totalBudget; // 总预算金额（万元）
    }
    
    @Data
    public static class TodoItemDTO {
        private Long id;
        private String title;
        private String description;
        private String type;
        private String typeName;
        private String priority;
        private String priorityName;
        private String status;
        private String statusName;
        private String deadline;  // 只显示日期，格式：yyyy-MM-dd
        private Integer daysRemaining;  // 剩余天数
        private Boolean isOverdue;      // 是否逾期
        private String linkUrl;
        private String date;
    }
    
    @Data
    public static class NotificationDTO {
        private Long id;
        private String title;
        private String type;
        private String date;  // 只显示日期，格式：yyyy-MM-dd
    }
    
    @Data
    public static class RecentProjectDTO {
        private Long id;
        private String projectNo;
        private String name;
        private String status;
        private Integer progress;
    }
}
