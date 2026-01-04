package com.research.project.dto;

import lombok.Data;

/**
 * 项目总览统计DTO
 */
@Data
public class OverviewStatisticsDTO {
    /**
     * 项目总数
     */
    private Long totalProjects;
    
    /**
     * 执行中项目数
     */
    private Long ongoingProjects;
    
    /**
     * 已结题项目数
     */
    private Long completedProjects;
    
    /**
     * 待审核项目数
     */
    private Long pendingProjects;
    
    /**
     * 总预算（万元）
     */
    private Double totalBudget;
    
    /**
     * 已拨付金额（万元）
     */
    private Double allocatedBudget;
    
    /**
     * 机构总数
     */
    private Long totalInstitutions;
    
    /**
     * 参与人员总数
     */
    private Long totalParticipants;
    
    /**
     * 设置执行中项目数（兼容方法）
     */
    public void setExecutingProjects(int count) {
        this.ongoingProjects = (long) count;
    }
    
    public void setExecutingProjects(Long count) {
        this.ongoingProjects = count;
    }
    
    /**
     * 设置专家总数（兼容方法）
     */
    public void setTotalExperts(int count) {
        this.totalParticipants = (long) count;
    }
    
    public void setTotalExperts(Long count) {
        this.totalParticipants = count;
    }
}
