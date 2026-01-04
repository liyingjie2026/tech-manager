"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { projectApi } from "@/lib/api/project"
import { Check, X } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function PreliminaryReviewPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [reviewComment, setReviewComment] = useState("")

  useEffect(() => {
    loadProject()
  }, [params.id])

  const loadProject = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading project with ID:", params.id)
      const response = await projectApi.getById(Number(params.id))
      console.log("[v0] Project API response:", response)

      if (response.data) {
        setProject(response.data)
      } else {
        console.error("[v0] No project data in response")
        toast({
          title: "加载失败",
          description: "项目数据为空",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Failed to load project:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目信息",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!reviewComment.trim()) {
      toast({
        title: "请填写审核意见",
        variant: "destructive",
      })
      return
    }

    try {
      setReviewing(true)
      console.log("[v0] Approving project:", params.id, "with comment:", reviewComment)

      const response = await projectApi.approve(Number(params.id), reviewComment)
      console.log("[v0] Approve response:", response)

      if (response.code === 200 || response.success) {
        toast({
          title: "初审通过",
          description: "项目已进入立项评审阶段",
        })
        setTimeout(() => {
          router.push("/supervisor/application")
        }, 1500)
      } else {
        throw new Error(response.message || "审核失败")
      }
    } catch (error: any) {
      console.error("[v0] Failed to approve:", error)
      toast({
        title: "操作失败",
        description: error.message || "审核通过操作失败，请重试",
        variant: "destructive",
      })
    } finally {
      setReviewing(false)
    }
  }

  const handleReject = async () => {
    if (!reviewComment.trim()) {
      toast({
        title: "请填写驳回原因",
        variant: "destructive",
      })
      return
    }

    try {
      setReviewing(true)
      console.log("[v0] Rejecting project:", params.id, "with reason:", reviewComment)

      const response = await projectApi.reject(Number(params.id), reviewComment)
      console.log("[v0] Reject response:", response)

      if (response.code === 200 || response.success) {
        toast({
          title: "已驳回",
          description: "项目已被驳回",
        })
        setTimeout(() => {
          router.push("/supervisor/application")
        }, 1500)
      } else {
        throw new Error(response.message || "驳回失败")
      }
    } catch (error: any) {
      console.error("[v0] Failed to reject:", error)
      toast({
        title: "操作失败",
        description: error.message || "驳回操作失败，请重试",
        variant: "destructive",
      })
    } finally {
      setReviewing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">项目不存在</p>
          <Button onClick={() => router.back()}>返回</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <PageHeader title="项目初审" showBack backUrl="/supervisor/application" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>项目基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">项目名称</span>
                  <p className="font-medium">{project.name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">申报单位</span>
                  <p className="font-medium">{project.institutionName}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">项目负责人</span>
                  <p className="font-medium">{project.leaderName}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">申报时间</span>
                  <p className="font-medium">{project.createTime}</p>
                </div>
              </div>

              {project.description && (
                <div>
                  <span className="text-sm text-muted-foreground">项目简介</span>
                  <p className="mt-1">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>审核意见</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="请输入审核意见或驳回原因"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={6}
              />
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={handleReject} disabled={reviewing}>
              <X className="mr-2 h-4 w-4" />
              {reviewing ? "处理中..." : "驳回"}
            </Button>
            <Button size="lg" onClick={handleApprove} disabled={reviewing}>
              <Check className="mr-2 h-4 w-4" />
              {reviewing ? "处理中..." : "通过"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
