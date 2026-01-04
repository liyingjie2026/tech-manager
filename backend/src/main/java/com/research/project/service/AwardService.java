package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 获奖服务接口
 */
public interface AwardService {
    
    /**
     * 分页查询获奖列表
     */
    PageResult<AwardDTO> list(Integer page, Integer size, String keyword, String level, String status);
    
    /**
     * 根据ID获取获奖详情
     */
    AwardDetailDTO getById(Long id);
    
    /**
     * 根据项目ID查询获奖列表
     */
    List<AwardDTO> getByProject(Long projectId);
    
    /**
     * 创建获奖记录
     */
    Long create(AwardCreateDTO dto);
    
    /**
     * 更新获奖记录
     */
    void update(Long id, AwardUpdateDTO dto);
    
    /**
     * 删除获奖记录
     */
    void delete(Long id);
    
    /**
     * 提交获奖审核
     */
    void submit(Long id);
    
    /**
     * 审核获奖
     */
    void audit(Long id, AuditDTO dto);
    
    /**
     * 上传获奖证书
     */
    String uploadCertificate(Long id, MultipartFile file);
}
