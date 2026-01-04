package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 权限管理控制器
 * 页面：监测监管端 - 配置管理 - 权限管理
 */
@Tag(name = "权限管理", description = "页面按钮级权限配置接口")
@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    /**
     * 获取权限树
     * 按钮：权限管理页面 - 加载权限树
     */
    @Operation(summary = "获取权限树")
    @GetMapping("/tree")
    public Result<List<PermissionTreeDTO>> getTree() {
        return Result.success(permissionService.getTree());
    }

    /**
     * 获取页面列表
     * 按钮：权限管理页面 - 页面列表
     */
    @Operation(summary = "获取页面列表")
    @GetMapping("/pages")
    public Result<List<PagePermissionDTO>> getPages() {
        return Result.success(permissionService.getPages());
    }

    /**
     * 获取页面按钮权限
     * 按钮：权限管理页面 - 选择页面后加载按钮
     */
    @Operation(summary = "获取页面按钮权限")
    @GetMapping("/pages/{pageId}/buttons")
    public Result<List<ButtonPermissionDTO>> getPageButtons(@PathVariable Long pageId) {
        return Result.success(permissionService.getPageButtons(pageId));
    }

    /**
     * 获取角色权限配置
     * 按钮：权限管理页面 - 选择角色后加载权限
     */
    @Operation(summary = "获取角色权限配置")
    @GetMapping("/roles/{roleId}")
    public Result<RolePermissionDTO> getRolePermissions(@PathVariable Long roleId) {
        return Result.success(permissionService.getRolePermissions(roleId));
    }

    /**
     * 保存角色权限配置
     * 按钮：权限管理页面 - 保存按钮
     */
    @Operation(summary = "保存角色权限配置")
    @PostMapping("/roles/{roleId}")
    public Result<Void> saveRolePermissions(
            @PathVariable Long roleId,
            @Valid @RequestBody RolePermissionSaveDTO dto) {
        permissionService.saveRolePermissions(roleId, dto);
        return Result.success();
    }

    /**
     * 新增页面权限
     * 按钮：权限管理页面 - 新增页面按钮
     */
    @Operation(summary = "新增页面权限")
    @PostMapping("/pages")
    public Result<Long> createPage(@Valid @RequestBody PagePermissionCreateDTO dto) {
        return Result.success(permissionService.createPage(dto));
    }

    /**
     * 新增按钮权限
     * 按钮：权限管理页面 - 新增按钮权限按钮
     */
    @Operation(summary = "新增按钮权限")
    @PostMapping("/pages/{pageId}/buttons")
    public Result<Long> createButton(
            @PathVariable Long pageId,
            @Valid @RequestBody ButtonPermissionCreateDTO dto) {
        return Result.success(permissionService.createButton(pageId, dto));
    }

    /**
     * 更新按钮权限
     * 按钮：权限管理页面 - 编辑按钮权限按钮
     */
    @Operation(summary = "更新按钮权限")
    @PutMapping("/buttons/{buttonId}")
    public Result<Void> updateButton(
            @PathVariable Long buttonId,
            @Valid @RequestBody ButtonPermissionUpdateDTO dto) {
        permissionService.updateButton(buttonId, dto);
        return Result.success();
    }

    /**
     * 删除按钮权限
     * 按钮：权限管理页面 - 删除按钮权限按钮
     */
    @Operation(summary = "删除按钮权限")
    @DeleteMapping("/buttons/{buttonId}")
    public Result<Void> deleteButton(@PathVariable Long buttonId) {
        permissionService.deleteButton(buttonId);
        return Result.success();
    }

    /**
     * 检查当前用户权限
     * 按钮：各页面 - 按钮权限控制
     */
    @Operation(summary = "检查当前用户权限")
    @GetMapping("/check")
    public Result<Boolean> checkPermission(
            @RequestParam String pageCode,
            @RequestParam String buttonCode) {
        return Result.success(permissionService.checkPermission(pageCode, buttonCode));
    }

    /**
     * 获取当前用户所有权限
     * 按钮：登录后 - 加载用户权限
     */
    @Operation(summary = "获取当前用户所有权限")
    @GetMapping("/my")
    public Result<UserPermissionsDTO> getMyPermissions() {
        return Result.success(permissionService.getMyPermissions());
    }
}
