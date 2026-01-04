package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.ChangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 变更管理控制器
 * 页面：科研机构端 - 项目管理 - 项目变更
 *       监测监管端 - 项目管理 - 变更管理
 */
@Tag(name = "变更管理", description = "项目变更申请、审核等接口")
@RestController
@RequestMapping("/changes")
@RequiredArgsConstructor
public class ChangeController {

    private final ChangeService changeService;

    /**
     * 分页查询变更列表
     * 按钮：变更管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询变更列表")
    @GetMapping
    public Result<PageResult<ChangeDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String changeType) {
        return Result.success(changeService.list(page, size, keyword, status, changeType));
    }

    /**
     * 获取变更详情
     * 按钮：变更管理页面 - 详情按钮
     */
    @Operation(summary = "获取变更详情")
    @GetMapping("/{id}")
    public Result<ChangeDetailDTO> getById(@PathVariable Long id) {
        return Result.success(changeService.getById(id));
    }

    /**
     * 获取项目变更历史
     * 按钮：变更管理页面 - 变更历史按钮
     */
    @Operation(summary = "获取项目变更历史")
    @GetMapping("/project/{projectId}/history")
    public Result<List<ChangeDTO>> getHistory(@PathVariable Long projectId) {
        return Result.success(changeService.getHistory(projectId));
    }

    /**
     * 创建变更申请
     * 按钮：项目变更页面 - 新建变更按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "创建变更申请")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody ChangeCreateDTO dto) {
        return Result.success(changeService.create(dto));
    }

    /**
     * 更新变更申请
     * 按钮：项目变更页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新变更申请")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody ChangeUpdateDTO dto) {
        changeService.update(id, dto);
        return Result.success();
    }

    /**
     * 提交变更申请
     * 按钮：项目变更页面 - 提交按钮
     */
    @Operation(summary = "提交变更申请")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        changeService.submit(id);
        return Result.success();
    }

    /**
     * 撤回变更申请
     * 按钮：项目变更页面 - 撤回按钮
     */
    @Operation(summary = "撤回变更申请")
    @PostMapping("/{id}/withdraw")
    public Result<Void> withdraw(@PathVariable Long id) {
        changeService.withdraw(id);
        return Result.success();
    }

    /**
     * 删除变更申请
     * 按钮：项目变更页面 - 删除按钮
     */
    @Operation(summary = "删除变更申请")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        changeService.delete(id);
        return Result.success();
    }

    /**
     * 审核通过变更申请
     * 按钮：变更审核页面 - 通过按钮
     */
    @Operation(summary = "审核通过变更申请")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestBody(required = false) String comment) {
        changeService.approve(id, comment);
        return Result.success();
    }

    /**
     * 审核驳回变更申请
     * 按钮：变更审核页面 - 驳回按钮
     */
    @Operation(summary = "审核驳回变更申请")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @Valid @RequestBody RejectDTO dto) {
        changeService.reject(id, dto.getReason());
        return Result.success();
    }

    /**
     * 退回变更申请修改
     * 按钮：变更审核页面 - 退回修改按钮
     */
    @Operation(summary = "退回变更申请修改")
    @PostMapping("/{id}/return")
    public Result<Void> returnForModification(@PathVariable Long id, @Valid @RequestBody RejectDTO dto) {
        changeService.returnForModification(id, dto.getReason());
        return Result.success();
    }

    /**
     * 上传变更附件
     * 按钮：项目变更页面 - 上传附件按钮
     */
    @Operation(summary = "上传变更附件")
    @PostMapping("/{id}/attachments")
    public Result<AttachmentDTO> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return Result.success(changeService.uploadAttachment(id, file));
    }

    /**
     * 获取变更统计数据
     * 按钮：变更管理页面 - 统计卡片
     */
    @Operation(summary = "获取变更统计数据")
    @GetMapping("/statistics")
    public Result<ChangeStatisticsDTO> getStatistics(
            @RequestParam(required = false) String changeType,
            @RequestParam(required = false) String status) {
        return Result.success(changeService.getStatistics(changeType, status));
    }
}
