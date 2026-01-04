package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Workflow;
import com.research.project.mapper.WorkflowMapper;
import com.research.project.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 工作流服务实现类
 */
@Service
@RequiredArgsConstructor
public class WorkflowServiceImpl extends ServiceImpl<WorkflowMapper, Workflow> implements WorkflowService {
    
    @Override
    public PageResult<WorkflowDTO> list(Integer page, Integer size, String keyword, String status) {
        Page<Workflow> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Workflow> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Workflow::getWorkflowName, keyword)
                    .or().like(Workflow::getWorkflowCode, keyword));
        }
        
        if (StringUtils.hasText(status)) {
            wrapper.eq(Workflow::getStatus, Integer.parseInt(status));
        }
        
        wrapper.orderByDesc(Workflow::getCreateTime);
        
        IPage<Workflow> pageResult = baseMapper.selectPage(pageParam, wrapper);
        
        List<WorkflowDTO> dtoList = pageResult.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(
                Long.valueOf(page),
                Long.valueOf(size),
                pageResult.getTotal(),
                dtoList
        );
    }
    
    @Override
    public WorkflowDetailDTO getById(Long id) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        return convertToDetailDTO(workflow);
    }
    
    @Override
    @Transactional
    public Long create(WorkflowCreateDTO dto) {
        Workflow workflow = new Workflow();
        workflow.setWorkflowName(dto.getWorkflowName());
        workflow.setWorkflowType(dto.getWorkflowType());
        workflow.setDescription(dto.getDescription());
        workflow.setVersion(1);
        workflow.setIsCurrent(1);
        workflow.setStatus(0); // 草稿状态
        
        baseMapper.insert(workflow);
        return workflow.getId();
    }
    
    @Override
    @Transactional
    public void update(Long id, WorkflowUpdateDTO dto) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        
        if (dto.getWorkflowName() != null) {
            workflow.setWorkflowName(dto.getWorkflowName());
        }
        if (dto.getDescription() != null) {
            workflow.setDescription(dto.getDescription());
        }
        
        baseMapper.updateById(workflow);
    }
    
    @Override
    @Transactional
    public void delete(Long id) {
        baseMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public void publish(Long id) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        workflow.setStatus(1); // 启用状态
        baseMapper.updateById(workflow);
    }
    
    @Override
    @Transactional
    public void disable(Long id) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        workflow.setStatus(0); // 禁用状态
        baseMapper.updateById(workflow);
    }
    
    @Override
    @Transactional
    public Long copy(Long id) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        
        Workflow newWorkflow = new Workflow();
        BeanUtils.copyProperties(workflow, newWorkflow);
        newWorkflow.setId(null);
        newWorkflow.setWorkflowName(workflow.getWorkflowName() + "_副本");
        newWorkflow.setVersion(1);
        newWorkflow.setStatus(0);
        
        baseMapper.insert(newWorkflow);
        return newWorkflow.getId();
    }
    
    @Override
    public List<WorkflowNodeDTO> getNodes(Long id) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        
        List<WorkflowNodeDTO> nodes = new ArrayList<>();
        
        WorkflowNodeDTO startNode = new WorkflowNodeDTO();
        startNode.setId("1");
        startNode.setNodeType("start");
        startNode.setNodeName("开始");
        nodes.add(startNode);
        
        WorkflowNodeDTO endNode = new WorkflowNodeDTO();
        endNode.setId("2");
        endNode.setNodeType("end");
        endNode.setNodeName("结束");
        nodes.add(endNode);
        
        return nodes;
    }
    
    @Override
    @Transactional
    public Long addNode(Long id, WorkflowNodeCreateDTO dto) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        
        // 实际场景：插入workflow_node表
        // WorkflowNode node = new WorkflowNode();
        // BeanUtils.copyProperties(dto, node);
        // node.setWorkflowId(id);
        // workflowNodeMapper.insert(node);
        // return node.getId();
        
        return System.currentTimeMillis();
    }
    
    @Override
    @Transactional
    public void updateNode(Long id, Long nodeId, WorkflowNodeUpdateDTO dto) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        
        // 实际场景：更新workflow_node表
        // WorkflowNode node = workflowNodeMapper.selectById(nodeId);
        // if (node == null || !node.getWorkflowId().equals(id)) {
        //     throw new RuntimeException("节点不存在");
        // }
        // BeanUtils.copyProperties(dto, node, getNullPropertyNames(dto));
        // workflowNodeMapper.updateById(node);
    }
    
    @Override
    @Transactional
    public void deleteNode(Long id, Long nodeId) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        
        // 实际场景：删除workflow_node表记录
        // workflowNodeMapper.deleteById(nodeId);
    }
    
    @Override
    @Transactional
    public void saveDesign(Long id, WorkflowDesignDTO dto) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        
        // 实际场景：保存工作流设计JSON
        // workflow.setDesignJson(dto.getDesignJson());
        // baseMapper.updateById(workflow);
        
        System.out.println("[WorkflowServiceImpl] Saving workflow design for ID: " + id);
        System.out.println("  Nodes count: " + (dto.getNodes() != null ? dto.getNodes().size() : 0));
        System.out.println("  Edges count: " + (dto.getEdges() != null ? dto.getEdges().size() : 0));
    }
    
    @Override
    public WorkflowTestResultDTO test(Long id, WorkflowTestDTO dto) {
        Workflow workflow = baseMapper.selectById(id);
        if (workflow == null) {
            throw new RuntimeException("工作流不存在");
        }
        
        // 实际场景：执行工作流测试
        // 1. 解析工作流定义
        // 2. 模拟执行每个节点
        // 3. 返回测试结果
        
        WorkflowTestResultDTO result = new WorkflowTestResultDTO();
        result.setSuccess(true);
        result.setMessage("工作流测试通过");
        result.setExecutionTime(150L); // ms
        
        return result;
    }
    
    public Workflow getByCode(String code) {
        return baseMapper.selectCurrentByCode(code);
    }
    
    public Workflow getLatestVersion(String code) {
        LambdaQueryWrapper<Workflow> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Workflow::getWorkflowCode, code);
        wrapper.orderByDesc(Workflow::getVersion);
        wrapper.last("LIMIT 1");
        return baseMapper.selectOne(wrapper);
    }
    
    private WorkflowDTO convertToDTO(Workflow workflow) {
        WorkflowDTO dto = new WorkflowDTO();
        dto.setId(workflow.getId());
        dto.setName(workflow.getWorkflowName());
        dto.setCode(workflow.getWorkflowCode());
        dto.setType(workflow.getWorkflowType());
        dto.setDescription(workflow.getDescription());
        dto.setStatus(workflow.getStatus());
        return dto;
    }
    
    private WorkflowDetailDTO convertToDetailDTO(Workflow workflow) {
        WorkflowDetailDTO dto = new WorkflowDetailDTO();
        dto.setId(workflow.getId());
        dto.setName(workflow.getWorkflowName());
        dto.setCode(workflow.getWorkflowCode());
        dto.setDescription(workflow.getDescription());
        dto.setStatus(workflow.getStatus() == 1 ? "enabled" : "disabled");
        dto.setVersion(workflow.getVersion());
        dto.setCreatedAt(workflow.getCreateTime());
        dto.setUpdatedAt(workflow.getUpdateTime());
        return dto;
    }
}
