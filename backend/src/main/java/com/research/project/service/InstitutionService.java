package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 机构服务接口
 */
public interface InstitutionService {
    
    /**
     * 分页查询机构列表
     */
    PageResult<InstitutionDTO> list(Integer page, Integer size, String keyword, String type, String status);
    
    /**
     * 获取所有机构（下拉选择用）
     */
    List<InstitutionDTO> listAll();
    
    /**
     * 获取机构详情
     */
    InstitutionDTO getById(Long id);
    
    /**
     * 新增机构
     */
    Long create(InstitutionCreateDTO dto);
    
    /**
     * 更新机构
     */
    void update(Long id, InstitutionUpdateDTO dto);
    
    /**
     * 删除机构
     */
    void delete(Long id);
    
    /**
     * 审核机构
     */
    void audit(Long id, AuditDTO dto);
    
    /**
     * 机构资质变更申请
     */
    void applyQualificationChange(Long id, QualificationChangeDTO dto);
    
    /**
     * 上传机构资质证书
     */
    String uploadQualification(Long id, MultipartFile file, String type);
    
    /**
     * 获取机构项目列表
     */
    PageResult<ProjectDTO> getProjects(Long id, Integer page, Integer size);
    
    /**
     * 获取机构成果列表
     */
    PageResult<AchievementDTO> getAchievements(Long id, Integer page, Integer size);
    
    /**
     * 获取机构绩效考核
     */
    InstitutionPerformanceDTO getPerformance(Long id);
}
