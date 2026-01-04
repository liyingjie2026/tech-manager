package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 共享资源控制器
 * 页面：科研机构端 - 我找资源
 *       监测监管端 - 共享资源管理
 */
@Tag(name = "共享资源", description = "科研仪器、基础数据、专业软件等共享资源管理接口")
@RestController
@RequestMapping("/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    // ==================== 科研仪器 ====================

    /**
     * 分页查询科研仪器列表
     * 按钮：科研仪器页面 - 查询按钮
     */
    @Operation(summary = "分页查询科研仪器列表")
    @GetMapping("/equipment")
    public Result<PageResult<EquipmentDTO>> listEquipment(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String field,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return Result.success(resourceService.listEquipment(page, size, keyword, field, category, status));
    }

    /**
     * 获取科研仪器详情
     * 按钮：科研仪器页面 - 详情按钮
     */
    @Operation(summary = "获取科研仪器详情")
    @GetMapping("/equipment/{id}")
    public Result<EquipmentDetailDTO> getEquipmentById(@PathVariable Long id) {
        return Result.success(resourceService.getEquipmentById(id));
    }

    /**
     * 新增科研仪器
     * 按钮：科研仪器页面 - 新增按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "新增科研仪器")
    @PostMapping("/equipment")
    public Result<Long> createEquipment(@Valid @RequestBody EquipmentCreateDTO dto) {
        return Result.success(resourceService.createEquipment(dto));
    }

    /**
     * 更新科研仪器
     * 按钮：科研仪器页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新科研仪器")
    @PutMapping("/equipment/{id}")
    public Result<Void> updateEquipment(@PathVariable Long id, @Valid @RequestBody EquipmentUpdateDTO dto) {
        resourceService.updateEquipment(id, dto);
        return Result.success();
    }

    /**
     * 删除科研仪器
     * 按钮：科研仪器页面 - 删除按钮
     */
    @Operation(summary = "删除科研仪器")
    @DeleteMapping("/equipment/{id}")
    public Result<Void> deleteEquipment(@PathVariable Long id) {
        resourceService.deleteEquipment(id);
        return Result.success();
    }

    /**
     * 申请借用科研仪器
     * 按钮：科研仪器页面 - 申请借用按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "申请借用科研仪器")
    @PostMapping("/equipment/{id}/borrow")
    public Result<Long> borrowEquipment(@PathVariable Long id, @Valid @RequestBody BorrowApplyDTO dto) {
        return Result.success(resourceService.borrowEquipment(id, dto));
    }

    /**
     * 审核借用申请
     * 按钮：科研仪器页面 - 审核按钮 -> 弹窗通过/驳回按钮
     */
    @Operation(summary = "审核借用申请")
    @PostMapping("/equipment/borrow/{borrowId}/audit")
    public Result<Void> auditBorrow(@PathVariable Long borrowId, @Valid @RequestBody AuditDTO dto) {
        resourceService.auditBorrow(borrowId, dto);
        return Result.success();
    }

    /**
     * 归还科研仪器
     * 按钮：科研仪器页面 - 归还按钮
     */
    @Operation(summary = "归还科研仪器")
    @PostMapping("/equipment/borrow/{borrowId}/return")
    public Result<Void> returnEquipment(@PathVariable Long borrowId) {
        resourceService.returnEquipment(borrowId);
        return Result.success();
    }

    // ==================== 基础数据 ====================

    /**
     * 分页查询基础数据列表
     * 按钮：基础数据页面 - 查询按钮
     */
    @Operation(summary = "分页查询基础数据列表")
    @GetMapping("/data")
    public Result<PageResult<BasicDataDTO>> listBasicData(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String field,
            @RequestParam(required = false) String projectType) {
        return Result.success(resourceService.listBasicData(page, size, keyword, field, projectType));
    }

    /**
     * 获取基础数据详情
     * 按钮：基础数据页面 - 详情按钮
     */
    @Operation(summary = "获取基础数据详情")
    @GetMapping("/data/{id}")
    public Result<BasicDataDetailDTO> getBasicDataById(@PathVariable Long id) {
        return Result.success(resourceService.getBasicDataById(id));
    }

    /**
     * 新增基础数据
     * 按钮：基础数据页面 - 新增按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "新增基础数据")
    @PostMapping("/data")
    public Result<Long> createBasicData(@Valid @RequestBody BasicDataCreateDTO dto) {
        return Result.success(resourceService.createBasicData(dto));
    }

    /**
     * 更新基础数据
     * 按钮：基础数据页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新基础数据")
    @PutMapping("/data/{id}")
    public Result<Void> updateBasicData(@PathVariable Long id, @Valid @RequestBody BasicDataUpdateDTO dto) {
        resourceService.updateBasicData(id, dto);
        return Result.success();
    }

    /**
     * 申请下载基础数据
     * 按钮：基础数据页面 - 申请下载按钮
     */
    @Operation(summary = "申请下载基础数据")
    @PostMapping("/data/{id}/download-apply")
    public Result<Long> applyDownloadData(@PathVariable Long id, @Valid @RequestBody DownloadApplyDTO dto) {
        return Result.success(resourceService.applyDownloadData(id, dto));
    }

    /**
     * 下载基础数据
     * 按钮：基础数据页面 - 下载按钮
     */
    @Operation(summary = "下载基础数据")
    @GetMapping("/data/{id}/download")
    public Result<String> downloadData(@PathVariable Long id) {
        return Result.success(resourceService.downloadData(id));
    }

    // ==================== 专业软件 ====================

    /**
     * 分页查询专业软件列表
     * 按钮：专业软件页面 - 查询按钮
     */
    @Operation(summary = "分页查询专业软件列表")
    @GetMapping("/software")
    public Result<PageResult<SoftwareDTO>> listSoftware(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type) {
        return Result.success(resourceService.listSoftware(page, size, keyword, type));
    }

    /**
     * 获取专业软件详情
     * 按钮：专业软件页面 - 详情按钮
     */
    @Operation(summary = "获取专业软件详情")
    @GetMapping("/software/{id}")
    public Result<SoftwareDetailDTO> getSoftwareById(@PathVariable Long id) {
        return Result.success(resourceService.getSoftwareById(id));
    }

    /**
     * 新增专业软件
     * 按钮：专业软件页面 - 新增按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "新增专业软件")
    @PostMapping("/software")
    public Result<Long> createSoftware(@Valid @RequestBody SoftwareCreateDTO dto) {
        return Result.success(resourceService.createSoftware(dto));
    }

    /**
     * 申请使用专业软件
     * 按钮：专业软件页面 - 申请使用按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "申请使用专业软件")
    @PostMapping("/software/{id}/apply")
    public Result<Long> applySoftware(@PathVariable Long id, @Valid @RequestBody SoftwareApplyDTO dto) {
        return Result.success(resourceService.applySoftware(id, dto));
    }

    // ==================== 共享审核 ====================

    /**
     * 设置共享状态
     * 按钮：资源管理页面 - 共享/取消共享按钮
     */
    @Operation(summary = "设置共享状态")
    @PostMapping("/{type}/{id}/share")
    public Result<Void> setShareStatus(
            @PathVariable String type,
            @PathVariable Long id,
            @RequestParam boolean shared) {
        resourceService.setShareStatus(type, id, shared);
        return Result.success();
    }
}
