"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

export default function TaskProgressPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  const [progressData, setProgressData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true)
        // TODO: Call API to load task progress data
        // const response = await taskbookApi.getProgress(id)
        // setProgressData(response.data)
      } catch (error) {
        console.error("Failed to load progress data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [id])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">任务书审核进度</h1>
              <p className="text-sm text-muted-foreground">查看任务书流程流转进度</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">流程进度</h2>
            <div className="space-y-6">
              {progressData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">暂无流程数据</div>
              ) : (
                progressData.map((item, index) => (
                  <div key={index} className="relative pl-8">
                    <div
                      className={`absolute left-0 top-2 w-4 h-4 rounded-full ${
                        item.status === "已提交" || item.status === "审核通过"
                          ? "bg-green-500"
                          : item.status === "审核中"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                      }`}
                    />
                    {index < progressData.length - 1 && (
                      <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-border" />
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{item.step}</span>
                        <Badge
                          variant={item.status === "已提交" || item.status === "审核通过" ? "default" : "secondary"}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">操作人：{item.operator}</div>
                      <div className="text-sm text-muted-foreground">操作时间：{item.time}</div>
                      {item.comment && <div className="text-sm bg-muted p-2 rounded">批语：{item.comment}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6">
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            返 回
          </Button>
        </div>
      </div>
    </div>
  )
}
