package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 创建专家DTO
 */
@Data
public class ExpertCreateDTO {
    @NotBlank(message = "专家姓名不能为空")
    private String name;
    
    private String gender;
    private String idCard;
    private String phone;
    private String email;
    private String organization;
    private String title;
    private List<String> researchField;
    private String specialty;
    private String education;
    private String achievements;

    private String expertName;
    private String institution;
    private String expertise;
    private Double averageScore;
}
