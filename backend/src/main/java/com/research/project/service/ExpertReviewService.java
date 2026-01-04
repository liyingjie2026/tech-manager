package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.ExpertReview;

import java.util.List;

/**
 * 专家评审流程服务接口
 */
public interface ExpertReviewService {
    
    /**
     * 分页查询评审列表
     */
    PageResult<ReviewDTO> list(Integer page, Integer size, String keyword, String status, String reviewType, Long expertId);
    
    /**
     * 获取评审详情
     */
    ReviewDetailDTO getById(Long id);
    
    /**
     * 发起专家评审
     */
    Long create(ReviewCreateDTO dto);
    
    /**
     * 更新评审信息
     */
    void update(Long id, ReviewUpdateDTO dto);
    
    /**
     * 取消评审
     */
    void cancel(Long id, String reason);
    
    /**
     * 结束评审（汇总结果）
     */
    void finish(Long id);
    
    /**
     * 获取评审结果汇总
     */
    ReviewSummaryDTO getSummary(Long id);
    
    /**
     * 获取各专家评审详情
     */
    List<ExpertReviewResultDTO> getExpertReviews(Long id);
    
    /**
     * 催促专家评审
     */
    void remind(Long id);
    
    /**
     * 导出评审结果
     */
    String export(Long id);
    
    /**
     * 公示评审结果
     */
    void publish(Long id, PublishDTO dto);
    
    /**
     * 获取专家评审统计信息
     */
    ReviewStatisticsDTO getStatistics();
    
    /**
     * 专家提交评审结果
     * @param id 评审ID
     * @param dto 评审结果DTO
     */
    void submitReview(Long id, ExpertReviewSubmitDTO dto);
    
    /**
     * 根据项目ID获取该专家的评审记录
     * @param projectId 项目ID
     * @param expertId 专家ID
     * @return 评审记录
     */
    ExpertReview getByProjectAndExpert(Long projectId, Long expertId);
}
