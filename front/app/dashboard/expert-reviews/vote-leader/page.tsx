"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { expertReviewApi } from "@/lib/api/expert-review"
import { authStorage } from "@/lib/auth-storage"
import { Users, Trophy, CheckCircle2 } from "lucide-react"

interface ExpertVote {
  expertId: number
  expertName: string
  institution: string
  title: string
  voteCount: number
  isMe: boolean
}

export default function VoteLeaderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams?.get("projectId")

  const [loading, setLoading] = useState(false)
  const [voting, setVoting] = useState(false)
  const [experts, setExperts] = useState<ExpertVote[]>([])
  const [selectedExpertId, setSelectedExpertId] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    if (projectId) {
      loadVoteData()
    }
  }, [projectId])

  const loadVoteData = async () => {
    try {
      setLoading(true)
      const user = authStorage.getUser()

      const response = await expertReviewApi.getVoteData(Number(projectId))

      if (response.data) {
        setExperts(response.data.experts || [])
        setHasVoted(response.data.hasVoted || false)
        setProjectName(response.data.projectName || "")

        // 如果已投票，显示当前投票对象
        if (response.data.votedExpertId) {
          setSelectedExpertId(response.data.votedExpertId)
        }
      }
    } catch (error) {
      console.error("[v0] 加载投票数据失败:", error)
      toast.error("加载投票数据失败")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    if (!selectedExpertId) {
      toast.error("请选择要投票的专家")
      return
    }

    try {
      setVoting(true)

      const response = await expertReviewApi.voteForLeader({
        projectId: Number(projectId),
        expertId: selectedExpertId,
      })

      if (response.data) {
        toast.success("投票成功")
        await loadVoteData() // 重新加载数据
        setHasVoted(true)
      }
    } catch (error) {
      console.error("[v0] 投票失败:", error)
      toast.error("投票失败")
    } finally {
      setVoting(false)
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
          <h1 className="text-3xl font-bold">专家组长投票</h1>
          <p className="text-muted-foreground mt-2">项目：{projectName || "未知项目"}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            专家列表
          </CardTitle>
          <CardDescription>
            {hasVoted ? "您已完成投票，以下是当前投票结果" : "请选择您认为合适的专家组长"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {experts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无专家信息</div>
          ) : (
            experts.map((expert) => (
              <div
                key={expert.expertId}
                className={`p-4 border rounded-lg transition-all cursor-pointer ${
                  selectedExpertId === expert.expertId ? "border-primary bg-primary/5" : "hover:border-primary/50"
                } ${hasVoted && !expert.isMe ? "cursor-not-allowed opacity-60" : ""}`}
                onClick={() => {
                  if (!hasVoted) {
                    setSelectedExpertId(expert.expertId)
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{expert.expertName}</h3>
                      {expert.isMe && (
                        <Badge variant="outline" className="text-xs">
                          我
                        </Badge>
                      )}
                      {selectedExpertId === expert.expertId && !hasVoted && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {expert.institution} · {expert.title}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold">{expert.voteCount}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">得票数</div>
                  </div>
                </div>
              </div>
            ))
          )}

          {!hasVoted && experts.length > 0 && (
            <div className="pt-4">
              <Button onClick={handleVote} disabled={!selectedExpertId || voting} className="w-full">
                {voting ? "提交中..." : "确认投票"}
              </Button>
            </div>
          )}

          {hasVoted && (
            <div className="pt-4 text-center text-sm text-muted-foreground">您已完成投票，得票最高的专家将担任组长</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
