package com.research.project.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 字典视图对象
 */
@Data
public class DictionaryVO {
    
    private Long id;
    
    private String dictType;
    
    private String dictCode;
    
    private String dictName;
    
    private String dictValue;
    
    private Long parentId;
    
    private String parentName;
    
    private List<DictionaryVO> children;
    
    private Integer sort;
    
    private Integer status;
    
    private String statusText;
    
    private String description;
    
    private LocalDateTime createTime;
}
