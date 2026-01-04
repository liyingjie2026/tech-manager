package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.BasicData;
import org.apache.ibatis.annotations.Mapper;

/**
 * 基础数据Mapper接口
 */
@Mapper
public interface BasicDataMapper extends BaseMapper<BasicData> {
}
