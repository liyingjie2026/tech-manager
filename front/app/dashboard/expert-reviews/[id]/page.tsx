"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Send } from "lucide-react"
import { expertReviewApi } from "@/lib/api/expert-review"
import { useToast } from "@/hooks/use-toast"
import { authStorage } from "@/lib/auth-storage"

export default function ExpertReviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const reviewId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [review, setReview] = useState<any>(null)
  const [scores, setScores] = useState({
    technical: 0,
    innovation: 0,
    feasibility: 0,
    impact: 0,
    budget: 0,
  })
  const [comments, setComments] = useState("")

  useEffect(() => {
    loadReviewDetail()
  }, [reviewId])

  const loadReviewDetail = async () => {
    try {
      setLoading(true)
      const response = await expertReviewApi.getById(Number(reviewId))

      if (response.data) {
        setReview(response.data)
      } else {
        toast({
          title: "加载失败",
          description: "无法加载评审详情",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Failed to load review detail:", error)
      toast({
        title: "加载失败",
        description: "无法加载评审详情",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    const user = authStorage.getUser()
    if (!user || !user.expertId) {
      toast({
        title: "提交失败",
        description: "无法获取专家信息",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length

      await expertReviewApi.submitReview(Number(reviewId), {
        expertId: user.expertId,
        expertName: user.expertName || user.realName,
        scores,
        totalScore,
        comments,
        status: "reviewed",
      })

      toast({
        title: "提交成功",
        description: "评审意见已提交，请等待组长上传评审结论",
      })

      router.push("/dashboard/expert-reviews?refresh=true")
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast({
        title: "提交失败",
        description: "评审意见提交失败，请重试",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const isReadOnly = review?.status === "reviewed" || review?.status === "completed"

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  if (!review) {
    return <div className="p-6">评审信息不存在</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">专家评审</h1>
            <p className="text-sm text-gray-500 mt-1">{review.projectName}</p>
          </div>
        </div>
        <Badge>{review.status}</Badge>
      </div>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500">项目编号</Label>
              <p className="font-medium">{review.projectId}</p>
            </div>
            <div>
              <Label className="text-gray-500">项目类型</Label>
              <p className="font-medium">{review.projectType}</p>
            </div>
            <div>
              <Label className="text-gray-500">申报单位</Label>
              <p className="font-medium">{review.institution}</p>
            </div>
            <div>
              <Label className="text-gray-500">项目负责人</Label>
              <p className="font-medium">{review.leaderName}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-gray-500">项目简介</Label>
            <p className="mt-2 text-sm">{review.description || "暂无项目简介"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Section */}
      <Card>
        <CardHeader>
          <CardTitle>评分项</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            technical: "技术水平",
            innovation: "创新性",
            feasibility: "可行性",
            impact: "影响力",
            budget: "预算合理性",
          }).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label>{label}（0-100分）</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={scores[key as keyof typeof scores]}
                onChange={(e) => setScores({ ...scores, [key]: Number(e.target.value) })}
                placeholder="请输入分数"
                readOnly={isReadOnly}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>评审意见</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="请输入您的评审意见..."
            rows={8}
            readOnly={isReadOnly}
          />
        </CardContent>
      </Card>

      {isReadOnly && (
        <Card className="border-blue-500 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-700">
              {review.status === "reviewed" ? "您已完成评审，请等待组长上传评审结论" : "评审已完成"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
        {!isReadOnly && (
          <Button onClick={handleSubmit} disabled={submitting}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "提交中..." : "提交评审"}
          </Button>
        )}
      </div>
    </div>
  )
}
