package com.research.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户数据传输对象
 */
@Data
public class UserDTO {
    
    private Long id;
    
    /** 用户名 */
    private String username;
    
    /** 密码（仅创建时使用，查询时不返回） */
    private String password;

    /** 真实姓名 */
    private String realName;
    
    /** 手机号 */
    private String phone;
    
    /** 邮箱 */
    private String email;
    
    /** 身份证号 */
    private String idCard;
    
    /** 性别：0-未知 1-男 2-女 */
    private String gender;
    
    /** 用户类型：admin-管理员 supervisor-监管端 researcher-科研端 expert-专家 */
    private String userType;
    
    /** 所属机构ID */
    private Long institutionId;
    
    /** 所属机构名称 */
    private String institutionName;
    
    /** 部门 */
    private String department;
    
    /** 职称 */
    private String title;

    /** 角色ID */
    private Long roleId;

    /** 角色名称 */
    private String roleName;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
    
    /** 最后登录时间 */
    private LocalDateTime lastLoginTime;
    
    /** 创建时间 */
    private LocalDateTime createTime;
    
    /** 更新时间 */
    private LocalDateTime updateTime;
    
    /** 创建人 */
    private Long createBy;
    
    /** 更新人 */
    private Long updateBy;
}
