package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.BorrowRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 仪器借用记录Mapper接口
 */
@Mapper
public interface BorrowRecordMapper extends BaseMapper<BorrowRecord> {
}
