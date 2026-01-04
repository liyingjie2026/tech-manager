import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, FileCheck, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ExpertDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">专家工作台</h1>
        <p className="text-sm text-muted-foreground mt-1">欢迎回来，查看您的评审任务和工作进度</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">待评审</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">1</div>
              <div className="text-sm text-muted-foreground">评审中</div>
            </div>
          </div>
        </Card>

        <Link href="/expert/history">
          <Card className="p-6 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm text-muted-foreground">已完成</div>
              </div>
            </div>
          </Card>
        </Link>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">29</div>
              <div className="text-sm text-muted-foreground">总评审</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">待评审项目</h3>
              <p className="text-sm text-muted-foreground mb-4">您有 3 个项目等待评审，请及时完成评审工作</p>
              <Link href="/expert/review">
                <Button>查看待评审项目</Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <FileCheck className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">评审历史</h3>
              <p className="text-sm text-muted-foreground mb-4">查看您过往的评审记录和评审意见</p>
              <Link href="/expert/history">
                <Button variant="outline">查看评审历史</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">最近评审</h3>
        <div className="space-y-4">
          {[
            {
              id: 1,
              project: "项目数据融合技术研究",
              type: "重大项目",
              status: "pending",
              deadline: "2025-02-28",
            },
            {
              id: 2,
              project: "自然资源大数据平台建设",
              type: "应用技术类",
              status: "pending",
              deadline: "2025-03-05",
            },
            {
              id: 3,
              project: "地质灾害智能监测系统",
              type: "青年项目",
              status: "reviewing",
              deadline: "2025-03-10",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{item.project}</h4>
                  <span className="text-xs text-muted-foreground">· {item.type}</span>
                </div>
                <div className="text-sm text-muted-foreground">截止时间: {item.deadline}</div>
              </div>
              <div className="flex items-center gap-3">
                {item.status === "pending" && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">待评审</span>
                  </div>
                )}
                {item.status === "reviewing" && (
                  <div className="flex items-center gap-1 text-blue-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">评审中</span>
                  </div>
                )}
                <Link href={`/expert/review/${item.id}`}>
                  <Button size="sm">{item.status === "pending" ? "开始评审" : "继续评审"}</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
