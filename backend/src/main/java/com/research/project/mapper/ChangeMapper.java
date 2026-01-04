package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Change;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 变更Mapper接口
 */
@Mapper
public interface ChangeMapper extends BaseMapper<Change> {
    
    /**
     * 根据项目ID查询变更列表
     */
    List<Change> selectByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 根据条件统计变更数量
     */
    long countByConditions(@Param("keyword") String keyword, 
                          @Param("status") String status, 
                          @Param("changeType") String changeType);
    
    /**
     * 根据条件查询变更列表
     */
    List<Change> selectByConditions(@Param("keyword") String keyword,
                                    @Param("status") String status,
                                    @Param("changeType") String changeType,
                                    @Param("offset") int offset,
                                    @Param("size") int size);
}
