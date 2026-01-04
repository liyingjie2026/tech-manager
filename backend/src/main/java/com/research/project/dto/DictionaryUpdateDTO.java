package com.research.project.dto;

import lombok.Data;

/**
 * 更新字典DTO
 */
@Data
public class DictionaryUpdateDTO {
    private String dictName;
    
    private String itemLabel;
    
    private String itemValue;
    
    private String description;
    
    private Integer sort;
    
    private Integer sortOrder;
    
    private Boolean enabled;
    
    public String getName() {
        return dictName;
    }
}
