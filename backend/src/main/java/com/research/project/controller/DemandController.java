package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.DemandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 需求管理控制器
 * 页面：科研机构端 - 需求征集
 *       监测监管端 - 需求管理
 */
@Tag(name = "需求管理", description = "需求征集、发布、揭榜等接口")
@RestController
@RequestMapping("/demands")
@RequiredArgsConstructor
public class DemandController {

    private final DemandService demandService;

    /**
     * 分页查询需求列表
     * 按钮：需求管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询需求列表")
    @GetMapping
    public Result<PageResult<DemandDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        return Result.success(demandService.list(page, size, keyword, status, type));
    }

    /**
     * 获取需求详情
     * 按钮：需求管理页面 - 详情按钮
     */
    @Operation(summary = "获取需求详情")
    @GetMapping("/{id}")
    public Result<DemandDetailDTO> getById(@PathVariable Long id) {
        return Result.success(demandService.getById(id));
    }

    /**
     * 创建需求
     * 按钮：需求征集页面 - 提交按钮
     */
    @Operation(summary = "创建需求")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody DemandCreateDTO dto) {
        return Result.success(demandService.create(dto));
    }

    /**
     * 更新需求
     * 按钮：需求管理页面 - 编辑按钮 -> 保存按钮
     */
    @Operation(summary = "更新需求")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody DemandUpdateDTO dto) {
        demandService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除需求
     * 按钮：需求管理页面 - 删除按钮
     */
    @Operation(summary = "删除需求")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        demandService.delete(id);
        return Result.success();
    }

    /**
     * 审核需求
     * 按钮：需求审核页面 - 通过/驳回按钮
     */
    @Operation(summary = "审核需求")
    @PostMapping("/{id}/audit")
    public Result<Void> audit(@PathVariable Long id, @Valid @RequestBody AuditDTO dto) {
        demandService.audit(id, dto);
        return Result.success();
    }

    /**
     * 发布需求（揭榜挂帅）
     * 按钮：需求管理页面 - 发布按钮
     */
    @Operation(summary = "发布需求")
    @PostMapping("/{id}/publish")
    public Result<Void> publish(@PathVariable Long id) {
        demandService.publish(id);
        return Result.success();
    }

    /**
     * 取消发布需求
     * 按钮：需求管理页面 - 取消发布按钮
     */
    @Operation(summary = "取消发布需求")
    @PostMapping("/{id}/unpublish")
    public Result<Void> unpublish(@PathVariable Long id) {
        demandService.unpublish(id);
        return Result.success();
    }

    /**
     * 揭榜需求
     * 按钮：揭榜挂帅页面 - 揭榜按钮 -> 弹窗确认按钮
     */
    @Operation(summary = "揭榜需求")
    @PostMapping("/{id}/bid")
    public Result<Long> bid(@PathVariable Long id, @Valid @RequestBody BidCreateDTO dto) {
        return Result.success(demandService.bid(id, dto));
    }

    /**
     * 获取揭榜列表
     * 按钮：需求详情页面 - 揭榜记录Tab
     */
    @Operation(summary = "获取揭榜列表")
    @GetMapping("/{id}/bids")
    public Result<List<BidDTO>> getBids(@PathVariable Long id) {
        return Result.success(demandService.getBids(id));
    }

    /**
     * 选定揭榜方
     * 按钮：需求详情页面 - 选定按钮
     */
    @Operation(summary = "选定揭榜方")
    @PostMapping("/{id}/bids/{bidId}/select")
    public Result<Void> selectBid(@PathVariable Long id, @PathVariable Long bidId) {
        demandService.selectBid(id, bidId);
        return Result.success();
    }

    /**
     * 上传需求附件
     * 按钮：需求征集页面 - 上传附件按钮
     */
    @Operation(summary = "上传需求附件")
    @PostMapping("/{id}/attachments")
    public Result<AttachmentDTO> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return Result.success(demandService.uploadAttachment(id, file));
    }
}
