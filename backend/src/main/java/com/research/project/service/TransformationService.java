package com.research.project.service;

import com.research.project.entity.Transformation;
import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * 成果转化服务接口
 */
public interface TransformationService extends IService<Transformation> {
    
    /**
     * 分页查询成果转化列表
     */
    Page<Transformation> getList(int page, int pageSize, String status, String type, String keyword);
    
    /**
     * 根据成果ID查询转化记录
     */
    Page<Transformation> getByAchievementId(Long achievementId, int page, int pageSize);
    
    /**
     * 创建成果转化
     */
    boolean create(Transformation transformation);
    
    /**
     * 更新成果转化
     */
    boolean update(Transformation transformation);
    
    /**
     * 审核成果转化
     */
    boolean review(Long id, String status, String comment);
    
    /**
     * 删除成果转化
     */
    boolean deleteById(Long id);
}
