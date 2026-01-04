package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.entity.Achievement;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 成果Mapper接口
 */
@Mapper
public interface AchievementMapper extends BaseMapper<Achievement> {
    
    /**
     * 根据项目ID查询成果列表
     */
    List<Achievement> selectByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 添加附件 - 对应Controller: addAttachments()
     */
    int insertAttachments(@Param("id") Long id, @Param("fileIds") List<Long> fileIds);
    
    /**
     * 分页查询成果转化 - 对应Controller: listTransformations()
     */
    IPage<Object> selectTransformations(Page<Object> page);
    
    /**
     * 创建成果转化 - 对应Controller: createTransformation()
     */
    int insertTransformation(@Param("id") Long id, @Param("dto") Object dto);
    
    /**
     * 更新成果转化 - 对应Controller: updateTransformation()
     */
    int updateTransformation(@Param("transformationId") Long transformationId, @Param("dto") Object dto);
    
    /**
     * 更新成果转化状态 - 对应Controller: submitTransformation()
     */
    int updateTransformationStatus(@Param("transformationId") Long transformationId, @Param("status") String status);
    
    /**
     * 审核成果转化 - 对应Controller: auditTransformation()
     */
    int updateTransformationAudit(@Param("transformationId") Long transformationId, @Param("status") String status, @Param("opinion") String opinion);
    
    /**
     * 更新发布状态 - 对应Controller: publishAchievement(), unpublishAchievement()
     */
    int updatePublishStatus(@Param("id") Long id, @Param("isPublic") Boolean isPublic);
    
    /**
     * 分页查询已发布成果 - 对应Controller: listPublished()
     */
    IPage<Achievement> selectPublishedPage(Page<Achievement> page, @Param("keyword") String keyword);
    
    /**
     * 根据成果ID查询附件列表
     */
    List<Object> selectAttachmentsByAchievementId(@Param("achievementId") Long achievementId);
    
    /**
     * 根据成果ID查询转化列表
     */
    List<Object> selectTransformationsByAchievementId(@Param("achievementId") Long achievementId);
    
    /**
     * 分页查询已发布成果
     */
    List<Achievement> selectPublishedByPage(@Param("page") Integer page, @Param("size") Integer size, @Param("field") String field);
    
    /**
     * 查询已发布成果总数
     */
    long selectPublishedTotalCount(@Param("field") String field);
}
