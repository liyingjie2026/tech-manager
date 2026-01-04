package com.research.project.commonenum;

/**
 * 状态枚举
 */
public enum StatusEnum {

    /**
     * 草稿
     */
    DRAFT("draft", "草稿"),

    /**
     * 待审核
     */
    PENDING("pending", "待审核"),

    /**
     * 已提交
     */
    SUBMITTED("submitted", "已提交"),

    /**
     * 初审通过
     */
    PRELIMINARY_APPROVED("preliminary_approved", "初审通过"),

    /**
     * 待立项评审
     */
    PRELIMINARY_REVIEW_PENDING("preliminary_review_pending", "待立项评审"),
    
    /**
     * 立项评审通过
     */
    PRELIMINARY_REVIEW_PASSED("preliminary_review_passed", "立项评审通过"),
    
    /**
     * 立项评审未通过
     */
    PRELIMINARY_REVIEW_FAILED("preliminary_review_failed", "立项评审未通过"),

    /**
     * 已批准
     */
    APPROVED("approved", "已批准"),

    /**
     * 已驳回
     */
    REJECTED("rejected", "已驳回"),

    /**
     * 进行中
     */
    IN_PROGRESS("in_progress", "进行中"),

    /**
     * 已完成
     */
    COMPLETED("completed", "已完成"),

    /**
     * 已取消
     */
    CANCELLED("cancelled", "已取消"),

    /**
     * 已归档
     */
    ARCHIVED("archived", "已归档");


    /**
     * 状态编码
     */
    private final String code;

    /**
     * 状态描述
     */
    private final String description;

    /**
     * 构造函数
     *
     * @param code 状态编码
     * @param description 状态描述
     */
    StatusEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    /**
     * 获取状态编码
     *
     * @return 状态编码
     */
    public String getCode() {
        return code;
    }

    /**
     * 获取状态描述
     *
     * @return 状态描述
     */
    public String getDescription() {
        return description;
    }

    /**
     * 通过状态编码获取枚举实例
     *
     * @param code 状态编码
     * @return 对应的枚举实例，如果找不到则返回null
     */
    public static StatusEnum getByCode(String code) {
        for (StatusEnum status : StatusEnum.values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }

    /**
     * 通过状态描述获取枚举实例
     *
     * @param description 状态描述
     * @return 对应的枚举实例，如果找不到则返回null
     */
    public static StatusEnum getByDescription(String description) {
        for (StatusEnum status : StatusEnum.values()) {
            if (status.getDescription().equals(description)) {
                return status;
            }
        }
        return null;
    }

    /**
     * 检查是否存在指定的状态编码
     *
     * @param code 状态编码
     * @return 是否存在
     */
    public static boolean containsCode(String code) {
        return getByCode(code) != null;
    }

    /**
     * 检查是否存在指定的状态描述
     *
     * @param description 状态描述
     * @return 是否存在
     */
    public static boolean containsDescription(String description) {
        return getByDescription(description) != null;
    }

    @Override
    public String toString() {
        return this.code + ": " + this.description;
    }
}
