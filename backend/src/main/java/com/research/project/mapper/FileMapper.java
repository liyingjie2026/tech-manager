package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.FileInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 文件Mapper接口
 */
@Mapper
public interface FileMapper extends BaseMapper<FileInfo> {
    
    /**
     * 根据业务类型和业务ID查询文件列表
     */
    List<FileInfo> selectByBusiness(@Param("businessType") String businessType, @Param("businessId") Long businessId);
}
