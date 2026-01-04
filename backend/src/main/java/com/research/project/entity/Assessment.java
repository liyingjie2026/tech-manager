package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_assessment")
public class Assessment extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String year;
    private String quarter;
    private Long institutionId;
    private String institutionName;
    private Integer projectCount;
    private Double completionRate;
    private Double score;
    private String rank;
    private String status;
    private Long evaluatorId;
    private String evaluatorName;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime evaluateTime;
    private String remark;
    
}
