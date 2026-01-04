package com.research.project.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码测试工具
 * 用于测试BCrypt密码加密和验证
 */
public class PasswordTestUtil {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // 测试密码
        String plainPassword = "admin123";
        
        // 数据库中存储的密码哈希
        String dbHash = "$2a$10$2r9d08dRljECt5ZuLzT5qe7irXXa0AUNHoms7EDDBB5HL16ZB9zRG";
        
        System.out.println("=== BCrypt 密码测试 ===");
        System.out.println("明文密码: " + plainPassword);
        System.out.println("数据库哈希: " + dbHash);
        
        // 测试密码是否匹配
        boolean matches = encoder.matches(plainPassword, dbHash);
        System.out.println("密码匹配结果: " + matches);
        
        // 生成新的哈希（用于对比）
        String newHash = encoder.encode(plainPassword);
        System.out.println("\n新生成的哈希: " + newHash);
        System.out.println("新哈希验证: " + encoder.matches(plainPassword, newHash));
        
        // 注意事项说明
        System.out.println("\n=== 重要说明 ===");
        System.out.println("1. BCrypt每次生成的哈希都不同，这是正常的");
        System.out.println("2. Java的BCryptPasswordEncoder可以验证 $2a$, $2b$, $2y$ 开头的哈希");
        System.out.println("3. 如果验证失败，检查：");
        System.out.println("   - 数据库中的密码字段是否完整（60字符）");
        System.out.println("   - 密码是否被截断");
        System.out.println("   - 数据库字段长度是否足够（建议VARCHAR(100)）");
    }
}
