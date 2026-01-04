package com.research.project.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Expert;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 专家服务接口
 */
public interface ExpertService extends IService<Expert> {
    
    
    /**
     * 分页查询专家列表
     */
    PageResult<ExpertDTO> list(Integer page, Integer size, String keyword, String specialty, String title, String status);
    
    /**
     * 获取专家详情
     */
    ExpertDetailDTO getById(Long id);
    
    /**
     * 新增专家
     */
    Long create(ExpertCreateDTO dto);
    
    /**
     * 更新专家
     */
    void update(Long id, ExpertUpdateDTO dto);
    
    /**
     * 删除专家
     */
    void delete(Long id);
    
    /**
     * 启用专家
     */
    void enable(Long id);
    
    /**
     * 禁用专家
     */
    void disable(Long id);
    
    /**
     * 批量导入专家
     */
    ImportResultDTO importExperts(MultipartFile file);
    
    /**
     * 导出专家列表
     */
    String exportExperts(String keyword, String specialty);
    
    /**
     * 下载导入模板
     */
    String downloadTemplate();
    
    /**
     * 随机抽取专家
     */
    List<ExpertDTO> drawExperts(ExpertDrawDTO dto);
    
    /**
     * 替换专家
     */
    ExpertDTO replaceExpert(ExpertReplaceDTO dto);
    
    /**
     * 排除专家
     */
    void excludeExpert(ExpertExcludeDTO dto);
    
    /**
     * 获取待评审项目列表
     */
    PageResult<ExpertReviewDTO> getPendingReviews(Integer page, Integer size);
    
    /**
     * 获取评审历史列表
     */
    PageResult<ExpertReviewDTO> getReviewHistory(Integer page, Integer size, String keyword, String startDate, String endDate);
    
    /**
     * 获取评审详情
     */
    ExpertReviewDetailDTO getReviewDetail(Long reviewId);
    
    /**
     * 提交评审意见
     */
    void submitReview(Long reviewId, ExpertReviewSubmitDTO dto);
    
    /**
     * 保存评审草稿
     */
    void saveReviewDraft(Long reviewId, ExpertReviewSubmitDTO dto);
    
    /**
     * 查看评审打分详情
     */
    ExpertReviewScoresDTO getReviewScores(Long reviewId);
    
    /**
     * 获取专家个人信息
     */
    ExpertProfileDTO getProfile();
    
    /**
     * 更新专家个人信息
     */
    void updateProfile(ExpertProfileUpdateDTO dto);
    
    /**
     * 上传专家证书
     */
    String uploadCertificate(MultipartFile file, String type);
    
    // 保留原有方法
    /**
     * 根据用户ID查询专家
     */
    Expert getByUserId(Long userId);
    
    /**
     * 分页查询专家
     */
    IPage<Expert> pageExperts(Integer current, Integer size, String keyword, String researchField, String auditStatus);
    
    /**
     * 随机抽取专家
     */
    List<Expert> randomSelect(String researchField, Integer count, List<Long> excludeIds);
    
    /**
     * 审核专家
     */
    boolean audit(Long id, String auditStatus, String auditComment);
}
