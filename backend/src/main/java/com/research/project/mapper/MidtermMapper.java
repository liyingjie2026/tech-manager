package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Midterm;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 中期检查Mapper接口
 */
@Mapper
public interface MidtermMapper extends BaseMapper<Midterm> {
    
    /**
     * 根据项目ID查询中期检查列表
     */
    List<Midterm> selectByProjectId(@Param("projectId") Long projectId);
}
