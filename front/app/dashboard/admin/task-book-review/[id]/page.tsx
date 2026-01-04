"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeft, CheckCircle2, XCircle, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { taskBookApi } from "@/lib/api/taskbook"

export default function TaskBookReviewDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [taskBook, setTaskBook] = useState<any>(null)
  const [reviewOpinion, setReviewOpinion] = useState("")
  const [reviewResult, setReviewResult] = useState<"pass" | "reject">("pass")
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)

  const taskBookId = params.id as string
  const action = searchParams.get("action")

  useEffect(() => {
    const loadTaskBook = async () => {
      setLoading(true)
      try {
        const data = await taskBookApi.getById(taskBookId)
        setTaskBook(data)
      } catch (error) {
        console.error("Failed to load task book:", error)
        toast({
          title: "加载失败",
          description: "无法加载任务书详情，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadTaskBook()
  }, [taskBookId])

  const handleSubmitReview = async () => {
    if (!reviewOpinion.trim()) {
      toast({
        title: "请输入审核意见",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      await taskBookApi.review(taskBookId, {
        result: reviewResult,
        opinion: reviewOpinion,
      })

      toast({
        title: reviewResult === "pass" ? "审核通过" : "审核驳回",
        description: `任务书"${taskBook.code}"已${reviewResult === "pass" ? "提交至监管端" : "驳回"}`,
      })

      router.push("/dashboard/admin/task-book-review")
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast({
        title: "操作失败",
        description: "审核提交失败，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  if (!taskBook) {
    return <div className="p-6">任务书不存在</div>
  }

  return (
    <div className="p-6 space-y-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">首页</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/admin/task-book-review">任务书审核</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>任务书详情</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">任务书详情</h1>
        </div>
        <Badge variant="secondary">{taskBook.status === "pending_institution" ? "待审核" : taskBook.statusName}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{taskBook.projectName}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">任务书编号：{taskBook.code}</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">任务书内容</TabsTrigger>
              <TabsTrigger value="history">审核历史</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-6">
                <div>
                  <Label className="text-muted-foreground">研究目标</Label>
                  <p className="mt-2 text-sm leading-relaxed">{taskBook.objectives}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">研究内容</Label>
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{taskBook.content}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">研究方法</Label>
                  <p className="mt-2 text-sm leading-relaxed">{taskBook.methodology}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">预期成果</Label>
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{taskBook.expectedResults}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">项目起止时间</Label>
                    <p className="mt-2 text-sm">
                      {taskBook.startDate} 至 {taskBook.endDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">经费预算</Label>
                    <p className="mt-2 text-sm">总预算：{taskBook.budgetTotal?.toLocaleString()} 元</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">任务书提交</span>
                      <span className="text-sm text-muted-foreground">{taskBook.submittedAt}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">项目负责人提交任务书</p>
                  </div>
                </div>
                {taskBook.leadInstitutionOpinion && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">机构审核</span>
                        <span className="text-sm text-muted-foreground">{taskBook.leadInstitutionSignDate}</span>
                      </div>
                      <p className="text-sm mt-1">{taskBook.leadInstitutionOpinion}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {taskBook.status === "pending_institution" && action === "review" && (
        <Card>
          <CardHeader>
            <CardTitle>审核意见</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="review-result">
                审核结果 <span className="text-destructive">*</span>
              </Label>
              <Select value={reviewResult} onValueChange={(value: any) => setReviewResult(value)}>
                <SelectTrigger id="review-result" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pass">审核通过，上报监管端</SelectItem>
                  <SelectItem value="reject">审核不通过，退回修改</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <Button onClick={handleSubmitReview} disabled={submitting}>
                {reviewResult === "pass" ? (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                提交审核
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
