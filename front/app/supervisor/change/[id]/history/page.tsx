"use client"

import { use } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ChangeHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const changeHistory = [
    {
      date: "2025-9-18 12:00:55",
      action: "胡歌",
      intent: "审核意见：同意变更",
      result: "审核结果：审核通过",
    },
    {
      date: "2025-9-18 12:00:55",
      action: "胡歌",
      intent: "审核意见：同意变更",
      result: "审核结果：审核通过",
    },
    {
      date: "2025-9-18 12:00:55",
      action: "胡歌",
      intent: "发起流程",
      additionalInfo: ["变更事项：1234555544344", "变更原因：1234555544344"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">项目变更记录</h1>
              <p className="text-sm text-muted-foreground">查看项目变更历史记录</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {changeHistory.map((item, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                  <div className="text-sm text-muted-foreground mb-2">{item.date}</div>
                  <div className="space-y-1">
                    <div className="font-medium">{item.action}</div>
                    {item.intent && <div className="text-sm">{item.intent}</div>}
                    {item.result && <div className="text-sm">{item.result}</div>}
                    {item.additionalInfo && (
                      <div className="mt-2 space-y-1">
                        {item.additionalInfo.map((info, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground">
                            {info}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
