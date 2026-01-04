"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { expertReviewApi } from "@/lib/api/expert-review"
import { PageHeader } from "@/components/page-header"

interface ExpertReviewDetail {
  expertId: number
  expertName: string
  institution: string
  title: string
  score: number
  opinion: string
  suggestion?: string
  isApproved: boolean
  submittedAt: string
}

export default function ReviewListPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const reviewId = params.id as string

  const [loading, setLoading] = useState(true)
  const [projectInfo, setProjectInfo] = useState<any>(null)
  const [reviews, setReviews] = useState<ExpertReviewDetail[]>([])

  useEffect(() => {
    loadReviews()
  }, [reviewId])

  const loadReviews = async () => {
    try {
      setLoading(true)

      // 获取项目基本信息
      const projectResponse = await expertReviewApi.getById(Number(reviewId))
      if (projectResponse.success && projectResponse.data) {
        setProjectInfo(projectResponse.data)
      }

      // TODO: 实现获取所有专家评审意见的API
      const reviewsResponse = await expertReviewApi.getProjectReviews(Number(reviewId))
      if (reviewsResponse.data) {
        setReviews(reviewsResponse.data)
      }

      // 暂时使用模拟数据
      // setReviews([
      //   {
      //     expertId: 1,
      //     expertName: "张三教授",
      //     institution: "清华大学",
      //     title: "教授",
      //     score: 85,
      //     opinion: "项目研究方向明确，技术路线合理，具有一定的创新性。建议加强实验验证部分的设计。",
      //     suggestion: "建议增加对比实验，进一步验证方法的有效性。",
      //     isApproved: true,
      //     submittedAt: "2024-01-15 14:30:00",
      //   },
      //   {
      //     expertId: 2,
      //     expertName: "李四研究员",
      //     institution: "中科院",
      //     title: "研究员",
      //     score: 90,
      //     opinion: "项目具有较强的理论基础和实践意义，研究团队实力雄厚，预期成果明确。",
      //     suggestion: "建议关注国际最新研究动态，及时调整研究方案。",
      //     isApproved: true,
      //     submittedAt: "2024-01-15 15:45:00",
      //   },
      //   {
      //     expertId: 3,
      //     expertName: "王五副教授",
      //     institution: "北京大学",
      //     title: "副教授",
      //     score: 88,
      //     opinion: "项目选题新颖，研究内容充实，技术方案可行。建议进一步细化实施计划。",
      //     suggestion: "建议明确各阶段的具体时间节点和成果产出。",
      //     isApproved: true,
      //     submittedAt: "2024-01-16 09:20:00",
      //   },
      // ])
    } catch (error) {
      console.error("Failed to load reviews:", error)
      toast({
        title: "加载失败",
        description: "无法获取评审信息，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const averageScore =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1) : "0"

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
        title="专家评审意见"
        description="查看所有专家对该项目的评审意见和评分"
        showBack
        backUrl="/expert/conclusion"
      />

      {projectInfo && (
        <Card>
          <CardHeader>
            <CardTitle>项目信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">项目名称</p>
                <p className="mt-1 font-medium">{projectInfo.projectName || "未命名项目"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">项目编号</p>
                <p className="mt-1 font-mono">{projectInfo.projectId || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">项目类型</p>
                <Badge variant="outline" className="mt-1">
                  {projectInfo.projectType || "科研项目"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">平均分</p>
                <div className="mt-1 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-foreground">{averageScore}</span>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>评审意见列表</CardTitle>
          <CardDescription>共 {reviews.length} 位专家参与评审</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {reviews.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">暂无评审意见</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">专家姓名</TableHead>
                  <TableHead className="w-[150px]">所属单位</TableHead>
                  <TableHead className="w-[100px]">职称</TableHead>
                  <TableHead className="w-[80px]">评分</TableHead>
                  <TableHead>评审意见</TableHead>
                  <TableHead className="w-[100px]">结论</TableHead>
                  <TableHead className="w-[140px]">提交时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.expertId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{review.expertName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{review.institution}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{review.title}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-lg">{review.score}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="space-y-2">
                        <p className="text-sm">{review.opinion}</p>
                        {review.suggestion && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">建议：</span>
                            {review.suggestion}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.isApproved ? (
                        <Badge className="bg-green-500/10 text-green-500">通过</Badge>
                      ) : (
                        <Badge variant="destructive">不通过</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{review.submittedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
