"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ClipboardCheck, FileText, CheckSquare, Award } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReviewItem {
  id: string
  title: string
  description: string
  icon: any
  score: number
  comment: string
}

interface ReviewScoreStepProps {
  onComplete: () => void
}

export function ReviewScoreStep({ onComplete }: ReviewScoreStepProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "1",
      title: "项目申报内容",
      description: "评审项目申报的完整性、合理性",
      icon: FileText,
      score: 80,
      comment: "",
    },
    {
      id: "2",
      title: "任务书完成情况",
      description: "评估任务书中各项任务的完成质量",
      icon: CheckSquare,
      score: 80,
      comment: "",
    },
    {
      id: "3",
      title: "项目验收成果",
      description: "评价最终验收成果的质量和创新性",
      icon: Award,
      score: 80,
      comment: "",
    },
  ])

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const currentReview = reviews[currentReviewIndex]

  const updateReview = (field: "score" | "comment", value: number | string) => {
    const updatedReviews = [...reviews]
    updatedReviews[currentReviewIndex] = {
      ...updatedReviews[currentReviewIndex],
      [field]: value,
    }
    setReviews(updatedReviews)
  }

  const handleNext = () => {
    if (currentReviewIndex < reviews.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  const averageScore = Math.round(reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length)

  const isLastReview = currentReviewIndex === reviews.length - 1

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">评审进度</span>
            <span className="font-medium text-foreground">
              {currentReviewIndex + 1} / {reviews.length}
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {reviews.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index === currentReviewIndex ? "bg-primary" : index < currentReviewIndex ? "bg-success" : "bg-border"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = currentReview.icon
              return <Icon className="w-5 h-5 text-primary" />
            })()}
            <CardTitle>{currentReview.title}</CardTitle>
          </div>
          <CardDescription>{currentReview.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="score" className="text-base">
                评分
              </Label>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">{currentReview.score}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
            </div>
            <Slider
              id="score"
              min={0}
              max={100}
              step={5}
              value={[currentReview.score]}
              onValueChange={([value]) => updateReview("score", value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">评审意见</Label>
            <Textarea
              id="comment"
              placeholder="请输入对该项目的详细评审意见..."
              value={currentReview.comment}
              onChange={(e) => updateReview("comment", e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentReviewIndex === 0}
          className="flex-1 bg-transparent"
          size="lg"
        >
          上一项
        </Button>
        {!isLastReview ? (
          <Button onClick={handleNext} className="flex-1" size="lg">
            下一项
          </Button>
        ) : (
          <Button onClick={handleComplete} className="flex-1" size="lg">
            完成评审
          </Button>
        )}
      </div>

      {/* Summary */}
      {isLastReview && (
        <Alert>
          <ClipboardCheck className="h-4 w-4" />
          <AlertDescription>
            您的平均评分为 <strong>{averageScore}</strong> 分，点击"完成评审"进入下一步
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
