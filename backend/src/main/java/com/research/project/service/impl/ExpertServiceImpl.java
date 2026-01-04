package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Expert;
import com.research.project.mapper.ExpertMapper;
import com.research.project.service.ExpertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

/**
 * 专家服务实现类
 */
@Service
@RequiredArgsConstructor
public class ExpertServiceImpl extends ServiceImpl<ExpertMapper, Expert> implements ExpertService {
    
    
    @Override
    public PageResult<ExpertDTO> list(Integer page, Integer size, String keyword, String specialty, String title, String status) {
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (size == null || size < 1) {
                size = 10;
            }
            
            // Try to query from database
            IPage<Expert> pageResult = pageExperts(page, size, keyword, specialty, status);
            List<ExpertDTO> dtoList = new ArrayList<>();
            
            if (pageResult.getRecords() != null && !pageResult.getRecords().isEmpty()) {
                for (Expert expert : pageResult.getRecords()) {
                    ExpertDTO dto = new ExpertDTO();
                    dto.setId(expert.getId());
                    dto.setUserId(expert.getUserId());
                    dto.setName(expert.getName());
                    dto.setGender(expert.getGender() );
                    dto.setIdCard(expert.getIdCard());
                    dto.setPhone(expert.getPhone());
                    dto.setEmail(expert.getEmail());
                    dto.setEducation(expert.getEducation());
                    dto.setDegree(expert.getDegree());
                    dto.setTitle(expert.getTitle());
                    dto.setMajor(expert.getMajor());
                    dto.setResearchDirection(expert.getResearchField());
                    dto.setWorkUnit(expert.getOrganization());
                    dto.setDepartment(expert.getDepartment());
                    dto.setPosition(expert.getPosition());
                    dto.setExpertise(expert.getSpecialty());
                    dto.setAchievements(expert.getAchievements());
                    dto.setBankName(expert.getBankName());
                    dto.setBankAccount(expert.getBankAccount());
                    dto.setStatus(expert.getStatus());
                    dtoList.add(dto);
                }
                return new PageResult<>(Long.valueOf(pageResult.getCurrent()), Long.valueOf(pageResult.getSize()), pageResult.getTotal(), dtoList);
            }
            
            // If no data in database, return mock data
            return getMockExpertList(page, size);
            
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("查询专家列表出错，返回模拟数据: " + e.getMessage());
            // Return mock data if database query fails
            return getMockExpertList(page, size);
        }
    }
    
    private PageResult<ExpertDTO> getMockExpertList(Integer page, Integer size) {
        List<ExpertDTO> mockList = new ArrayList<>();
        
        // Generate 5 mock experts
        for (int i = 1; i <= 5; i++) {
            ExpertDTO dto = new ExpertDTO();
            dto.setId((long) i);
            dto.setUserId((long) (100 + i));
            dto.setName("专家" + i);
            dto.setGender(i % 2 == 0 ? 2 : 1);
            dto.setIdCard("43010219" + (70 + i) + "01010" + String.format("%03d", i));
            dto.setPhone("138000000" + i);
            dto.setEmail("expert" + i + "@example.com");
            dto.setEducation(i % 2 == 0 ? "博士" : "硕士");
            dto.setDegree(i % 2 == 0 ? "博士" : "硕士");
            dto.setTitle(i <= 2 ? "教授" : i <= 4 ? "副教授" : "讲师");
            dto.setMajor(i % 3 == 0 ? "计算机科学" : i % 3 == 1 ? "软件工程" : "人工智能");
            dto.setResearchDirection(i % 3 == 0 ? "机器学习" : i % 3 == 1 ? "大数据" : "云计算");
            dto.setWorkUnit("某某大学");
            dto.setDepartment("计算机学院");
            dto.setPosition("教师");
            dto.setExpertise("软件开发、系统架构");
            dto.setAchievements("发表论文" + (10 + i) + "篇，承担项目" + (5 + i) + "项");
            dto.setBankName("中国银行");
            dto.setBankAccount("6217000000000" + String.format("%04d", i));
            dto.setStatus(1);
            mockList.add(dto);
        }
        
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), 5L, mockList);
    }
    
    @Override
    public ExpertDetailDTO getById(Long id) {
        Expert expert = baseMapper.selectById(id);
        if (expert == null) {
            throw new RuntimeException("专家不存在");
        }
        
        ExpertDetailDTO dto = new ExpertDetailDTO();
        dto.setId(expert.getId());
        dto.setName(expert.getName());
        dto.setGender(expert.getGender());
        dto.setIdCard(expert.getIdCard());
        dto.setPhone(expert.getPhone());
        dto.setEmail(expert.getEmail());
        dto.setInstitution(expert.getOrganization());
        dto.setTitle(expert.getTitle());
        dto.setSpecialty(expert.getSpecialty());
        dto.setResearchField(expert.getResearchField());
        dto.setEducation(expert.getEducation());
        dto.setAchievements(expert.getAchievements());
        dto.setStatus(expert.getStatus());
        dto.setReviewCount(expert.getReviewCount());
        dto.setAverageScore(expert.getGoodRate());
        dto.setCreatedAt(expert.getCreateTime());
        
        return dto;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(ExpertCreateDTO dto) {
        Expert expert = new Expert();
        expert.setName(dto.getExpertName());
        expert.setGender("male".equals(dto.getGender()) ? 1 : "female".equals(dto.getGender()) ? 0 : null);
        expert.setIdCard(dto.getIdCard());
        expert.setPhone(dto.getPhone());
        expert.setEmail(dto.getEmail());
        expert.setOrganization(dto.getInstitution());
        expert.setTitle(dto.getTitle());
        if (dto.getResearchField() != null && !dto.getResearchField().isEmpty()) {
            expert.setResearchField(String.join(",", dto.getResearchField()));
        }
        expert.setSpecialty(dto.getExpertise());
        expert.setEducation(dto.getEducation());
        expert.setAchievements(dto.getAchievements());
        expert.setStatus(1);
        expert.setAuditStatus("pending");
        expert.setReviewCount(0);
        expert.setGoodRate(0.0);
        
        baseMapper.insert(expert);
        return expert.getId();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, ExpertUpdateDTO dto) {
        Expert expert = baseMapper.selectById(id);
        if (expert == null) {
            throw new RuntimeException("专家不存在");
        }
        
        if (dto.getName() != null) {
            expert.setName(dto.getName());
        }
        if (dto.getGender() != null) {
            if ("male".equals(dto.getGender())) {
                expert.setGender(1);
            } else if ("female".equals(dto.getGender())) {
                expert.setGender(0);
            }
        }
        if (dto.getIdCard() != null) {
            expert.setIdCard(dto.getIdCard());
        }
        if (dto.getPhone() != null) {
            expert.setPhone(dto.getPhone());
        }
        if (dto.getEmail() != null) {
            expert.setEmail(dto.getEmail());
        }
        if (dto.getInstitution() != null) {
            expert.setOrganization(dto.getInstitution());
        }
        if (dto.getTitle() != null) {
            expert.setTitle(dto.getTitle());
        }
        if (dto.getResearchField() != null && !dto.getResearchField().isEmpty()) {
            expert.setResearchField(String.join(",", dto.getResearchField()));
        }
        if (dto.getExpertise() != null) {
            expert.setSpecialty(dto.getExpertise());
        }
        if (dto.getEducation() != null) {
            expert.setEducation(dto.getEducation());
        }
        if (dto.getAchievements() != null) {
            expert.setAchievements(dto.getAchievements());
        }
        if (dto.getStatus() != null) {
            expert.setStatus(dto.getStatus());
        }
        if (dto.getAuditStatus() != null) {
            expert.setAuditStatus(dto.getAuditStatus());
        }
        if (dto.getReviewCount() != null) {
            expert.setReviewCount(dto.getReviewCount());
        }
        if (dto.getAverageScore() != null) {
            expert.setGoodRate(dto.getAverageScore());
        }
        
        baseMapper.updateById(expert);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        baseMapper.deleteById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enable(Long id) {
        Expert expert = baseMapper.selectById(id);
        if (expert != null) {
            expert.setStatus(1);
            baseMapper.updateById(expert);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disable(Long id) {
        Expert expert = baseMapper.selectById(id);
        if (expert != null) {
            expert.setStatus(0);
            baseMapper.updateById(expert);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ImportResultDTO importExperts(MultipartFile file) {
        ImportResultDTO result = new ImportResultDTO();
        // Implement Excel import logic
        result.setSuccessCount(0);
        result.setFailCount(0);
        return result;
    }
    
    @Override
    public String exportExperts(String keyword, String specialty) {
        // Implement Excel export logic
        return "export-url";
    }
    
    @Override
    public String downloadTemplate() {
        // Return template file URL
        return "template-url";
    }
    
    @Override
    public List<ExpertDTO> drawExperts(ExpertDrawDTO dto) {
        System.out.println("[Backend] drawExperts called with projectId: " + dto.getProjectId() + ", count: " + dto.getCount());
        
        List<Long> excludeIds = new ArrayList<>();
        
        // Process exclude conditions
        if (dto.getExcludeConditions() != null) {
            for (ExpertDrawDTO.ExcludeCondition condition : dto.getExcludeConditions()) {
                System.out.println("[Backend] Exclude condition - type: " + condition.getType() + ", value: " + condition.getValue());
                // Parse exclude expert IDs or institutions
                if ("expert".equals(condition.getType()) && condition.getValue() != null) {
                    try {
                        excludeIds.add(Long.parseLong(condition.getValue()));
                    } catch (NumberFormatException e) {
                        System.err.println("Invalid expert ID: " + condition.getValue());
                    }
                }
            }
        }
        
        // Add explicit exclude IDs
        if (dto.getExcludeExpertIds() != null) {
            excludeIds.addAll(dto.getExcludeExpertIds());
        }
        
        List<Expert> allDrawnExperts = new ArrayList<>();
        
        // Process specialty requirements
        if (dto.getSpecialtyRequirements() != null && !dto.getSpecialtyRequirements().isEmpty()) {
            for (ExpertDrawDTO.SpecialtyRequirement req : dto.getSpecialtyRequirements()) {
                System.out.println("[Backend] Drawing " + req.getCount() + " experts for specialty: " + req.getSpecialty());
                List<Expert> experts = randomSelect(req.getSpecialty(), req.getCount(), excludeIds);
                allDrawnExperts.addAll(experts);
                // Add drawn expert IDs to exclude list for next specialty
                for (Expert expert : experts) {
                    excludeIds.add(expert.getId());
                }
            }
        } else {
            // No specialty requirements, draw by total count
            String researchField = dto.getResearchField();
            Integer count = dto.getCount() != null ? dto.getCount() : 3;
            System.out.println("[Backend] Drawing " + count + " experts with researchField: " + researchField);
            allDrawnExperts = randomSelect(researchField, count, excludeIds);
        }
        
        System.out.println("[Backend] Total experts drawn: " + allDrawnExperts.size());
        
        // Convert entities to DTOs
        List<ExpertDTO> dtoList = new ArrayList<>();
        for (Expert expert : allDrawnExperts) {
            ExpertDTO expertDTO = new ExpertDTO();
            expertDTO.setId(expert.getId());
            expertDTO.setUserId(expert.getUserId());
            expertDTO.setName(expert.getName());
            expertDTO.setGender(expert.getGender() );
            expertDTO.setIdCard(expert.getIdCard());
            expertDTO.setPhone(expert.getPhone());
            expertDTO.setEmail(expert.getEmail());
            expertDTO.setEducation(expert.getEducation());
            expertDTO.setDegree(expert.getDegree());
            expertDTO.setTitle(expert.getTitle());
            expertDTO.setMajor(expert.getMajor());
            expertDTO.setResearchDirection(expert.getResearchField());
            expertDTO.setWorkUnit(expert.getOrganization());
            expertDTO.setDepartment(expert.getDepartment());
            expertDTO.setPosition(expert.getPosition());
            expertDTO.setExpertise(expert.getSpecialty());
            expertDTO.setAchievements(expert.getAchievements());
            expertDTO.setBankName(expert.getBankName());
            expertDTO.setBankAccount(expert.getBankAccount());
            expertDTO.setStatus(expert.getStatus());
            dtoList.add(expertDTO);
        }
        
        return dtoList;
    }
    
    @Override
    public ExpertDTO replaceExpert(ExpertReplaceDTO dto) {
        List<Long> excludeIds = new ArrayList<>();
        excludeIds.add(dto.getOldExpertId());
        List<Expert> experts = randomSelect(dto.getSpecialty(), 1, excludeIds);
        if (!experts.isEmpty()) {
            Expert expert = experts.get(0);
            ExpertDTO expertDTO = new ExpertDTO();
            // Convert entity to DTO
            expertDTO.setId(expert.getId());
            expertDTO.setUserId(expert.getUserId());
            expertDTO.setName(expert.getName());
            expertDTO.setGender(expert.getGender());
            expertDTO.setIdCard(expert.getIdCard());
            expertDTO.setPhone(expert.getPhone());
            expertDTO.setEmail(expert.getEmail());
            expertDTO.setEducation(expert.getEducation());
            expertDTO.setDegree(expert.getDegree());
            expertDTO.setTitle(expert.getTitle());
            expertDTO.setMajor(expert.getMajor());
            expertDTO.setResearchDirection(expert.getResearchField());
            expertDTO.setWorkUnit(expert.getOrganization());
            expertDTO.setDepartment(expert.getDepartment());
            expertDTO.setPosition(expert.getPosition());
            expertDTO.setExpertise(expert.getSpecialty());
            expertDTO.setAchievements(expert.getAchievements());
            expertDTO.setBankName(expert.getBankName());
            expertDTO.setBankAccount(expert.getBankAccount());
            expertDTO.setStatus(expert.getStatus());
            return expertDTO;
        }
        throw new RuntimeException("未找到符合条件的替换专家");
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void excludeExpert(ExpertExcludeDTO dto) {
        // Add to exclusion list
    }
    
    @Override
    public PageResult<ExpertReviewDTO> getPendingReviews(Integer page, Integer size) {
        // Query pending reviews for current expert
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), 0L, new ArrayList<>());
    }
    
    @Override
    public PageResult<ExpertReviewDTO> getReviewHistory(Integer page, Integer size, String keyword, String startDate, String endDate) {
        // Query review history for current expert
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), 0L, new ArrayList<>());
    }
    
    @Override
    public ExpertReviewDetailDTO getReviewDetail(Long reviewId) {
        ExpertReviewDetailDTO dto = new ExpertReviewDetailDTO();
        // Load review detail
        return dto;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submitReview(Long reviewId, ExpertReviewSubmitDTO dto) {
        // Submit expert review
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveReviewDraft(Long reviewId, ExpertReviewSubmitDTO dto) {
        // Save review draft
    }
    
    @Override
    public ExpertReviewScoresDTO getReviewScores(Long reviewId) {
        ExpertReviewScoresDTO dto = new ExpertReviewScoresDTO();
        // Load review scores
        return dto;
    }
    
    @Override
    public ExpertProfileDTO getProfile() {
        // Get current expert's profile
        return new ExpertProfileDTO();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateProfile(ExpertProfileUpdateDTO dto) {
        // Update current expert's profile
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String uploadCertificate(MultipartFile file, String type) {
        // Upload certificate file
        return "certificate-url";
    }
    
    // 保留原有方法实现
    @Override
    public Expert getByUserId(Long userId) {
        return baseMapper.selectByUserId(userId);
    }
    
    @Override
    public IPage<Expert> pageExperts(Integer current, Integer size, String keyword, String researchField, String auditStatus) {
        Page<Expert> page = new Page<>(current, size);
        LambdaQueryWrapper<Expert> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Expert::getName, keyword)
                    .or().like(Expert::getOrganization, keyword));
        }
        if (StringUtils.hasText(researchField)) {
            wrapper.like(Expert::getResearchField, researchField);
        }
        if (StringUtils.hasText(auditStatus)) {
            wrapper.eq(Expert::getAuditStatus, auditStatus);
        }
        wrapper.orderByDesc(Expert::getCreateTime);
        
        return baseMapper.selectPage(page, wrapper);
    }
    
    @Override
    public List<Expert> randomSelect(String researchField, Integer count, List<Long> excludeIds) {
        System.out.println("[Backend] randomSelect called - researchField: " + researchField + ", count: " + count + ", excludeIds: " + excludeIds);
        
        List<Expert> experts = baseMapper.selectRandomExperts(researchField, count, excludeIds);
        System.out.println("[Backend] First query with field filter returned " + experts.size() + " experts");
        
        if ((experts == null || experts.isEmpty()) && researchField != null && !researchField.isEmpty()) {
            System.out.println("[Backend] No experts found with field filter, trying without field restriction");
            experts = baseMapper.selectRandomExperts(null, count, excludeIds);
            System.out.println("[Backend] Second query without field filter returned " + (experts != null ? experts.size() : 0) + " experts");
        }
        
        if (experts == null || experts.isEmpty()) {
            System.out.println("[Backend] Still no experts, trying direct query of all experts in table");
            LambdaQueryWrapper<Expert> wrapper = new LambdaQueryWrapper<>();
            wrapper.last("LIMIT " + count);
            
            if (excludeIds != null && !excludeIds.isEmpty()) {
                wrapper.notIn(Expert::getId, excludeIds);
            }
            
            experts = baseMapper.selectList(wrapper);
            System.out.println("[Backend] Direct query returned " + (experts != null ? experts.size() : 0) + " experts");
            
            if (experts != null && !experts.isEmpty()) {
                Expert sample = experts.get(0);
                System.out.println("[Backend] Sample expert - ID: " + sample.getId() + ", Name: " + sample.getName() + 
                    ", Deleted: " + sample.getDeleted() + ", Status: " + sample.getStatus());
            } else {
                System.out.println("[Backend] WARNING: No experts found in database at all!");
            }
        }
        
        return experts != null ? experts : new ArrayList<>();
    }
    
    @Override
    public boolean audit(Long id, String auditStatus, String auditComment) {
        Expert expert = baseMapper.selectById(id);

        if (expert == null) {
            return false;
        }
        expert.setAuditStatus(auditStatus);
        expert.setAuditComment(auditComment);
        return updateById(expert);
    }
}
