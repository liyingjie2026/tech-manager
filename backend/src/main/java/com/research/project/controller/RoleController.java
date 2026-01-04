package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色管理控制器
 * 页面：监测监管端 - 系统管理 - 角色管理
 */
@Tag(name = "角色管理", description = "角色增删改查、权限配置等接口")
@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    /**
     * 分页查询角色列表
     * 按钮：角色管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询角色列表")
    @GetMapping
    public Result<PageResult<RoleDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        return Result.success(roleService.list(page, size, keyword));
    }

    /**
     * 获取所有角色（下拉选择用）
     * 按钮：用户管理页面 - 角色选择下拉框
     */
    @Operation(summary = "获取所有角色")
    @GetMapping("/all")
    public Result<List<RoleDTO>> listAll() {
        return Result.success(roleService.listAll());
    }

    /**
     * 获取角色详情
     * 按钮：角色管理页面 - 详情按钮
     */
    @Operation(summary = "获取角色详情")
    @GetMapping("/{id}")
    public Result<RoleDTO> getById(@PathVariable Long id) {
        return Result.success(roleService.getById(id));
    }

    /**
     * 新增角色
     * 按钮：角色管理页面 - 新增角色按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "新增角色")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody RoleCreateDTO dto) {
        return Result.success(roleService.create(dto));
    }

    /**
     * 更新角色
     * 按钮：角色管理页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新角色")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody RoleUpdateDTO dto) {
        roleService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除角色
     * 按钮：角色管理页面 - 删除按钮
     */
    @Operation(summary = "删除角色")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        roleService.delete(id);
        return Result.success();
    }

    /**
     * 配置角色权限
     * 按钮：角色管理页面 - 权限配置按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "配置角色权限")
    @PostMapping("/{id}/permissions")
    public Result<Void> assignPermissions(@PathVariable Long id, @RequestBody List<Long> permissionIds) {
        roleService.assignPermissions(id, permissionIds);
        return Result.success();
    }

    /**
     * 获取角色权限
     * 按钮：角色管理页面 - 权限配置按钮（加载已有权限）
     */
    @Operation(summary = "获取角色权限")
    @GetMapping("/{id}/permissions")
    public Result<List<Long>> getPermissions(@PathVariable Long id) {
        return Result.success(roleService.getPermissions(id));
    }
}
