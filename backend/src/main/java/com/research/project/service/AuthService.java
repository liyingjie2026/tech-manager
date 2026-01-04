package com.research.project.service;

import com.research.project.dto.*;
import com.research.project.vo.LoginVO;
import com.research.project.vo.UserVO;

public interface AuthService {
    LoginVO login(String username, String password);
    LoginResponseDTO loginBySms(SmsLoginRequestDTO request);
    void sendSmsCode(String phone);
    void register(RegisterRequestDTO request);
    void registerInstitution(InstitutionRegisterDTO request);
    void logout(String token);
    UserVO getCurrentUser();
    void changePassword(ChangePasswordDTO request);
    void resetPassword(ResetPasswordDTO request);
    LoginResponseDTO refreshToken(String refreshToken);
}
