import { get, post, del } from "./client"
import type { ApiResponse } from "./config"

export const fileApi = {
  // 上传单个文件
  upload: (file: File, category?: string): Promise<ApiResponse<any>> => {
    const formData = new FormData()
    formData.append("file", file)
    if (category) {
      formData.append("category", category)
    }
    return post("/api/files/upload", formData)
  },

  // 批量上传文件
  uploadBatch: (files: File[], category?: string): Promise<ApiResponse<any[]>> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })
    if (category) {
      formData.append("category", category)
    }
    return post("/api/files/upload/batch", formData)
  },

  // 下载文件
  download: (fileId: number): Promise<void> => {
    window.open(`/api/files/download/${fileId}`, "_blank")
    return Promise.resolve()
  },

  // 预览文件
  preview: (fileId: number): Promise<ApiResponse<string>> => {
    return get(`/api/files/preview/${fileId}`)
  },

  // 删除文件
  delete: (fileId: number): Promise<ApiResponse<void>> => {
    return del(`/api/files/${fileId}`)
  },

  // 获取文件信息
  getInfo: (fileId: number): Promise<ApiResponse<any>> => {
    return get(`/api/files/${fileId}`)
  },
}
