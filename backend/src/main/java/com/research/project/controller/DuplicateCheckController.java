package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.DuplicateCheckDTO;
import com.research.project.dto.DuplicateCheckResultDTO;
import com.research.project.service.DuplicateCheckService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 查重检测控制器
 * 页面：科研机构端 - 项目信息查重
 */
@Tag(name = "查重检测", description = "项目申报书查重检测接口")
@RestController
@RequestMapping("/duplicate-check")
@RequiredArgsConstructor
public class DuplicateCheckController {

    private final DuplicateCheckService duplicateCheckService;

    /**
     * 分页查询查重结果列表
     * 按钮：查重检测页面 - 加载数据
     */
    @Operation(summary = "分页查询查重结果列表")
    @GetMapping
    public Result<PageResult<DuplicateCheckResultDTO>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minRate,
            @RequestParam(required = false) Double maxRate) {
        return Result.success(duplicateCheckService.list(page, size, keyword, minRate, maxRate));
    }

    /**
     * 获取查重结果详情
     * 按钮：查重检测页面 - 详情按钮
     */
    @Operation(summary = "获取查重结果详情")
    @GetMapping("/{id}")
    public Result<DuplicateCheckResultDTO> getById(@PathVariable Long id) {
        return Result.success(duplicateCheckService.getById(id));
    }

    /**
     * 执行查重检测
     * 按钮：项目申报页面 - 查重检测按钮
     */
    @Operation(summary = "执行查重检测")
    @PostMapping("/check")
    public Result<DuplicateCheckResultDTO> check(@RequestBody DuplicateCheckDTO dto) {
        return Result.success(duplicateCheckService.check(dto));
    }

    /**
     * 获取项目的查重结果
     * 按钮：项目详情页面 - 查看查重结果
     */
    @Operation(summary = "获取项目的查重结果")
    @GetMapping("/project/{projectId}")
    public Result<DuplicateCheckResultDTO> getByProjectId(@PathVariable Long projectId) {
        return Result.success(duplicateCheckService.getByProjectId(projectId));
    }

    /**
     * 重新查重
     * 按钮：查重结果页面 - 重新查重按钮
     */
    @Operation(summary = "重新查重")
    @PostMapping("/{id}/recheck")
    public Result<DuplicateCheckResultDTO> recheck(@PathVariable Long id) {
        return Result.success(duplicateCheckService.recheck(id));
    }
}
