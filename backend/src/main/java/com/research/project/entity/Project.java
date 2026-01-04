package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 项目实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_project")
public class Project extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String projectNo;
    private String name;
    private String projectBatch;
    private String innovationPlatform;
    private String projectType;
    private String projectCategory;
    private String researchField;
    private Long demandId;
    private Long institutionId;
    private String institutionName;
    private Long leaderId;
    private String leaderName;
    private String leaderPhone;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalBudget;
    private BigDecimal applyBudget;
    private BigDecimal selfBudget;
    private String objective;
    private String content;
    private String expectedResult;
    private String innovationPoints;
    private String applicationProspects;
    private String status;
    private String auditStatus;
    private String workflowStage;
    private String auditComment;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime auditTime;
    private Long auditBy;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime submitTime;
    private BigDecimal duplicateRate;
}
