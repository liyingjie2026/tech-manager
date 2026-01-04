package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建机构DTO
 */
@Data
public class InstitutionCreateDTO {
    @NotBlank(message = "机构名称不能为空")
    private String name;
    
    @NotBlank(message = "机构类型不能为空")
    private String type;
    
    private String shortName;
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

    private String institutionName;

    private String institutionType;
}
