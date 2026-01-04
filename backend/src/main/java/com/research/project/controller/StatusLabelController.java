package com.research.project.controller;

import com.research.project.entity.StatusLabel;
import com.research.project.service.StatusLabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * 状态标签Controller
 */
@RestController
@RequestMapping("/status-labels")
public class StatusLabelController {
    
    @Autowired
    private StatusLabelService statusLabelService;
    
    /**
     * 获取所有状态标签（分组）
     */
    @GetMapping("/all")
    public Map<String, List<StatusLabel>> getAllLabels() {
        return statusLabelService.getAllLabelsGrouped();
    }
    
    /**
     * 根据分类获取状态标签
     */
    @GetMapping("/category/{category}")
    public List<StatusLabel> getLabelsByCategory(@PathVariable String category) {
        return statusLabelService.getLabelsByCategory(category);
    }
    
    /**
     * 获取状态显示文本
     */
    @GetMapping("/text")
    public String getStatusText(@RequestParam String category, @RequestParam String value) {
        return statusLabelService.getStatusText(category, value);
    }
    
    /**
     * 批量获取状态显示文本
     */
    @PostMapping("/batch-text")
    public Map<String, String> getBatchStatusText(@RequestBody Map<String, String> params) {
        return statusLabelService.getBatchStatusText(params);
    }
}
