package com.research.project.service.impl;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Award;
import com.research.project.mapper.AwardMapper;
import com.research.project.service.AwardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 获奖服务实现类
 */
@Service
@RequiredArgsConstructor
public class AwardServiceImpl implements AwardService {
    
    private final AwardMapper awardMapper;
    
    @Override
    public PageResult<AwardDTO> list(Integer page, Integer size, String keyword, String level, String status) {
        Page<Award> pageParam = new Page<>(page, size);
        QueryWrapper<Award> wrapper = new QueryWrapper<>();
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like("name", keyword).or().like("description", keyword);
        }
        if (level != null && !level.isEmpty()) {
            wrapper.eq("level", level);
        }
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        
        IPage<Award> pageResult = awardMapper.selectPage(pageParam, wrapper);
        List<AwardDTO> records = pageResult.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>((long) page, (long) size, pageResult.getTotal(), records);
    }
    
    @Override
    public AwardDetailDTO getById(Long id) {
        Award award = awardMapper.selectById(id);
        if (award == null) {
            throw new RuntimeException("获奖记录不存在");
        }
        return convertToDetailDTO(award);
    }
    
    @Override
    public List<AwardDTO> getByProject(Long projectId) {
        QueryWrapper<Award> wrapper = new QueryWrapper<>();
        wrapper.eq("project_id", projectId);
        List<Award> awards = awardMapper.selectList(wrapper);
        return awards.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Long create(AwardCreateDTO dto) {
        Award award = new Award();
        award.setProjectId(dto.getProjectId());
        award.setName(dto.getAwardName());
        award.setLevel(dto.getAwardLevel());
        award.setAwardDate(dto.getAwardDate());
        award.setAwardUnit(dto.getAwardUnit());
        award.setDescription(dto.getDescription());
        award.setAttachments(dto.getAttachments());
        award.setStatus("draft");
        award.setCreateTime(LocalDateTime.now());
        
        awardMapper.insert(award);
        return award.getId();
    }
    
    @Override
    public void update(Long id, AwardUpdateDTO dto) {
        Award award = awardMapper.selectById(id);
        if (award == null) {
            throw new RuntimeException("获奖记录不存在");
        }
        
        award.setName(dto.getAwardName());
        award.setLevel(dto.getAwardLevel());
        award.setAwardDate(dto.getAwardDate());
        award.setAwardUnit(dto.getAwardUnit());
        award.setDescription(dto.getDescription());
        award.setAttachments(dto.getAttachments());
        award.setUpdateTime(LocalDateTime.now());
        
        awardMapper.updateById(award);
    }
    
    @Override
    public void delete(Long id) {
        Award award = awardMapper.selectById(id);
        if (award == null) {
            throw new RuntimeException("获奖记录不存在");
        }
        awardMapper.deleteById(id);
    }
    
    @Override
    public void submit(Long id) {
        Award award = awardMapper.selectById(id);
        if (award == null) {
            throw new RuntimeException("获奖记录不存在");
        }
        
        award.setStatus("pending");
        award.setUpdateTime(LocalDateTime.now());
        awardMapper.updateById(award);
    }
    
    @Override
    public void audit(Long id, AuditDTO dto) {
        Award award = awardMapper.selectById(id);
        if (award == null) {
            throw new RuntimeException("获奖记录不存在");
        }
        
        award.setStatus(dto.getResult());
        award.setAuditComment(dto.getComment());
        award.setAuditTime(LocalDateTime.now());
        award.setUpdateTime(LocalDateTime.now());
        awardMapper.updateById(award);
    }
    
    @Override
    public String uploadCertificate(Long id, MultipartFile file) {
        Award award = awardMapper.selectById(id);
        if (award == null) {
            throw new RuntimeException("获奖记录不存在");
        }
        
        String fileUrl = "/uploads/certificates/" + file.getOriginalFilename();
        
        award.setCertificateUrl(fileUrl);
        award.setUpdateTime(LocalDateTime.now());
        awardMapper.updateById(award);
        
        return fileUrl;
    }
    
    private AwardDTO convertToDTO(Award award) {
        AwardDTO dto = new AwardDTO();
        dto.setId(award.getId());
        dto.setProjectId(award.getProjectId());
        dto.setProjectName(award.getProjectName());
        dto.setName(award.getName());
        dto.setCategory(award.getCategory());
        dto.setLevel(award.getLevel());
        dto.setAwardDate(award.getAwardDate());
        dto.setAwardUnit(award.getAwardUnit());
        dto.setWinningUnit(award.getWinningUnit());
        dto.setWinningPerson(award.getWinningPerson());
        dto.setDescription(award.getDescription());
        dto.setCertificateNo(award.getCertificateNo());
        dto.setAttachments(award.getAttachments());
        dto.setStatus(award.getStatus());
        dto.setAuditComment(award.getAuditComment());
        dto.setAuditTime(award.getAuditTime());
        dto.setAuditBy(award.getAuditBy());
        dto.setAwardTime(award.getAwardTime());
        dto.setCertificateUrl(award.getCertificateUrl());
        dto.setRemark(award.getRemark());
        dto.setCreateTime(award.getCreateTime());
        dto.setUpdateTime(award.getUpdateTime());
        dto.setCreateBy(award.getCreateBy());
        dto.setUpdateBy(award.getUpdateBy());
        return dto;
    }
    
    private AwardDetailDTO convertToDetailDTO(Award award) {
        AwardDetailDTO dto = new AwardDetailDTO();
        dto.setId(award.getId());
        dto.setProjectId(award.getProjectId());
        dto.setProjectName(award.getProjectName());
        dto.setName(award.getName());
        dto.setCategory(award.getCategory());
        dto.setLevel(award.getLevel());
        dto.setAwardDate(award.getAwardDate());
        dto.setAwardUnit(award.getAwardUnit());
        dto.setWinningUnit(award.getWinningUnit());
        dto.setWinningPerson(award.getWinningPerson());
        dto.setDescription(award.getDescription());
        dto.setCertificateNo(award.getCertificateNo());
        dto.setStatus(award.getStatus());
        dto.setAuditComment(award.getAuditComment());
        dto.setAuditTime(award.getAuditTime());
        dto.setAuditBy(award.getAuditBy());
        dto.setAwardTime(award.getAwardTime());
        dto.setCertificateUrl(award.getCertificateUrl());
        dto.setRemark(award.getRemark());
        dto.setCreateTime(award.getCreateTime());
        dto.setUpdateTime(award.getUpdateTime());
        dto.setCreateBy(award.getCreateBy());
        
        // 附件列表暂时返回空
        dto.setAttachments(new ArrayList<>());
        
        return dto;
    }
}
