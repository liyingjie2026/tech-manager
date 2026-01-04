package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 任务书服务接口
 */
public interface TaskBookService {
    
    /**
     * 分页查询任务书列表
     */
    PageResult<TaskBookDTO> list(Integer current, Integer size, String projectName, String projectNo, String status);
    
    /**
     * 获取任务书详情
     */
    TaskBookDetailDTO getById(Long id);
    
    /**
     * 获取任务书统计数据
     */
    TaskBookStatisticsDTO getStatistics();
    
    /**
     * 保存任务书草稿
     */
    void saveDraft(Long id, TaskBookSaveDTO dto);
    
    /**
     * 导出任务书
     */
    String export(Long id, String format);
    
    /**
     * 上传已盖章任务书
     */
    void uploadSigned(Long id, MultipartFile file);
    
    /**
     * 提交任务书审核
     */
    void submit(Long id);
    
    /**
     * 审核通过任务书
     */
    void approve(Long id, TaskBookApproveDTO dto);
    
    /**
     * 审核驳回任务书
     */
    void reject(Long id, String reason);
    
    /**
     * 退回任务书修改
     */
    void returnForModification(Long id, String reason);
    
    /**
     * 获取任务列表
     */
    List<TaskItemDTO> getTasks(Long id);
    
    /**
     * 添加任务
     */
    Long addTask(Long id, TaskItemCreateDTO dto);
    
    /**
     * 更新任务
     */
    void updateTask(Long id, Long taskId, TaskItemUpdateDTO dto);
    
    /**
     * 删除任务
     */
    void deleteTask(Long id, Long taskId);
    
    /**
     * 批量删除任务
     */
    void batchDeleteTasks(Long id, List<Long> taskIds);
    
    /**
     * 保存中期检查配置
     */
    void saveMidtermConfig(Long id, MidtermConfigDTO dto);
    
    /**
     * 获取中期检查配置
     */
    MidtermConfigDTO getMidtermConfig(Long id);
}
