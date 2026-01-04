package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 变更服务接口
 */
public interface ChangeService {
    
    /**
     * 分页查询变更列表
     */
    PageResult<ChangeDTO> list(Integer page, Integer size, String keyword, String status, String changeType);
    
    /**
     * 获取变更详情
     */
    ChangeDetailDTO getById(Long id);
    
    /**
     * 获取项目变更历史
     */
    List<ChangeDTO> getHistory(Long projectId);
    
    /**
     * 创建变更申请
     */
    Long create(ChangeCreateDTO dto);
    
    /**
     * 更新变更申请
     */
    void update(Long id, ChangeUpdateDTO dto);
    
    /**
     * 提交变更申请
     */
    void submit(Long id);
    
    /**
     * 撤回变更申请
     */
    void withdraw(Long id);
    
    /**
     * 删除变更申请
     */
    void delete(Long id);
    
    /**
     * 审核通过变更申请
     */
    void approve(Long id, String comment);
    
    /**
     * 审核驳回变更申请
     */
    void reject(Long id, String reason);
    
    /**
     * 退回变更申请修改
     */
    void returnForModification(Long id, String reason);
    
    /**
     * 上传变更附件
     */
    AttachmentDTO uploadAttachment(Long id, MultipartFile file);
    
    /**
     * 获取变更统计数据
     */
    ChangeStatisticsDTO getStatistics(String changeType, String status);
}
