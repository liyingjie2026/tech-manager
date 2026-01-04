package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 用户权限DTO
 */
@Data
public class UserPermissionsDTO {
    private List<String> pages;
    private List<String> buttons;
    private List<String> roles;
}
