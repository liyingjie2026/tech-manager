package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Workflow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 流程定义Mapper接口
 */
@Mapper
public interface WorkflowMapper extends BaseMapper<Workflow> {
    
    /**
     * 根据流程编码查询当前版本流程
     */
    Workflow selectCurrentByCode(@Param("workflowCode") String workflowCode);
}
