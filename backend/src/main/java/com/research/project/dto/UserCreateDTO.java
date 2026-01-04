package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建用户DTO
 */
@Data
public class UserCreateDTO {
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    private String password;
    
    @NotBlank(message = "姓名不能为空")
    private String realName;
    
    private String phone;
    private String email;
    private Long institutionId;
    private Long roleId;
}
