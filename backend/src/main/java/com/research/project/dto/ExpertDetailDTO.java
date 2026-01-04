package com.research.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 专家详情DTO
 */
@Data
public class ExpertDetailDTO {
    private Long id;
    private Long userId;
    private String expertCode;
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
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Long createBy;
    private Long updateBy;

    private String institution;
    private Double averageScore;
    private LocalDateTime createdAt;
}
