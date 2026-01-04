package com.research.project.controller;

import com.research.project.common.Result;
import com.research.project.dto.DashboardDTO;
import com.research.project.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 首页工作台控制器
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    /**
     * 获取工作台数据
     * 根据当前用户权限返回对应的统计数据
     */
    @GetMapping
    public Result<DashboardDTO> getDashboard(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole
    ) {
        // 如果没有userId，使用默认值（实际应该从认证中获取）
        if (userId == null) {
            userId = 1L;
        }
        
        DashboardDTO dashboard = dashboardService.getDashboard(userId);
        return Result.success(dashboard);
    }
}
