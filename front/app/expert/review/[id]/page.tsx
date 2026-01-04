"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { VoteLeaderStep } from "@/components/vote-leader-step"
import { ProjectReviewStep } from "@/components/project-review-step"
import { FinalConclusionStep } from "@/components/final-conclusion-step"
import { expertReviewApi } from "@/lib/api/expert-review"
import { expertVoteApi } from "@/lib/api/expert-vote"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"

export default function ExpertReviewDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ step?: string }>
}) {
  const unwrappedParams = use(params)
  const unwrappedSearchParams = searchParams ? use(searchParams) : undefined
  const { toast } = useToast()

  const initialStep = unwrappedSearchParams?.step ? Number.parseInt(unwrappedSearchParams.step) : 1
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [leaderName, setLeaderName] = useState("")
  const [isLeader, setIsLeader] = useState(false)

  const [reviewData, setReviewData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [existingConclusion, setExistingConclusion] = useState<
    | {
        fileName: string
        fileUrl: string
        fileSize: number
        summary?: string
        uploadedAt: string
      }
    | undefined
  >(undefined)

  useEffect(() => {
    loadReviewData()
  }, [unwrappedParams.id])

  const loadReviewData = async () => {
    try {
      setLoading(true)
      const response = await expertReviewApi.getById(Number(unwrappedParams.id))

      if (response.data) {
        setReviewData(response.data)
        console.log("response.data>>>"+JSON.stringify(response.data))
        // Loading leader info
        const projectId = response.data.projectId
        if (projectId) {
          const leaderResponse = await expertVoteApi.getVoteResult(projectId)
          if (leaderResponse.data) {
            const leaderInfo = leaderResponse.data.find((expert: any) => expert.isLeader)
            if (leaderInfo) {
              setLeaderName(leaderInfo.expertName)
              const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
              const isCurrentUserLeader = currentUser.id === leaderInfo.expertId
              setIsLeader(isCurrentUserLeader)
            }
          }
        }
      } else {
        toast({
          title: "加载失败",
          description: response.message || "未找到评审数据，请返回列表重新进入",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Failed to load review data:", error)
      toast({
        title: "加载失败",
        description: error.message || "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVoteComplete = (leader: string, isCurrentUserLeader: boolean) => {
    setLeaderName(leader)
    setIsLeader(isCurrentUserLeader)
    setCurrentStep(2)
  }

  const handleReviewComplete = () => {
    setCurrentStep(3)
    setReviewData(reviewData)
  }

  const steps = [
    { id: 1, name: "选举组长", description: "投票选出专家组长" },
    { id: 2, name: "项目评审", description: "评分和评价项目" },
    { id: 3, name: "评审结论", description: "提交最终结论" },
  ]

  const projectInfo = reviewData
    ? {
        name: reviewData.projectName || "未命名项目",
        code: reviewData.projectId ? `PRJ${reviewData.projectId}` : "N/A",
      }
    : {
        name: "加载失败",
        code: "N/A",
      }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!reviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">评审数据不存在</p>
          <Link href="/expert/review">
            <Button>返回列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="专家评审系统"
          description={`${projectInfo.name} · ${projectInfo.code}`}
          showBack
          backUrl="/expert/review"
          actions={
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              评审中
            </Badge>
          }
        />

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep > step.id
                          ? "bg-success text-success-foreground"
                          : currentStep === step.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={`text-sm font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-full mx-4 transition-all ${currentStep > step.id ? "bg-success" : "bg-muted"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="transition-all duration-300">
          {currentStep === 1 && <VoteLeaderStep onComplete={handleVoteComplete} reviewData={reviewData} />}
          {currentStep === 2 && <ProjectReviewStep onComplete={handleReviewComplete} reviewData={reviewData} />}
          {currentStep === 3 && (
            <FinalConclusionStep
              isLeader={isLeader}
              leaderName={leaderName}
              existingConclusion={existingConclusion}
              reviewId={unwrappedParams.id}
              reviewData={reviewData}
            />
          )}
        </div>
      </div>
    </div>
  )
}
