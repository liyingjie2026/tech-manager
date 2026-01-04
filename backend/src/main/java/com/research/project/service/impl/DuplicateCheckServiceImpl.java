package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.dto.DuplicateCheckDTO;
import com.research.project.dto.DuplicateCheckResultDTO;
import com.research.project.entity.DuplicateCheckResult;
import com.research.project.entity.Project;
import com.research.project.mapper.DuplicateCheckResultMapper;
import com.research.project.mapper.ProjectMapper;
import com.research.project.service.DuplicateCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 查重检测服务实现
 */
@Service
@RequiredArgsConstructor
public class DuplicateCheckServiceImpl implements DuplicateCheckService {

    private final DuplicateCheckResultMapper duplicateCheckResultMapper;
    private final ProjectMapper projectMapper;

    @Override
    public PageResult<DuplicateCheckResultDTO> list(long page, long size, String keyword, Double minRate, Double maxRate) {
        LambdaQueryWrapper<DuplicateCheckResult> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DuplicateCheckResult::getDeleted, 0);
        
        // 关键词搜索
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> {
                // 通过project_id关联查询项目名称
                List<Long> projectIds = projectMapper.selectList(
                    new LambdaQueryWrapper<Project>()
                        .like(Project::getName, keyword)
                        .select(Project::getId)
                ).stream().map(Project::getId).collect(Collectors.toList());
                
                if (!projectIds.isEmpty()) {
                    w.in(DuplicateCheckResult::getProjectId, projectIds);
                }
            });
        }
        
        // 查重率范围过滤
        if (minRate != null) {
            wrapper.ge(DuplicateCheckResult::getDuplicateRate, BigDecimal.valueOf(minRate));
        }
        if (maxRate != null) {
            wrapper.le(DuplicateCheckResult::getDuplicateRate, BigDecimal.valueOf(maxRate));
        }
        
        wrapper.orderByDesc(DuplicateCheckResult::getCheckTime);
        
        IPage<DuplicateCheckResult> pageResult = duplicateCheckResultMapper.selectPage(
            new Page<>(page, size), wrapper
        );
        
        List<DuplicateCheckResultDTO> records = pageResult.getRecords().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return new PageResult<>(
                pageResult.getSize(),
            pageResult.getTotal(),
            pageResult.getCurrent(),
                records
        );
    }

    @Override
    public DuplicateCheckResultDTO getById(Long id) {
        DuplicateCheckResult result = duplicateCheckResultMapper.selectById(id);
        if (result == null || result.getDeleted() == 1) {
            throw new RuntimeException("查重结果不存在");
        }
        return convertToDTO(result);
    }

    @Override
    @Transactional
    public DuplicateCheckResultDTO check(DuplicateCheckDTO dto) {
        // 获取项目信息
        Project project = projectMapper.selectById(dto.getProjectId());
        if (project == null) {
            throw new RuntimeException("项目不存在");
        }
        
        // 执行查重逻辑（这里简化处理，实际应调用查重算法）
        BigDecimal duplicateRate = calculateDuplicateRate(project);
        String similarProjects = findSimilarProjects(project);
        
        // 创建查重结果记录
        DuplicateCheckResult result = new DuplicateCheckResult();
        result.setProjectId(dto.getProjectId());
        result.setDuplicateRate(duplicateRate);
        result.setSimilarProjects(similarProjects);
        result.setCheckTime(LocalDateTime.now());
        result.setCheckBy(dto.getCheckBy());
        result.setDeleted(0);
        
        duplicateCheckResultMapper.insert(result);
        
        return convertToDTO(result);
    }

    @Override
    public DuplicateCheckResultDTO getByProjectId(Long projectId) {
        LambdaQueryWrapper<DuplicateCheckResult> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DuplicateCheckResult::getProjectId, projectId)
               .eq(DuplicateCheckResult::getDeleted, 0)
               .orderByDesc(DuplicateCheckResult::getCheckTime)
               .last("LIMIT 1");
        
        DuplicateCheckResult result = duplicateCheckResultMapper.selectOne(wrapper);
        if (result == null) {
            throw new RuntimeException("该项目暂无查重结果");
        }
        
        return convertToDTO(result);
    }

    @Override
    @Transactional
    public DuplicateCheckResultDTO recheck(Long id) {
        DuplicateCheckResult oldResult = duplicateCheckResultMapper.selectById(id);
        if (oldResult == null || oldResult.getDeleted() == 1) {
            throw new RuntimeException("查重结果不存在");
        }
        
        // 创建新的查重DTO
        DuplicateCheckDTO dto = new DuplicateCheckDTO();
        dto.setProjectId(oldResult.getProjectId());
        dto.setCheckBy(oldResult.getCheckBy());
        
        return check(dto);
    }

    /**
     * 计算查重率（简化实现）
     */
    private BigDecimal calculateDuplicateRate(Project project) {
        // 实际应该调用专业的查重算法
        // 这里返回随机值用于演示
        double rate = Math.random() * 30; // 0-30%之间
        return BigDecimal.valueOf(rate).setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * 查找相似项目（简化实现）
     */
    private String findSimilarProjects(Project project) {
        // 实际应该使用相似度算法查找
        // 这里返回示例数据
        return "相似项目1(相似度85%), 相似项目2(相似度72%)";
    }

    /**
     * 转换为DTO
     */
    private DuplicateCheckResultDTO convertToDTO(DuplicateCheckResult result) {
        DuplicateCheckResultDTO dto = new DuplicateCheckResultDTO();
        dto.setId(result.getId());
        dto.setProjectId(result.getProjectId());
        
        // 获取项目信息
        Project project = projectMapper.selectById(result.getProjectId());
        if (project != null) {
            dto.setProjectName(project.getName());
            dto.setProjectNo(project.getProjectNo());
        }
        
        dto.setDuplicateRate(result.getDuplicateRate());
        dto.setSimilarProjects(result.getSimilarProjects());
        dto.setCheckTime(result.getCheckTime());
        dto.setCheckBy(result.getCheckBy());
        
        return dto;
    }
}
