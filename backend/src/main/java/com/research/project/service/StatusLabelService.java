package com.research.project.service;

import com.research.project.entity.StatusLabel;
import java.util.List;
import java.util.Map;

/**
 * 状态标签Service
 */
public interface StatusLabelService {
    
    /**
     * 获取所有状态标签（分组）
     */
    Map<String, List<StatusLabel>> getAllLabelsGrouped();
    
    /**
     * 根据分类获取状态标签
     */
    List<StatusLabel> getLabelsByCategory(String category);
    
    /**
     * 获取状态显示文本
     */
    String getStatusText(String category, String value);
    
    /**
     * 批量获取状态显示文本
     */
    Map<String, String> getBatchStatusText(Map<String, String> params);
}
