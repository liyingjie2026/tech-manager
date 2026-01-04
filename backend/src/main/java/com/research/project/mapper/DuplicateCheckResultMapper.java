package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.DuplicateCheckResult;
import org.apache.ibatis.annotations.Mapper;

/**
 * 查重结果Mapper
 */
@Mapper
public interface DuplicateCheckResultMapper extends BaseMapper<DuplicateCheckResult> {
}
