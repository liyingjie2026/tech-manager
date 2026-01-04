package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Dictionary;
import com.research.project.mapper.DictionaryMapper;
import com.research.project.service.DictionaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 字典服务实现类（支持层级结构）
 */
@Service
@RequiredArgsConstructor
public class DictionaryServiceImpl implements DictionaryService {
    
    private final DictionaryMapper dictionaryMapper;
    
    @Override
    public PageResult<DictionaryDTO> list(Integer page, Integer size, String keyword) {
        int offset = (page - 1) * size;
        
        QueryWrapper<Dictionary> wrapper = new QueryWrapper<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.and(w -> w.like("dict_name", keyword)
                    .or().like("item_label", keyword)
                    .or().like("item_code", keyword));
        }
        wrapper.eq("deleted", 0);
        wrapper.orderByDesc("create_time");
        
        // Get total count
        long total = dictionaryMapper.selectCount(wrapper);
        
        // Get paginated records
        wrapper.last("LIMIT " + offset + ", " + size);
        List<Dictionary> records = dictionaryMapper.selectList(wrapper);
        
        List<DictionaryDTO> dtoList = records.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), total, dtoList);
    }
    
    @Override
    public List<DictionaryItemDTO> getByType(String type) {
        QueryWrapper<Dictionary> wrapper = new QueryWrapper<>();
        wrapper.eq("dict_type", type);
        wrapper.eq("enabled", true);
        wrapper.orderByAsc("sort");
        
        List<Dictionary> items = dictionaryMapper.selectList(wrapper);
        
        return items.stream().map(item -> {
            DictionaryItemDTO dto = new DictionaryItemDTO();
            dto.setId(item.getId());
            dto.setLabel(item.getItemLabel());
            dto.setValue(item.getItemValue());
            dto.setCode(item.getItemCode());
            dto.setSort(item.getSort());
            dto.setDescription(item.getDescription());
            return dto;
        }).collect(Collectors.toList());
    }
    
    @Override
    public List<DictionaryDTO> getTreeByType(String dictType) {
        QueryWrapper<Dictionary> wrapper = new QueryWrapper<>();
        wrapper.eq("dict_type", dictType);
        wrapper.eq("enabled", true);
        wrapper.orderByAsc("sort");
        
        List<Dictionary> allNodes = dictionaryMapper.selectList(wrapper);
        
        // Build tree structure
        return buildTree(allNodes, 0L);
    }
    
    @Override
    public List<DictionaryDTO> getChildren(Long parentId) {
        QueryWrapper<Dictionary> wrapper = new QueryWrapper<>();
        wrapper.eq("parent_id", parentId);
        wrapper.eq("enabled", true);
        wrapper.orderByAsc("sort");
        
        List<Dictionary> children = dictionaryMapper.selectList(wrapper);
        
        return children.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    private List<DictionaryDTO> buildTree(List<Dictionary> allNodes, Long parentId) {
        return allNodes.stream()
                .filter(node -> parentId.equals(node.getParentId()))
                .map(node -> {
                    DictionaryDTO dto = convertToDTO(node);
                    List<DictionaryDTO> children = buildTree(allNodes, node.getId());
                    if (!children.isEmpty()) {
                        dto.setChildren(children);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    private DictionaryDTO convertToDTO(Dictionary dictionary) {
        DictionaryDTO dto = new DictionaryDTO();
        dto.setId(dictionary.getId());
        dto.setParentId(dictionary.getParentId());
        dto.setDictType(dictionary.getDictType());
        dto.setDictName(dictionary.getDictName());
        dto.setItemCode(dictionary.getItemCode());
        dto.setItemLabel(dictionary.getItemLabel());
        dto.setItemValue(dictionary.getItemValue());
        dto.setLevel(dictionary.getLevel());
        dto.setDescription(dictionary.getDescription());
        dto.setSort(dictionary.getSort());
        dto.setEnabled(dictionary.getEnabled());
        return dto;
    }
    
    @Override
    public DictionaryDTO getById(Long id) {
        Dictionary dictionary = dictionaryMapper.selectById(id);
        if (dictionary == null) {
            throw new RuntimeException("字典不存在");
        }
        
        return convertToDTO(dictionary);
    }
    
    @Override
    @Transactional
    public Long create(DictionaryCreateDTO dto) {
        Dictionary dictionary = new Dictionary();
        dictionary.setParentId(dto.getParentId() != null ? dto.getParentId() : 0L);
        dictionary.setDictType(dto.getDictType());
        dictionary.setDictName(dto.getDictName());
        dictionary.setItemCode(dto.getItemCode());
        dictionary.setItemLabel(dto.getItemLabel());
        dictionary.setItemValue(dto.getItemValue());
        dictionary.setLevel(dto.getLevel() != null ? dto.getLevel() : 1);
        dictionary.setDescription(dto.getDescription());
        dictionary.setSort(dto.getSort() != null ? dto.getSort() : 0);
        dictionary.setEnabled(dto.getEnabled() != null ? dto.getEnabled() : true);
        
        dictionaryMapper.insert(dictionary);
        return dictionary.getId();
    }
    
    @Override
    @Transactional
    public void update(Long id, DictionaryUpdateDTO dto) {
        Dictionary dictionary = dictionaryMapper.selectById(id);
        if (dictionary == null) {
            throw new RuntimeException("字典不存在");
        }
        
        if (dto.getItemLabel() != null) {
            dictionary.setItemLabel(dto.getItemLabel());
        }
        if (dto.getItemValue() != null) {
            dictionary.setItemValue(dto.getItemValue());
        }
        if (dto.getDescription() != null) {
            dictionary.setDescription(dto.getDescription());
        }
        if (dto.getSort() != null) {
            dictionary.setSort(dto.getSort());
        }
        if (dto.getEnabled() != null) {
            dictionary.setEnabled(dto.getEnabled());
        }
        
        dictionaryMapper.updateById(dictionary);
    }
    
    @Override
    @Transactional
    public void delete(Long id) {
        Dictionary dictionary = dictionaryMapper.selectById(id);
        if (dictionary == null) {
            throw new RuntimeException("字典不存在");
        }
        
        // Recursively delete all children
        deleteWithChildren(id);
    }
    
    private void deleteWithChildren(Long id) {
        // Find all children
        QueryWrapper<Dictionary> wrapper = new QueryWrapper<>();
        wrapper.eq("parent_id", id);
        List<Dictionary> children = dictionaryMapper.selectList(wrapper);
        
        // Recursively delete children
        for (Dictionary child : children) {
            deleteWithChildren(child.getId());
        }
        
        // Delete current node
        dictionaryMapper.deleteById(id);
    }
}
