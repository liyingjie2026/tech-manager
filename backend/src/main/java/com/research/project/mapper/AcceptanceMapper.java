package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Acceptance;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 验收Mapper接口
 */
@Mapper
public interface AcceptanceMapper extends BaseMapper<Acceptance> {
    
    /**
     * 根据项目ID查询验收记录
     */
    Acceptance selectByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 更新验收状态 - 对应Controller: submit(), withdraw()
     */
    int updateStatus(@Param("id") Long id, @Param("status") String status);
    
    /**
     * 更新审核信息 - 对应Controller: approve(), reject(), audit()
     */
    int updateAudit(@Param("id") Long id, @Param("conclusion") String conclusion, @Param("comment") String comment);
    
    /**
     * 发起专家评审 - 对应Controller: startReview()
     */
    int startExpertReview(@Param("id") Long id, @Param("expertIds") List<Long> expertIds, @Param("deadline") String deadline);
    
    /**
     * 添加附件 - 对应Controller: addAttachments()
     */
    int insertAttachments(@Param("id") Long id, @Param("fileIds") List<Long> fileIds);
    
    /**
     * 获取统计数据 - 对应Controller: getStatistics()
     */
    Map<String, Object> selectStatistics();
}
