package com.research.project.vo;

import lombok.Data;
import java.util.List;

/**
 * 树形结构VO
 */
@Data
public class TreeVO {
    
    private Long id;
    
    private String label;
    
    private String value;
    
    private Long parentId;
    
    private List<TreeVO> children;
    
    private Boolean disabled;
    
    private Boolean isLeaf;
    
    private Object data;
}
