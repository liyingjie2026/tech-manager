package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Software;
import org.apache.ibatis.annotations.Mapper;

/**
 * 专业软件Mapper接口
 */
@Mapper
public interface SoftwareMapper extends BaseMapper<Software> {
}
