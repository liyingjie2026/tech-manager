package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 更新专家DTO
 */
@Data
public class ExpertUpdateDTO {
    /** 专家姓名 */
    private String name;
    
    /** 性别 */
    private String gender;
    
    /** 身份证号 */
    private String idCard;
    
    /** 手机号 */
    private String phone;
    
    /** 邮箱 */
    private String email;
    
    /** 所属单位 */
    private String organization;
    
    /** 职称 */
    private String title;
    
    /** 研究领域（数组） */
    private List<String> researchField;
    
    /** 专业特长 */
    private String specialty;
    
    /** 学历 */
    private String education;
    
    /** 主要成果 */
    private String achievements;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
    
    /** 审核状态 */
    private String auditStatus;
    
    /** 评审次数 */
    private Integer reviewCount;
    
    /** 平均分数/好评率 */
    private Double goodRate;

    private Double averageScore;

    private String expertise;

    private String institution;

}
