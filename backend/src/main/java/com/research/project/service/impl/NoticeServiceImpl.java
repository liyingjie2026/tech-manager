package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.dto.NoticeCreateDTO;
import com.research.project.dto.NoticeDTO;
import com.research.project.dto.NoticeDetailDTO;
import com.research.project.dto.NoticeUpdateDTO;
import com.research.project.entity.Notice;
import com.research.project.mapper.NoticeMapper;
import com.research.project.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 通知公告服务实现类
 */
@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {
    
    private final NoticeMapper noticeMapper;
    
    @Override
    public PageResult<NoticeDTO> list(Integer page, Integer size, String keyword, String type, String status) {
        Page<Notice> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Notice> wrapper = new LambdaQueryWrapper<>();
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.like(Notice::getTitle, keyword)
                   .or()
                   .like(Notice::getContent, keyword);
        }
        if (type != null && !type.trim().isEmpty()) {
            wrapper.eq(Notice::getType, type);
        }
        if (status != null && !status.trim().isEmpty()) {
            wrapper.eq(Notice::getStatus, status);
        }
        
        wrapper.orderByDesc(Notice::getIsTop)
               .orderByDesc(Notice::getPublishTime);
        
        Page<Notice> result = noticeMapper.selectPage(pageParam, wrapper);
        
        List<NoticeDTO> records = result.getRecords().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), result.getTotal(), records);
    }
    
    @Override
    public NoticeDetailDTO getById(Long id) {
        Notice notice = noticeMapper.selectById(id);
        if (notice == null) {
            throw new RuntimeException("通知不存在");
        }
        
        NoticeDetailDTO dto = new NoticeDetailDTO();
        BeanUtils.copyProperties(notice, dto);
        
        dto.setStatusName(getStatusName(notice.getStatus()));
        dto.setTypeName(getTypeName(notice.getType()));
        
        return dto;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(NoticeCreateDTO dto) {
        Notice notice = new Notice();
        BeanUtils.copyProperties(dto, notice);
        notice.setStatus("draft");
        notice.setCreateTime(LocalDateTime.now());
        notice.setUpdateTime(LocalDateTime.now());
        
        noticeMapper.insert(notice);
        return notice.getId();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, NoticeUpdateDTO dto) {
        Notice notice = noticeMapper.selectById(id);
        if (notice == null) {
            throw new RuntimeException("通知不存在");
        }
        
        BeanUtils.copyProperties(dto, notice);
        notice.setUpdateTime(LocalDateTime.now());
        
        noticeMapper.updateById(notice);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Notice notice = noticeMapper.selectById(id);
        if (notice == null) {
            throw new RuntimeException("通知不存在");
        }
        
        // 只能删除草稿状态的通知
        if (!"draft".equals(notice.getStatus())) {
            throw new RuntimeException("只能删除草稿状态的通知");
        }
        
        noticeMapper.deleteById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void publish(Long id) {
        Notice notice = noticeMapper.selectById(id);
        if (notice == null) {
            throw new RuntimeException("通知不存在");
        }
        
        notice.setStatus("published");
        notice.setPublishTime(LocalDateTime.now());
        notice.setUpdateTime(LocalDateTime.now());
        
        noticeMapper.updateById(notice);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void withdraw(Long id) {
        Notice notice = noticeMapper.selectById(id);
        if (notice == null) {
            throw new RuntimeException("通知不存在");
        }
        
        if (!"published".equals(notice.getStatus())) {
            throw new RuntimeException("只能撤回已发布的通知");
        }
        
        notice.setStatus("withdrawn");
        notice.setUpdateTime(LocalDateTime.now());
        
        noticeMapper.updateById(notice);
    }
    
    @Override
    public List<NoticeDTO> listPublished(Integer limit) {
        LambdaQueryWrapper<Notice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Notice::getStatus, "published")
               .orderByDesc(Notice::getIsTop)
               .orderByDesc(Notice::getPublishTime)
               .last("LIMIT " + limit);
        
        return noticeMapper.selectList(wrapper).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markAsRead(Long id) {
        Notice notice = noticeMapper.selectById(id);
        if (notice != null) {
            notice.setViewCount(notice.getViewCount() == null ? 1 : notice.getViewCount() + 1);
            noticeMapper.updateById(notice);
        }
    }
    
    @Override
    public Integer getUnreadCount() {
        LambdaQueryWrapper<Notice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Notice::getStatus, "published");
        return Math.toIntExact(noticeMapper.selectCount(wrapper));
    }
    
    private NoticeDTO convertToDTO(Notice notice) {
        NoticeDTO dto = new NoticeDTO();
        dto.setId(notice.getId());
        dto.setTitle(notice.getTitle());
        dto.setType(notice.getType());
        dto.setContent(notice.getContent());
        dto.setPublishTime(notice.getPublishTime());
        dto.setIsTop(notice.getIsTop() == 1);
        dto.setStatus(notice.getStatus() != null ? getStatusCode(notice.getStatus()) : null);
        return dto;
    }
    
    private Integer getStatusCode(String status) {
        return switch (status) {
            case "draft" -> 0;
            case "published" -> 1;
            case "withdrawn", "offline" -> 2;
            default -> 0;
        };
    }
    
    private String getStatusName(String status) {
        return switch (status) {
            case "draft" -> "草稿";
            case "published" -> "已发布";
            case "withdrawn" -> "已撤回";
            default -> "未知";
        };
    }
    
    private String getTypeName(String type) {
        return switch (type) {
            case "system" -> "系统通知";
            case "project" -> "项目通知";
            case "review" -> "评审通知";
            case "announcement" -> "公告";
            default -> "其他";
        };
    }
}
