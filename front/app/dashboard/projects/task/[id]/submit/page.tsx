"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TaskSubmitPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "提交成功",
        description: "任务书已提交审核，状态已更新为已签订",
      })
      router.push("/dashboard/projects/task")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">提交审核</h1>
              <p className="text-sm text-muted-foreground">确认提交任务书进行审核</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">确认提交审核</h3>
                <p className="text-muted-foreground">提交后，任务书状态将变更为"已签订"，并进入审核流程。</p>
                <p className="text-muted-foreground mt-2">请确认所有信息填写完整且任务书已上传。</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            取 消
          </Button>
          <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "提交中..." : "确认提交"}
          </Button>
        </div>
      </div>
    </div>
  )
}
