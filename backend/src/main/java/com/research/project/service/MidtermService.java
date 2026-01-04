package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 中期检查服务接口
 */
public interface MidtermService {
    
    /**
     * 分页查询中期检查列表
     */
    PageResult<MidtermDTO> list(Integer page, Integer size, String keyword, String status, String year);
    
    /**
     * 获取中期检查详情
     */
    MidtermDetailDTO getById(Long id);
    
    /**
     * 获取中期检查统计数据
     */
    MidtermStatisticsDTO getStatistics();
    
    /**
     * 创建中期检查报告
     */
    Long create(MidtermCreateDTO dto);
    
    /**
     * 更新中期检查报告
     */
    void update(Long id, MidtermUpdateDTO dto);
    
    /**
     * 提交中期检查报告
     */
    void submit(Long id);
    
    /**
     * 撤回中期检查报告
     */
    void withdraw(Long id);
    
    /**
     * 审核通过中期检查
     */
    void approve(Long id, String comment);
    
    /**
     * 审核驳回中期检查
     */
    void reject(Long id, String reason);
    
    /**
     * 下发中期检查通知
     */
    void sendNotice(MidtermNoticeDTO dto);
    
    /**
     * 上传中期检查附件
     */
    AttachmentDTO uploadAttachment(Long id, MultipartFile file, String type);
    
    /**
     * 导出中期检查报告
     */
    String export(Long id);
}
