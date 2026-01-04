-- 科研项目管理系统数据库表设计
-- 数据库: research_project_management
-- 字符集: utf8mb4

-- ============================================
-- 1. 用户与权限管理模块
-- ============================================

-- 用户表
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
    real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    id_card VARCHAR(18) COMMENT '身份证号',
    institution_id BIGINT COMMENT '所属机构ID',
    user_type ENUM('RESEARCH', 'SUPERVISOR', 'EXPERT', 'ADMIN') NOT NULL DEFAULT 'RESEARCH' COMMENT '用户类型',
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    avatar VARCHAR(255) COMMENT '头像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_institution (institution_id)
) COMMENT='用户表';

-- 角色表
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID',
    role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    description TEXT COMMENT '角色描述',
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='角色表';

-- 用户角色关联表
CREATE TABLE sys_user_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_role (user_id, role_id),
    INDEX idx_user (user_id),
    INDEX idx_role (role_id)
) COMMENT='用户角色关联表';

-- 权限表
CREATE TABLE sys_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '权限ID',
    permission_code VARCHAR(100) NOT NULL UNIQUE COMMENT '权限编码',
    permission_name VARCHAR(100) NOT NULL COMMENT '权限名称',
    module VARCHAR(50) COMMENT '所属模块',
    page_path VARCHAR(255) COMMENT '页面路径',
    button_key VARCHAR(50) COMMENT '按钮标识',
    permission_type ENUM('PAGE', 'BUTTON', 'API') NOT NULL COMMENT '权限类型',
    description TEXT COMMENT '描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_module (module),
    INDEX idx_type (permission_type)
) COMMENT='权限表';

-- 角色权限关联表
CREATE TABLE sys_role_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    INDEX idx_role (role_id),
    INDEX idx_permission (permission_id)
) COMMENT='角色权限关联表';

-- 机构表
CREATE TABLE sys_institution (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '机构ID',
    institution_code VARCHAR(50) NOT NULL UNIQUE COMMENT '机构编码',
    institution_name VARCHAR(100) NOT NULL COMMENT '机构名称',
    institution_type VARCHAR(50) COMMENT '机构类型',
    parent_id BIGINT COMMENT '上级机构ID',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区县',
    address TEXT COMMENT '详细地址',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    contact_id_card VARCHAR(18) COMMENT '联系人身份证',
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_code (institution_code),
    INDEX idx_parent (parent_id)
) COMMENT='机构表';

-- ============================================
-- 2. 需求管理模块
-- ============================================

-- 需求表
CREATE TABLE demand (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '需求ID',
    demand_code VARCHAR(50) NOT NULL UNIQUE COMMENT '需求编号',
    demand_name VARCHAR(200) NOT NULL COMMENT '需求名称',
    institution_id BIGINT NOT NULL COMMENT '申报单位ID',
    domain VARCHAR(100) COMMENT '所属领域',
    expected_level VARCHAR(50) COMMENT '预期水平（国内领先/国内先进/国内外先进/其他）',
    breakthrough_types JSON COMMENT '攻关类型（卡脖子技术/增量式创新技术/国产化替代/前沿颠覆性技术/关键共性技术/其他）',
    maturity_level_start INT COMMENT '当前成熟度等级',
    maturity_level_target INT COMMENT '攻关后成熟度等级',
    investment_expected DECIMAL(15,2) COMMENT '预期投资（万元）',
    investment_recommended DECIMAL(15,2) COMMENT '建议财政支持经费（万元）',
    project_type VARCHAR(50) COMMENT '建议项目类型（重大项目/一般项目/后补助项目/其他）',
    duration INT COMMENT '攻关周期（年）',
    research_background TEXT COMMENT '研究背景和攻关目标',
    key_problems TEXT COMMENT '拟解决的关键科技问题',
    expected_results TEXT COMMENT '预期成果及水平',
    schedule TEXT COMMENT '预期攻关',
    tech_analysis TEXT COMMENT '技术指标对标分析',
    contact_person VARCHAR(50) COMMENT '联系人姓名',
    contact_phone VARCHAR(20) COMMENT '联系人电话',
    contact_id_card VARCHAR(18) COMMENT '联系人身份证',
    review_status ENUM('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN') NOT NULL DEFAULT 'PENDING' COMMENT '审核状态',
    submit_user_id BIGINT COMMENT '提交人ID',
    submit_time TIMESTAMP COMMENT '提交时间',
    reviewer_id BIGINT COMMENT '审核人ID',
    review_time TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_code (demand_code),
    INDEX idx_institution (institution_id),
    INDEX idx_status (review_status)
) COMMENT='需求表';

-- ============================================
-- 3. 项目管理模块
-- ============================================

-- 项目表
CREATE TABLE project (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '项目ID',
    project_code VARCHAR(50) NOT NULL UNIQUE COMMENT '项目编号',
    project_name VARCHAR(200) NOT NULL COMMENT '项目名称',
    project_type VARCHAR(50) NOT NULL COMMENT '项目类型',
    institution_id BIGINT NOT NULL COMMENT '牵头单位ID',
    partner_institution_id BIGINT COMMENT '参与单位ID',
    leader_id BIGINT NOT NULL COMMENT '项目负责人ID',
    start_date DATE COMMENT '开始时间',
    end_date DATE COMMENT '结束时间',
    total_budget DECIMAL(15,2) COMMENT '项目总预算（万元）',
    special_fund DECIMAL(15,2) COMMENT '申请专项经费（万元）',
    self_fund DECIMAL(15,2) COMMENT '自筹/其他资金（万元）',
    research_content TEXT COMMENT '主要研究内容及预期成果',
    status ENUM('DRAFT', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'CONTRACTED', 'EXECUTING', 'COMPLETED', 'TERMINATED') NOT NULL DEFAULT 'DRAFT' COMMENT '项目状态',
    submit_time TIMESTAMP COMMENT '提交时间',
    submit_user_id BIGINT COMMENT '提交人ID',
    approval_time TIMESTAMP COMMENT '批准时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_code (project_code),
    INDEX idx_institution (institution_id),
    INDEX idx_leader (leader_id),
    INDEX idx_status (status)
) COMMENT='项目表';

-- 项目成员表
CREATE TABLE project_member (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    user_id BIGINT NOT NULL COMMENT '成员ID',
    member_name VARCHAR(50) NOT NULL COMMENT '成员姓名',
    institution VARCHAR(100) COMMENT '所在单位',
    title VARCHAR(50) COMMENT '职称',
    role VARCHAR(50) COMMENT '角色',
    work_content TEXT COMMENT '工作内容',
    id_type VARCHAR(20) COMMENT '证件类型',
    id_number VARCHAR(30) COMMENT '证件号码',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_project (project_id),
    INDEX idx_user (user_id)
) COMMENT='项目成员表';

-- 项目任务书表
CREATE TABLE project_task_book (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '任务书ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    task_book_code VARCHAR(50) COMMENT '任务书编号',
    file_name VARCHAR(255) COMMENT '任务书文件名',
    file_url VARCHAR(500) COMMENT '任务书文件URL',
    file_size BIGINT COMMENT '文件大小（字节）',
    has_midterm_check BOOLEAN DEFAULT FALSE COMMENT '是否中期检查',
    midterm_check_date DATE COMMENT '中期检查时间',
    has_annual_check BOOLEAN DEFAULT FALSE COMMENT '是否年度检查',
    annual_check_date DATE COMMENT '年度检查时间',
    status ENUM('DRAFT', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'SIGNED') NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
    submit_time TIMESTAMP COMMENT '提交时间',
    approval_time TIMESTAMP COMMENT '批准时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_project (project_id),
    INDEX idx_status (status)
) COMMENT='项目任务书表';

-- 项目任务分解表
CREATE TABLE project_task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '任务ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    task_code VARCHAR(50) NOT NULL COMMENT '任务编号',
    task_name VARCHAR(200) NOT NULL COMMENT '任务名称',
    task_type VARCHAR(50) COMMENT '任务类型',
    task_description TEXT COMMENT '任务描述',
    responsible_institution VARCHAR(100) COMMENT '负责机构/单位',
    responsible_person VARCHAR(50) COMMENT '负责人',
    start_date DATE COMMENT '开始时间',
    end_date DATE COMMENT '结束时间',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_project (project_id),
    INDEX idx_code (task_code)
) COMMENT='项目任务分解表';

-- 项目变更表
CREATE TABLE project_change (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '变更ID',
    change_code VARCHAR(50) NOT NULL UNIQUE COMMENT '变更编号',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    change_type VARCHAR(50) NOT NULL COMMENT '变更类型',
    change_reason TEXT COMMENT '变更原因',
    change_content TEXT COMMENT '变更内容',
    file_name VARCHAR(255) COMMENT '变更通知书文件名',
    file_url VARCHAR(500) COMMENT '变更通知书URL',
    file_size BIGINT COMMENT '文件大小',
    status ENUM('DRAFT', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
    submit_user_id BIGINT COMMENT '提交人ID',
    submit_time TIMESTAMP COMMENT '提交时间',
    reviewer_id BIGINT COMMENT '审核人ID',
    review_time TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_code (change_code),
    INDEX idx_project (project_id),
    INDEX idx_status (status)
) COMMENT='项目变更表';

-- 中期检查表
CREATE TABLE midterm_check (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '中期检查ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    check_date DATE COMMENT '中期检查时间',
    check_status ENUM('NOT_SUBMITTED', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'NOT_SUBMITTED' COMMENT '检查状态',
    submit_user_id BIGINT COMMENT '提交人ID',
    submit_time TIMESTAMP COMMENT '提交时间',
    reviewer_id BIGINT COMMENT '审核人ID',
    review_time TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_project (project_id),
    INDEX idx_status (check_status)
) COMMENT='中期检查表';

-- 中期检查附件表
CREATE TABLE midterm_check_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '附件ID',
    midterm_check_id BIGINT NOT NULL COMMENT '中期检查ID',
    attachment_type VARCHAR(50) NOT NULL COMMENT '附件类型',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_url VARCHAR(500) NOT NULL COMMENT '文件URL',
    file_size BIGINT COMMENT '文件大小',
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    INDEX idx_check (midterm_check_id)
) COMMENT='中期检查附件表';

-- 年度检查表
CREATE TABLE annual_check (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '年度检查ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    check_date DATE COMMENT '年度检查时间',
    check_status ENUM('NOT_SUBMITTED', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'NOT_SUBMITTED' COMMENT '检查状态',
    submit_user_id BIGINT COMMENT '提交人ID',
    submit_time TIMESTAMP COMMENT '提交时间',
    reviewer_id BIGINT COMMENT '审核人ID',
    review_time TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_project (project_id),
    INDEX idx_status (check_status)
) COMMENT='年度检查表';

-- 年度检查附件表
CREATE TABLE annual_check_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '附件ID',
    annual_check_id BIGINT NOT NULL COMMENT '年度检查ID',
    attachment_type VARCHAR(50) NOT NULL COMMENT '附件类型',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_url VARCHAR(500) NOT NULL COMMENT '文件URL',
    file_size BIGINT COMMENT '文件大小',
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    INDEX idx_check (annual_check_id)
) COMMENT='年度检查附件表';

-- 项目验收表
CREATE TABLE project_acceptance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '验收ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    acceptance_date DATE COMMENT '项目验收时间',
    acceptance_status ENUM('PENDING', 'NOT_PASSED', 'PASSED') NOT NULL DEFAULT 'PENDING' COMMENT '验收状态',
    submit_user_id BIGINT COMMENT '提交人ID',
    submit_time TIMESTAMP COMMENT '提交时间',
    reviewer_id BIGINT COMMENT '审核人ID',
    review_time TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_project (project_id),
    INDEX idx_status (acceptance_status)
) COMMENT='项目验收表';

-- 项目验收附件表
CREATE TABLE project_acceptance_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '附件ID',
    acceptance_id BIGINT NOT NULL COMMENT '验收ID',
    attachment_type VARCHAR(50) NOT NULL COMMENT '附件类型',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_url VARCHAR(500) NOT NULL COMMENT '文件URL',
    file_size BIGINT COMMENT '文件大小',
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    INDEX idx_acceptance (acceptance_id)
) COMMENT='项目验收附件表';

-- ============================================
-- 4. 专家管理模块
-- ============================================

-- 专家表
CREATE TABLE expert (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '专家ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    expert_code VARCHAR(50) NOT NULL UNIQUE COMMENT '专家编号',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    gender VARCHAR(10) COMMENT '性别',
    birth_date DATE COMMENT '出生日期',
    id_card VARCHAR(18) COMMENT '身份证号',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    institution VARCHAR(100) COMMENT '工作单位',
    department VARCHAR(100) COMMENT '部门',
    title VARCHAR(50) COMMENT '职称',
    education VARCHAR(50) COMMENT '学历',
    major VARCHAR(100) COMMENT '专业',
    research_field TEXT COMMENT '研究领域',
    expertise TEXT COMMENT '专业特长',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_user (user_id),
    INDEX idx_code (expert_code),
    INDEX idx_status (status)
) COMMENT='专家表';

-- 专家评审表
CREATE TABLE expert_review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评审ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    expert_id BIGINT NOT NULL COMMENT '专家ID',
    review_type VARCHAR(50) NOT NULL COMMENT '评审类型（立项评审/中期检查/年度检查/验收评审）',
    review_date DATE COMMENT '评审日期',
    score DECIMAL(5,2) COMMENT '评分',
    review_opinion TEXT COMMENT '评审意见',
    suggestion TEXT COMMENT '建议',
    status ENUM('PENDING', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_project (project_id),
    INDEX idx_expert (expert_id),
    INDEX idx_type (review_type)
) COMMENT='专家评审表';

-- ============================================
-- 5. 成果管理模块
-- ============================================

-- 成果表
CREATE TABLE achievement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '成果ID',
    achievement_code VARCHAR(50) NOT NULL UNIQUE COMMENT '成果编号',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    achievement_name VARCHAR(200) NOT NULL COMMENT '成果名称',
    achievement_type VARCHAR(50) NOT NULL COMMENT '成果类型（论文/专利/软著/标准/产品/技术）',
    description TEXT COMMENT '成果描述',
    level VARCHAR(50) COMMENT '成果等级',
    publish_date DATE COMMENT '发布日期',
    authors TEXT COMMENT '作者',
    institution VARCHAR(100) COMMENT '完成单位',
    status ENUM('DRAFT', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
    submit_user_id BIGINT COMMENT '提交人ID',
    submit_time TIMESTAMP COMMENT '提交时间',
    reviewer_id BIGINT COMMENT '审核人ID',
    review_time TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_code (achievement_code),
    INDEX idx_project (project_id),
    INDEX idx_type (achievement_type),
    INDEX idx_status (status)
) COMMENT='成果表';

-- ============================================
-- 6. 流程引擎模块
-- ============================================

-- 流程定义表
CREATE TABLE workflow_definition (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '流程定义ID',
    workflow_code VARCHAR(50) NOT NULL UNIQUE COMMENT '流程编码',
    workflow_name VARCHAR(100) NOT NULL COMMENT '流程名称',
    workflow_type VARCHAR(50) NOT NULL COMMENT '流程类型',
    description TEXT COMMENT '流程描述',
    process_json JSON NOT NULL COMMENT '流程定义JSON',
    version INT DEFAULT 1 COMMENT '版本号',
    status ENUM('DRAFT', 'ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
    created_by BIGINT COMMENT '创建人',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_code (workflow_code),
    INDEX idx_type (workflow_type),
    INDEX idx_status (status)
) COMMENT='流程定义表';

-- 流程实例表
CREATE TABLE workflow_instance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '流程实例ID',
    workflow_definition_id BIGINT NOT NULL COMMENT '流程定义ID',
    business_key VARCHAR(100) NOT NULL COMMENT '业务键（如项目ID）',
    business_type VARCHAR(50) NOT NULL COMMENT '业务类型',
    current_node_id VARCHAR(50) COMMENT '当前节点ID',
    status ENUM('RUNNING', 'COMPLETED', 'TERMINATED', 'SUSPENDED') NOT NULL DEFAULT 'RUNNING' COMMENT '状态',
    start_user_id BIGINT NOT NULL COMMENT '发起人ID',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
    end_time TIMESTAMP COMMENT '结束时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_definition (workflow_definition_id),
    INDEX idx_business (business_key, business_type),
    INDEX idx_status (status)
) COMMENT='流程实例表';

-- 流程节点执行记录表
CREATE TABLE workflow_node_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    instance_id BIGINT NOT NULL COMMENT '流程实例ID',
    node_id VARCHAR(50) NOT NULL COMMENT '节点ID',
    node_name VARCHAR(100) NOT NULL COMMENT '节点名称',
    node_type VARCHAR(50) NOT NULL COMMENT '节点类型',
    executor_id BIGINT COMMENT '执行人ID',
    action VARCHAR(50) COMMENT '操作（通过/驳回/转发）',
    comment TEXT COMMENT '批语',
    execute_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '执行时间',
    INDEX idx_instance (instance_id),
    INDEX idx_executor (executor_id)
) COMMENT='流程节点执行记录表';

-- ============================================
-- 7. 系统配置模块
-- ============================================

-- 数据字典表
CREATE TABLE sys_dictionary (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '字典ID',
    dict_type VARCHAR(50) NOT NULL COMMENT '字典类型',
    dict_code VARCHAR(50) NOT NULL COMMENT '字典编码',
    dict_label VARCHAR(100) NOT NULL COMMENT '字典标签',
    dict_value VARCHAR(200) COMMENT '字典值',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    remark TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_type (dict_type),
    UNIQUE KEY uk_type_code (dict_type, dict_code)
) COMMENT='数据字典表';

-- 申报配置表
CREATE TABLE application_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '配置ID',
    config_name VARCHAR(100) NOT NULL COMMENT '配置名称',
    project_type VARCHAR(50) NOT NULL COMMENT '项目类型',
    start_time TIMESTAMP COMMENT '开始时间',
    end_time TIMESTAMP COMMENT '结束时间',
    config_json JSON COMMENT '配置JSON',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_type (project_type),
    INDEX idx_status (status)
) COMMENT='申报配置表';

-- 评分规则表
CREATE TABLE scoring_rule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '规则ID',
    rule_name VARCHAR(100) NOT NULL COMMENT '规则名称',
    project_type VARCHAR(50) NOT NULL COMMENT '项目类型',
    rule_json JSON NOT NULL COMMENT '规则JSON',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_type (project_type)
) COMMENT='评分规则表';

-- ============================================
-- 8. 其他辅助表
-- ============================================

-- 文件附件表
CREATE TABLE sys_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '附件ID',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_url VARCHAR(500) NOT NULL COMMENT '文件URL',
    file_size BIGINT COMMENT '文件大小',
    file_type VARCHAR(50) COMMENT '文件类型',
    business_type VARCHAR(50) COMMENT '业务类型',
    business_id BIGINT COMMENT '业务ID',
    upload_user_id BIGINT COMMENT '上传人ID',
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    INDEX idx_business (business_type, business_id)
) COMMENT='文件附件表';

-- 操作日志表
CREATE TABLE sys_operation_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    user_id BIGINT COMMENT '用户ID',
    operation_type VARCHAR(50) COMMENT '操作类型',
    operation_desc VARCHAR(200) COMMENT '操作描述',
    module VARCHAR(50) COMMENT '模块',
    method VARCHAR(200) COMMENT '方法',
    request_params TEXT COMMENT '请求参数',
    response_result TEXT COMMENT '响应结果',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    operation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    INDEX idx_user (user_id),
    INDEX idx_time (operation_time)
) COMMENT='操作日志表';
