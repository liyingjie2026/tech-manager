package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.dto.RoleCreateDTO;
import com.research.project.dto.RoleDTO;
import com.research.project.dto.RoleUpdateDTO;
import com.research.project.entity.Role;
import com.research.project.entity.RolePermission;
import com.research.project.mapper.RoleMapper;
import com.research.project.mapper.RolePermissionMapper;
import com.research.project.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色服务实现类
 */
@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    
    private final RoleMapper roleMapper;
    private final RolePermissionMapper rolePermissionMapper;
    
    @Override
    public PageResult<RoleDTO> list(Integer page, Integer size, String keyword) {
        Page<Role> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Role::getRoleName, keyword)
                    .or().like(Role::getRoleCode, keyword));
        }
        wrapper.orderByAsc(Role::getSort)
                .orderByDesc(Role::getCreateTime);
        
        IPage<Role> pageResult = roleMapper.selectPage(pageParam, wrapper);
        
        List<RoleDTO> dtoList = pageResult.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(page.longValue(), size.longValue(), pageResult.getTotal(), dtoList);
    }
    
    @Override
    public List<RoleDTO> listAll() {
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Role::getSort);
        
        List<Role> roles = roleMapper.selectList(wrapper);
        return roles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public RoleDTO getById(Long id) {
        Role role = roleMapper.selectById(id);
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }
        return convertToDTO(role);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(RoleCreateDTO dto) {
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Role::getRoleCode, dto.getRoleCode());
        if (roleMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("角色编码已存在");
        }
        
        Role role = new Role();
        BeanUtils.copyProperties(dto, role);
        role.setCreateTime(LocalDateTime.now());
        role.setUpdateTime(LocalDateTime.now());
        
        roleMapper.insert(role);
        return role.getId();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, RoleUpdateDTO dto) {
        Role role = roleMapper.selectById(id);
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }
        
        if (dto.getRoleCode() != null && !dto.getRoleCode().equals(role.getRoleCode())) {
            LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Role::getRoleCode, dto.getRoleCode());
            wrapper.ne(Role::getId, id);
            if (roleMapper.selectCount(wrapper) > 0) {
                throw new RuntimeException("角色编码已存在");
            }
        }
        
        BeanUtils.copyProperties(dto, role, "id", "createTime");
        role.setUpdateTime(LocalDateTime.now());
        
        roleMapper.updateById(role);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Role role = roleMapper.selectById(id);
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }
        
        LambdaQueryWrapper<RolePermission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermission::getRoleId, id);
        rolePermissionMapper.delete(wrapper);
        
        roleMapper.deleteById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignPermissions(Long roleId, List<Long> permissionIds) {
        LambdaQueryWrapper<RolePermission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermission::getRoleId, roleId);
        rolePermissionMapper.delete(wrapper);
        
        if (permissionIds != null && !permissionIds.isEmpty()) {
            for (Long permissionId : permissionIds) {
                RolePermission rolePermission = new RolePermission();
                rolePermission.setRoleId(roleId);
                rolePermission.setPermissionId(permissionId);
                rolePermission.setCreateTime(LocalDateTime.now());
                rolePermissionMapper.insert(rolePermission);
            }
        }
    }
    
    @Override
    public List<Long> getPermissions(Long roleId) {
        LambdaQueryWrapper<RolePermission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermission::getRoleId, roleId);
        
        List<RolePermission> rolePermissions = rolePermissionMapper.selectList(wrapper);
        return rolePermissions.stream()
                .map(RolePermission::getPermissionId)
                .collect(Collectors.toList());
    }
    
    private RoleDTO convertToDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        BeanUtils.copyProperties(role, dto);
        return dto;
    }
}
