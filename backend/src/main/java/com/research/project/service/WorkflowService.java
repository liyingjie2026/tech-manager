package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;

import java.util.List;

/**
 * 流程服务接口
 */
public interface WorkflowService {
    
    /**
     * 分页查询流程列表
     */
    PageResult<WorkflowDTO> list(Integer page, Integer size, String keyword, String status);
    
    /**
     * 获取流程详情
     */
    WorkflowDetailDTO getById(Long id);
    
    /**
     * 创建流程
     */
    Long create(WorkflowCreateDTO dto);
    
    /**
     * 更新流程
     */
    void update(Long id, WorkflowUpdateDTO dto);
    
    /**
     * 删除流程
     */
    void delete(Long id);
    
    /**
     * 发布流程
     */
    void publish(Long id);
    
    /**
     * 停用流程
     */
    void disable(Long id);
    
    /**
     * 复制流程
     */
    Long copy(Long id);
    
    /**
     * 获取流程节点列表
     */
    List<WorkflowNodeDTO> getNodes(Long id);
    
    /**
     * 添加流程节点
     */
    Long addNode(Long id, WorkflowNodeCreateDTO dto);
    
    /**
     * 更新流程节点
     */
    void updateNode(Long id, Long nodeId, WorkflowNodeUpdateDTO dto);
    
    /**
     * 删除流程节点
     */
    void deleteNode(Long id, Long nodeId);
    
    /**
     * 保存流程设计
     */
    void saveDesign(Long id, WorkflowDesignDTO dto);
    
    /**
     * 测试流程
     */
    WorkflowTestResultDTO test(Long id, WorkflowTestDTO dto);
}
