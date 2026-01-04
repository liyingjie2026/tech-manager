package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.DictionaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 字典管理控制器（支持层级结构）
 * 页面：监测监管端 - 配置管理 - 字典管理
 */
@Tag(name = "字典管理", description = "统一字典管理接口，支持层级结构（专业学科、组织机构等）")
@RestController
@RequestMapping("/dictionaries")
@RequiredArgsConstructor
public class DictionaryController {

    private final DictionaryService dictionaryService;

    /**
     * 分页查询字典列表
     * 按钮：字典管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询字典列表")
    @GetMapping
    public Result<PageResult<DictionaryDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        return Result.success(dictionaryService.list(page, size, keyword));
    }

    /**
     * 根据类型获取字典项（扁平列表）
     * 按钮：各页面下拉框 - 加载选项
     */
    @Operation(summary = "根据类型获取字典项（扁平列表）")
    @GetMapping("/type/{type}")
    public Result<List<DictionaryItemDTO>> getByType(@PathVariable String type) {
        return Result.success(dictionaryService.getByType(type));
    }

    /**
     * 根据类型获取字典树形结构
     * 按钮：专业学科选择、组织机构选择 - 加载树形数据
     */
    @Operation(summary = "根据类型获取字典树形结构")
    @GetMapping("/tree/{dictType}")
    public Result<List<DictionaryDTO>> getTreeByType(@PathVariable String dictType) {
        return Result.success(dictionaryService.getTreeByType(dictType));
    }

    /**
     * 根据父ID获取子节点
     * 按钮：树形选择器 - 展开节点
     */
    @Operation(summary = "根据父ID获取子节点")
    @GetMapping("/children/{parentId}")
    public Result<List<DictionaryDTO>> getChildren(@PathVariable Long parentId) {
        return Result.success(dictionaryService.getChildren(parentId));
    }

    /**
     * 获取字典详情
     * 按钮：字典管理页面 - 详情按钮
     */
    @Operation(summary = "获取字典详情")
    @GetMapping("/{id}")
    public Result<DictionaryDTO> getById(@PathVariable Long id) {
        return Result.success(dictionaryService.getById(id));
    }

    /**
     * 新增字典（支持指定父节点）
     * 按钮：字典管理页面 - 新增按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "新增字典（支持指定父节点）")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody DictionaryCreateDTO dto) {
        return Result.success(dictionaryService.create(dto));
    }

    /**
     * 更新字典
     * 按钮：字典管理页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新字典")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody DictionaryUpdateDTO dto) {
        dictionaryService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除字典（级联删除子节点）
     * 按钮：字典管理页面 - 删除按钮
     */
    @Operation(summary = "删除字典（级联删除子节点）")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        dictionaryService.delete(id);
        return Result.success();
    }
}
