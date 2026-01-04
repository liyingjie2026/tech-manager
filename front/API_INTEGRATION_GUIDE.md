# 前后端联动配置指南

## 概述

本项目实现了前端 Next.js 应用与后端 Spring Boot API 的完整集成，支持基于 JWT Token 的用户认证。

## 配置步骤

### 1. 后端配置

后端运行在 `http://localhost:8080`，API 路径前缀为 `/api`。

#### 启动后端服务

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

后端将在 8080 端口启动，访问 http://localhost:8080 验证服务是否正常运行。

#### 后端 CORS 配置

已在 `backend/src/main/java/com/research/project/config/WebConfig.java` 中配置 CORS，允许前端 `http://localhost:3000` 访问。

#### 后端 Security 配置

已在 `backend/src/main/java/com/research/project/config/SecurityConfig.java` 中配置 Spring Security，公开以下路径：
- `/api/auth/**` - 认证相关接口（登录、注册等）
- `/api/acceptance/**` - 验收管理接口
- `/home/**` - 首页相关接口
- `/demand/**` - 需求管理接口
- Swagger 文档相关路径

### 2. 前端配置

#### 环境变量配置

创建 `.env.local` 文件并配置后端 API 地址：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

#### API 代理配置

Next.js 配置文件 `next.config.mjs` 已配置 API 代理，将 `/api/*` 请求转发到后端服务器。

#### 启动前端服务

```bash
npm install
npm run dev
```

前端将在 3000 端口启动，访问 http://localhost:3000 查看应用。

### 3. 登录流程

#### 前端登录页面

访问 `http://localhost:3000/login`，可以选择三种登录身份：
- **监管端**：监测监管人员登录
- **科研端**：科研机构人员登录  
- **专家端**：评审专家登录

#### 默认测试账号

| 用户类型 | 用户名 | 密码 | 说明 |
|---------|--------|------|------|
| 系统管理员 | admin | admin123 | 超级管理员 |
| 监管员 | supervisor | admin123 | 监测监管管理员 |
| 项目负责人 | leader | admin123 | 科研机构项目负责人 |
| 机构管理员 | manager | admin123 | 科研机构管理员 |
| 评审专家 | expert_zhang | admin123 | 专家 - 张教授 |
| 评审专家 | expert_liu | admin123 | 专家 - 刘教授 |

#### 登录 API 调用

前端调用 `/api/auth/login` 接口：

**请求格式：**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应格式：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 7200,
    "user": {
      "id": "1",
      "username": "admin",
      "realName": "系统管理员",
      "userType": "admin",
      "institutionId": "1",
      "institutionName": "湖南省自然资源厅",
      "roles": ["admin"]
    }
  }
}
```

#### Token 存储

登录成功后，前端会自动：
1. 将 JWT Token 存储在 `localStorage` 中（key: `auth_token`）
2. 将用户信息存储在 `localStorage` 中（key: `current_user`）
3. 将 Refresh Token 存储在 `localStorage` 中（key: `refresh_token`）

#### Token 使用

后续所有需要认证的 API 请求都会自动在 HTTP Header 中携带 Token：

```
Authorization: Bearer <token>
```

这由 `lib/api/client.ts` 中的 API 客户端自动处理。

### 4. API 客户端使用

#### 导入 API 模块

```typescript
import { authApi } from "@/lib/api/auth"
```

#### 调用登录接口

```typescript
try {
  const response = await authApi.login({
    username: "admin",
    password: "admin123"
  })
  
  if (response.code === 200 && response.data) {
    // Token 已自动保存，可以直接使用用户信息
    const user = response.data.user
    console.log("登录成功:", user.realName)
  }
} catch (error) {
  console.error("登录失败:", error.message)
}
```

#### 调用其他需要认证的接口

```typescript
import { get, post } from "@/lib/api/client"

// GET 请求
const projects = await get("/projects")

// POST 请求
const result = await post("/projects", {
  name: "新项目",
  description: "项目描述"
})
```

Token 会自动在请求头中携带，无需手动添加。

### 5. 权限验证

#### 前端路由守卫

可以在页面组件中检查用户登录状态：

```typescript
import { authStorage } from "@/lib/auth-storage"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

export default function ProtectedPage() {
  const router = useRouter()
  
  useEffect(() => {
    if (!authStorage.isLoggedIn()) {
      router.push("/login")
    }
  }, [router])
  
  // 页面内容
}
```

#### 后端权限控制

后端使用 Spring Security 进行权限控制，未授权的请求会返回 401 状态码，前端 API 客户端会自动：
1. 清除本地存储的 Token
2. 跳转到登录页面

### 6. 退出登录

```typescript
import { authApi } from "@/lib/api/auth"
import { authStorage } from "@/lib/auth-storage"
import { useRouter } from 'next/navigation'

const handleLogout = async () => {
  await authApi.logout()
  authStorage.clearAuth()
  router.push("/login")
}
```

### 7. 常见问题

#### CORS 错误

如果遇到 CORS 跨域错误：
1. 确认后端 `WebConfig.java` 中的 CORS 配置正确
2. 确认前端请求地址正确
3. 重启后端服务

#### 401 未授权错误

1. 检查 Token 是否过期
2. 检查后端 JWT 配置是否正确
3. 尝试重新登录

#### 连接失败

1. 确认后端服务已启动（8080 端口）
2. 确认前端服务已启动（3000 端口）
3. 检查 `.env.local` 中的 API 地址配置

### 8. 生产环境部署

#### 前端环境变量

在生产环境中，修改 `.env.production` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
```

#### 后端 CORS 配置

在 `WebConfig.java` 中添加生产环境的前端域名：

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://your-frontend-domain.com"
));
```

## 技术栈

- **前端**：Next.js 15 + React 19 + TypeScript
- **后端**：Spring Boot 3.2 + Spring Security + JWT
- **API 通信**：RESTful API + JSON
- **认证方式**：JWT Token

## 文件结构

```
├── lib/
│   ├── api/
│   │   ├── client.ts         # API 客户端基础配置
│   │   ├── auth.ts           # 认证相关 API
│   │   └── [other-apis].ts   # 其他业务 API
│   ├── auth-storage.ts       # 认证数据存储管理
│   └── types.ts              # TypeScript 类型定义
├── app/
│   └── login/
│       └── page.tsx          # 登录页面
├── backend/
│   └── src/main/java/com/research/project/
│       ├── controller/
│       │   └── AuthController.java    # 认证控制器
│       ├── service/
│       │   └── AuthService.java       # 认证服务
│       └── config/
│           ├── WebConfig.java         # CORS 配置
│           └── SecurityConfig.java    # Security 配置
└── next.config.mjs           # Next.js 配置（API 代理）
```

## 支持

如有问题，请查看控制台日志或联系开发团队。
