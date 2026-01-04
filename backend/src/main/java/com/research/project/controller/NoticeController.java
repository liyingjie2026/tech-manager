package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 通知公告控制器
 * 页面：监测监管端 - 系统管理 - 通知发布
 *       各端首页 - 通知公告模块
 */
@Tag(name = "通知公告", description = "通知公告发布、查询等接口")
@RestController
@RequestMapping("/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    /**
     * 分页查询通知列表
     * 按钮：通知发布页面 - 查询按钮
     */
    @Operation(summary = "分页查询通知列表")
    @GetMapping
    public Result<PageResult<NoticeDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        return Result.success(noticeService.list(page, size, keyword, type, status));
    }

    /**
     * 获取通知详情
     * 按钮：通知列表 - 详情按钮
     */
    @Operation(summary = "获取通知详情")
    @GetMapping("/{id}")
    public Result<NoticeDetailDTO> getById(@PathVariable Long id) {
        return Result.success(noticeService.getById(id));
    }

    /**
     * 创建通知
     * 按钮：通知发布页面 - 新建通知按钮 -> 保存按钮
     */
    @Operation(summary = "创建通知")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody NoticeCreateDTO dto) {
        return Result.success(noticeService.create(dto));
    }

    /**
     * 更新通知
     * 按钮：通知发布页面 - 编辑按钮 -> 保存按钮
     */
    @Operation(summary = "更新通知")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody NoticeUpdateDTO dto) {
        noticeService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除通知
     * 按钮：通知发布页面 - 删除按钮
     */
    @Operation(summary = "删除通知")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return Result.success();
    }

    /**
     * 发布通知
     * 按钮：通知发布页面 - 发布按钮
     */
    @Operation(summary = "发布通知")
    @PostMapping("/{id}/publish")
    public Result<Void> publish(@PathVariable Long id) {
        noticeService.publish(id);
        return Result.success();
    }

    /**
     * 撤回通知
     * 按钮：通知发布页面 - 撤回按钮
     */
    @Operation(summary = "撤回通知")
    @PostMapping("/{id}/withdraw")
    public Result<Void> withdraw(@PathVariable Long id) {
        noticeService.withdraw(id);
        return Result.success();
    }

    /**
     * 获取已发布通知列表（门户展示）
     * 按钮：首页 - 通知公告模块
     */
    @Operation(summary = "获取已发布通知列表")
    @GetMapping("/published")
    public Result<List<NoticeDTO>> listPublished(
            @RequestParam(defaultValue = "10") Integer limit) {
        return Result.success(noticeService.listPublished(limit));
    }

    /**
     * 标记通知已读
     * 按钮：通知详情页面 - 自动标记
     */
    @Operation(summary = "标记通知已读")
    @PostMapping("/{id}/read")
    public Result<Void> markAsRead(@PathVariable Long id) {
        noticeService.markAsRead(id);
        return Result.success();
    }

    /**
     * 获取未读通知数量
     * 按钮：顶部导航 - 通知图标
     */
    @Operation(summary = "获取未读通知数量")
    @GetMapping("/unread/count")
    public Result<Integer> getUnreadCount() {
        return Result.success(noticeService.getUnreadCount());
    }
}
