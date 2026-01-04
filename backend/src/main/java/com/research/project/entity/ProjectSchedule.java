package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

/**
 * 项目进度计划实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_project_schedule")
public class ProjectSchedule extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;
    private String taskNo;
    private String taskName;
    private String taskType;
    private String description;
    private String responsibleUnit;
    private String responsiblePerson;
    private LocalDate startDate;
    private LocalDate endDate;
    private String milestone;
    private Integer sortOrder;
}
