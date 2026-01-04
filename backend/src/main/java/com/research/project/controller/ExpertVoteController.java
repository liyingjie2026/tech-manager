package com.research.project.controller;

import com.alibaba.fastjson.JSONObject;
import com.research.project.common.Result;
import com.research.project.constant.BussinessConstants;
import com.research.project.constant.RedisConstants;
import com.research.project.dto.ExpertVoteDTO;
import com.research.project.dto.LeaderConclusionDTO;
import com.research.project.service.ExpertVoteService;
import com.research.project.util.RedisUtil;
import com.research.project.vo.LoginVO;
import com.research.project.vo.VoteResultVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 专家投票控制器
 */
@Tag(name = "专家投票", description = "专家投票选组长相关接口")
@RestController
@RequestMapping("/expert-votes")
@RequiredArgsConstructor
public class ExpertVoteController {

    private final ExpertVoteService expertVoteService;
    private final RedisUtil redisUtil;

    /**
     * 专家投票选组长
     */
    @Operation(summary = "专家投票选组长")
    @PostMapping("/vote")
    public Result<Void> vote(HttpServletRequest request, @Valid @RequestBody ExpertVoteDTO dto) {
        // 从Redis获取当前登录专家ID
        Long expertId = getCurrentExpertId(request);
        expertVoteService.vote(dto.getProjectId(), expertId, dto.getVotedExpertId());
        return Result.success();
    }

    /**
     * 获取投票结果统计
     */
    @Operation(summary = "获取投票结果统计")
    @GetMapping("/result/{projectId}")
    public Result<List<VoteResultVO>> getVoteResult(@PathVariable Long projectId) {
        return Result.success(expertVoteService.getVoteResult(projectId));
    }

    /**
     * 组长上传结论
     */
    @Operation(summary = "组长上传结论")
    @PostMapping("/conclusion")
    public Result<Void> uploadConclusion(HttpServletRequest request, @Valid @RequestBody LeaderConclusionDTO dto) {
        Long expertId = getCurrentExpertId(request);
        expertVoteService.uploadConclusion(dto.getProjectId(), expertId, dto.getConclusionContent(), dto.getConclusionFileUrl());
        return Result.success();
    }

    /**
     * 获取组长待上传结论的项目列表
     */
    @Operation(summary = "获取组长待上传结论的项目列表")
    @GetMapping("/leader-projects")
    public Result<List<Object>> getLeaderProjects(HttpServletRequest request) {
        Long expertId = getCurrentExpertId(request);
        return Result.success(expertVoteService.getLeaderProjects(expertId));
    }

    /**
     * 从Redis获取当前登录专家ID
     */
    private Long getCurrentExpertId(HttpServletRequest request) {
        String token = request.getHeader(BussinessConstants.USERAGENT_AUTH_HEADER);
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String redisKey = RedisConstants.LOGIN_USER_KEY + token;
        Object obj = redisUtil.get(redisKey);
        if (obj != null) {
            String json = (String) obj;
            LoginVO user = JSONObject.parseObject(json, LoginVO.class);
            if (user.getUser() != null) {
                return user.getUser().getExpertId();
            }
        }
        throw new RuntimeException("未找到当前登录专家信息");
    }
}
