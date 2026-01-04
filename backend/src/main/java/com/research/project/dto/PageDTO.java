package com.research.project.dto;

import lombok.Data;

/**
 * 分页查询DTO
 */
@Data
public class PageDTO {
    
    private Integer pageNum = 1;
    
    private Integer pageSize = 10;
    
    private String orderBy;
    
    private String orderType = "asc";
}
