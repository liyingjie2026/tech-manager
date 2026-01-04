package com.research.project.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码加密工具类
 * 用于生成和验证 BCrypt 密码
 */
public class PasswordEncryptUtil {
    
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    
    /**
     * 生成 BCrypt 加密密码
     */
    public static String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }
    
    /**
     * 验证密码是否匹配
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
    
    /**
     * 主方法：用于生成密码哈希
     * 运行此方法可以生成密码的 BCrypt 哈希值
     */
    public static void main(String[] args) {
        String password = "admin123";
        String encoded = encode(password);
        System.out.println("原始密码: " + password);
        System.out.println("BCrypt哈希: " + encoded);
        System.out.println("验证结果: " + matches(password, encoded));
        
        // 测试你提供的哈希值
        String existingHash = "$2b$10$N9qo8uLOickgx2ZMRZoMye.IizVVz9OQ.W0Yqg8.e8K0o7zEqKhBK";
        System.out.println("\n测试现有哈希:");
        System.out.println("哈希值: " + existingHash);
        System.out.println("密码 'admin123' 验证结果: " + matches("admin123", existingHash));
    }
}
