"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeft, CheckCircle2, XCircle, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { authStorage } from "@/lib/auth-storage"

export default function ProjectReviewDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reviewOpinion, setReviewOpinion] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const projectId = params.id as string
  const action = searchParams.get("action")

  useEffect(() => {
    loadProject()
  }, [projectId])

  const loadProject = async () => {
    try {
      setLoading(true)
      const token = authStorage.getToken()
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("加载失败")
      }

      const data = await response.json()
      console.log("[v0] Project data loaded:", data)
      setProject(data.data || data)
    } catch (error) {
      console.error("[v0] Failed to load project:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目详情",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExpertExtraction = () => {
    if (!project || !project.id) {
      toast({
        title: "错误",
        description: "项目信息加载中，请稍后再试",
        variant: "destructive",
      })
      return
    }
    router.push(`/dashboard/admin/expert-selection?projectId=${project.id}`)
  }

  const handleApprove = async () => {
    if (!reviewOpinion.trim()) {
      toast({
        title: "请输入审核意见",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const token = authStorage.getToken()
      const user = authStorage.getUser()

      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "approved",
          comment: reviewOpinion,
          reviewerId: user?.id || "admin-001",
          reviewerName: user?.realName || user?.name || "管理员",
        }),
      })

      if (!response.ok) {
        throw new Error("审核失败")
      }

      toast({
        title: "审核通过",
        description: "项目已审核通过并提交至监管端",
      })

      setTimeout(() => {
        router.push("/dashboard/my-projects")
      }, 1000)
    } catch (error) {
      toast({
        title: "操作失败",
        description: "审核通过失败，请重试",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!reviewOpinion.trim()) {
      toast({
        title: "请输入驳回原因",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const token = authStorage.getToken()
      const user = authStorage.getUser()

      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "rejected",
          comment: reviewOpinion,
          reviewerId: user?.id || "admin-001",
          reviewerName: user?.realName || user?.name || "管理员",
        }),
      })

      if (!response.ok) {
        throw new Error("驳回失败")
      }

      toast({
        title: "已驳回",
        description: "项目已驳回，项目负责人可重新编辑提交",
      })

      setTimeout(() => {
        router.push("/dashboard/my-projects")
      }, 1000)
    } catch (error) {
      toast({
        title: "操作失败",
        description: "驳回失败，请重试",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  if (!project) {
    return <div className="p-6">项目不存在</div>
  }

  return (
    <div className="p-6 space-y-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">首页</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/my-projects">项目一览</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>项目审核</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">项目审核详情</h1>
        </div>
        <Button onClick={handleExpertExtraction} variant="default">
          <Users className="h-4 w-4 mr-2" />
          专家抽取
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.name}</CardTitle>
            <Badge variant="secondary">{project.status === "approval_pending" ? "待审核" : project.status_name}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">项目编号</Label>
              <p className="mt-1">{project.code}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目负责人</Label>
              <p className="mt-1">{project.leader_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目类型</Label>
              <p className="mt-1">{project.type_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">申报单位</Label>
              <p className="mt-1">{project.lead_institution_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">开始时间</Label>
              <p className="mt-1">{project.start_date || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">结束时间</Label>
              <p className="mt-1">{project.end_date || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目预算</Label>
              <p className="mt-1">{project.total_budget}元</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目周期</Label>
              <p className="mt-1">{project.duration || "-"}</p>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">项目背景</Label>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{project.background || "-"}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">研究目标</Label>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{project.researchObjective || "-"}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">研究内容</Label>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{project.researchContent || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {(project.status === "approval_pending" || action === "approve") && (
        <Card>
          <CardHeader>
            <CardTitle>审核意见</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="review-opinion">
                审核意见 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="review-opinion"
                placeholder="请输入审核意见..."
                value={reviewOpinion}
                onChange={(e) => setReviewOpinion(e.target.value)}
                rows={5}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApprove} disabled={submitting}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {submitting ? "提交中..." : "审核通过"}
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={submitting}>
                <XCircle className="h-4 w-4 mr-2" />
                {submitting ? "提交中..." : "审核驳回"}
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
