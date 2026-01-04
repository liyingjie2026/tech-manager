package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.research.project.entity.*;
import com.research.project.mapper.*;
import com.research.project.service.TodoGeneratorService;
import com.research.project.service.TodoItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoGeneratorServiceImpl implements TodoGeneratorService {
    
    private final TodoItemService todoItemService;
    private final ExpertReviewMapper expertReviewMapper;
    private final UserMapper userMapper;
    private final AnnualMapper annualMapper; // Added missing annualMapper field declaration
    
    @Override
    @Transactional
    public void generateProjectReviewTodo(Project project) {
        // 查询该项目的评审专家
        LambdaQueryWrapper<ExpertReview> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExpertReview::getProjectId, project.getId())
                .eq(ExpertReview::getStatus, "pending");
        List<ExpertReview> reviews = expertReviewMapper.selectList(wrapper);
        
        List<TodoItem> todoItems = new ArrayList<>();
        for (ExpertReview review : reviews) {
            TodoItem item = new TodoItem();
            item.setUserId(review.getExpertId());
            item.setUserName(review.getExpertName());
            item.setRole("expert");
            item.setTitle("项目评审：" + project.getName());
            item.setDescription("请完成项目「" + project.getName() + "」的评审工作");
            item.setType("project_review");
            item.setBusinessId(project.getId());
            item.setBusinessNo(project.getProjectNo());
            item.setBusinessType("project");
            item.setPriority("high");
            item.setStatus("pending");
            if (review.getReviewEndTime() != null) {
                item.setDeadline(review.getReviewEndTime());
            } else {
                // 默认7天后截止
                item.setDeadline(LocalDateTime.now().plusDays(7));
            }
            item.setLinkUrl("/expert/review?projectId=" + project.getId());
            todoItems.add(item);
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }
    
    @Override
    @Transactional
    public void generateTaskBookAuditTodo(TaskBook taskBook) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 如果是待机构审核状态，生成机构管理员待办
        if ("pending_institution".equals(taskBook.getStatus())) {
            // 查询机构管理员
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getInstitutionId, taskBook.getInstitutionId())
                    .eq(User::getUserType, "admin")
                    .eq(User::getStatus, 1);
            List<User> admins = userMapper.selectList(wrapper);
            
            for (User admin : admins) {
                TodoItem item = new TodoItem();
                item.setUserId(admin.getId());
                item.setUserName(admin.getRealName());
                item.setRole("institution");
                item.setTitle("任务书审核：" + taskBook.getProjectName());
                item.setDescription("项目「" + taskBook.getProjectName() + "」的任务书待审核");
                item.setType("taskbook_audit");
                item.setBusinessId(taskBook.getId());
                item.setBusinessNo(taskBook.getTaskBookNo());
                item.setBusinessType("taskbook");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(3));
                item.setLinkUrl("/dashboard/admin/task-book-review/" + taskBook.getId());
                todoItems.add(item);
            }
        } 
        // 如果是待监管审核状态，生成监管端待办
        else if ("pending".equals(taskBook.getStatus())) {
            // 查询监管端用户
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("任务书审批：" + taskBook.getProjectName());
                item.setDescription("项目「" + taskBook.getProjectName() + "」的任务书待审批");
                item.setType("taskbook_audit");
                item.setBusinessId(taskBook.getId());
                item.setBusinessNo(taskBook.getTaskBookNo());
                item.setBusinessType("taskbook");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(5));
                item.setLinkUrl("/supervisor/task/" + taskBook.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }

    @Override
    public void generateTaskBookApproveTodo(TaskBook taskBook) {
        // Empty implementation - to be filled based on business logic
    }

    @Override
    public void generateTaskBookSignTodo(TaskBook taskBook) {
        // Empty implementation - to be filled based on business logic
    }
    
    @Override
    @Transactional
    public void generateChangeAuditTodo(Change change) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 如果是待机构审核状态
        if ("pending_institution".equals(change.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getInstitutionName, change.getApplyUnit())
                    .eq(User::getUserType, "admin")
                    .eq(User::getStatus, 1);
            List<User> admins = userMapper.selectList(wrapper);
            
            for (User admin : admins) {
                TodoItem item = new TodoItem();
                item.setUserId(admin.getId());
                item.setUserName(admin.getRealName());
                item.setRole("institution");
                item.setTitle("项目变更审核：" + change.getProjectName());
                item.setDescription("项目「" + change.getProjectName() + "」的变更申请待审核");
                item.setType("change_audit");
                item.setBusinessId(change.getId());
                item.setBusinessNo(change.getChangeNo());
                item.setBusinessType("change");
                item.setPriority("high");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(3));
                item.setLinkUrl("/dashboard/admin/change-review?id=" + change.getId());
                todoItems.add(item);
            }
        } 
        // 如果是待监管审核状态
        else if ("pending_supervisor".equals(change.getStatus()) || "pending".equals(change.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("项目变更审批：" + change.getProjectName());
                item.setDescription("项目「" + change.getProjectName() + "」的变更申请待审批");
                item.setType("change_audit");
                item.setBusinessId(change.getId());
                item.setBusinessNo(change.getChangeNo());
                item.setBusinessType("change");
                item.setPriority("high");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(5));
                item.setLinkUrl("/supervisor/change?id=" + change.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }

    @Override
    public void generateChangeReviewTodo(Change change) {
        // Empty implementation - to be filled based on business logic
    }
    
    @Override
    @Transactional
    public void generateMidtermReviewTodo(Midterm midterm) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 待机构审核
        if ("pending_institution".equals(midterm.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getInstitutionName, midterm.getInstitutionName())
                    .eq(User::getUserType, "admin")
                    .eq(User::getStatus, 1);
            List<User> admins = userMapper.selectList(wrapper);
            
            for (User admin : admins) {
                TodoItem item = new TodoItem();
                item.setUserId(admin.getId());
                item.setUserName(admin.getRealName());
                item.setRole("institution");
                item.setTitle("中期检查审核：" + midterm.getProjectName());
                item.setDescription("项目「" + midterm.getProjectName() + "」的中期检查报告待审核");
                item.setType("midterm_review");
                item.setBusinessId(midterm.getId());
                item.setBusinessNo(midterm.getMidtermNo());
                item.setBusinessType("midterm");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(3));
                item.setLinkUrl("/dashboard/admin/midterm-review?id=" + midterm.getId());
                todoItems.add(item);
            }
        } 
        // 待监管审核
        else if ("pending_supervisor".equals(midterm.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("中期检查审批：" + midterm.getProjectName());
                item.setDescription("项目「" + midterm.getProjectName() + "」的中期检查报告待审批");
                item.setType("midterm_review");
                item.setBusinessId(midterm.getId());
                item.setBusinessNo(midterm.getMidtermNo());
                item.setBusinessType("midterm");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(5));
                item.setLinkUrl("/supervisor/midterm?id=" + midterm.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }

    @Override
    public void generateMidtermSubmitTodo(Midterm midterm) {
        // Empty implementation - to be filled based on business logic
    }
    
    @Override
    @Transactional
    public void generateAnnualReviewTodo(Long projectId, Integer year) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // Query the Annual record for this project and year
        LambdaQueryWrapper<Annual> annualWrapper = new LambdaQueryWrapper<>();
        annualWrapper.eq(Annual::getProjectId, projectId)
                     .eq(Annual::getCheckYear, year.toString());
        Annual annual = annualMapper.selectOne(annualWrapper);
        
        if (annual == null) {
            return; // No annual report found, skip
        }
        
        // 待机构审核
        if ("pending_institution".equals(annual.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getInstitutionName, annual.getInstitutionName())
                    .eq(User::getUserType, "admin")
                    .eq(User::getStatus, 1);
            List<User> admins = userMapper.selectList(wrapper);
            
            for (User admin : admins) {
                TodoItem item = new TodoItem();
                item.setUserId(admin.getId());
                item.setUserName(admin.getRealName());
                item.setRole("institution");
                item.setTitle("年报检查审核：" + annual.getProjectName());
                item.setDescription("项目「" + annual.getProjectName() + "」的年度报告待审核");
                item.setType("annual_review");
                item.setBusinessId(annual.getId());
                item.setBusinessNo(annual.getAnnualNo());
                item.setBusinessType("annual");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(3));
                item.setLinkUrl("/dashboard/admin/annual-review?id=" + annual.getId());
                todoItems.add(item);
            }
        } 
        // 待监管审核
        else if ("pending_supervisor".equals(annual.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("年报检查审批：" + annual.getProjectName());
                item.setDescription("项目「" + annual.getProjectName() + "」的年度报告待审批");
                item.setType("annual_review");
                item.setBusinessId(annual.getId());
                item.setBusinessNo(annual.getAnnualNo());
                item.setBusinessType("annual");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(5));
                item.setLinkUrl("/supervisor/annual?id=" + annual.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }
    
    @Override
    @Transactional
    public void generateAnnualSubmitTodo(Annual annual) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 待监管审核
        if ("pending".equals(annual.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("年报提交审批：" + annual.getProjectName());
                item.setDescription("项目「" + annual.getProjectName() + "」的年度报告待提交审批");
                item.setType("annual_submit");
                item.setBusinessId(annual.getId());
                item.setBusinessNo(annual.getAnnualNo());
                item.setBusinessType("annual");
                item.setPriority("high");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(5));
                item.setLinkUrl("/supervisor/annual-submit?id=" + annual.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }
    
    @Override
    @Transactional
    public void generateAcceptanceReviewTodo(Acceptance acceptance) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 待监管审核
        if ("pending".equals(acceptance.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("项目验收审核：" + acceptance.getProjectName());
                item.setDescription("项目「" + acceptance.getProjectName() + "」的验收申请待审核");
                item.setType("acceptance_review");
                item.setBusinessId(acceptance.getId());
                item.setBusinessNo(acceptance.getAcceptanceNo());
                item.setBusinessType("acceptance");
                item.setPriority("high");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(5));
                item.setLinkUrl("/supervisor/acceptance?id=" + acceptance.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }
    
    @Override
    @Transactional
    public void generateExpertAuditTodo(Expert expert) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 待监管审核
        if ("pending".equals(expert.getAuditStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("专家入库审核：" + expert.getName());
                item.setDescription("专家「" + expert.getName() + "」的入库申请待审核");
                item.setType("expert_audit");
                item.setBusinessId(expert.getId());
                item.setBusinessNo(expert.getExpertCode());
                item.setBusinessType("expert");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(3));
                item.setLinkUrl("/supervisor/system/expert?id=" + expert.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }
    
    @Override
    @Transactional
    public void generateInstitutionAuditTodo(Institution institution) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 待监管审核
        if ("pending".equals(institution.getAuditStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("机构入库审核：" + institution.getName());
                item.setDescription("机构「" + institution.getName() + "」的入库申请待审核");
                item.setType("institution_audit");
                item.setBusinessId(institution.getId());
                item.setBusinessNo(institution.getCode());
                item.setBusinessType("institution");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(3));
                item.setLinkUrl("/supervisor/system/institution?id=" + institution.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }
    
    @Override
    @Transactional
    public void generateAchievementAuditTodo(Achievement achievement) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 待审核
        if ("pending".equals(achievement.getStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("成果审核：" + achievement.getName());
                item.setDescription("成果「" + achievement.getName() + "」待审核");
                item.setType("achievement_audit");
                item.setBusinessId(achievement.getId());
                item.setBusinessNo(achievement.getAchievementNo());
                item.setBusinessType("achievement");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(5));
                item.setLinkUrl("/supervisor/achievement-review?id=" + achievement.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }
    
    @Override
    @Transactional
    public void generateResourceAuditTodo(com.research.project.entity.Resource resource) {
        List<TodoItem> todoItems = new ArrayList<>();
        
        // 待审核
        if ("pending".equals(resource.getAuditStatus())) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserType, "supervisor")
                    .eq(User::getStatus, 1);
            List<User> supervisors = userMapper.selectList(wrapper);
            
            for (User supervisor : supervisors) {
                TodoItem item = new TodoItem();
                item.setUserId(supervisor.getId());
                item.setUserName(supervisor.getRealName());
                item.setRole("supervisor");
                item.setTitle("资源共享审核：" + resource.getName());
                item.setDescription("资源「" + resource.getName() + "」的共享申请待审核");
                item.setType("resource_audit");
                item.setBusinessId(resource.getId());
                item.setBusinessNo(resource.getResourceNo());
                item.setBusinessType("resource");
                item.setPriority("normal");
                item.setStatus("pending");
                item.setDeadline(LocalDateTime.now().plusDays(3));
                item.setLinkUrl("/supervisor/resource-sharing?id=" + resource.getId());
                todoItems.add(item);
            }
        }
        
        if (!todoItems.isEmpty()) {
            todoItemService.batchCreate(todoItems);
        }
    }
}
