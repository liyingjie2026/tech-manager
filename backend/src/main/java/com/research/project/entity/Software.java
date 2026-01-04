package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 专业软件实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_software")
public class Software extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 软件编号 */
    private String softwareNo;
    
    /** 软件名称 */
    private String name;
    
    /** 软件版本 */
    private String version;
    
    /** 软件类型 */
    private String type;
    
    /** 开发商 */
    private String developer;
    
    /** 授权方式 */
    private String licenseType;
    
    /** 授权数量 */
    private Integer licenseCount;
    
    /** 已使用授权数 */
    private Integer usedLicenseCount;
    
    /** 所属单位 */
    private Long institutionId;
    
    /** 管理员 */
    private String administrator;
    
    /** 联系方式 */
    private String contact;
    
    /** 描述 */
    private String description;
    
    /** 是否共享：0-否 1-是 */
    private Integer isShared;
}
