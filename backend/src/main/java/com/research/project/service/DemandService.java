package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 需求服务接口
 */
public interface DemandService {
    
    /**
     * 分页查询需求列表
     */
    PageResult<DemandDTO> list(Integer page, Integer size, String keyword, String status, String type);
    
    /**
     * 获取需求详情
     */
    DemandDetailDTO getById(Long id);
    
    /**
     * 创建需求
     */
    Long create(DemandCreateDTO dto);
    
    /**
     * 更新需求
     */
    void update(Long id, DemandUpdateDTO dto);
    
    /**
     * 删除需求
     */
    void delete(Long id);
    
    /**
     * 审核需求
     */
    void audit(Long id, AuditDTO dto);
    
    /**
     * 发布需求
     */
    void publish(Long id);
    
    /**
     * 取消发布需求
     */
    void unpublish(Long id);
    
    /**
     * 揭榜需求
     */
    Long bid(Long id, BidCreateDTO dto);
    
    /**
     * 获取揭榜列表
     */
    List<BidDTO> getBids(Long id);
    
    /**
     * 选定揭榜方
     */
    void selectBid(Long id, Long bidId);
    
    /**
     * 上传需求附件
     */
    AttachmentDTO uploadAttachment(Long id, MultipartFile file);
}
