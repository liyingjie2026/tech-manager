package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 成果服务接口
 */
public interface AchievementService {
    
    
    /**
     * 分页查询成果列表
     */
    PageResult<AchievementDTO> list(long page, long size, String keyword, String type, String status);
    
    /**
     * 获取成果详情
     */
    AchievementDetailDTO getById(Long id);
    
    /**
     * 获取项目成果列表
     */
    List<AchievementDTO> getByProject(Long projectId);
    
    /**
     * 创建成果
     */
    Long create(AchievementCreateDTO dto);
    
    /**
     * 更新成果
     */
    void update(Long id, AchievementUpdateDTO dto);
    
    /**
     * 删除成果
     */
    void delete(Long id);
    
    /**
     * 提交成果审核
     */
    void submit(Long id);
    
    /**
     * 审核通过成果
     */
    void approve(Long id, String comment);
    
    /**
     * 审核驳回成果
     */
    void reject(Long id, String reason);
    
    /**
     * 上传成果附件
     */
    AttachmentDTO uploadAttachment(Long id, MultipartFile file);
    
    /**
     * 下载成果附件
     */
    String downloadAttachment(Long id, Long attachmentId);
    
    /**
     * 获取成果转化列表
     */
    PageResult<TransformationDTO> listTransformation(long page, long size, String keyword, String status);
    
    /**
     * 创建成果转化记录
     */
    Long createTransformation(Long id, TransformationCreateDTO dto);
    
    /**
     * 更新成果转化记录
     */
    void updateTransformation(Long transformationId, TransformationUpdateDTO dto);
    
    /**
     * 提交成果转化审核
     */
    void submitTransformation(Long transformationId);
    
    /**
     * 审核成果转化
     */
    void auditTransformation(Long transformationId, AuditDTO dto);
    
    /**
     * 发布成果推介
     */
    void publish(Long id);
    
    /**
     * 取消成果推介
     */
    void unpublish(Long id);
    
    /**
     * 获取已发布成果列表
     */
    PageResult<AchievementDTO> listPublished(long page, long size, String field);
}
