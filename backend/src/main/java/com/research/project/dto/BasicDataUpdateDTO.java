package com.research.project.dto;

import lombok.Data;

/**
 * 更新基础数据DTO
 */
@Data
public class BasicDataUpdateDTO {
    private String dataName;
    private String dataType;
    private String dataSource;
    private String dataDesc;
}
