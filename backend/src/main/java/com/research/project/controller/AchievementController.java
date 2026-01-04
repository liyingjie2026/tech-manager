package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.AchievementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 成果管理控制器
 * 页面：科研机构端 - 项目成果
 *       监测监管端 - 成果管理
 */
@Tag(name = "成果管理", description = "项目成果录入、审核、转化等接口")
@RestController
@RequestMapping("/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;

    // ==================== 成果列表查询 ====================

    /**
     * 分页查询成果列表
     * 按钮：成果管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询成果列表")
    @GetMapping
    public Result<PageResult<AchievementDTO>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        return Result.success(achievementService.list(page, size, keyword, type, status));
    }

    /**
     * 获取成果详情
     * 按钮：成果管理页面 - 详情按钮
     */
    @Operation(summary = "获取成果详情")
    @GetMapping("/{id}")
    public Result<AchievementDetailDTO> getById(@PathVariable Long id) {
        return Result.success(achievementService.getById(id));
    }

    /**
     * 获取项目成果列表
     * 按钮：项目详情页面 - 成果Tab - 加载数据
     */
    @Operation(summary = "获取项目成果列表")
    @GetMapping("/project/{projectId}")
    public Result<List<AchievementDTO>> getByProject(@PathVariable Long projectId) {
        return Result.success(achievementService.getByProject(projectId));
    }

    // ==================== 成果录入 ====================

    /**
     * 创建成果
     * 按钮：项目成果页面 - 录入成果按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "创建成果")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody AchievementCreateDTO dto) {
        return Result.success(achievementService.create(dto));
    }

    /**
     * 更新成果
     * 按钮：项目成果页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新成果")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody AchievementUpdateDTO dto) {
        achievementService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除成果
     * 按钮：项目成果页面 - 删除按钮
     */
    @Operation(summary = "删除成果")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        achievementService.delete(id);
        return Result.success();
    }

    /**
     * 提交成果审核
     * 按钮：项目成果页面 - 提交审核按钮
     */
    @Operation(summary = "提交成果审核")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        achievementService.submit(id);
        return Result.success();
    }

    // ==================== 成果审核 ====================

    /**
     * 审核通过成果
     * 按钮：成果审核页面 - 通过按钮
     */
    @Operation(summary = "审核通过成果")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestBody(required = false) String comment) {
        achievementService.approve(id, comment);
        return Result.success();
    }

    /**
     * 审核驳回成果
     * 按钮：成果审核页面 - 驳回按钮
     */
    @Operation(summary = "审核驳回成果")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @Valid @RequestBody RejectDTO dto) {
        achievementService.reject(id, dto.getReason());
        return Result.success();
    }

    // ==================== 成果附件 ====================

    /**
     * 上传成果附件
     * 按钮：项目成果页面 - 上传附件按钮
     */
    @Operation(summary = "上传成果附件")
    @PostMapping("/{id}/attachments")
    public Result<AttachmentDTO> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return Result.success(achievementService.uploadAttachment(id, file));
    }

    /**
     * 下载成果附件
     * 按钮：成果详情页面 - 下载按钮
     */
    @Operation(summary = "下载成果附件")
    @GetMapping("/{id}/attachments/{attachmentId}/download")
    public Result<String> downloadAttachment(@PathVariable Long id, @PathVariable Long attachmentId) {
        return Result.success(achievementService.downloadAttachment(id, attachmentId));
    }

    // ==================== 成果转化 ====================

    /**
     * 获取成果转化列表
     * 按钮：成果转化页面 - 查询按钮
     */
    @Operation(summary = "获取成果转化列表")
    @GetMapping("/transformation")
    public Result<PageResult<TransformationDTO>> listTransformation(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return Result.success(achievementService.listTransformation(page, size, keyword, status));
    }

    /**
     * 创建成果转化记录
     * 按钮：成果转化页面 - 新增转化按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "创建成果转化记录")
    @PostMapping("/{id}/transformation")
    public Result<Long> createTransformation(
            @PathVariable Long id,
            @Valid @RequestBody TransformationCreateDTO dto) {
        return Result.success(achievementService.createTransformation(id, dto));
    }

    /**
     * 更新成果转化记录
     * 按钮：成果转化页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新成果转化记录")
    @PutMapping("/transformation/{transformationId}")
    public Result<Void> updateTransformation(
            @PathVariable Long transformationId,
            @Valid @RequestBody TransformationUpdateDTO dto) {
        achievementService.updateTransformation(transformationId, dto);
        return Result.success();
    }

    /**
     * 提交成果转化审核
     * 按钮：成果转化页面 - 提交按钮
     */
    @Operation(summary = "提交成果转化审核")
    @PostMapping("/transformation/{transformationId}/submit")
    public Result<Void> submitTransformation(@PathVariable Long transformationId) {
        achievementService.submitTransformation(transformationId);
        return Result.success();
    }

    /**
     * 审核成果转化
     * 按钮：成果转化审核页面 - 通过/驳回按钮
     */
    @Operation(summary = "审核成果转化")
    @PostMapping("/transformation/{transformationId}/audit")
    public Result<Void> auditTransformation(
            @PathVariable Long transformationId,
            @Valid @RequestBody AuditDTO dto) {
        achievementService.auditTransformation(transformationId, dto);
        return Result.success();
    }

    // ==================== 成果推介 ====================

    /**
     * 发布成果推介
     * 按钮：成果推介页面 - 发布按钮
     */
    @Operation(summary = "发布成果推介")
    @PostMapping("/{id}/publish")
    public Result<Void> publish(@PathVariable Long id) {
        achievementService.publish(id);
        return Result.success();
    }

    /**
     * 取消成果推介
     * 按钮：成果推介页面 - 取消发布按钮
     */
    @Operation(summary = "取消成果推介")
    @PostMapping("/{id}/unpublish")
    public Result<Void> unpublish(@PathVariable Long id) {
        achievementService.unpublish(id);
        return Result.success();
    }

    /**
     * 获取已发布成果列表（门户展示）
     * 按钮：门户首页 - 成果推介模块
     */
    @Operation(summary = "获取已发布成果列表")
    @GetMapping("/published")
    public Result<PageResult<AchievementDTO>> listPublished(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String field) {
        return Result.success(achievementService.listPublished(page, size, field));
    }
}
