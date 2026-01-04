package com.research.project.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.research.project.entity.*;
import com.research.project.mapper.*;
import com.research.project.service.AuthService;
import com.research.project.service.RoleService;
import com.research.project.dto.*;
import com.research.project.util.SecurityUtils;
import com.research.project.vo.LoginVO;
import com.research.project.vo.RoleVO;
import com.research.project.vo.UserVO;
import com.research.project.util.JwtUtil;
import com.research.project.util.RedisUtil;
import com.research.project.constant.RedisConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl extends ServiceImpl<UserMapper, User> implements AuthService {

    private final UserMapper userMapper;
    private final PermissionMapper permissionMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final RedisUtil redisUtil;
    private final RoleMapper roleMapper;
    private final ExpertMapper expertMapper;

    @Override
    public LoginVO login(String username, String password) {
        System.out.println("[v0] 登录请求 - 用户名: " + username);

        User user = userMapper.selectByUsername(username);

        if (user == null) {
            System.out.println("[v0] 用户不存在: " + username);
            throw new RuntimeException("用户名或密码错误");
        }

        System.out.println("[v0] 找到用户: " + user.getRealName());

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("[v0] 密码验证结果: " + passwordMatches);

        if (!passwordMatches) {
            throw new RuntimeException("用户名或密码错误");
        }

        if (user.getStatus() != 1) {
            throw new RuntimeException("账号已被禁用");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRealName());
        System.out.println("[v0] 生成Token成功: " + token);

        LoginVO loginVO = new LoginVO();
        loginVO.setToken(token);
        loginVO.setExpiresIn(86400000L); // 24小时

        List<Permission> permissions = permissionMapper.selectByUserId(user.getId());
        List<String> permissionCodes = permissions.stream()
                .map(Permission::getPermissionCode)
                .collect(Collectors.toList());
        loginVO.setPermissions(permissionCodes);

        UserVO userVO = new UserVO();
        Role role = roleMapper.selectById(user.getRoleId());

        RoleVO roleVO = new RoleVO();
        BeanUtils.copyProperties(role, roleVO);
        List<RoleVO> roleVOS = new ArrayList<>();
        roleVOS.add(roleVO);
        userVO.setRoles(roleVOS);

        Expert expert = expertMapper.selectByUserId(user.getId());
        if (expert != null) {
            userVO.setExpertId(expert.getId());
            userVO.setExpertName(expert.getName());
            System.out.println("[v0] 关联专家信息 - ID: " + expert.getId() + ", 姓名: " + expert.getName());
        }

        BeanUtils.copyProperties(user, userVO);
        loginVO.setUser(userVO);

        String redisKey = RedisConstants.LOGIN_USER_KEY + token;
        redisUtil.set(redisKey, JSON.toJSONString(loginVO), RedisConstants.LOGIN_USER_TTL);
        System.out.println("[v0] 用户信息已存入Redis: " + redisKey);

        String permissionKey = RedisConstants.USER_PERMISSION_KEY + user.getId();
        redisUtil.set(permissionKey, permissionCodes, RedisConstants.LOGIN_USER_TTL);
        System.out.println("[v0] 用户权限已存入Redis: " + permissionKey);

        return loginVO;
    }

    @Override
    public LoginResponseDTO loginBySms(SmsLoginRequestDTO request) {
        User user = userMapper.selectByPhone(request.getPhone());

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRealName());

        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setTokenType("Bearer");
        response.setExpiresIn(86400L);
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setRealName(user.getRealName());

        return response;
    }

    @Override
    public void sendSmsCode(String phone) {
        System.out.println("发送验证码到手机号: " + phone);
    }

    @Override
    public void register(RegisterRequestDTO request) {
        User existingUser = userMapper.selectByUsername(request.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRealName(request.getRealName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setStatus(0); // 待审核
        userMapper.insert(user);
    }

    @Override
    public void registerInstitution(InstitutionRegisterDTO request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRealName(request.getName()); // 使用name而不是getInstitutionName
        user.setPhone(request.getContactPhone());
        user.setEmail(request.getContactEmail());
        user.setStatus(0);
        userMapper.insert(user);
    }

    @Override
    public void logout(String token) {
        System.out.println("[v0] 用户登出，清除Redis缓存: " + token);
        String redisKey = RedisConstants.LOGIN_USER_KEY + token;
        redisUtil.del(redisKey);
        
        // 从token中获取userId，删除权限缓存
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            String permissionKey = RedisConstants.USER_PERMISSION_KEY + userId;
            redisUtil.del(permissionKey);
            System.out.println("[v0] 已清除用户权限缓存");
        } catch (Exception e) {
            System.out.println("[v0] 清除权限缓存失败: " + e.getMessage());
        }
    }

    @Override
    public UserVO getCurrentUser() {
        Long userId = SecurityUtils.getCurrentUserId();
        
        String permissionKey = RedisConstants.USER_PERMISSION_KEY + userId;
        if (redisUtil.hasKey(permissionKey)) {
            System.out.println("[v0] 从Redis获取用户权限");
        }
        
        User user = userMapper.selectById(userId);

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        UserVO userVO = new UserVO();
        Role role = roleMapper.selectById(user.getRoleId());

        RoleVO roleVO = new RoleVO();
        BeanUtils.copyProperties(role, roleVO);
        List<RoleVO> roleVOS = new ArrayList<>();
        roleVOS.add(roleVO);
        userVO.setRoles(roleVOS);

        Expert expert = expertMapper.selectByUserId(user.getId());
        if (expert != null) {
            userVO.setExpertId(expert.getId());
            userVO.setExpertName(expert.getName());
            System.out.println("[v0] 关联专家信息 - ID: " + expert.getId() + ", 姓名: " + expert.getName());
        }

        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

    @Override
    public void changePassword(ChangePasswordDTO request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("原密码错误");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userMapper.updateById(user);
    }

    @Override
    public void resetPassword(ResetPasswordDTO request) {
        User user = userMapper.selectByPhone(request.getPhone());

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userMapper.updateById(user);
    }

    @Override
    public LoginResponseDTO refreshToken(String refreshToken) {
        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        User user = userMapper.selectById(userId);

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        String newToken = jwtUtil.generateToken(user.getId(), user.getRealName());

        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(newToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(86400L);
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setRealName(user.getRealName());

        return response;
    }
}
