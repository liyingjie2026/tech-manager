package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.DuplicateCheckDTO;
import com.research.project.dto.DuplicateCheckResultDTO;

/**
 * 查重检测服务接口
 */
public interface DuplicateCheckService {
    
    /**
     * 分页查询查重结果列表
     */
    PageResult<DuplicateCheckResultDTO> list(long page, long size, String keyword, Double minRate, Double maxRate);
    
    /**
     * 获取查重结果详情
     */
    DuplicateCheckResultDTO getById(Long id);
    
    /**
     * 执行查重检测
     */
    DuplicateCheckResultDTO check(DuplicateCheckDTO dto);
    
    /**
     * 获取项目的查重结果
     */
    DuplicateCheckResultDTO getByProjectId(Long projectId);
    
    /**
     * 重新查重
     */
    DuplicateCheckResultDTO recheck(Long id);
}
