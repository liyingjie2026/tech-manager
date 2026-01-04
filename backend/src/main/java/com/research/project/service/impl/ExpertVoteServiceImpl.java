package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.research.project.entity.*;
import com.research.project.mapper.*;
import com.research.project.service.ExpertVoteService;
import com.research.project.vo.VoteResultVO;
import com.research.project.commonenum.StatusEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 专家投票服务实现
 */
@Service
@RequiredArgsConstructor
public class ExpertVoteServiceImpl implements ExpertVoteService {

    private final ExpertVoteMapper expertVoteMapper;
    private final ExpertLeaderMapper expertLeaderMapper;
    private final ExpertReviewMapper expertReviewMapper;
    private final ExpertMapper expertMapper;
    private final ProjectMapper projectMapper;

    @Override
    @Transactional
    public void vote(Long projectId, Long voterExpertId, Long votedExpertId) {
        // 检查是否已投票
        LambdaQueryWrapper<ExpertVote> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExpertVote::getProjectId, projectId)
               .eq(ExpertVote::getVoterExpertId, voterExpertId);
        
        ExpertVote existingVote = expertVoteMapper.selectOne(wrapper);
        if (existingVote != null) {
            throw new RuntimeException("您已投过票，不能重复投票");
        }

        // 获取专家和项目信息
        Expert voterExpert = expertMapper.selectById(voterExpertId);
        Expert votedExpert = expertMapper.selectById(votedExpertId);
        Project project = projectMapper.selectById(projectId);

        // 保存投票记录
        ExpertVote vote = new ExpertVote();
        vote.setProjectId(projectId);
        vote.setProjectName(project.getName());
        vote.setVoterExpertId(voterExpertId);
        vote.setVoterExpertName(voterExpert.getName());
        vote.setVotedExpertId(votedExpertId);
        vote.setVotedExpertName(votedExpert.getName());
        vote.setVoteTime(LocalDateTime.now());
        expertVoteMapper.insert(vote);

        // 统计投票结果，自动选举组长
        electLeader(projectId);
    }

    @Override
    public List<VoteResultVO> getVoteResult(Long projectId) {
        System.out.println("[ExpertVoteServiceImpl] Getting vote result for project: " + projectId);
        
        LambdaQueryWrapper<ExpertReview> reviewWrapper = new LambdaQueryWrapper<>();
        reviewWrapper.eq(ExpertReview::getProjectId, projectId);
        List<ExpertReview> reviews = expertReviewMapper.selectList(reviewWrapper);
        
        System.out.println("[ExpertVoteServiceImpl] Found " + reviews.size() + " expert review records");
        
        // If no votes yet, return all experts from ExpertReview as candidates
        List<Map<String, Object>> voteStats = expertVoteMapper.countVotesByProject(projectId);
        System.out.println("[ExpertVoteServiceImpl] Found " + voteStats.size() + " vote statistics");
        
        // 查询当前组长
        LambdaQueryWrapper<ExpertLeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExpertLeader::getProjectId, projectId);
        ExpertLeader leader = expertLeaderMapper.selectOne(wrapper);
        Long leaderId = leader != null ? leader.getExpertId() : null;

        // 构建结果
        List<VoteResultVO> results = new ArrayList<>();
        
        if (voteStats.isEmpty() && !reviews.isEmpty()) {
            System.out.println("[ExpertVoteServiceImpl] No votes yet, building candidate list from ExpertReview records");
            for (ExpertReview review : reviews) {
                if (review.getExpertId() != null) {
                    Expert expert = expertMapper.selectById(review.getExpertId());
                    if (expert != null) {
                        VoteResultVO vo = new VoteResultVO();
                        vo.setExpertId(review.getExpertId());
                        vo.setExpertName(expert.getName());
                        vo.setExpertTitle(expert.getTitle());
                        vo.setVoteCount(0);
                        vo.setIsLeader(false);
                        results.add(vo);
                        System.out.println("[ExpertVoteServiceImpl] Added candidate: " + expert.getName());
                    }
                }
            }
        } else {
            // Use existing vote statistics
            for (Map<String, Object> stat : voteStats) {
                VoteResultVO vo = new VoteResultVO();
                vo.setExpertId(((Number) stat.get("expertId")).longValue());
                vo.setExpertName((String) stat.get("expertName"));
                vo.setVoteCount(((Number) stat.get("voteCount")).intValue());
                vo.setIsLeader(vo.getExpertId().equals(leaderId));
                results.add(vo);
            }
        }

        System.out.println("[ExpertVoteServiceImpl] Returning " + results.size() + " vote results");
        return results;
    }

    @Override
    @Transactional
    public void uploadConclusion(Long projectId, Long expertId, String conclusionContent, String conclusionFileUrl) {
        // 验证是否是组长
        LambdaQueryWrapper<ExpertLeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExpertLeader::getProjectId, projectId)
               .eq(ExpertLeader::getExpertId, expertId);
        
        ExpertLeader leader = expertLeaderMapper.selectOne(wrapper);
        if (leader == null) {
            throw new RuntimeException("您不是该项目的组长，无权上传结论");
        }

        LambdaQueryWrapper<ExpertReview> reviewWrapper = new LambdaQueryWrapper<>();
        reviewWrapper.eq(ExpertReview::getProjectId, projectId)
                     .eq(ExpertReview::getStatus, "pending");
        
        long pendingCount = expertReviewMapper.selectCount(reviewWrapper);
        if (pendingCount > 0) {
//            throw new RuntimeException("还有专家未完成评审，无法上传结论");
        }

        // 更新结论信息
        leader.setConclusionContent(conclusionContent);
        leader.setConclusionFileUrl(conclusionFileUrl);
        leader.setConclusionStatus("uploaded");
        leader.setConclusionUploadTime(LocalDateTime.now());
        expertLeaderMapper.updateById(leader);

        LambdaQueryWrapper<ExpertReview> updateWrapper = new LambdaQueryWrapper<>();
        updateWrapper.eq(ExpertReview::getProjectId, projectId);
        List<ExpertReview> reviews = expertReviewMapper.selectList(updateWrapper);
        
        for (ExpertReview review : reviews) {
            review.setStatus("completed");
            review.setUpdateTime(LocalDateTime.now());
            expertReviewMapper.updateById(review);
        }

        Project project = projectMapper.selectById(projectId);
        if (project != null) {
            project.setStatus(StatusEnum.PRELIMINARY_REVIEW_PASSED.getCode());
            project.setUpdateTime(LocalDateTime.now());
            projectMapper.updateById(project);
        }
    }

    @Override
    public List<Object> getLeaderProjects(Long expertId) {
        // 查询该专家担任组长的项目
        LambdaQueryWrapper<ExpertLeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExpertLeader::getExpertId, expertId);
        
        List<ExpertLeader> leaders = expertLeaderMapper.selectList(wrapper);
        List<Object> result = new ArrayList<>();

        for (ExpertLeader leader : leaders) {
            LambdaQueryWrapper<ExpertReview> reviewWrapper = new LambdaQueryWrapper<>();
            reviewWrapper.eq(ExpertReview::getProjectId, leader.getProjectId());
            
            List<ExpertReview> reviews = expertReviewMapper.selectList(reviewWrapper);
            long reviewedCount = reviews.stream()
                .filter(r -> "reviewed".equals(r.getStatus()) || "completed".equals(r.getStatus()))
                .count();
            
            // 只返回所有专家已完成评审的项目
            if (reviewedCount == reviews.size() && reviews.size() > 0) {
                Map<String, Object> projectInfo = new HashMap<>();
                projectInfo.put("projectId", leader.getProjectId());
                projectInfo.put("projectName", leader.getProjectName());
                projectInfo.put("conclusionStatus", leader.getConclusionStatus());
                projectInfo.put("totalExperts", reviews.size());
                projectInfo.put("completedExperts", reviewedCount);
                result.add(projectInfo);
            }
        }

        return result;
    }

    @Override
    @Transactional
    public void initializeVotingForProject(Long projectId, List<Long> expertIds) {
        System.out.println("[ExpertVoteServiceImpl] Initializing voting for project: " + projectId);
        System.out.println("[ExpertVoteServiceImpl] Expert IDs: " + expertIds);
        
        // This method is called after ExpertReview records are created
        // The voting system will use ExpertReview records to build the candidate list
        // No additional initialization needed as we're using ExpertReview as the source
        
        System.out.println("[ExpertVoteServiceImpl] Voting initialization complete (using ExpertReview records)");
    }

    /**
     * 自动选举组长（得票最多的专家）
     */
    private void electLeader(Long projectId) {
        List<Map<String, Object>> voteStats = expertVoteMapper.countVotesByProject(projectId);
        
        if (voteStats.isEmpty()) {
            return;
        }

        // 得票最多的专家
        Map<String, Object> topVoted = voteStats.get(0);
        Long expertId = ((Number) topVoted.get("expertId")).longValue();
        String expertName = (String) topVoted.get("expertName");
        Integer voteCount = ((Number) topVoted.get("voteCount")).intValue();

        // 查询是否已有组长记录
        LambdaQueryWrapper<ExpertLeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExpertLeader::getProjectId, projectId);
        ExpertLeader existingLeader = expertLeaderMapper.selectOne(wrapper);

        Project project = projectMapper.selectById(projectId);

        if (existingLeader != null) {
            // 更新组长信息
            existingLeader.setExpertId(expertId);
            existingLeader.setExpertName(expertName);
            existingLeader.setVoteCount(voteCount);
            existingLeader.setElectedTime(LocalDateTime.now());
            expertLeaderMapper.updateById(existingLeader);
        } else {
            // 创建新组长记录
            ExpertLeader leader = new ExpertLeader();
            leader.setProjectId(projectId);
            leader.setProjectName(project.getName());
            leader.setExpertId(expertId);
            leader.setExpertName(expertName);
            leader.setVoteCount(voteCount);
            leader.setElectedTime(LocalDateTime.now());
            leader.setConclusionStatus("pending");
            expertLeaderMapper.insert(leader);
        }
    }
}
