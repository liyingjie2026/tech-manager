package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.dto.BudgetListDTO;
import com.research.project.dto.BudgetChangeRecordDTO;
import com.research.project.entity.Project;
import com.research.project.entity.ProjectBudget;
import com.research.project.mapper.ProjectMapper;
import com.research.project.mapper.ProjectBudgetMapper;
import com.research.project.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 经费管理服务实现
 */
@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final ProjectMapper projectMapper;
    private final ProjectBudgetMapper projectBudgetMapper;

    @Override
    public PageResult<BudgetListDTO> list(Integer page, Integer size, String keyword) {
        Page<Project> pageParam = new Page<>(page, size);
        QueryWrapper<Project> queryWrapper = new QueryWrapper<>();
        
        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(w -> w.like("project_no", keyword).or().like("name", keyword));
        }
        
        queryWrapper.orderByDesc("create_time");
        Page<Project> projectPage = projectMapper.selectPage(pageParam, queryWrapper);
        
        List<BudgetListDTO> records = projectPage.getRecords().stream().map(project -> {
            BudgetListDTO dto = new BudgetListDTO();
            dto.setId(project.getId());
            dto.setProjectNo(project.getProjectNo());
            dto.setProjectName(project.getName());
            dto.setTotalBudget(project.getTotalBudget() != null ? project.getTotalBudget() : BigDecimal.ZERO);
            dto.setProvincialFunds(project.getApplyBudget() != null ? project.getApplyBudget() : BigDecimal.ZERO);
            dto.setSelfFunds(project.getSelfBudget() != null ? project.getSelfBudget() : BigDecimal.ZERO);
            
            // Calculate used amount - simplified, should query from actual budget usage records
            BigDecimal usedAmount = dto.getTotalBudget().multiply(new BigDecimal("0.45"));
            dto.setUsedAmount(usedAmount);
            dto.setRemainingAmount(dto.getTotalBudget().subtract(usedAmount));
            
            // Calculate usage rate
            if (dto.getTotalBudget().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal rate = usedAmount.divide(dto.getTotalBudget(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
                dto.setUsageRate(rate.setScale(0, RoundingMode.HALF_UP).toString() + "%");
            } else {
                dto.setUsageRate("0%");
            }
            
            return dto;
        }).collect(Collectors.toList());
        
        return new PageResult<>(projectPage.getTotal(), records);
    }

    @Override
    public PageResult<BudgetChangeRecordDTO> getChangeRecords(Integer page, Integer size, String keyword) {
        // Simplified implementation - in real scenario, query from budget_change_record table
        List<BudgetChangeRecordDTO> records = new ArrayList<>();
        
        if (page == 1 && size >= 2) {
            BudgetChangeRecordDTO record1 = new BudgetChangeRecordDTO();
            record1.setProjectNo("KJ202502001");
            record1.setProjectName("项目数据融合技术研究");
            record1.setChangeType("预算调整");
            record1.setChangeAmount(new BigDecimal("5000.00"));
            record1.setChangeReason("增加设备采购预算");
            record1.setChangeDate("2025-03-15");
            record1.setStatus("已审批");
            record1.setApplicant("张三");
            records.add(record1);
            
            BudgetChangeRecordDTO record2 = new BudgetChangeRecordDTO();
            record2.setProjectNo("KJ202502002");
            record2.setProjectName("试点关键技术研究");
            record2.setChangeType("科目调剂");
            record2.setChangeAmount(new BigDecimal("-3000.00"));
            record2.setChangeReason("调整材料费至人工费");
            record2.setChangeDate("2025-03-10");
            record2.setStatus("审批中");
            record2.setApplicant("李四");
            records.add(record2);
        }
        
        return new PageResult<>((long) records.size(), records);
    }

    @Override
    public BudgetListDTO getDetail(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            return null;
        }
        
        BudgetListDTO dto = new BudgetListDTO();
        dto.setId(project.getId());
        dto.setProjectNo(project.getProjectNo());
        dto.setProjectName(project.getName());
        dto.setTotalBudget(project.getTotalBudget() != null ? project.getTotalBudget() : BigDecimal.ZERO);
        dto.setProvincialFunds(project.getApplyBudget() != null ? project.getApplyBudget() : BigDecimal.ZERO);
        dto.setSelfFunds(project.getSelfBudget() != null ? project.getSelfBudget() : BigDecimal.ZERO);
        
        BigDecimal usedAmount = dto.getTotalBudget().multiply(new BigDecimal("0.45"));
        dto.setUsedAmount(usedAmount);
        dto.setRemainingAmount(dto.getTotalBudget().subtract(usedAmount));
        
        if (dto.getTotalBudget().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal rate = usedAmount.divide(dto.getTotalBudget(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            dto.setUsageRate(rate.setScale(0, RoundingMode.HALF_UP).toString() + "%");
        } else {
            dto.setUsageRate("0%");
        }
        
        return dto;
    }

    @Override
    public void applyChange(BudgetChangeRecordDTO dto) {
        // Simplified implementation - save to budget_change_record table
        // In real scenario, create a change record and start approval workflow
    }
}
