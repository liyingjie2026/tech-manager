-- ==================================================================================
-- 科研项目管理系统 - 数据库表结构（基于后端Entity生成）
-- 执行顺序：先执行此文件创建所有表，再执行 02_seed_data.sql 插入初始数据
-- ==================================================================================

-- =================================================================================
-- 系统管理模块
-- =================================================================================

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `username` VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码（BCrypt加密）',
    `real_name` VARCHAR(100) COMMENT '真实姓名',
    `phone` VARCHAR(20) COMMENT '手机号',
    `email` VARCHAR(100) COMMENT '邮箱',
    `id_card` VARCHAR(18) COMMENT '身份证号',
    `gender` VARCHAR(10) COMMENT '性别：0-未知 1-男 2-女',
    `user_type` VARCHAR(20) COMMENT '用户类型：admin-管理员 supervisor-监管端 researcher-科研端 expert-专家',
    `institution_id` BIGINT COMMENT '所属机构ID',
    `institution_name` VARCHAR(200) COMMENT '所属机构名称',
    `department` VARCHAR(100) COMMENT '部门',
    `title` VARCHAR(100) COMMENT '职称',
    `role_id` BIGINT COMMENT '角色ID',
    `role_name` VARCHAR(100) COMMENT '角色名称',
    `status` INT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `last_login_time` DATETIME COMMENT '最后登录时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed create_by and update_by from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_username (`username`),
    INDEX idx_institution (`institution_id`),
    INDEX idx_user_type (`user_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE IF NOT EXISTS sys_role (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `role_code` VARCHAR(50) UNIQUE COMMENT '角色编码',
    `role_name` VARCHAR(100) NOT NULL COMMENT '角色名称',
    `description` TEXT COMMENT '角色描述',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` INT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_code (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 权限表
CREATE TABLE IF NOT EXISTS sys_permission (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父级ID',
    `permission_code` VARCHAR(100) UNIQUE NOT NULL COMMENT '权限代码',
    `permission_name` VARCHAR(100) NOT NULL COMMENT '权限名称',
    `type` VARCHAR(20) COMMENT '权限类型：menu-菜单 button-按钮',
    `path` VARCHAR(200) COMMENT '路由地址',
    `component` VARCHAR(200) COMMENT '组件路径',
    `icon` VARCHAR(100) COMMENT '图标',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` INT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_parent (`parent_id`),
    INDEX idx_code (`permission_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS sys_role_permission (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    `permission_id` BIGINT NOT NULL COMMENT '权限ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- Adding missing update_time, create_by, update_by, deleted fields to sys_role_permission table
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    UNIQUE KEY uk_role_permission (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- 机构表
CREATE TABLE IF NOT EXISTS res_institution (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `code` VARCHAR(50) COMMENT '机构编码',
    `name` VARCHAR(200) NOT NULL COMMENT '机构名称',
    `short_name` VARCHAR(100) COMMENT '机构简称',
    `type` VARCHAR(50) COMMENT '机构类型：internal-内部机构 external-外部机构',
    `credit_code` VARCHAR(50) COMMENT '统一社会信用代码',
    `legal_person` VARCHAR(100) COMMENT '法人代表',
    `legal_person_id_card` VARCHAR(18) COMMENT '法人身份证号',
    `legal_person_phone` VARCHAR(20) COMMENT '法人手机号',
    `contact_person` VARCHAR(100) COMMENT '联系人',
    `contact_phone` VARCHAR(20) COMMENT '联系电话',
    `contact_email` VARCHAR(100) COMMENT '联系邮箱',
    `province` VARCHAR(50) COMMENT '省份',
    `city` VARCHAR(50) COMMENT '城市',
    `district` VARCHAR(50) COMMENT '区县',
    `address` TEXT COMMENT '详细地址',
    `postcode` VARCHAR(10) COMMENT '邮政编码',
    `description` TEXT COMMENT '机构简介',
    `business_license` VARCHAR(500) COMMENT '营业执照',
    `qualification` VARCHAR(500) COMMENT '资质证书',
    `research_field` TEXT COMMENT '研究领域',
    `audit_status` VARCHAR(20) COMMENT '审核状态：pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `status` INT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_code (`code`),
    INDEX idx_type (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='机构表';

-- 字典表
CREATE TABLE IF NOT EXISTS sys_dictionary (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父级ID，0表示根节点',
    `dict_type` VARCHAR(100) COMMENT '字典类型编码（用于分组）',
    `dict_name` VARCHAR(200) COMMENT '字典类型名称',
    `item_code` VARCHAR(100) COMMENT '字典项编码',
    `item_label` VARCHAR(200) NOT NULL COMMENT '字典项标签（显示名称）',
    `item_value` VARCHAR(500) COMMENT '字典项值',
    `level` INT DEFAULT 1 COMMENT '层级：1-字典类型 2-一级项 3-二级项...',
    `description` TEXT COMMENT '描述',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `enabled` TINYINT(1) DEFAULT 1 COMMENT '是否启用：0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_parent (`parent_id`),
    INDEX idx_type (`dict_type`),
    INDEX idx_code (`item_code`),
    INDEX idx_level (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一字典表（支持层级结构）';

-- 字典项表
-- This table is now obsolete and merged into sys_dictionary
-- CREATE TABLE IF NOT EXISTS dictionary_item (
--     `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
--     `dict_id` BIGINT COMMENT '字典ID',
--     `dict_type` VARCHAR(100) COMMENT '字典类型',
--     `item_label` VARCHAR(200) COMMENT '项标签',
--     `item_value` VARCHAR(500) COMMENT '项值',
--     `sort` INT DEFAULT 0 COMMENT '排序',
--     `enabled` TINYINT(1) DEFAULT 1 COMMENT '是否启用',
--     `description` TEXT COMMENT '描述',
--     `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
--     `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
--     INDEX idx_dict (`dict_id`),
--     INDEX idx_type (`dict_type`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典项表';

-- 通知公告表
CREATE TABLE IF NOT EXISTS sys_notice (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `title` VARCHAR(500) NOT NULL COMMENT '标题',
    `type` VARCHAR(50) COMMENT '类型：notice-通知 announcement-公告 policy-政策法规 news-新闻动态',
    `content` TEXT COMMENT '内容',
    `summary` VARCHAR(1000) COMMENT '摘要',
    `attachments` TEXT COMMENT '附件',
    `publish_unit` VARCHAR(200) COMMENT '发布单位',
    `publish_by` VARCHAR(100) COMMENT '发布人',
    `publish_time` DATETIME COMMENT '发布时间',
    `is_top` INT DEFAULT 0 COMMENT '是否置顶：0-否 1-是',
    `view_count` INT DEFAULT 0 COMMENT '浏览次数',
    `status` VARCHAR(20) DEFAULT 'draft' COMMENT '状态：draft-草稿 published-已发布 offline-已下线',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_type (`type`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知公告表';

-- 工作流定义表
-- Fixed table name from sys_workflow to wf_workflow to match Workflow Entity
-- 工作流定义表
CREATE TABLE IF NOT EXISTS `wf_workflow` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `workflow_code` VARCHAR(100) UNIQUE COMMENT '流程编码',
    `workflow_name` VARCHAR(200) NOT NULL COMMENT '流程名称',
    `workflow_type` VARCHAR(50) COMMENT '流程类型',
    `description` TEXT COMMENT '流程描述',
    `definition` TEXT COMMENT '流程定义（JSON）',
    `version` INT DEFAULT 1 COMMENT '版本号',
    `is_current` INT DEFAULT 1 COMMENT '是否当前版本：0-否 1-是',
    `status` INT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_code (`workflow_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工作流定义表';

-- 工作流历史表
-- Fixed table name from sys_workflow_history to prj_workflow_history to match WorkflowHistory Entity
-- 工作流历史表
CREATE TABLE IF NOT EXISTS `prj_workflow_history` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT COMMENT '项目ID',
    `from_stage` VARCHAR(100) COMMENT '起始阶段',
    `to_stage` VARCHAR(100) COMMENT '目标阶段',
    `action` VARCHAR(50) COMMENT '操作',
    `operator_id` BIGINT COMMENT '操作人ID',
    `operator_name` VARCHAR(100) COMMENT '操作人姓名',
    `operator_role` VARCHAR(50) COMMENT '操作人角色',
    `comment` TEXT COMMENT '意见',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- Adding missing update_time, create_by, update_by, deleted fields to prj_workflow_history table
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工作流历史表';

-- [11] 待办事项表
CREATE TABLE IF NOT EXISTS sys_todo_item (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '待办人ID',
    `user_name` VARCHAR(100) COMMENT '待办人姓名',
    `role` VARCHAR(50) COMMENT '角色：expert-专家 institution-机构 supervisor-监管',
    `title` VARCHAR(500) NOT NULL COMMENT '待办标题',
    `description` VARCHAR(1000) COMMENT '待办描述',
    `type` VARCHAR(50) NOT NULL COMMENT '待办类型：project_review-项目评审 taskbook_audit-任务书审核 change_audit-变更审核 midterm_review-中期检查 annual_review-年报检查 acceptance_review-验收审核 expert_audit-专家审核 institution_audit-机构审核',
    `business_id` BIGINT COMMENT '业务ID（关联的项目、任务书、变更等ID）',
    `business_no` VARCHAR(100) COMMENT '业务编号',
    `business_type` VARCHAR(50) COMMENT '业务类型',
    `priority` VARCHAR(20) DEFAULT 'normal' COMMENT '优先级：urgent-紧急 high-高 normal-普通 low-低',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending-待处理 processing-处理中 completed-已完成 cancelled-已取消',
    `deadline` DATETIME COMMENT '截止时间',
    `link_url` VARCHAR(500) COMMENT '跳转链接',
    `completed_time` DATETIME COMMENT '完成时间',
    `completed_by` VARCHAR(100) COMMENT '完成人',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Adding missing create_by and update_by fields to sys_todo_item table
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_user_id (`user_id`),
    INDEX idx_status (`status`),
    INDEX idx_type (`type`),
    INDEX idx_business_id (`business_id`),
    INDEX idx_deadline (`deadline`),
    INDEX idx_create_time (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='待办事项表';


-- =================================================================================
-- 项目管理模块
-- =================================================================================

-- 项目表
CREATE TABLE IF NOT EXISTS prj_project (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_no` VARCHAR(100) UNIQUE COMMENT '项目编号',
    `name` VARCHAR(500) NOT NULL COMMENT '项目名称',
    `project_batch` VARCHAR(200) COMMENT '项目批次',
    `innovation_platform` VARCHAR(200) COMMENT '创新平台',
    `project_type` VARCHAR(50) COMMENT '项目类型',
    `project_category` VARCHAR(100) COMMENT '项目类别',
    `research_field` VARCHAR(200) COMMENT '研究领域',
    `demand_id` BIGINT COMMENT '需求ID',
    `institution_id` BIGINT COMMENT '申报机构ID',
    `institution_name` VARCHAR(200) COMMENT '申报机构名称',
    `leader_id` BIGINT COMMENT '项目负责人ID',
    `leader_name` VARCHAR(100) COMMENT '项目负责人姓名',
    `leader_phone` VARCHAR(20) COMMENT '负责人电话',
    `start_date` DATE COMMENT '开始日期',
    `end_date` DATE COMMENT '结束日期',
    `total_budget` DECIMAL(15,2) COMMENT '项目总预算（万元）',
    `apply_budget` DECIMAL(15,2) COMMENT '申请经费（万元）',
    `self_budget` DECIMAL(15,2) COMMENT '自筹经费（万元）',
    `objective` TEXT COMMENT '研究目标',
    `content` TEXT COMMENT '研究内容',
    `expected_result` TEXT COMMENT '预期成果',
    -- Adding innovation_points and application_prospects columns
    `innovation_points` TEXT COMMENT '创新点',
    `application_prospects` TEXT COMMENT '应用前景',
    `status` VARCHAR(50) COMMENT '状态：draft-草稿 submitted-已提交 under_review-评审中 approved-已通过 rejected-已驳回 in_progress-执行中 completed-已完成',
    `audit_status` VARCHAR(50) COMMENT '审核状态',
    `workflow_stage` VARCHAR(50) COMMENT '流程阶段',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` BIGINT COMMENT '审核人ID',
    `submit_time` DATETIME COMMENT '提交时间',
    `duplicate_rate` DECIMAL(5,2) COMMENT '查重率',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project_no (`project_no`),
    INDEX idx_institution (`institution_id`),
    INDEX idx_leader (`leader_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目表';

-- 项目成员表
CREATE TABLE IF NOT EXISTS prj_project_member (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `sequence` INT COMMENT '序号',
    `user_id` BIGINT COMMENT '用户ID',
    `name` VARCHAR(100) COMMENT '成员姓名',
    `gender` VARCHAR(10) COMMENT '性别',
    `birth_date` VARCHAR(20) COMMENT '出生年月',
    `id_type` VARCHAR(50) COMMENT '证件类型',
    `id_number` VARCHAR(100) COMMENT '证件号',
    `nationality` VARCHAR(50) COMMENT '民族',
    `work_unit` VARCHAR(200) COMMENT '单位/职称',
    `responsibility` VARCHAR(200) COMMENT '职责/职务',
    `department` VARCHAR(200) COMMENT '所在部门',
    `degree` VARCHAR(50) COMMENT '学位',
    `graduate_school` VARCHAR(200) COMMENT '毕业院校',
    `contact_phone` VARCHAR(50) COMMENT '联系电话',
    `mobile` VARCHAR(50) COMMENT '手机',
    `email` VARCHAR(100) COMMENT '电子邮箱',
    `role` VARCHAR(50) COMMENT '成员角色：leader-负责人 member-成员',
    `institution_id` BIGINT COMMENT '所在单位ID',
    `institution_name` VARCHAR(200) COMMENT '所在单位名称',
    `work_content` TEXT COMMENT '工作内容',
    `work_months` INT COMMENT '工作月数',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目成员表';

-- 项目预算表
CREATE TABLE IF NOT EXISTS prj_project_budget (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `category` VARCHAR(50) COMMENT '预算类别',
    `subcategory` VARCHAR(200) COMMENT '预算明细',
    `item_name` VARCHAR(200) COMMENT '预算科目名称',
    `amount` DECIMAL(15,2) COMMENT '金额（元）',
    `apply_amount` DECIMAL(15,2) COMMENT '申请金额（万元）',
    `self_amount` DECIMAL(15,2) COMMENT '自筹金额（万元）',
    `description` TEXT COMMENT '预算说明',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目预算表';

-- 项目进度表
CREATE TABLE IF NOT EXISTS prj_project_schedule (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `task_no` VARCHAR(100) COMMENT '任务编号',
    `task_name` VARCHAR(200) COMMENT '任务名称',
    `task_type` VARCHAR(50) COMMENT '任务类型',
    `description` TEXT COMMENT '任务描述',
    `responsible_unit` VARCHAR(200) COMMENT '责任单位',
    `responsible_person` VARCHAR(100) COMMENT '负责人',
    `start_date` DATE COMMENT '开始日期',
    `end_date` DATE COMMENT '结束日期',
    `milestone` VARCHAR(500) COMMENT '里程碑',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目进度表';

-- 项目绩效表
CREATE TABLE IF NOT EXISTS prj_project_performance (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `paper_target` VARCHAR(200) COMMENT '论文数量目标',
    `paper_count` INT DEFAULT 0 COMMENT '论文数量',
    `patent_target` VARCHAR(200) COMMENT '专利数量目标',
    `patent_count` INT DEFAULT 0 COMMENT '专利数量',
    `software_target` VARCHAR(200) COMMENT '软件著作权目标',
    `software_count` INT DEFAULT 0 COMMENT '软件著作权数量',
    `standard_target` VARCHAR(200) COMMENT '标准数量目标',
    `standard_count` INT DEFAULT 0 COMMENT '标准数量',
    `social_benefit` TEXT COMMENT '社会经济效益',
    `transformation_plan` TEXT COMMENT '成果转化计划',
    `talent_count` INT DEFAULT 0 COMMENT '人才培养数量',
    `other_result` TEXT COMMENT '其他成果',
    `indicators` TEXT COMMENT '综合指标',
    `duplicate_rate` DECIMAL(5,2) COMMENT '查重率(%)',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目绩效表';

-- 项目附件表
CREATE TABLE IF NOT EXISTS prj_project_attachment (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `file_name` VARCHAR(500) COMMENT '文件名称',
    `file_path` VARCHAR(1000) COMMENT '文件路径',
    `file_size` BIGINT COMMENT '文件大小（字节）',
    `file_type` VARCHAR(50) COMMENT '文件类型',
    `attachment_type` VARCHAR(50) COMMENT '附件类型',
    `upload_time` DATETIME COMMENT '上传时间',
    `upload_by` BIGINT COMMENT '上传人ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_project (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目附件表';

-- =================================================================================
-- 任务书管理模块
-- =================================================================================

-- 任务书表
CREATE TABLE IF NOT EXISTS prj_task_book (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `task_book_no` VARCHAR(100) COMMENT '任务书编号',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `project_no` VARCHAR(100) COMMENT '项目编号',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `project_type` VARCHAR(50) COMMENT '项目类型',
    `institution_id` BIGINT COMMENT '承担单位ID',
    `institution_name` VARCHAR(200) COMMENT '承担单位名称',
    `project_leader` VARCHAR(100) COMMENT '项目负责人',
    `leader_phone` VARCHAR(20) COMMENT '负责人电话',
    `start_date` DATE COMMENT '项目开始时间',
    `end_date` DATE COMMENT '项目结束时间',
    `total_budget` DECIMAL(15,2) COMMENT '项目总预算（万元）',
    `apply_budget` DECIMAL(15,2) COMMENT '申请经费（万元）',
    `self_budget` DECIMAL(15,2) COMMENT '自筹经费（万元）',
    `objective` TEXT COMMENT '研究目标',
    `content` TEXT COMMENT '研究内容',
    `expected_result` TEXT COMMENT '预期成果',
    `indicators` TEXT COMMENT '考核指标',
    `task_book_file` VARCHAR(1000) COMMENT '任务书文件',
    `sealed_file` VARCHAR(1000) COMMENT '盖章文件',
    `need_midterm` INT DEFAULT 0 COMMENT '是否需要中期检查：0-否 1-是',
    `midterm_date` VARCHAR(50) COMMENT '中期检查时间',
    `need_annual` INT DEFAULT 0 COMMENT '是否需要年度检查：0-否 1-是',
    `annual_date` VARCHAR(50) COMMENT '年度检查时间',
    `sign_status` VARCHAR(50) COMMENT '签订状态：pending-待签订 processing-流程中 signed-已签订',
    `status` VARCHAR(50) DEFAULT 'to_submit' COMMENT '审核状态：to_submit-待提交 pending-待审核 approved-审核通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `sign_time` DATETIME COMMENT '签订时间',
    `submit_time` DATETIME COMMENT '提交时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_task_book_no (`task_book_no`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务书表';

-- =================================================================================
-- 专家管理模块
-- =================================================================================

-- 专家表
CREATE TABLE IF NOT EXISTS res_expert (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT COMMENT '关联用户ID',
    `expert_code` VARCHAR(100) COMMENT '专家编号',
    `name` VARCHAR(100) NOT NULL COMMENT '姓名',
    `gender` INT COMMENT '性别：1-男 2-女',
    `birth_date` VARCHAR(50) COMMENT '出生日期',
    `id_card` VARCHAR(18) COMMENT '身份证号',
    `phone` VARCHAR(20) COMMENT '手机号',
    `email` VARCHAR(100) COMMENT '邮箱',
    `organization` VARCHAR(200) COMMENT '所属单位',
    `department` VARCHAR(100) COMMENT '部门',
    `position` VARCHAR(100) COMMENT '职务',
    `title` VARCHAR(100) COMMENT '职称',
    `education` VARCHAR(50) COMMENT '学历',
    `degree` VARCHAR(50) COMMENT '学位',
    `graduate_school` VARCHAR(200) COMMENT '毕业院校',
    `major` VARCHAR(200) COMMENT '专业方向',
    `research_field` TEXT COMMENT '研究领域',
    `expert_type` VARCHAR(50) COMMENT '专家类型',
    `specialty` TEXT COMMENT '专业特长',
    `introduction` TEXT COMMENT '个人简介',
    `achievements` TEXT COMMENT '主要成果',
    `bank_account` VARCHAR(50) COMMENT '银行账户',
    `bank_name` VARCHAR(200) COMMENT '开户行',
    `review_count` INT DEFAULT 0 COMMENT '评审次数',
    `good_rate` DOUBLE DEFAULT 0 COMMENT '好评率',
    `available` INT DEFAULT 1 COMMENT '是否可用：0-不可用 1-可用',
    `audit_status` VARCHAR(20) COMMENT '审核状态：pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `status` INT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_user (`user_id`),
    INDEX idx_code (`expert_code`),
    INDEX idx_name (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专家表';

-- 专家评审表
CREATE TABLE IF NOT EXISTS prj_expert_review (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `batch_no` VARCHAR(100) COMMENT '评审批次号',
    `review_name` VARCHAR(500) COMMENT '评审名称',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `expert_id` BIGINT NOT NULL COMMENT '专家ID',
    `expert_name` VARCHAR(100) COMMENT '专家姓名',
    `review_type` VARCHAR(50) COMMENT '评审类型：application-申报评审 midterm-中期评审 acceptance-验收评审',
    `review_method` VARCHAR(50) COMMENT '评审方式：online-线上评审 offline-线下评审',
    `review_start_time` DATETIME COMMENT '评审开始时间',
    `review_end_time` DATETIME COMMENT '评审截止时间',
    `score` DECIMAL(5,2) COMMENT '评审分数',
    `grade` VARCHAR(10) COMMENT '评审等级：A/B/C/D',
    `comment` TEXT COMMENT '评审意见',
    `recommended` INT COMMENT '是否推荐立项：0-否 1-是',
    `status` VARCHAR(50) DEFAULT 'pending' COMMENT '评审状态：pending-待评审 reviewed-已评审待结论 completed-已完成',
    `review_time` DATETIME COMMENT '评审时间',
    `avoided` INT DEFAULT 0 COMMENT '是否回避：0-否 1-是',
    `avoid_reason` TEXT COMMENT '回避原因',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_expert (`expert_id`),
    INDEX idx_batch (`batch_no`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专家评审表';

-- 专家投票表
CREATE TABLE IF NOT EXISTS prj_expert_vote (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `voter_expert_id` BIGINT COMMENT '投票专家ID',
    `voter_expert_name` VARCHAR(100) COMMENT '投票专家姓名',
    `voted_expert_id` BIGINT COMMENT '被投票专家ID（组长候选人）',
    `voted_expert_name` VARCHAR(100) COMMENT '被投票专家姓名',
    `batch_no` VARCHAR(100) COMMENT '评审批次号',
    `vote_time` DATETIME COMMENT '投票时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_batch (`batch_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专家投票表';

-- 专家组长表
CREATE TABLE IF NOT EXISTS prj_expert_leader (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `project_name` VARCHAR(200) COMMENT '项目名称',
    `expert_id` BIGINT NOT NULL COMMENT '组长专家ID',
    `expert_name` VARCHAR(100) COMMENT '专家姓名',
    `batch_no` VARCHAR(100) COMMENT '评审批次号',
    `vote_count` INT DEFAULT 0 COMMENT '得票数',
    `elected_time` DATETIME COMMENT '当选时间',
    `conclusion_status` VARCHAR(50) COMMENT '结论状态：pending-待上传 uploaded-已上传',
    `conclusion_content` TEXT COMMENT '评审结论内容',
    `conclusion_file_url` VARCHAR(1000) COMMENT '结论文件URL',
    `conclusion_upload_time` DATETIME COMMENT '结论上传时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_expert (`expert_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专家组长表';

-- =================================================================================
-- 检查管理模块
-- =================================================================================

-- 中期检查表
CREATE TABLE IF NOT EXISTS prj_midterm (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `midterm_no` VARCHAR(100) COMMENT '检查编号',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `project_no` VARCHAR(100) COMMENT '项目编号',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `institution_name` VARCHAR(200) COMMENT '承担单位',
    `project_leader` VARCHAR(100) COMMENT '项目负责人',
    `check_year` VARCHAR(50) COMMENT '检查年度',
    `plan_progress` INT COMMENT '计划完成进度（%）',
    `actual_progress` INT COMMENT '实际完成进度（%）',
    `used_budget` DECIMAL(15,2) COMMENT '已使用经费（万元）',
    `progress_desc` TEXT COMMENT '进展情况',
    `problems` TEXT COMMENT '存在问题',
    `next_plan` TEXT COMMENT '下一步计划',
    `achievements` TEXT COMMENT '阶段成果',
    `attachments` TEXT COMMENT '附件',
    `status` VARCHAR(50) DEFAULT 'draft' COMMENT '状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `submit_time` DATETIME COMMENT '提交时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='中期检查表';

-- 年度检查表
CREATE TABLE IF NOT EXISTS prj_annual (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `annual_no` VARCHAR(100) COMMENT '检查编号',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `project_no` VARCHAR(100) COMMENT '项目编号',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `institution_name` VARCHAR(200) COMMENT '承担单位',
    `project_leader` VARCHAR(100) COMMENT '项目负责人',
    `check_year` VARCHAR(50) COMMENT '检查年度',
    `year_target` TEXT COMMENT '年度目标',
    `year_completion` TEXT COMMENT '年度完成情况',
    `plan_progress` INT COMMENT '计划完成进度（%）',
    `actual_progress` INT COMMENT '实际完成进度（%）',
    `year_budget` DECIMAL(15,2) COMMENT '年度预算（万元）',
    `used_budget` DECIMAL(15,2) COMMENT '已使用经费（万元）',
    `budget_desc` TEXT COMMENT '经费使用说明',
    `achievements` TEXT COMMENT '年度成果',
    `problems` TEXT COMMENT '存在问题',
    `next_plan` TEXT COMMENT '下一年计划',
    `attachments` TEXT COMMENT '附件',
    `status` VARCHAR(50) DEFAULT 'draft' COMMENT '状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `submit_time` DATETIME COMMENT '提交时间',
    `year` VARCHAR(50) COMMENT '年度',
    `content` TEXT COMMENT '内容',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='年度检查表';

-- 验收管理表
CREATE TABLE IF NOT EXISTS prj_acceptance (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `acceptance_no` VARCHAR(100) COMMENT '验收编号',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `project_no` VARCHAR(100) COMMENT '项目编号',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `institution_name` VARCHAR(200) COMMENT '承担单位',
    `project_leader` VARCHAR(100) COMMENT '项目负责人',
    `start_date` VARCHAR(50) COMMENT '项目开始时间',
    `end_date` VARCHAR(50) COMMENT '项目结束时间',
    `total_budget` DECIMAL(15,2) COMMENT '项目总预算（万元）',
    `used_budget` DECIMAL(15,2) COMMENT '实际使用经费（万元）',
    `completion_desc` TEXT COMMENT '项目完成情况',
    `indicator_completion` TEXT COMMENT '考核指标完成情况',
    `achievements` TEXT COMMENT '主要成果',
    `budget_usage` TEXT COMMENT '经费使用情况',
    `benefits` TEXT COMMENT '社会经济效益',
    `problems` TEXT COMMENT '存在问题及建议',
    `attachments` TEXT COMMENT '附件',
    `acceptance_method` VARCHAR(50) COMMENT '验收方式：meeting-会议验收 correspondence-函评验收',
    `conclusion` VARCHAR(50) COMMENT '验收结论：excellent-优秀 qualified-合格 unqualified-不合格',
    `acceptance_comment` TEXT COMMENT '验收意见',
    `acceptance_time` DATETIME COMMENT '验收时间',
    `expert_group` VARCHAR(500) COMMENT '验收专家组',
    `status` VARCHAR(50) DEFAULT 'draft' COMMENT '状态：draft-草稿 pending-待验收 accepted-已验收',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `submit_time` DATETIME COMMENT '提交时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='验收管理表';

-- =================================================================================
-- 变更管理模块
-- =================================================================================

-- 项目变更表
CREATE TABLE IF NOT EXISTS prj_change (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `change_no` VARCHAR(100) COMMENT '变更编号',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `project_no` VARCHAR(100) COMMENT '项目编号',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `apply_unit` VARCHAR(200) COMMENT '申请单位',
    `applicant` VARCHAR(100) COMMENT '申请人',
    `apply_time` DATETIME COMMENT '申请时间',
    `change_type` VARCHAR(50) COMMENT '变更类型：leader-负责人变更 member-成员变更 time-时间变更 budget-预算变更 content-内容变更 cancel-项目终止',
    `change_item` TEXT COMMENT '变更事项',
    `change_reason` TEXT COMMENT '变更原因',
    `before_content` TEXT COMMENT '变更前内容',
    `after_content` TEXT COMMENT '变更后内容',
    `attachments` TEXT COMMENT '附件',
    `status` VARCHAR(50) DEFAULT 'draft' COMMENT '状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `change_content` TEXT COMMENT '变更内容',
    `submit_time` DATETIME COMMENT '提交时间',
    `review_comment` TEXT COMMENT '审核意见',
    `review_time` DATETIME COMMENT '审核时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目变更表';

-- =================================================================================
-- 成果管理模块
-- =================================================================================

-- 成果表
CREATE TABLE IF NOT EXISTS prj_achievement (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `achievement_no` VARCHAR(100) COMMENT '成果编号',
    `project_id` BIGINT COMMENT '项目ID',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `title` VARCHAR(500) COMMENT '成果标题',
    `name` VARCHAR(500) NOT NULL COMMENT '成果名称',
    `type` VARCHAR(50) COMMENT '成果类型：paper-论文 patent-专利 software-软著 standard-标准 book-专著 other-其他',
    `field` VARCHAR(200) COMMENT '成果领域',
    `completion_unit` VARCHAR(200) COMMENT '完成单位',
    `completion_person` VARCHAR(500) COMMENT '完成人',
    `completion_date` VARCHAR(50) COMMENT '完成时间',
    `description` TEXT COMMENT '成果简介',
    `detail` TEXT COMMENT '成果详情',
    `keywords` VARCHAR(500) COMMENT '关键词',
    `attachments` TEXT COMMENT '附件',
    `is_public` INT DEFAULT 0 COMMENT '是否公开：0-否 1-是',
    `is_promoted` INT DEFAULT 0 COMMENT '是否推介：0-否 1-是',
    `published` TINYINT(1) DEFAULT 0 COMMENT '是否已发布',
    `view_count` INT DEFAULT 0 COMMENT '浏览次数',
    `download_count` INT DEFAULT 0 COMMENT '下载次数',
    `status` VARCHAR(50) DEFAULT 'draft' COMMENT '状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_type (`type`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成果表';

-- 获奖表
CREATE TABLE IF NOT EXISTS prj_award (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT COMMENT '项目ID',
    `project_name` VARCHAR(500) COMMENT '项目名称',
    `name` VARCHAR(500) NOT NULL COMMENT '奖项名称',
    `category` VARCHAR(100) COMMENT '奖项类别：national-国家级 provincial-省部级 municipal-市厅级 other-其他',
    `level` VARCHAR(100) COMMENT '奖项等级：first-一等奖 second-二等奖 third-三等奖 other-其他',
    `award_date` VARCHAR(50) COMMENT '获奖时间',
    `award_unit` VARCHAR(200) COMMENT '颁奖单位',
    `winning_unit` VARCHAR(200) COMMENT '获奖单位',
    `winning_person` VARCHAR(500) COMMENT '获奖人员',
    `description` TEXT COMMENT '奖项描述',
    `certificate_no` VARCHAR(100) COMMENT '证书编号',
    `attachments` TEXT COMMENT '附件',
    `status` VARCHAR(50) DEFAULT 'draft' COMMENT '状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `award_time` DATETIME COMMENT '获奖时间（LocalDateTime格式）',
    `certificate_url` VARCHAR(1000) COMMENT '证书URL',
    `remark` TEXT COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='获奖表';

-- 成果转化表
CREATE TABLE IF NOT EXISTS prj_transformation (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `achievement_id` BIGINT COMMENT '成果ID',
    `transformation_no` VARCHAR(100) COMMENT '转化编号',
    `content` TEXT COMMENT '转化内容',
    `type` VARCHAR(100) COMMENT '转化类型',
    `unit` VARCHAR(200) COMMENT '转化单位',
    `principal` VARCHAR(100) COMMENT '转化负责人',
    `contact` VARCHAR(50) COMMENT '联系方式',
    `status` VARCHAR(50) DEFAULT 'draft' COMMENT '转化状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回',
    `comment` TEXT COMMENT '审核意见',
    `value` VARCHAR(200) COMMENT '转化价值',
    `attachments` TEXT COMMENT '附件',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_achievement (`achievement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成果转化表';

-- =================================================================================
-- 需求管理模块
-- =================================================================================

-- 需求表
CREATE TABLE IF NOT EXISTS prj_demand (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `demand_no` VARCHAR(100) COMMENT '需求编号',
    `name` VARCHAR(500) NOT NULL COMMENT '需求名称',
    `type` VARCHAR(50) COMMENT '需求类型',
    `project_type` VARCHAR(50) COMMENT '项目类型',
    `research_field` VARCHAR(200) COMMENT '研究领域',
    `description` TEXT COMMENT '需求描述',
    `objective` TEXT COMMENT '研究目标',
    `content` TEXT COMMENT '研究内容',
    `expected_result` TEXT COMMENT '预期成果',
    `budget` DECIMAL(15,2) COMMENT '预算金额（万元）',
    `apply_start_date` VARCHAR(50) COMMENT '申报开始日期',
    `apply_end_date` VARCHAR(50) COMMENT '申报截止日期',
    `duration` INT COMMENT '执行周期（月）',
    `publish_unit` VARCHAR(200) COMMENT '发布单位',
    `contact_person` VARCHAR(100) COMMENT '联系人',
    `contact_phone` VARCHAR(20) COMMENT '联系电话',
    `attachments` TEXT COMMENT '附件',
    `status` VARCHAR(50) DEFAULT 'draft' COMMENT '状态：draft-草稿 published-已发布 closed-已关闭',
    `audit_status` VARCHAR(50) COMMENT '审核状态：pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `publish_time` DATETIME COMMENT '发布时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_type (`type`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='需求表';

-- =================================================================================
-- 资源管理模块
-- =================================================================================

-- 科研仪器表
CREATE TABLE IF NOT EXISTS prj_equipment (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `equipment_no` VARCHAR(100) COMMENT '设备编号',
    `name` VARCHAR(200) NOT NULL COMMENT '设备名称',
    `model` VARCHAR(100) COMMENT '型号',
    `manufacturer` VARCHAR(200) COMMENT '生产厂商',
    `institution_id` BIGINT COMMENT '所属机构ID',
    `administrator` VARCHAR(100) COMMENT '管理员',
    `contact` VARCHAR(100) COMMENT '联系方式',
    `location` VARCHAR(200) COMMENT '存放地点',
    `status` VARCHAR(50) DEFAULT 'available' COMMENT '状态：available-可用 in_use-使用中 maintenance-维护中',
    `purchase_date` DATE COMMENT '购置日期',
    `price` DECIMAL(15,2) COMMENT '价格（万元）',
    `description` TEXT COMMENT '设备描述',
    `is_shared` INT DEFAULT 0 COMMENT '是否共享：0-否 1-是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_equipment_no (`equipment_no`),
    INDEX idx_institution (`institution_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科研仪器表';

-- 专业软件表
CREATE TABLE IF NOT EXISTS prj_software (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `software_no` VARCHAR(100) COMMENT '软件编号',
    `name` VARCHAR(200) NOT NULL COMMENT '软件名称',
    `version` VARCHAR(50) COMMENT '版本',
    `type` VARCHAR(100) COMMENT '软件类型',
    `developer` VARCHAR(200) COMMENT '开发商',
    `license_type` VARCHAR(50) COMMENT '许可类型：perpetual-永久 subscription-订阅 trial-试用',
    `license_count` INT COMMENT '许可数量',
    `used_license_count` INT DEFAULT 0 COMMENT '已使用许可数',
    `institution_id` BIGINT COMMENT '所属机构ID',
    `administrator` VARCHAR(100) COMMENT '管理员',
    `contact` VARCHAR(100) COMMENT '联系方式',
    `description` TEXT COMMENT '软件描述',
    `is_shared` INT DEFAULT 0 COMMENT '是否共享：0-否 1-是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_software_no (`software_no`),
    INDEX idx_institution (`institution_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专业软件表';

-- 基础数据表
CREATE TABLE IF NOT EXISTS prj_basic_data (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `data_no` VARCHAR(100) COMMENT '数据编号',
    `name` VARCHAR(200) NOT NULL COMMENT '数据名称',
    `type` VARCHAR(100) COMMENT '数据类型',
    `field` VARCHAR(200) COMMENT '研究领域',
    `description` TEXT COMMENT '数据描述',
    `source` VARCHAR(200) COMMENT '数据来源',
    `format` VARCHAR(50) COMMENT '数据格式：CSV/JSON/XML/PDF等',
    `size` VARCHAR(50) COMMENT '数据大小',
    `file_path` VARCHAR(1000) COMMENT '文件路径',
    `institution_id` BIGINT COMMENT '所属机构ID',
    `is_shared` INT DEFAULT 0 COMMENT '是否共享：0-否 1-是',
    `download_count` INT DEFAULT 0 COMMENT '下载次数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_data_no (`data_no`),
    INDEX idx_institution (`institution_id`),
    INDEX idx_type (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基础数据表';

-- 资源共享表
CREATE TABLE IF NOT EXISTS res_resource (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `resource_no` VARCHAR(100) COMMENT '资源编号',
    `name` VARCHAR(500) NOT NULL COMMENT '资源名称',
    `type` VARCHAR(50) COMMENT '资源类型：instrument-科研仪器 data-基础数据 software-专业软件',
    `field` VARCHAR(200) COMMENT '所属领域',
    `discipline` VARCHAR(200) COMMENT '学科领域',
    `instrument_type` VARCHAR(100) COMMENT '仪器类别（仪器专用）',
    `software_type` VARCHAR(100) COMMENT '软件类型（软件专用）',
    `specification` VARCHAR(200) COMMENT '规格型号',
    `manufacturer` VARCHAR(200) COMMENT '生产厂家',
    `purchase_date` VARCHAR(50) COMMENT '购置日期',
    `original_value` DECIMAL(15,2) COMMENT '原值（万元）',
    `institution_id` BIGINT COMMENT '所属单位ID',
    `institution_name` VARCHAR(200) COMMENT '所属单位名称',
    `location` VARCHAR(200) COMMENT '存放地点',
    `manager` VARCHAR(100) COMMENT '管理人员',
    `contact_phone` VARCHAR(50) COMMENT '联系电话',
    `description` TEXT COMMENT '资源简介',
    `instructions` TEXT COMMENT '使用说明',
    `images` TEXT COMMENT '图片',
    `attachments` TEXT COMMENT '附件',
    `is_shared` INT DEFAULT 0 COMMENT '是否共享：0-否 1-是',
    `share_method` VARCHAR(50) COMMENT '共享方式：free-免费 paid-收费',
    `charge_standard` VARCHAR(500) COMMENT '收费标准',
    `borrow_count` INT DEFAULT 0 COMMENT '借用次数',
    `current_status` VARCHAR(50) DEFAULT 'available' COMMENT '当前状态：available-可用 using-使用中 maintenance-维护中',
    `status` INT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `audit_status` VARCHAR(50) COMMENT '审核状态：pending-待审核 approved-已通过 rejected-已驳回',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `audit_by` VARCHAR(100) COMMENT '审核人',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_type (`type`),
    INDEX idx_institution (`institution_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源共享表';

-- 借阅记录表
CREATE TABLE IF NOT EXISTS prj_borrow_record (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `equipment_id` BIGINT NOT NULL COMMENT '仪器ID',
    `borrower_id` BIGINT COMMENT '借用人ID',
    `institution_id` BIGINT COMMENT '借用单位ID',
    `reason` TEXT COMMENT '借用原因',
    `borrow_time` DATETIME COMMENT '借用时间',
    `expected_return_time` DATETIME COMMENT '预计归还时间',
    `actual_return_time` DATETIME COMMENT '实际归还时间',
    `status` VARCHAR(50) DEFAULT 'pending' COMMENT '状态：pending-待审核 approved-已批准 borrowed-已借出 returned-已归还 rejected-已拒绝',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `auditor_id` BIGINT COMMENT '审核人ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_equipment (`equipment_id`),
    INDEX idx_borrower (`borrower_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='借阅记录表';

-- =================================================================================
-- 文件管理模块
-- =================================================================================

-- 文件信息表
CREATE TABLE IF NOT EXISTS sys_file (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `file_name` VARCHAR(500) COMMENT '文件名',
    `original_name` VARCHAR(500) COMMENT '原始文件名',
    `file_path` VARCHAR(1000) COMMENT '文件路径',
    `file_url` VARCHAR(1000) COMMENT '文件URL',
    `file_size` BIGINT COMMENT '文件大小（字节）',
    `file_type` VARCHAR(50) COMMENT '文件类型',
    `mime_type` VARCHAR(100) COMMENT 'MIME类型',
    `md5` VARCHAR(100) COMMENT '文件MD5',
    `business_type` VARCHAR(50) COMMENT '业务类型',
    `business_id` BIGINT COMMENT '业务ID',
    `upload_by` BIGINT COMMENT '上传人ID',
    `upload_by_name` VARCHAR(100) COMMENT '上传人名称',
    `download_count` INT DEFAULT 0 COMMENT '下载次数',
    `status` INT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_business (`business_type`, `business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件信息表';

-- 下载记录表
CREATE TABLE IF NOT EXISTS prj_download_record (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `data_id` BIGINT NOT NULL COMMENT '数据ID',
    `downloader_id` BIGINT COMMENT '下载人ID',
    `institution_id` BIGINT COMMENT '下载单位ID',
    `reason` TEXT COMMENT '下载原因',
    `download_time` DATETIME COMMENT '下载时间',
    `status` VARCHAR(50) DEFAULT 'pending' COMMENT '状态：pending-待审核 approved-已批准 downloaded-已下载 rejected-已拒绝',
    `audit_comment` TEXT COMMENT '审核意见',
    `audit_time` DATETIME COMMENT '审核时间',
    `auditor_id` BIGINT COMMENT '审核人ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_data (`data_id`),
    INDEX idx_downloader (`downloader_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='下载记录表';

-- =================================================================================
-- 其他辅助表
-- =================================================================================

-- 查重结果表
CREATE TABLE IF NOT EXISTS prj_duplicate_check_result (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `project_id` BIGINT NOT NULL COMMENT '项目ID',
    `duplicate_rate` DECIMAL(5,2) COMMENT '查重率（%）',
    `similar_projects` TEXT COMMENT '相似项目',
    `check_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '检查时间',
    `check_by` BIGINT COMMENT '检查人ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` INT DEFAULT 0 COMMENT '是否删除：0-否 1-是',
    INDEX idx_project (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='查重结果表';

-- ==================================================================================
-- 38. 考核评价表
-- ==================================================================================
CREATE TABLE IF NOT EXISTS prj_assessment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    year VARCHAR(10) NOT NULL COMMENT '考核年度',
    quarter VARCHAR(20) COMMENT '考核季度',
    institution_id BIGINT COMMENT '机构ID',
    institution_name VARCHAR(200) COMMENT '机构名称',
    project_count INT DEFAULT 0 COMMENT '项目数量',
    completion_rate DECIMAL(5,2) COMMENT '完成率',
    score DECIMAL(5,2) COMMENT '评价分数',
    `rank` VARCHAR(20) COMMENT '评价等级：优秀/良好/合格/不合格',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态：待评价/评价中/已完成',
    evaluator_id BIGINT COMMENT '评价人ID',
    evaluator_name VARCHAR(100) COMMENT '评价人姓名',
    evaluate_time DATETIME COMMENT '评价时间',
    remark TEXT COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除：0=正常，1=已删除',
    INDEX idx_year (year),
    INDEX idx_institution (institution_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考核评价表';

-- ==================================================================================
-- 39. 年度材料表
-- ==================================================================================
CREATE TABLE IF NOT EXISTS prj_assessment_material (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    year VARCHAR(10) NOT NULL COMMENT '年度',
    type VARCHAR(50) NOT NULL COMMENT '材料类型：年度任务书/年度任务完成情况报告/年度工作总结/其他材料',
    file_name VARCHAR(200) NOT NULL COMMENT '文件名称',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_size BIGINT COMMENT '文件大小（字节）',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态：待审核/已通过/已退回',
    deadline DATETIME COMMENT '截止日期',
    upload_user_id BIGINT COMMENT '上传人ID',
    upload_user_name VARCHAR(100) COMMENT '上传人姓名',
    upload_time DATETIME COMMENT '上传时间',
    review_user_id BIGINT COMMENT '审核人ID',
    review_user_name VARCHAR(100) COMMENT '审核人姓名',
    review_time DATETIME COMMENT '审核时间',
    remark TEXT COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- Changed from VARCHAR(100) to BIGINT to match BaseEntity
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除：0=正常，1=已删除',
    INDEX idx_year (year),
    INDEX idx_type (type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='年度材料表';
