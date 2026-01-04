package com.research.project.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Acceptance;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * 验收服务接口
 */
public interface AcceptanceService extends IService<Acceptance> {
    
    /**
     * 分页查询验收列表 - 对应Controller: list()
     */
    PageResult<AcceptanceDTO> list(Integer page, Integer size, String keyword, String status);
    
    /**
     * 获取验收详情 - 对应Controller: getById()
     */
    AcceptanceDetailDTO getById(Long id);
    
    /**
     * 获取验收统计数据 - 对应Controller: getStatistics()
     */
    AcceptanceStatisticsDTO getStatistics();
    
    /**
     * 创建验收申请 - 对应Controller: create()
     */
    Long create(AcceptanceCreateDTO dto);
    
    /**
     * 更新验收申请 - 对应Controller: update()
     */
    void update(Long id, AcceptanceUpdateDTO dto);
    
    /**
     * 上传验收附件 - 对应Controller: uploadAttachment()
     */
    AttachmentDTO uploadAttachment(Long id, MultipartFile file, String type);
    
    /**
     * 导出验收报告 - 对应Controller: export()
     */
    String export(Long id);
    
    // 保留原有方法
    /**
     * 根据项目ID查询验收记录
     */
    Acceptance getByProjectId(Long projectId);
    
    /**
     * 分页查询验收
     */
    IPage<Acceptance> pageAcceptances(Integer current, Integer size, String keyword, String status, String conclusion);
    
    /**
     * 提交验收申请
     */
    boolean submit(Long id);
    
    /**
     * 审核验收
     */
    boolean audit(Long id, String conclusion, String acceptanceComment);
    
    /**
     * 撤回验收申请
     */
    boolean withdraw(Long id);
    
    /**
     * 审批通过
     */
    boolean approve(Long id, String opinion);
    
    /**
     * 审批拒绝
     */
    boolean reject(Long id, String reason);
    
    /**
     * 发起专家评审 - 对应Controller: startReview()
     */
    void startReview(Long id, AcceptanceReviewDTO dto);
    
    /**
     * 添加附件
     */
    boolean addAttachments(Long id, List<Long> fileIds);
    
    /**
     * 导出验收表
     */
    byte[] exportAcceptance(Long id);
    
    /**
     * 获取统计数据
     */
    Map<String, Object> getStatisticsMap();
}
