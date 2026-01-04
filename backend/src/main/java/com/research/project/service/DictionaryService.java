package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;

import java.util.List;

/**
 * 字典服务接口（支持层级结构）
 */
public interface DictionaryService {
    
    /**
     * 分页查询字典列表
     */
    PageResult<DictionaryDTO> list(Integer page, Integer size, String keyword);
    
    /**
     * 根据类型获取字典项（支持层级）
     */
    List<DictionaryItemDTO> getByType(String type);
    
    /**
     * 获取字典树形结构（根据类型）
     */
    List<DictionaryDTO> getTreeByType(String dictType);
    
    /**
     * 根据父ID获取子节点
     */
    List<DictionaryDTO> getChildren(Long parentId);
    
    /**
     * 获取字典详情
     */
    DictionaryDTO getById(Long id);
    
    /**
     * 新增字典（可指定父节点）
     */
    Long create(DictionaryCreateDTO dto);
    
    /**
     * 更新字典
     */
    void update(Long id, DictionaryUpdateDTO dto);
    
    /**
     * 删除字典（级联删除子节点）
     */
    void delete(Long id);
}
