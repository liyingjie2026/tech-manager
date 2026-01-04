package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 项目成员DTO - 与前端和数据库字段完全对应
 */
@Data
public class ProjectMemberDTO {
    
    private Long id;
    private Long projectId;
    
    private Integer sequence; // 序号
    private String name; // 姓名
    private String gender; // 性别
    private String birthDate; // 出生年月
    private String idType; // 证件类型
    private String idNumber; // 证件号
    private String nationality; // 民族
    private String workUnit; // 单位/职称
    private String responsibility; // 职责/职务
    private String department; // 所在部门
    private String degree; // 学位
    private String graduateSchool; // 毕业院校
    private String contactPhone; // 联系电话
    private String mobile; // 手机
    private String email; // 电子邮箱
    
    private Long userId;
    private String role; // 成员角色
    private Long institutionId;
    private String institutionName;
    private String workContent; // 工作内容（映射到responsibility）
    private Integer workMonths;
    private Integer sortOrder; // 排序（映射到sequence）
    
    private String title;
}
