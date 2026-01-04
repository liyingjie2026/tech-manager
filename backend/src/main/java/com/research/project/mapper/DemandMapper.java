package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Demand;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 需求Mapper接口
 */
@Mapper
public interface DemandMapper extends BaseMapper<Demand> {
    
    /**
     * 根据条件查询需求列表
     */
    List<Demand> selectByConditions(@Param("keyword") String keyword,
                                     @Param("status") String status,
                                     @Param("type") String type,
                                     @Param("offset") int offset,
                                     @Param("size") int size);
    
    /**
     * 根据条件统计需求数量
     */
    long countByConditions(@Param("keyword") String keyword,
                          @Param("status") String status,
                          @Param("type") String type);
}
