package com.research.project.service;

import com.research.project.dto.FileInfoDTO;
import com.research.project.dto.FileUploadResultDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 文件服务接口
 */
public interface FileService {
    
    /**
     * 上传文件
     */
    FileUploadResultDTO upload(MultipartFile file, String category);
    
    /**
     * 批量上传文件
     */
    List<FileUploadResultDTO> uploadBatch(List<MultipartFile> files, String category);
    
    /**
     * 下载文件
     */
    ResponseEntity<Resource> download(Long fileId);
    
    /**
     * 预览文件
     */
    String preview(Long fileId);
    
    /**
     * 删除文件
     */
    void delete(Long fileId);
    
    /**
     * 获取文件信息
     */
    FileInfoDTO getInfo(Long fileId);
}
