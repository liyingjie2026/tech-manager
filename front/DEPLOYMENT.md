# 科研项目管理系统 - 完整部署指南

## 系统架构

本系统采用前后端分离架构：
- **前端**: Next.js 16 + React 19 + TypeScript
- **后端**: Node.js + Express + MySQL
- **数据库**: MySQL 8.0

## 一、数据库部署

### 1.1 数据库信息
```
主机: 43.137.6.125
端口: 3306
用户名: root
密码: Mysql@12345
数据库名: kjxmcs
```

### 1.2 执行SQL脚本

按顺序执行以下脚本：

```bash
# 连接到MySQL服务器
mysql -h 43.137.6.125 -P 3306 -u root -p

# 进入MySQL后执行
USE kjxmcs;

# 执行建表脚本
source scripts/01-create-tables.sql

# 执行初始化数据脚本
source scripts/02-init-data.sql
```

或使用命令行直接执行：

```bash
mysql -h 43.137.6.125 -P 3306 -u root -pMysql@12345 kjxmcs < scripts/01-create-tables.sql
mysql -h 43.137.6.125 -P 3306 -u root -pMysql@12345 kjxmcs < scripts/02-init-data.sql
```

### 1.3 验证数据库

```sql
-- 查看所有表
SHOW TABLES;

-- 验证初始数据
SELECT * FROM sys_user;
SELECT * FROM sys_institution;
SELECT * FROM project LIMIT 5;
```

## 二、后端服务部署

### 2.1 安装依赖

```bash
cd scripts
npm install
```

### 2.2 环境配置

创建 `.env` 文件（scripts目录下）：

```env
# 数据库配置
DB_HOST=43.137.6.125
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Mysql@12345
DB_DATABASE=kjxmcs

# 服务器配置
PORT=8080
JWT_SECRET=your-secret-key-change-in-production

# CORS配置
CORS_ORIGIN=http://localhost:3000
```

### 2.3 启动后端服务

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

后端服务将运行在 `http://localhost:8080`

### 2.4 测试后端API

```bash
# 健康检查
curl http://localhost:8080/health

# 测试登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "leader", "password": "admin123", "userType": "institution"}'

# 测试项目列表
curl http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 三、前端部署

### 3.1 环境配置

在项目根目录创建 `.env.local` 文件：

```env
# API Base URL - 指向后端服务
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3.2 安装依赖

```bash
npm install
```

### 3.3 启动前端服务

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

前端服务将运行在 `http://localhost:3000`

## 四、测试流程

### 4.1 测试账号

系统预置了以下测试账号：

**科研端 - 项目负责人：**
- 用户名: `leader`
- 密码: `admin123`
- 权限: 项目申报、任务书上传、变更申请、检查提交等

**科研端 - 机构管理员：**
- 用户名: `manager`  
- 密码: `admin123`
- 权限: 审核、上报、用户管理

**监管端：**
- 用户名: `supervisor`
- 密码: `admin123`
- 权限: 全局监管、审批、统计分析

**专家端：**
- 用户名: `expert`
- 密码: `admin123`
- 权限: 评审、打分、投票

### 4.2 完整测试流程

#### 步骤1: 项目负责人申报项目

1. 访问 `http://localhost:3000`
2. 点击"科研机构端" - 进入登录
3. 使用 `leader / admin123` 登录
4. 左侧菜单选择"项目管理" → "项目申报"
5. 填写项目信息：
   - 基本信息（项目名称、类型、类别等）
   - 申报单位信息
   - 项目成员（至少添加项目负责人）
   - 研究内容和预算
6. 点击"提交申报"
7. 系统保存数据到MySQL数据库

#### 步骤2: 机构管理员审核

1. 退出登录
2. 使用 `manager / admin123` 登录
3. 左侧菜单选择"项目管理" → "项目一览"
4. 找到状态为"立项申请"的项目
5. 点击"审核"按钮
6. 填写审核意见，选择"通过"或"驳回"
7. 点击"提交审核"
8. 审核记录保存到数据库

#### 步骤3: 查看数据库变化

```sql
-- 查看新创建的项目
SELECT id, code, name, status, status_name, created_at 
FROM project 
ORDER BY created_at DESC 
LIMIT 5;

-- 查看审核记录
SELECT * FROM review_history 
WHERE business_type = 'project'
ORDER BY created_at DESC 
LIMIT 5;

-- 查看项目成员
SELECT pm.*, p.name as project_name
FROM project_member pm
JOIN project p ON pm.project_id = p.id
LIMIT 10;
```

## 五、故障排查

### 5.1 数据库连接失败

```bash
# 检查数据库连接
mysql -h 43.137.6.125 -P 3306 -u root -p

# 检查防火墙
telnet 43.137.6.125 3306

# 检查MySQL用户权限
GRANT ALL PRIVILEGES ON kjxmcs.* TO 'root'@'%' IDENTIFIED BY 'Mysql@12345';
FLUSH PRIVILEGES;
```

### 5.2 后端服务无法启动

```bash
# 查看错误日志
npm run dev

# 检查端口占用
lsof -i :8080
netstat -ano | findstr :8080

# 更换端口（修改.env中的PORT）
PORT=8081
```

### 5.3 前端无法连接后端

1. 检查 `.env.local` 中的 `NEXT_PUBLIC_API_BASE_URL`
2. 确认后端服务已启动
3. 检查浏览器控制台的网络请求
4. 查看后端服务日志

### 5.4 CORS跨域问题

在后端服务器中已配置CORS，如果仍有问题：

```typescript
// 修改 scripts/backend-server.ts
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}))
```

## 六、监控和日志

### 6.1 后端日志

后端服务会输出详细的请求日志：
```
[2025-01-10T10:30:00.000Z] POST /api/auth/login
[2025-01-10T10:30:01.000Z] GET /api/projects
```

### 6.2 前端日志

打开浏览器控制台查看前端日志：
```javascript
console.log("[v0] API Request:", ...)
console.log("[v0] Response:", ...)
```

### 6.3 数据库日志

```sql
-- 开启MySQL慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- 查看连接数
SHOW PROCESSLIST;

-- 查看表状态
SHOW TABLE STATUS FROM kjxmcs;
```

## 七、性能优化建议

1. **数据库索引**: 已在建表脚本中添加关键索引
2. **连接池**: 后端使用mysql2连接池，默认10个连接
3. **缓存**: 考虑使用Redis缓存热点数据
4. **CDN**: 生产环境使用CDN加速静态资源

## 八、安全建议

1. **修改JWT密钥**: 更改生产环境的JWT_SECRET
2. **使用HTTPS**: 生产环境启用SSL/TLS
3. **密码加密**: 实施bcrypt密码哈希
4. **SQL注入防护**: 使用参数化查询（已实施）
5. **限流**: 添加API请求限流中间件

## 九、联系支持

如遇到问题，请检查：
1. 数据库连接是否正常
2. 后端服务是否运行
3. 环境变量是否正确配置
4. 控制台错误信息

---

**系统状态检查清单：**

- [ ] MySQL数据库可访问
- [ ] 数据库表结构已创建
- [ ] 初始化数据已导入
- [ ] 后端服务已启动（端口8080）
- [ ] 前端服务已启动（端口3000）
- [ ] 环境变量已正确配置
- [ ] 测试账号可以登录
- [ ] 项目申报功能正常
- [ ] 数据库中可以看到新数据

**准备就绪！您现在可以开始完整的项目填报和审批流程测试。**
```

```json file="" isHidden
