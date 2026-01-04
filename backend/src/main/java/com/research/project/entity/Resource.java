package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 共享资源实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("res_resource")
public class Resource extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 资源编号 */
    private String resourceNo;
    
    /** 资源名称 */
    private String name;
    
    /** 资源类型：instrument-科研仪器 data-基础数据 software-专业软件 */
    private String type;
    
    /** 所属领域 */
    private String field;
    
    /** 学科领域 */
    private String discipline;
    
    /** 仪器类别（仪器专用） */
    private String instrumentType;
    
    /** 软件类型（软件专用） */
    private String softwareType;
    
    /** 规格型号 */
    private String specification;
    
    /** 生产厂家 */
    private String manufacturer;
    
    /** 购置日期 */
    private String purchaseDate;
    
    /** 原值（万元） */
    private BigDecimal originalValue;
    
    /** 所属单位ID */
    private Long institutionId;
    
    /** 所属单位名称 */
    private String institutionName;
    
    /** 存放地点 */
    private String location;
    
    /** 管理人员 */
    private String manager;
    
    /** 联系电话 */
    private String contactPhone;
    
    /** 资源简介 */
    private String description;
    
    /** 使用说明 */
    private String instructions;
    
    /** 图片 */
    private String images;
    
    /** 附件 */
    private String attachments;
    
    /** 是否共享：0-否 1-是 */
    private Integer isShared;
    
    /** 共享方式：free-免费 paid-收费 */
    private String shareMethod;
    
    /** 收费标准 */
    private String chargeStandard;
    
    /** 借用次数 */
    private Integer borrowCount;
    
    /** 当前状态：available-可用 using-使用中 maintenance-维护中 */
    private String currentStatus;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
    
    /** 审核状态：pending-待审核 approved-已通过 rejected-已驳回 */
    private String auditStatus;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    // Fields inherited from BaseEntity: createTime, updateTime, createBy, updateBy, deleted
}
