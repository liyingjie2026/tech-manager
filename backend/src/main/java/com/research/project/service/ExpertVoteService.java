package com.research.project.service;

import com.research.project.vo.VoteResultVO;

import java.util.List;

/**
 * 专家投票服务接口
 */
public interface ExpertVoteService {
    
    /**
     * 专家投票
     */
    void vote(Long projectId, Long voterExpertId, Long votedExpertId);
    
    /**
     * 获取投票结果
     */
    List<VoteResultVO> getVoteResult(Long projectId);
    
    /**
     * 上传组长结论
     */
    void uploadConclusion(Long projectId, Long expertId, String conclusionContent, String conclusionFileUrl);
    
    /**
     * 获取组长待上传结论的项目列表（所有专家已完成评审）
     */
    List<Object> getLeaderProjects(Long expertId);
    
    /**
     * 为项目初始化投票候选专家记录
     */
    void initializeVotingForProject(Long projectId, List<Long> expertIds);
}
