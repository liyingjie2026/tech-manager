# Windows环境下启动科研项目管理系统

## 前置准备

### 1. 安装必要软件

请确保已安装以下软件：

- **Node.js** (v18或更高版本)
  - 下载地址：https://nodejs.org/
  - 下载LTS版本，双击安装
  - 安装完成后，打开命令提示符(CMD)或PowerShell，输入 `node -v` 验证安装

- **MySQL客户端** (可选，用于执行SQL脚本)
  - 下载地址：https://dev.mysql.com/downloads/mysql/
  - 或者使用Navicat、MySQL Workbench等图形化工具

### 2. 解压项目包

将下载的项目包解压到本地目录，例如：
```
C:\Projects\kjxmcs
```

---

## 第一步：初始化数据库

### 方式一：使用MySQL命令行（推荐）

1. 打开命令提示符(CMD)，进入项目的scripts目录：
```cmd
cd C:\Projects\kjxmcs\scripts
```

2. 连接到MySQL服务器并执行建表脚本：
```cmd
mysql -h 43.137.6.125 -P 3306 -u root -pMysql@12345 kjxmcs < 01-create-tables.sql
```

3. 执行初始化数据脚本：
```cmd
mysql -h 43.137.6.125 -P 3306 -u root -pMysql@12345 kjxmcs < 02-init-data.sql
```

### 方式二：使用Navicat等图形化工具

1. 打开Navicat，连接到数据库服务器
   - 主机：43.137.6.125
   - 端口：3306
   - 用户名：root
   - 密码：Mysql@12345
   - 数据库：kjxmcs

2. 右键点击数据库 kjxmcs，选择"运行SQL文件"
   - 先运行 `scripts/01-create-tables.sql`
   - 再运行 `scripts/02-init-data.sql`

3. 刷新数据库，验证表已创建成功

---

## 第二步：启动后端服务

1. 打开命令提示符(CMD)，进入scripts目录：
```cmd
cd C:\Projects\kjxmcs\scripts
```

2. 安装后端依赖包：
```cmd
npm install
```

3. 启动后端服务：
```cmd
npm run dev
```

4. 看到以下信息表示启动成功：
```
Backend server is running on http://localhost:3001
Database: 43.137.6.125:3306/kjxmcs
```

**注意：保持这个命令窗口打开，不要关闭！**

---

## 第三步：启动前端服务

1. **打开新的命令提示符窗口**(重要！)，进入项目根目录：
```cmd
cd C:\Projects\kjxmcs
```

2. 安装前端依赖包（首次启动需要）：
```cmd
npm install
```

3. 启动前端服务：
```cmd
npm run dev
```

4. 看到以下信息表示启动成功：
```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

**注意：同样保持这个命令窗口打开！**

---

## 第四步：访问系统

1. 打开浏览器，访问：
```
http://localhost:3000
```

2. 您将看到系统首页，显示三个系统入口：
   - 监管端
   - 科研机构端
   - 专家端

---

## 开始测试

### 测试流程一：项目负责人填报项目

1. 点击"科研机构端"进入登录页面

2. 使用项目负责人账号登录：
   - 用户名：`leader`
   - 密码：`admin123`

3. 登录后进入工作台

4. 点击左侧菜单"项目管理" → "项目申报"

5. 填写项目信息：
   - **项目名称**（必填）：例如"智慧城市时空大数据平台建设"
   - 项目类型：选择"重大项目"
   - 项目负责人：填写姓名
   - 其他信息按需填写

6. 点击"提交申报"按钮

7. 提交成功后，会跳转到"监管端-申报管理"页面（这是正常的）

8. **验证数据已保存**：
   - 打开数据库工具
   - 执行查询：`SELECT * FROM project ORDER BY created_at DESC LIMIT 1;`
   - 可以看到刚才填报的项目数据

### 测试流程二：机构管理员审核项目

1. 点击右上角用户名，退出登录

2. 重新进入科研机构端，使用机构管理员账号登录：
   - 用户名：`manager`
   - 密码：`admin123`

3. 登录后，点击"项目管理" → "项目一览"

4. 您将看到待审核的项目列表（包括刚才提交的项目）

5. 可以使用筛选条件：
   - 项目负责人：输入姓名
   - 年度：选择年份
   - 项目状态：选择"立项申请"

6. 点击项目后面的"查看"按钮，查看项目详情

7. 点击"审核"按钮，进入审核页面：
   - 可以选择"通过"或"驳回"
   - 填写审核意见
   - 点击"提交审核"

8. **验证审核记录**：
   - 数据库查询：`SELECT * FROM review_history ORDER BY created_at DESC LIMIT 1;`
   - 可以看到审核记录已保存

---

## 常见问题排查

### 问题1：npm install 报错

**解决方法**：
1. 删除 `node_modules` 文件夹和 `package-lock.json` 文件
2. 重新运行 `npm install`
3. 如果仍然失败，尝试使用国内镜像：
```cmd
npm config set registry https://registry.npmmirror.com
npm install
```

### 问题2：后端无法连接数据库

**错误信息**：`Error: connect ETIMEDOUT` 或 `Access denied`

**解决方法**：
1. 检查数据库服务器是否可访问：
```cmd
ping 43.137.6.125
```

2. 检查MySQL服务器是否允许远程连接
3. 检查防火墙设置，确保3306端口开放
4. 验证数据库账号密码是否正确

### 问题3：前端无法访问后端API

**错误信息**：浏览器控制台显示 `Failed to fetch` 或 `ERR_CONNECTION_REFUSED`

**解决方法**：
1. 确认后端服务正在运行（http://localhost:3001）
2. 打开浏览器访问：http://localhost:3001/api/health
3. 如果显示 `{"status":"ok"}`，说明后端正常运行

### 问题4：端口被占用

**错误信息**：`Port 3000 is already in use` 或 `Port 3001 is already in use`

**解决方法**：
1. 找到占用端口的进程：
```cmd
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

2. 结束占用端口的进程：
```cmd
taskkill /PID <进程ID> /F
```

3. 或者修改端口：
   - 前端：修改 `package.json` 中的启动命令
   - 后端：修改 `scripts/backend-server.ts` 中的端口号

### 问题5：登录后角色权限不正确

**解决方法**：
1. 清除浏览器缓存和LocalStorage
2. 按 F12 打开开发者工具 → Application → Local Storage
3. 删除所有 localStorage 项
4. 刷新页面重新登录

---

## 测试账号汇总

| 角色 | 用户名 | 密码 | 权限说明 |
|------|--------|------|----------|
| 项目负责人 | leader | admin123 | 填报项目、上传资料、提交审核 |
| 机构管理员 | manager | admin123 | 审核项目、上报监管、用户管理 |
| 监管端 | supervisor | admin123 | 全局监管、统计分析 |
| 专家端 | expert | admin123 | 项目评审、打分 |

---

## 系统架构说明

```
项目目录结构：
C:\Projects\kjxmcs
├── app/                    # Next.js前端页面
│   ├── api/               # API路由（转发到后端）
│   ├── dashboard/         # 科研机构端页面
│   ├── supervisor/        # 监管端页面
│   ├── expert/            # 专家端页面
│   └── login/             # 登录页面
├── components/            # React组件
├── lib/                   # 工具函数和类型定义
├── scripts/               # 后端服务和数据库脚本
│   ├── 01-create-tables.sql    # 建表脚本
│   ├── 02-init-data.sql        # 初始数据
│   ├── backend-server.ts       # 后端API服务
│   └── package.json            # 后端依赖
└── package.json           # 前端依赖
```

**运行时架构**：
```
浏览器 (http://localhost:3000)
    ↓
Next.js 前端服务 (端口3000)
    ↓
API路由转发 (/api/*)
    ↓
Node.js 后端服务 (端口3001)
    ↓
MySQL数据库 (43.137.6.125:3306)
```

---

## 数据流转示例

### 项目申报流程：

1. **前端提交**：
   - 用户在 `app/dashboard/projects/apply/page.tsx` 填写表单
   - 点击提交，调用 `fetch('/api/projects', { method: 'POST', ... })`

2. **API转发**：
   - 请求到达 `app/api/projects/route.ts`
   - 转发到后端：`http://localhost:3001/api/projects`

3. **后端处理**：
   - `scripts/backend-server.ts` 接收请求
   - 生成项目编号、处理数据
   - 插入到MySQL的 `project` 表

4. **数据保存**：
   - 数据库服务器 43.137.6.125
   - 库名：kjxmcs
   - 表名：project

5. **返回响应**：
   - 后端返回项目ID和状态
   - 前端显示成功提示
   - 跳转到监管端申报管理页面

---

## 开始测试

现在您可以：

1. ✅ 启动后端服务（端口3001）
2. ✅ 启动前端服务（端口3000）
3. ✅ 访问 http://localhost:3000
4. ✅ 使用测试账号登录
5. ✅ 开始完整的填报和审批流程测试
6. ✅ 所有数据实时保存到MySQL数据库

如遇到任何问题，请告诉我具体的错误信息！
