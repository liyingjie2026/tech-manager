package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

/**
 * 项目Mapper接口
 */
@Mapper
public interface ProjectMapper extends BaseMapper<Project> {
    
    /**
     * 分页查询项目列表 - 对应Controller: list()
     */
    IPage<Project> selectPageList(Page<Project> page, @Param("keyword") String keyword, 
                                   @Param("projectType") String projectType,
                                   @Param("status") String status,
                                   @Param("institutionId") Long institutionId,
                                   @Param("startDate") String startDate,
                                   @Param("endDate") String endDate);
    
    /**
     * 获取我的项目列表 - 对应Controller: myProjects()
     */
    List<Project> selectMyProjects(@Param("userId") Long userId, @Param("status") String status);
    
    /**
     * 根据项目编号查询
     */
    Project selectByProjectNo(@Param("projectNo") String projectNo);
    
    /**
     * 根据机构ID查询
     */
    List<Project> selectByInstitutionId(@Param("institutionId") Long institutionId);
    
    /**
     * 根据负责人ID查询
     */
    List<Project> selectByLeaderId(@Param("leaderId") Long leaderId);
    
    /**
     * 更新项目状态 - 对应Controller: submit(), withdraw(), approve(), reject()
     */
    int updateStatus(@Param("id") Long id, @Param("status") String status);
    
    /**
     * 审核项目 - 对应Controller: approve(), reject()
     */
    int updateAuditInfo(@Param("id") Long id, @Param("auditStatus") String auditStatus,
                        @Param("auditComment") String auditComment, @Param("auditBy") Long auditBy,
                        @Param("status") String status);
    
    /**
     * 批量更新状态 - 对应Controller: batchApprove(), batchReject()
     */
    int batchUpdateStatus(@Param("ids") List<Long> ids, @Param("status") String status,
                          @Param("auditStatus") String auditStatus, @Param("auditComment") String auditComment,
                          @Param("auditBy") Long auditBy);
    
    /**
     * 获取项目成员列表
     */
    List<Object> selectMembersByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 添加项目成员
     */
    int insertMember(Map<String, Object> member);
    
    /**
     * 更新项目成员
     */
    int updateMember(Map<String, Object> member);
    
    /**
     * 删除项目成员
     */
    int deleteMember(@Param("memberId") Long memberId, @Param("projectId") Long projectId);
    
    /**
     * 获取项目预算
     */
    List<Object> selectBudgetByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 保存项目预算
     */
    int insertBudget(Map<String, Object> budget);
    
    /**
     * 删除项目预算
     */
    int deleteBudgetByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 获取项目附件
     */
    List<Object> selectAttachmentsByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 上传项目附件
     */
    int insertAttachment(Map<String, Object> attachment);
    
    /**
     * 删除项目附件
     */
    int deleteAttachment(@Param("attachmentId") Long attachmentId, @Param("projectId") Long projectId);
    
    /**
     * 获取附件详情
     */
    Object selectAttachmentById(@Param("id") Long id);
    
    /**
     * 获取项目进度计划
     */
    List<Object> selectSchedulesByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 添加进度计划项
     */
    int insertSchedule(Map<String, Object> schedule);
    
    /**
     * 更新进度计划项
     */
    int updateSchedule(Map<String, Object> schedule);
    
    /**
     * 删除进度计划项
     */
    int deleteSchedule(@Param("scheduleId") Long scheduleId, @Param("projectId") Long projectId);
    
    /**
     * 批量保存进度计划
     */
    int deleteSchedulesByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 获取绩效指标
     */
    Object selectPerformanceByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 保存绩效指标
     */
    int insertPerformance(Map<String, Object> performance);
    
    /**
     * 更新查重率
     */
    int updateDuplicateRate(@Param("id") Long id, @Param("duplicateRate") Double duplicateRate);
    
    /**
     * 获取查重结果
     */
    Object selectDuplicateResult(@Param("projectId") Long projectId);
    
    /**
     * 保存查重结果
     */
    int insertDuplicateResult(Map<String, Object> result);
    
    /**
     * 获取项目统计数据
     */
    Map<String, Object> selectStatistics();
    
    /**
     * 按类型统计项目数量
     */
    List<Map<String, Object>> selectCountByType();
    
    /**
     * 按状态统计项目数量
     */
    List<Map<String, Object>> selectCountByStatus();
    
    /**
     * 按年份统计项目数量
     */
    List<Map<String, Object>> selectCountByYear(@Param("years") Integer years);
    
    /**
     * 按机构统计项目数量
     */
    List<Map<String, Object>> selectCountByInstitution(@Param("top") Integer top);
}
