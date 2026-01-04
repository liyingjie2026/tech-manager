"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Crown, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { expertVoteApi } from "@/lib/api"

interface Expert {
  id: string
  name: string
  title: string
  votes: number
}

interface VoteLeaderStepProps {
  onComplete: (leaderName: string, isLeader: boolean) => void
  reviewData?: any
}

export function VoteLeaderStep({ onComplete, reviewData }: VoteLeaderStepProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedExpert, setSelectedExpert] = useState("")
  const [showResults, setShowResults] = useState(false)

  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExperts()
  }, [reviewData])

  const loadExperts = async () => {
    try {
      setLoading(true)

      if (!reviewData?.projectId) {
        console.log("[v0] No projectId in reviewData")
        setLoading(false)
        return
      }

      console.log("[v0] Loading experts for project:", reviewData.projectId)
      const response = await expertVoteApi.getVoteResult(reviewData.projectId)

      if (response.data && Array.isArray(response.data)) {
        const expertList = response.data.map((item: any) => ({
          id: String(item.expertId),
          name: item.expertName,
          title: item.expertTitle || "专家",
          votes: item.voteCount || 0,
        }))

        setExperts(expertList)
        console.log("[v0] Loaded experts:", expertList)

        // Check if already voted
        const hasAlreadyVoted = response.data.some((item: any) => item.hasVoted)
        if (hasAlreadyVoted || expertList.some((e: any) => e.votes > 0)) {
          setHasVoted(true)
          setShowResults(true)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load experts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    if (!selectedExpert || !reviewData?.projectId) return

    try {
      await expertVoteApi.vote({
        projectId: reviewData.projectId,
        votedExpertId: Number(selectedExpert),
      })

      toast({
        title: "投票成功",
        description: "您的投票已提交",
      })

      setHasVoted(true)

      // Reload vote results
      setTimeout(async () => {
        await loadExperts()
        setShowResults(true)
      }, 1000)
    } catch (error) {
      console.error("[v0] Vote failed:", error)
      toast({
        title: "投票失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleConfirm = () => {
    const leader = [...experts].sort((a, b) => b.votes - a.votes)[0]
    const isCurrentUserLeader = Math.random() < 0.3
    onComplete(leader.name, isCurrentUserLeader)
  }

  const sortedExperts = [...experts].sort((a, b) => b.votes - a.votes)
  const totalVotes = experts.reduce((sum, expert) => sum + expert.votes, 0)
  const leader = sortedExperts[0]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle>选举专家组长</CardTitle>
          </div>
          <CardDescription>加载专家信息中...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>正在加载专家列表...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (experts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle>选举专家组长</CardTitle>
          </div>
          <CardDescription>专家信息加载完成</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-destructive/10 border-destructive/30">
            <AlertDescription className="text-destructive-foreground">
              当前评审组暂无专家信息。请联系管理员检查专家分配。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle>选举专家组长</CardTitle>
          </div>
          <CardDescription>请投票选出本次评审的专家组长</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasVoted ? (
            <>
              <RadioGroup value={selectedExpert} onValueChange={setSelectedExpert}>
                <div className="space-y-3">
                  {experts.map((expert) => (
                    <Label
                      key={expert.id}
                      htmlFor={expert.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <RadioGroupItem value={expert.id} id={expert.id} />
                        <div>
                          <p className="font-medium text-foreground">{expert.name}</p>
                          <p className="text-sm text-muted-foreground">{expert.title}</p>
                        </div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
              <Button onClick={handleVote} disabled={!selectedExpert} className="w-full" size="lg">
                提交投票
              </Button>
            </>
          ) : (
            <>
              {!showResults ? (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>等待其他专家投票中...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-success/10 border-success/30">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success-foreground">
                      投票已完成，共有 {totalVotes} 位专家参与投票
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground">投票结果</h3>
                    {sortedExperts.map((expert, index) => (
                      <div
                        key={expert.id}
                        className={`flex items-center justify-between p-4 border rounded-lg ${
                          index === 0 ? "border-accent bg-accent/5" : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {index === 0 && <Crown className="w-5 h-5 text-accent" />}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{expert.name}</p>
                              {index === 0 && (
                                <Badge variant="default" className="bg-accent text-accent-foreground">
                                  当选组长
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{expert.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-foreground">{expert.votes}</p>
                          <p className="text-xs text-muted-foreground">票</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleConfirm} className="w-full" size="lg">
                    确认结果，进入下一步
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
