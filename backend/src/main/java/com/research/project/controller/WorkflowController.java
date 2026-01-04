package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.WorkflowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 流程配置控制器
 * 页面：监测监管端 - 配置管理 - 流程配置
 */
@Tag(name = "流程配置", description = "流程定义、节点配置等接口")
@RestController
@RequestMapping("/workflows")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    /**
     * 分页查询流程列表
     * 按钮：流程配置页面 - 查询按钮
     */
    @Operation(summary = "分页查询流程列表")
    @GetMapping
    public Result<PageResult<WorkflowDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return Result.success(workflowService.list(page, size, keyword, status));
    }

    /**
     * 获取流程详情
     * 按钮：流程配置页面 - 详情按钮
     */
    @Operation(summary = "获取流程详情")
    @GetMapping("/{id}")
    public Result<WorkflowDetailDTO> getById(@PathVariable Long id) {
        return Result.success(workflowService.getById(id));
    }

    /**
     * 创建流程
     * 按钮：流程配置页面 - 新建流程按钮 -> 弹窗确定按钮
     */
    @Operation(summary = "创建流程")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody WorkflowCreateDTO dto) {
        return Result.success(workflowService.create(dto));
    }

    /**
     * 更新流程
     * 按钮：流程配置页面 - 编辑按钮 -> 保存按钮
     */
    @Operation(summary = "更新流程")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody WorkflowUpdateDTO dto) {
        workflowService.update(id, dto);
        return Result.success();
    }

    /**
     * 删除流程
     * 按钮：流程配置页面 - 删除按钮
     */
    @Operation(summary = "删除流程")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        workflowService.delete(id);
        return Result.success();
    }

    /**
     * 发布流程
     * 按钮：流程配置页面 - 发布按钮
     */
    @Operation(summary = "发布流程")
    @PostMapping("/{id}/publish")
    public Result<Void> publish(@PathVariable Long id) {
        workflowService.publish(id);
        return Result.success();
    }

    /**
     * 停用流程
     * 按钮：流程配置页面 - 停用按钮
     */
    @Operation(summary = "停用流程")
    @PostMapping("/{id}/disable")
    public Result<Void> disable(@PathVariable Long id) {
        workflowService.disable(id);
        return Result.success();
    }

    /**
     * 复制流程
     * 按钮：流程配置页面 - 复制按钮
     */
    @Operation(summary = "复制流程")
    @PostMapping("/{id}/copy")
    public Result<Long> copy(@PathVariable Long id) {
        return Result.success(workflowService.copy(id));
    }

    // ==================== 流程节点管理 ====================

    /**
     * 获取流程节点列表
     * 按钮：流程设计器页面 - 加载节点
     */
    @Operation(summary = "获取流程节点列表")
    @GetMapping("/{id}/nodes")
    public Result<List<WorkflowNodeDTO>> getNodes(@PathVariable Long id) {
        return Result.success(workflowService.getNodes(id));
    }

    /**
     * 添加流程节点
     * 按钮：流程设计器页面 - 添加节点按钮
     */
    @Operation(summary = "添加流程节点")
    @PostMapping("/{id}/nodes")
    public Result<Long> addNode(@PathVariable Long id, @Valid @RequestBody WorkflowNodeCreateDTO dto) {
        return Result.success(workflowService.addNode(id, dto));
    }

    /**
     * 更新流程节点
     * 按钮：流程设计器页面 - 节点属性面板 - 保存按钮
     */
    @Operation(summary = "更新流程节点")
    @PutMapping("/{id}/nodes/{nodeId}")
    public Result<Void> updateNode(
            @PathVariable Long id,
            @PathVariable Long nodeId,
            @Valid @RequestBody WorkflowNodeUpdateDTO dto) {
        workflowService.updateNode(id, nodeId, dto);
        return Result.success();
    }

    /**
     * 删除流程节点
     * 按钮：流程设计器页面 - 删除节点按钮
     */
    @Operation(summary = "删除流程节点")
    @DeleteMapping("/{id}/nodes/{nodeId}")
    public Result<Void> deleteNode(@PathVariable Long id, @PathVariable Long nodeId) {
        workflowService.deleteNode(id, nodeId);
        return Result.success();
    }

    /**
     * 保存流程设计
     * 按钮：流程设计器页面 - 保存按钮
     */
    @Operation(summary = "保存流程设计")
    @PostMapping("/{id}/design")
    public Result<Void> saveDesign(@PathVariable Long id, @Valid @RequestBody WorkflowDesignDTO dto) {
        workflowService.saveDesign(id, dto);
        return Result.success();
    }

    /**
     * 测试流程
     * 按钮：流程设计器页面 - 测试流程按钮
     */
    @Operation(summary = "测试流程")
    @PostMapping("/{id}/test")
    public Result<WorkflowTestResultDTO> test(@PathVariable Long id, @Valid @RequestBody WorkflowTestDTO dto) {
        return Result.success(workflowService.test(id, dto));
    }
}
