package com.research.project.dto;

import lombok.Data;

/**
 * 更新机构DTO
 */
@Data
public class InstitutionUpdateDTO {
    private String name;
    
    private String type;
    
    private String legalPerson;
    private String contactPerson;
    private String contactPhone;
    
    private String contactEmail;
    
    private String address;
    private String qualification;
    private String description;
}
