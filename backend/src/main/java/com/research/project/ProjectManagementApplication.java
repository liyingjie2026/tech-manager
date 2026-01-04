package com.research.project;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 科研项目管理系统主启动类
 */
@SpringBootApplication
@MapperScan("com.research.project.mapper")
public class ProjectManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectManagementApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("科研项目管理系统启动成功！");
        System.out.println("接口文档地址: http://localhost:8080/api/doc.html");
        System.out.println("========================================\n");
    }
}
