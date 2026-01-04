package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;

/**
 * 共享资源服务接口
 */
public interface ResourceService {
    
    // ==================== 科研仪器 ====================
    
    /**
     * 分页查询科研仪器列表
     */
    PageResult<EquipmentDTO> listEquipment(Integer page, Integer size, String keyword, String field, String category, String status);
    
    /**
     * 获取科研仪器详情
     */
    EquipmentDetailDTO getEquipmentById(Long id);
    
    /**
     * 新增科研仪器
     */
    Long createEquipment(EquipmentCreateDTO dto);
    
    /**
     * 更新科研仪器
     */
    void updateEquipment(Long id, EquipmentUpdateDTO dto);
    
    /**
     * 删除科研仪器
     */
    void deleteEquipment(Long id);
    
    /**
     * 申请借用科研仪器
     */
    Long borrowEquipment(Long id, BorrowApplyDTO dto);
    
    /**
     * 审核借用申请
     */
    void auditBorrow(Long borrowId, AuditDTO dto);
    
    /**
     * 归还科研仪器
     */
    void returnEquipment(Long borrowId);
    
    // ==================== 基础数据 ====================
    
    /**
     * 分页查询基础数据列表
     */
    PageResult<BasicDataDTO> listBasicData(Integer page, Integer size, String keyword, String field, String projectType);
    
    /**
     * 获取基础数据详情
     */
    BasicDataDetailDTO getBasicDataById(Long id);
    
    /**
     * 新增基础数据
     */
    Long createBasicData(BasicDataCreateDTO dto);
    
    /**
     * 更新基础数据
     */
    void updateBasicData(Long id, BasicDataUpdateDTO dto);
    
    /**
     * 申请下载基础数据
     */
    Long applyDownloadData(Long id, DownloadApplyDTO dto);
    
    /**
     * 下载基础数据
     */
    String downloadData(Long id);
    
    // ==================== 专业软件 ====================
    
    /**
     * 分页查询专业软件列表
     */
    PageResult<SoftwareDTO> listSoftware(Integer page, Integer size, String keyword, String type);
    
    /**
     * 获取专业软件详情
     */
    SoftwareDetailDTO getSoftwareById(Long id);
    
    /**
     * 新增专业软件
     */
    Long createSoftware(SoftwareCreateDTO dto);
    
    /**
     * 申请使用专业软件
     */
    Long applySoftware(Long id, SoftwareApplyDTO dto);
    
    // ==================== 共享审核 ====================
    
    /**
     * 设置共享状态
     */
    void setShareStatus(String type, Long id, boolean shared);
}
