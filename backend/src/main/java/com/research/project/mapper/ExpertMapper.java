package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Expert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 专家Mapper接口
 */
@Mapper
public interface ExpertMapper extends BaseMapper<Expert> {
    
    /**
     * 根据用户ID查询专家
     */
    Expert selectByUserId(@Param("userId") Long userId);
    
    /**
     * 根据研究领域查询可用专家
     */
    List<Expert> selectByResearchField(@Param("researchField") String researchField);
    
    /**
     * 随机抽取专家
     */
    List<Expert> selectRandomExperts(@Param("researchField") String researchField, @Param("count") Integer count, @Param("excludeIds") List<Long> excludeIds);
}
