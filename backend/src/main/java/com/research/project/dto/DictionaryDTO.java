package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * 字典DTO（完整信息，支持树形结构）
 */
@Data
public class DictionaryDTO {
    
    private Long id;
    
    /** 父级ID，0表示根节点 */
    private Long parentId;
    
    /** 字典类型编码（用于分组） */
    @NotBlank(message = "字典类型不能为空")
    private String dictType;
    
    /** 字典类型名称 */
    private String dictName;
    
    /** 字典项编码 */
    private String itemCode;
    
    /** 字典项标签（显示名称） */
    @NotBlank(message = "字典项标签不能为空")
    private String itemLabel;
    
    /** 字典项值 */
    private String itemValue;
    
    /** 层级：1-字典类型 2-一级项 3-二级项... */
    private Integer level;
    
    /** 描述 */
    private String description;
    
    /** 排序 */
    private Integer sort;
    
    /** 是否启用：0-禁用 1-启用 */
    private Boolean enabled;
    
    /** 子节点列表（树形结构） */
    private List<DictionaryDTO> children;
    
    // 兼容性别名方法
    public String getName() {
        return itemLabel;
    }
    
    public void setName(String name) {
        this.itemLabel = name;
    }
    
    public String getCode() {
        return itemCode;
    }
    
    public void setCode(String code) {
        this.itemCode = code;
    }
    
    public String getType() {
        return dictType;
    }
    
    public void setType(String type) {
        this.dictType = type;
    }
    
    public String getValue() {
        return itemValue;
    }
    
    public void setValue(String value) {
        this.itemValue = value;
    }
}
