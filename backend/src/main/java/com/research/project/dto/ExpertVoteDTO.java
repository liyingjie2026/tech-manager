package com.research.project.dto;

import lombok.Data;

/**
 * 专家投票DTO
 */
@Data
public class ExpertVoteDTO {
    
    /** 项目ID */
    private Long projectId;
    
    /** 被投票专家ID（组长候选人） */
    private Long votedExpertId;
}
