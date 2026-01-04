package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 机构注册请求DTO
 */
@Data
public class InstitutionRegisterDTO {
    /**
     * 机构名称
     */
    @NotBlank(message = "机构名称不能为空")
    @Size(max = 200, message = "机构名称长度不能超过200个字符")
    private String name;
    
    /**
     * 统一社会信用代码
     */
    @NotBlank(message = "统一社会信用代码不能为空")
    @Pattern(regexp = "^[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}$", message = "统一社会信用代码格式不正确")
    private String creditCode;
    
    /**
     * 机构类型
     */
    @NotBlank(message = "机构类型不能为空")
    private String type;
    
    
    /**
     * 法定代表人
     */
    @NotBlank(message = "法定代表人不能为空")
    private String legalPerson;
    
    /**
     * 联系人
     */
    @NotBlank(message = "联系人不能为空")
    private String contactPerson;
    
    /**
     * 联系电话
     */
    @NotBlank(message = "联系电话不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "联系电话格式不正确")
    private String contactPhone;
    
    /**
     * 联系邮箱 - Changed from email to contactEmail to match Entity
     */
    @Email(message = "邮箱格式不正确")
    private String contactEmail;
    
    /**
     * 机构地址
     */
    @NotBlank(message = "机构地址不能为空")
    private String address;
    
    /**
     * 营业执照 - Changed from businessLicenseId to businessLicense to match Entity
     */
    @NotBlank(message = "营业执照不能为空")
    private String businessLicense;
    
    /**
     * 机构简介
     */
    private String description;
    
    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 4, max = 20, message = "用户名长度必须在4-20个字符之间")
    private String username;
    
    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20个字符之间")
    private String password;
    
    /**
     * 验证码
     */
    @NotBlank(message = "验证码不能为空")
    private String captcha;
}
