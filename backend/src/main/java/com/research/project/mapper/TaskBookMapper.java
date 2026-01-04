package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.TaskBook;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 任务书Mapper接口
 */
@Mapper
public interface TaskBookMapper extends BaseMapper<TaskBook> {
    
    /**
     * 根据项目ID查询任务书
     */
    TaskBook selectByProjectId(@Param("projectId") Long projectId);
}
