package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Institution;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 机构Mapper接口
 */
@Mapper
public interface InstitutionMapper extends BaseMapper<Institution> {
    
    /**
     * 根据统一社会信用代码查询机构
     */
    Institution selectByCreditCode(@Param("creditCode") String creditCode);
    
    /**
     * 根据机构名称查询机构
     */
    Institution selectByName(@Param("name") String name);
}
