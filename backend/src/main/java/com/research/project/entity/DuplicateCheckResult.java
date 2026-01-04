package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 查重结果实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_duplicate_check_result")
public class DuplicateCheckResult extends BaseEntity implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;
    private BigDecimal duplicateRate;
    private String similarProjects;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime checkTime;
    private Long checkBy;

}
