package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.ExpertVote;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 专家投票Mapper
 */
@Mapper
public interface ExpertVoteMapper extends BaseMapper<ExpertVote> {
    
    /**
     * 统计各专家得票数
     */
    @Select("SELECT voted_expert_id as expertId, voted_expert_name as expertName, COUNT(*) as voteCount " +
            "FROM prj_expert_vote " +
            "WHERE project_id = #{projectId} AND deleted = 0 " +
            "GROUP BY voted_expert_id, voted_expert_name " +
            "ORDER BY voteCount DESC")
    List<Map<String, Object>> countVotesByProject(@Param("projectId") Long projectId);
}
