import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, FileText, CheckSquare, AlertCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SupervisorDashboard() {
  const pendingItems = [
    {
      id: 1,
      type: "项目申报",
      title: "地质灾害防治技术研究",
      institution: "湖南大学",
      date: "2025-01-15",
      status: "待审核",
    },
    {
      id: 2,
      type: "中期检查",
      title: "国土空间规划信息化平台",
      institution: "中南大学",
      date: "2025-01-14",
      status: "待审核",
    },
    {
      id: 3,
      type: "项目变更",
      title: "自然资源数字化管理系统",
      institution: "湖南师范大学",
      date: "2025-01-13",
      status: "待审核",
    },
    {
      id: 4,
      type: "结题验收",
      title: "矿产资源勘查技术创新",
      institution: "湖南科技大学",
      date: "2025-01-12",
      status: "待审核",
    },
    {
      id: 5,
      type: "成果审核",
      title: "地质灾害预警系统研究成果",
      institution: "湖南大学",
      date: "2025-01-11",
      status: "待审核",
    },
  ]

  const statistics = [
    { title: "待审核项目", value: "12", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "进行中项目", value: "45", icon: Clock, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "待评审", value: "8", icon: CheckSquare, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "预警项目", value: "3", icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">工作台</h1>
          <p className="text-sm text-muted-foreground mt-1">欢迎回来，管理员</p>
        </div>
        <Button>
          <Bell className="mr-2 h-4 w-4" />
          通知中心
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Items */}
      <Card>
        <CardHeader>
          <CardTitle>待办事项</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{item.type}</Badge>
                    <span className="font-medium text-foreground">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.institution}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{item.status}</Badge>
                  <Button size="sm">处理</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
