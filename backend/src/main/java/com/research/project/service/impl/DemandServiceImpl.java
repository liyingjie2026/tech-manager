package com.research.project.service.impl;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Demand;
import com.research.project.mapper.DemandMapper;
import com.research.project.service.DemandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 需求服务实现类
 */
@Service
@RequiredArgsConstructor
public class DemandServiceImpl implements DemandService {
    
    private final DemandMapper demandMapper;
    
    @Override
    public PageResult<DemandDTO> list(Integer page, Integer size, String keyword, String status, String type) {
        // 计算偏移量
        int offset = (page - 1) * size;
        
        List<Demand> demands = demandMapper.selectByConditions(keyword, status, type, offset, size);
        List<DemandDTO> records = demands.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        long total = demandMapper.countByConditions(keyword, status, type);
        
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), total, records);
    }
    
    @Override
    public DemandDetailDTO getById(Long id) {
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        DemandDetailDTO dto = new DemandDetailDTO();
        dto.setId(demand.getId());
        dto.setTitle(demand.getName());
        dto.setType(demand.getType());
        dto.setStatus(demand.getStatus());
        dto.setDescription(demand.getDescription());
        dto.setCreatedAt(demand.getCreateTime());
        
        return dto;
    }
    
    @Override
    @Transactional
    public Long create(DemandCreateDTO dto) {
        Demand demand = new Demand();
        demand.setName(dto.getDemandName());
        demand.setType(dto.getDemandType());
        demand.setDescription(dto.getDemandDesc());
        demand.setStatus("draft");
        demand.setCreateTime(LocalDateTime.now());
        demand.setUpdateTime(LocalDateTime.now());
        
        demandMapper.insert(demand);
        
        return demand.getId();
    }
    
    @Override
    @Transactional
    public void update(Long id, DemandUpdateDTO dto) {
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        if (StringUtils.hasText(dto.getDemandName())) {
            demand.setName(dto.getDemandName());
        }
        if (StringUtils.hasText(dto.getDemandDesc())) {
            demand.setDescription(dto.getDemandDesc());
        }
        demand.setUpdateTime(LocalDateTime.now());
        
        demandMapper.updateById(demand);
    }
    
    @Override
    @Transactional
    public void delete(Long id) {
        // 查询需求
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        // 只能删除草稿状态的需求
        if (!"draft".equals(demand.getStatus())) {
            throw new RuntimeException("只能删除草稿状态的需求");
        }
        
        // 删除需求
        demandMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public void audit(Long id, AuditDTO dto) {
        // 查询需求
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        // 更新审核状态
        if ("approved".equals(dto.getResult())) {
            demand.setStatus("approved");
        } else {
            demand.setStatus("rejected");
        }
        demand.setUpdateTime(LocalDateTime.now());
        
        // 保存到数据库
        demandMapper.updateById(demand);
    }
    
    @Override
    @Transactional
    public void publish(Long id) {
        // 查询需求
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        // 只有审核通过的需求才能发布
        if (!"approved".equals(demand.getStatus())) {
            throw new RuntimeException("只有审核通过的需求才能发布");
        }
        
        // 更新状态为已发布
        demand.setStatus("published");
        demand.setUpdateTime(LocalDateTime.now());
        
        // 保存到数据库
        demandMapper.updateById(demand);
    }
    
    @Override
    @Transactional
    public void unpublish(Long id) {
        // 查询需求
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        // 更新状态为已关闭
        demand.setStatus("closed");
        demand.setUpdateTime(LocalDateTime.now());
        
        // 保存到数据库
        demandMapper.updateById(demand);
    }
    
    @Override
    @Transactional
    public Long bid(Long id, BidCreateDTO dto) {
        // 查询需求
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        // 只有已发布的需求才能揭榜
        if (!"published".equals(demand.getStatus())) {
            throw new RuntimeException("只有已发布的需求才能揭榜");
        }
        
        // 实际项目中应该创建单独的Bid表和BidMapper
        // 这里作为临时方案，将揭榜信息记录到需求的备注字段或创建简单的记录
        demand.setStatus("bidding"); // 更新状态为揭榜中
        demand.setUpdateTime(LocalDateTime.now());
        demandMapper.updateById(demand);
        
        return id; // 返回需求ID作为揭榜记录ID
    }
    
    @Override
    public List<BidDTO> getBids(Long id) {
        // 简化版实现：返回空列表，实际应该从Bid表查询
        // 实际项目中应该: return bidMapper.selectByDemandId(id);
        return new ArrayList<>();
    }
    
    @Override
    @Transactional
    public void selectBid(Long id, Long bidId) {
        // 查询需求
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        // 简化版实现，实际应该: bidMapper.updateStatus(bidId, "selected");
        
        demand.setStatus("matched");
        demand.setUpdateTime(LocalDateTime.now());
        demandMapper.updateById(demand);
    }
    
    @Override
    @Transactional
    public AttachmentDTO uploadAttachment(Long id, MultipartFile file) {
        Demand demand = demandMapper.selectById(id);
        if (demand == null) {
            throw new RuntimeException("需求不存在");
        }
        
        AttachmentDTO dto = new AttachmentDTO();
        dto.setFileName(file.getOriginalFilename());
        dto.setFileSize(file.getSize());
        dto.setFileUrl("/uploads/" + file.getOriginalFilename());
        dto.setUploadTime(LocalDateTime.now());
        
        return dto;
    }
    
    private DemandDTO convertToDTO(Demand demand) {
        DemandDTO dto = new DemandDTO();
        dto.setId(demand.getId());
        dto.setDemandNo(demand.getDemandNo());
        dto.setName(demand.getName());
        dto.setType(demand.getType());
        dto.setProjectType(demand.getProjectType());
        dto.setResearchField(demand.getResearchField());
        dto.setDescription(demand.getDescription());
        dto.setObjective(demand.getObjective());
        dto.setContent(demand.getContent());
        dto.setExpectedResult(demand.getExpectedResult());
        dto.setBudget(demand.getBudget());
        dto.setApplyStartDate(demand.getApplyStartDate());
        dto.setApplyEndDate(demand.getApplyEndDate());
        dto.setDuration(demand.getDuration());
        dto.setPublishUnit(demand.getPublishUnit());
        dto.setContactPerson(demand.getContactPerson());
        dto.setContactPhone(demand.getContactPhone());
        dto.setAttachments(demand.getAttachments());
        dto.setStatus(demand.getStatus());
        dto.setAuditStatus(demand.getAuditStatus());
        dto.setAuditComment(demand.getAuditComment());
        dto.setAuditTime(demand.getAuditTime());
        dto.setAuditBy(demand.getAuditBy());
        dto.setPublishTime(demand.getPublishTime());
        dto.setCreateTime(demand.getCreateTime());
        dto.setUpdateTime(demand.getUpdateTime());
        dto.setCreateBy(demand.getCreateBy());
        dto.setUpdateBy(demand.getUpdateBy());
        return dto;
    }
}
