package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 项目附件实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_project_attachment")
public class ProjectAttachment extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String fileType;
    private String attachmentType;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime uploadTime;
    private Long uploadBy;
}
