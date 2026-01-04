package com.research.project.service;

import com.research.project.entity.ExpertLeader;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * 专家组长服务接口
 */
public interface ExpertLeaderService extends IService<ExpertLeader> {
    
    /**
     * 根据项目ID获取专家组长
     */
    ExpertLeader getByProjectId(Long projectId);
    
    /**
     * 根据批次号获取专家组长列表
     */
    List<ExpertLeader> listByBatchNo(String batchNo);
    
    /**
     * 选举专家组长
     */
    ExpertLeader electLeader(Long projectId, Long expertId, String batchNo, Integer voteCount);
    
    /**
     * 上传评审结论
     */
    boolean uploadConclusion(Long id, String conclusionContent, String conclusionFileUrl);
}
