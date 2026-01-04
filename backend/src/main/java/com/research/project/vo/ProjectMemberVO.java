package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 项目成员VO
 */
@Data
public class ProjectMemberVO {
    
    private Long id;
    
    private Long projectId;
    
    private Long userId;
    
    private String name;
    
    private String gender;
    
    private String idCard;
    
    private String phone;
    
    private String email;
    
    private String workUnit;
    
    private String department;
    
    private String title;
    
    private String education;
    
    private String major;
    
    private String role;
    
    private String roleText;
    
    private String responsibility;
    
    private BigDecimal workMonths;
    
    private Integer sort;
}
