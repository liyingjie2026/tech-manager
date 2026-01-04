package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.InstitutionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 机构管理控制器
 * 页面：监测监管端 - 系统管理 - 机构管理
 *       科研机构端 - 系统管理 - 单位管理
 */
@Tag(name = "机构管理", description = "科研机构增删改查、审核等接口")
@RestController
@RequestMapping("/institutions")
@RequiredArgsConstructor
public class InstitutionController {

    private final InstitutionService institutionService;

    /**
     * 分页查询机构列表
     * 按钮：机构管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询机构列表")
    @GetMapping
    public Result<PageResult<InstitutionDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        return Result.success(institutionService.list(page, size, keyword, type, status));
    }

    /**
     * 获取所有机构（下拉选择用）
     * 按钮：项目申报页面 - 承担单位选择下拉框
     */
    @Operation(summary = "获取所有机构")
    @GetMapping("/all")
    public Result<List<InstitutionDTO>> listAll() {
        return Result.success(institutionService.listAll());
    }

    /**
     * 获取机构详情
     * 按钮：机构管理页面 - 详情按钮
     */
    @Operation(summary = "获取机构详情")
    @GetMapping("/{id}")
    public Result<InstitutionDTO> getById(@PathVariable Long id) {
        return Result.success(institutionService.getById(id));
    }

    /**
     * 新增机构
     * 按钮：机构管理页面 - 新增机构按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "新增机构")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody InstitutionCreateDTO dto) {
        return Result.success(institutionService.create(dto));
    }

    /**
     * 更新机构
     * 按钮：机构管理页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新机构")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody InstitutionUpdateDTO dto) {
        institutionService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除机构
     * 按钮：机构管理页面 - 删除按钮
     */
    @Operation(summary = "删除机构")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        institutionService.delete(id);
        return Result.success();
    }

    /**
     * 审核机构
     * 按钮：机构管理页面 - 审核通过/驳回按钮
     */
    @Operation(summary = "审核机构")
    @PostMapping("/{id}/audit")
    public Result<Void> audit(@PathVariable Long id, @Valid @RequestBody AuditDTO dto) {
        institutionService.audit(id, dto);
        return Result.success();
    }

    /**
     * 机构资质变更申请
     * 按钮：单位管理页面 - 资质变更按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "机构资质变更申请")
    @PostMapping("/{id}/qualification-change")
    public Result<Void> applyQualificationChange(
            @PathVariable Long id,
            @Valid @RequestBody QualificationChangeDTO dto) {
        institutionService.applyQualificationChange(id, dto);
        return Result.success();
    }

    /**
     * 上传机构资质证书
     * 按钮：单位管理页面 - 上传资质按钮
     */
    @Operation(summary = "上传机构资质证书")
    @PostMapping("/{id}/qualifications/upload")
    public Result<String> uploadQualification(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam String type) {
        return Result.success(institutionService.uploadQualification(id, file, type));
    }

    /**
     * 获取机构项目列表
     * 按钮：机构详情页面 - 项目列表Tab
     */
    @Operation(summary = "获取机构项目列表")
    @GetMapping("/{id}/projects")
    public Result<PageResult<ProjectDTO>> getProjects(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(institutionService.getProjects(id, page, size));
    }

    /**
     * 获取机构成果列表
     * 按钮：机构详情页面 - 成果列表Tab
     */
    @Operation(summary = "获取机构成果列表")
    @GetMapping("/{id}/achievements")
    public Result<PageResult<AchievementDTO>> getAchievements(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(institutionService.getAchievements(id, page, size));
    }

    /**
     * 获取机构绩效考核
     * 按钮：机构详情页面 - 绩效考核Tab
     */
    @Operation(summary = "获取机构绩效考核")
    @GetMapping("/{id}/performance")
    public Result<InstitutionPerformanceDTO> getPerformance(@PathVariable Long id) {
        return Result.success(institutionService.getPerformance(id));
    }
}
