package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.*;
import com.research.project.mapper.*;
import com.research.project.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 共享资源服务实现类
 */
@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {
    
    private final EquipmentMapper equipmentMapper;
    private final BasicDataMapper basicDataMapper;
    private final SoftwareMapper softwareMapper;
    private final BorrowRecordMapper borrowRecordMapper;
    private final DownloadRecordMapper downloadRecordMapper;
    
    // ==================== 科研仪器 ====================
    
    @Override
    public PageResult<EquipmentDTO> listEquipment(Integer page, Integer size, String keyword, String field, String category, String status) {
        Page<Equipment> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Equipment> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Equipment::getName, keyword)
                    .or().like(Equipment::getModel, keyword)
                    .or().like(Equipment::getManufacturer, keyword));
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(Equipment::getStatus, status);
        }
        wrapper.orderByDesc(Equipment::getCreateTime);
        
        Page<Equipment> pageResult = equipmentMapper.selectPage(pageParam, wrapper);
        List<EquipmentDTO> dtoList = pageResult.getRecords().stream()
                .map(this::convertToEquipmentDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(page.longValue(), size.longValue(), pageResult.getTotal(), dtoList);
    }
    
    @Override
    public EquipmentDetailDTO getEquipmentById(Long id) {
        Equipment equipment = equipmentMapper.selectById(id);
        if (equipment == null) {
            throw new RuntimeException("科研仪器不存在");
        }
        
        EquipmentDetailDTO dto = new EquipmentDetailDTO();
        BeanUtils.copyProperties(equipment, dto);
        return dto;
    }
    
    @Override
    @Transactional
    public Long createEquipment(EquipmentCreateDTO dto) {
        Equipment equipment = new Equipment();
        BeanUtils.copyProperties(dto, equipment);
        equipment.setStatus("available");
        equipment.setCreateTime(LocalDateTime.now());
        equipment.setUpdateTime(LocalDateTime.now());
        
        equipmentMapper.insert(equipment);
        return equipment.getId();
    }
    
    @Override
    @Transactional
    public void updateEquipment(Long id, EquipmentUpdateDTO dto) {
        Equipment equipment = equipmentMapper.selectById(id);
        if (equipment == null) {
            throw new RuntimeException("科研仪器不存在");
        }
        
        BeanUtils.copyProperties(dto, equipment);
        equipment.setUpdateTime(LocalDateTime.now());
        equipmentMapper.updateById(equipment);
    }
    
    @Override
    @Transactional
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentMapper.selectById(id);
        if (equipment == null) {
            throw new RuntimeException("科研仪器不存在");
        }
        
        equipmentMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public Long borrowEquipment(Long id, BorrowApplyDTO dto) {
        Equipment equipment = equipmentMapper.selectById(id);
        if (equipment == null) {
            throw new RuntimeException("科研仪器不存在");
        }
        if (!"available".equals(equipment.getStatus())) {
            throw new RuntimeException("仪器当前不可借用");
        }
        
        BorrowRecord record = new BorrowRecord();
        record.setEquipmentId(id);
        record.setBorrowerId(dto.getUserId());
        record.setInstitutionId(dto.getInstitutionId());
        record.setReason(dto.getPurpose());
        record.setBorrowTime(dto.getStartDateAsLocalDate().atStartOfDay());
        record.setExpectedReturnTime(dto.getEndDateAsLocalDate().atStartOfDay());
        record.setStatus("pending");
        record.setCreateTime(LocalDateTime.now());
        
        borrowRecordMapper.insert(record);
        return record.getId();
    }
    
    @Override
    @Transactional
    public void auditBorrow(Long borrowId, AuditDTO dto) {
        BorrowRecord record = borrowRecordMapper.selectById(borrowId);
        if (record == null) {
            throw new RuntimeException("借用记录不存在");
        }
        
        record.setStatus(dto.getResult());
        record.setAuditComment(dto.getComment());
        record.setAuditTime(LocalDateTime.now());
        
        borrowRecordMapper.updateById(record);
        
        // 更新仪器状态
        if ("approved".equals(dto.getResult())) {
            Equipment equipment = equipmentMapper.selectById(record.getEquipmentId());
            equipment.setStatus("borrowed");
            equipmentMapper.updateById(equipment);
        }
    }
    
    @Override
    @Transactional
    public void returnEquipment(Long borrowId) {
        BorrowRecord record = borrowRecordMapper.selectById(borrowId);
        if (record == null) {
            throw new RuntimeException("借用记录不存在");
        }
        
        record.setStatus("returned");
        record.setActualReturnTime(LocalDateTime.now());
        borrowRecordMapper.updateById(record);
        
        // 更新仪器状态
        Equipment equipment = equipmentMapper.selectById(record.getEquipmentId());
        equipment.setStatus("available");
        equipmentMapper.updateById(equipment);
    }
    
    // ==================== 基础数据 ====================
    
    @Override
    public PageResult<BasicDataDTO> listBasicData(Integer page, Integer size, String keyword, String field, String projectType) {
        Page<BasicData> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<BasicData> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(BasicData::getName, keyword)
                    .or().like(BasicData::getDescription, keyword));
        }
        if (StringUtils.hasText(field)) {
            wrapper.eq(BasicData::getField, field);
        }
        wrapper.orderByDesc(BasicData::getCreateTime);
        
        Page<BasicData> pageResult = basicDataMapper.selectPage(pageParam, wrapper);
        List<BasicDataDTO> dtoList = pageResult.getRecords().stream()
                .map(this::convertToBasicDataDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(page.longValue(), size.longValue(), pageResult.getTotal(), dtoList);
    }
    
    @Override
    public BasicDataDetailDTO getBasicDataById(Long id) {
        BasicData data = basicDataMapper.selectById(id);
        if (data == null) {
            throw new RuntimeException("基础数据不存在");
        }
        
        BasicDataDetailDTO dto = new BasicDataDetailDTO();
        BeanUtils.copyProperties(data, dto);
        return dto;
    }
    
    @Override
    @Transactional
    public Long createBasicData(BasicDataCreateDTO dto) {
        BasicData data = new BasicData();
        BeanUtils.copyProperties(dto, data);
        data.setCreateTime(LocalDateTime.now());
        data.setUpdateTime(LocalDateTime.now());
        
        basicDataMapper.insert(data);
        return data.getId();
    }
    
    @Override
    @Transactional
    public void updateBasicData(Long id, BasicDataUpdateDTO dto) {
        BasicData data = basicDataMapper.selectById(id);
        if (data == null) {
            throw new RuntimeException("基础数据不存在");
        }
        
        BeanUtils.copyProperties(dto, data);
        data.setUpdateTime(LocalDateTime.now());
        basicDataMapper.updateById(data);
    }
    
    @Override
    @Transactional
    public Long applyDownloadData(Long id, DownloadApplyDTO dto) {
        BasicData data = basicDataMapper.selectById(id);
        if (data == null) {
            throw new RuntimeException("基础数据不存在");
        }
        
        DownloadRecord record = new DownloadRecord();
        record.setDataId(id);
        record.setDownloaderId(dto.getUserId());
        record.setInstitutionId(dto.getInstitutionId());
        record.setReason(dto.getPurpose());
        record.setStatus("pending");
        record.setCreateTime(LocalDateTime.now());
        
        downloadRecordMapper.insert(record);
        return record.getId();
    }
    
    @Override
    public String downloadData(Long id) {
        BasicData data = basicDataMapper.selectById(id);
        if (data == null) {
            throw new RuntimeException("基础数据不存在");
        }
        
        return data.getFilePath();
    }
    
    // ==================== 专业软件 ====================
    
    @Override
    public PageResult<SoftwareDTO> listSoftware(Integer page, Integer size, String keyword, String type) {
        Page<Software> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Software> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Software::getName, keyword)
                    .or().like(Software::getDescription, keyword));
        }
        if (StringUtils.hasText(type)) {
            wrapper.eq(Software::getType, type);
        }
        wrapper.orderByDesc(Software::getCreateTime);
        
        Page<Software> pageResult = softwareMapper.selectPage(pageParam, wrapper);
        List<SoftwareDTO> dtoList = pageResult.getRecords().stream()
                .map(this::convertToSoftwareDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(page.longValue(), size.longValue(), pageResult.getTotal(), dtoList);
    }
    
    @Override
    public SoftwareDetailDTO getSoftwareById(Long id) {
        Software software = softwareMapper.selectById(id);
        if (software == null) {
            throw new RuntimeException("专业软件不存在");
        }
        
        SoftwareDetailDTO dto = new SoftwareDetailDTO();
        BeanUtils.copyProperties(software, dto);
        return dto;
    }
    
    @Override
    @Transactional
    public Long createSoftware(SoftwareCreateDTO dto) {
        Software software = new Software();
        BeanUtils.copyProperties(dto, software);
        software.setCreateTime(LocalDateTime.now());
        software.setUpdateTime(LocalDateTime.now());
        
        softwareMapper.insert(software);
        return software.getId();
    }
    
    @Override
    @Transactional
    public Long applySoftware(Long id, SoftwareApplyDTO dto) {
        Software software = softwareMapper.selectById(id);
        if (software == null) {
            throw new RuntimeException("专业软件不存在");
        }
        
        return id;
    }
    
    // ==================== 共享审核 ====================
    
    @Override
    @Transactional
    public void setShareStatus(String type, Long id, boolean shared) {
        switch (type) {
            case "equipment":
                Equipment equipment = equipmentMapper.selectById(id);
                if (equipment != null) {
                    equipment.setIsShared(shared ? 1 : 0);
                    equipmentMapper.updateById(equipment);
                }
                break;
            case "data":
                BasicData data = basicDataMapper.selectById(id);
                if (data != null) {
                    data.setIsShared(shared ? 1 : 0);
                    basicDataMapper.updateById(data);
                }
                break;
            case "software":
                Software software = softwareMapper.selectById(id);
                if (software != null) {
                    software.setIsShared(shared ? 1 : 0);
                    softwareMapper.updateById(software);
                }
                break;
            default:
                throw new RuntimeException("不支持的资源类型");
        }
    }
    
    // ==================== 辅助方法 ====================
    
    private EquipmentDTO convertToEquipmentDTO(Equipment equipment) {
        EquipmentDTO dto = new EquipmentDTO();
        BeanUtils.copyProperties(equipment, dto);
        return dto;
    }
    
    private BasicDataDTO convertToBasicDataDTO(BasicData data) {
        BasicDataDTO dto = new BasicDataDTO();
        BeanUtils.copyProperties(data, dto);
        return dto;
    }
    
    private SoftwareDTO convertToSoftwareDTO(Software software) {
        SoftwareDTO dto = new SoftwareDTO();
        BeanUtils.copyProperties(software, dto);
        return dto;
    }
}
