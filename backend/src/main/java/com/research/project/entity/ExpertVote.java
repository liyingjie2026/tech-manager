package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 专家投票实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_expert_vote")
public class ExpertVote extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目名称 */
    private String projectName;
    
    /** 投票专家ID */
    private Long voterExpertId;
    
    /** 投票专家姓名 */
    private String voterExpertName;
    
    /** 被投票专家ID（组长候选人） */
    private Long votedExpertId;
    
    /** 被投票专家姓名 */
    private String votedExpertName;
    
    /** 评审批次号 */
    private String batchNo;
    
    /** 投票时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime voteTime;
    
}
