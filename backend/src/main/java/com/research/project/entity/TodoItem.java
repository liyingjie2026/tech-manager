package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@TableName("sys_todo_item")
public class TodoItem extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 待办人ID */
    private Long userId;
    
    /** 待办人姓名 */
    private String userName;
    
    /** 角色：expert-专家 institution-机构 supervisor-监管 */
    private String role;
    
    /** 待办标题 */
    private String title;
    
    /** 待办描述 */
    private String description;
    
    /** 待办类型 */
    private String type;
    
    /** 业务ID */
    private Long businessId;
    
    /** 业务编号 */
    private String businessNo;
    
    /** 业务类型 */
    private String businessType;
    
    /** 优先级：urgent-紧急 high-高 normal-普通 low-低 */
    private String priority;
    
    /** 状态：pending-待处理 processing-处理中 completed-已完成 cancelled-已取消 */
    private String status;
    
    /** 截止时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deadline;
    
    /** 跳转链接 */
    private String linkUrl;
    
    /** 完成人 */
    private String completedBy;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completedTime;
    
}
