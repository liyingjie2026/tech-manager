package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Resource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 资源Mapper接口
 */
@Mapper
public interface ResourceMapper extends BaseMapper<Resource> {
    
    /**
     * 根据机构ID查询资源列表
     */
    List<Resource> selectByInstitutionId(@Param("institutionId") Long institutionId);
    
    /**
     * 根据资源类型查询资源列表
     */
    List<Resource> selectByType(@Param("type") String type);
}
