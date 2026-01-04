package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/**
 * 角色权限保存DTO
 */
@Data
public class RolePermissionSaveDTO {
    @NotNull(message = "权限列表不能为空")
    private List<Long> permissionIds;
}
