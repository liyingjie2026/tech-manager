-- =============================================
-- 科研项目管理系统 - 完整样例数据
-- 版本: 6.0 (修复所有第31节往后的SQL执行错误)
-- 更新时间: 2024-12-24
-- 说明: 修复所有字段类型不匹配、重复表定义、字段不对应等问题
-- =============================================

-- 1. 用户数据 (10个测试账号)
-- Fixed gender from 'male'/'female' to '1'/'2', status from 'active' to 1
-- Fixed duplicate user_id in expert data and added expert user_type
INSERT INTO sys_user (id, username, password, real_name, phone, email, id_card, gender, user_type, institution_id, institution_name, department, title, role_id, role_name, status, deleted) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员', '13800138001', 'admin@system.com', '110101199001011234', '1', 'admin', NULL, NULL, '信息中心', '系统管理员', 1, '超级管理员', 1, 0),
(2, 'supervisor01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '监管员甲', '13800138002', 'supervisor01@system.com', '110101199002021235', '2', 'supervisor', NULL, NULL, '监管部门', '监管员', 2, '监管员', 1, 0),
(3, 'supervisor02', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '监管员乙', '13800138003', 'supervisor02@system.com', '110101199003031236', '1', 'supervisor', NULL, NULL, '监管部门', '监管员', 2, '监管员', 1, 0),
(4, 'institution01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '科研机构A', '13800138004', 'institution01@research.com', '110101199004041237', '1', 'institution', 1, '清华大学', '科研处', '科研主管', 3, '机构用户', 1, 0),
(5, 'institution02', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '科研机构B', '13800138005', 'institution02@research.com', '110101199005051238', '2', 'institution', 2, '北京大学', '科研处', '科研主管', 3, '机构用户', 1, 0),
(6, 'expert01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '专家赵六', '13800138006', 'zhaoliu@expert.com', '110101197001011239', '1', 'expert', NULL, NULL, '中科院计算所', '研究员', 4, '专家', 1, 0),
(7, 'expert02', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '专家钱七', '13800138007', 'qianqi@expert.com', '110101197102021240', '2', 'expert', NULL, NULL, '中科院自动化所', '研究员', 4, '专家', 1, 0),
(8, 'expert03', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '专家孙八', '13800138008', 'sunba@expert.com', '110101197203031241', '1', 'expert', NULL, NULL, '清华大学软件学院', '教授', 4, '专家', 1, 0),
(9, 'expert04', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '专家周九', '13800138009', 'zhoujiu@expert.com', '330101197304041242', '1', 'expert', NULL, NULL, '浙江大学信息学院', '教授', 4, '专家', 1, 0),
(10, 'expert05', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '专家吴十', '13800138010', 'wushi@expert.com', '310101197405051243', '2', 'expert', NULL, NULL, '上海交通大学电子系', '副教授', 4, '专家', 1, 0);

-- 2. 角色数据
-- Fixed status from 'active' to 1
INSERT INTO sys_role (id, role_code, role_name, description, sort, status, deleted) VALUES
(1, 'admin', '系统管理员', '系统最高权限管理员', 1, 1, 0),
(2, 'supervisor', '监管人员', '科技项目监管人员', 2, 1, 0),
(3, 'researcher', '科研人员', '项目申报和执行人员', 3, 1, 0),
(4, 'expert', '评审专家', '项目评审专家', 4, 1, 0),
(5, 'finance', '财务人员', '项目财务管理人员', 5, 1, 0);

-- 3. 机构数据 (4个单位)
-- Fixed audit_status from 'approved' to 1
INSERT INTO res_institution (id, code, name, short_name, type, credit_code, legal_person, legal_person_phone, contact_person, contact_phone, contact_email, province, city, district, address, research_field, audit_status, status, deleted) VALUES
(1, 'INST001', '清华大学', '清华', 'university', '911100007101234567', '李校长', '010-62781234', '张主任', '010-62785678', 'contact@tsinghua.edu.cn', '北京市', '北京市', '海淀区', '清华园1号', '计算机科学;人工智能;自动化', 1, 1, 0),
(2, 'INST002', '北京大学', '北大', 'university', '911100007101234568', '王校长', '010-62751234', '李主任', '010-62755678', 'contact@pku.edu.cn', '北京市', '北京市', '海淀区', '颐和园路5号', '物理学;化学;生物学', 1, 1, 0),
(3, 'INST003', '浙江大学', '浙大', 'university', '913300007101234569', '陈校长', '0571-87951234', '周主任', '0571-87955678', 'contact@zju.edu.cn', '浙江省', '杭州市', '西湖区', '余杭塘路866号', '信息技术;材料科学', 1, 1, 0),
(4, 'INST004', '上海交通大学', '上交', 'university', '913100007101234570', '刘校长', '021-54741234', '吴主任', '021-54745678', 'contact@sjtu.edu.cn', '上海市', '上海市', '闵行区', '东川路800号', '电子工程;机械工程', 1, 1, 0);

-- 4. 字典数据 (20条核心配置)
-- Fixed enabled from true/false to 1/0 to match TINYINT(1) type
INSERT INTO sys_dictionary (id, parent_id, dict_type, dict_name, item_code, item_label, item_value, level, sort, enabled) VALUES
-- 项目类型字典类型（level=1根节点）
(1, 0, 'project_type', '项目类型', 'project_type', '项目类型', 'project_type', 1, 1, 1),
-- 项目类型的子项（level=2）
(2, 1, 'project_type', '项目类型', 'basic_research', '基础研究', 'basic_research', 2, 1, 1),
(3, 1, 'project_type', '项目类型', 'applied_research', '应用研究', 'applied_research', 2, 2, 1),
(4, 1, 'project_type', '项目类型', 'experimental_development', '试验发展', 'experimental_development', 2, 3, 1),

-- 研究领域字典类型（level=1根节点）
(5, 0, 'research_field', '研究领域', 'research_field', '研究领域', 'research_field', 1, 2, 1),
-- 研究领域的子项（level=2）
(6, 5, 'research_field', '研究领域', 'computer_science', '计算机科学', 'computer_science', 2, 1, 1),
(7, 5, 'research_field', '研究领域', 'artificial_intelligence', '人工智能', 'artificial_intelligence', 2, 2, 1),
(8, 5, 'research_field', '研究领域', 'automation', '自动化', 'automation', 2, 3, 1),
(9, 5, 'research_field', '研究领域', 'physics', '物理学', 'physics', 2, 4, 1),
(10, 5, 'research_field', '研究领域', 'chemistry', '化学', 'chemistry', 2, 5, 1),
(11, 5, 'research_field', '研究领域', 'biology', '生物学', 'biology', 2, 6, 1),
(12, 5, 'research_field', '研究领域', 'environmental', '环境科学', 'environmental', 2, 7, 1),

-- 专业学科字典类型（level=1根节点，支持层级）
(20, 0, 'major_discipline', '专业学科', 'major_discipline', '专业学科', 'major_discipline', 1, 3, 1),
-- 一级学科（level=2）
(21, 20, 'major_discipline', '专业学科', 'engineering', '工学', 'engineering', 2, 1, 1),
(22, 20, 'major_discipline', '专业学科', 'science', '理学', 'science', 2, 2, 1),
(23, 20, 'major_discipline', '专业学科', 'medicine', '医学', 'medicine', 2, 3, 1),
-- 二级学科-工学下（level=3）
(24, 21, 'major_discipline', 'major_discipline', 'computer', '计算机科学与技术', 'computer', 3, 1, 1),
(25, 21, 'major_discipline', 'major_discipline', 'electronics', '电子信息工程', 'electronics', 3, 2, 1),
(26, 21, 'major_discipline', 'major_discipline', 'mechanical', '机械工程', 'mechanical', 3, 3, 1),
-- 二级学科-理学下（level=3）
(27, 22, 'major_discipline', 'major_discipline', 'mathematics', '数学', 'mathematics', 3, 1, 1),
(28, 22, 'major_discipline', 'major_discipline', 'physics_sub', '物理学', 'physics_sub', 3, 2, 1),
(29, 22, 'major_discipline', 'major_discipline', 'chemistry_sub', '化学', 'chemistry_sub', 3, 3, 1),

-- 组织机构字典类型（level=1根节点，支持层级）
(30, 0, 'organization', '组织机构', 'organization', '组织机构', 'organization', 1, 4, 1),
-- 一级机构（level=2）
(31, 30, 'organization', 'organization', 'university', '高校', 'university', 2, 1, 1),
(32, 30, 'organization', 'organization', 'research_institute', '科研院所', 'research_institute', 2, 2, 1),
(33, 30, 'organization', 'organization', 'enterprise', '企业', 'enterprise', 2, 3, 1),
-- 二级机构-高校下（level=3）
(34, 31, 'organization', 'organization', 'key_university', '重点大学', 'key_university', 3, 1, 1),
(35, 31, 'organization', 'organization', 'general_university', '普通高校', 'general_university', 3, 2, 1),
-- 二级机构-科研院所下（level=3）
(36, 32, 'organization', 'organization', 'academy_sciences', '科学院', 'academy_sciences', 3, 1, 1),
(37, 32, 'organization', 'organization', 'industry_institute', '行业研究所', 'industry_institute', 3, 2, 1);

-- 5. 需求数据 (3个招标需求)
-- Fixed type values, removed duplicate publish_time for rows 4 and 5. Added missing fields.
INSERT INTO prj_demand (id, demand_no, name, type, project_type, research_field, description, objective, budget, apply_start_date, apply_end_date, duration, publish_unit, contact_person, contact_phone, status, audit_status, publish_time) VALUES
(1, 'DEMAND2024001', '人工智能关键技术研究', 'open_bid', 'basic_research', 'artificial_intelligence', '研究深度学习、强化学习等人工智能关键技术', '突破人工智能核心算法，提升模型性能', 5000000.00, '2024-01-01', '2024-03-31', 36, '科技部', '张处长', '010-68511234', 'published', 'approved', '2024-01-01 09:00:00'),
(2, 'DEMAND2024002', '智能制造系统研发', 'invite_bid', 'applied_research', 'automation', '开发面向工业4.0的智能制造系统', '实现制造过程的智能化和自动化', 3000000.00, '2024-02-01', '2024-04-30', 24, '工信部', '李处长', '010-68512345', 'published', 'approved', '2024-02-01 09:00:00'),
(3, 'DEMAND2024003', '新材料研发与应用', 'entrust', 'experimental_development', 'chemistry', '研发高性能新材料并实现产业化应用', '开发具有自主知识产权的新材料', 8000000.00, '2024-03-01', '2025-03-31', 48, '科技部', '王主任', '010-68513456', 'published', 'approved', '2024-03-01 09:00:00'),
(4, 'XQ202400004', '智能交通管理系统研发', 'technology_development', 'applied_research', 'artificial_intelligence', '研发基于AI的智能交通管理系统', '实现实时交通流量分析和信号优化', 200.00, '2024-10-01', '2024-12-31', 12, '交通管理局', '王经理', '13900139000', 'published', 'approved', '2024-10-01 10:00:00'),
(5, 'XQ202400005', '绿色建筑材料开发', 'product_development', 'experimental_development', 'environmental', '开发新型绿色环保建筑材料', '降低建筑能耗，推动绿色建筑发展', 150.00, '2024-11-01', '2025-03-31', 10, '建设局', '李主任', '13900139001', 'published', 'approved', '2024-11-01 09:00:00');

-- 6. 项目数据 (10个项目，覆盖全流程各种状态)
-- Added project_batch and innovation_platform fields to all projects. Fixed status and workflow_stage values. Fixed duplicate_rate to 2 decimal places.
-- Added innovation_points and application_prospects columns to match prj_project table structure
INSERT INTO prj_project (id, project_no, name, project_batch, innovation_platform, project_type, project_category, research_field, demand_id, institution_id, institution_name, leader_id, leader_name, leader_phone, start_date, end_date, total_budget, apply_budget, self_budget, objective, content, expected_result, innovation_points, application_prospects, status, workflow_stage, submit_time, duplicate_rate, create_by, create_time) VALUES
(1, 'PRJ2024001', '深度学习算法优化研究', '202508自然资源科研（标准）项目', '第一工程中心', 'basic_research', 'national', 'artificial_intelligence', 1, 1, '清华大学', 3, '张三', '13900139001', '2024-06-01', '2027-05-31', 5000000.00, 4000000.00, 1000000.00, '提升深度学习算法效率和准确性', '研究新型神经网络架构，优化训练算法', '发表高水平论文5篇，申请发明专利3项', '提出了基于注意力机制的新型神经网络架构，显著提升训练效率30%以上', '可广泛应用于计算机视觉、自然语言处理等领域，具有重大产业应用价值', 'approved', 'executing', '2024-03-15 10:30:00', 8.50, 3, '2024-03-15 10:30:00'),
(2, 'PRJ2024002', '智能机器人控制系统', '202508自然资源科研（创新）项目', '科研实验室', 'applied_research', 'provincial', 'computer_science', 2, 1, '清华大学', 4, '李四', '13900139002', '2024-07-01', '2026-06-30', 3000000.00, 2500000.00, 500000.00, '开发高精度智能机器人控制系统', '研究机器人运动规划和控制算法', '完成原型系统开发，实现工业应用', '采用深度强化学习实现机器人自主决策，控制精度达到毫米级', '适用于工业制造、医疗手术、服务机器人等多个领域', 'preliminary_approved', 'taskbook_sign', '2024-04-10 14:20:00', 5.20, 4, '2024-04-10 14:20:00'),
(3, 'PRJ2024003', '量子计算应用研究', '202508自然资源科研（标准）项目', '技术研发中心', 'basic_research', 'national', 'physics', NULL, 2, '北京大学', 5, '王五', '13900139003', '2024-08-01', '2028-07-31', 10000000.00, 8000000.00, 2000000.00, '探索量子计算在实际问题中的应用', '研究量子算法和量子纠错技术', '突破量子计算关键技术，发表顶级论文', '首次实现50量子比特稳定纠错，错误率降低至0.1%以下', '为密码学、药物设计、金融建模等领域提供革命性计算能力', 'under_review', 'preliminary_review', '2024-05-20 09:15:00', 3.80, 5, '2024-05-20 09:15:00'),
(4, 'PRJ2024004', '新能源材料开发', '202508其他科研项目', '第一工程中心', 'experimental_development', 'enterprise', 'chemistry', 3, 3, '浙江大学', 9, '周九', '13900139004', '2024-09-01', '2028-08-31', 8000000.00, 6000000.00, 2000000.00, '开发高效新能源材料', '研究太阳能电池和储能材料', '实现材料产业化，获得经济效益', '开发出转化效率超过25%的钙钛矿太阳能电池材料，成本降低40%', '推动新能源产业升级，预计年产值可达50亿元', 'in_progress', 'application', '2024-06-01 11:00:00', 12.30, 9, '2024-06-01 11:00:00'),
(5, 'PRJ2024005', '大数据分析平台', '202508其他科研项目', '第一工程中心', 'applied_research', 'municipal', 'computer_science', NULL, 4, '上海交通大学', 10, '吴十', '13900139005', NULL, NULL, 2000000.00, 1500000.00, 500000.00, '构建企业级大数据分析平台', '开发分布式数据处理系统', '完成平台开发并推广应用', '基于流式计算架构，实现PB级数据实时处理，延迟小于100ms', '服务于金融、电商、物流等行业，市场规模超过100亿元', 'draft', 'application', NULL, NULL, 10, '2024-06-15 15:30:00'),
(6, 'PRJ2024006', '生物医药技术研究', '202508自然资源科研（标准）项目', '第二工程中心', 'basic_research', 'national', 'biology', NULL, 2, '北京大学', 5, '王五', '13900139003', '2024-10-01', '2027-09-30', 6000000.00, 5000000.00, 1000000.00, '研究新型生物医药技术', '开展基因编辑和蛋白质工程研究', '取得重大科研突破', 'CRISPR基因编辑脱靶效应难题，精准度提升至99.9%', '为遗传病治疗、肿瘤精准医疗提供新方案，惠及数百万患者', 'preliminary_review_passed', 'taskbook_preparation', '2024-07-01 10:00:00', 6.70, 5, '2024-07-01 10:00:00'),
(7, 'PRJ2024007', '智慧城市物联网', '202508自然资源科研（创新）项目', '科研实验室', 'applied_research', 'provincial', 'computer_science', NULL, 3, '浙江大学', 9, '周九', '13900139004', '2024-11-01', '2026-10-31', 4000000.00, 3000000.00, 1000000.00, '构建智慧城市物联网平台', '研究物联网关键技术和应用', '完成示范应用并推广', '边缘计算与云端协同的新型架构，能耗降低50%', '助力智慧城市建设，覆盖交通、环保、公共安全等多个领域', 'rejected', 'preliminary_review', '2024-07-15 14:30:00', 18.90, 9, '2024-07-15 14:30:00'),
(8, 'PRJ2024008', '5G通信技术研究', '202508自然资源科研（标准）项目', '技术研发中心', 'basic_research', 'national', 'physics', NULL, 4, '上海交通大学', 10, '吴十', '13900139005', '2024-12-01', '2027-11-30', 7000000.00, 6000000.00, 1000000.00, '研究5G通信关键技术', '开展高频通信和网络切片研究', '突破5G核心技术', '毫米波天线阵列技术，传输速率达到10Gbps', '支撑工业互联网、自动驾驶等新兴应用，经济价值巨大', 'pending_review', 'preliminary_review', '2024-08-01 09:00:00', 4.50, 10, '2024-08-01 09:00:00'),
(9, 'PRJ2024009', '区块链技术应用', '202508其他科研项目', '第一工程中心', 'applied_research', 'enterprise', 'computer_science', NULL, 1, '清华大学', 3, '张三', '13900139001', NULL, NULL, 3500000.00, 2800000.00, 700000.00, '研究区块链在金融领域的应用', '开发区块链底层平台和应用系统', '实现区块链商业化应用', '高性能共识算法，交易吞吐量提升100倍达到10万TPS', '可用于供应链金融、数字资产交易等场景，市场前景广阔', 'withdrawn', 'application', '2024-08-15 16:00:00', 22.10, 3, '2024-08-15 16:00:00'),
(10, 'PRJ2024010', '环境监测技术研发', '202508自然资源科研（标准）项目', '第二工程中心', 'experimental_development', 'provincial', 'environmental', NULL, 2, '北京大学', 5, '王五', '13900139003', '2025-01-01', '2027-12-31', 4500000.00, 3500000.00, 1000000.00, '开发智能环境监测系统', '研究传感器技术和数据分析方法', '实现环境实时监测', '集成多源传感器融合技术，监测精度提升至ppb级', '服务于环保监管、企业排放管理，助力碳达峰碳中和目标', 'completed', 'completed', '2024-09-01 10:30:00', 7.20, 5, '2024-09-01 10:30:00');

-- 7. 项目成员数据 (为已立项的项目添加团队成员)
-- Fixed field name from user_name to name to match prj_project_member table structure
-- Added deleted field
INSERT INTO prj_project_member (id, project_id, user_id, name, role, institution_id, institution_name, work_content, work_months, sort_order, create_time, deleted) VALUES
(1, 1, 3, '张三', 'leader', 1, '清华大学', '项目负责人，负责总体规划和技术把关', 18, 1, '2024-06-01 09:00:00', 0),
(2, 1, 4, '李四', 'member', 1, '清华大学', '负责算法设计和实现', 11, 2, '2024-06-01 09:00:00', 0),
(3, 2, 4, '李四', 'leader', 1, '清华大学', '项目负责人，负责系统设计', 14, 1, '2024-07-01 09:00:00', 0),
(4, 2, 3, '张三', 'member', 1, '清华大学', '提供技术指导', 5, 2, '2024-07-01 09:00:00', 0);

-- 8. 项目预算数据
-- Added deleted field and updated column names for consistency.
INSERT INTO prj_project_budget (id, project_id, category, item_name, apply_amount, self_amount, description, create_time, deleted) VALUES
(1, 1, 'equipment', '高性能计算服务器', 800.00, 200.00, '用于深度学习模型训练，5台服务器，单价20万', '2024-06-01 10:00:00', 0),
(2, 1, 'material', 'GPU显卡', 800.00, 200.00, '用于并行计算加速，20块显卡，单价5万', '2024-06-01 10:00:00', 0),
(3, 1, 'labor', '研究人员工资', 1200.00, 240.00, '项目团队人力成本，72人月，月薪2万', '2024-06-01 10:00:00', 0),
(4, 1, 'travel', '学术会议差旅费', 120.00, 30.00, '参加国际学术会议，15人次，单次1万', '2024-06-01 10:00:00', 0),
(5, 2, 'equipment', '工业机器人', 850.00, 150.00, '实验用工业机器人，2台，单价50万', '2024-07-01 10:00:00', 0),
(6, 2, 'material', '传感器和控制器', 650.00, 150.00, '控制系统核心部件，10套，单价8万', '2024-07-01 10:00:00', 0);

-- 9. 项目进度数据
-- Added deleted field. Fixed task_type and milestone values.
INSERT INTO prj_project_schedule (id, project_id, task_no, task_name, task_type, description, responsible_unit, responsible_person, start_date, end_date, milestone, sort_order, create_time, deleted) VALUES
(1, 1, 'T001', '需求分析与方案设计', 'design', '分析项目需求，设计技术方案，完成需求文档和技术方案', '清华大学计算机系', '张三', '2024-06-01', '2024-09-30', 'design_complete', 1, '2024-06-01 09:00:00', 0),
(2, 1, 'T002', '算法研发', 'development', '研发核心算法，完成原型系统，完成算法设计和实现', '清华大学计算机系', '李四', '2024-10-01', '2025-03-31', 'prototype_complete', 2, '2024-06-01 09:00:00', 0),
(3, 1, 'T003', '系统集成与测试', 'testing', '集成各模块，进行系统测试，完成系统集成和功能测试', '清华大学计算机系', '张三', '2025-04-01', '2025-09-30', 'testing_complete', 3, '2024-06-01 09:00:00', 0),
(4, 2, 'T001', '系统设计', 'design', '设计机器人控制系统架构，完成系统设计文档', '清华大学自动化系', '李四', '2024-07-01', '2024-12-31', 'design_complete', 1, '2024-07-01 09:00:00', 0);

-- 10. 项目绩效数据
-- Added deleted field. Fixed duplicate_rate to 2 decimal places.
INSERT INTO prj_project_performance (id, project_id, paper_count, patent_count, software_count, standard_count, talent_count, other_result, duplicate_rate, create_time, deleted) VALUES
(1, 1, 3, 1, 2, 0, 2, '发表高水平论文3篇，申请发明专利1项，完成软件著作权登记2项，培养研究生2名', 8.50, '2024-12-01 15:00:00', 0),
(2, 2, 1, 0, 1, 0, 1, '发表会议论文1篇，完成软件著作权1项，培养研究生1名', 5.20, '2024-12-01 15:00:00', 0);

-- 11. 项目附件数据
-- Added deleted field.
INSERT INTO prj_project_attachment (id, project_id, file_name, file_path, file_size, file_type, attachment_type, upload_time, upload_by, create_time, deleted) VALUES
(1, 1, '项目申报书.pdf', '/uploads/projects/1/application.pdf', 2048576, 'pdf', 'application', '2024-03-15 10:30:00', 3, '2024-03-15 10:30:00', 0),
(2, 1, '可行性研究报告.doc', '/uploads/projects/1/feasibility.doc', 1048576, 'doc', 'feasibility', '2024-03-15 10:35:00', 3, '2024-03-15 10:35:00', 0),
(3, 2, '技术方案.pdf', '/uploads/projects/2/technical_plan.pdf', 3145728, 'pdf', 'technical', '2024-04-10 14:20:00', 4, '2024-04-10 14:20:00', 0);

-- 12. 专家数据 (5位专家)
-- Fixed gender from 1/2 to '1'/'2'. Fixed available from 1 to true, 0 to false. Fixed audit_status from 'approved' to 1. Added deleted field.
-- Fixed available from true/false to 1/0 to match TINYINT type
-- Fixed duplicate user_id values - each expert now has unique user_id
INSERT INTO res_expert (id, user_id, expert_code, name, gender, birth_date, id_card, phone, email, organization, department, position, title, education, degree, graduate_school, major, research_field, expert_type, specialty, review_count, good_rate, available, audit_status, status, deleted) VALUES
(1, 6, 'EXP001', '赵六', '1', '1970-01-01', '110101197001011239', '13800138006', 'zhaoliu@expert.com', '中科院', '计算所', '研究员', '研究员', 'doctor', '博士', '清华大学', '计算机科学', 'artificial_intelligence;computer_science', 'technology', '深度学习;计算机视觉', 25, 96.00, 1, 1, 1, 0),
(2, 7, 'EXP002', '钱七', '2', '1971-02-02', '110101197102021240', '13800138007', 'qianqi@expert.com', '中科院', '自动化所', '研究员', '研究员', 'doctor', '博士', '北京大学', '自动化', 'automation;robotics', 'technology', '机器人控制;智能系统', 30, 94.50, 1, 1, 1, 0),
(3, 8, 'EXP003', '孙八', '1', '1972-03-03', '110101197203031241', '13800138008', 'sunba@expert.com', '清华大学', '软件学院', '教授', '教授', 'doctor', '博士', '麻省理工', '软件工程', 'computer_science;software_engineering', 'academic', '软件架构;系统设计', 40, 98.00, 1, 1, 1, 0),
(4, 9, 'EXP004', '周九', '1', '1973-04-04', '330101197304041242', '13800138009', 'zhoujiu@expert.com', '浙江大学', '信息学院', '教授', '教授', 'doctor', '博士', '浙江大学', '信息技术', 'computer_science;information_technology', 'academic', '大数据;云计算', 20, 95.00, 1, 1, 1, 0),
(5, 10, 'EXP005', '吴十', '2', '1974-05-05', '310101197405051243', '13800138010', 'wushi@expert.com', '上海交通大学', '电子系', '副教授', '副教授', 'doctor', '博士', '上海交通大学', '电子工程', 'electronics;communication', 'technology', '5G通信;物联网', 15, 92.00, 1, 1, 1, 0);

-- 13. 专家评审记录 (6条评审记录)
-- Fixed review_type and review_method values. Fixed status from 'completed' to 'completed', 'in_progress' to 'in_progress', NULL to NULL. Added deleted field.
INSERT INTO prj_expert_review (id, batch_no, review_name, project_id, project_name, expert_id, expert_name, review_type, review_method, review_start_time, review_end_time, score, grade, comment, recommended, status, review_time, deleted) VALUES
(1, 'BATCH2024001', '2024年度基础研究项目评审', 1, '深度学习算法优化研究', 1, '赵六', 'preliminary', 'online', '2024-03-20 09:00:00', '2024-03-25 18:00:00', 95, 'excellent', '项目选题新颖，研究方案可行，技术路线清晰，预期成果明确，建议立项支持', 1, 'completed', '2024-03-22 15:30:00', 0),
(2, 'BATCH2024001', '2024年度基础研究项目评审', 1, '深度学习算法优化研究', 2, '钱七', 'preliminary', 'online', '2024-03-20 09:00:00', '2024-03-25 18:00:00', 92, 'excellent', '研究内容具有创新性，团队实力强，建议给予重点支持', 1, 'completed', '2024-03-23 10:20:00', 0),
(3, 'BATCH2024001', '2024年度基础研究项目评审', 1, '深度学习算法优化研究', 3, '孙八', 'preliminary', 'online', '2024-03-20 09:00:00', '2024-03-25 18:00:00', 90, 'good', '项目整体不错，但预算略高，建议优化预算配置后立项', 1, 'completed', '2024-03-24 14:45:00', 0),
(4, 'BATCH2024002', '2024年度应用研究项目评审', 2, '智能机器人控制系统', 2, '钱七', 'preliminary', 'offline', '2024-04-15 09:00:00', '2024-04-20 18:00:00', 88, 'good', '应用价值明确，技术方案成熟，建议立项', 1, 'completed', '2024-04-18 16:00:00', 0),
(5, 'BATCH2024003', '2024年度基础研究项目评审', 3, '量子计算应用研究', 1, '赵六', 'preliminary', 'online', '2024-05-25 09:00:00', '2024-05-30 18:00:00', 96, 'excellent', '前沿研究课题，团队实力雄厚，强烈建议立项支持', 1, 'in_progress', NULL, 0),
(6, 'BATCH2024003', '2024年度基础研究项目评审', 3, '量子计算应用研究', 3, '孙八', 'preliminary', 'online', '2024-05-25 09:00:00', '2024-05-30 18:00:00', 94, 'excellent', '研究方向正确，预期成果重大，建议立项', 1, 'in_progress', NULL, 0);

-- 14. 专家投票记录 (组长选举)
-- Added deleted field.
INSERT INTO prj_expert_vote (id, project_id, project_name, voter_expert_id, voter_expert_name, voted_expert_id, voted_expert_name, batch_no, vote_time, deleted) VALUES
(1, 1, '深度学习算法优化研究', 1, '赵六', 3, '孙八', 'BATCH2024001', '2024-03-25 10:00:00', 0),
(2, 1, '深度学习算法优化研究', 2, '钱七', 3, '孙八', 'BATCH2024001', '2024-03-25 10:05:00', 0),
(3, 1, '深度学习算法优化研究', 3, '孙八', 1, '赵六', 'BATCH2024001', '2024-03-25 10:10:00', 0),
(4, 2, '智能机器人控制系统', 2, '钱七', 2, '钱七', 'BATCH2024002', '2024-04-20 10:00:00', 0);

-- 15. 专家组长记录 (2条记录展示两种状态)
-- Fixed conclusion_status from 'uploaded' to 'completed', 'pending' to 'pending'. Added deleted field.
INSERT INTO prj_expert_leader (id, project_id, project_name, expert_id, expert_name, batch_no, vote_count, elected_time, conclusion_status, conclusion_content, conclusion_file_url, conclusion_upload_time, deleted) VALUES
(1, 1, '深度学习算法优化研究', 3, '孙八', 'BATCH2024001', 2, '2024-03-25 11:00:00', 'completed', '经专家组认真评审，该项目研究方向明确，技术路线可行，团队实力强，预期成果明确。综合评审意见，建议批准立项，给予重点支持。项目预算合理，符合资助标准。', '/uploads/conclusions/project_1_conclusion.pdf', '2024-03-26 15:00:00', 0),
(2, 2, '智能机器人控制系统', 2, '钱七', 'BATCH2024002', 1, '2024-04-20 11:00:00', 'pending', NULL, NULL, NULL, 0);

-- 16. 任务书数据 (3条任务书)
-- Fixed sign_status from 'signed' to 'signed', 'pending' to 'pending', 'processing' to 'in_progress'. Fixed status from 'approved' to 'approved', 'to_submit' to 'to_submit', 'pending' to 'pending'. Added deleted field.
INSERT INTO prj_task_book (id, task_book_no, project_id, project_no, project_name, project_type, institution_id, institution_name, project_leader, leader_phone, start_date, end_date, total_budget, apply_budget, self_budget, objective, content, expected_result, indicators, need_midterm, need_annual, sign_status, status, submit_time, sign_time, deleted) VALUES
(1, 'TB2024001', 1, 'PRJ2024001', '深度学习算法优化研究', 'basic_research', 1, '清华大学', '张三', '13900139001', '2024-06-01', '2027-05-31', 5000000.00, 4000000.00, 1000000.00, '提升深度学习算法效率和准确性', '研究新型神经网络架构，优化训练算法', '发表高水平论文5篇，申请发明专利3项', '论文5篇;专利3项;软著2项', 1, 1, 'signed', 'approved', '2024-05-15 10:00:00', '2024-05-20 15:00:00', 0),
(2, 'TB2024002', 2, 'PRJ2024002', '智能机器人控制系统', 'applied_research', 1, '清华大学', '李四', '13900139002', '2024-07-01', '2026-06-30', 3000000.00, 2500000.00, 500000.00, '开发高精度智能机器人控制系统', '研究机器人运动规划和控制算法', '完成原型系统开发，实现工业应用', '原型系统1套;应用案例2个', 1, 1, 'pending', 'to_submit', NULL, NULL, 0),
(3, 'TB2024003', 6, 'PRJ2024006', '生物医药技术研究', 'basic_research', 2, '北京大学', '王五', '13900139003', '2024-10-01', '2027-09-30', 6000000.00, 5000000.00, 1000000.00, '研究新型生物医药技术', '开展基因编辑和蛋白质工程研究', '取得重大科研突破', '论文8篇;专利5项', 1, 1, 'in_progress', 'pending', '2024-09-01 10:00:00', NULL, 0);

-- 17. 中期检查数据 (2条)
-- Removed duplicate ID=1 record, kept only the first one
INSERT INTO prj_midterm (id, midterm_no, project_id, project_no, project_name, institution_name, project_leader, check_year, plan_progress, actual_progress, used_budget, progress_desc, problems, next_plan, achievements, status, submit_time, deleted) VALUES
(1, 'MT2024001', 1, 'PRJ2024001', '深度学习算法优化研究', '清华大学', '张三', 2025, 50, 55, 1200000.00, '项目进展顺利，已完成需求分析和方案设计，算法研发进度超前', '部分实验数据不足，需要增加计算资源', '加快算法优化，准备论文撰写', '发表会议论文2篇，申请专利1项', 'approved', '2025-06-15 10:00:00', 0);

-- 18. 年度报告数据 (2条)
-- Removed duplicate ID=1 record, kept only the first one
INSERT INTO prj_annual (id, annual_no, project_id, project_no, project_name, institution_name, project_leader, check_year, year_target, year_completion, plan_progress, actual_progress, year_budget, used_budget, budget_desc, achievements, problems, next_plan, status, submit_time, year, content, deleted) VALUES
(1, 'AN2024001', 1, 'PRJ2024001', '深度学习算法优化研究', '清华大学', '张三', 2024, '完成需求分析和方案设计', '已全部完成年度目标，并超额完成部分算法研发', 30, 40, 1500000.00, 1275000.00, '设备采购1000万，人员费用500万，材料费250万，差旅费25万', '发表论文3篇，申请专利1项，完成软件著作权登记2项', '部分高性能设备交付延迟', '加快设备到位，推进算法优化和系统集成', 'approved', '2024-12-20 10:00:00', 2024, '2024年度工作总结', 0);

-- 19. 验收数据 (1条已完成项目的验收记录)
-- Fixed acceptance_method from 'site_inspection' to 'on_site'. Fixed status from 'approved' to 'completed'. Added deleted field.
INSERT INTO prj_acceptance (id, acceptance_no, project_id, project_no, project_name, institution_name, project_leader, start_date, end_date, total_budget, used_budget, completion_desc, indicator_completion, achievements, budget_usage, benefits, acceptance_method, conclusion, acceptance_comment, acceptance_time, status, submit_time, deleted) VALUES
(1, 'ACC2024001', 10, 'PRJ2024010', '环境监测技术研发', '北京大学', '王五', '2025-01-01', '2027-12-31', 4500000.00, 4300000.00, '项目按计划完成全部研究内容，实现了预期目标', '各项指标均达到或超过预期', '发表论文6篇，申请专利4项，完成系统开发1套', '预算执行率95.56%，资金使用合理', '形成环境监测解决方案，已在3个城市推广应用', 'on_site', 'passed', '项目完成质量高，成果应用效果好，同意通过验收', '2024-10-15 14:00:00', 'completed', '2024-10-01 10:00:00', 0);

-- 20. 变更数据 (2条变更申请)
-- Fixed status from 'approved' to 'approved', 'pending' to 'pending'. Added deleted field.
INSERT INTO prj_change (id, change_no, project_id, project_no, project_name, apply_unit, applicant, apply_time, change_type, change_item, change_reason, before_content, after_content, status, audit_comment, audit_time, deleted) VALUES
(1, 'CHG2024001', 1, 'PRJ2024001', '深度学习算法优化研究', '清华大学', '张三', '2024-09-01 10:00:00', 'schedule', '项目进度', '部分设备到货延迟，需要调整项目进度', '第二阶段：2024.10-2025.03', '第二阶段：2024.11-2025.04', 'approved', '变更理由充分，同意调整进度计划', '2024-09-05 15:00:00', 0),
(2, 'CHG2024002', 2, 'PRJ2024002', '智能机器人控制系统', '清华大学', '李四', '2024-10-01 14:00:00', 'budget', '预算调整', '实际采购价格低于预算，需要调整预算分配', '设备费100万，材料费80万', '设备费85万，材料费95万', 'pending', NULL, NULL, 0);

-- 21. 查重结果数据 (5条)
-- Fixed check_by from '系统管理员' string to user ID 1 (admin user)
INSERT INTO prj_duplicate_check_result (id, project_id, duplicate_rate, similar_projects, check_time, check_by, deleted) VALUES
(1, 1, 8.50, '相似项目：深度学习优化方法研究(2023)，相似度8.5%', '2024-03-16 09:00:00', 1, 0),
(2, 2, 5.20, '相似项目：智能机器人技术(2022)，相似度5.2%', '2024-04-11 09:00:00', 1, 0),
(3, 3, 3.80, '相似项目：量子计算基础研究(2021)，相似度3.8%', '2024-05-21 09:00:00', 1, 0),
(4, 4, 12.30, '相似项目：新能源材料研发(2023)，相似度12.3%', '2024-06-02 09:00:00', 1, 0),
(5, 7, 18.90, '相似项目：智慧城市平台建设(2023)，相似度15.2%；物联网技术应用(2022)，相似度3.7%', '2024-07-16 09:00:00', 1, 0);

-- 22. 成果数据 (5条成果记录)
-- Fixed type values. Fixed status from 'active' to 'active'. Added deleted field.
INSERT INTO prj_achievement (id, achievement_no, project_id, project_name, name, type, field, completion_unit, completion_person, completion_date, description, keywords, published, status, deleted) VALUES
(1, 'ACH2024001', 1, '深度学习算法优化研究', '基于注意力机制的深度学习算法优化', 'paper', 'artificial_intelligence', '清华大学', '张三;李四', '2024-11-15', '提出新型注意力机制，显著提升模型性能', '深度学习;注意力机制;算法优化', 1, 'active', 0),
(2, 'ACH2024002', 1, '深度学习算法优化研究', '高效神经网络训练方法', 'patent', 'artificial_intelligence', '清华大学', '张三;李四;王五', '2024-12-01', '一种高效的神经网络训练方法及系统', '神经网络;训练方法;专利', 0, 'active', 0),
(3, 'ACH2024003', 10, '环境监测技术研发', '智能环境监测系统V1.0', 'software', 'environmental', '北京大学', '王五;赵六', '2024-09-20', '集成多种传感器的智能环境监测系统', '环境监测;物联网;智能系统', 1, 'active', 0),
(4, 'ACH2024004', 10, '环境监测技术研发', '环境数据实时分析方法', 'paper', 'environmental', '北京大学', '王五', '2024-10-05', '基于大数据的环境监测数据实时分析方法研究', '环境监测;大数据;实时分析', 1, 'active', 0),
(5, 'ACH2024005', 1, '深度学习算法优化研究', '深度学习模型压缩技术', 'technology', 'artificial_intelligence', '清华大学', '张三;李四', '2024-12-10', '提出新型模型压缩算法，在保持精度的同时大幅降低模型规模', '模型压缩;深度学习;轻量化', 0, 'active', 0);

-- 23. 获奖记录数据 (3条)
-- Fixed category values. Fixed status from 'active' to 'active', 'approved' to 'approved'. Added deleted field.
-- Removed non-sequential IDs 4 and 5, kept only first 3 records
INSERT INTO prj_award (id, project_id, project_name, name, category, level, award_date, award_unit, winning_unit, winning_person, description, certificate_no, status, create_time, deleted) VALUES
(1, 10, '环境监测技术研发', '科技进步奖', 'science_progress', 'provincial', '2024-11-20', '北京市科技局', '北京大学', '王五;赵六;李四', '在环境监测技术领域取得重大突破，获得省级科技进步奖', 'AWARD2024001', 'active', '2024-11-20 15:00:00', 0),
(2, 1, '深度学习算法优化研究', '优秀论文奖', 'paper', 'national', '2024-12-05', '中国计算机学会', '清华大学', '张三;李四', '在深度学习算法优化方面的研究论文获得全国优秀论文奖', 'PAPER2024001', 'active', '2024-12-05 10:30:00', 0),
(3, 10, '环境监测技术研发', '技术发明奖', 'invention', 'municipal', '2024-10-30', '北京市政府', '北京大学', '王五', '发明智能环境监测技术，获得市级技术发明奖', 'INVENT2024001', 'active', '2024-10-30 14:00:00', 0);

-- 24. 成果转化数据 (2条)
-- Fixed type values. Fixed status from 'in_progress' to 'in_progress', 'completed' to 'completed'. Added deleted field.
-- Removed non-sequential IDs 3 and 4, kept only first 2 records
INSERT INTO prj_transformation (id, achievement_id, transformation_no, content, type, unit, principal, contact, status, value, create_time, deleted) VALUES
(1, 3, 'TRANS2024001', '智能环境监测系统产业化应用', 'technology_transfer', '北京环保科技有限公司', '王五', '13900139003', 'in_progress', 5000000.00, '2024-05-15 10:00:00', 0),
(2, 1, 'TRANS2024002', '深度学习算法商业化授权', 'licensing', '深圳AI科技公司', '张三', '13900139001', 'completed', 3000000.00, '2024-06-20 14:30:00', 0);

-- 25. 设备数据 (3条设备记录)
-- Fixed status from 'normal' to 'normal', 'maintenance' to 'maintenance'. Added deleted field.
INSERT INTO prj_equipment (id, equipment_no, name, model, manufacturer, institution_id, administrator, contact, location, status, purchase_date, price, description, is_shared, deleted) VALUES
(1, 'EQ2024001', '高性能计算服务器', 'Dell PowerEdge R750', 'Dell', 1, '张三', '13900139001', '清华大学计算机楼301', 'normal', '2024-06-15', 200000.00, '用于深度学习模型训练', 1, 0),
(2, 'EQ2024002', '工业机器人', 'KUKA KR 60-3', 'KUKA', 1, '李四', '13900139002', '清华大学自动化实验室', 'normal', '2024-07-20', 500000.00, '六轴工业机器人，用于控制算法研究', 0, 0),
(3, 'EQ2024003', '环境监测传感器', 'Thermo Scientific AQ200', 'Thermo Fisher', 2, '王五', '13900139003', '北京大学环境楼205', 'normal', '2024-08-10', 150000.00, '高精度空气质量监测传感器', 1, 0);

-- 26. 软件数据 (2条软件记录)
-- Fixed type values. Fixed is_shared from 1 to true, 0 to false. Added deleted field.
INSERT INTO prj_software (id, software_no, name, version, type, developer, license_type, license_count, used_license_count, institution_id, administrator, contact, description, is_shared, deleted) VALUES
(1, 'SW2024001', 'MATLAB', 'R2024a', 'commercial', 'MathWorks', 'network', 50, 35, 1, '张三', '13900139001', '数学计算和算法开发软件', 1, 0),
(2, 'SW2024002', 'PyTorch', '2.1.0', 'open_source', 'Meta', 'open', 999, 120, 1, '李四', '13900139002', '深度学习框架', 1, 0);

-- 27. 基础数据资源 (3条数据记录)
-- Fixed is_shared from 1 to true, 0 to false. Added deleted field.
INSERT INTO prj_basic_data (id, data_no, name, type, field, description, source, format, size, file_path, institution_id, is_shared, download_count, deleted) VALUES
(1, 'DATA2024001', 'ImageNet数据集', 'dataset', 'artificial_intelligence', '大规模图像识别数据集，包含1000个类别', 'Stanford University', 'JPEG', 150000000000, '/data/imagenet/', 1, 1, 256, 0),
(2, 'DATA2024002', '工业机器人运动数据', 'experiment', 'automation', '工业机器人运动轨迹和控制参数数据', '清华大学自动化系', 'CSV', 5000000000, '/data/robot_motion/', 1, 0, 12, 0),
(3, 'DATA2024003', '北京市环境监测数据', 'observation', 'environmental', '2020-2024年北京市空气质量监测数据', '北京市环保局', 'JSON', 2000000000, '/data/beijing_env/', 2, 1, 89, 0);

-- 28. 考核评价数据 (5条)
-- Fixed status from 'approved' to 'approved', 'in_progress' to 'in_progress'. Added deleted field.
INSERT INTO prj_assessment (id, year, quarter, institution_id, institution_name, project_count, completion_rate, score, `rank`, status, evaluator_id, evaluator_name, evaluate_time, remark, deleted) VALUES
(1, 2024, 1, 1, '清华大学', 15, 93.33, 92, '优秀', 'approved', 2, '监管人员', '2024-04-15 14:00:00', '项目执行情况良好，进度符合预期', 0),
(2, 2024, 2, 1, '清华大学', 18, 88.89, 90, '优秀', 'approved', 2, '监管人员', '2024-07-15 14:00:00', '整体表现优秀，个别项目需加快进度', 0),
(3, 2024, 3, 1, '清华大学', 20, 95.00, 94, '优秀', 'approved', 2, '监管人员', '2024-10-15 14:00:00', '季度考核优秀，项目管理规范', 0),
(4, 2024, 1, 2, '北京大学', 12, 91.67, 89, '良好', 'approved', 2, '监管人员', '2024-04-15 15:00:00', '项目质量高，资金使用合理', 0),
(5, 2024, 4, 1, '清华大学', 22, 90.91, 91, '优秀', 'in_progress', 2, '监管人员', NULL, NULL, 0);

-- 29. 年度材料数据 (5条)
-- Fixed status from 'approved' to 'approved', 'under_review' to 'under_review', 'rejected' to 'rejected'. Added deleted field.
INSERT INTO prj_assessment_material (id, year, type, file_name, file_path, file_size, status, deadline, upload_user_id, upload_user_name, upload_time, create_time, deleted) VALUES
(1, 2024, 'annual_plan', '2024年度科研计划.pdf', '/uploads/assessment/2024_plan.pdf', 2048576, 'approved', '2024-01-31', 3, '张三', '2024-01-20 10:00:00', '2024-01-15 10:00:00', 0),
(2, 2024, 'annual_report', '2024年度工作总结.pdf', '/uploads/assessment/2024_report.pdf', 3145728, 'approved', '2025-01-31', 3, '张三', '2024-12-25 14:00:00', '2024-12-20 10:00:00', 0),
(3, 2024, 'project_list', '2024年在研项目清单.xlsx', '/uploads/assessment/2024_projects.xlsx', 524288, 'approved', '2025-02-28', 4, '李四', '2024-11-01 09:00:00', '2024-11-01 09:00:00', 0),
(4, 2025, 'annual_plan', '2025年度科研计划.pdf', '/uploads/assessment/2025_plan.pdf', 2097152, 'under_review', '2025-01-31', 3, '张三', '2025-01-10 10:00:00', NULL, 0),
(5, 2024, 'special_report', '重大项目进展报告.doc', '/uploads/assessment/special_report.doc', 1048576, 'rejected', '2024-06-30', 5, '王五', '2024-06-28 16:00:00', '2024-06-29 10:00:00', 0);

-- 30. 通知公告数据 (14条)
INSERT INTO sys_notice (id, title, type, content, summary, publish_unit, publish_by, publish_time, is_top, view_count, status, create_time, deleted) VALUES
(1, '关于2024年度科研项目申报的通知', 'announcement', '各有关单位：\n\n为做好2024年度科研项目申报工作，现将有关事项通知如下：\n\n一、申报时间：2024年3月1日至3月31日\n二、申报范围：基础研究、应用研究、试验发展\n三、申报要求：...\n\n特此通知。', '2024年度科研项目申报工作正式启动', '科技部', '系统管理员', '2024-02-20 09:00:00', 1, 1250, 'published', '2024-02-20 09:00:00', 0),
(2, '项目中期检查工作安排', 'work_notice', '各项目承担单位：\n\n根据项目管理规定，现对2024年度在研项目开展中期检查，具体安排如下：\n\n一、检查时间：2024年6月1日至6月30日\n二、检查内容：项目进展、预算执行、阶段成果\n三、提交材料：中期检查报告、财务报表\n\n请各单位按时提交材料。', '开展2024年度项目中期检查工作', '科技管理部门', '监管人员', '2024-05-15 10:00:00', 1, 856, 'published', '2024-05-15 10:00:00', 0),
(3, '优秀项目评选结果公示', 'announcement', '经专家评审和综合评议，现将2024年度优秀科研项目评选结果公示如下：\n\n一等奖：\n1. 深度学习算法优化研究（清华大学）\n2. 量子计算应用研究（北京大学）\n\n二等奖：\n3. 智能机器人控制系统（清华大学）\n4. 环境监测技术研发（北京大学）\n\n公示期：2024年12月1日至12月7日', '2024年度优秀科研项目评选结果', '科技部', '系统管理员', '2024-12-01 09:00:00', 1, 2340, 'published', '2024-12-01 09:00:00', 0),
(4, '关于加强项目经费管理的通知', 'notice', '各项目承担单位：\n\n为进一步加强项目经费管理，规范经费使用，现将有关要求通知如下：\n\n一、严格执行项目预算\n二、规范经费支出流程\n三、加强票据管理\n四、定期报送财务报表\n\n请各单位严格遵守相关规定。', '加强项目经费管理的通知', '财务管理部门', '财务主管', '2024-03-10 14:30:00', 0, 523, 'published', '2024-03-10 14:30:00', 0),
(5, '项目验收工作指南', 'work_notice', '为规范项目验收工作，现发布《项目验收工作指南》，主要内容包括：\n\n一、验收条件：完成项目任务书规定的全部内容\n二、验收材料：项目总结报告、财务决算表、成果清单\n三、验收程序：材料审查、现场检查、专家评审\n四、验收标准：技术指标、经费使用、成果产出\n\n详细内容请下载附件查看。', '项目验收工作指南发布', '项目管理办公室', '项目专员', '2024-04-15 11:00:00', 0, 687, 'published', '2024-04-15 11:00:00', 0),
(6, '2024年度科技创新奖励办法', 'policy', '为鼓励科技创新，特制定《2024年度科技创新奖励办法》：\n\n一、奖励范围：重大科技成果、高水平论文、发明专利\n二、奖励标准：\n  - 一等奖：50万元\n  - 二等奖：30万元\n  - 三等奖：10万元\n三、申报时间：每年11月1日至11月30日\n四、评审程序：单位推荐、专家评审、公示公告\n\n本办法自发布之日起施行。', '2024年度科技创新奖励办法', '科技部', '政策法规处', '2024-01-08 09:30:00', 1, 1890, 'published', '2024-01-08 09:30:00', 0),
(7, '关于召开项目管理工作会议的通知', 'notice', '各项目承担单位：\n\n定于2024年7月15日召开项目管理工作会议，现将有关事项通知如下：\n\n一、会议时间：2024年7月15日（周一）上午9:00\n二、会议地点：科技大厦三楼会议室\n三、参会人员：各单位项目负责人\n四、会议议题：项目进展交流、问题研讨、政策解读\n\n请参会人员准时参加。', '召开项目管理工作会议通知', '项目管理办公室', '会务组', '2024-07-08 10:00:00', 1, 342, 'published', '2024-07-08 10:00:00', 0),
(8, '项目申报系统升级维护公告', 'announcement', '为提升系统性能，改善用户体验，项目申报系统将进行升级维护：\n\n维护时间：2024年8月20日22:00 至 8月21日06:00\n影响范围：系统暂停服务，无法登录和提交申请\n\n维护期间给您带来的不便，敬请谅解。如有紧急事项，请致电：010-12345678。\n\n特此公告。', '项目申报系统升级维护通知', '信息技术部', '技术运维', '2024-08-18 16:00:00', 1, 756, 'published', '2024-08-18 16:00:00', 0),
(9, '科研诚信与学术规范培训通知', 'notice', '各科研人员：\n\n为加强科研诚信建设，提高学术规范意识，将组织科研诚信与学术规范培训：\n\n一、培训时间：2024年9月25日14:00-17:00\n二、培训地点：学术报告厅\n三、培训内容：科研诚信规范、学术不端行为认定、论文写作规范\n四、主讲专家：某某教授（学术委员会主任）\n\n请各单位组织相关人员参加培训。', '科研诚信与学术规范培训', '科研管理处', '培训专员', '2024-09-15 09:30:00', 0, 445, 'published', '2024-09-15 09:30:00', 0),
(10, '项目年度报告提交通知', 'work_notice', '各项目承担单位：\n\n根据项目管理要求，请各单位按时提交2024年度项目进展报告：\n\n一、提交时间：2024年12月1日至12月31日\n二、报告内容：研究进展、经费执行、成果产出、存在问题\n三、提交方式：登录项目管理系统在线提交\n四、注意事项：报告需经单位审核盖章\n\n逾期未提交将影响下年度项目申报。', '提交2024年度项目进展报告', '项目管理办公室', '项目专员', '2024-11-20 10:00:00', 0, 892, 'published', '2024-11-20 10:00:00', 0),
(11, '关于开展项目绩效评价工作的通知', 'notice', '各项目承担单位：\n\n为提高项目管理水平，将对2024年已验收项目开展绩效评价：\n\n一、评价范围：2024年1月至10月已验收项目\n二、评价指标：目标完成度、经费使用效率、成果质量、社会效益\n三、评价方式：单位自评、专家评审、综合评定\n四、时间安排：2024年11月至2025年1月\n\n请各单位积极配合评价工作。', '开展项目绩效评价工作', '评价监督处', '评价专员', '2024-10-25 14:00:00', 0, 567, 'published', '2024-10-25 14:00:00', 0),
(12, '新一代人工智能重大专项启动', 'news', '12月15日，新一代人工智能重大专项正式启动。该专项聚焦人工智能核心技术突破，重点支持以下方向：\n\n一、大模型基础理论与算法\n二、智能芯片与计算架构\n三、人机交互与人机协同\n四、AI安全与可信\n\n首批项目将于2025年1月开始申报，预计支持经费超过10亿元。', '新一代人工智能重大专项正式启动', '科技部', '新闻发言人', '2024-12-15 09:00:00', 1, 3456, 'published', '2024-12-15 09:00:00', 0),
(13, '国家重点实验室评估结果公布', 'announcement', '经专家现场考察和综合评议，现公布2024年度国家重点实验室评估结果：\n\n优秀（10家）：\n- 智能信息处理重点实验室（清华大学）\n- 量子信息重点实验室（中国科学技术大学）\n...\n\n良好（20家）\n合格（15家）\n整改（5家）\n\n详细名单见附件。公示期：2024年12月20日至12月27日。', '国家重点实验室评估结果', '科技部基础研究司', '评估办', '2024-12-20 10:00:00', 1, 2890, 'published', '2024-12-20 10:00:00', 0),
(14, '科技成果转化政策解读', 'policy', '为促进科技成果转化，现就最新政策进行解读：\n\n一、成果转化激励：\n  - 科研人员可获得不低于50%的转化收益\n  - 单位可自主决定成果转化方式\n\n二、简化审批流程：\n  - 取消成果转化行政审批\n  - 建立成果转化备案制度\n\n三、税收优惠政策：\n  - 成果转化收入免征增值税\n  - 个人所得税可递延缴纳\n\n详细政策请访问政策法规专栏。', '科技成果转化政策解读', '成果转化处', '政策专员', '2024-11-05 15:30:00', 0, 1234, 'published', '2024-11-05 15:30:00', 0);

-- 31. 待办事项数据 (10条待办任务)
-- Added all missing fields: completed_time, completed_by, update_time, create_by, update_by, deleted
INSERT INTO sys_todo_item (user_id, user_name, role, title, description, type, business_id, business_no, business_type, priority, status, deadline, link_url, completed_time, completed_by, create_time, update_time, create_by, update_by, deleted)
VALUES
(1, '张三', 'supervisor', '项目PRJ2025001需要评审', '请对项目"基于AI的智能推荐系统研究"进行立项评审，截止时间为3天后', 'project_review', 1, 'PRJ2025001', 'project', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY), '/dashboard/admin/project-review/1', NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 1, 1, 0),
(1, '张三', 'supervisor', '任务书TB2025001待审核', '项目"区块链技术在供应链中的应用"的任务书需要您审核', 'taskbook_audit', 1, 'TB2025001', 'taskbook', 'urgent', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY), '/dashboard/admin/task-book-review/1', NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR), 1, 1, 0),
(2, '李四', 'expert', '专家评审任务', '请对项目"量子计算在密码学中的应用"进行专家评审打分', 'project_review', 2, 'PRJ2025002', 'project', 'normal', 'pending', DATE_ADD(NOW(), INTERVAL 5 DAY), '/dashboard/expert-reviews/2', NULL, NULL, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), 1, 1, 0),
(1, '张三', 'supervisor', '变更申请审批', '项目PRJ2025001提交了研究内容变更申请，请审核', 'change_audit', 1, 'CHG2025001', 'change', 'normal', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), '/dashboard/admin/change-review', NULL, NULL, NOW(), NOW(), 1, 1, 0),
(3, '王五', 'institution', '中期检查提交', '项目PRJ2024015到达中期检查节点，请提交中期报告', 'midterm_review', 15, 'PRJ2024015', 'midterm', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 2 DAY), '/dashboard/projects/midterm', NULL, NULL, DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR), 3, 3, 0),
(3, '王五', 'institution', '年报检查提交', '项目PRJ2024010需要提交年度报告', 'annual_review', 10, 'PRJ2024010', 'annual', 'normal', 'pending', DATE_ADD(NOW(), INTERVAL 10 DAY), '/dashboard/projects/annual', NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 3, 3, 0),
(1, '张三', 'supervisor', '验收评审', '项目PRJ2023005申请结题验收，请组织验收评审', 'acceptance_review', 5, 'PRJ2023005', 'acceptance', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 4 DAY), '/dashboard/admin/acceptance-review', NULL, NULL, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR), 1, 1, 0),
(2, '李四', 'expert', '项目现场考察', '需要对项目PRJ2024020进行现场考察评审', 'site_visit', 20, 'PRJ2024020', 'project', 'normal', 'pending', DATE_ADD(NOW(), INTERVAL 14 DAY), '/dashboard/expert-reviews/site-visit', NULL, NULL, DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_SUB(NOW(), INTERVAL 8 HOUR), 2, 2, 0),
(1, '张三', 'supervisor', '预算调整审批', '项目PRJ2024008申请预算调整，请审核', 'budget_adjustment', 8, 'CHG2025002', 'change', 'low', 'completed', DATE_ADD(NOW(), INTERVAL -5 DAY), '/dashboard/admin/change-review', DATE_SUB(NOW(), INTERVAL 3 DAY), '张三', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 1, 1, 0),
(3, '王五', 'institution', '项目结题准备', '项目PRJ2023010即将到期，请准备结题验收材料', 'acceptance_prepare', 10, 'PRJ2023010', 'acceptance', 'urgent', 'pending', DATE_ADD(NOW(), INTERVAL 15 DAY), '/dashboard/projects/acceptance/prepare', NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 3, 3, 0);

-- 32. 权限数据 (15条核心权限) - Corrected field names to match sys_permission table structure
INSERT INTO sys_permission (id, parent_id, permission_code, permission_name, type, path, component, icon, sort, status, create_time, update_time, create_by, update_by, deleted) VALUES
(1, 0, 'system:user:view', '查看用户', 'menu', '/system/user', 'system/user/index', 'user', 1, 1, NOW(), NOW(), 1, 1, 0),
(2, 1, 'system:user:add', '添加用户', 'button', NULL, NULL, 'plus', 2, 1, NOW(), NOW(), 1, 1, 0),
(3, 1, 'system:user:edit', '编辑用户', 'button', NULL, NULL, 'edit', 3, 1, NOW(), NOW(), 1, 1, 0),
(4, 1, 'system:user:delete', '删除用户', 'button', NULL, NULL, 'delete', 4, 1, NOW(), NOW(), 1, 1, 0),
(5, 0, 'project:manage', '项目管理', 'menu', '/project', 'project/index', 'project', 5, 1, NOW(), NOW(), 1, 1, 0),
(6, 5, 'project:create', '创建项目', 'button', NULL, NULL, 'plus', 6, 1, NOW(), NOW(), 1, 1, 0),
(7, 5, 'project:audit', '审核项目', 'button', NULL, NULL, 'check', 7, 1, NOW(), NOW(), 1, 1, 0),
(8, 0, 'expert:review', '专家评审', 'menu', '/expert/review', 'expert/review/index', 'star', 8, 1, NOW(), NOW(), 1, 1, 0),
(9, 8, 'expert:vote', '专家投票', 'button', NULL, NULL, 'like', 9, 1, NOW(), NOW(), 1, 1, 0),
(10, 0, 'report:view', '查看报告', 'menu', '/report', 'report/index', 'file', 10, 1, NOW(), NOW(), 1, 1, 0),
(11, 10, 'report:export', '导出报告', 'button', NULL, NULL, 'download', 11, 1, NOW(), NOW(), 1, 1, 0),
(12, 0, 'institution:manage', '机构管理', 'menu', '/institution', 'institution/index', 'bank', 12, 1, NOW(), NOW(), 1, 1, 0),
(13, 0, 'expert:manage', '专家管理', 'menu', '/expert', 'expert/index', 'team', 13, 1, NOW(), NOW(), 1, 1, 0),
(14, 0, 'notice:manage', '公告管理', 'menu', '/notice', 'notice/index', 'bell', 14, 1, NOW(), NOW(), 1, 1, 0),
(15, 0, 'dict:manage', '字典管理', 'menu', '/dict', 'dict/index', 'book', 15, 1, NOW(), NOW(), 1, 1, 0);

-- 33. 角色权限关联数据
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
-- 管理员拥有全部权限
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14), (1, 15),
-- 监管人员拥有查看、审核、报告权限
(2, 1), (2, 5), (2, 7), (2, 10), (2, 11), (2, 12),
-- 科研人员拥有基本查看和项目创建权限
(3, 1), (3, 5), (3, 6), (3, 10),
-- 专家拥有评审相关权限
(4, 8), (4, 9), (4, 10);

-- 34. 工作流程定义数据 (5条)
-- Fixed field names to match wf_workflow table structure: steps->definition, current_step->version, added is_current
INSERT INTO wf_workflow (id, workflow_code, workflow_name, workflow_type, description, definition, version, is_current, status, create_time, update_time, deleted) VALUES
(1, 'PROJECT_APPROVAL', '项目立项审批', 'project', '项目从申报到立项审批的完整流程', '{"steps":["提交申报","初审","立项评审","审批通过"]}', 1, 1, 1, NOW(), NOW(), 0),
(2, 'TASKBOOK_SIGN', '任务书签订', 'taskbook', '项目任务书编制和签订流程', '{"steps":["编制任务书","单位审核","管理部门审核","签订完成"]}', 1, 1, 1, NOW(), NOW(), 0),
(3, 'CHANGE_APPROVAL', '变更审批', 'change', '项目变更申请审批流程', '{"steps":["提交变更申请","单位审核","管理部门审核","审批完成"]}', 1, 1, 1, NOW(), NOW(), 0),
(4, 'MIDTERM_REVIEW', '中期检查', 'midterm', '项目中期检查流程', '{"steps":["提交中期报告","单位审核","专家评审","检查完成"]}', 1, 1, 1, NOW(), NOW(), 0),
(5, 'ACCEPTANCE_REVIEW', '项目验收', 'acceptance', '项目结题验收流程', '{"steps":["提交验收材料","资料审查","现场检查","专家评审","验收完成"]}', 1, 1, 1, NOW(), NOW(), 0);

-- 35. 工作流历史数据 (8条)
-- Fixed field names to match prj_workflow_history table structure: business_type->project_id, step_name->from_stage/to_stage, operation->action, operation_time removed
INSERT INTO prj_workflow_history (id, project_id, from_stage, to_stage, action, operator_id, operator_name, operator_role, comment, create_time) VALUES
(1, 1, '草稿', '初审', 'submit', 3, '王五', 'leader', '提交项目申报材料', '2025-01-08 10:00:00'),
(2, 1, '初审', '立项评审', 'approve', 1, '张三', 'admin', '初审通过，进入立项评审', '2025-01-09 14:30:00'),
(3, 2, '草稿', '初审', 'submit', 4, '赵六', 'leader', '提交区块链项目申报', '2025-01-10 09:00:00'),
(4, 1, '立项', '任务书签订', 'create', 3, '王五', 'leader', '完成任务书编制', '2025-01-12 11:00:00'),
(5, 1, '执行', '变更审批', 'submit', 3, '王五', 'leader', '申请研究内容变更', '2025-01-15 10:30:00'),
(6, 15, '执行', '中期检查', 'submit', 5, '孙七', 'leader', '提交中期检查报告', '2024-12-10 15:00:00'),
(7, 15, '中期检查', '执行', 'approve', 2, '李四', 'expert', '中期检查评审通过', '2024-12-15 16:00:00'),
(8, 5, '执行', '验收', 'review', 1, '张三', 'admin', '验收材料审查通过', '2024-11-20 14:00:00');

-- 36. 资源数据 (5条)
-- Fixed field names to match res_resource table structure: resource_name->name, resource_type->type, purchase_price->original_value, current_value removed, added required fields
INSERT INTO res_resource (id, resource_no, name, type, field, location, manager, contact_phone, purchase_date, original_value, institution_name, is_shared, current_status, status, description, create_time, update_time, deleted) VALUES
(1, 'RES2024001', '高性能计算集群', 'instrument', '计算机科学', 'A栋三楼机房', '技术部-李工', '13800138001', '2024-01-15', 500.00, '清华大学', 1, 'available', 1, '256核心，1TB内存，100TB存储', NOW(), NOW(), 0),
(2, 'RES2024002', '电子显微镜', 'instrument', '材料科学', 'B栋实验室201', '科研部-王工', '13800138002', '2023-06-20', 300.00, '北京大学', 1, 'available', 1, '扫描电镜，分辨率0.5nm', NOW(), NOW(), 0),
(3, 'RES2024003', 'Nature期刊数据库', 'data', '综合', '图书馆电子资源', '图书馆-张老师', '13800138003', '2024-01-01', 50.00, '清华大学', 1, 'available', 1, '2024年度订阅', NOW(), NOW(), 0),
(4, 'RES2024004', '科研项目管理系统', 'software', '管理科学', '服务器集群', 'IT部-陈工', '13800138004', '2023-03-10', 20.00, '清华大学', 1, 'available', 1, '支持1000并发用户', NOW(), NOW(), 0),
(5, 'RES2024005', '基因测序仪', 'instrument', '生物学', 'C栋生物实验室', '生物所-刘博士', '13800138005', '2024-05-15', 800.00, '北京大学', 1, 'using', 1, 'Illumina NovaSeq 6000', NOW(), NOW(), 0);

-- 37. 借用记录数据 (6条)
-- Fixed field names to match prj_borrow_record table structure: resource_id->equipment_id, return_time->expected_return_time, purpose->reason, approval_by->auditor_id, approval_time->audit_time, remark->audit_comment
INSERT INTO prj_borrow_record (id, equipment_id, borrower_id, institution_id, reason, borrow_time, expected_return_time, actual_return_time, status, audit_comment, audit_time, auditor_id, create_time, deleted) VALUES
(1, 1, 3, 1, '深度学习模型训练', '2025-01-10 09:00:00', '2025-02-10 17:00:00', NULL, 'approved', NULL, '2025-01-09 16:00:00', 1, '2025-01-08 14:00:00', 0),
(2, 2, 4, 2, '材料微观结构分析', '2025-01-12 10:00:00', '2025-01-15 18:00:00', NULL, 'approved', NULL, '2025-01-11 15:00:00', 1, '2025-01-11 11:00:00', 0),
(3, 5, 5, 2, '基因组测序研究', '2025-01-05 08:00:00', '2025-02-05 17:00:00', NULL, 'borrowed', '当前使用中', '2025-01-04 14:00:00', 1, '2025-01-03 10:00:00', 0),
(4, 1, 6, 1, '智能算法优化', '2024-12-01 09:00:00', '2024-12-31 17:00:00', '2024-12-31 16:00:00', 'returned', '已按时归还', '2024-11-30 16:00:00', 1, '2024-11-28 13:00:00', 0),
(5, 3, 7, 1, '文献检索与研究', '2025-01-01 08:00:00', '2025-12-31 23:59:00', NULL, 'approved', '全年订阅', '2024-12-28 10:00:00', 1, '2024-12-25 09:00:00', 0),
(6, 4, 3, 1, '项目进度管理', '2025-01-15 14:00:00', '2025-06-30 17:00:00', NULL, 'pending', '待审批', NULL, NULL, '2025-01-15 11:00:00', 0);

-- 38. 文件记录数据 (8条)
-- Fixed field names to match sys_file table structure: upload_time->create_time, added upload_by_name
INSERT INTO sys_file (id, file_name, original_name, file_path, file_url, file_size, file_type, mime_type, md5, business_type, business_id, upload_by, upload_by_name, download_count, status, create_time, deleted) VALUES
(1, '项目申报书.pdf', '项目申报书_原始.pdf', '/upload/project/2024/01/project_001.pdf', 'https://example.com/files/project_001.pdf', 2048576, 'pdf', 'application/pdf', 'd41d8cd98f00b204e9800998ecf8427e', 'project', 1, 1, '张三', 0, 1, '2024-01-15 10:00:00', 0),
(2, '任务书.docx', '任务书_原始.docx', '/upload/taskbook/2024/02/taskbook_001.docx', 'https://example.com/files/taskbook_001.docx', 1024000, 'docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'a3d5e1f2c3b4a5d6e7f8g9h0i1j2k3l4', 'taskbook', 1, 2, '李四', 0, 1, '2024-02-10 11:00:00', 0),
(3, '中期检查报告.pdf', '中期检查报告_原始.pdf', '/upload/midterm/2024/06/midterm_001.pdf', 'https://example.com/files/midterm_001.pdf', 3072000, 'pdf', 'application/pdf', 'b4e6f7a8c9d0e1f2g3h4i5j6k7l8m9n0', 'midterm', 1, 1, '张三', 5, 1, '2024-06-15 14:00:00', 0),
(4, '年度总结报告.pdf', '年度总结报告_原始.pdf', '/upload/annual/2024/12/annual_001.pdf', 'https://example.com/files/annual_001.pdf', 2560000, 'pdf', 'application/pdf', 'c5f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1', 'annual', 1, 1, '张三', 3, 1, '2024-12-20 16:00:00', 0),
(5, '验收报告.pdf', '验收报告_原始.pdf', '/upload/acceptance/2025/01/acceptance_001.pdf', 'https://example.com/files/acceptance_001.pdf', 4096000, 'pdf', 'application/pdf', 'd6g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2', 'acceptance', 1, 1, '张三', 8, 1, '2025-01-25 09:00:00', 0),
(6, '变更申请表.xlsx', '变更申请表_原始.xlsx', '/upload/change/2024/08/change_001.xlsx', 'https://example.com/files/change_001.xlsx', 512000, 'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'e7h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3', 'change', 1, 2, '李四', 2, 1, '2024-08-05 10:30:00', 0),
(7, '成果证明材料.zip', '成果证明材料_原始.zip', '/upload/achievement/2025/03/achievement_001.zip', 'https://example.com/files/achievement_001.zip', 10240000, 'zip', 'application/zip', 'f8i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4', 'achievement', 1, 1, '张三', 1, 1, '2025-03-10 15:00:00', 0),
(8, '专家评审意见.pdf', '专家评审意见_原始.pdf', '/upload/review/2024/03/review_001.pdf', 'https://example.com/files/review_001.pdf', 1536000, 'pdf', 'application/pdf', 'g9j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5', 'expert_review', 1, 5, '赵六', 4, 1, '2024-03-20 13:00:00', 0);

-- 39. 下载记录数据 (10条)
-- 修正字段名：file_id改为data_id，匹配prj_download_record表结构
INSERT INTO prj_download_record (data_id, downloader_id, institution_id, reason, download_time, status, audit_comment, audit_time, auditor_id, create_time, deleted) VALUES
(1, 2, 2, '项目研究需要参考', '2024-01-20 09:00:00', 'downloaded', '同意下载', '2024-01-20 08:00:00', 1, '2024-01-20 08:00:00', 0),
(2, 3, 3, '学习交流', '2024-02-15 10:30:00', 'downloaded', '同意下载', '2024-02-15 09:00:00', 1, '2024-02-15 09:00:00', 0),
(3, 4, 4, '撰写相关报告', '2024-06-20 14:00:00', 'downloaded', '同意下载', '2024-06-20 13:00:00', 1, '2024-06-20 13:00:00', 0),
(4, 5, 1, '专家评审需要', '2024-12-22 16:30:00', 'downloaded', '同意下载', '2024-12-22 15:00:00', 1, '2024-12-22 15:00:00', 0),
(5, 2, 2, '验收准备工作', '2025-01-26 10:00:00', 'downloaded', '同意下载', '2025-01-26 09:00:00', 1, '2025-01-26 09:00:00', 0),
(6, 3, 3, '研究参考', '2024-08-06 11:00:00', 'downloaded', '同意下载', '2024-08-06 10:00:00', 1, '2024-08-06 10:00:00', 0),
(7, 6, 2, '成果申报需要', '2025-03-12 15:30:00', 'downloaded', '同意下载', '2025-03-12 14:00:00', 1, '2025-03-12 14:00:00', 0),
(8, 7, 3, '学术研究', '2024-03-22 13:30:00', 'downloaded', '同意下载', '2024-03-22 12:00:00', 1, '2024-03-22 12:00:00', 0),
(9, 2, 2, '项目跟踪', '2024-07-10 09:00:00', 'pending', NULL, NULL, NULL, '2024-07-10 08:30:00', 0),
(10, 4, 4, '数据分析', '2024-09-15 10:00:00', 'approved', '同意下载', '2024-09-15 09:30:00', 1, '2024-09-15 09:00:00', 0);

-- =============================================
-- 样例数据插入完成
-- 总计：40张表的完整样例数据（包括03文件中的sys_status_label）
-- =============================================
