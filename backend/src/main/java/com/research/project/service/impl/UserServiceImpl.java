package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.User;
import com.research.project.mapper.UserMapper;
import com.research.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户服务实现类
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public PageResult<UserDTO> list(Integer page, Integer size, String keyword, String status, Long roleId, Long institutionId) {
        Page<User> userPage = new Page<>(page, size);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(User::getUsername, keyword)
                    .or().like(User::getRealName, keyword)
                    .or().like(User::getPhone, keyword));
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(User::getStatus, Integer.parseInt(status));
        }
        if (roleId != null) {
            wrapper.eq(User::getRoleId, roleId);
        }
        if (institutionId != null) {
            wrapper.eq(User::getInstitutionId, institutionId);
        }
        wrapper.orderByDesc(User::getCreateTime);
        
        IPage<User> result = baseMapper.selectPage(userPage, wrapper);
        List<UserDTO> dtoList = result.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(
                Long.valueOf(page),
                Long.valueOf(size),
                result.getTotal(),
                dtoList
        );
    }
    
    @Override
    public UserDTO getById(Long id) {
        User user = baseMapper.selectById(id);
        return user != null ? convertToDTO(user) : null;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String create(UserCreateDTO dto) {
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setStatus(1); // 默认启用
        baseMapper.insert(user);
        return String.valueOf(user.getId());
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, UserUpdateDTO dto) {
        User user = baseMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        BeanUtils.copyProperties(dto, user);
        baseMapper.updateById(user);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        baseMapper.deleteById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        baseMapper.deleteBatchIds(ids);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enable(Long id) {
        User user = baseMapper.selectById(id);
        if (user != null) {
            user.setStatus(1);
            baseMapper.updateById(user);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disable(Long id) {
        User user = baseMapper.selectById(id);
        if (user != null) {
            user.setStatus(0);
            baseMapper.updateById(user);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String resetPassword(Long id) {
        User user = baseMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        String newPassword = "123456";
        user.setPassword(passwordEncoder.encode(newPassword));
        baseMapper.updateById(user);
        return newPassword;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignRoles(Long id, List<Long> roleIds) {
        User user = baseMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 如果只分配一个角色，设置到roleId字段
        if (roleIds != null && !roleIds.isEmpty()) {
            user.setRoleId(roleIds.get(0));
            baseMapper.updateById(user);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void audit(Long id, AuditDTO dto) {
        User user = baseMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 根据审核结果设置状态
        if ("approved".equals(dto.getResult())) {
            user.setStatus(1); // 启用
        } else if ("rejected".equals(dto.getResult())) {
            user.setStatus(0); // 禁用
        }
        baseMapper.updateById(user);
    }
    
    @Override
    public String export(String keyword, String status) {
        // 导出功能暂时返回空字符串，实际应生成Excel文件
        return "";
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto);
        return dto;
    }
    
    // Legacy methods kept for backward compatibility
    public User getByUsername(String username) {
        return baseMapper.selectByUsername(username);
    }
    
    public User getByPhone(String phone) {
        return baseMapper.selectByPhone(phone);
    }
    
    public IPage<User> pageUsers(Integer current, Integer size, String keyword, Long institutionId, Long roleId, Integer status) {
        Page<User> page = new Page<>(current, size);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(User::getUsername, keyword)
                    .or().like(User::getRealName, keyword)
                    .or().like(User::getPhone, keyword));
        }
        if (institutionId != null) {
            wrapper.eq(User::getInstitutionId, institutionId);
        }
        if (roleId != null) {
            wrapper.eq(User::getRoleId, roleId);
        }
        if (status != null) {
            wrapper.eq(User::getStatus, status);
        }
        wrapper.orderByDesc(User::getCreateTime);
        
        return baseMapper.selectPage(page, wrapper);
    }
    
    public List<User> listByInstitutionId(Long institutionId) {
        return baseMapper.selectByInstitutionId(institutionId);
    }
    
    public boolean updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = baseMapper.selectById(userId);
        if (user == null) {
            return false;
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        return baseMapper.updateById(user) > 0;
    }
    
    public boolean updateStatus(Long userId, Integer status) {
        User user = baseMapper.selectById(userId);
        if (user == null) {
            return false;
        }
        user.setStatus(status);
        return baseMapper.updateById(user) > 0;
    }
}
