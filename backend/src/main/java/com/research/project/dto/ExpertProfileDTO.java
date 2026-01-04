package com.research.project.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * 专家个人信息DTO
 */
@Data
public class ExpertProfileDTO {
    private Long id;
    private String name;
    private String gender;
    private LocalDate birthday;
    private String idCard;
    private String phone;
    private String email;
    private String organization;
    private String title;
    private String specialty;
    private String education;
    private String degree;
    private String major;
    private List<String> researchField;
    private String achievements;
    private List<String> certificates;
    private String bankName;
    private String bankAccount;
    private String status;
}
