package com.research.project.controller;

import com.research.project.common.Result;
import com.research.project.entity.ExpertLeader;
import com.research.project.service.ExpertLeaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 专家组长控制器
 */
@RestController
@RequestMapping("/expert-leaders")
public class ExpertLeaderController {

    @Autowired
    private ExpertLeaderService expertLeaderService;

    /**
     * 根据项目ID获取专家组长
     */
    @GetMapping("/project/{projectId}")
    public Result<ExpertLeader> getByProjectId(@PathVariable Long projectId) {
        ExpertLeader leader = expertLeaderService.getByProjectId(projectId);
        return Result.success(leader);
    }

    /**
     * 根据批次号获取专家组长列表
     */
    @GetMapping("/batch/{batchNo}")
    public Result<List<ExpertLeader>> listByBatchNo(@PathVariable String batchNo) {
        List<ExpertLeader> list = expertLeaderService.listByBatchNo(batchNo);
        return Result.success(list);
    }

    /**
     * 上传评审结论
     */
    @PostMapping("/{id}/conclusion")
    public Result<Boolean> uploadConclusion(
            @PathVariable Long id,
            @RequestBody ExpertLeader request) {
        boolean success = expertLeaderService.uploadConclusion(
                id, 
                request.getConclusionContent(), 
                request.getConclusionFileUrl()
        );
        return Result.success(success);
    }

    /**
     * 获取详情
     */
    @GetMapping("/{id}")
    public Result<ExpertLeader> getById(@PathVariable Long id) {
        ExpertLeader leader = expertLeaderService.getById(id);
        return Result.success(leader);
    }
}
