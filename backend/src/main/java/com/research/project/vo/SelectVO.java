package com.research.project.vo;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * 下拉选项VO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SelectVO {
    
    private String label;
    
    private String value;
    
    private Boolean disabled;
    
    private Object extra;
    
    public SelectVO(String label, String value) {
        this.label = label;
        this.value = value;
        this.disabled = false;
    }
}
