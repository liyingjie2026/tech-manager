package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.ExpertReview;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 专家评审Mapper接口
 */
@Mapper
public interface ExpertReviewMapper extends BaseMapper<ExpertReview> {
    
    /**
     * 根据项目ID查询评审列表
     */
    List<ExpertReview> selectByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 根据专家ID查询评审列表
     */
    List<ExpertReview> selectByExpertId(@Param("expertId") Long expertId);
    
    /**
     * 根据批次号查询评审列表
     */
    List<ExpertReview> selectByBatchNo(@Param("batchNo") String batchNo);
}
