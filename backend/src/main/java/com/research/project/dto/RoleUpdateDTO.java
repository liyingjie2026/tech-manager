package com.research.project.dto;

import lombok.Data;

/**
 * 更新角色DTO
 */
@Data
public class RoleUpdateDTO {
    private String roleName;
    private String description;
    private String roleCode;
}
