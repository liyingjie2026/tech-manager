import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, PieChart, TrendingUp, Users, FileText, Award } from "lucide-react"

export default function OverviewPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">项目总览</h1>
        <p className="text-sm text-muted-foreground mt-1">科研项目全局数据统计分析</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">项目总数</p>
                <p className="text-3xl font-bold mt-2">256</p>
                <p className="text-xs text-muted-foreground mt-2">较去年增长 12%</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">参与机构</p>
                <p className="text-3xl font-bold mt-2">68</p>
                <p className="text-xs text-muted-foreground mt-2">新增 5 家机构</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总预算</p>
                <p className="text-3xl font-bold mt-2">1.2亿</p>
                <p className="text-xs text-muted-foreground mt-2">执行率 68%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">优秀项目</p>
                <p className="text-3xl font-bold mt-2">45</p>
                <p className="text-xs text-muted-foreground mt-2">占比 17.6%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              项目类型分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "重大项目", count: 45, ratio: 17.6, color: "bg-blue-500" },
                { type: "应用技术类", count: 98, ratio: 38.3, color: "bg-green-500" },
                { type: "青年项目", count: 76, ratio: 29.7, color: "bg-orange-500" },
                { type: "后补助项目", count: 37, ratio: 14.4, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-muted-foreground">
                      {item.count} 项 ({item.ratio}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.ratio}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              项目状态统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: "申报中", count: 18, color: "bg-yellow-500" },
                { status: "评审中", count: 12, color: "bg-orange-500" },
                { status: "执行中", count: 82, color: "bg-blue-500" },
                { status: "验收中", count: 15, color: "bg-purple-500" },
                { status: "已结题", count: 129, color: "bg-green-500" },
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.status}</span>
                  </div>
                  <Badge variant="secondary">{item.count} 项</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Institutions */}
      <Card>
        <CardHeader>
          <CardTitle>参与机构排行</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: "湖南大学", projectCount: 28, budget: 2800 },
              { rank: 2, name: "中南大学", projectCount: 25, budget: 2500 },
              { rank: 3, name: "湖南师范大学", projectCount: 18, budget: 1800 },
              { rank: 4, name: "湖南科技大学", projectCount: 15, budget: 1500 },
              { rank: 5, name: "湖南省地质研究所", projectCount: 12, budget: 1200 },
            ].map((institution) => (
              <div key={institution.rank} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">{institution.rank}</span>
                  </div>
                  <div>
                    <p className="font-medium">{institution.name}</p>
                    <p className="text-sm text-muted-foreground">{institution.projectCount} 个项目</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{institution.budget}万元</p>
                  <p className="text-sm text-muted-foreground">总预算</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Research Fields */}
      <Card>
        <CardHeader>
          <CardTitle>研究领域分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { field: "地质灾害防治", count: 45, institutions: 12 },
              { field: "国土空间规划", count: 38, institutions: 10 },
              { field: "矿产资源勘查", count: 32, institutions: 8 },
              { field: "测绘地理信息", count: 28, institutions: 9 },
              { field: "环境保护", count: 25, institutions: 7 },
              { field: "信息技术应用", count: 22, institutions: 6 },
            ].map((field) => (
              <Card key={field.field}>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{field.field}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{field.count} 个项目</span>
                    <Badge variant="outline">{field.institutions} 家机构</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
