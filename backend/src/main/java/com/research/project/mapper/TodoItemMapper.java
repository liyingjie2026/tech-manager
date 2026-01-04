package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.TodoItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface TodoItemMapper extends BaseMapper<TodoItem> {
    
    /**
     * 根据条件查询待办事项
     */
    List<TodoItem> selectByConditions(
            @Param("userId") Long userId,
            @Param("role") String role,
            @Param("type") String type,
            @Param("status") String status,
            @Param("keyword") String keyword,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("offset") Integer offset,
            @Param("size") Integer size
    );
    
    /**
     * 统计条件查询结果数量
     */
    Long countByConditions(
            @Param("userId") Long userId,
            @Param("role") String role,
            @Param("type") String type,
            @Param("status") String status,
            @Param("keyword") String keyword,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
    
    /**
     * 根据业务ID和类型查询待办
     */
    List<TodoItem> selectByBusiness(
            @Param("businessId") Long businessId,
            @Param("businessType") String businessType
    );
    
    /**
     * 批量完成待办（根据业务）
     */
    int batchCompleteByBusiness(
            @Param("businessId") Long businessId,
            @Param("businessType") String businessType,
            @Param("completedBy") String completedBy,
            @Param("completedTime") LocalDateTime completedTime
    );
}
