package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建字典DTO
 */
@Data
public class DictionaryCreateDTO {
    private Long parentId;
    
    @NotBlank(message = "字典类型不能为空")
    private String dictType;
    
    @NotBlank(message = "字典编码不能为空")
    private String dictCode;
    
    @NotBlank(message = "字典名称不能为空")
    private String dictName;
    
    private String itemCode;
    
    private String itemLabel;
    
    private String itemValue;
    
    private Integer level;
    
    private String description;
    
    private Integer sort;
    
    private Integer sortOrder;
    
    private Boolean enabled;
    
    public String getName() {
        return dictName;
    }
    
    public String getCode() {
        return dictCode;
    }
    
    public String getType() {
        return dictType != null ? dictType : dictCode;
    }
}
