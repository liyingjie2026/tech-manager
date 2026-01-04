package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 科研仪器实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_equipment")
public class Equipment extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 仪器编号 */
    private String equipmentNo;
    
    /** 仪器名称 */
    private String name;
    
    /** 型号 */
    private String model;
    
    /** 制造商 */
    private String manufacturer;
    
    /** 所属单位 */
    private Long institutionId;
    
    /** 管理员 */
    private String administrator;
    
    /** 联系方式 */
    private String contact;
    
    /** 位置 */
    private String location;
    
    /** 状态：available-可用 borrowed-已借出 maintenance-维护中 scrapped-已报废 */
    private String status;
    
    /** 购置日期 */
    private String purchaseDate;
    
    /** 购置价格 */
    private String price;
    
    /** 描述 */
    private String description;
    
    /** 是否共享：0-否 1-是 */
    private Integer isShared;
    
}
