-- 科研项目管理系统数据库表结构
-- 创建数据库
CREATE DATABASE IF NOT EXISTS research_project_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE research_project_db;

-- ==================== 用户权限模块 ====================

-- 用户表
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(200) NOT NULL COMMENT '密码',
    real_name VARCHAR(50) COMMENT '真实姓名',
    id_card VARCHAR(18) COMMENT '身份证号',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    user_type TINYINT NOT NULL DEFAULT 1 COMMENT '用户类型：1-科研机构 2-监测监管 3-专家',
    org_id BIGINT COMMENT '所属机构ID',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    avatar VARCHAR(500) COMMENT '头像URL',
    last_login_time DATETIME COMMENT '最后登录时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
    INDEX idx_username (username),
    INDEX idx_org_id (org_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    description VARCHAR(200) COMMENT '角色描述',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 用户角色关联表
CREATE TABLE sys_user_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 机构表
CREATE TABLE sys_organization (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '机构ID',
    org_code VARCHAR(50) NOT NULL UNIQUE COMMENT '机构编码',
    org_name VARCHAR(100) NOT NULL COMMENT '机构名称',
    org_type TINYINT NOT NULL COMMENT '机构类型：1-高校 2-科研院所 3-企业 4-其他',
    parent_id BIGINT DEFAULT 0 COMMENT '上级机构ID',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区县',
    address VARCHAR(200) COMMENT '详细地址',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_org_code (org_code),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='机构表';

-- 权限表
CREATE TABLE sys_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '权限ID',
    permission_name VARCHAR(50) NOT NULL COMMENT '权限名称',
    permission_code VARCHAR(100) NOT NULL UNIQUE COMMENT '权限编码',
    permission_type TINYINT NOT NULL COMMENT '权限类型：1-菜单 2-按钮',
    parent_id BIGINT DEFAULT 0 COMMENT '父级权限ID',
    path VARCHAR(200) COMMENT '路由路径',
    icon VARCHAR(50) COMMENT '图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_permission_code (permission_code),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 角色权限关联表
CREATE TABLE sys_role_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- ==================== 需求管理模块 ====================

-- 需求表
CREATE TABLE demand (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '需求ID',
    demand_name VARCHAR(200) NOT NULL COMMENT '需求名称',
    demand_code VARCHAR(50) UNIQUE COMMENT '需求编号',
    org_id BIGINT NOT NULL COMMENT '申报单位ID',
    org_name VARCHAR(100) COMMENT '申报单位名称',
    domain VARCHAR(50) COMMENT '所属领域',
    expected_level VARCHAR(50) COMMENT '预期水平：国内领先/国内先进/国际领先/国际先进/其他',
    attack_type VARCHAR(100) COMMENT '攻关类型：卡脖子技术/增补国内空白技术/国产化替代/前沿颠覆性技术/关键共性技术/其他',
    maturity_level VARCHAR(50) COMMENT '技术成熟度等级：当前等级-攻关后等级',
    investment DECIMAL(15,2) COMMENT '总投资（万元）',
    support_funds DECIMAL(15,2) COMMENT '建议财政支持经费（万元）',
    project_type VARCHAR(50) COMMENT '建议项目类型：重大项目/一般项目/重点项目/后补助项目/其他',
    duration INT COMMENT '攻关时限（年）：1/2/3',
    contact_person VARCHAR(50) COMMENT '联系人姓名',
    contact_phone VARCHAR(20) COMMENT '联系人电话',
    contact_id_card VARCHAR(18) COMMENT '联系人身份证',
    province VARCHAR(50) COMMENT '所在省州（县市区）',
    research_content TEXT COMMENT '研究背景和攻关目的、意义',
    key_problems TEXT COMMENT '拟解决的关键技术问题、技术指标及可行性',
    expected_result TEXT COMMENT '预期成果及水平、期盼扶持技术及关键指标参数',
    implementation_plan TEXT COMMENT '预期攻击（关技术路径、社会、生态等方面的攻击）',
    analysis TEXT COMMENT '技术指标对标分析',
    submit_time DATETIME COMMENT '提报时间',
    submitter_id BIGINT COMMENT '提交人ID',
    submitter_name VARCHAR(50) COMMENT '提交人姓名',
    audit_status TINYINT NOT NULL DEFAULT 0 COMMENT '审核状态：0-未审核 1-审核通过 2-审核不通过 3-已匹配 4-已驳回',
    audit_time DATETIME COMMENT '审核时间',
    auditor_id BIGINT COMMENT '审核人ID',
    auditor_name VARCHAR(50) COMMENT '审核人姓名',
    audit_opinion TEXT COMMENT '审核意见',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_demand_code (demand_code),
    INDEX idx_org_id (org_id),
    INDEX idx_audit_status (audit_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='需求表';

-- ==================== 项目管理模块 ====================

-- 项目表
CREATE TABLE project (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '项目ID',
    project_code VARCHAR(50) NOT NULL UNIQUE COMMENT '项目编号',
    project_name VARCHAR(200) NOT NULL COMMENT '项目名称',
    project_type VARCHAR(50) NOT NULL COMMENT '项目类型：重大项目/一般项目/重点项目/后补助项目',
    project_category VARCHAR(50) COMMENT '项目类别：启动助项目/应用技术类',
    leader_id BIGINT COMMENT '项目负责人ID',
    leader_name VARCHAR(50) COMMENT '项目负责人姓名',
    lead_org_id BIGINT COMMENT '牵头单位ID',
    lead_org_name VARCHAR(100) COMMENT '牵头单位名称',
    participating_org_ids TEXT COMMENT '参与单位ID列表（逗号分隔）',
    participating_org_names TEXT COMMENT '参与单位名称列表（逗号分隔）',
    total_budget DECIMAL(15,2) COMMENT '项目总经费（万元）',
    grant_funds DECIMAL(15,2) COMMENT '申请专项经费（万元）',
    self_raised_funds DECIMAL(15,2) COMMENT '自筹/其他资金（万元）',
    start_date DATE COMMENT '项目开始时间',
    end_date DATE COMMENT '项目截止时间',
    research_content TEXT COMMENT '主要研究内容及预期成果',
    application_status TINYINT NOT NULL DEFAULT 0 COMMENT '申报状态：0-草稿 1-已提交 2-审查中 3-评审中 4-已立项 5-已驳回',
    approval_status TINYINT COMMENT '立项状态：0-待立项 1-已立项 2-未立项',
    task_book_status TINYINT DEFAULT 0 COMMENT '任务书状态：0-未签订 1-已签订 2-审核中',
    task_book_uploaded TINYINT DEFAULT 0 COMMENT '任务书是否已上传：0-否 1-是',
    midterm_check TINYINT DEFAULT 0 COMMENT '是否中期检查：0-否 1-是',
    midterm_check_time DATE COMMENT '中期检查时间',
    midterm_status TINYINT DEFAULT 0 COMMENT '中期检查状态：0-未提交 1-已提交 2-待审批 3-已通过 4-未通过',
    annual_check TINYINT DEFAULT 0 COMMENT '是否年度检查：0-否 1-是',
    annual_check_time DATE COMMENT '年度检查时间',
    annual_status TINYINT DEFAULT 0 COMMENT '年度检查状态：0-未提交 1-已提交 2-待审批 3-已通过 4-未通过',
    acceptance_status TINYINT DEFAULT 0 COMMENT '验收状态：0-待发起 1-未通过 2-通过',
    acceptance_time DATE COMMENT '项目验收时间',
    duplicate_rate DECIMAL(5,2) COMMENT '查重率（%）',
    duplicate_check_time DATETIME COMMENT '查重时间',
    submit_time DATETIME COMMENT '提交时间',
    submitter_id BIGINT COMMENT '提交人ID',
    submitter_name VARCHAR(50) COMMENT '提交人姓名',
    approval_time DATETIME COMMENT '评审通过时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project_code (project_code),
    INDEX idx_lead_org_id (lead_org_id),
    INDEX idx_leader_id (leader_id),
    INDEX idx_application_status (application_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目表';

-- 项目任务书表
CREATE TABLE project_task_book (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '任务书ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    project_code VARCHAR(50) COMMENT '项目编号',
    task_book_file VARCHAR(500) COMMENT '任务书文件URL',
    task_book_file_name VARCHAR(200) COMMENT '任务书文件名',
    contract_file VARCHAR(500) COMMENT '项目合同书文件URL',
    contract_file_name VARCHAR(200) COMMENT '项目合同书文件名',
    change_notice_file VARCHAR(500) COMMENT '项目变更通知书文件URL',
    change_notice_file_name VARCHAR(200) COMMENT '项目变更通知书文件名',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-未签订 1-已签订 2-流程中',
    submit_time DATETIME COMMENT '提交时间',
    approval_time DATETIME COMMENT '审核通过时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project_id (project_id),
    INDEX idx_project_code (project_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目任务书表';

-- 项目任务拆分表
CREATE TABLE project_task_split (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '任务ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    task_code VARCHAR(50) COMMENT '任务编号',
    task_name VARCHAR(200) NOT NULL COMMENT '任务名称',
    task_type VARCHAR(50) COMMENT '任务类型：里程碑节点',
    task_target VARCHAR(200) COMMENT '任务名称：项目申报/任务分配/项目验收/项目成果/成果应用',
    task_description TEXT COMMENT '任务描述',
    responsible_org_id BIGINT COMMENT '负责机构/单位ID',
    responsible_org_name VARCHAR(100) COMMENT '负责机构/单位名称',
    responsible_person_id BIGINT COMMENT '负责人ID',
    responsible_person_name VARCHAR(50) COMMENT '负责人姓名',
    start_date DATE COMMENT '任务开始时间',
    end_date DATE COMMENT '任务截止时间',
    parent_task_id BIGINT DEFAULT 0 COMMENT '父任务ID',
    sort_order INT DEFAULT 0 COMMENT '排序',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project_id (project_id),
    INDEX idx_task_code (task_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目任务拆分表';

-- 项目变更表
CREATE TABLE project_change (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '变更ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    project_code VARCHAR(50) COMMENT '项目编号',
    change_type VARCHAR(50) NOT NULL COMMENT '变更类型：项目负责人/牵头单位/参与单位/项目内容/项目经费/项目时间/其他',
    change_reason TEXT COMMENT '变更原因',
    change_content TEXT COMMENT '变更内容',
    original_value TEXT COMMENT '变更前值',
    new_value TEXT COMMENT '变更后值',
    change_file VARCHAR(500) COMMENT '变更材料文件URL',
    change_file_name VARCHAR(200) COMMENT '变更材料文件名',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-未提交 1-已提交 2-待审核 3-已通过 4-未通过',
    submit_time DATETIME COMMENT '提交时间',
    submitter_id BIGINT COMMENT '提交人ID',
    submitter_name VARCHAR(50) COMMENT '提交人姓名',
    audit_time DATETIME COMMENT '审核时间',
    auditor_id BIGINT COMMENT '审核人ID',
    auditor_name VARCHAR(50) COMMENT '审核人姓名',
    audit_opinion TEXT COMMENT '审核意见',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project_id (project_id),
    INDEX idx_project_code (project_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目变更表';

-- 中期检查表
CREATE TABLE project_midterm_check (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '中期检查ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    project_code VARCHAR(50) COMMENT '项目编号',
    check_time DATE COMMENT '中期检查时间',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-未提交 1-已提交 2-待审批 3-已通过 4-未通过',
    submit_time DATETIME COMMENT '提交时间',
    submitter_id BIGINT COMMENT '提交人ID',
    submitter_name VARCHAR(50) COMMENT '提交人姓名',
    audit_time DATETIME COMMENT '审核时间',
    auditor_id BIGINT COMMENT '审核人ID',
    auditor_name VARCHAR(50) COMMENT '审核人姓名',
    audit_opinion TEXT COMMENT '审核意见',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project_id (project_id),
    INDEX idx_project_code (project_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='中期检查表';

-- 中期检查附件表
CREATE TABLE project_midterm_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '附件ID',
    midterm_check_id BIGINT NOT NULL COMMENT '中期检查ID',
    attachment_type VARCHAR(50) NOT NULL COMMENT '附件类型',
    file_url VARCHAR(500) COMMENT '文件URL',
    file_name VARCHAR(200) COMMENT '文件名',
    file_size BIGINT COMMENT '文件大小（字节）',
    upload_time DATETIME COMMENT '上传时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_midterm_check_id (midterm_check_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='中期检查附件表';

-- 年度检查表
CREATE TABLE project_annual_check (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '年度检查ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    project_code VARCHAR(50) COMMENT '项目编号',
    check_time DATE COMMENT '年度检查时间',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-未提交 1-已提交 2-待审批 3-已通过 4-未通过',
    submit_time DATETIME COMMENT '提交时间',
    submitter_id BIGINT COMMENT '提交人ID',
    submitter_name VARCHAR(50) COMMENT '提交人姓名',
    audit_time DATETIME COMMENT '审核时间',
    auditor_id BIGINT COMMENT '审核人ID',
    auditor_name VARCHAR(50) COMMENT '审核人姓名',
    audit_opinion TEXT COMMENT '审核意见',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project_id (project_id),
    INDEX idx_project_code (project_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='年度检查表';

-- 年度检查附件表
CREATE TABLE project_annual_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '附件ID',
    annual_check_id BIGINT NOT NULL COMMENT '年度检查ID',
    attachment_type VARCHAR(50) NOT NULL COMMENT '附件类型',
    file_url VARCHAR(500) COMMENT '文件URL',
    file_name VARCHAR(200) COMMENT '文件名',
    file_size BIGINT COMMENT '文件大小（字节）',
    upload_time DATETIME COMMENT '上传时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_annual_check_id (annual_check_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='年度检查附件表';

-- 项目验收表
CREATE TABLE project_acceptance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '验收ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    project_code VARCHAR(50) COMMENT '项目编号',
    acceptance_time DATE COMMENT '项目验收时间',
    research_report_file VARCHAR(500) COMMENT '研究报告或技术总结文件',
    research_report_name VARCHAR(200) COMMENT '研究报告文件名',
    test_report_file VARCHAR(500) COMMENT '测试或见证报告文件',
    test_report_name VARCHAR(200) COMMENT '测试报告文件名',
    user_report_file VARCHAR(500) COMMENT '用户使用报告文件',
    user_report_name VARCHAR(200) COMMENT '用户报告文件名',
    financial_report_file VARCHAR(500) COMMENT '财务决算报告文件',
    financial_report_name VARCHAR(200) COMMENT '财务报告文件名',
    expert_advice_file VARCHAR(500) COMMENT '验收专家建议名单文件',
    expert_advice_name VARCHAR(200) COMMENT '专家名单文件名',
    self_evaluation_file VARCHAR(500) COMMENT '项目绩效自评报告文件',
    self_evaluation_name VARCHAR(200) COMMENT '自评报告文件名',
    other_file VARCHAR(500) COMMENT '其他材料文件',
    other_file_name VARCHAR(200) COMMENT '其他材料文件名',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '验收状态：0-待发起 1-未通过 2-通过',
    submit_time DATETIME COMMENT '提交时间',
    submitter_id BIGINT COMMENT '提交人ID',
    submitter_name VARCHAR(50) COMMENT '提交人姓名',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project_id (project_id),
    INDEX idx_project_code (project_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目验收表';

-- ==================== 专家管理模块 ====================

-- 专家表
CREATE TABLE expert (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '专家ID',
    expert_code VARCHAR(50) UNIQUE COMMENT '专家编号',
    user_id BIGINT COMMENT '关联用户ID',
    real_name VARCHAR(50) NOT NULL COMMENT '姓名',
    id_card VARCHAR(18) COMMENT '身份证号',
    gender TINYINT COMMENT '性别：1-男 2-女',
    birth_date DATE COMMENT '出生日期',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    org_id BIGINT COMMENT '工作单位ID',
    org_name VARCHAR(100) COMMENT '工作单位名称',
    department VARCHAR(100) COMMENT '部门',
    position VARCHAR(50) COMMENT '职务',
    professional_title VARCHAR(50) COMMENT '职称',
    education VARCHAR(20) COMMENT '学历',
    research_field TEXT COMMENT '研究领域',
    expertise TEXT COMMENT '专业特长',
    achievements TEXT COMMENT '主要成果',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_expert_code (expert_code),
    INDEX idx_user_id (user_id),
    INDEX idx_org_id (org_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专家表';

-- 专家评审记录表
CREATE TABLE expert_review_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评审记录ID',
    expert_id BIGINT NOT NULL COMMENT '专家ID',
    expert_name VARCHAR(50) COMMENT '专家姓名',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    project_code VARCHAR(50) COMMENT '项目编号',
    review_type VARCHAR(50) NOT NULL COMMENT '评审类型：立项评审/中期检查/年度检查/结题验收',
    score DECIMAL(5,2) COMMENT '评分',
    review_opinion TEXT COMMENT '评审意见',
    review_time DATETIME COMMENT '评审时间',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-待评审 1-已评审',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专家评审记录表';

-- ==================== 成果管理模块 ====================

-- 成果表
CREATE TABLE achievement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '成果ID',
    achievement_code VARCHAR(50) UNIQUE COMMENT '成果编号',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    project_code VARCHAR(50) COMMENT '项目编号',
    achievement_name VARCHAR(200) NOT NULL COMMENT '成果名称',
    achievement_type VARCHAR(50) COMMENT '成果类型：论文/专利/软著/标准/产品/其他',
    achievement_level VARCHAR(50) COMMENT '成果级别：国际/国家/省部/市/其他',
    description TEXT COMMENT '成果描述',
    certificate_file VARCHAR(500) COMMENT '证书文件URL',
    certificate_file_name VARCHAR(200) COMMENT '证书文件名',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-待审核 1-已审核 2-已鉴定',
    submit_time DATETIME COMMENT '提交时间',
    submitter_id BIGINT COMMENT '提交人ID',
    submitter_name VARCHAR(50) COMMENT '提交人姓名',
    audit_time DATETIME COMMENT '审核时间',
    auditor_id BIGINT COMMENT '审核人ID',
    auditor_name VARCHAR(50) COMMENT '审核人姓名',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_achievement_code (achievement_code),
    INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成果表';

-- ==================== 流程引擎模块 ====================

-- 流程定义表
CREATE TABLE workflow_definition (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '流程定义ID',
    workflow_code VARCHAR(50) NOT NULL UNIQUE COMMENT '流程编码',
    workflow_name VARCHAR(100) NOT NULL COMMENT '流程名称',
    workflow_type VARCHAR(50) COMMENT '流程类型',
    description VARCHAR(500) COMMENT '流程描述',
    nodes_config TEXT COMMENT '节点配置（JSON）',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    version INT NOT NULL DEFAULT 1 COMMENT '版本号',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_workflow_code (workflow_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='流程定义表';

-- 流程实例表
CREATE TABLE workflow_instance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '流程实例ID',
    workflow_id BIGINT NOT NULL COMMENT '流程定义ID',
    workflow_code VARCHAR(50) COMMENT '流程编码',
    business_key VARCHAR(100) COMMENT '业务键（如项目ID）',
    business_type VARCHAR(50) COMMENT '业务类型',
    current_node VARCHAR(50) COMMENT '当前节点',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-进行中 1-已完成 2-已终止',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    starter_id BIGINT COMMENT '发起人ID',
    starter_name VARCHAR(50) COMMENT '发起人姓名',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_workflow_id (workflow_id),
    INDEX idx_business_key (business_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='流程实例表';

-- 流程任务表
CREATE TABLE workflow_task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '任务ID',
    instance_id BIGINT NOT NULL COMMENT '流程实例ID',
    node_code VARCHAR(50) NOT NULL COMMENT '节点编码',
    node_name VARCHAR(100) COMMENT '节点名称',
    assignee_id BIGINT COMMENT '处理人ID',
    assignee_name VARCHAR(50) COMMENT '处理人姓名',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-待处理 1-已处理 2-已退回',
    handle_time DATETIME COMMENT '处理时间',
    handle_opinion TEXT COMMENT '处理意见',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_instance_id (instance_id),
    INDEX idx_assignee_id (assignee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='流程任务表';

-- ==================== 系统配置模块 ====================

-- 字典表
CREATE TABLE sys_dict (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '字典ID',
    dict_type VARCHAR(50) NOT NULL COMMENT '字典类型',
    dict_label VARCHAR(100) NOT NULL COMMENT '字典标签',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典键值',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_dict_type (dict_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典表';

-- 文件上传记录表
CREATE TABLE sys_file (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '文件ID',
    file_name VARCHAR(200) NOT NULL COMMENT '文件名',
    original_name VARCHAR(200) COMMENT '原始文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_size BIGINT COMMENT '文件大小（字节）',
    file_type VARCHAR(50) COMMENT '文件类型',
    business_type VARCHAR(50) COMMENT '业务类型',
    business_id BIGINT COMMENT '业务ID',
    uploader_id BIGINT COMMENT '上传人ID',
    uploader_name VARCHAR(50) COMMENT '上传人姓名',
    upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记',
    INDEX idx_business (business_type, business_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件上传记录表';

-- 操作日志表
CREATE TABLE sys_operation_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) COMMENT '用户名',
    operation VARCHAR(200) COMMENT '操作',
    method VARCHAR(200) COMMENT '请求方法',
    params TEXT COMMENT '请求参数',
    ip VARCHAR(50) COMMENT 'IP地址',
    location VARCHAR(100) COMMENT '操作地点',
    operation_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    INDEX idx_user_id (user_id),
    INDEX idx_operation_time (operation_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';
