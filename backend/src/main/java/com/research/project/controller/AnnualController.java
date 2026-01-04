package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.AnnualService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 年度检查控制器
 * 页面：科研机构端 - 项目管理 - 年度检查
 *       监测监管端 - 项目管理 - 年度检查
 */
@Tag(name = "年度检查", description = "年度检查提交、审核等接口")
@RestController
@RequestMapping("/annuals")
@RequiredArgsConstructor
public class AnnualController {

    private final AnnualService annualService;

    /**
     * 分页查询年度检查列表
     * 按钮：年度检查页面 - 查询按钮
     */
    @Operation(summary = "分页查询年度检查列表")
    @GetMapping
    public Result<PageResult<AnnualDTO>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String year) {
        return Result.success(annualService.list(page, size, keyword, status, year));
    }

    /**
     * 获取年度检查详情
     * 按钮：年度检查页面 - 详情按钮
     */
    @Operation(summary = "获取年度检查详情")
    @GetMapping("/{id}")
    public Result<AnnualDetailDTO> getById(@PathVariable Long id) {
        return Result.success(annualService.getById(id));
    }

    /**
     * 获取年度检查统计数据
     * 按钮：年度检查页面 - 统计卡片
     */
    @Operation(summary = "获取年度检查统计数据")
    @GetMapping("/statistics")
    public Result<AnnualStatisticsDTO> getStatistics() {
        return Result.success(annualService.getStatistics());
    }

    /**
     * 创建年度检查报告
     * 按钮：年度检查页面 - 填报按钮 -> 保存按钮
     */
    @Operation(summary = "创建年度检查报告")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody AnnualCreateDTO dto) {
        return Result.success(annualService.create(dto));
    }

    /**
     * 更新年度检查报告
     * 按钮：年度检查页面 - 编辑按钮 -> 保存按钮
     */
    @Operation(summary = "更新年度检查报告")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody AnnualUpdateDTO dto) {
        annualService.update(id, dto);
        return Result.success();
    }

    /**
     * 提交年度检查报告
     * 按钮：年度检查页面 - 提交按钮
     */
    @Operation(summary = "提交年度检查报告")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        annualService.submit(id);
        return Result.success();
    }

    /**
     * 审核通过年度检查
     * 按钮：年度检查审核页面 - 通过按钮
     */
    @Operation(summary = "审核通过年度检查")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestBody(required = false) String comment) {
        annualService.approve(id, comment);
        return Result.success();
    }

    /**
     * 审核驳回年度检查
     * 按钮：年度检查审核页面 - 驳回按钮
     */
    @Operation(summary = "审核驳回年度检查")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @Valid @RequestBody RejectDTO dto) {
        annualService.reject(id, dto.getReason());
        return Result.success();
    }

    /**
     * 下发年度检查通知
     * 按钮：年度检查页面 - 下发通知按钮
     */
    @Operation(summary = "下发年度检查通知")
    @PostMapping("/notice")
    public Result<Void> sendNotice(@Valid @RequestBody AnnualNoticeDTO dto) {
        annualService.sendNotice(dto);
        return Result.success();
    }

    /**
     * 上传年度检查附件
     * 按钮：年度检查页面 - 上传附件按钮
     */
    @Operation(summary = "上传年度检查附件")
    @PostMapping("/{id}/attachments")
    public Result<AttachmentDTO> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam String type) {
        return Result.success(annualService.uploadAttachment(id, file, type));
    }
}
