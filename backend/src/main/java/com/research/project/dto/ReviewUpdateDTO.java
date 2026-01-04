package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 更新评审DTO
 */
@Data
public class ReviewUpdateDTO {
    private String reviewDate;
    private String reviewRequirement;
    private List<Long> expertIds;
    private String reviewType;
    
    public String getReviewType() {
        return reviewType;
    }
}
