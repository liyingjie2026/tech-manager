-- 初始化数据
USE research_project_db;

-- 插入默认角色
INSERT INTO sys_role (role_name, role_code, description) VALUES
('超级管理员', 'SUPER_ADMIN', '系统超级管理员，拥有所有权限'),
('监测监管管理员', 'SUPERVISOR_ADMIN', '监测监管端管理员'),
('科研机构管理员', 'RESEARCH_ADMIN', '科研机构端管理员'),
('专家', 'EXPERT', '评审专家'),
('普通用户', 'USER', '普通用户');

-- 插入默认机构
INSERT INTO sys_organization (org_code, org_name, org_type, province, city, status) VALUES
('ORG001', '湖南省第三测绘院', 2, '湖南省', '长沙市', 1),
('ORG002', '****研究院', 2, '湖南省', '长沙市', 1);

-- 插入默认管理员用户（密码：admin123，需要加密）
INSERT INTO sys_user (username, password, real_name, user_type, org_id, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHsM8lE9lBOsl', '系统管理员', 2, 1, 1),
('supervisor', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHsM8lE9lBOsl', '监管员', 2, 1, 1),
('researcher', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHsM8lE9lBOsl', '科研人员', 1, 2, 1);

-- 绑定用户角色
INSERT INTO sys_user_role (user_id, role_id) VALUES
(1, 1),  -- admin -> 超级管理员
(2, 2),  -- supervisor -> 监测监管管理员
(3, 3);  -- researcher -> 科研机构管理员

-- 插入字典数据
INSERT INTO sys_dict (dict_type, dict_label, dict_value, sort_order) VALUES
-- 项目类型
('project_type', '重大项目', '重大项目', 1),
('project_type', '一般项目', '一般项目', 2),
('project_type', '重点项目', '重点项目', 3),
('project_type', '后补助项目', '后补助项目', 4),
-- 项目类别
('project_category', '启动助项目', '启动助项目', 1),
('project_category', '应用技术类', '应用技术类', 2),
-- 预期水平
('expected_level', '国内领先', '国内领先', 1),
('expected_level', '国内先进', '国内先进', 2),
('expected_level', '国际领先', '国际领先', 3),
('expected_level', '国际先进', '国际先进', 4),
('expected_level', '其他', '其他', 5),
-- 攻关类型
('attack_type', '卡脖子技术', '卡脖子技术', 1),
('attack_type', '增补国内空白技术', '增补国内空白技术', 2),
('attack_type', '国产化替代', '国产化替代', 3),
('attack_type', '前沿颠覆性技术', '前沿颠覆性技术', 4),
('attack_type', '关键共性技术', '关键共性技术', 5),
('attack_type', '其他', '其他', 6),
-- 所属领域
('domain', '就技术领域', '就技术领域', 1),
('domain', '工业技术', '工业技术', 2),
('domain', '农业技术', '农业技术', 3),
('domain', '医疗技术', '医疗技术', 4),
('domain', '环境技术', '环境技术', 5);
