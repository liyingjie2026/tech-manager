package com.research.project.dto;

import lombok.Data;

/**
 * 更新用户DTO
 */
@Data
public class UserUpdateDTO {
    private String realName;
    private String phone;
    private String email;
    private Long institutionId;
    private Long roleId;
}
