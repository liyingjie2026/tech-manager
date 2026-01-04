package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 年度检查服务接口
 */
public interface AnnualService {
    
    /**
     * 分页查询年度检查列表
     */
    PageResult<AnnualDTO> list(long page, long size, String keyword, String status, String year);
    
    /**
     * 获取年度检查详情
     */
    AnnualDetailDTO getById(Long id);
    
    /**
     * 获取年度检查统计数据
     */
    AnnualStatisticsDTO getStatistics();
    
    /**
     * 创建年度检查报告
     */
    Long create(AnnualCreateDTO dto);
    
    /**
     * 更新年度检查报告
     */
    void update(Long id, AnnualUpdateDTO dto);
    
    /**
     * 提交年度检查报告
     */
    void submit(Long id);
    
    /**
     * 审核通过年度检查
     */
    void approve(Long id, String comment);
    
    /**
     * 审核驳回年度检查
     */
    void reject(Long id, String reason);
    
    /**
     * 下发年度检查通知
     */
    void sendNotice(AnnualNoticeDTO dto);
    
    /**
     * 上传年度检查附件
     */
    AttachmentDTO uploadAttachment(Long id, MultipartFile file, String type);
}
