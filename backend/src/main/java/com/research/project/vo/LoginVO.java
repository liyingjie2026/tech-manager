package com.research.project.vo;

import lombok.Data;
import java.util.List;

/**
 * 登录响应VO
 */
@Data
public class LoginVO {
    
    private String token;
    
    private Long expiresIn;
    
    private UserVO user;
    
    private List<String> permissions;
}
