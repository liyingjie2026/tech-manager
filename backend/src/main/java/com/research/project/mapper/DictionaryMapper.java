package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Dictionary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 字典Mapper接口（支持层级结构）
 */
@Mapper
public interface DictionaryMapper extends BaseMapper<Dictionary> {
    
    /**
     * 根据类型编码查询字典列表
     */
    List<Dictionary> selectByTypeCode(@Param("typeCode") String typeCode);
    
    /**
     * 根据字典类型查询字典项（支持层级）
     */
    List<Dictionary> selectByDictType(@Param("dictType") String dictType);
    
    /**
     * 根据父ID查询子节点
     */
    List<Dictionary> selectByParentId(@Param("parentId") Long parentId);
    
    /**
     * 根据字典类型和层级查询
     */
    List<Dictionary> selectByTypeAndLevel(@Param("dictType") String dictType, @Param("level") Integer level);
}
