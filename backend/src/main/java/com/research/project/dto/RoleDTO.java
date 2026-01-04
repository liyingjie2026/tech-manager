package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * 角色数据传输对象
 */
@Data
public class RoleDTO {
    
    private Long id;
    
    @NotBlank(message = "角色编码不能为空")
    private String roleCode;
    
    @NotBlank(message = "角色名称不能为空")
    private String roleName;
    
    private String description;
    
    private List<Long> permissionIds;
    
    private List<Long> menuIds;
    
    private Integer sort;
    
    private Integer status;
}
