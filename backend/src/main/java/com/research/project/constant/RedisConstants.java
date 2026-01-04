package com.research.project.constant;

public class RedisConstants {
    // Redis Key前缀
    public static final String LOGIN_USER_KEY = "login:user:";
    public static final String USER_PERMISSION_KEY = "user:permission:";
    public static final String USER_ROLE_KEY = "user:role:";
    
    // Token有效期（秒）
    public static final long LOGIN_USER_TTL = 86400L; // 24小时
}
