package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.DownloadRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 数据下载记录Mapper接口
 */
@Mapper
public interface DownloadRecordMapper extends BaseMapper<DownloadRecord> {
}
