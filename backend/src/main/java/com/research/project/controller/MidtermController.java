package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.MidtermService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 中期检查控制器
 * 页面：科研机构端 - 项目管理 - 中期检查
 *       监测监管端 - 项目管理 - 中期检查
 */
@Tag(name = "中期检查", description = "中期检查提交、审核等接口")
@RestController
@RequestMapping("/midterms")
@RequiredArgsConstructor
public class MidtermController {

    private final MidtermService midtermService;

    /**
     * 分页查询中期检查列表
     * 按钮：中期检查页面 - 查询按钮
     */
    @Operation(summary = "分页查询中期检查列表")
    @GetMapping
    public Result<PageResult<MidtermDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String year) {
        return Result.success(midtermService.list(page, size, keyword, status, year));
    }

    /**
     * 获取中期检查详情
     * 按钮：中期检查页面 - 详情按钮
     */
    @Operation(summary = "获取中期检查详情")
    @GetMapping("/{id}")
    public Result<MidtermDetailDTO> getById(@PathVariable Long id) {
        return Result.success(midtermService.getById(id));
    }

    /**
     * 获取中期检查统计数据
     * 按钮：中期检查页面 - 统计卡片
     */
    @Operation(summary = "获取中期检查统计数据")
    @GetMapping("/statistics")
    public Result<MidtermStatisticsDTO> getStatistics() {
        return Result.success(midtermService.getStatistics());
    }

    /**
     * 创建中期检查报告
     * 按钮：中期检查页面 - 填报按钮 -> 保存按钮
     */
    @Operation(summary = "创建中期检查报告")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody MidtermCreateDTO dto) {
        return Result.success(midtermService.create(dto));
    }

    /**
     * 更新中期检查报告
     * 按钮：中期检查页面 - 编辑按钮 -> 保存按钮
     */
    @Operation(summary = "更新中期检查报告")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody MidtermUpdateDTO dto) {
        midtermService.update(id, dto);
        return Result.success();
    }

    /**
     * 提交中期检查报告
     * 按钮：中期检查页面 - 提交按钮
     */
    @Operation(summary = "提交中期检查报告")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        midtermService.submit(id);
        return Result.success();
    }

    /**
     * 撤回中期检查报告
     * 按钮：中期检查页面 - 撤回按钮
     */
    @Operation(summary = "撤回中期检查报告")
    @PostMapping("/{id}/withdraw")
    public Result<Void> withdraw(@PathVariable Long id) {
        midtermService.withdraw(id);
        return Result.success();
    }

    /**
     * 审核通过中期检查
     * 按钮：中期检查审核页面 - 通过按钮
     */
    @Operation(summary = "审核通过中期检查")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestBody(required = false) String comment) {
        midtermService.approve(id, comment);
        return Result.success();
    }

    /**
     * 审核驳回中期检查
     * 按钮：中期检查审核页面 - 驳回按钮
     */
    @Operation(summary = "审核驳回中期检查")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @Valid @RequestBody RejectDTO dto) {
        midtermService.reject(id, dto.getReason());
        return Result.success();
    }

    /**
     * 下发中期检查通知
     * 按钮：中期检查页面 - 下发通知按钮
     */
    @Operation(summary = "下发中期检查通知")
    @PostMapping("/notice")
    public Result<Void> sendNotice(@Valid @RequestBody MidtermNoticeDTO dto) {
        midtermService.sendNotice(dto);
        return Result.success();
    }

    /**
     * 上传中期检查附件
     * 按钮：中期检查页面 - 上传附件按钮
     */
    @Operation(summary = "上传中期检查附件")
    @PostMapping("/{id}/attachments")
    public Result<AttachmentDTO> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam String type) {
        return Result.success(midtermService.uploadAttachment(id, file, type));
    }

    /**
     * 导出中期检查报告
     * 按钮：中期检查页面 - 导出按钮
     */
    @Operation(summary = "导出中期检查报告")
    @GetMapping("/{id}/export")
    public Result<String> export(@PathVariable Long id) {
        return Result.success(midtermService.export(id));
    }
}
