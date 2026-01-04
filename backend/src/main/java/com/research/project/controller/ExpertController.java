package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.ExpertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 专家管理控制器
 * 页面：监测监管端 - 系统管理 - 专家库管理
 *       专家端 - 专家评审相关页面
 */
@Tag(name = "专家管理", description = "专家库管理、专家抽取、评审等接口")
@RestController
@RequestMapping("/experts")
@RequiredArgsConstructor
public class ExpertController {

    private final ExpertService expertService;

    // ==================== 专家库管理 ====================

    /**
     * 分页查询专家列表
     * 按钮：专家库管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询专家列表")
    @GetMapping
    public Result<PageResult<ExpertDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status) {
        return Result.success(expertService.list(page, size, keyword, specialty, title, status));
    }

    /**
     * 获取专家详情
     * 按钮：专家库管理页面 - 详情按钮
     */
    @Operation(summary = "获取专家详情")
    @GetMapping("/{id}")
    public Result<ExpertDetailDTO> getById(@PathVariable Long id) {
        return Result.success(expertService.getById(id));
    }

    /**
     * 新增专家
     * 按钮：专家库管理页面 - 新增专家按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "新增专家")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody ExpertCreateDTO dto) {
        return Result.success(expertService.create(dto));
    }

    /**
     * 更新专家
     * 按钮：专家库管理页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新专家")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody ExpertUpdateDTO dto) {
        expertService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除专家
     * 按钮：专家库管理页面 - 删除按钮
     */
    @Operation(summary = "删除专家")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        expertService.delete(id);
        return Result.success();
    }

    /**
     * 启用专家
     * 按钮：专家库管理页面 - 启用按钮
     */
    @Operation(summary = "启用专家")
    @PostMapping("/{id}/enable")
    public Result<Void> enable(@PathVariable Long id) {
        expertService.enable(id);
        return Result.success();
    }

    /**
     * 禁用专家
     * 按钮：专家库管理页面 - 禁用按钮
     */
    @Operation(summary = "禁用专家")
    @PostMapping("/{id}/disable")
    public Result<Void> disable(@PathVariable Long id) {
        expertService.disable(id);
        return Result.success();
    }

    /**
     * 批量导入专家
     * 按钮：专家库管理页面 - 导入按钮
     */
    @Operation(summary = "批量导入专家")
    @PostMapping("/import")
    public Result<ImportResultDTO> importExperts(@RequestParam("file") MultipartFile file) {
        return Result.success(expertService.importExperts(file));
    }

    /**
     * 导出专家列表
     * 按钮：专家库管理页面 - 导出按钮
     */
    @Operation(summary = "导出专家列表")
    @GetMapping("/export")
    public Result<String> exportExperts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String specialty) {
        return Result.success(expertService.exportExperts(keyword, specialty));
    }

    /**
     * 下载导入模板
     * 按钮：专家库管理页面 - 下载模板按钮
     */
    @Operation(summary = "下载专家导入模板")
    @GetMapping("/template")
    public Result<String> downloadTemplate() {
        return Result.success(expertService.downloadTemplate());
    }

    // ==================== 专家抽取 ====================

    /**
     * 随机抽取专家
     * 按钮：发起专家评审页面 - 抽取专家按钮
     */
    @Operation(summary = "随机抽取专家")
    @PostMapping("/draw")
    public Result<List<ExpertDTO>> drawExperts(@Valid @RequestBody ExpertDrawDTO dto) {
        return Result.success(expertService.drawExperts(dto));
    }

    /**
     * 替换专家
     * 按钮：发起专家评审页面 - 替换按钮
     */
    @Operation(summary = "替换专家")
    @PostMapping("/replace")
    public Result<ExpertDTO> replaceExpert(@Valid @RequestBody ExpertReplaceDTO dto) {
        return Result.success(expertService.replaceExpert(dto));
    }

    /**
     * 排除专家
     * 按钮：发起专家评审页面 - 排除按钮
     */
    @Operation(summary = "排除专家")
    @PostMapping("/exclude")
    public Result<Void> excludeExpert(@Valid @RequestBody ExpertExcludeDTO dto) {
        expertService.excludeExpert(dto);
        return Result.success();
    }

    // ==================== 专家评审 ====================

    /**
     * 获取待评审项目列表（专家端）
     * 按钮：专家端 - 待评审页面 - 加载数据
     */
    @Operation(summary = "获取待评审项目列表")
    @GetMapping("/reviews/pending")
    public Result<PageResult<ExpertReviewDTO>> getPendingReviews(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(expertService.getPendingReviews(page, size));
    }

    /**
     * 获取评审历史列表（专家端）
     * 按钮：专家端 - 评审历史页面 - 加载数据
     */
    @Operation(summary = "获取评审历史列表")
    @GetMapping("/reviews/history")
    public Result<PageResult<ExpertReviewDTO>> getReviewHistory(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(expertService.getReviewHistory(page, size, keyword, startDate, endDate));
    }

    /**
     * 获取评审详情（专家端）
     * 按钮：专家端 - 评审页面 - 加载数据
     */
    @Operation(summary = "获取评审详情")
    @GetMapping("/reviews/{reviewId}")
    public Result<ExpertReviewDetailDTO> getReviewDetail(@PathVariable Long reviewId) {
        return Result.success(expertService.getReviewDetail(reviewId));
    }

    /**
     * 提交评审意见（专家端）
     * 按钮：专家端 - 评审页面 - 提交评审按钮
     */
    @Operation(summary = "提交评审意见")
    @PostMapping("/reviews/{reviewId}/submit")
    public Result<Void> submitReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ExpertReviewSubmitDTO dto) {
        expertService.submitReview(reviewId, dto);
        return Result.success();
    }

    /**
     * 保存评审草稿（专家端）
     * 按钮：专家端 - 评审页面 - 保存草稿按钮
     */
    @Operation(summary = "保存评审草稿")
    @PostMapping("/reviews/{reviewId}/draft")
    public Result<Void> saveReviewDraft(
            @PathVariable Long reviewId,
            @Valid @RequestBody ExpertReviewSubmitDTO dto) {
        expertService.saveReviewDraft(reviewId, dto);
        return Result.success();
    }

    /**
     * 查看评审打分详情
     * 按钮：专家端 - 评审历史页面 - 查看打分按钮
     */
    @Operation(summary = "查看评审打分详情")
    @GetMapping("/reviews/{reviewId}/scores")
    public Result<ExpertReviewScoresDTO> getReviewScores(@PathVariable Long reviewId) {
        return Result.success(expertService.getReviewScores(reviewId));
    }

    // ==================== 专家个人信息 ====================

    /**
     * 获取专家个人信息（专家端）
     * 按钮：专家端 - 个人信息页面 - 加载数据
     */
    @Operation(summary = "获取专家个人信息")
    @GetMapping("/profile")
    public Result<ExpertProfileDTO> getProfile() {
        return Result.success(expertService.getProfile());
    }

    /**
     * 更新专家个人信息（专家端）
     * 按钮：专家端 - 个人信息页面 - 保存按钮
     */
    @Operation(summary = "更新专家个人信息")
    @PutMapping("/profile")
    public Result<Void> updateProfile(@Valid @RequestBody ExpertProfileUpdateDTO dto) {
        expertService.updateProfile(dto);
        return Result.success();
    }

    /**
     * 上传专家证书
     * 按钮：专家端 - 个人信息页面 - 上传证书按钮
     */
    @Operation(summary = "上传专家证书")
    @PostMapping("/profile/certificates")
    public Result<String> uploadCertificate(
            @RequestParam("file") MultipartFile file,
            @RequestParam String type) {
        return Result.success(expertService.uploadCertificate(file, type));
    }
}
