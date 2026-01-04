package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.research.project.dto.*;
import com.research.project.entity.Permission;
import com.research.project.entity.RolePermission;
import com.research.project.mapper.PermissionMapper;
import com.research.project.mapper.RolePermissionMapper;
import com.research.project.service.PermissionService;
import com.research.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 权限服务实现类
 */
@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {
    
    private final PermissionMapper permissionMapper;
    private final RolePermissionMapper rolePermissionMapper;
    
    @Override
    public List<PermissionTreeDTO> getTree() {
        List<Permission> allPermissions = permissionMapper.selectList(null);
        return buildPermissionTree(allPermissions, null);
    }
    
    private List<PermissionTreeDTO> buildPermissionTree(List<Permission> permissions, Long parentId) {
        List<PermissionTreeDTO> tree = new ArrayList<>();
        for (Permission permission : permissions) {
            if ((parentId == null && permission.getParentId() == null) ||
                (parentId != null && parentId.equals(permission.getParentId()))) {
                PermissionTreeDTO node = new PermissionTreeDTO();
                node.setId(permission.getId());
                node.setName(permission.getPermissionName());
                node.setCode(permission.getPermissionCode());
                node.setType(permission.getType());
                node.setChildren(buildPermissionTree(permissions, permission.getId()));
                tree.add(node);
            }
        }
        return tree;
    }
    
    @Override
    public List<PagePermissionDTO> getPages() {
        LambdaQueryWrapper<Permission> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(Permission::getType, "PAGE", "menu");
        List<Permission> pages = permissionMapper.selectList(wrapper);
        return pages.stream()
                .map(this::convertToPageDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ButtonPermissionDTO> getPageButtons(Long pageId) {
        LambdaQueryWrapper<Permission> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(Permission::getType, "BUTTON", "button")
               .eq(Permission::getParentId, pageId);
        List<Permission> buttons = permissionMapper.selectList(wrapper);
        return buttons.stream()
                .map(this::convertToButtonDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public RolePermissionDTO getRolePermissions(Long roleId) {
        LambdaQueryWrapper<RolePermission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermission::getRoleId, roleId);
        List<RolePermission> rolePermissions = rolePermissionMapper.selectList(wrapper);
        List<Long> permissionIds = rolePermissions.stream()
                .map(RolePermission::getPermissionId)
                .collect(Collectors.toList());
        
        RolePermissionDTO dto = new RolePermissionDTO();
        dto.setRoleId(roleId);
        dto.setPermissionIds(permissionIds);
        return dto;
    }
    
    @Override
    @Transactional
    public void saveRolePermissions(Long roleId, RolePermissionSaveDTO dto) {
        rolePermissionMapper.deleteByRoleId(roleId);
        
        if (dto.getPermissionIds() != null && !dto.getPermissionIds().isEmpty()) {
            for (Long permissionId : dto.getPermissionIds()) {
                RolePermission rp = new RolePermission();
                rp.setRoleId(roleId);
                rp.setPermissionId(permissionId);
                rp.setCreateTime(LocalDateTime.now());
                rolePermissionMapper.insert(rp);
            }
        }
    }
    
    @Override
    @Transactional
    public Long createPage(PagePermissionCreateDTO dto) {
        Permission permission = new Permission();
        permission.setPermissionName(dto.getName());
        permission.setPermissionCode(dto.getCode());
        permission.setType("PAGE");
        permission.setParentId(dto.getParentId());
        permission.setSort(dto.getSort());
        permission.setPath(dto.getPath());
        permission.setComponent(dto.getComponent());
        permission.setIcon(dto.getIcon());
        permission.setStatus(1);
        permission.setCreateTime(LocalDateTime.now());
        permissionMapper.insert(permission);
        return permission.getId();
    }
    
    @Override
    @Transactional
    public Long createButton(Long pageId, ButtonPermissionCreateDTO dto) {
        Permission permission = new Permission();
        permission.setPermissionName(dto.getName());
        permission.setPermissionCode(dto.getCode());
        permission.setType("BUTTON");
        permission.setParentId(pageId);
        permission.setSort(dto.getSort());
        permission.setStatus(1);
        permission.setCreateTime(LocalDateTime.now());
        permissionMapper.insert(permission);
        return permission.getId();
    }
    
    @Override
    @Transactional
    public void updateButton(Long buttonId, ButtonPermissionUpdateDTO dto) {
        Permission permission = permissionMapper.selectById(buttonId);
        if (permission != null) {
            if (dto.getName() != null) {
                permission.setPermissionName(dto.getName());
            }
            if (dto.getCode() != null) {
                permission.setPermissionCode(dto.getCode());
            }
            if (dto.getSort() != null) {
                permission.setSort(dto.getSort());
            }
            permission.setUpdateTime(LocalDateTime.now());
            permissionMapper.updateById(permission);
        }
    }
    
    @Override
    @Transactional
    public void deleteButton(Long buttonId) {
        permissionMapper.deleteById(buttonId);
        rolePermissionMapper.deleteByPermissionId(buttonId);
    }
    
    @Override
    public Boolean checkPermission(String pageCode, String buttonCode) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return false;
        }
        
        List<Permission> userPermissions = permissionMapper.selectByUserId(userId);
        
        return userPermissions.stream()
                .anyMatch(p -> buttonCode.equals(p.getPermissionCode()));
    }
    
    @Override
    public UserPermissionsDTO getMyPermissions() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<Permission> permissions = permissionMapper.selectByUserId(userId);
        
        UserPermissionsDTO dto = new UserPermissionsDTO();
        dto.setPages(permissions.stream()
                .filter(p -> "PAGE".equals(p.getType()) || "menu".equals(p.getType()))
                .map(Permission::getPermissionCode)
                .collect(Collectors.toList()));
        dto.setButtons(permissions.stream()
                .filter(p -> "BUTTON".equals(p.getType()) || "button".equals(p.getType()))
                .map(Permission::getPermissionCode)
                .collect(Collectors.toList()));
        return dto;
    }
    
    private PagePermissionDTO convertToPageDTO(Permission permission) {
        PagePermissionDTO dto = new PagePermissionDTO();
        dto.setId(permission.getId());
        dto.setName(permission.getPermissionName());
        dto.setCode(permission.getPermissionCode());
        dto.setPath(permission.getPath());
        dto.setIcon(permission.getIcon());
        dto.setSort(permission.getSort());
        dto.setParentId(permission.getParentId());
        dto.setEnabled(permission.getStatus() == 1);
        return dto;
    }
    
    private ButtonPermissionDTO convertToButtonDTO(Permission permission) {
        ButtonPermissionDTO dto = new ButtonPermissionDTO();
        dto.setId(permission.getId());
        dto.setName(permission.getPermissionName());
        dto.setCode(permission.getPermissionCode());
        dto.setPageId(permission.getParentId());
        dto.setSort(permission.getSort());
        return dto;
    }
}
