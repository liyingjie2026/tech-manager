package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.AwardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 获奖管理控制器
 * 页面：科研机构端 - 项目成果 - 项目获奖
 */
@Tag(name = "获奖管理", description = "项目获奖录入、审核等接口")
@RestController
@RequestMapping("/awards")
@RequiredArgsConstructor
public class AwardController {

    private final AwardService awardService;

    /**
     * 分页查询获奖列表
     * 按钮：项目获奖页面 - 查询按钮
     */
    @Operation(summary = "分页查询获奖列表")
    @GetMapping
    public Result<PageResult<AwardDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String status) {
        return Result.success(awardService.list(page, size, keyword, level, status));
    }

    /**
     * 获取获奖详情
     * 按钮：项目获奖页面 - 详情按钮
     */
    @Operation(summary = "获取获奖详情")
    @GetMapping("/{id}")
    public Result<AwardDetailDTO> getById(@PathVariable Long id) {
        return Result.success(awardService.getById(id));
    }

    /**
     * 获取项目获奖列表
     * 按钮：项目详情页面 - 获奖Tab - 加载数据
     */
    @Operation(summary = "获取项目获奖列表")
    @GetMapping("/project/{projectId}")
    public Result<List<AwardDTO>> getByProject(@PathVariable Long projectId) {
        return Result.success(awardService.getByProject(projectId));
    }

    /**
     * 创建获奖记录
     * 按钮：项目获奖页面 - 添加按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "创建获奖记录")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody AwardCreateDTO dto) {
        return Result.success(awardService.create(dto));
    }

    /**
     * 更新获奖记录
     * 按钮：项目获奖页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新获奖记录")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody AwardUpdateDTO dto) {
        awardService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除获奖记录
     * 按钮：项目获奖页面 - 删除按钮
     */
    @Operation(summary = "删除获奖记录")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        awardService.delete(id);
        return Result.success();
    }

    /**
     * 提交获奖审核
     * 按钮：项目获奖页面 - 提交按钮
     */
    @Operation(summary = "提交获奖审核")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        awardService.submit(id);
        return Result.success();
    }

    /**
     * 审核获奖
     * 按钮：获奖审核页面 - 通过/驳回按钮
     */
    @Operation(summary = "审核获奖")
    @PostMapping("/{id}/audit")
    public Result<Void> audit(@PathVariable Long id, @Valid @RequestBody AuditDTO dto) {
        awardService.audit(id, dto);
        return Result.success();
    }

    /**
     * 上传获奖证书
     * 按钮：项目获奖页面 - 上传证书按钮
     */
    @Operation(summary = "上传获奖证书")
    @PostMapping("/{id}/certificate")
    public Result<String> uploadCertificate(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return Result.success(awardService.uploadCertificate(id, file));
    }
}
