package com.research.project.controller;

import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 文件管理控制器
 * 页面：各页面的文件上传下载功能
 */
@Tag(name = "文件管理", description = "文件上传、下载、预览等接口")
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    /**
     * 上传文件
     * 按钮：各页面 - 上传按钮
     */
    @Operation(summary = "上传文件")
    @PostMapping("/upload")
    public Result<FileUploadResultDTO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String category) {
        return Result.success(fileService.upload(file, category));
    }

    /**
     * 批量上传文件
     * 按钮：各页面 - 批量上传按钮
     */
    @Operation(summary = "批量上传文件")
    @PostMapping("/upload/batch")
    public Result<List<FileUploadResultDTO>> uploadBatch(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(required = false) String category) {
        return Result.success(fileService.uploadBatch(files, category));
    }

    /**
     * 下载文件
     * 按钮：各页面 - 下载按钮
     */
    @Operation(summary = "下载文件")
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> download(@PathVariable Long fileId) {
        return fileService.download(fileId);
    }

    /**
     * 预览文件
     * 按钮：各页面 - 预览按钮
     */
    @Operation(summary = "预览文件")
    @GetMapping("/preview/{fileId}")
    public Result<String> preview(@PathVariable Long fileId) {
        return Result.success(fileService.preview(fileId));
    }

    /**
     * 删除文件
     * 按钮：各页面 - 删除按钮
     */
    @Operation(summary = "删除文件")
    @DeleteMapping("/{fileId}")
    public Result<Void> delete(@PathVariable Long fileId) {
        fileService.delete(fileId);
        return Result.success();
    }

    /**
     * 获取文件信息
     * 按钮：各页面 - 文件信息展示
     */
    @Operation(summary = "获取文件信息")
    @GetMapping("/{fileId}")
    public Result<FileInfoDTO> getInfo(@PathVariable Long fileId) {
        return Result.success(fileService.getInfo(fileId));
    }
}
