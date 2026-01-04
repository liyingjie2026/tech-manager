package com.research.project.dto;

import lombok.Data;

/**
 * 按钮权限DTO
 */
@Data
public class ButtonPermissionDTO {
    private Long id;
    private Long pageId;
    private String name;
    private String code;
    private String action;
    private Integer sort;
    private Boolean enabled;
}
