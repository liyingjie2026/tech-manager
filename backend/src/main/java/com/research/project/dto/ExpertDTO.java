package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

/**
 * 专家数据传输对象
 */
@Data
public class ExpertDTO {
    
    private Long id;
    private Long userId;
    private String expertCode;
    
    @NotBlank(message = "专家姓名不能为空")
    private String name;
    
    private Integer gender;
    private String birthDate;
    private String idCard;
    private String phone;
    private String email;
    
    private String organization;
    private String department;
    private String position;
    private String title;
    private String education;
    private String degree;
    private String graduateSchool;
    private String major;
    
    private String researchField;
    private String expertType;
    
    private String specialty;
    private String introduction;
    private String achievements;
    private String bankName;
    private String bankAccount;
    private Integer reviewCount;
    private Double goodRate;
    private Integer available;
    private String auditStatus;
    private String auditComment;
    private Integer status;

    private String researchDirection;

    private String workUnit;

    private String expertise;
}
