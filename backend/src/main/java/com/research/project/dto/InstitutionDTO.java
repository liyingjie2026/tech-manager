package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * 机构数据传输对象
 */
@Data
public class InstitutionDTO {
    
    private Long id;
    
    private String code;
    
    @NotBlank(message = "机构名称不能为空")
    private String name;
    
    private String shortName;
    
    private String type;
    
    
    /** 统一社会信用代码 */
    private String creditCode;
    
    private String legalPerson;
    
    private String legalPersonIdCard;
    
    private String legalPersonPhone;
    
    private String contactPerson;
    
    private String contactPhone;
    
    private String contactEmail;
    
    private String province;
    
    private String city;
    
    private String district;
    
    private String address;
    
    private String postcode;
    
    private String description;
    
    private String businessLicense;
    
    private String qualification;
    
    private String researchField;
    
    private String auditStatus;
    
    private String auditComment;
    
    private LocalDateTime auditTime;
    
    private String auditBy;
    
    private Integer status;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
    
    private Long createBy;
    
    private Long updateBy;
    
}
