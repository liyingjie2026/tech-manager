package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 仪器借用记录实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_borrow_record")
public class BorrowRecord extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 仪器ID */
    private Long equipmentId;
    
    /** 借用人 */
    private Long borrowerId;
    
    /** 借用单位 */
    private Long institutionId;
    
    /** 借用原因 */
    private String reason;
    
    /** 借用时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime borrowTime;
    
    /** 预计归还时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expectedReturnTime;
    
    /** 实际归还时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actualReturnTime;
    
    /** 状态：pending-待审核 approved-已批准 borrowed-已借出 returned-已归还 rejected-已拒绝 */
    private String status;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private Long auditorId;
    
}
