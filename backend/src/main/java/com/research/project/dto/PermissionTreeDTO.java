package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 权限树DTO
 */
@Data
public class PermissionTreeDTO {
    private Long id;
    private Long parentId;
    private String name;
    private String code;
    private String type;
    private String path;
    private Integer sort;
    private List<PermissionTreeDTO> children;
}
