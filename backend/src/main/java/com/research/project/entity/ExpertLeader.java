package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 专家组长实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_expert_leader")
public class ExpertLeader extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目名称 */
    private String projectName;
    
    /** 组长专家ID */
    private Long expertId;
    
    /** 组长专家姓名 */
    private String expertName;
    
    /** 评审批次号 */
    private String batchNo;
    
    /** 得票数 */
    private Integer voteCount;
    
    /** 当选时间 */
    private LocalDateTime electedTime;
    
    /** 结论状态：pending-待上传 uploaded-已上传 */
    private String conclusionStatus;
    
    /** 结论内容 */
    private String conclusionContent;
    
    /** 结论文件URL */
    private String conclusionFileUrl;
    
    /** 结论上传时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime conclusionUploadTime;
    
}
