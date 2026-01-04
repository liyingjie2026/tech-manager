package com.research.project.dto;

import lombok.Data;

/**
 * 更新成果DTO
 */
@Data
public class AchievementUpdateDTO {
    private String achievementName;
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
