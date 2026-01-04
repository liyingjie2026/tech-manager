package com.research.project.dto;

import lombok.Data;

/**
 * 更新奖励DTO
 */
@Data
public class AwardUpdateDTO {
    private String awardName;
    private String awardType;
    private String awardLevel;
    private String awardDate;
    private String awardUnit;
    private String awardees;
    private String description;
    private String attachments;
}
