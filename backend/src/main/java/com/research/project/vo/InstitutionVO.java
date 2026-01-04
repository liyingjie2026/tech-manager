package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 机构视图对象
 */
@Data
public class InstitutionVO {
    
    private Long id;
    
    private String name;
    
    private String code;
    
    private String type;
    
    private String typeText;
    
    private String nature;
    
    private String natureText;
    
    private String legalPerson;
    
    private String legalPersonPhone;
    
    private String contactPerson;
    
    private String contactPhone;
    
    private String email;
    
    private String address;
    
    private String postalCode;
    
    private String bankName;
    
    private String bankAccount;
    
    private String taxNumber;
    
    private BigDecimal registeredCapital;
    
    private Integer employeeCount;
    
    private String researchFields;
    
    private String introduction;
    
    private Integer projectCount;
    
    private Integer achievementCount;
    
    private Integer status;
    
    private String statusText;
    
    private LocalDateTime createTime;
}
