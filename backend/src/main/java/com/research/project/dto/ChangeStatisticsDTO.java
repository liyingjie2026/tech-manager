package com.research.project.dto;

import lombok.Data;

@Data
public class ChangeStatisticsDTO {
    private Long total;
    private Long pending;
    private Long approved;
    private Long rejected;
    private Long draft;
    private Long submitted;
}
