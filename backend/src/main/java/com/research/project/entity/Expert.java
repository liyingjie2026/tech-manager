package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 专家实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("res_expert")
public class Expert extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 关联用户ID */
    private Long userId;
    
    /** 专家编号 */
    private String expertCode;
    
    /** 姓名 */
    private String name;
    
    /** 性别：1-男 2-女 */
    private Integer gender;
    
    /** 出生日期 */
    private String birthDate;
    
    /** 身份证号 */
    private String idCard;
    
    /** 手机号 */
    private String phone;
    
    /** 邮箱 */
    private String email;
    
    /** 所属单位 */
    private String organization;
    
    /** 部门 */
    private String department;
    
    /** 职务 */
    private String position;
    
    /** 职称 */
    private String title;
    
    /** 学历 */
    private String education;
    
    /** 学位 */
    private String degree;
    
    /** 毕业院校 */
    private String graduateSchool;
    
    /** 专业方向 */
    private String major;
    
    /** 研究领域 */
    private String researchField;
    
    /** 专家类型 */
    private String expertType;
    
    /** 专业特长 */
    private String specialty;
    
    /** 个人简介 */
    private String introduction;
    
    /** 主要成果 */
    private String achievements;
    
    /** 银行账户 */
    private String bankAccount;
    
    /** 开户行 */
    private String bankName;
    
    /** 评审次数 */
    private Integer reviewCount;
    
    /** 好评率 */
    private Double goodRate;
    
    /** 是否可用：0-不可用 1-可用 */
    private Integer available;
    
    /** 审核状态：pending-待审核 approved-已通过 rejected-已驳回 */
    private String auditStatus;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
    
}
