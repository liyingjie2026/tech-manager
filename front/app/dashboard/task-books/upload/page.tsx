"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, X, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TaskBookUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    taskBookName: "",
    version: "1.0",
    description: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "请选择文件",
        description: "请至少上传一个任务书文件",
        variant: "destructive",
      })
      return
    }

    if (!formData.taskBookName) {
      toast({
        title: "请填写任务书名称",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      // 模拟上传
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Task book uploaded:", formData, files)

      toast({
        title: "上传成功",
        description: "任务书已成功上传，等待审核",
      })

      // 跳转回任务书管理页面
      setTimeout(() => {
        router.push("/dashboard/task-management")
      }, 1000)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "上传失败",
        description: "任务书上传失败，请重试",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <div>
          <h1 className="text-2xl font-bold">任务书上传</h1>
          <p className="text-sm text-muted-foreground mt-1">上传项目任务书文件并提交审核</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>填写任务书基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskBookName">
              任务书名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="taskBookName"
              placeholder="请输入任务书名称"
              value={formData.taskBookName}
              onChange={(e) => setFormData({ ...formData, taskBookName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">版本号</Label>
            <Input
              id="version"
              placeholder="请输入版本号"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">任务书说明</Label>
            <Textarea
              id="description"
              placeholder="请输入任务书说明（选填）"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>文件上传</CardTitle>
          <CardDescription>支持PDF、Word等格式，单个文件最大50MB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-2">点击上传或拖拽文件到此处</p>
              <p className="text-xs text-muted-foreground">支持 PDF、Word 格式，最大 50MB</p>
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>已选择的文件</Label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()} disabled={uploading}>
          取消
        </Button>
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? "上传中..." : "提交审核"}
        </Button>
      </div>
    </div>
  )
}
