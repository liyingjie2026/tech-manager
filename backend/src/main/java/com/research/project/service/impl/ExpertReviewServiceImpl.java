package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.ExpertReview;
import com.research.project.entity.Project;
import com.research.project.entity.Expert;
import com.research.project.mapper.ExpertReviewMapper;
import com.research.project.mapper.ProjectMapper;
import com.research.project.mapper.ExpertMapper;
import com.research.project.service.ExpertReviewService;
import com.research.project.service.ExpertVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 专家评审流程服务实现类
 */
@Service
@RequiredArgsConstructor
public class ExpertReviewServiceImpl implements ExpertReviewService {
    
    private final ExpertReviewMapper expertReviewMapper;
    private final ProjectMapper projectMapper;
    private final ExpertMapper expertMapper;
    private final ExpertVoteService expertVoteService;
    
    @Override
    public PageResult<ReviewDTO> list(Integer page, Integer size, String keyword, String status, String reviewType, Long expertId) {
        Page<ExpertReview> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ExpertReview> wrapper = new LambdaQueryWrapper<>();
        
        System.out.println("[ExpertReviewServiceImpl] Query parameters:");
        System.out.println("  page: " + page);
        System.out.println("  size: " + size);
        System.out.println("  keyword: " + keyword);
        System.out.println("  status: " + status);
        System.out.println("  reviewType: " + reviewType);
        System.out.println("  expertId: " + expertId);
        
        if (expertId != null) {
            wrapper.eq(ExpertReview::getExpertId, expertId);
        }
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(ExpertReview::getProjectName, keyword)
                   .or().like(ExpertReview::getBatchNo, keyword);
        }
        if (status != null && !status.isEmpty()) {
            wrapper.eq(ExpertReview::getStatus, status);
        }
        if (reviewType != null && !reviewType.isEmpty()) {
            wrapper.eq(ExpertReview::getReviewType, reviewType);
        }
        
        wrapper.orderByDesc(ExpertReview::getCreateTime);
        
        Page<ExpertReview> result = expertReviewMapper.selectPage(pageParam, wrapper);
        
        System.out.println("[ExpertReviewServiceImpl] Query results:");
        System.out.println("  total records: " + result.getTotal());
        System.out.println("  current page records: " + result.getRecords().size());
        
        List<ReviewDTO> dtoList = new ArrayList<>();
        for (ExpertReview entity : result.getRecords()) {
            ReviewDTO dto = new ReviewDTO();
            dto.setId(entity.getId());
            dto.setProjectId(entity.getProjectId());
            dto.setProjectName(entity.getProjectName());
            dto.setReviewType(entity.getReviewType());
            dto.setStatus(entity.getStatus());
            dto.setReviewEndTime(entity.getReviewEndTime());
            dto.setCreateTime(entity.getCreateTime());
            dto.setScore(entity.getScore());
            dto.setGrade(entity.getGrade());
            
            if (entity.getProjectId() != null) {
                Project project = projectMapper.selectById(entity.getProjectId());
                if (project != null) {
                    System.out.println("[ExpertReviewServiceImpl] Found project for ID " + entity.getProjectId() + ": " + project.getName());
                    dto.setProjectNo(project.getProjectNo());
                    dto.setProjectType(project.getProjectType());
                    dto.setProjectCategory(project.getProjectCategory());
                    dto.setInstitutionName(project.getInstitutionName());
                    dto.setLeaderName(project.getLeaderName());
                } else {
                    System.out.println("[ExpertReviewServiceImpl] Project not found for ID: " + entity.getProjectId());
                }
            }
            
            dtoList.add(dto);
        }
        
        System.out.println("[ExpertReviewServiceImpl] Returning " + dtoList.size() + " review DTOs");
        
        return new PageResult<>(Long.valueOf(result.getCurrent()), Long.valueOf(result.getSize()), result.getTotal(), dtoList);
    }
    
    @Override
    public ReviewDetailDTO getById(Long id) {
        System.out.println("[ExpertReviewServiceImpl] Getting review detail for ID: " + id);
        
        ExpertReview entity = null;
        
        // First try to get by review ID
        entity = expertReviewMapper.selectById(id);
        
        // If not found, try to get by project ID
        if (entity == null) {
            System.out.println("[ExpertReviewServiceImpl] Review not found by ID, trying as project ID");
            LambdaQueryWrapper<ExpertReview> wrapperQuery = new LambdaQueryWrapper<>();
            wrapperQuery.eq(ExpertReview::getProjectId, id);
            List<ExpertReview> reviews = expertReviewMapper.selectList(wrapperQuery);
            if (!reviews.isEmpty()) {
                entity = reviews.get(0);
                System.out.println("[ExpertReviewServiceImpl] Found review by project ID");
            }
        }
        
        if (entity == null) {
            System.out.println("[ExpertReviewServiceImpl] ERROR: Review not found for ID: " + id);
            throw new RuntimeException("评审记录不存在");
        }
        
        System.out.println("[ExpertReviewServiceImpl] Found review record:");
        System.out.println("  reviewId: " + entity.getId());
        System.out.println("  projectId: " + entity.getProjectId());
        System.out.println("  projectName: " + entity.getProjectName());
        System.out.println("  expertId: " + entity.getExpertId());
        System.out.println("  expertName: " + entity.getExpertName());
        System.out.println("  status: " + entity.getStatus());
        
        ReviewDetailDTO dto = new ReviewDetailDTO();
        dto.setId(entity.getId());
        dto.setProjectId(entity.getProjectId());
        dto.setProjectName(entity.getProjectName());
        dto.setReviewType(entity.getReviewType());
        dto.setStatus(entity.getStatus());
        dto.setCreateTime(entity.getCreateTime());
        
        if (entity.getProjectId() != null) {
            Project project = projectMapper.selectById(entity.getProjectId());
            if (project != null) {
                System.out.println("[ExpertReviewServiceImpl] Loaded project details: " + project.getName());
                dto.setProjectName(project.getName());
            }
        }
        
        if (entity.getBatchNo() != null && !entity.getBatchNo().isEmpty()) {
            LambdaQueryWrapper<ExpertReview> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(ExpertReview::getBatchNo, entity.getBatchNo());
            List<ExpertReview> batchReviews = expertReviewMapper.selectList(wrapper);
            
            System.out.println("[ExpertReviewServiceImpl] Found " + batchReviews.size() + " experts in this review batch");
            
            List<ExpertDTO> expertList = new ArrayList<>();
            for (ExpertReview review : batchReviews) {
                if (review.getExpertId() != null) {
                    Expert expert = expertMapper.selectById(review.getExpertId());
                    if (expert != null) {
                        ExpertDTO expertDTO = new ExpertDTO();
                        expertDTO.setId(expert.getId());
                        expertDTO.setName(expert.getName());
                        expertDTO.setTitle(expert.getTitle());
                        expertDTO.setMajor(expert.getMajor());
                        expertDTO.setWorkUnit(expert.getOrganization());
                        expertDTO.setPhone(expert.getPhone());
                        expertList.add(expertDTO);
                        
                        System.out.println("[ExpertReviewServiceImpl] Added expert to team: " + expert.getName());
                    }
                }
            }
            dto.setExperts(expertList);
        }
        
        System.out.println("[ExpertReviewServiceImpl] Returning review detail with " + 
            (dto.getExperts() != null ? dto.getExperts().size() : 0) + " experts");
        
        return dto;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(ReviewCreateDTO dto) {
        System.out.println("[ExpertReviewServiceImpl] Creating expert reviews:");
        System.out.println("  projectId: " + dto.getProjectId());
        System.out.println("  reviewType: " + dto.getReviewType());
        System.out.println("  expertIds: " + dto.getExpertIds());
        System.out.println("  reviewDate: " + dto.getReviewDate());
        
        // Get project information
        Project project = projectMapper.selectById(dto.getProjectId());
        if (project == null) {
            System.out.println("[ExpertReviewServiceImpl] ERROR: Project not found for ID: " + dto.getProjectId());
            throw new RuntimeException("项目不存在");
        }
        
        System.out.println("[ExpertReviewServiceImpl] Found project: " + project.getName());
        System.out.println("  Project status: " + project.getStatus());
        System.out.println("  Institution: " + project.getInstitutionName());
        System.out.println("  Leader: " + project.getLeaderName());
        
        // Generate batch number
        String batchNo = "REVIEW-" + System.currentTimeMillis();
        
        int createdCount = 0;
        
        // Create review record for each expert
        for (Long expertId : dto.getExpertIds()) {
            Expert expert = expertMapper.selectById(expertId);
            if (expert == null) {
                System.out.println("[ExpertReviewServiceImpl] WARNING: Expert not found for ID: " + expertId);
                continue;
            }
            
            System.out.println("[ExpertReviewServiceImpl] Creating review for expert: " + expert.getName() + " (ID: " + expertId + ")");
            
            ExpertReview entity = new ExpertReview();
            entity.setBatchNo(batchNo);
            entity.setProjectId(dto.getProjectId());
            entity.setProjectName(project.getName());
            entity.setExpertId(expertId);
            entity.setExpertName(expert.getName());
            entity.setReviewType(dto.getReviewType());
            entity.setStatus("pending");
            entity.setCreateTime(LocalDateTime.now());
            
            if (dto.getReviewDate() != null && !dto.getReviewDate().isEmpty()) {
                // Parse review date string to LocalDateTime
                entity.setReviewEndTime(LocalDateTime.parse(dto.getReviewDate() + "T23:59:59"));
            }
            
            expertReviewMapper.insert(entity);
            createdCount++;
            System.out.println("[ExpertReviewServiceImpl] Created review record ID: " + entity.getId());
        }
        
        // Initialize vote records for expert selection
        System.out.println("[ExpertReviewServiceImpl] Initializing vote records for expert selection");
        expertVoteService.initializeVotingForProject(dto.getProjectId(), dto.getExpertIds());
        
        System.out.println("[ExpertReviewServiceImpl] Successfully created " + createdCount + " expert review records");
        
        // Return the project ID
        return project.getId();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, ReviewUpdateDTO dto) {
        ExpertReview entity = expertReviewMapper.selectById(id);
        if (entity == null) {
            throw new RuntimeException("评审记录不存在");
        }
        
        if (dto.getReviewType() != null) {
            entity.setReviewType(dto.getReviewType());
        }
        entity.setUpdateTime(LocalDateTime.now());
        
        expertReviewMapper.updateById(entity);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancel(Long id, String reason) {
        ExpertReview entity = expertReviewMapper.selectById(id);
        if (entity == null) {
            throw new RuntimeException("评审记录不存在");
        }
        
        entity.setStatus("cancelled");
        entity.setUpdateTime(LocalDateTime.now());
        expertReviewMapper.updateById(entity);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void finish(Long id) {
        ExpertReview entity = expertReviewMapper.selectById(id);
        if (entity == null) {
            throw new RuntimeException("评审记录不存在");
        }
        
        entity.setStatus("finished");
        entity.setUpdateTime(LocalDateTime.now());
        expertReviewMapper.updateById(entity);
    }
    
    @Override
    public ReviewSummaryDTO getSummary(Long id) {
        ExpertReview entity = expertReviewMapper.selectById(id);
        if (entity == null) {
            throw new RuntimeException("评审记录不存在");
        }
        
        ReviewSummaryDTO dto = new ReviewSummaryDTO();
        
        // 统计各状态的评审数量
        LambdaQueryWrapper<ExpertReview> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(ExpertReview::getStatus, "pending");
        long pending = expertReviewMapper.selectCount(wrapper);
        
        wrapper.clear();
        wrapper.eq(ExpertReview::getStatus, "in_progress");
        long inProgress = expertReviewMapper.selectCount(wrapper);
        
        wrapper.clear();
        wrapper.eq(ExpertReview::getStatus, "completed");
        long completed = expertReviewMapper.selectCount(wrapper);
        
        dto.setPendingCount(Long.valueOf(pending).intValue());
        dto.setInProgressCount(Long.valueOf(inProgress).intValue());
        dto.setCompletedCount(Long.valueOf(completed).intValue());
        dto.setTotalCount(Long.valueOf(pending + inProgress + completed).intValue());
        
        return dto;
    }
    
    @Override
    public List<ExpertReviewResultDTO> getExpertReviews(Long id) {
        LambdaQueryWrapper<ExpertReview> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExpertReview::getProjectId, id)
               .orderByDesc(ExpertReview::getCreateTime);
        
        List<ExpertReview> reviews = expertReviewMapper.selectList(wrapper);
        List<ExpertReviewResultDTO> results = new ArrayList<>();
        
        for (ExpertReview review : reviews) {
            ExpertReviewResultDTO dto = new ExpertReviewResultDTO();
            dto.setId(review.getId());
            dto.setExpertId(review.getExpertId());
            dto.setExpertName(review.getExpertName());
            dto.setScore(review.getScore());
            dto.setGrade(review.getGrade());
            dto.setComment(review.getComment());
            dto.setReviewTime(review.getReviewTime());
            dto.setStatus(review.getStatus());
            results.add(dto);
        }
        
        return results;
    }
    
    @Override
    public void remind(Long id) {
        ExpertReview entity = expertReviewMapper.selectById(id);
        if (entity == null) {
            throw new RuntimeException("评审记录不存在");
        }
        
        if (!"pending".equals(entity.getStatus())) {
            throw new RuntimeException("只能催办待评审的记录");
        }
        
        // In real implementation:
        // 1. Get expert contact info
        // 2. Send email/SMS notification
        // 3. Record reminder history
        // notificationService.sendReminder(entity.getExpertId(), entity.getProjectName());
        
        System.out.println("[ExpertReviewServiceImpl] Reminder sent to expert: " + entity.getExpertName() + 
                          " for project: " + entity.getProjectName());
    }
    
    @Override
    public String export(Long id) {
        ExpertReview entity = expertReviewMapper.selectById(id);
        if (entity == null) {
            throw new RuntimeException("评审记录不存在");
        }
        
        // In real implementation:
        // 1. Query all expert reviews for this batch
        // 2. Generate Excel with review details
        // 3. Save to file server
        // 4. Return download URL
        
        String filename = "expert_review_" + entity.getBatchNo() + "_" + System.currentTimeMillis() + ".xlsx";
        return "/exports/reviews/" + filename;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void publish(Long id, PublishDTO dto) {
        ExpertReview entity = expertReviewMapper.selectById(id);
        if (entity == null) {
            throw new RuntimeException("评审记录不存在");
        }
        
        entity.setStatus("published");
        entity.setUpdateTime(LocalDateTime.now());
        expertReviewMapper.updateById(entity);
    }
    
    @Override
    public ReviewStatisticsDTO getStatistics() {
        ReviewStatisticsDTO dto = new ReviewStatisticsDTO();
        
        // 统计各状态的评审数量
        LambdaQueryWrapper<ExpertReview> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(ExpertReview::getStatus, "pending");
        long pending = expertReviewMapper.selectCount(wrapper);
        
        wrapper.clear();
        wrapper.eq(ExpertReview::getStatus, "in_progress");
        long inProgress = expertReviewMapper.selectCount(wrapper);
        
        wrapper.clear();
        wrapper.eq(ExpertReview::getStatus, "completed");
        long completed = expertReviewMapper.selectCount(wrapper);
        
        dto.setPendingCount(Long.valueOf(pending).intValue());
        dto.setInProgressCount(Long.valueOf(inProgress).intValue());
        dto.setCompletedCount(Long.valueOf(completed).intValue());
        dto.setTotalCount(Long.valueOf(pending + inProgress + completed).intValue());
        
        return dto;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submitReview(Long id, ExpertReviewSubmitDTO dto) {
        System.out.println("[ExpertReviewServiceImpl] Submitting review for ID: " + id);
        System.out.println("  Score: " + dto.getScore());
        System.out.println("  Comment: " + dto.getComment());
        System.out.println("  Recommended: " + dto.getRecommended());
        
        ExpertReview entity = expertReviewMapper.selectById(id);
        if (entity == null) {
            System.out.println("[ExpertReviewServiceImpl] ERROR: Review not found for ID: " + id);
            throw new RuntimeException("评审记录不存在");
        }
        
        if ("reviewed".equals(entity.getStatus()) || "completed".equals(entity.getStatus())) {
            System.out.println("[ExpertReviewServiceImpl] WARNING: Review already submitted, status: " + entity.getStatus());
            throw new RuntimeException("该评审已提交，无法重复提交");
        }
        
        // Update review details
        entity.setScore(dto.getScore());
        entity.setGrade(dto.getGrade());
        entity.setComment(dto.getComment());
        entity.setRecommended(dto.getRecommended());
        entity.setReviewTime(LocalDateTime.now());
        
        entity.setStatus("reviewed");
        entity.setUpdateTime(LocalDateTime.now());
        
        expertReviewMapper.updateById(entity);
        
        System.out.println("[ExpertReviewServiceImpl] Review submitted successfully, status changed to 'reviewed'");
    }
    
    @Override
    public ExpertReview getByProjectAndExpert(Long projectId, Long expertId) {
        LambdaQueryWrapper<ExpertReview> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExpertReview::getProjectId, projectId)
               .eq(ExpertReview::getExpertId, expertId)
               .orderByDesc(ExpertReview::getCreateTime)
               .last("LIMIT 1");
        
        return expertReviewMapper.selectOne(wrapper);
    }
}
