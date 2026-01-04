package com.research.project.dto;

import lombok.Data;

/**
 * 查重检测请求DTO
 */
@Data
public class DuplicateCheckDTO {
    private Long projectId;
    private Long checkBy;
}
