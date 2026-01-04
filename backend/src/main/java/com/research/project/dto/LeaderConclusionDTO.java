package com.research.project.dto;

import lombok.Data;

/**
 * 组长结论DTO
 */
@Data
public class LeaderConclusionDTO {
    
    /** 项目ID */
    private Long projectId;
    
    /** 结论内容 */
    private String conclusionContent;
    
    /** 结论文件URL */
    private String conclusionFileUrl;
}
