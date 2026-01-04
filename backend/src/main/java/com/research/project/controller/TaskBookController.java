package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.TaskBookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 任务书管理控制器
 * 页面：科研机构端 - 项目管理 - 任务书管理
 *       监测监管端 - 项目管理 - 任务书管理
 */
@Tag(name = "任务书管理", description = "任务书签订、审核、任务拆分等接口")
@RestController
@RequestMapping("/taskbooks")
@RequiredArgsConstructor
public class TaskBookController {

    private final TaskBookService taskBookService;

    // ==================== 任务书列表查询 ====================

    /**
     * 分页查询任务书列表
     * 按钮：任务书管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询任务书列表")
    @GetMapping
    public Result<PageResult<TaskBookDTO>> list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String projectName,
            @RequestParam(required = false) String projectNo,
            @RequestParam(required = false) String status) {
        return Result.success(taskBookService.list(current, size, projectName, projectNo, status));
    }

    /**
     * 获取任务书详情
     * 按钮：任务书管理页面 - 详情按钮
     */
    @Operation(summary = "获取任务书详情")
    @GetMapping("/{id}")
    public Result<TaskBookDetailDTO> getById(@PathVariable Long id) {
        return Result.success(taskBookService.getById(id));
    }

    /**
     * 获取任务书统计数据
     * 按钮：任务书管理页面 - 统计卡片
     */
    @Operation(summary = "获取任务书统计数据")
    @GetMapping("/statistics")
    public Result<TaskBookStatisticsDTO> getStatistics() {
        return Result.success(taskBookService.getStatistics());
    }

    // ==================== 任务书签订（科研端） ====================

    /**
     * 保存任务书草稿
     * 按钮：任务书签订页面 - 保存草稿按钮
     */
    @Operation(summary = "保存任务书草稿")
    @PostMapping("/{id}/draft")
    public Result<Void> saveDraft(@PathVariable Long id, @Valid @RequestBody TaskBookSaveDTO dto) {
        taskBookService.saveDraft(id, dto);
        return Result.success();
    }

    /**
     * 导出任务书
     * 按钮：任务书签订页面 - 步骤2 - 导出任务书按钮
     */
    @Operation(summary = "导出任务书")
    @GetMapping("/{id}/export")
    public Result<String> export(@PathVariable Long id, @RequestParam(defaultValue = "pdf") String format) {
        return Result.success(taskBookService.export(id, format));
    }

    /**
     * 上传已盖章任务书
     * 按钮：任务书签订页面 - 步骤3 - 上传按钮
     */
    @Operation(summary = "上传已盖章任务书")
    @PostMapping("/{id}/upload-signed")
    public Result<Void> uploadSigned(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        taskBookService.uploadSigned(id, file);
        return Result.success();
    }

    /**
     * 提交任务书审核
     * 按钮：任务书签订页面 - 步骤4 - 提交审核按钮
     */
    @Operation(summary = "提交任务书审核")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        taskBookService.submit(id);
        return Result.success();
    }

    // ==================== 任务书审核（监管端） ====================

    /**
     * 审核通过任务书
     * 按钮：任务书审核页面 - 通过按钮
     */
    @Operation(summary = "审核通过任务书")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestBody(required = false) TaskBookApproveDTO dto) {
        taskBookService.approve(id, dto);
        return Result.success();
    }

    /**
     * 审核驳回任务书
     * 按钮：任务书审核页面 - 驳回按钮
     */
    @Operation(summary = "审核驳回任务书")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @Valid @RequestBody RejectDTO dto) {
        taskBookService.reject(id, dto.getReason());
        return Result.success();
    }

    /**
     * 退回任务书修改
     * 按钮：任务书审核页面 - 退回修改按钮
     */
    @Operation(summary = "退回任务书修改")
    @PostMapping("/{id}/return")
    public Result<Void> returnForModification(@PathVariable Long id, @Valid @RequestBody RejectDTO dto) {
        taskBookService.returnForModification(id, dto.getReason());
        return Result.success();
    }

    // ==================== 任务拆分 ====================

    /**
     * 获取任务列表
     * 按钮：任务拆分页面 - 步骤1 - 加载数据
     */
    @Operation(summary = "获取任务列表")
    @GetMapping("/{id}/tasks")
    public Result<List<TaskItemDTO>> getTasks(@PathVariable Long id) {
        return Result.success(taskBookService.getTasks(id));
    }

    /**
     * 添加任务
     * 按钮：任务拆分页面 - 步骤1 - 添加任务按钮
     */
    @Operation(summary = "添加任务")
    @PostMapping("/{id}/tasks")
    public Result<Long> addTask(@PathVariable Long id, @Valid @RequestBody TaskItemCreateDTO dto) {
        return Result.success(taskBookService.addTask(id, dto));
    }

    /**
     * 更新任务
     * 按钮：任务拆分页面 - 步骤1 - 编辑按钮
     */
    @Operation(summary = "更新任务")
    @PutMapping("/{id}/tasks/{taskId}")
    public Result<Void> updateTask(
            @PathVariable Long id,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskItemUpdateDTO dto) {
        taskBookService.updateTask(id, taskId, dto);
        return Result.success();
    }

    /**
     * 删除任务
     * 按钮：任务拆分页面 - 步骤1 - 删除按钮
     */
    @Operation(summary = "删除任务")
    @DeleteMapping("/{id}/tasks/{taskId}")
    public Result<Void> deleteTask(@PathVariable Long id, @PathVariable Long taskId) {
        taskBookService.deleteTask(id, taskId);
        return Result.success();
    }

    /**
     * 批量删除任务
     * 按钮：任务拆分页面 - 步骤1 - 批量删除按钮
     */
    @Operation(summary = "批量删除任务")
    @DeleteMapping("/{id}/tasks/batch")
    public Result<Void> batchDeleteTasks(@PathVariable Long id, @RequestBody List<Long> taskIds) {
        taskBookService.batchDeleteTasks(id, taskIds);
        return Result.success();
    }

    // ==================== 中期检查配置 ====================

    /**
     * 保存中期检查配置
     * 按钮：任务书审核页面 - 中期检查配置 - 保存按钮
     */
    @Operation(summary = "保存中期检查配置")
    @PostMapping("/{id}/midterm-config")
    public Result<Void> saveMidtermConfig(@PathVariable Long id, @Valid @RequestBody MidtermConfigDTO dto) {
        taskBookService.saveMidtermConfig(id, dto);
        return Result.success();
    }

    /**
     * 获取中期检查配置
     * 按钮：任务书审核页面 - 中期检查配置 - 加载数据
     */
    @Operation(summary = "获取中期检查配置")
    @GetMapping("/{id}/midterm-config")
    public Result<MidtermConfigDTO> getMidtermConfig(@PathVariable Long id) {
        return Result.success(taskBookService.getMidtermConfig(id));
    }

    // ==================== 新增功能 ====================

    /**
     * 获取任务书历史记录
     * 按钮：任务书管理页面 - 历史记录按钮
     */
//    @Operation(summary = "获取任务书历史记录")
//    @GetMapping("/{id}/history")
//    public Result<List<TaskBookHistoryDTO>> getHistory(@PathVariable Long id) {
//        return Result.success(taskBookService.getHistory(id));
//    }

    /**
     * 下载任务书模板
     * 按钮：任务书签订页面 - 下载模板按钮
     */
//    @Operation(summary = "下载任务书模板")
//    @GetMapping("/template")
//    public Result<byte[]> downloadTemplate() {
//        return Result.success(taskBookService.downloadTemplate());
//    }
}
