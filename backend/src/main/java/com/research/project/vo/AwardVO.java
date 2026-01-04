package com.research.project.vo;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 获奖视图对象
 */
@Data
public class AwardVO {
    
    private Long id;
    
    private Long projectId;
    
    private String projectNo;
    
    private String projectName;
    
    private Long achievementId;
    
    private String achievementName;
    
    private String awardName;
    
    private String awardType;
    
    private String awardTypeText;
    
    private String awardLevel;
    
    private String awardLevelText;
    
    private String awardGrade;
    
    private String awardGradeText;
    
    private String awardingBody;
    
    private LocalDate awardDate;
    
    private String certificateNo;
    
    private String winners;
    
    private String description;
    
    private List<FileVO> attachments;
    
    private String status;
    
    private String statusText;
    
    private LocalDateTime createTime;
}
