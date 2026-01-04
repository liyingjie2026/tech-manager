"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { expertReviewApi } from "@/lib/api/expert-review"
import { PageHeader } from "@/components/page-header"

export default function ConclusionUploadPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const reviewId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reviewData, setReviewData] = useState<any>(null)
  const [conclusion, setConclusion] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  useEffect(() => {
    loadReviewData()
  }, [reviewId])

  const loadReviewData = async () => {
    try {
      setLoading(true)
      const response = await expertReviewApi.getById(Number(reviewId))
      if (response.success && response.data) {
        setReviewData(response.data)
      }
    } catch (error) {
      console.error("Failed to load review data:", error)
      toast({
        title: "加载失败",
        description: "无法获取评审信息，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const maxSize = 20 * 1024 * 1024 // 20MB

      if (file.size > maxSize) {
        toast({
          title: "文件过大",
          description: "文件大小不能超过 20MB",
          variant: "destructive",
        })
        return
      }

      setUploadedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!conclusion.trim()) {
      toast({
        title: "请填写评审结论",
        description: "评审结论摘要不能为空",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      let fileUrl = ""

      // 如果有上传文件，先上传文件
      if (uploadedFile) {
        const formData = new FormData()
        formData.append("file", uploadedFile)

        // TODO: 实现真实的文件上传API
        // const uploadResponse = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData
        // })
        // const uploadData = await uploadResponse.json()
        // fileUrl = uploadData.url

        // 暂时使用占位符
        fileUrl = `/uploads/conclusions/${uploadedFile.name}`
      }

      // 提交组长结论
      await expertReviewApi.submitLeaderConclusion({
        projectId: reviewData.projectId,
        conclusion: conclusion,
        recommendation: "approve", // 可以根据实际情况修改
      })

      toast({
        title: "提交成功",
        description: "评审结论已成功上传",
      })

      setTimeout(() => {
        router.push("/expert/conclusion")
      }, 1500)
    } catch (error) {
      console.error("Failed to submit conclusion:", error)
      toast({
        title: "提交失败",
        description: error instanceof Error ? error.message : "评审结论提交失败，请重试",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="上传评审结论"
        description="请上传最终的评审结论文件并填写结论摘要"
        showBack
        backUrl="/expert/conclusion"
      />

      {reviewData && (
        <Card>
          <CardHeader>
            <CardTitle>项目信息</CardTitle>
            <CardDescription>当前评审项目的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">项目名称</Label>
                <p className="mt-1 font-medium">{reviewData.projectName || "未命名项目"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">项目编号</Label>
                <p className="mt-1 font-mono">{reviewData.projectId || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">项目类型</Label>
                <div className="mt-1">
                  <Badge variant="outline">{reviewData.projectType || "科研项目"}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">申报单位</Label>
                <p className="mt-1">{reviewData.institution || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            <CardTitle>上传评审结论</CardTitle>
          </div>
          <CardDescription>请上传最终的评审结论文件（支持 PDF、Word 格式，最大 20MB）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="file-upload">评审结论文件（可选）</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                disabled={submitting}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {uploadedFile ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent" disabled={submitting}>
                      重新选择
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">点击上传文件</p>
                      <p className="text-sm text-muted-foreground mt-1">支持 PDF、Word 格式，最大 20MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conclusion">
              评审结论摘要 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="conclusion"
              placeholder="请输入评审结论的详细内容..."
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              rows={8}
              className="resize-none"
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">请综合所有专家的评审意见，撰写最终评审结论</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()} disabled={submitting} className="flex-1">
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={!conclusion.trim() || submitting} className="flex-1">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  确认提交
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
