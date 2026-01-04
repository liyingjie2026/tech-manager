package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Award;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 获奖Mapper接口
 */
@Mapper
public interface AwardMapper extends BaseMapper<Award> {
    
    /**
     * 根据项目ID查询获奖列表
     */
    List<Award> selectByProjectId(@Param("projectId") Long projectId);
}
