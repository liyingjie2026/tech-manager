package com.research.project.vo;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 专家视图对象
 */
@Data
public class ExpertVO {
    
    private Long id;
    
    private Long userId;
    
    private String name;
    
    private String gender;
    
    private LocalDate birthDate;
    
    private Integer age;
    
    private String phone;
    
    private String email;
    
    private String education;
    
    private String educationText;
    
    private String degree;
    
    private String title;
    
    private String titleText;
    
    private String major;
    
    private String researchDirection;
    
    private String workUnit;
    
    private String department;
    
    private String position;
    
    private Integer workYears;
    
    private String expertise;
    
    private String achievements;
    
    private String photo;
    
    private Integer reviewCount;
    
    private Double avgScore;
    
    private Integer status;
    
    private String statusText;
    
    private LocalDateTime createTime;
}
