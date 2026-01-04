package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.BudgetListDTO;
import com.research.project.dto.BudgetChangeRecordDTO;
import com.research.project.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 经费管理控制器
 * 页面：监管端 - 项目管理 - 经费管理
 */
@Tag(name = "经费管理", description = "项目经费查询、变更记录等接口")
@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    /**
     * 分页查询项目经费列表
     * 按钮：经费管理页面 - 项目经费Tab - 查询按钮
     */
    @Operation(summary = "分页查询项目经费列表")
    @GetMapping
    public Result<PageResult<BudgetListDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        return Result.success(budgetService.list(page, size, keyword));
    }

    /**
     * 获取经费变更记录
     * 按钮：经费管理页面 - 变更记录Tab - 查询按钮
     */
    @Operation(summary = "获取经费变更记录")
    @GetMapping("/change-records")
    public Result<PageResult<BudgetChangeRecordDTO>> getChangeRecords(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        return Result.success(budgetService.getChangeRecords(page, size, keyword));
    }

    /**
     * 获取项目经费详情
     * 按钮：经费管理页面 - 详情按钮
     */
    @Operation(summary = "获取项目经费详情")
    @GetMapping("/{id}")
    public Result<BudgetListDTO> getDetail(@PathVariable Long id) {
        return Result.success(budgetService.getDetail(id));
    }

    /**
     * 申请经费变更
     * 按钮：经费管理页面 - 变更申请按钮
     */
    @Operation(summary = "申请经费变更")
    @PostMapping("/change")
    public Result<Void> applyChange(@RequestBody BudgetChangeRecordDTO dto) {
        budgetService.applyChange(dto);
        return Result.success();
    }
}
