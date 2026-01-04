package com.research.project.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


/**
 * 安全工具类
 */
public class SecurityUtils {
    
    /**
     * 获取当前登录用户ID
     */
    public static Long getCurrentUserId() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String userId = request.getHeader("X-User-Id");
                if (userId != null && !userId.isEmpty()) {
                    return Long.parseLong(userId);
                }
            }
        } catch (Exception e) {
            // Fallback to SecurityContext
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return 1L; // Default development user ID
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            // In production: extract user ID from UserDetails implementation
            // UserDetailsImpl user = (UserDetailsImpl) principal;
            // return user.getId();
            return 1L;
        }
        return 1L;
    }
    
    /**
     * 获取当前登录用户名
     */
    public static String getCurrentUserName() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String userName = request.getHeader("X-User-Name");
                if (userName != null && !userName.isEmpty()) {
                    return userName;
                }
            }
        } catch (Exception e) {
            // Fallback to SecurityContext
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "系统";
        }
        return authentication.getName();
    }
    
    /**
     * 获取当前登录用户
     */
    public static UserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return (UserDetails) principal;
        }
        return null;
    }
    
    /**
     * 判断当前用户是否有某个角色
     */
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role));
    }
    
    /**
     * 判断当前用户是否有某个权限
     */
    public static boolean hasPermission(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(permission));
    }
}
