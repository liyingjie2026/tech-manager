"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, CheckCircle2, AlertCircle, Download, Eye, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { expertVoteApi } from "@/lib/api/expert-vote"
import { Badge } from "@/components/ui/badge"

interface FinalConclusionStepProps {
  isLeader: boolean
  leaderName: string
  existingConclusion?: {
    fileName: string
    fileUrl: string
    fileSize: number
    summary?: string
    uploadedAt: string
  }
  reviewId?: string
  reviewData?: any
}

export function FinalConclusionStep({
  isLeader,
  leaderName,
  existingConclusion,
  reviewId,
  reviewData,
}: FinalConclusionStepProps) {
  const [conclusion, setConclusion] = useState(existingConclusion?.summary || "")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const isViewMode = !!existingConclusion

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!uploadedFile && !conclusion) {
      toast({
        title: "请填写评审结论",
        description: "请至少填写评审结论摘要或上传文件",
        variant: "destructive",
      })
      return
    }

    if (!reviewData?.projectId) {
      toast({
        title: "项目信息缺失",
        description: "无法获取项目ID，请刷新页面重试",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("[v0] Uploading conclusion for project:", reviewData.projectId)

      let fileUrl = ""

      if (uploadedFile) {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append("file", uploadedFile)

        // TODO: Implement file upload endpoint
        // const uploadResponse = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData
        // })
        // const uploadData = await uploadResponse.json()
        // fileUrl = uploadData.url

        // For now, use a placeholder
        fileUrl = `/uploads/${uploadedFile.name}`
      }

      await expertVoteApi.uploadConclusion({
        projectId: reviewData.projectId,
        conclusionContent: conclusion,
        conclusionFileUrl: fileUrl,
      })

      setIsSubmitted(true)

      toast({
        title: "提交成功",
        description: "评审结论已成功提交，项目状态已更新为评审通过",
      })

      setTimeout(() => {
        router.push("/expert/conclusion")
      }, 1500)
    } catch (error) {
      console.error("[v0] Submission error:", error)
      toast({
        title: "提交失败",
        description: error instanceof Error ? error.message : "评审结论提交失败，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    if (existingConclusion?.fileUrl) {
      window.open(existingConclusion.fileUrl, "_blank")
    }
  }

  const handlePreview = () => {
    if (existingConclusion?.fileUrl) {
      window.open(existingConclusion.fileUrl, "_blank")
    }
  }

  if (isViewMode) {
    return (
      <div className="space-y-4">
        <Card className="border-success bg-success/5">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">评审已完成</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {isLeader ? "您已成功提交评审结论" : `专家组长 ${leaderName} 已提交评审结论`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">上传时间：{existingConclusion.uploadedAt}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle>评审结论文件</CardTitle>
            </div>
            <CardDescription>已上传的评审结论文件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{existingConclusion.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {(existingConclusion.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {existingConclusion.summary && (
              <div className="space-y-2">
                <Label>评审结论摘要</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{existingConclusion.summary}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handlePreview} variant="outline" className="flex-1 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                预览文件
              </Button>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                下载文件
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLeader) {
    return (
      <div className="space-y-4">
        {isSubmitted && (
          <Alert className="bg-success/10 border-success/30">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-foreground">评审结论已成功提交！即将跳转...</AlertDescription>
          </Alert>
        )}

        <Alert className="bg-accent/10 border-accent/30">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription className="text-foreground">
            您是本次评审的专家组长，请上传最终评审结论文件
          </AlertDescription>
        </Alert>

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
                  <p className="mt-1 font-mono">{reviewData.projectCode || `PRJ-${reviewData.projectId}`}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">项目类型</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{reviewData.projectType || "科研项目"}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">申报单位</Label>
                  <p className="mt-1">{reviewData.institutionName || "-"}</p>
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
            <CardDescription>请上传最终的评审结论文件（支持 PDF、Word 格式）</CardDescription>
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
                  disabled={isSubmitting}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  {uploadedFile ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent" disabled={isSubmitting}>
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
                placeholder="请输入评审结论的详细内容（必填）..."
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                rows={6}
                className="resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">请综合所有专家的评审意见，撰写最终评审结论</p>
            </div>

            <Button onClick={handleSubmit} disabled={!conclusion || isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                "确认提交评审结论"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isLeader) {
    return (
      <div className="space-y-4">
        <Alert className="bg-primary/10 border-primary/30">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            您的评审已完成，正在等待专家组长 <strong>{leaderName}</strong> 上传最终评审结论
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>评审状态</CardTitle>
            <CardDescription>所有专家的评审工作已完成</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">您的评审已提交</p>
                <p className="text-sm text-muted-foreground">等待组长汇总结论</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">组长上传结论</p>
                <p className="text-sm text-muted-foreground">进行中...</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button onClick={() => router.push("/expert/conclusion")} variant="outline" className="w-full">
                查看结论上传页面
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-success bg-success/5">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">评审已完成</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {isLeader ? "您已成功提交评审结论，感谢您的参与！" : "所有评审流程已完成，等待组长提交最终结论"}
            </p>
          </div>
          {uploadedFile && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">已上传文件</p>
              <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                <FileText className="w-4 h-4" />
                <span>{uploadedFile.name}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
