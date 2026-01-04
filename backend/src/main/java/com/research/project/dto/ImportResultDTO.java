package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 导入结果DTO
 */
@Data
public class ImportResultDTO {
    private Integer total;
    private Integer success;
    private Integer failed;
    private List<String> errors;
    private String message;
    
    public void setSuccessCount(Integer count) {
        this.success = count;
    }
    
    public void setFailCount(Integer count) {
        this.failed = count;
    }
    
    public Integer getSuccessCount() {
        return this.success;
    }
    
    public Integer getFailCount() {
        return this.failed;
    }
}
