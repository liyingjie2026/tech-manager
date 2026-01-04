# 科研项目管理系统部署手册

## 版本信息

| 版本 | 日期 | 作者 | 说明 |
|------|------|------|------|
| V1.0 | 2025-07 | 技术团队 | 初始版本 |
| V1.1 | 2025-07 | 技术团队 | 适配麒麟操作系统和人大金仓数据库，更新前端主题色 |

---

## 1. 环境要求

### 1.1 基础环境

| 软件 | 版本 | 说明 |
|------|------|------|
| 麒麟操作系统 | V10 SP1 | 推荐使用服务器版 |
| JDK | 17+ | 后端运行环境 |
| Maven | 3.6+ | 开发构建使用 |
| 人大金仓 KingbaseES | V8 R6 | 主数据库 |
| Redis | 7.0+ | 缓存服务 |
| Nginx | 1.24+ | 反向代理和负载均衡 |
| Node.js | 18+ | 前端构建和运行 |

### 1.2 服务器配置建议

#### 最低配置（开发/测试环境）

| 配置项 | 要求 |
|--------|------|
| CPU | 4核 |
| 内存 | 8GB |
| 硬盘 | 100GB SSD |

#### 推荐配置（生产环境）

| 服务器类型 | 数量 | CPU | 内存 | 硬盘 | 操作系统 |
|------------|------|-----|------|------|----------|
| 应用服务器 | 2 | 16核 | 32GB | 500GB SSD | 麒麟V10 |
| 数据库服务器（主） | 1 | 16核 | 64GB | 1TB SSD RAID10 | 麒麟V10 |
| 数据库服务器（从） | 1 | 16核 | 64GB | 1TB SSD RAID10 | 麒麟V10 |
| Redis服务器 | 3 | 8核 | 16GB | 200GB SSD | 麒麟V10 |
| 负载均衡服务器 | 2 | 4核 | 8GB | 100GB SSD | 麒麟V10 |

---

## 2. 数据库部署（人大金仓 KingbaseES）

### 2.1 安装人大金仓 KingbaseES

```bash
# 1. 下载安装包（从人大金仓官网获取）
# 2. 解压安装包
tar -zxvf KingbaseES_V008R006_Lin64.tar.gz

# 3. 进入安装目录
cd KingbaseES_V008R006_Lin64

# 4. 运行安装脚本
./setup.sh

# 5. 按照提示完成安装，建议安装路径：/opt/Kingbase/ES/V8
```

### 2.2 初始化数据库

```bash
# 1. 切换到kingbase用户
su - kingbase

# 2. 初始化数据库集群
initdb -D /opt/Kingbase/ES/V8/data -E UTF8 --locale=C

# 3. 启动数据库服务
sys_ctl start -D /opt/Kingbase/ES/V8/data

# 4. 创建项目数据库
ksql -U system -d template1
CREATE DATABASE research_project_db ENCODING 'UTF8';
CREATE USER research_admin WITH PASSWORD 'Research@2025';
GRANT ALL PRIVILEGES ON DATABASE research_project_db TO research_admin;
\q
```

### 2.3 导入数据库脚本

```bash
# 1. 导入表结构
ksql -U research_admin -d research_project_db -f backend/database/001_create_tables.sql

# 2. 导入初始数据
ksql -U research_admin -d research_project_db -f backend/database/002_init_data.sql

# 3. 导入样例数据（可选，用于测试）
ksql -U research_admin -d research_project_db -f backend/database/003_sample_data.sql
```

### 2.4 配置数据库参数

编辑 `/opt/Kingbase/ES/V8/data/kingbase.conf`：

```conf
# 连接配置
listen_addresses = '*'
port = 54321
max_connections = 500

# 内存配置
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 64MB
maintenance_work_mem = 512MB

# 日志配置
logging_collector = on
log_directory = 'log'
log_filename = 'kingbase-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB

# 性能配置
checkpoint_completion_target = 0.9
wal_buffers = 64MB
default_statistics_target = 100
random_page_cost = 1.1
```

编辑 `/opt/Kingbase/ES/V8/data/sys_hba.conf`：

```conf
# 允许应用服务器连接
host    all    all    192.168.1.0/24    md5
host    all    all    10.0.0.0/8        md5
```

重启数据库：

```bash
su - kingbase -c "sys_ctl restart -D /opt/Kingbase/ES/V8/data"
```

---

## 3. Redis部署

### 3.1 安装Redis

```bash
# 1. 下载Redis
wget https://download.redis.io/releases/redis-7.2.3.tar.gz

# 2. 解压并编译
tar -zxvf redis-7.2.3.tar.gz
cd redis-7.2.3
make
make install PREFIX=/opt/redis

# 3. 创建配置目录
mkdir -p /opt/redis/conf
mkdir -p /opt/redis/data
mkdir -p /opt/redis/logs
```

### 3.2 配置Redis

创建 `/opt/redis/conf/redis.conf`：

```conf
# 基本配置
bind 0.0.0.0
port 6379
daemonize yes
pidfile /opt/redis/redis.pid
logfile /opt/redis/logs/redis.log
dir /opt/redis/data

# 持久化配置
appendonly yes
appendfsync everysec
save 900 1
save 300 10
save 60 10000

# 安全配置
requirepass Redis@2025

# 内存配置
maxmemory 4gb
maxmemory-policy allkeys-lru

# 连接配置
timeout 300
tcp-keepalive 60
```

### 3.3 启动Redis

```bash
# 启动
/opt/redis/bin/redis-server /opt/redis/conf/redis.conf

# 验证
/opt/redis/bin/redis-cli -a Redis@2025 ping
```

---

## 4. 后端应用部署

### 4.1 编译打包

```bash
cd backend
mvn clean package -DskipTests
```

生成的jar包位于: `target/project-management-1.0.0.jar`

### 4.2 配置文件

创建生产环境配置文件 `application-prod.yml`：

```yaml
server:
  port: 8080

spring:
  datasource:
    driver-class-name: com.kingbase8.Driver
    url: jdbc:kingbase8://192.168.1.100:54321/research_project_db
    username: research_admin
    password: Research@2025
    hikari:
      maximum-pool-size: 50
      minimum-idle: 10
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  data:
    redis:
      host: 192.168.1.101
      port: 6379
      password: Redis@2025
      database: 0
      lettuce:
        pool:
          max-active: 50
          max-idle: 20
          min-idle: 5
          max-wait: 3000ms

# JWT配置
jwt:
  secret: your-production-secret-key-at-least-256-bits-long
  expiration: 86400000

# 文件上传配置
file:
  upload-path: /data/uploads
  max-size: 100MB

# 日志配置
logging:
  level:
    root: INFO
    com.research.project: INFO
  file:
    name: /var/log/research-project/app.log
    max-size: 100MB
    max-history: 30
```

### 4.3 创建系统服务（麒麟系统）

创建服务文件 `/etc/systemd/system/research-project.service`：

```ini
[Unit]
Description=Research Project Management System
After=network.target

[Service]
Type=simple
User=app
Group=app
WorkingDirectory=/opt/research-project
ExecStart=/opt/jdk-17/bin/java -Xms2g -Xmx4g -jar project-management-1.0.0.jar --spring.profiles.active=prod
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 4.4 部署步骤

```bash
# 1. 创建部署目录
sudo mkdir -p /opt/research-project
sudo mkdir -p /data/uploads
sudo mkdir -p /var/log/research-project

# 2. 创建应用用户
sudo useradd -r -s /sbin/nologin app

# 3. 复制文件
sudo cp target/project-management-1.0.0.jar /opt/research-project/
sudo cp application-prod.yml /opt/research-project/

# 4. 设置权限
sudo chown -R app:app /opt/research-project
sudo chown -R app:app /data/uploads
sudo chown -R app:app /var/log/research-project

# 5. 启动服务
sudo systemctl daemon-reload
sudo systemctl enable research-project
sudo systemctl start research-project

# 6. 检查状态
sudo systemctl status research-project
```

---

## 5. 前端部署

### 5.1 构建前端

```bash
# 1. 安装依赖
npm install

# 2. 构建生产版本
npm run build
```

### 5.2 配置环境变量

创建 `.env.production`：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_NAME=科研项目管理系统
```

### 5.3 使用PM2部署

```bash
# 1. 安装PM2
npm install -g pm2

# 2. 创建PM2配置文件 ecosystem.config.js
module.exports = {
  apps: [{
    name: 'research-project-web',
    script: 'npm',
    args: 'start',
    cwd: '/opt/research-project-web',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}

# 3. 启动应用
pm2 start ecosystem.config.js

# 4. 保存进程列表
pm2 save

# 5. 设置开机启动
pm2 startup
```

---

## 6. Nginx反向代理配置

### 6.1 安装Nginx

```bash
# 麒麟系统使用yum安装
sudo yum install -y nginx

# 启动并设置开机启动
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 6.2 配置反向代理

创建 `/etc/nginx/conf.d/research-project.conf`：

```nginx
# 上游服务器配置
upstream backend_servers {
    server 127.0.0.1:8080 weight=1;
    keepalive 32;
}

upstream frontend_servers {
    server 127.0.0.1:3000 weight=1;
    keepalive 32;
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS服务
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL证书配置
    ssl_certificate /etc/nginx/ssl/your-domain.com.crt;
    ssl_certificate_key /etc/nginx/ssl/your-domain.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 日志配置
    access_log /var/log/nginx/research-project-access.log;
    error_log /var/log/nginx/research-project-error.log;

    # 文件上传大小限制
    client_max_body_size 100M;

    # API代理
    location /api/ {
        proxy_pass http://backend_servers/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态文件缓存
    location /_next/static/ {
        proxy_pass http://frontend_servers/_next/static/;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 前端应用
    location / {
        proxy_pass http://frontend_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

验证并重启Nginx：

```bash
nginx -t
sudo systemctl restart nginx
```

---

## 7. 系统账号

### 7.1 预设账号

系统初始化后，包含以下预设账号：

| 角色 | 账号 | 密码 | 说明 |
|------|------|------|------|
| 超级管理员 | admin | admin123 | 拥有所有权限 |
| 监管管理员 | supervisor | admin123 | 监测监管端管理 |
| 科研人员 | huge | admin123 | 科研机构端用户 |
| 科研人员 | liming | admin123 | 科研机构端用户 |
| 评审专家 | expert_zhang | admin123 | 专家评审端用户 |
| 评审专家 | expert_liu | admin123 | 专家评审端用户 |

> **注意：** 首次登录后请立即修改默认密码！

### 7.2 界面主题

系统采用统一的蓝色主题，主色调为 **#4B95F3**，包括：
- 导航栏背景色
- Header背景色
- 主按钮颜色

---

## 8. 运维管理

### 8.1 日志查看

```bash
# 后端日志
tail -f /var/log/research-project/app.log

# Nginx日志
tail -f /var/log/nginx/research-project-access.log
tail -f /var/log/nginx/research-project-error.log

# 数据库日志
tail -f /opt/Kingbase/ES/V8/data/log/kingbase-*.log
```

### 8.2 服务管理

```bash
# 后端服务
sudo systemctl start|stop|restart|status research-project

# 前端服务
pm2 start|stop|restart|status research-project-web

# Nginx
sudo systemctl start|stop|restart|status nginx

# Redis
/opt/redis/bin/redis-cli -a Redis@2025 shutdown
/opt/redis/bin/redis-server /opt/redis/conf/redis.conf

# 数据库
su - kingbase -c "sys_ctl start|stop|restart -D /opt/Kingbase/ES/V8/data"
```

### 8.3 数据备份

```bash
# 创建备份脚本 /opt/scripts/backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/data/backup

mkdir -p $BACKUP_DIR

# 备份数据库
su - kingbase -c "sys_dump -U research_admin research_project_db > $BACKUP_DIR/db_$DATE.sql"

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /data/uploads

# 删除7天前的备份
find $BACKUP_DIR -mtime +7 -delete
```

添加定时任务：

```bash
# crontab -e
0 2 * * * /opt/scripts/backup.sh
```

---

## 9. 故障排查

### 9.1 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 无法连接数据库 | 防火墙/配置错误 | 检查端口开放、sys_hba.conf配置 |
| 登录失败 | Redis连接问题 | 检查Redis服务状态和密码 |
| 文件上传失败 | 权限/大小限制 | 检查目录权限和Nginx配置 |
| 页面404 | 前端路由问题 | 检查Nginx配置和前端构建 |

### 9.2 性能优化

1. **数据库优化**：定期执行 `VACUUM ANALYZE`
2. **Redis优化**：监控内存使用，调整maxmemory
3. **JVM优化**：根据实际情况调整堆内存大小
4. **Nginx优化**：启用gzip压缩，配置缓存

---

## 10. 安全加固

### 10.1 防火墙配置

```bash
# firewalld (麒麟系统)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 10.2 安全建议

- 定期更新系统和依赖包
- 使用强密码策略
- 限制SSH访问（密钥认证、禁用root登录）
- 配置防火墙和安全组规则
- 定期备份数据
- 启用审计日志
- 使用HTTPS加密传输

---

## 11. 联系支持

如遇到部署问题，请联系技术支持团队。
