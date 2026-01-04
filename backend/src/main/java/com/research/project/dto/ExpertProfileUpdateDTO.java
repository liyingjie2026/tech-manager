package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 更新专家个人信息DTO
 */
@Data
public class ExpertProfileUpdateDTO {
    private String phone;
    private String email;
    private String organization;
    private String title;
    private List<String> researchField;
    private String specialty;
    private String achievements;
}
