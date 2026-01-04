package com.research.project.dto;

import lombok.Data;

/**
 * 字典项DTO（扁平列表用，用于下拉框等简单场景）
 */
@Data
public class DictionaryItemDTO {
    
    private Long id;
    
    /** 字典项标签（显示名称） */
    private String label;
    
    /** 字典项值 */
    private String value;
    
    /** 字典项编码 */
    private String code;
    
    /** 排序 */
    private Integer sort;
    
    /** 描述 */
    private String description;
}
