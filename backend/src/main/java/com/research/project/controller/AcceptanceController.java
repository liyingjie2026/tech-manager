package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.AcceptanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 结题验收控制器
 * 页面：科研机构端 - 项目管理 - 项目验收
 *       监测监管端 - 项目管理 - 结题验收
 */
@Tag(name = "结题验收", description = "结题验收申请、审核等接口")
@RestController
@RequestMapping("/acceptances")
@RequiredArgsConstructor
public class AcceptanceController {

    private final AcceptanceService acceptanceService;

    /**
     * 分页查询验收列表
     * 按钮：结题验收页面 - 查询按钮
     */
    @Operation(summary = "分页查询验收列表")
    @GetMapping
    public Result<PageResult<AcceptanceDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return Result.success(acceptanceService.list(page, size, keyword, status));
    }

    /**
     * 获取验收详情
     * 按钮：结题验收页面 - 详情按钮
     */
    @Operation(summary = "获取验收详情")
    @GetMapping("/{id}")
    public Result<AcceptanceDetailDTO> getById(@PathVariable Long id) {
        return Result.success(acceptanceService.getById(id));
    }

    /**
     * 获取验收统计数据
     * 按钮：结题验收页面 - 统计卡片
     */
    @Operation(summary = "获取验收统计数据")
    @GetMapping("/statistics")
    public Result<AcceptanceStatisticsDTO> getStatistics() {
        return Result.success(acceptanceService.getStatistics());
    }

    /**
     * 创建验收申请
     * 按钮：项目验收页面 - 申请验收按钮 -> 保存按钮
     */
    @Operation(summary = "创建验收申请")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody AcceptanceCreateDTO dto) {
        return Result.success(acceptanceService.create(dto));
    }

    /**
     * 更新验收申请
     * 按钮：项目验收页面 - 编辑按钮 -> 保存按钮
     */
    @Operation(summary = "更新验收申请")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody AcceptanceUpdateDTO dto) {
        acceptanceService.update(id, dto);
        return Result.success();
    }

    /**
     * 提交验收申请
     * 按钮：项目验收页面 - 提交按钮
     */
    @Operation(summary = "提交验收申请")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        acceptanceService.submit(id);
        return Result.success();
    }

    /**
     * 撤回验收申请
     * 按钮：项目验收页面 - 撤回按钮
     */
    @Operation(summary = "撤回验收申请")
    @PostMapping("/{id}/withdraw")
    public Result<Void> withdraw(@PathVariable Long id) {
        acceptanceService.withdraw(id);
        return Result.success();
    }

    /**
     * 审核通过验收
     * 按钮：结题验收审核页面 - 通过按钮
     */
    @Operation(summary = "审核通过验收")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestBody(required = false) String comment) {
        acceptanceService.approve(id, comment);
        return Result.success();
    }

    /**
     * 审核驳回验收
     * 按钮：结题验收审核页面 - 驳回按钮
     */
    @Operation(summary = "审核驳回验收")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @Valid @RequestBody RejectDTO dto) {
        acceptanceService.reject(id, dto.getReason());
        return Result.success();
    }

    /**
     * 发起验收评审
     * 按钮：结题验收页面 - 发起评审按钮
     */
    @Operation(summary = "发起验收评审")
    @PostMapping("/{id}/start-review")
    public Result<Void> startReview(@PathVariable Long id, @Valid @RequestBody AcceptanceReviewDTO dto) {
        acceptanceService.startReview(id, dto);
        return Result.success();
    }

    /**
     * 上传验收附件
     * 按钮：项目验收页面 - 上传附件按钮
     */
    @Operation(summary = "上传验收附件")
    @PostMapping("/{id}/attachments")
    public Result<AttachmentDTO> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam String type) {
        return Result.success(acceptanceService.uploadAttachment(id, file, type));
    }

    /**
     * 导出验收报告
     * 按钮：结题验收页面 - 导出按钮
     */
    @Operation(summary = "导出验收报告")
    @GetMapping("/{id}/export")
    public Result<String> export(@PathVariable Long id) {
        return Result.success(acceptanceService.export(id));
    }
}
