package com.research.project.vo;

import lombok.Data;

/**
 * 投票结果VO
 */
@Data
public class VoteResultVO {
    
    /** 专家ID */
    private Long expertId;
    
    /** 专家姓名 */
    private String expertName;
    
    /** 得票数 */
    private Integer voteCount;
    
    /** 是否当选组长 */
    private Boolean isLeader;

    private String expertTitle;
}
