package com.research.project.service.impl;

import com.research.project.dto.FileInfoDTO;
import com.research.project.dto.FileUploadResultDTO;
import com.research.project.entity.FileInfo;
import com.research.project.mapper.FileMapper;
import com.research.project.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 文件服务实现类
 */
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    
    private final FileMapper fileMapper;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    @Value("${file.upload.path:/data/uploads}")
    private String uploadPath;
    
    @Value("${file.url.prefix:http://localhost:8080/files}")
    private String urlPrefix;
    
    @Override
    public FileUploadResultDTO upload(MultipartFile file, String category) {
        try {
            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extension;
            
            // 创建目录
            String dateFolder = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String folderPath = uploadPath + File.separator + dateFolder;
            File folder = new File(folderPath);
            if (!folder.exists()) {
                folder.mkdirs();
            }
            
            // 保存文件
            String filePath = folderPath + File.separator + fileName;
            file.transferTo(new File(filePath));
            
            FileInfo fileInfo = new FileInfo();
            fileInfo.setFileName(fileName);
            fileInfo.setOriginalName(originalFilename);
            fileInfo.setFilePath(filePath);
            fileInfo.setFileSize(file.getSize());
            fileInfo.setFileType(file.getContentType());
            fileInfo.setBusinessType(category);
            fileInfo.setCreateTime(LocalDateTime.now());
            fileMapper.insert(fileInfo);
            
            // 构建返回结果
            return FileUploadResultDTO.builder()
                    .fileId(fileInfo.getId())
                    .fileName(originalFilename)
                    .fileSize(file.getSize())
                    .filePath(filePath)
                    .fileUrl(urlPrefix + "/" + dateFolder + "/" + fileName)
                    .fileType(file.getContentType())
                    .uploadTime(LocalDateTime.now().format(DATE_FORMATTER))
                    .build();
                    
        } catch (IOException e) {
            throw new RuntimeException("文件上传失败：" + e.getMessage());
        }
    }
    
    @Override
    public List<FileUploadResultDTO> uploadBatch(List<MultipartFile> files, String category) {
        List<FileUploadResultDTO> results = new ArrayList<>();
        for (MultipartFile file : files) {
            results.add(upload(file, category));
        }
        return results;
    }
    
    @Override
    public ResponseEntity<Resource> download(Long fileId) {
        FileInfo fileInfo = fileMapper.selectById(fileId);
        if (fileInfo == null) {
            throw new RuntimeException("文件不存在");
        }
        
        try {
            Path path = Paths.get(fileInfo.getFilePath());
            Resource resource = new UrlResource(path.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "attachment; filename=\"" + fileInfo.getOriginalName() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("文件不存在或不可读");
            }
        } catch (Exception e) {
            throw new RuntimeException("文件下载失败：" + e.getMessage());
        }
    }
    
    @Override
    public String preview(Long fileId) {
        FileInfo fileInfo = fileMapper.selectById(fileId);
        if (fileInfo == null) {
            throw new RuntimeException("文件不存在");
        }
        
        // 返回文件预览URL
        String fileName = fileInfo.getFilePath().substring(fileInfo.getFilePath().lastIndexOf(File.separator) + 1);
        String dateFolder = fileInfo.getFilePath().substring(
                fileInfo.getFilePath().lastIndexOf(File.separator, fileInfo.getFilePath().lastIndexOf(File.separator) - 1) + 1,
                fileInfo.getFilePath().lastIndexOf(File.separator)
        );
        return urlPrefix + "/" + dateFolder + "/" + fileName;
    }
    
    @Override
    public void delete(Long fileId) {
        FileInfo fileInfo = fileMapper.selectById(fileId);
        if (fileInfo == null) {
            throw new RuntimeException("文件不存在");
        }
        
        try {
            // 删除物理文件
            Files.deleteIfExists(Paths.get(fileInfo.getFilePath()));
            
            // 删除数据库记录
            fileMapper.deleteById(fileId);
        } catch (IOException e) {
            throw new RuntimeException("文件删除失败：" + e.getMessage());
        }
    }
    
    @Override
    public FileInfoDTO getInfo(Long fileId) {
        FileInfo fileInfo = fileMapper.selectById(fileId);
        if (fileInfo == null) {
            throw new RuntimeException("文件不存在");
        }
        
        return FileInfoDTO.builder()
                .id(fileInfo.getId())
                .fileName(fileInfo.getFileName())
                .originalName(fileInfo.getOriginalName())
                .fileSize(fileInfo.getFileSize())
                .filePath(fileInfo.getFilePath())
                .fileUrl(preview(fileId))
                .fileType(fileInfo.getFileType())
                .category(fileInfo.getBusinessType())
                .uploadTime(fileInfo.getCreateTime().format(DATE_FORMATTER))
                .build();
    }
}
