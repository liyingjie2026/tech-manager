package com.research.project.controller;

import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.TodoItemDTO;
import com.research.project.dto.TodoStatisticsDTO;
import com.research.project.service.TodoItemService;
import com.research.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
public class TodoItemController {
    
    private final TodoItemService todoItemService;
    
    /**
     * 分页查询待办事项
     */
    @GetMapping
    public Result<PageResult<TodoItemDTO>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword
    ) {
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(todoItemService.list(page, size, userId, role, type, status, keyword));
    }
    
    /**
     * 获取待办统计信息
     */
    @GetMapping("/statistics")
    public Result<TodoStatisticsDTO> getStatistics(@RequestParam(required = false) String role) {
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(todoItemService.getStatistics(userId, role));
    }
    
    /**
     * 获取待办详情
     */
    @GetMapping("/{id}")
    public Result<TodoItemDTO> getById(@PathVariable Long id) {
        return Result.success(todoItemService.getById(id));
    }
    
    /**
     * 完成待办
     */
    @PostMapping("/{id}/complete")
    public Result<Void> complete(@PathVariable Long id) {
        String userName = SecurityUtils.getCurrentUserName();
        todoItemService.complete(id, userName);
        return Result.success();
    }
    
    /**
     * 取消待办
     */
    @PostMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        todoItemService.cancel(id);
        return Result.success();
    }
    
    /**
     * 获取未完成待办数量（用于角标提示）
     */
    @GetMapping("/uncompleted-count")
    public Result<Integer> getUncompletedCount() {
        Long userId = SecurityUtils.getCurrentUserId();
        return Result.success(todoItemService.getUncompletedCount(userId));
    }
}
