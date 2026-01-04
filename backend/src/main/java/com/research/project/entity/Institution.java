package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 机构实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("res_institution")
public class Institution extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 机构编码 */
    private String code;
    
    /** 机构名称 */
    private String name;
    
    /** 机构简称 */
    private String shortName;
    
    /** 机构类型：internal-内部机构 external-外部机构 */
    private String type;
    
    /** 统一社会信用代码 */
    private String creditCode;
    
    /** 法人代表 */
    private String legalPerson;
    
    /** 法人身份证号 */
    private String legalPersonIdCard;
    
    /** 法人手机号 */
    private String legalPersonPhone;
    
    /** 联系人 */
    private String contactPerson;
    
    /** 联系电话 */
    private String contactPhone;
    
    /** 联系邮箱 */
    private String contactEmail;
    
    /** 省份 */
    private String province;
    
    /** 城市 */
    private String city;
    
    /** 区县 */
    private String district;
    
    /** 详细地址 */
    private String address;
    
    /** 邮政编码 */
    private String postcode;
    
    /** 机构简介 */
    private String description;
    
    /** 营业执照 */
    private String businessLicense;
    
    /** 资质证书 */
    private String qualification;
    
    /** 研究领域 */
    private String researchField;
    
    /** 审核状态：pending-待审核 approved-已通过 rejected-已驳回 */
    private String auditStatus;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
    
}
