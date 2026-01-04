package com.research.project.vo;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 成果视图对象
 */
@Data
public class AchievementVO {
    
    private Long id;
    
    private String achievementNo;
    
    private Long projectId;
    
    private String projectNo;
    
    private String projectName;
    
    private String name;
    
    private String type;
    
    private String typeText;
    
    private String category;
    
    private String categoryText;
    
    private String field;
    
    private String fieldText;
    
    private String description;
    
    private String authors;
    
    private String ownerUnit;
    
    private LocalDate completeDate;
    
    private String publicationInfo;
    
    private String patentNo;
    
    private String certificateNo;
    
    private String level;
    
    private String levelText;
    
    private String applicationStatus;
    
    private String applicationStatusText;
    
    private String transformationStatus;
    
    private String transformationStatusText;
    
    private String economicBenefit;
    
    private String socialBenefit;
    
    private List<FileVO> attachments;
    
    private Boolean isPublic;
    
    private Integer viewCount;
    
    private Integer downloadCount;
    
    private String status;
    
    private String statusText;
    
    private LocalDateTime createTime;
}
