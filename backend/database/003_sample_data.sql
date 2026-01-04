-- =====================================================
-- 科研项目管理系统 - 样例数据脚本
-- 适配人大金仓数据库 (KingbaseES)
-- =====================================================

-- 清空现有数据（按依赖顺序）
DELETE FROM sys_workflow_instance;
DELETE FROM sys_workflow_node;
DELETE FROM sys_workflow;
DELETE FROM prj_achievement;
DELETE FROM prj_acceptance;
DELETE FROM prj_annual_check;
DELETE FROM prj_midterm_check;
DELETE FROM prj_change_request;
DELETE FROM prj_task_item;
DELETE FROM prj_task_book;
DELETE FROM prj_review_score;
DELETE FROM prj_review;
DELETE FROM prj_project_member;
DELETE FROM prj_project;
DELETE FROM prj_demand;
DELETE FROM prj_batch;
DELETE FROM res_share_record;
DELETE FROM res_software;
DELETE FROM res_data;
DELETE FROM res_equipment;
DELETE FROM sys_expert;
DELETE FROM sys_user_role;
DELETE FROM sys_user;
DELETE FROM sys_role_permission;
DELETE FROM sys_permission;
DELETE FROM sys_role;
DELETE FROM sys_institution;
DELETE FROM sys_dict_item;
DELETE FROM sys_dict;

-- =====================================================
-- 1. 系统基础数据
-- =====================================================

-- 1.1 字典类型
INSERT INTO sys_dict (id, code, name, description, status, created_at) VALUES
('dict-001', 'project_type', '项目类型', '科研项目类型分类', 1, NOW()),
('dict-002', 'project_status', '项目状态', '项目流转状态', 1, NOW()),
('dict-003', 'project_field', '项目领域', '项目所属领域', 1, NOW()),
('dict-004', 'institution_type', '机构类型', '科研机构类型分类', 1, NOW()),
('dict-005', 'expert_specialty', '专家专业', '专家专业领域', 1, NOW()),
('dict-006', 'expected_level', '预期水平', '项目预期达到水平', 1, NOW()),
('dict-007', 'breakthrough_type', '攻关类型', '技术攻关类型', 1, NOW()),
('dict-008', 'task_type', '任务类型', '任务书任务类型', 1, NOW()),
('dict-009', 'demand_status', '需求状态', '需求征集状态', 1, NOW()),
('dict-010', 'review_status', '审核状态', '审核流程状态', 1, NOW());

-- 1.2 字典项 - 项目类型
INSERT INTO sys_dict_item (id, dict_id, code, name, sort_order, status) VALUES
('item-001', 'dict-001', 'youth', '青年项目', 1, 1),
('item-002', 'dict-001', 'major', '重大项目', 2, 1),
('item-003', 'dict-001', 'application', '应用技术类', 3, 1),
('item-004', 'dict-001', 'subsidy', '后补助项目', 4, 1),
('item-005', 'dict-001', 'general', '一般项目', 5, 1);

-- 1.3 字典项 - 项目状态
INSERT INTO sys_dict_item (id, dict_id, code, name, sort_order, status) VALUES
('item-010', 'dict-002', 'draft', '草稿', 1, 1),
('item-011', 'dict-002', 'submitted', '已提交', 2, 1),
('item-012', 'dict-002', 'reviewing', '审核中', 3, 1),
('item-013', 'dict-002', 'approved', '已立项', 4, 1),
('item-014', 'dict-002', 'rejected', '已驳回', 5, 1),
('item-015', 'dict-002', 'signed', '已签订', 6, 1),
('item-016', 'dict-002', 'in_progress', '执行中', 7, 1),
('item-017', 'dict-002', 'completed', '已完成', 8, 1),
('item-018', 'dict-002', 'terminated', '已终止', 9, 1);

-- 1.4 字典项 - 项目领域
INSERT INTO sys_dict_item (id, dict_id, code, name, sort_order, status) VALUES
('item-020', 'dict-003', 'surveying', '测绘地理信息', 1, 1),
('item-021', 'dict-003', 'land', '土地资源管理', 2, 1),
('item-022', 'dict-003', 'geology', '地质矿产', 3, 1),
('item-023', 'dict-003', 'ecology', '生态保护修复', 4, 1),
('item-024', 'dict-003', 'ocean', '海洋资源', 5, 1),
('item-025', 'dict-003', 'spatial', '国土空间规划', 6, 1);

-- 1.5 字典项 - 机构类型
INSERT INTO sys_dict_item (id, dict_id, code, name, sort_order, status) VALUES
('item-030', 'dict-004', 'government', '政府机构', 1, 1),
('item-031', 'dict-004', 'institution', '事业单位', 2, 1),
('item-032', 'dict-004', 'university', '高等院校', 3, 1),
('item-033', 'dict-004', 'research', '科研院所', 4, 1),
('item-034', 'dict-004', 'enterprise', '企业', 5, 1);

-- 1.6 字典项 - 预期水平
INSERT INTO sys_dict_item (id, dict_id, code, name, sort_order, status) VALUES
('item-040', 'dict-006', 'international_leading', '国际领先', 1, 1),
('item-041', 'dict-006', 'international_advanced', '国际先进', 2, 1),
('item-042', 'dict-006', 'domestic_leading', '国内领先', 3, 1),
('item-043', 'dict-006', 'domestic_advanced', '国内先进', 4, 1),
('item-044', 'dict-006', 'other', '其他', 5, 1);

-- 1.7 字典项 - 攻关类型
INSERT INTO sys_dict_item (id, dict_id, code, name, sort_order, status) VALUES
('item-050', 'dict-007', 'bottleneck', '卡脖子技术', 1, 1),
('item-051', 'dict-007', 'gap', '填补国内空白技术', 2, 1),
('item-052', 'dict-007', 'localization', '国产化替代', 3, 1),
('item-053', 'dict-007', 'frontier', '前沿颠覆性技术', 4, 1),
('item-054', 'dict-007', 'key', '关键共性技术', 5, 1),
('item-055', 'dict-007', 'other', '其他', 6, 1);

-- 1.8 字典项 - 审核状态
INSERT INTO sys_dict_item (id, dict_id, code, name, sort_order, status) VALUES
('item-060', 'dict-010', 'pending', '待审核', 1, 1),
('item-061', 'dict-010', 'passed', '审核通过', 2, 1),
('item-062', 'dict-010', 'rejected', '已驳回', 3, 1),
('item-063', 'dict-010', 'returned', '已退回', 4, 1);

-- =====================================================
-- 2. 机构数据
-- =====================================================
INSERT INTO sys_institution (id, code, name, type, level, address, contact_person, contact_phone, contact_email, legal_person, credit_code, description, status, created_at) VALUES
('inst-001', 'HNZRZY', '湖南省自然资源厅', 'government', '省级', '湖南省长沙市天心区湘府西路298号', '王主任', '0731-88881234', 'hnzrzy@hunan.gov.cn', '张厅长', '11430000MB1957293K', '湖南省自然资源行政主管部门', 1, NOW()),
('inst-002', 'HNDSCH', '湖南省第三测绘院', 'institution', '省级', '湖南省长沙市天心区赤岭路198号', '李院长', '0731-85123456', 'hndsch@hunan.gov.cn', '李建国', '12430000MB1823456X', '省属测绘地理信息事业单位', 1, NOW()),
('inst-003', 'CSZZXY', '长沙市自然资源和规划局', 'government', '市级', '湖南省长沙市岳麓区金星中路468号', '刘局长', '0731-88665544', 'cszzxy@changsha.gov.cn', '刘明', '11430100MB19887766', '长沙市自然资源行政主管部门', 1, NOW()),
('inst-004', 'ZNDXYJS', '中南大学测绘与遥感学院', 'university', '985', '湖南省长沙市岳麓区麓山南路932号', '陈院长', '0731-88876543', 'geo@csu.edu.cn', '陈教授', '12430000450078901X', '中南大学下属学院', 1, NOW()),
('inst-005', 'HNDXYJS', '湖南大学资源与环境学院', 'university', '985', '湖南省长沙市岳麓区麓山南路2号', '周院长', '0731-88821234', 'env@hnu.edu.cn', '周教授', '124300004500123456', '湖南大学下属学院', 1, NOW()),
('inst-006', 'HNKJDX', '湖南科技大学', 'university', '省属', '湖南省湘潭市雨湖区桃园路1号', '吴校长', '0731-58290001', 'hnkjdx@hnust.edu.cn', '吴明', '12430300450012345X', '省属重点高校', 1, NOW()),
('inst-007', 'HNCHYJS', '湖南省测绘科技研究所', 'research', '省级', '湖南省长沙市芙蓉区人民中路568号', '孙所长', '0731-82345678', 'hnchyjs@hunan.gov.cn', '孙建华', '12430000MB18234567', '省属测绘科研机构', 1, NOW()),
('inst-008', 'ZKYKXYJS', '中国科学院亚热带农业生态研究所', 'research', '国家级', '湖南省长沙市芙蓉区远大二路644号', '赵所长', '0731-84619001', 'isa@isa.ac.cn', '赵研究员', '12430000450123456X', '中科院下属研究所', 1, NOW());

-- =====================================================
-- 3. 角色数据
-- =====================================================
INSERT INTO sys_role (id, code, name, description, type, status, created_at) VALUES
('role-001', 'super_admin', '超级管理员', '系统最高权限管理员', 'system', 1, NOW()),
('role-002', 'supervisor_admin', '监测监管管理员', '监测监管端管理员', 'supervisor', 1, NOW()),
('role-003', 'supervisor_user', '监测监管用户', '监测监管端普通用户', 'supervisor', 1, NOW()),
('role-004', 'institution_admin', '机构管理员', '科研机构端管理员', 'institution', 1, NOW()),
('role-005', 'institution_user', '机构用户', '科研机构端普通用户', 'institution', 1, NOW()),
('role-006', 'project_leader', '项目负责人', '科研项目负责人', 'institution', 1, NOW()),
('role-007', 'expert', '评审专家', '项目评审专家', 'expert', 1, NOW()),
('role-008', 'expert_leader', '专家组长', '评审专家组组长', 'expert', 1, NOW());

-- =====================================================
-- 4. 用户数据
-- =====================================================
-- 密码均为 admin123 的BCrypt加密结果
INSERT INTO sys_user (id, username, password, real_name, gender, phone, email, id_card, title, institution_id, department, status, user_type, created_at) VALUES
('user-001', 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '系统管理员', 'male', '13800000001', 'admin@system.com', '430102199001011234', '管理员', 'inst-001', '信息中心', 1, 'admin', NOW()),
('user-002', 'supervisor', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '张监管', 'male', '13800000002', 'supervisor@hunan.gov.cn', '430102199002021234', '处长', 'inst-001', '科技处', 1, 'supervisor', NOW()),
('user-003', 'huge', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '胡歌', 'male', '13111929202', 'huge@hndsch.com', '430625199203112931', '高级工程师', 'inst-002', '测绘技术部', 1, 'institution', NOW()),
('user-004', 'liming', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '李明', 'male', '13800000004', 'liming@csu.edu.cn', '430102199004041234', '教授', 'inst-004', '测绘系', 1, 'institution', NOW()),
('user-005', 'wangfang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '王芳', 'female', '13800000005', 'wangfang@hnu.edu.cn', '430102199105051234', '副教授', 'inst-005', '环境系', 1, 'institution', NOW()),
('user-006', 'expert_zhang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '张专家', 'male', '13800000006', 'zhangzj@expert.com', '430102197506061234', '研究员', 'inst-008', '遥感所', 1, 'expert', NOW()),
('user-007', 'expert_liu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '刘专家', 'female', '13800000007', 'liuzj@expert.com', '430102197807071234', '教授', 'inst-004', '地信系', 1, 'expert', NOW()),
('user-008', 'expert_chen', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '陈专家', 'male', '13800000008', 'chenzj@expert.com', '430102198008081234', '教授', 'inst-005', '资源系', 1, 'expert', NOW()),
('user-009', 'zhaolei', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '赵磊', 'male', '13800000009', 'zhaolei@hnkjdx.edu.cn', '430102199209091234', '讲师', 'inst-006', '测绘系', 1, 'institution', NOW()),
('user-010', 'sunyan', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKUcD97fPqTqCYF2UyW7JXLpI3vK', '孙燕', 'female', '13800000010', 'sunyan@hnchyjs.com', '430102199310101234', '工程师', 'inst-007', '技术部', 1, 'institution', NOW());

-- 用户角色关联
INSERT INTO sys_user_role (user_id, role_id) VALUES
('user-001', 'role-001'),
('user-002', 'role-002'),
('user-003', 'role-004'),
('user-003', 'role-006'),
('user-004', 'role-005'),
('user-004', 'role-006'),
('user-005', 'role-005'),
('user-006', 'role-007'),
('user-006', 'role-008'),
('user-007', 'role-007'),
('user-008', 'role-007'),
('user-009', 'role-005'),
('user-010', 'role-005');

-- =====================================================
-- 5. 专家数据
-- =====================================================
INSERT INTO sys_expert (id, user_id, name, gender, institution, department, title, specialty, research_direction, education, degree, phone, email, id_card, bank_account, bank_name, review_count, status, created_at) VALUES
('expert-001', 'user-006', '张专家', 'male', '中国科学院亚热带农业生态研究所', '遥感所', '研究员', '测绘地理信息,遥感技术', '高分辨率遥感影像处理、地理国情监测', '博士研究生', '博士', '13800000006', 'zhangzj@expert.com', '430102197506061234', '6222021234567890123', '中国工商银行', 28, 1, NOW()),
('expert-002', 'user-007', '刘专家', 'female', '中南大学测绘与遥感学院', '地信系', '教授', '地理信息系统,空间分析', 'GIS空间分析、智慧城市', '博士研究生', '博士', '13800000007', 'liuzj@expert.com', '430102197807071234', '6222021234567890124', '中国建设银行', 35, 1, NOW()),
('expert-003', 'user-008', '陈专家', 'male', '湖南大学资源与环境学院', '资源系', '教授', '土地资源管理,生态保护', '土地利用规划、生态修复技术', '博士研究生', '博士', '13800000008', 'chenzj@expert.com', '430102198008081234', '6222021234567890125', '中国农业银行', 22, 1, NOW()),
('expert-004', NULL, '王院士', 'male', '中国科学院地理科学与资源研究所', '综合研究部', '院士', '地理科学,资源环境', '资源环境遥感、地理系统模拟', '博士研究生', '博士', '13800000011', 'wangys@igsnrr.ac.cn', '110102196001011234', '6222021234567890126', '中国银行', 56, 1, NOW()),
('expert-005', NULL, '李研究员', 'female', '自然资源部测绘发展研究中心', '战略研究室', '研究员', '测绘科技政策,标准化', '测绘科技战略、标准体系研究', '博士研究生', '博士', '13800000012', 'liyj@sbsm.gov.cn', '110102197202021234', '6222021234567890127', '交通银行', 41, 1, NOW());

-- =====================================================
-- 6. 申报批次数据
-- =====================================================
INSERT INTO prj_batch (id, code, name, year, type, description, budget, start_date, end_date, status, project_count, created_at) VALUES
('batch-001', 'HNZRZY-2025-01', '2025年度湖南省自然资源科技创新计划（第一批）', 2025, '科研类', '2025年度第一批科技创新项目申报', 50000000.00, '2025-01-01', '2025-03-31', 'active', 0, NOW()),
('batch-002', 'HNZRZY-2025-02', '2025年度湖南省自然资源科技创新计划（第二批）', 2025, '科研类', '2025年度第二批科技创新项目申报', 30000000.00, '2025-04-01', '2025-06-30', 'pending', 0, NOW()),
('batch-003', 'HNZRZY-2024-01', '2024年度湖南省自然资源科技创新计划', 2024, '科研类', '2024年度科技创新项目', 45000000.00, '2024-01-01', '2024-12-31', 'completed', 15, NOW());

-- =====================================================
-- 7. 需求征集数据
-- =====================================================
INSERT INTO prj_demand (id, code, title, field, expected_level, breakthrough_types, total_budget, gov_funding, duration, institution_id, institution_name, contact_person, contact_phone, contact_id_card, background, key_problems, expected_results, expected_benefits, tech_analysis, current_maturity, target_maturity, status, submit_time, review_time, reviewer_id, review_comment, created_at) VALUES
('demand-001', 'XQ2025001', '高精度北斗定位关键技术研究', '测绘地理信息', '国内领先', '卡脖子技术,填补国内空白技术', 2000000.00, 2000000.00, 24, 'inst-002', '湖南省第三测绘院', '胡歌', '13111929202', '430625199203112931', '研究背景：随着北斗三号全球卫星导航系统的建成，高精度定位技术在自然资源调查、国土空间规划等领域具有广阔应用前景。当前北斗高精度定位在复杂环境下的可靠性和精度仍需进一步提升。', '1.复杂环境下北斗信号多路径抑制技术\n2.北斗/GNSS多系统融合精密定位算法\n3.实时厘米级定位服务系统', '1.形成北斗高精度定位核心算法2-3套\n2.发表高水平论文4-5篇\n3.申请发明专利2-3项\n4.制定技术标准1-2项', '项目成果将显著提升湖南省北斗高精度定位服务能力，预计可节约传统测量成本30%以上，社会经济效益显著。', '国内外北斗/GNSS高精度定位技术发展迅速，但在复杂城市环境和山区林区的应用仍面临挑战。本项目拟解决的关键技术指标包括定位精度优于2cm、收敛时间小于30秒等。', '实验室样机', '产品级', 'pending', '2025-09-17 10:30:00', NULL, NULL, NULL, NOW()),
('demand-002', 'XQ2025002', '自然资源三维实景数据采集与建模技术', '测绘地理信息', '国内领先', '卡脖子技术', 1500000.00, 1500000.00, 18, 'inst-004', '中南大学测绘与遥感学院', '李明', '13800000004', '430102199004041234', '研究背景：三维实景数据是数字孪生国土建设的重要基础，传统三维建模方法效率低、成本高。', '1.无人机倾斜摄影高效数据采集技术\n2.多源点云数据融合与精细化建模\n3.三维模型轻量化与可视化', '1.研发三维实景采集建模软件系统1套\n2.发表SCI/EI论文3-4篇\n3.申请软件著作权2-3项', '项目成果将为湖南省实景三维建设提供技术支撑，预计可提升建模效率50%以上。', '当前三维建模技术主要依赖进口软件，国产化替代需求迫切。', '原理样机', '工程化应用', 'passed', '2025-09-15 14:20:00', '2025-09-20 09:00:00', 'user-002', '技术方案可行，预算合理，同意立项。', NOW()),
('demand-003', 'XQ2025003', '耕地质量监测与预警关键技术研究', '土地资源管理', '国内先进', '关键共性技术', 1200000.00, 1000000.00, 24, 'inst-005', '湖南大学资源与环境学院', '王芳', '13800000005', '430102199105051234', '研究背景：耕地保护是国家粮食安全的重要保障，建立科学的耕地质量监测与预警体系意义重大。', '1.耕地质量综合评价指标体系构建\n2.多源遥感耕地质量监测技术\n3.耕地质量变化预警模型', '1.建立耕地质量监测指标体系1套\n2.开发监测预警系统平台1个\n3.发表论文4-5篇', '项目成果将为湖南省耕地保护决策提供科学依据。', '耕地质量监测技术研究较为成熟，但针对南方丘陵区的适用性研究较少。', '技术方案', '示范应用', 'passed', '2025-09-10 16:45:00', '2025-09-18 11:30:00', 'user-002', '研究内容切合实际需求，建议加强与国土调查数据的融合应用。', NOW()),
('demand-004', 'XQ2025004', '矿山生态修复智能监测技术研究', '生态保护修复', '国内领先', '前沿颠覆性技术,关键共性技术', 1800000.00, 1500000.00, 30, 'inst-007', '湖南省测绘科技研究所', '孙燕', '13800000010', '430102199310101234', '研究背景：湖南省矿产资源丰富，历史遗留矿山生态问题突出，亟需建立智能化监测评估体系。', '1.矿山生态损害遥感智能识别技术\n2.生态修复效果动态评估方法\n3.矿山生态修复智能决策支持系统', '1.研发矿山生态监测评估系统1套\n2.形成技术标准2-3项\n3.发表高水平论文5-6篇', '项目将为湖南省矿山生态修复监管提供技术支撑，预计可覆盖全省80%以上历史遗留矿山。', '矿山生态监测技术发展迅速，人工智能技术的应用为精准监测提供了新途径。', '概念验证', '产品级', 'rejected', '2025-09-12 09:15:00', '2025-09-19 14:00:00', 'user-002', '研究内容与现有项目存在重复，建议调整研究方向后重新申报。', NOW());

-- =====================================================
-- 8. 项目数据
-- =====================================================
INSERT INTO prj_project (id, code, name, type, type_name, field, expected_level, breakthrough_types, status, status_name, total_budget, gov_funding, self_funding, start_date, end_date, duration, batch_id, lead_institution_id, lead_institution_name, leader_id, leader_name, leader_title, leader_phone, leader_email, leader_id_card, background, objectives, content, methodology, expected_results, key_indicators, duplicate_rate, review_score, has_midterm_check, midterm_check_date, has_annual_check, annual_check_date, submitted_at, approved_at, created_at, updated_at) VALUES
('proj-001', '2025KY001', '高精度北斗定位关键技术研究', 'youth', '青年项目', '测绘地理信息', '国内领先', '卡脖子技术,填补国内空白技术', 'signed', '已签订', 1000000.00, 800000.00, 200000.00, '2025-02-02', '2027-02-02', 24, 'batch-001', 'inst-002', '湖南省第三测绘院', 'user-003', '胡歌', '高级工程师', '13111929202', 'huge@hndsch.com', '430625199203112931', '研究内容：1.高温地热井高效钻进技术与快速破岩路径钻进作用下高温岩体的受力模型及损伤规律；地热储层钻进破岩方法及碎岩机理；高温地热井高效钻进技术。2.高温地热井井壁变形规律与稳定技术。高温地热井井壁稳定的力学推演与数理建模，围岩流变时效作用机理，以及井壁失稳规律与稳定技术；3.高温地热井岩体裂隙网络构建与热量高效利用技术。预期成果：1.掌握高温岩体高效钻进技术，提出高温地热井井壁稳定技术工艺参数，形成地热井高效取热与综合利用技术，打造示范应用体系；2.发表高水平论文4—5篇；3.获授权国家发明专利2—3项；4.获得国家及省部级项目2—3项，奖励1—2项。', '突破现有技术瓶颈，提升北斗定位精度至厘米级', '采用多系统融合定位、抗多路径算法等先进技术', '采用卷积神经网络、注意力机制等先进技术', '1.形成北斗高精度定位核心算法2-3套\n2.发表高水平论文4-5篇\n3.申请发明专利2-3项', '定位精度优于2cm,收敛时间小于30秒,可用性大于99%', 12.16, 92, true, '2026-02-01', true, '2025-12-31', '2025-02-02 10:00:00', '2025-08-17 15:30:00', NOW(), NOW()),
('proj-002', '2025ZD001', '自然资源三维实景数据采集与建模技术研究', 'major', '重大项目', '测绘地理信息', '国内领先', '卡脖子技术', 'signed', '已签订', 8000000.00, 6000000.00, 2000000.00, '2025-02-02', '2027-02-02', 24, 'batch-001', 'inst-002', '湖南省第三测绘院', 'user-003', '胡歌', '高级工程师', '13111929202', 'huge@hndsch.com', '430625199203112931', '三维实景数据是数字孪生国土建设的重要基础', '研发高效三维实景采集建模系统', '无人机倾斜摄影、点云融合、模型轻量化', '采用深度学习、点云处理等技术', '研发三维实景采集建模软件系统1套', '建模效率提升50%,模型精度优于5cm', 8.52, 95, true, '2026-02-01', true, '2025-12-31', '2025-02-02 11:00:00', '2025-08-17 16:00:00', NOW(), NOW()),
('proj-003', '2025ZD002', '耕地质量监测与预警系统研究', 'major', '重大项目', '土地资源管理', '国内领先', '关键共性技术', 'signed', '已签订', 2000000.00, 1500000.00, 500000.00, '2025-02-02', '2027-02-02', 24, 'batch-001', 'inst-002', '湖南省第三测绘院', 'user-003', '胡歌', '高级工程师', '13111929202', 'huge@hndsch.com', '430625199203112931', '耕地保护是国家粮食安全的重要保障', '建立耕地质量监测预警体系', '遥感监测、评价模型、预警系统', '多源数据融合分析', '耕地质量监测预警系统1套', '监测覆盖率100%,预警准确率90%', 5.23, 89, true, '2026-02-01', true, '2025-12-31', '2025-02-02 14:00:00', '2025-08-17 17:00:00', NOW(), NOW()),
('proj-004', '2025YY001', '国土空间智能规划辅助决策系统', 'application', '应用技术类', '国土空间规划', '国内领先', '卡脖子技术', 'pending', '未签订', 1000000.00, 800000.00, 200000.00, '2025-02-02', '2027-02-02', 24, 'batch-001', 'inst-002', '湖南省第三测绘院', 'user-003', '胡歌', '高级工程师', '13111929202', 'huge@hndsch.com', '430625199203112931', '国土空间规划需要智能化辅助决策支持', '研发智能规划辅助决策系统', '空间分析、智能优化、可视化', '人工智能、大数据分析', '智能规划辅助决策系统1套', '决策效率提升60%', 15.67, NULL, false, NULL, false, NULL, '2025-02-02 15:00:00', NULL, NOW(), NOW()),
('proj-005', '2025YY002', '矿山生态修复智能监测评估系统', 'application', '应用技术类', '生态保护修复', '国内先进', '前沿颠覆性技术', 'pending', '未签订', 1000000.00, 800000.00, 200000.00, '2025-02-02', '2027-02-02', 24, 'batch-001', 'inst-002', '湖南省第三测绘院', 'user-003', '胡歌', '高级工程师', '13111929202', 'huge@hndsch.com', '430625199203112931', '矿山生态修复监测需求迫切', '研发矿山生态修复监测评估系统', '遥感监测、智能评估、决策支持', '深度学习、遥感分析', '监测评估系统1套', '监测覆盖全省80%历史遗留矿山', 18.34, NULL, false, NULL, false, NULL, '2025-02-02 16:00:00', NULL, NOW(), NOW()),
('proj-006', '2025BZ001', '测绘地理信息标准化体系研究', 'subsidy', '后补助项目', '测绘地理信息', '国内先进', '关键共性技术', 'pending', '未签订', 1000000.00, 800000.00, 200000.00, '2025-02-02', '2026-02-02', 12, 'batch-001', 'inst-002', '湖南省第三测绘院', 'user-003', '胡歌', '高级工程师', '13111929202', 'huge@hndsch.com', '430625199203112931', '测绘地理信息标准化建设需要加强', '完善测绘地理信息标准体系', '标准研究、体系构建、应用验证', '文献研究、专家咨询', '地方标准2-3项', '标准应用覆盖率80%', 6.78, NULL, false, NULL, false, NULL, '2025-02-02 17:00:00', NULL, NOW(), NOW()),
('proj-007', '2025BZ002', '自然资源数据共享服务平台建设', 'subsidy', '后补助项目', '测绘地理信息', '国内先进', '其他', 'pending', '未签订', 1000000.00, 800000.00, 200000.00, '2025-02-02', '2026-02-02', 12, 'batch-001', 'inst-002', '湖南省第三测绘院', 'user-003', '胡歌', '高级工程师', '13111929202', 'huge@hndsch.com', '430625199203112931', '自然资源数据共享需求日益增长', '建设数据共享服务平台', '数据整合、服务发布、共享管理', '微服务架构、云计算', '共享服务平台1套', '数据服务响应时间小于2秒', 4.56, NULL, false, NULL, false, NULL, '2025-02-02 18:00:00', NULL, NOW(), NOW());

-- 项目成员
INSERT INTO prj_project_member (id, project_id, user_id, name, institution, title, role, phone, email, id_card, work_months, responsibilities) VALUES
('member-001', 'proj-001', 'user-003', '胡歌', '湖南省第三测绘院', '高级工程师', 'leader', '13111929202', 'huge@hndsch.com', '430625199203112931', 24, '项目总体设计与技术路线制定'),
('member-002', 'proj-001', NULL, '张三', '湖南省第三测绘院', '工程师', 'member', '13800001001', 'zhangsan@hndsch.com', '430102199501011234', 20, '北斗信号处理算法研究'),
('member-003', 'proj-001', NULL, '李四', '湖南省第三测绘院', '助理工程师', 'member', '13800001002', 'lisi@hndsch.com', '430102199601011234', 18, '系统开发与测试'),
('member-004', 'proj-002', 'user-003', '胡歌', '湖南省第三测绘院', '高级工程师', 'leader', '13111929202', 'huge@hndsch.com', '430625199203112931', 24, '项目负责人'),
('member-005', 'proj-002', 'user-004', '李明', '中南大学', '教授', 'member', '13800000004', 'liming@csu.edu.cn', '430102199004041234', 12, '算法研究指导'),
('member-006', 'proj-003', 'user-003', '胡歌', '湖南省第三测绘院', '高级工程师', 'leader', '13111929202', 'huge@hndsch.com', '430625199203112931', 24, '项目负责人');

-- =====================================================
-- 9. 任务书数据
-- =====================================================
INSERT INTO prj_task_book (id, project_id, code, status, status_name, objectives, content, methodology, expected_results, budget_total, budget_gov, budget_self, start_date, end_date, has_midterm_check, midterm_check_date, has_annual_check, annual_check_date, lead_institution_opinion, lead_institution_sign_date, supervisor_opinion, supervisor_sign_date, task_book_file, signed_file, submitted_at, approved_at, created_at, updated_at) VALUES
('task-001', 'proj-001', 'RWS2025001', 'signed', '已签订', '突破北斗高精度定位关键技术', '1.多路径抑制算法研究\n2.多系统融合定位\n3.实时定位服务系统', '理论研究与工程实践相结合', '核心算法2-3套，论文4-5篇，专利2-3项', 1000000.00, 800000.00, 200000.00, '2025-02-02', '2027-02-02', true, '2026-02-01', true, '2025-12-31', '同意立项，请按计划执行', '2025-01-20', '同意，加强过程管理', '2025-01-25', '/files/task-book-001.pdf', '/files/task-book-001-signed.pdf', '2025-01-15 10:00:00', '2025-01-25 15:00:00', NOW(), NOW()),
('task-002', 'proj-002', 'RWS2025002', 'signed', '已签订', '研发三维实景采集建模系统', '1.无人机数据采集\n2.点云融合建模\n3.模型轻量化', '技术攻关与示范应用', '软件系统1套，论文3-4篇，软著2-3项', 8000000.00, 6000000.00, 2000000.00, '2025-02-02', '2027-02-02', true, '2026-02-01', true, '2025-12-31', '同意立项', '2025-01-22', '同意', '2025-01-28', '/files/task-book-002.pdf', '/files/task-book-002-signed.pdf', '2025-01-18 11:00:00', '2025-01-28 16:00:00', NOW(), NOW()),
('task-003', 'proj-003', 'RWS2025003', 'signed', '已签订', '建立耕地质量监测预警体系', '1.指标体系构建\n2.监测技术研究\n3.预警系统开发', '多源数据融合分析', '监测预警系统1套，论文4-5篇', 2000000.00, 1500000.00, 500000.00, '2025-02-02', '2027-02-02', true, '2026-02-01', true, '2025-12-31', '同意立项', '2025-01-23', '同意', '2025-01-29', '/files/task-book-003.pdf', '/files/task-book-003-signed.pdf', '2025-01-19 14:00:00', '2025-01-29 17:00:00', NOW(), NOW());

-- 任务书子任务
INSERT INTO prj_task_item (id, task_book_id, project_name, task_code, task_type, task_name, description, responsible_institution, responsible_person, start_date, end_date, deliverables, status, sort_order, created_at) VALUES
('item-001', 'task-001', '高精度北斗定位关键技术研究', 'RW202502001', '里程碑节点', '项目申报', '完成项目申报材料编制和提交', '湖南省第三测绘院', '管理员', '2025-02-02', '2025-03-01', '申报书', 'completed', 1, NOW()),
('item-002', 'task-001', '高精度北斗定位关键技术研究', 'RW202502001', '普通任务', '任务分配', '分解项目任务并分配到人', '湖南省第三测绘院', '管理员', '2025-02-02', '2025-03-15', '任务分配表', 'completed', 2, NOW()),
('item-003', 'task-001', '高精度北斗定位关键技术研究', 'RW202502001', '里程碑节点', '项目验收', '完成项目验收', '湖南省第三测绘院', '管理员', '2027-01-01', '2027-02-02', '验收报告', 'pending', 3, NOW()),
('item-004', 'task-001', '高精度北斗定位关键技术研究', 'RW202502001', '普通任务', '项目成果', '整理项目成果材料', '湖南省第三测绘院', '管理员', '2027-01-15', '2027-02-02', '成果材料', 'pending', 4, NOW()),
('item-005', 'task-001', '高精度北斗定位关键技术研究', 'RW202502001', '里程碑节点', '成果应用', '推广应用项目成果', '湖南省第三测绘院', '管理员', '2027-02-01', '2027-02-28', '应用报告', 'pending', 5, NOW()),
('item-006', 'task-002', '自然资源三维实景数据采集与建模技术研究', 'RW202502002', '里程碑节点', '项目申报', '完成项目申报', '湖南省第三测绘院', '管理员', '2025-02-02', '2025-03-01', '申报书', 'completed', 1, NOW()),
('item-007', 'task-002', '自然资源三维实景数据采集与建模技术研究', 'RW202502002', '普通任务', '任务分配', '分解并分配任务', '湖南省第三测绘院', '管理员', '2025-02-02', '2025-03-15', '任务分配表', 'completed', 2, NOW()),
('item-008', 'task-002', '自然资源三维实景数据采集与建模技术研究', 'RW202502002', '里程碑节点', '项目验收', '完成项目验收', '湖南省第三测绘院', '管理员', '2027-01-01', '2027-02-02', '验收报告', 'pending', 3, NOW());

-- =====================================================
-- 10. 中期检查数据
-- =====================================================
INSERT INTO prj_midterm_check (id, project_id, project_code, project_name, check_year, status, status_name, progress_summary, completed_work, problems, next_plan, budget_used, budget_usage_rate, deliverables_completed, deliverables_summary, self_evaluation, attachments, submitted_at, review_time, reviewer_id, reviewer_name, review_opinion, review_result, created_at, updated_at) VALUES
('mid-001', 'proj-001', '2025KY001', '高精度北斗定位关键技术研究', 2025, 'pending', '待提交', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
('mid-002', 'proj-002', '2025ZD001', '自然资源三维实景数据采集与建模技术研究', 2025, 'pending', '待提交', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
('mid-003', 'proj-003', '2025ZD002', '耕地质量监测与预警系统研究', 2025, 'submitted', '已提交', '项目进展顺利，已完成第一阶段研究任务', '1.完成耕地质量评价指标体系设计\n2.完成遥感数据采集与预处理\n3.完成监测模型初步构建', '数据获取渠道有限，部分历史数据缺失', '1.继续完善监测模型\n2.开展实地验证\n3.开发预警系统原型', 450000.00, 30.0, '指标体系1套,技术报告1份', '已完成指标体系设计和技术方案编制', '项目进展良好，按计划推进', '/files/mid-003-report.pdf', '2025-08-15 10:00:00', NULL, NULL, NULL, NULL, NULL, NOW(), NOW());

-- =====================================================
-- 11. 年度检查数据
-- =====================================================
INSERT INTO prj_annual_check (id, project_id, project_code, project_name, check_year, status, status_name, annual_summary, main_achievements, problems, next_year_plan, budget_annual, budget_used, papers_published, patents_applied, awards_received, talent_training, attachments, submitted_at, review_time, reviewer_id, reviewer_name, review_opinion, review_result, created_at, updated_at) VALUES
('annual-001', 'proj-001', '2025KY001', '高精度北斗定位关键技术研究', 2025, 'pending', '待提交', NULL, NULL, NULL, NULL, 400000.00, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
('annual-002', 'proj-002', '2025ZD001', '自然资源三维实景数据采集与建模技术研究', 2025, 'pending', '待提交', NULL, NULL, NULL, NULL, 3000000.00, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW());

-- =====================================================
-- 12. 变更申请数据
-- =====================================================
INSERT INTO prj_change_request (id, project_id, project_code, project_name, change_type, change_reason, original_content, changed_content, attachments, status, status_name, submitted_at, review_time, reviewer_id, reviewer_name, review_opinion, created_at, updated_at) VALUES
('change-001', 'proj-001', '2025KY001', '高精度北斗定位关键技术研究', 'member', '项目组成员工作调动', '原成员：张三、李四、王五', '变更后：张三、李四、赵六', '/files/change-001.pdf', 'approved', '已通过', '2025-06-01 10:00:00', '2025-06-05 15:00:00', 'user-002', '张监管', '同意变更申请', NOW(), NOW()),
('change-002', 'proj-002', '2025ZD001', '自然资源三维实景数据采集与建模技术研究', 'duration', '受外部因素影响需延期', '原计划结束时间：2027-02-02', '申请延期至：2027-08-02', '/files/change-002.pdf', 'pending', '待审核', '2025-09-10 14:00:00', NULL, NULL, NULL, NULL, NOW(), NOW());

-- =====================================================
-- 13. 项目验收数据
-- =====================================================
INSERT INTO prj_acceptance (id, project_id, project_code, project_name, acceptance_type, status, status_name, completion_summary, main_achievements, innovation_points, economic_benefits, social_benefits, problems_and_suggestions, self_evaluation_score, attachments, submitted_at, expert_review_time, expert_opinion, expert_score, final_review_time, final_opinion, final_result, certificate_no, certificate_date, created_at, updated_at) VALUES
('accept-001', 'proj-001', '2025KY001', '高精度北斗定位关键技术研究', 'final', 'pending', '待提交', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
('accept-002', 'proj-002', '2025ZD001', '自然资源三维实景数据采集与建模技术研究', 'final', 'pending', '待提交', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW());

-- =====================================================
-- 14. 成果数据
-- =====================================================
INSERT INTO prj_achievement (id, project_id, project_code, project_name, achievement_type, name, description, authors, completion_date, publication_info, patent_no, certificate_no, award_level, award_organization, attachments, status, status_name, submitted_at, review_time, reviewer_id, review_opinion, created_at, updated_at) VALUES
('achv-001', 'proj-001', '2025KY001', '高精度北斗定位关键技术研究', 'paper', '基于深度学习的北斗多路径抑制算法研究', '提出了一种基于深度学习的北斗信号多路径抑制新算法', '胡歌,张三,李四', '2025-06-15', '测绘学报, 2025, 54(6): 1001-1010', NULL, NULL, NULL, NULL, '/files/paper-001.pdf', 'published', '已发表', '2025-06-20 10:00:00', '2025-06-25 15:00:00', 'user-002', '成果符合要求', NOW(), NOW()),
('achv-002', 'proj-001', '2025KY001', '高精度北斗定位关键技术研究', 'patent', '一种北斗高精度定位方法及系统', '本发明提供了一种北斗高精度定位方法', '胡歌,张三', '2025-08-01', NULL, 'CN202510123456.7', NULL, NULL, NULL, '/files/patent-001.pdf', 'pending', '审核中', '2025-08-05 11:00:00', NULL, NULL, NULL, NOW(), NOW()),
('achv-003', 'proj-002', '2025ZD001', '自然资源三维实景数据采集与建模技术研究', 'software', '三维实景快速建模软件V1.0', '实现了无人机倾斜摄影数据的快速三维建模', '胡歌,李明,王芳', '2025-07-20', NULL, NULL, '2025SR0123456', NULL, NULL, '/files/software-001.pdf', 'registered', '已登记', '2025-07-25 14:00:00', '2025-07-30 10:00:00', 'user-002', '软件著作权已登记', NOW(), NOW());

-- =====================================================
-- 15. 共享资源数据
-- =====================================================

-- 科研仪器
INSERT INTO res_equipment (id, name, model, category, field, institution_id, institution_name, department, manager, manager_phone, purchase_date, original_value, current_value, location, description, usage_rules, is_shared, shared_price, status, image_url, created_at) VALUES
('equip-001', '高精度GNSS接收机', 'Trimble R12', '测量仪器', '测绘地理信息', 'inst-002', '湖南省第三测绘院', '测绘技术部', '胡歌', '13111929202', '2023-06-15', 350000.00, 300000.00, '实验楼A301', '支持北斗三号全频点信号接收，定位精度优于8mm+1ppm', '每次使用前需预约，使用后需登记', true, 500.00, 'available', '/images/equip-001.jpg', NOW()),
('equip-002', '无人机航测系统', 'DJI M350 RTK', '航测设备', '测绘地理信息', 'inst-002', '湖南省第三测绘院', '航测部', '张三', '13800001001', '2024-01-20', 180000.00, 170000.00, '实验楼B201', '专业航测无人机，搭载五镜头相机，支持RTK定位', '需持有无人机驾照，提前3天预约', true, 800.00, 'available', '/images/equip-002.jpg', NOW()),
('equip-003', '三维激光扫描仪', 'Leica RTC360', '扫描仪', '测绘地理信息', 'inst-004', '中南大学测绘与遥感学院', '测绘系', '李明', '13800000004', '2022-09-10', 680000.00, 550000.00, '测绘楼C102', '高速三维激光扫描仪，扫描速度200万点/秒', '需经过培训后方可使用', true, 1000.00, 'available', '/images/equip-003.jpg', NOW()),
('equip-004', '高性能计算服务器', 'Dell PowerEdge R750', '计算设备', '计算机科学', 'inst-002', '湖南省第三测绘院', '信息中心', '王工', '13800001003', '2024-03-01', 250000.00, 240000.00, '数据中心', '用于遥感影像处理和空间分析计算', '需提交计算任务申请', true, 200.00, 'available', '/images/equip-004.jpg', NOW()),
('equip-005', '全站仪', 'Leica TS16', '测量仪器', '测绘地理信息', 'inst-007', '湖南省测绘科技研究所', '工程部', '孙燕', '13800000010', '2021-05-20', 280000.00, 200000.00, '仪器室', '高精度全站仪，角度精度1秒', '需签订借用协议', true, 300.00, 'in_use', '/images/equip-005.jpg', NOW());

-- 基础数据
INSERT INTO res_data (id, name, data_type, field, format, size, coverage, resolution, acquisition_date, institution_id, institution_name, description, usage_scope, is_shared, download_count, status, preview_url, created_at) VALUES
('data-001', '湖南省2024年高分辨率遥感影像', '遥感影像', '测绘地理信息', 'TIFF', '2.5TB', '湖南省全境', '0.5米', '2024-06-30', 'inst-002', '湖南省第三测绘院', '覆盖湖南省全境的高分辨率卫星遥感影像', '科研、规划', true, 156, 'available', '/preview/data-001.jpg', NOW()),
('data-002', '长沙市三维城市模型', '三维模型', '测绘地理信息', 'OSGB', '800GB', '长沙市主城区', 'LOD3', '2024-03-15', 'inst-002', '湖南省第三测绘院', '长沙市主城区精细三维模型', '城市规划、应急管理', true, 89, 'available', '/preview/data-002.jpg', NOW()),
('data-003', '湖南省第三次国土调查数据', '矢量数据', '土地资源管理', 'SHP', '15GB', '湖南省全境', '1:2000', '2023-12-31', 'inst-001', '湖南省自然资源厅', '湖南省第三次全国国土调查成果数据', '科研、管理', true, 234, 'available', '/preview/data-003.jpg', NOW()),
('data-004', '湖南省DEM数据', '地形数据', '测绘地理信息', 'GeoTIFF', '50GB', '湖南省全境', '5米', '2023-06-30', 'inst-002', '湖南省第三测绘院', '湖南省5米分辨率数字高程模型', '科研、规划、分析', true, 312, 'available', '/preview/data-004.jpg', NOW()),
('data-005', '湖南省矿产资源分布图', '专题数据', '地质矿产', 'SHP', '2GB', '湖南省全境', '1:50000', '2022-12-31', 'inst-001', '湖南省自然资源厅', '湖南省主要矿产资源分布数据', '科研、规划', true, 78, 'available', '/preview/data-005.jpg', NOW());

-- 专业软件
INSERT INTO res_software (id, name, version, category, developer, license_type, license_count, license_used, institution_id, institution_name, description, features, system_requirements, is_shared, status, created_at) VALUES
('soft-001', 'ArcGIS Pro', '3.2', 'GIS软件', 'Esri', '教育版', 50, 35, 'inst-004', '中南大学测绘与遥感学院', '专业GIS软件平台', '空间分析、制图、三维可视化', 'Windows 10/11, 16GB RAM, 独立显卡', true, 'available', NOW()),
('soft-002', 'ENVI', '5.7', '遥感软件', 'L3Harris', '商业版', 20, 12, 'inst-002', '湖南省第三测绘院', '遥感影像处理软件', '影像处理、分类、变化检测', 'Windows 10/11, 32GB RAM', true, 'available', NOW()),
('soft-003', 'Pix4Dmapper', '4.8', '摄影测量软件', 'Pix4D', '商业版', 10, 6, 'inst-002', '湖南省第三测绘院', '无人机影像处理软件', '航测数据处理、三维建模', 'Windows 10/11, 64GB RAM, RTX显卡', true, 'available', NOW()),
('soft-004', 'ContextCapture', '23.0', '三维建模软件', 'Bentley', '商业版', 5, 3, 'inst-002', '湖南省第三测绘院', '实景三维建模软件', '倾斜摄影建模、点云处理', 'Windows 10/11, 128GB RAM, 专业显卡', true, 'available', NOW()),
('soft-005', 'CASS', '11.0', '测绘软件', '南方测绘', '商业版', 30, 20, 'inst-007', '湖南省测绘科技研究所', '数字测图软件', '地形测图、工程测量', 'Windows 7/10/11, 8GB RAM', true, 'available', NOW());

-- 资源共享记录
INSERT INTO res_share_record (id, resource_type, resource_id, resource_name, applicant_id, applicant_name, applicant_institution, purpose, start_date, end_date, status, status_name, review_time, reviewer_id, review_opinion, created_at) VALUES
('share-001', 'equipment', 'equip-001', '高精度GNSS接收机', 'user-004', '李明', '中南大学测绘与遥感学院', '科研项目外业测量', '2025-09-01', '2025-09-15', 'approved', '已通过', '2025-08-25 10:00:00', 'user-003', '同意借用', NOW()),
('share-002', 'data', 'data-001', '湖南省2024年高分辨率遥感影像', 'user-005', '王芳', '湖南大学资源与环境学院', '耕地监测研究', '2025-08-01', '2026-08-01', 'approved', '已通过', '2025-07-28 15:00:00', 'user-002', '同意使用', NOW()),
('share-003', 'software', 'soft-002', 'ENVI', 'user-009', '赵磊', '湖南科技大学', '遥感课程教学', '2025-09-01', '2025-12-31', 'pending', '待审核', NULL, NULL, NULL, NOW());

-- =====================================================
-- 16. 更新统计数据
-- =====================================================
UPDATE prj_batch SET project_count = (SELECT COUNT(*) FROM prj_project WHERE batch_id = prj_batch.id);

-- 完成提示
SELECT '样例数据初始化完成！' AS message;
SELECT '用户账号：admin/supervisor/huge/liming/wangfang/expert_zhang/expert_liu/expert_chen' AS accounts;
SELECT '统一密码：admin123' AS password;
