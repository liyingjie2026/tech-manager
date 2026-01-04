package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Annual;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 年度检查Mapper接口
 */
@Mapper
public interface AnnualMapper extends BaseMapper<Annual> {
    
    /**
     * 根据项目ID查询年度检查列表
     */
    List<Annual> selectByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 按状态统计年度检查数量
     */
    Long countByStatus(@Param("status") String status);
}
