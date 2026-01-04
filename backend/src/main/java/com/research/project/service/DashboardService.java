package com.research.project.service;

import com.research.project.dto.DashboardDTO;

/**
 * 工作台服务接口
 */
public interface DashboardService {
    
    /**
     * 获取工作台数据（根据当前用户权限）
     * @param userId 当前用户ID
     * @return 工作台数据
     */
    DashboardDTO getDashboard(Long userId);
}
