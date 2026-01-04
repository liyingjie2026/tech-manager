# 数据库脚本说明

## 文件列表

### 01_create_tables.sql
**用途**：创建所有数据库表结构
**说明**：包含37张表的完整CREATE TABLE语句，所有字段类型已统一修正：
- create_by和update_by统一使用BIGINT类型
- 所有实体继承自BaseEntity的5个字段（id, create_time, update_time, create_by, update_by, deleted）在数据库中都有对应的列
- prj_project表已添加innovation_points和application_prospects字段
- prj_task_book表的start_date和end_date已改为DATE类型
- prj_duplicate_check_result、sys_todo_item、sys_role_permission、prj_workflow_history表已补全缺失的BaseEntity字段

### 02_complete_sample_data.sql  
**用途**：插入完整的测试数据
**说明**：包含所有表的样例数据，create_by和update_by使用数字ID（1、2等）而非字符串

## 使用方法

1. 先执行 `01_create_tables.sql` 创建表结构
2. 再执行 `02_complete_sample_data.sql` 插入测试数据

## 数据库兼容性
- MySQL 5.7+
- MariaDB 10.2+
