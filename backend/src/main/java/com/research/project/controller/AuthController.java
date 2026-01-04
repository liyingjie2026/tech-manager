package com.research.project.controller;

import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.AuthService;
import com.research.project.util.JwtUtil;
import com.research.project.vo.LoginVO;
import com.research.project.vo.UserVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 * 页面：登录页面、注册页面
 */
@Tag(name = "认证管理", description = "用户登录、注册、登出等认证相关接口")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 用户登录
     * 按钮：登录页面 - 登录按钮
     */
    @Operation(summary = "用户登录", description = "使用用户名密码登录系统")
    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO request) {
        return Result.success(authService.login(request.getUsername(), request.getPassword()));
    }

    /**
     * 手机号验证码登录
     * 按钮：登录页面 - 验证码登录按钮
     */
    @Operation(summary = "手机验证码登录")
    @PostMapping("/login/sms")
    public Result<LoginResponseDTO> loginBySms(@Valid @RequestBody SmsLoginRequestDTO request) {
        return Result.success(authService.loginBySms(request));
    }

    /**
     * 发送验证码
     * 按钮：登录页面 - 发送验证码按钮
     */
    @Operation(summary = "发送短信验证码")
    @PostMapping("/sms/send")
    public Result<Void> sendSmsCode(@RequestParam String phone) {
        authService.sendSmsCode(phone);
        return Result.success();
    }

    /**
     * 用户注册
     * 按钮：注册页面 - 提交注册按钮
     */
    @Operation(summary = "用户注册", description = "新用户注册账号")
    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.register(request);
        return Result.success();
    }

    /**
     * 机构注册
     * 按钮：注册页面 - 机构入驻申请按钮
     */
    @Operation(summary = "机构注册", description = "科研机构入驻申请")
    @PostMapping("/register/institution")
    public Result<Void> registerInstitution(@Valid @RequestBody InstitutionRegisterDTO request) {
        authService.registerInstitution(request);
        return Result.success();
    }

    /**
     * 用户登出
     * 按钮：顶部导航 - 退出登录按钮
     */
    @Operation(summary = "用户登出")
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader("Authorization") String token) {
        String actualToken = token.replace("Bearer ", "");
        authService.logout(actualToken);
        return Result.success();
    }

    /**
     * 获取当前用户信息
     * 按钮：自动加载 - 页面初始化
     */
    @Operation(summary = "获取当前用户信息")
    @GetMapping("/me")
    public Result<UserVO> getCurrentUser(@RequestHeader("Authorization") String token) {
        return Result.success(authService.getCurrentUser());
    }

    /**
     * 修改密码
     * 按钮：个人中心 - 修改密码按钮
     */
    @Operation(summary = "修改密码")
    @PostMapping("/password/change")
    public Result<Void> changePassword(@Valid @RequestBody ChangePasswordDTO request) {
        authService.changePassword(request);
        return Result.success();
    }

    /**
     * 重置密码
     * 按钮：忘记密码页面 - 重置密码按钮
     */
    @Operation(summary = "重置密码")
    @PostMapping("/password/reset")
    public Result<Void> resetPassword(@Valid @RequestBody ResetPasswordDTO request) {
        authService.resetPassword(request);
        return Result.success();
    }

    /**
     * 刷新Token
     * 按钮：自动调用 - Token即将过期时
     */
    @Operation(summary = "刷新Token")
    @PostMapping("/token/refresh")
    public Result<LoginResponseDTO> refreshToken(@RequestHeader("Authorization") String token) {
        return Result.success(authService.refreshToken(token));
    }
}
