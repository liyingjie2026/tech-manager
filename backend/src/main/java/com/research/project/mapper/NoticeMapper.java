package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Notice;
import org.apache.ibatis.annotations.Mapper;

/**
 * 通知公告Mapper接口
 */
@Mapper
public interface NoticeMapper extends BaseMapper<Notice> {
}
