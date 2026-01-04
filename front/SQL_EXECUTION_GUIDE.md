# SQL文件执行指南

## 执行顺序

请严格按照以下顺序执行SQL文件：

### 1. 清理数据库（可选，仅在重新初始化时）
```bash
mysql -u root -p research_system < scripts/00_cleanup.sql
```

### 2. 创建数据库表结构
```bash
mysql -u root -p research_system < scripts/01_create_tables.sql
```

### 3. 插入初始化样例数据
```bash
mysql -u root -p research_system < scripts/02_seed_data.sql
```

### 4. 创建测试用户（可选）
```bash
mysql -u root -p research_system < scripts/03_test_users.sql
```

## 常见问题

### 1. 主键冲突错误
如果遇到 "Duplicate entry for key PRIMARY" 错误：
- 执行 00_cleanup.sql 清理数据库
- 重新按顺序执行所有脚本

### 2. 字段不匹配错误
如果遇到 "Unknown column" 错误：
- 检查是否按顺序执行了01和02文件
- 确认01_create_tables.sql已成功执行

### 3. 外键约束错误
如果遇到外键约束错误：
- 确保按照正确的顺序执行脚本
- 检查02_seed_data.sql中的外键引用是否正确

## 验证

执行完所有脚本后，可以通过以下SQL验证：

```sql
-- 检查所有表是否创建成功
SHOW TABLES;

-- 检查每个表的记录数
SELECT 
  TABLE_NAME, 
  TABLE_ROWS 
FROM 
  information_schema.TABLES 
WHERE 
  TABLE_SCHEMA = 'research_system';
```

预期结果：应该有37个表，02_seed_data.sql会在大部分表中插入样例数据。
