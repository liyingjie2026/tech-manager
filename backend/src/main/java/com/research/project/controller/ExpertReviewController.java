package com.research.project.controller;

import com.alibaba.fastjson.JSONObject;
import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.constant.BussinessConstants;
import com.research.project.constant.RedisConstants;
import com.research.project.dto.*;
import com.research.project.service.ExpertReviewService;
import com.research.project.util.RedisUtil;
import com.research.project.vo.LoginVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 专家评审流程控制器
 * 页面：监测监管端 - 申报管理 - 发起专家评审
 *       监测监管端 - 立项评审
 */
@Tag(name = "专家评审流程", description = "发起评审、评审管理等接口")
@RestController
@RequestMapping("/expert-reviews")
@RequiredArgsConstructor
public class ExpertReviewController {

    private final ExpertReviewService expertReviewService;
    private final RedisUtil redisUtil;

    /**
     * 分页查询评审列表
     * 按钮：立项评审页面 - 查询按钮
     */
    @Operation(summary = "分页查询评审列表")
    @GetMapping
    public Result<PageResult<ReviewDTO>> list(HttpServletRequest request,
                                              @RequestParam(defaultValue = "1") Integer page,
                                              @RequestParam(defaultValue = "10") Integer size,
                                              @RequestParam(required = false) String keyword,
                                              @RequestParam(required = false) String status,
                                              @RequestParam(required = false) String reviewType,
                                              @RequestParam(required = false) Long expertId) {
        if (expertId == null) {
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
                    expertId = user.getUser().getExpertId();
                    System.out.println("[v0] 从Redis获取专家ID: " + expertId);
                }
            }
        }
        
        return Result.success(expertReviewService.list(page, size, keyword, status, reviewType, expertId));
    }

    /**
     * 获取评审统计信息
     * 用于专家端待评审项目页面
     */
    @Operation(summary = "获取评审统计信息")
    @GetMapping("/statistics")
    public Result<Object> getStatistics() {
        // Return statistics for expert review page
        return Result.success(expertReviewService.getStatistics());
    }

    /**
     * 获取评审详情
     * 按钮：立项评审页面 - 详情按钮
     */
    @Operation(summary = "获取评审详情")
    @GetMapping("/{id}")
    public Result<ReviewDetailDTO> getById(@PathVariable Long id) {
        return Result.success(expertReviewService.getById(id));
    }

    /**
     * 发起专家评审
     * 按钮：发起专家评审页面 - 确认发布评审通知按钮
     */
    @Operation(summary = "发起专家评审")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody ReviewCreateDTO dto) {
        return Result.success(expertReviewService.create(dto));
    }

    /**
     * 更新评审信息
     * 按钮：立项评审页面 - 编辑按钮
     */
    @Operation(summary = "更新评审信息")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody ReviewUpdateDTO dto) {
        expertReviewService.update(id, dto);
        return Result.success();
    }

    /**
     * 取消评审
     * 按钮：立项评审页面 - 取消评审按钮
     */
    @Operation(summary = "取消评审")
    @PostMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id, @RequestBody(required = false) String reason) {
        expertReviewService.cancel(id, reason);
        return Result.success();
    }

    /**
     * 结束评审（汇总结果）
     * 按钮：立项评审页面 - 结束评审按钮
     */
    @Operation(summary = "结束评审")
    @PostMapping("/{id}/finish")
    public Result<Void> finish(@PathVariable Long id) {
        expertReviewService.finish(id);
        return Result.success();
    }

    /**
     * 获取评审结果汇总
     * 按钮：立项评审页面 - 查看结果按钮
     */
    @Operation(summary = "获取评审结果汇总")
    @GetMapping("/{id}/summary")
    public Result<ReviewSummaryDTO> getSummary(@PathVariable Long id) {
        return Result.success(expertReviewService.getSummary(id));
    }

    /**
     * 获取各专家评审详情
     * 按钮：立项评审页面 - 查看专家评审详情按钮
     */
    @Operation(summary = "获取各专家评审详情")
    @GetMapping("/{id}/expert-reviews")
    public Result<List<ExpertReviewResultDTO>> getExpertReviews(@PathVariable Long id) {
        return Result.success(expertReviewService.getExpertReviews(id));
    }

    /**
     * 催促专家评审
     * 按钮：立项评审页面 - 催促按钮
     */
    @Operation(summary = "催促专家评审")
    @PostMapping("/{id}/remind")
    public Result<Void> remind(@PathVariable Long id) {
        expertReviewService.remind(id);
        return Result.success();
    }

    /**
     * 导出评审结果
     * 按钮：立项评审页面 - 导出结果按钮
     */
    @Operation(summary = "导出评审结果")
    @GetMapping("/{id}/export")
    public Result<String> export(@PathVariable Long id) {
        return Result.success(expertReviewService.export(id));
    }

    /**
     * 公示评审结果
     * 按钮：立项评审页面 - 公示按钮
     */
    @Operation(summary = "公示评审结果")
    @PostMapping("/{id}/publish")
    public Result<Void> publish(@PathVariable Long id, @Valid @RequestBody PublishDTO dto) {
        expertReviewService.publish(id, dto);
        return Result.success();
    }

    /**
     * 提交专家评审
     * 专家提交评审后，状态从pending变为reviewed（已评审待结论）
     */
    @Operation(summary = "提交专家评审")
    @PostMapping("/{id}/submit")
    public Result<Void> submitExpertReview(@PathVariable Long id, @Valid @RequestBody ExpertReviewSubmitDTO data) {
        expertReviewService.submitReview(id, data);
        return Result.success();
    }
}
