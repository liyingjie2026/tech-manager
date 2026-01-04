package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.entity.User;
import com.research.project.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理控制器
 * 页面：监测监管端 - 系统管理 - 用户管理
 *       科研机构端 - 系统管理 - 人员管理
 */
@Tag(name = "用户管理", description = "用户增删改查、状态管理等接口")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 分页查询用户列表
     * 按钮：用户管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询用户列表")
    @GetMapping
    public Result<PageResult<UserDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long roleId,
            @RequestParam(required = false) Long institutionId) {
        return Result.success(userService.list(page, size, keyword, status, roleId, institutionId));
    }

    /**
     * 获取用户详情
     * 按钮：用户管理页面 - 详情按钮
     */
    @Operation(summary = "获取用户详情")
    @GetMapping("/{id}")
    public Result<UserDTO> getById(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    /**
     * 新增用户
     * 按钮：用户管理页面 - 新增用户按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "新增用户")
    @PostMapping
    public Result<String> create(@Valid @RequestBody UserCreateDTO dto) {
        return Result.success(userService.create(dto));
    }

    /**
     * 更新用户
     * 按钮：用户管理页面 - 编辑按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "更新用户")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO dto) {
        userService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除用户
     * 按钮：用户管理页面 - 删除按钮
     */
    @Operation(summary = "删除用户")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }

    /**
     * 批量删除用户
     * 按钮：用户管理页面 - 批量删除按钮
     */
    @Operation(summary = "批量删除用户")
    @DeleteMapping("/batch")
    public Result<Void> batchDelete(@RequestBody List<Long> ids) {
        userService.batchDelete(ids);
        return Result.success();
    }

    /**
     * 启用用户
     * 按钮：用户管理页面 - 启用按钮
     */
    @Operation(summary = "启用用户")
    @PostMapping("/{id}/enable")
    public Result<Void> enable(@PathVariable Long id) {
        userService.enable(id);
        return Result.success();
    }

    /**
     * 禁用用户
     * 按钮：用户管理页面 - 禁用按钮
     */
    @Operation(summary = "禁用用户")
    @PostMapping("/{id}/disable")
    public Result<Void> disable(@PathVariable Long id) {
        userService.disable(id);
        return Result.success();
    }

    /**
     * 重置用户密码
     * 按钮：用户管理页面 - 重置密码按钮
     */
    @Operation(summary = "重置用户密码")
    @PostMapping("/{id}/reset-password")
    public Result<String> resetPassword(@PathVariable Long id) {
        return Result.success(userService.resetPassword(id));
    }

    /**
     * 分配角色
     * 按钮：用户管理页面 - 分配角色按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "分配角色")
    @PostMapping("/{id}/roles")
    public Result<Void> assignRoles(@PathVariable Long id, @RequestBody List<Long> roleIds) {
        userService.assignRoles(id, roleIds);
        return Result.success();
    }

    /**
     * 审核用户
     * 按钮：用户管理页面 - 审核通过/驳回按钮
     */
    @Operation(summary = "审核用户")
    @PostMapping("/{id}/audit")
    public Result<Void> audit(@PathVariable Long id, @Valid @RequestBody AuditDTO dto) {
        userService.audit(id, dto);
        return Result.success();
    }

    /**
     * 导出用户列表
     * 按钮：用户管理页面 - 导出按钮
     */
    @Operation(summary = "导出用户列表")
    @GetMapping("/export")
    public Result<String> export(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return Result.success(userService.export(keyword, status));
    }
}
