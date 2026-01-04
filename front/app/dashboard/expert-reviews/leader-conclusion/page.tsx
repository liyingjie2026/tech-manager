"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { expertReviewApi } from "@/lib/api/expert-review"
import { authStorage } from "@/lib/auth-storage"
import { FileText, Users, CheckCircle } from "lucide-react"

interface CompletedProject {
  id: number
  projectId: string
  name: string
  projectType: string
  institution: string
  completedCount: number
  totalCount: number
  averageScore: number
  reviewStatus: string
}

export default function LeaderConclusionPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [projects, setProjects] = useState<CompletedProject[]>([])
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null)
  const [conclusion, setConclusion] = useState("")
  const [recommendation, setRecommendation] = useState<"approve" | "reject" | "">("")

  useEffect(() => {
    loadCompletedProjects()
  }, [])

  const loadCompletedProjects = async () => {
    try {
      setLoading(true)
      const user = authStorage.getUser()

      const response = await expertReviewApi.getLeaderProjects()

      if (response.data) {
        const completed = response.data.filter(
          (p: CompletedProject) => p.reviewStatus === "reviewed" && p.completedCount === p.totalCount,
        )
        setProjects(completed)
      }
    } catch (error) {
      console.error("加载项目失败:", error)
      toast.error("加载项目失败")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedProject) {
      toast.error("请选择项目")
      return
    }

    if (!conclusion.trim()) {
      toast.error("请填写评审结论")
      return
    }

    if (!recommendation) {
      toast.error("请选择评审建议")
      return
    }

    try {
      setSubmitting(true)

      const response = await expertReviewApi.submitLeaderConclusion({
        projectId: selectedProject.id,
        conclusion: conclusion.trim(),
        recommendation,
      })

      if (response.data) {
        toast.success("评审结论提交成功")
        setSelectedProject(null)
        setConclusion("")
        setRecommendation("")
        await loadCompletedProjects()
      }
    } catch (error) {
      console.error("[v0] 提交失败:", error)
      toast.error("提交失败")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">专家组长结论</h1>
          <p className="text-muted-foreground mt-2">上传所有专家已完成评审的项目结论</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              待上传结论的项目
            </CardTitle>
            <CardDescription>选择一个项目上传评审结论（共 {projects.length} 个）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                暂无需要上传结论的项目
                <br />
                <span className="text-sm">所有专家完成评审后才会显示</span>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-lg transition-all cursor-pointer ${
                    selectedProject?.id === project.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge variant="outline" className="ml-2">
                        {project.projectType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.institution}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {project.completedCount}/{project.totalCount} 已完成
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>平均分: {project.averageScore.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>上传评审结论</CardTitle>
            <CardDescription>
              {selectedProject ? `为 ${selectedProject.name} 填写结论` : "请先选择一个项目"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProject ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="recommendation">评审建议 *</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={recommendation === "approve" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setRecommendation("approve")}
                    >
                      建议通过
                    </Button>
                    <Button
                      variant={recommendation === "reject" ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => setRecommendation("reject")}
                    >
                      不建议通过
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conclusion">评审结论 *</Label>
                  <Textarea
                    id="conclusion"
                    placeholder="请填写详细的评审结论，包括项目优缺点、创新性评价、可行性分析等..."
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">已输入 {conclusion.length} 字</p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !conclusion.trim() || !recommendation}
                  className="w-full"
                >
                  {submitting ? "提交中..." : "提交评审结论"}
                </Button>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">请从左侧选择一个项目</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
