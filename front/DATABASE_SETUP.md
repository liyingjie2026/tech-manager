# 数据库设置指南

## 数据库结构说明

本系统使用 MySQL 8.0+ 数据库，包含以下模块：

### 1. 用户权限模块
- `sys_user` - 用户表
- `sys_role` - 角色表
- `sys_user_role` - 用户角色关联表
- `sys_permission` - 权限表
- `sys_role_permission` - 角色权限关联表
- `sys_organization` - 机构表

### 2. 需求管理模块
- `demand` - 需求表

### 3. 项目管理模块
- `project` - 项目表
- `project_member` - 项目成员表
- `project_task_book` - 项目任务书表
- `project_task_split` - 项目任务拆分表
- `project_change` - 项目变更表
- `project_midterm_check` - 中期检查表
- `project_midterm_attachment` - 中期检查附件表
- `project_annual_check` - 年度检查表
- `project_annual_attachment` - 年度检查附件表
- `project_acceptance` - 项目验收表

### 4. 专家管理模块
- `expert` - 专家表
- `expert_review_record` - 专家评审记录表

### 5. 成果管理模块
- `achievement` - 成果表

### 6. 系统模块
- `sys_dict` - 字典表
- `sys_file` - 文件表
- `sys_log` - 操作日志表
- `sys_notification` - 通知表

## 快速设置步骤

### 方法一：使用 MySQL 客户端

1. **创建数据库**
```bash
mysql -u root -p < scripts/01-create-database.sql
```

2. **创建表结构**
```bash
mysql -u root -p research_project_db < backend/database/001_create_tables.sql
```

3. **初始化数据**
```bash
mysql -u root -p research_project_db < backend/database/002_init_data.sql
```

4. **导入样例数据（可选）**
```bash
mysql -u root -p research_project_db < backend/database/003_sample_data.sql
```

### 方法二：使用 MySQL Workbench

1. 打开 MySQL Workbench
2. 连接到你的 MySQL 服务器
3. 依次执行以下 SQL 文件：
   - `scripts/01-create-database.sql`
   - `backend/database/001_create_tables.sql`
   - `backend/database/002_init_data.sql`
   - `backend/database/003_sample_data.sql`（可选）

### 方法三：从 Spring Boot 应用启动

配置 `application.yml` 中的数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/research_project_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
  
  # 启用 SQL 脚本自动执行（仅首次运行）
  sql:
    init:
      mode: always
      schema-locations: classpath:database/001_create_tables.sql
      data-locations: classpath:database/002_init_data.sql,classpath:database/003_sample_data.sql
```

## 默认账号信息

### 管理员账号
- 用户名：`admin`
- 密码：`admin123`
- 角色：超级管理员

### 监管员账号
- 用户名：`supervisor`
- 密码：`admin123`
- 角色：监测监管管理员

### 科研机构账号
- 用户名：`huge`（胡歌）
- 密码：`admin123`
- 角色：科研机构用户

### 专家账号
- 用户名：`expert_zhang`、`expert_liu`、`expert_chen`
- 密码：`admin123`
- 角色：评审专家

## 数据库配置

### MySQL 配置要求

```ini
[mysqld]
# 字符集配置
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# 性能优化
max_connections=500
innodb_buffer_pool_size=1G
innodb_log_file_size=256M

# 时区设置
default-time-zone='+08:00'
```

### 创建数据库用户（生产环境）

```sql
-- 创建专用数据库用户
CREATE USER 'research_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 授予权限
GRANT ALL PRIVILEGES ON research_project_db.* TO 'research_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

## 验证安装

执行以下 SQL 查询验证数据库是否正确创建：

```sql
USE research_project_db;

-- 检查表数量
SELECT COUNT(*) AS table_count 
FROM information_schema.tables 
WHERE table_schema = 'research_project_db';

-- 检查用户数量
SELECT COUNT(*) AS user_count FROM sys_user;

-- 检查角色数量
SELECT COUNT(*) AS role_count FROM sys_role;

-- 检查机构数量
SELECT COUNT(*) AS org_count FROM sys_organization;
```

期望结果：
- 表数量：30+ 张表
- 用户数量：3+ 个用户
- 角色数量：5 个角色
- 机构数量：2+ 个机构

## 常见问题

### 1. 字符集问题

如果遇到中文乱码，确保：
- MySQL 服务器字符集为 utf8mb4
- 数据库字符集为 utf8mb4
- 连接字符串包含 `characterEncoding=utf8`

### 2. 权限问题

如果提示权限不足：
```sql
GRANT ALL PRIVILEGES ON research_project_db.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 表已存在

如果需要重新创建数据库：
```sql
DROP DATABASE IF EXISTS research_project_db;
CREATE DATABASE research_project_db 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

## 数据备份

### 备份整个数据库
```bash
mysqldump -u root -p research_project_db > backup_$(date +%Y%m%d).sql
```

### 恢复数据库
```bash
mysql -u root -p research_project_db < backup_20250101.sql
```

## 联系支持

如果在设置数据库时遇到问题，请检查：
1. MySQL 版本是否为 8.0+
2. 数据库连接配置是否正确
3. SQL 文件路径是否正确
4. 是否有足够的数据库权限
