package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.research.project.entity.ExpertLeader;
import com.research.project.mapper.ExpertLeaderMapper;
import com.research.project.service.ExpertLeaderService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 专家组长服务实现类
 */
@Service
public class ExpertLeaderServiceImpl extends ServiceImpl<ExpertLeaderMapper, ExpertLeader> implements ExpertLeaderService {
    
    @Override
    public ExpertLeader getByProjectId(Long projectId) {
        return this.getOne(new LambdaQueryWrapper<ExpertLeader>()
                .eq(ExpertLeader::getProjectId, projectId)
                .orderByDesc(ExpertLeader::getElectedTime)
                .last("LIMIT 1"));
    }
    
    @Override
    public List<ExpertLeader> listByBatchNo(String batchNo) {
        return this.list(new LambdaQueryWrapper<ExpertLeader>()
                .eq(ExpertLeader::getBatchNo, batchNo)
                .orderByDesc(ExpertLeader::getVoteCount));
    }
    
    @Override
    public ExpertLeader electLeader(Long projectId, Long expertId, String batchNo, Integer voteCount) {
        ExpertLeader leader = new ExpertLeader();
        leader.setProjectId(projectId);
        leader.setExpertId(expertId);
        leader.setBatchNo(batchNo);
        leader.setVoteCount(voteCount);
        leader.setElectedTime(LocalDateTime.now());
        leader.setConclusionStatus("pending");
        this.save(leader);
        return leader;
    }
    
    @Override
    public boolean uploadConclusion(Long id, String conclusionContent, String conclusionFileUrl) {
        ExpertLeader leader = this.getById(id);
        if (leader == null) {
            return false;
        }
        leader.setConclusionContent(conclusionContent);
        leader.setConclusionFileUrl(conclusionFileUrl);
        leader.setConclusionStatus("uploaded");
        leader.setConclusionUploadTime(LocalDateTime.now());
        return this.updateById(leader);
    }
}
