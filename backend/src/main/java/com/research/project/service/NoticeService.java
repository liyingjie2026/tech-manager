package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.NoticeCreateDTO;
import com.research.project.dto.NoticeDTO;
import com.research.project.dto.NoticeDetailDTO;
import com.research.project.dto.NoticeUpdateDTO;

import java.util.List;

/**
 * 通知公告服务接口
 */
public interface NoticeService {
    
    /**
     * 分页查询通知列表
     */
    PageResult<NoticeDTO> list(Integer page, Integer size, String keyword, String type, String status);
    
    /**
     * 根据ID获取通知详情
     */
    NoticeDetailDTO getById(Long id);
    
    /**
     * 创建通知
     */
    Long create(NoticeCreateDTO dto);
    
    /**
     * 更新通知
     */
    void update(Long id, NoticeUpdateDTO dto);
    
    /**
     * 删除通知
     */
    void delete(Long id);
    
    /**
     * 发布通知
     */
    void publish(Long id);
    
    /**
     * 撤回通知
     */
    void withdraw(Long id);
    
    /**
     * 获取已发布通知列表
     */
    List<NoticeDTO> listPublished(Integer limit);
    
    /**
     * 标记通知已读
     */
    void markAsRead(Long id);
    
    /**
     * 获取未读通知数量
     */
    Integer getUnreadCount();
}
