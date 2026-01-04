package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.BudgetListDTO;
import com.research.project.dto.BudgetChangeRecordDTO;

/**
 * 经费管理服务接口
 */
public interface BudgetService {
    
    /**
     * 分页查询项目经费列表
     */
    PageResult<BudgetListDTO> list(Integer page, Integer size, String keyword);
    
    /**
     * 获取经费变更记录
     */
    PageResult<BudgetChangeRecordDTO> getChangeRecords(Integer page, Integer size, String keyword);
    
    /**
     * 获取项目经费详情
     */
    BudgetListDTO getDetail(Long id);
    
    /**
     * 申请经费变更
     */
    void applyChange(BudgetChangeRecordDTO dto);
}
