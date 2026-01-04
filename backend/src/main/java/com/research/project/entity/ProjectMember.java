package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 项目成员实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_project_member")
public class ProjectMember extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;
    
    private Integer sequence;
    private Long userId;
    private String name;
    private String gender;
    private String birthDate;
    private String idType;
    private String idNumber;
    private String nationality;
    private String workUnit;
    private String responsibility;
    private String department;
    private String degree;
    private String graduateSchool;
    private String contactPhone;
    private String mobile;
    private String email;
    private String role;
    private Long institutionId;
    private String institutionName;
    private String workContent;
    private Integer workMonths;
    private Integer sortOrder;
}
