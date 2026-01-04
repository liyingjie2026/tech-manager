package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.StatusLabel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 状态标签Mapper
 */
@Mapper
public interface StatusLabelMapper extends BaseMapper<StatusLabel> {
    
    /**
     * 根据分类获取状态标签列表
     */
    List<StatusLabel> selectByCategory(@Param("category") String category);
    
    /**
     * 根据分类和值获取状态标签
     */
    StatusLabel selectByCategoryAndValue(@Param("category") String category, @Param("value") String value);
    
    /**
     * 获取所有分类
     */
    List<String> selectAllCategories();
}
