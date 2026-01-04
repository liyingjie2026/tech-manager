package com.research.project.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户视图对象
 */
@Data
public class UserVO {
    
    private Long id;
    
    private String username;
    
    private String realName;
    
    private String phone;
    
    private String email;
    
    private Long institutionId;
    
    private String institutionName;
    
    private String department;
    
    private String position;
    
    private String title;
    
    private String education;
    
    private String major;
    
    private String avatar;
    
    private List<RoleVO> roles;
    
    private List<String> permissions;
    
    private Integer status;
    
    private String statusText;
    
    private LocalDateTime lastLoginTime;
    
    private LocalDateTime createTime;

    /** 专家ID */
    private Long expertId;

    /** 专家姓名 */
    private String expertName;
}
