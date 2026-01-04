package com.research.project.service.impl;

import com.research.project.entity.StatusLabel;
import com.research.project.mapper.StatusLabelMapper;
import com.research.project.service.StatusLabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 状态标签Service实现
 */
@Service
public class StatusLabelServiceImpl implements StatusLabelService {
    
    @Autowired
    private StatusLabelMapper statusLabelMapper;
    
    @Override
    @Cacheable(value = "statusLabels", key = "'all'")
    public Map<String, List<StatusLabel>> getAllLabelsGrouped() {
        List<StatusLabel> allLabels = statusLabelMapper.selectList(null);
        return allLabels.stream()
            .collect(Collectors.groupingBy(StatusLabel::getCategory));
    }
    
    @Override
    @Cacheable(value = "statusLabels", key = "#category")
    public List<StatusLabel> getLabelsByCategory(String category) {
        return statusLabelMapper.selectByCategory(category);
    }
    
    @Override
    @Cacheable(value = "statusLabels", key = "#category + '_' + #value")
    public String getStatusText(String category, String value) {
        if (value == null || value.trim().isEmpty()) {
            return "-";
        }
        
        StatusLabel label = statusLabelMapper.selectByCategoryAndValue(category, value);
        return label != null ? label.getLabel() : value;
    }
    
    @Override
    public Map<String, String> getBatchStatusText(Map<String, String> params) {
        Map<String, String> result = new HashMap<>();
        params.forEach((key, value) -> {
            String[] parts = key.split("_", 2);
            if (parts.length == 2) {
                result.put(key, getStatusText(parts[0], value));
            }
        });
        return result;
    }
}
