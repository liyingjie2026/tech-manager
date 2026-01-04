package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.*;

import java.util.List;

/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 分页查询用户列表
     */
    PageResult<UserDTO> list(Integer page, Integer size, String keyword, String status, Long roleId, Long institutionId);
    
    /**
     * 获取用户详情
     */
    UserDTO getById(Long id);
    
    /**
     * 新增用户
     */
    String create(UserCreateDTO dto);
    
    /**
     * 更新用户
     */
    void update(Long id, UserUpdateDTO dto);
    
    /**
     * 删除用户
     */
    void delete(Long id);
    
    /**
     * 批量删除用户
     */
    void batchDelete(List<Long> ids);
    
    /**
     * 启用用户
     */
    void enable(Long id);
    
    /**
     * 禁用用户
     */
    void disable(Long id);
    
    /**
     * 重置用户密码
     */
    String resetPassword(Long id);
    
    /**
     * 分配角色
     */
    void assignRoles(Long id, List<Long> roleIds);
    
    /**
     * 审核用户
     */
    void audit(Long id, AuditDTO dto);
    
    /**
     * 导出用户列表
     */
    String export(String keyword, String status);
}
