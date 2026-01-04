package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 基础数据实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_basic_data")
public class BasicData extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 数据编号 */
    private String dataNo;
    
    /** 数据名称 */
    private String name;
    
    /** 数据类型 */
    private String type;
    
    /** 数据领域 */
    private String field;
    
    /** 数据描述 */
    private String description;
    
    /** 数据来源 */
    private String source;
    
    /** 数据格式 */
    private String format;
    
    /** 数据大小 */
    private String size;
    
    /** 存储路径 */
    private String filePath;
    
    /** 所属单位 */
    private Long institutionId;
    
    /** 是否共享：0-否 1-是 */
    private Integer isShared;
    
    /** 下载次数 */
    private Integer downloadCount;
    
}
