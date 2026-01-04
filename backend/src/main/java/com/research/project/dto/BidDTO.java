package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 揭榜DTO
 */
@Data
public class BidDTO {
    private Long id;
    private Long demandId;
    private Long institutionId;
    private String institutionName;
    private String proposal;
    private BigDecimal quotedPrice;
    private Integer duration;
    private String teamIntroduction;
    private String status;
    private Boolean isSelected;
    private LocalDateTime bidAt;
}
