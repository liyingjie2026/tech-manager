# 数据库初始化指南

## SQL文件说明

系统提供**2个SQL文件**，按顺序执行即可完成数据库初始化：

### 1. scripts/01_create_tables.sql
**建表脚本 - 创建39个数据表**

包含所有系统表结构定义：
- 系统管理表（7个）：sys_user, sys_role, sys_permission等
- 项目管理表（20个）：prj_project, prj_task_book等
- 资源管理表（8个）：res_institution, res_expert等
- 其他业务表（4个）：工作流、文件管理等

### 2. scripts/02_complete_sample_data.sql
**完整样例数据脚本**

包含所有测试数据：
- 基础数据：用户、角色、机构、专家、字典
- 项目数据：10个完整项目（申报→评审→任务书→执行→验收）
- 业务数据：评审记录、中期年度检查、变更验收
- 补充数据：成果转化、考核材料、查重结果、需求揭榜、奖项

### 3. scripts/03_status_labels.sql
**状态标签数据**

包含200+条状态标签定义：
- 24个业务分类
- 支持中英文状态映射
- 前端统一调用，无需硬编码

## 执行顺序

```bash
# 1. 创建数据库
CREATE DATABASE IF NOT EXISTS research_project DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE research_project;

# 2. 执行建表脚本（39个表）
SOURCE scripts/01_create_tables.sql;

# 3. 执行样例数据脚本（200+条数据）
SOURCE scripts/02_complete_sample_data.sql;

# 4. 执行状态标签脚本（200+条标签）
SOURCE scripts/03_status_labels.sql;
```

## 验证数据

```sql
-- 检查表数量（应该是39个）
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'research_project';

-- 检查用户数据（应该有10个用户）
SELECT COUNT(*) FROM sys_user;

-- 检查项目数据（应该有10个项目）
SELECT COUNT(*) FROM prj_project;

-- 检查状态标签（应该有200+条）
SELECT COUNT(*) FROM sys_status_label;
```

## 重要说明

1. **唯一版本**：scripts/目录下的SQL文件是唯一官方版本
2. **顺序执行**：必须按照01→02→03的顺序执行
3. **字符集**：数据库必须使用utf8mb4编码
4. **测试数据**：02脚本包含完整的测试数据，可直接用于开发测试
5. **状态系统**：03脚本提供统一的状态标签管理，前端通过API获取

## 测试账号

执行完成后可使用以下账号登录测试：

| 用户类型 | 用户名 | 密码 | 说明 |
|---------|--------|------|------|
| 监管端 | admin | 123456 | 系统管理员 |
| 科研端 | researcher1 | 123456 | 科研人员 |
| 专家端 | expert1 | 123456 | 评审专家 |

执行完成后，系统将拥有完整的数据库结构和测试数据，可直接启动应用进行测试。
