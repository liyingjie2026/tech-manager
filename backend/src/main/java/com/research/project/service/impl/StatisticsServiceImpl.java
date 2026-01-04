package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.research.project.dto.*;
import com.research.project.entity.*;
import com.research.project.mapper.*;
import com.research.project.service.StatisticsService;
import com.research.project.service.TodoItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 统计服务实现类
 */
@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {
    
    private final ProjectMapper projectMapper;
    private final InstitutionMapper institutionMapper;
    private final ExpertMapper expertMapper;
    private final AchievementMapper achievementMapper;
    private final TodoItemMapper todoItemMapper;
    private final NoticeMapper noticeMapper;
    private final TodoItemService todoItemService;
    private final UserMapper userMapper;
    private final AcceptanceMapper acceptanceMapper;
    
    @Override
    public DashboardDTO getDashboardByUser(Long userId, String userRole) {
        DashboardDTO dashboard = new DashboardDTO();
        
        User currentUser = userMapper.selectById(userId);
        if (currentUser == null) {
            currentUser = new User();
            currentUser.setUserType("researcher");
        }
        
        // Project statistics - filtered by user role
        DashboardDTO.ProjectStatsDTO projectStats = new DashboardDTO.ProjectStatsDTO();
        
        LambdaQueryWrapper<Project> baseWrapper = new LambdaQueryWrapper<>();
        
        String userType = currentUser.getUserType();
        if ("admin".equals(userType) || "supervisor".equals(userType)) {
            // 超级管理员、监管端用户可以看到系统中所有的项目信息
            // No filter - see all projects
        } else if ("researcher".equals(userType)) {
            // 检查是否是机构管理员
            if (currentUser.getRoleName() != null && currentUser.getRoleName().contains("管理员")) {
                // 机构管理员可以看到该机构下的所有项目信息
                baseWrapper.eq(Project::getInstitutionId, currentUser.getInstitutionId());
            } else {
                // 普通科研人员只能看到自己参与的项目
                baseWrapper.and(w -> w.eq(Project::getCreateBy, userId).or().eq(Project::getLeaderId, userId));
            }
        } else {
            // 其他用户只能看到自己参与的项目
            baseWrapper.and(w -> w.eq(Project::getCreateBy, userId).or().eq(Project::getLeaderId, userId));
        }
        
        // 项目总数：非草稿状态的所有项目之和
        LambdaQueryWrapper<Project> totalWrapper = baseWrapper.clone();
        totalWrapper.ne(Project::getStatus, "draft");
        projectStats.setTotal(projectMapper.selectCount(totalWrapper));
        
        // 已立项项目：完成项目申报的项目之和
        LambdaQueryWrapper<Project> approvedWrapper = baseWrapper.clone();
        approvedWrapper.in(Project::getStatus, "approved", "running", "executing");
        projectStats.setInProgress( projectMapper.selectCount(approvedWrapper));
        
        // 已完成项目：已完成项目终验且通过的项目之和
        List<Project> allProjects = projectMapper.selectList(baseWrapper);
        long completed = allProjects.stream()
                .filter(p -> {
                    Acceptance acceptance = acceptanceMapper.selectByProjectId(p.getId());
                    return acceptance != null 
                           && "accepted".equals(acceptance.getStatus())
                           && ("excellent".equals(acceptance.getConclusion()) || "qualified".equals(acceptance.getConclusion()));
                })
                .count();
        projectStats.setCompleted( completed);
        
        // Accepted (已验收)
        LambdaQueryWrapper<Project> acceptedWrapper = baseWrapper.clone();
        acceptedWrapper.eq(Project::getWorkflowStage, "completed");
        projectStats.setAccepted( projectMapper.selectCount(acceptedWrapper));
        
        // Total budget - sum based on filtered projects
        BigDecimal totalBudget = allProjects.stream()
                .map(Project::getTotalBudget)
                .filter(budget -> budget != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // Convert to 万元 (10,000 yuan)
        projectStats.setTotalBudget(totalBudget.divide(BigDecimal.valueOf(10000), 2, BigDecimal.ROUND_HALF_UP));
        
        dashboard.setProjectStats(projectStats);
        
        // Todo items - get user's pending todos, sorted by deadline
        LambdaQueryWrapper<TodoItem> todoWrapper = new LambdaQueryWrapper<>();
        todoWrapper.eq(TodoItem::getUserId, userId)
                   .eq(TodoItem::getStatus, "pending")
                   .orderByAsc(TodoItem::getDeadline)
                   .last("LIMIT 5");
        List<TodoItem> todos = todoItemMapper.selectList(todoWrapper);
        
//        List<TodoItemDTO> todoItemDTOs = todos.stream().map(todo -> {
//            return todoItemService.getById(todo.getId());
//        }).collect(Collectors.toList());
        List<DashboardDTO.TodoItemDTO> todoItemDTOS = new ArrayList<>();
        dashboard.setTodoItems(todoItemDTOS);
        
        // Notifications - get recent 5 published notices (not user-specific)
        LambdaQueryWrapper<Notice> noticeWrapper = new LambdaQueryWrapper<>();
        noticeWrapper.eq(Notice::getStatus, "published")
                     .orderByDesc(Notice::getIsTop)
                     .orderByDesc(Notice::getPublishTime)
                     .last("LIMIT 5");
        List<Notice> notices = noticeMapper.selectList(noticeWrapper);
        
        List<DashboardDTO.NotificationDTO> notificationDTOs = notices.stream().map(notice -> {
            DashboardDTO.NotificationDTO dto = new DashboardDTO.NotificationDTO();
            dto.setId(notice.getId());
            dto.setTitle(notice.getTitle());
            dto.setType(notice.getType());
            if (notice.getPublishTime() != null) {
                dto.setDate(notice.getPublishTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            }
            return dto;
        }).collect(Collectors.toList());
        dashboard.setNotifications(notificationDTOs);
        
        // Recent projects - get user's 3 most recent projects sorted by create time
        LambdaQueryWrapper<Project> recentWrapper = (LambdaQueryWrapper<Project>) baseWrapper.clone();
        recentWrapper.orderByDesc(Project::getCreateTime).last("LIMIT 3");
        List<Project> recentProjects = projectMapper.selectList(recentWrapper);
        
        List<DashboardDTO.RecentProjectDTO> recentProjectDTOs = recentProjects.stream().map(project -> {
            DashboardDTO.RecentProjectDTO dto = new DashboardDTO.RecentProjectDTO();
            dto.setId(project.getId());
            dto.setProjectNo(project.getProjectNo());
            dto.setName(project.getName());
            dto.setStatus(project.getStatus());
            // Calculate progress based on project stage
            dto.setProgress(calculateProjectProgress(project));
            return dto;
        }).collect(Collectors.toList());
        dashboard.setRecentProjects(recentProjectDTOs);
        
        return dashboard;
    }
    
    @Override
    public DashboardDTO getDashboard(String userType) {
        DashboardDTO dashboard = new DashboardDTO();
        
        // Project statistics
        DashboardDTO.ProjectStatsDTO projectStats = new DashboardDTO.ProjectStatsDTO();
        projectStats.setTotal( projectMapper.selectCount(null));
        
        LambdaQueryWrapper<Project> inProgressWrapper = new LambdaQueryWrapper<>();
        inProgressWrapper.in(Project::getStatus, "executing", "preliminary_approved", "approved");
        projectStats.setInProgress( projectMapper.selectCount(inProgressWrapper));
        
        LambdaQueryWrapper<Project> completedWrapper = new LambdaQueryWrapper<>();
        completedWrapper.eq(Project::getStatus, "completed");
        projectStats.setCompleted(projectMapper.selectCount(completedWrapper));
        
        LambdaQueryWrapper<Project> acceptedWrapper = new LambdaQueryWrapper<>();
        acceptedWrapper.eq(Project::getWorkflowStage, "completed");
        projectStats.setAccepted(projectMapper.selectCount(acceptedWrapper));
        
        dashboard.setProjectStats(projectStats);
        
        // Todo items - get recent 5 pending todos
        LambdaQueryWrapper<TodoItem> todoWrapper = new LambdaQueryWrapper<>();
        todoWrapper.eq(TodoItem::getStatus, "pending")
                   .orderByDesc(TodoItem::getPriority)
                   .orderByAsc(TodoItem::getDeadline)
                   .last("LIMIT 5");
        List<TodoItem> todos = todoItemMapper.selectList(todoWrapper);
        
        List<DashboardDTO.TodoItemDTO> todoItemDTOs = todos.stream().map(todo -> {
            DashboardDTO.TodoItemDTO dto = new DashboardDTO.TodoItemDTO();
            dto.setId(todo.getId());
            dto.setTitle(todo.getTitle());
            dto.setType(getTypeName(todo.getType()));
            if (todo.getDeadline() != null) {
                dto.setDate(todo.getDeadline().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            }
            return dto;
        }).collect(Collectors.toList());
        dashboard.setTodoItems(todoItemDTOs);
        
        // Notifications - get recent 5 published notices
        LambdaQueryWrapper<Notice> noticeWrapper = new LambdaQueryWrapper<>();
        noticeWrapper.eq(Notice::getStatus, "published")
                     .orderByDesc(Notice::getPublishTime)
                     .last("LIMIT 5");
        List<Notice> notices = noticeMapper.selectList(noticeWrapper);
        
        List<DashboardDTO.NotificationDTO> notificationDTOs = notices.stream().map(notice -> {
            DashboardDTO.NotificationDTO dto = new DashboardDTO.NotificationDTO();
            dto.setId(notice.getId());
            dto.setTitle(notice.getTitle());
            dto.setType(notice.getType());
            if (notice.getPublishTime() != null) {
                dto.setDate(notice.getPublishTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            }
            return dto;
        }).collect(Collectors.toList());
        dashboard.setNotifications(notificationDTOs);
        
        // Recent projects - get 3 most recent projects
        LambdaQueryWrapper<Project> recentWrapper = new LambdaQueryWrapper<>();
        recentWrapper.orderByDesc(Project::getCreateTime).last("LIMIT 3");
        List<Project> recentProjects = projectMapper.selectList(recentWrapper);
        
        List<DashboardDTO.RecentProjectDTO> recentProjectDTOs = recentProjects.stream().map(project -> {
            DashboardDTO.RecentProjectDTO dto = new DashboardDTO.RecentProjectDTO();
            dto.setId(project.getId());
            dto.setProjectNo(project.getProjectNo());
            dto.setName(project.getName());
            dto.setStatus(project.getStatus());
            dto.setProgress(50); // Default progress, could be calculated based on project stage
            return dto;
        }).collect(Collectors.toList());
        dashboard.setRecentProjects(recentProjectDTOs);
        
        return dashboard;
    }
    
    // Helper method to get type display name
    private String getTypeName(String type) {
        Map<String, String> typeNames = new HashMap<>();
        typeNames.put("project_review", "项目评审");
        typeNames.put("taskbook_audit", "任务书审核");
        typeNames.put("change_audit", "变更审核");
        typeNames.put("midterm_review", "中期检查");
        typeNames.put("annual_review", "年报检查");
        typeNames.put("acceptance_review", "验收审核");
        typeNames.put("expert_audit", "专家审核");
        typeNames.put("institution_audit", "机构审核");
        return typeNames.getOrDefault(type, type);
    }
    
    @Override
    public OverviewStatisticsDTO getOverview() {
        OverviewStatisticsDTO dto = new OverviewStatisticsDTO();
        
        dto.setTotalProjects((long) projectMapper.selectCount(null).intValue());
        
        LambdaQueryWrapper<Project> executingWrapper = new LambdaQueryWrapper<>();
        executingWrapper.eq(Project::getStatus, "executing");
        dto.setExecutingProjects(projectMapper.selectCount(executingWrapper).intValue());
        
        LambdaQueryWrapper<Project> completedWrapper = new LambdaQueryWrapper<>();
        completedWrapper.eq(Project::getStatus, "completed");
        dto.setCompletedProjects((long) projectMapper.selectCount(completedWrapper).intValue());
        
        LambdaQueryWrapper<Project> pendingWrapper = new LambdaQueryWrapper<>();
        pendingWrapper.eq(Project::getStatus, "pending");
        dto.setPendingProjects((long) projectMapper.selectCount(pendingWrapper).intValue());
        
        dto.setTotalInstitutions((long) institutionMapper.selectCount(null).intValue());
        dto.setTotalExperts(expertMapper.selectCount(null).intValue());
        
        return dto;
    }
    
    @Override
    public List<TypeDistributionDTO> getProjectTypeDistribution(String year) {
        List<TypeDistributionDTO> result = new ArrayList<>();
        
        String[] types = {"youth", "major", "application", "subsidy"};
        String[] typeNames = {"青年项目", "重大项目", "应用技术类", "后补助项目"};
        
        for (int i = 0; i < types.length; i++) {
            LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Project::getProjectType, types[i]);
            if (year != null) {
                wrapper.likeRight(Project::getStartDate, year);
            }
            
            TypeDistributionDTO dto = new TypeDistributionDTO();
            dto.setType(typeNames[i]);
            dto.setCount((long) projectMapper.selectCount(wrapper).intValue());
            result.add(dto);
        }
        
        return result;
    }
    
    @Override
    public List<StatusDistributionDTO> getProjectStatusDistribution(String year) {
        List<StatusDistributionDTO> result = new ArrayList<>();
        
        String[] statuses = {"draft", "pending", "executing", "completed", "terminated"};
        String[] statusNames = {"草稿", "待审核", "执行中", "已完成", "已终止"};
        
        for (int i = 0; i < statuses.length; i++) {
            LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Project::getStatus, statuses[i]);
            if (year != null) {
                wrapper.likeRight(Project::getStartDate, year);
            }
            
            StatusDistributionDTO dto = new StatusDistributionDTO();
            dto.setStatus(statusNames[i]);
            dto.setCount((long) projectMapper.selectCount(wrapper).intValue());
            result.add(dto);
        }
        
        return result;
    }
    
    @Override
    public List<YearlyTrendDTO> getYearlyTrend(Integer years) {
        List<YearlyTrendDTO> result = new ArrayList<>();
        
        int currentYear = java.time.Year.now().getValue();
        for (int i = 0; i < (years != null ? years : 5); i++) {
            String year = String.valueOf(currentYear - i);
            LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
            wrapper.likeRight(Project::getStartDate, year);
            
            YearlyTrendDTO dto = new YearlyTrendDTO();
            dto.setYear(year);
            dto.setCount(projectMapper.selectCount(wrapper).intValue());
            result.add(dto);
        }
        
        return result;
    }
    
    @Override
    public List<InstitutionStatisticsDTO> getInstitutionStatistics(String year, Integer top) {
        List<Institution> institutions = institutionMapper.selectList(null);
        List<InstitutionStatisticsDTO> result = new ArrayList<>();
        
        for (Institution institution : institutions) {
            LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Project::getInstitutionId, institution.getId());
            if (year != null && !year.isEmpty()) {
                wrapper.likeRight(Project::getStartDate, year);
            }
            
            List<Project> projects = projectMapper.selectList(wrapper);
            
            if (projects.isEmpty()) {
                continue;
            }
            
            InstitutionStatisticsDTO dto = new InstitutionStatisticsDTO();
            dto.setInstitutionId(institution.getId());
            dto.setInstitutionName(institution.getName());
            dto.setProjectCount((long) projects.size());
            
            // Calculate total budget
            BigDecimal totalBudget = projects.stream()
                    .map(Project::getTotalBudget)
                    .filter(budget -> budget != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.setTotalBudget(totalBudget);
            
            // Count completed projects
            long completedCount = projects.stream()
                    .filter(p -> "completed".equals(p.getStatus()))
                    .count();
            dto.setCompletedCount(completedCount);
            
            result.add(dto);
        }
        
        // Sort by project count desc and limit to top N
        result = result.stream()
                .sorted((a, b) -> Long.compare(b.getProjectCount(), a.getProjectCount()))
                .limit(top != null ? top : 10)
                .collect(Collectors.toList());
        
        return result;
    }
    
    @Override
    public BudgetStatisticsDTO getBudgetStatistics(String year) {
        BudgetStatisticsDTO dto = new BudgetStatisticsDTO();
        
        dto.setTotalBudget(BigDecimal.valueOf(10000));
        dto.setUsedBudget(BigDecimal.valueOf(5000));
        dto.setRemainingBudget(BigDecimal.valueOf(5000));
        
        return dto;
    }
    
    @Override
    public List<BudgetDetailDTO> getBudgetDetails(String year, Long institutionId, Long projectId) {
        return new ArrayList<>();
    }
    
    @Override
    public AchievementStatisticsDTO getAchievementStatistics(String year) {
        AchievementStatisticsDTO dto = new AchievementStatisticsDTO();
        
        LambdaQueryWrapper<Achievement> wrapper = new LambdaQueryWrapper<>();
        if (year != null) {
            wrapper.likeRight(Achievement::getCompletionDate, year);
        }
        dto.setTotalCount((long) achievementMapper.selectCount(wrapper).intValue());
        
        String[] types = {"paper", "patent", "software", "standard", "book"};
        Map<String, Integer> distribution = new HashMap<>();
        
        for (String type : types) {
            LambdaQueryWrapper<Achievement> typeWrapper = new LambdaQueryWrapper<>();
            typeWrapper.eq(Achievement::getType, type);
            if (year != null) {
                typeWrapper.likeRight(Achievement::getCompletionDate, year);
            }
            distribution.put(type, achievementMapper.selectCount(typeWrapper).intValue());
        }
        dto.setTypeDistribution(distribution);
        
        return dto;
    }
    
    @Override
    public ExpertReviewStatisticsDTO getExpertReviewStatistics(String year) {
        ExpertReviewStatisticsDTO dto = new ExpertReviewStatisticsDTO();
        dto.setTotalReviews(0L);
        dto.setCompletedReviews(0L);
        dto.setPendingReviews(0);
        return dto;
    }
    
    @Override
    public String exportReport(String reportType, String year) {
        return "report-url";
    }
    
    private Integer calculateProjectProgress(Project project) {
        String stage = project.getWorkflowStage();
        if (stage == null) {
            return 0;
        }
        
        switch (stage) {
            case "draft": return 10;
            case "pending": return 20;
            case "approved": return 30;
            case "taskbook": return 40;
            case "executing": return 60;
            case "midterm": return 70;
            case "acceptance": return 90;
            case "completed": return 100;
            default: return 50;
        }
    }
}
