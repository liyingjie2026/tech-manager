package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 创建成果DTO
 */
@Data
public class AchievementCreateDTO {
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    @NotBlank(message = "成果名称不能为空")
    private String achievementName;
    
    @NotBlank(message = "成果类型不能为空")
    private String achievementType;
    
    private String achievementLevel;
    private String publisher;
    private String publishDate;
    private String achievementNo;
    private String authors;
    private String firstAuthor;
    private String correspondingAuthor;
    private String description;
    private String attachments;
}
