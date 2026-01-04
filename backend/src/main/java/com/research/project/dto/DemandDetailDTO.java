package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 需求详情DTO
 */
@Data
public class DemandDetailDTO {
    private Long id;
    private String title;
    private String type;
    private String field;
    private String description;
    private String requirements;
    private BigDecimal budget;
    private LocalDateTime deadline;
    private String demandingInstitution;
    private String contactPerson;
    private String contactPhone;
    private String status;
    private List<AttachmentDTO> attachments;
    private List<BidDTO> bids;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
}
