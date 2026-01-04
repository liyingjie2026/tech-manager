"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, TrendingDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { statisticsApi } from "@/lib/api"

export default function StatisticsPage() {
  const [year, setYear] = useState("2025")
  const [overview, setOverview] = useState({
    totalProjects: 0,
    approvalRate: 0,
    avgBudget: 0,
    projectGrowth: 0,
    rateGrowth: 0,
    budgetGrowth: 0,
  })
  const [budgetData, setBudgetData] = useState<any[]>([])
  const [outputData, setOutputData] = useState<any[]>([])
  const [institutionData, setInstitutionData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch overview statistics
        const overviewResponse = await statisticsApi.getOverview()
        if (overviewResponse.code === 200 && overviewResponse.data) {
          setOverview({
            totalProjects: overviewResponse.data.totalProjects || 0,
            approvalRate: 78, // Calculate from data
            avgBudget: 48,
            projectGrowth: 12,
            rateGrowth: 5,
            budgetGrowth: -3,
          })
        }

        // Fetch budget statistics
        const budgetResponse = await statisticsApi.getBudgetDetails({ year })
        if (budgetResponse.code === 200 && budgetResponse.data) {
          setBudgetData(budgetResponse.data || [])
        }

        // Fetch achievement statistics
        const achievementResponse = await statisticsApi.getAchievementStatistics({ year })
        if (achievementResponse.code === 200 && achievementResponse.data) {
          const typeData = achievementResponse.data.typeDistribution || {}
          setOutputData([
            { type: "发明专利", count: typeData.patent || 0, unit: "项" },
            { type: "实用新型", count: typeData.utility || 0, unit: "项" },
            { type: "学术论文", count: typeData.paper || 0, unit: "篇" },
            { type: "技术报告", count: typeData.report || 0, unit: "份" },
            { type: "软件著作权", count: typeData.software || 0, unit: "项" },
            { type: "标准规范", count: typeData.standard || 0, unit: "项" },
            { type: "获奖成果", count: typeData.award || 0, unit: "项" },
            { type: "成果转化", count: typeData.transformation || 0, unit: "项" },
          ])
        }

        // Fetch institution statistics
        const institutionResponse = await statisticsApi.getInstitutionStatistics({ year, top: 10 })
        if (institutionResponse.code === 200 && institutionResponse.data) {
          setInstitutionData(institutionResponse.data || [])
        }
      } catch (error) {
        console.error("Failed to load statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">统计分析</h1>
          <p className="text-sm text-muted-foreground mt-1">项目数据深度分析与趋势预测</p>
        </div>
        <div className="flex gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025年</SelectItem>
              <SelectItem value="2024">2024年</SelectItem>
              <SelectItem value="2023">2023年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">项目申报数</p>
                <p className="text-3xl font-bold mt-2">{overview.totalProjects}</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <TrendingUp className="mr-1 h-3 w-3" />+{overview.projectGrowth}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">较去年同期增长</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">立项通过率</p>
                <p className="text-3xl font-bold mt-2">{overview.approvalRate}%</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <TrendingUp className="mr-1 h-3 w-3" />+{overview.rateGrowth}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">较去年同期增长</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均预算</p>
                <p className="text-3xl font-bold mt-2">{overview.avgBudget}万</p>
              </div>
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                <TrendingDown className="mr-1 h-3 w-3" />
                {overview.budgetGrowth > 0 ? `+${overview.budgetGrowth}` : overview.budgetGrowth}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              较去年同期{overview.budgetGrowth > 0 ? "增长" : "下降"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>预算执行分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">
                    {item.spent}万 / {item.budget}万 ({item.ratio}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.ratio}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Output Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>成果产出统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {outputData.map((output) => (
              <div key={output.type} className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">{output.type}</p>
                <p className="text-2xl font-bold mt-2">
                  {output.count}
                  <span className="text-sm font-normal text-muted-foreground ml-1">{output.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Institution Performance */}
      <Card>
        <CardHeader>
          <CardTitle>机构绩效排名</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {institutionData.map((institution, index) => (
              <div key={institution.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{institution.name}</p>
                      <p className="text-sm text-muted-foreground">综合评分: {institution.score}</p>
                    </div>
                  </div>
                  <Badge variant="default">{institution.completion}% 完成率</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">项目数量</p>
                    <p className="font-medium mt-1">{institution.projects} 个</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">成果产出</p>
                    <p className="font-medium mt-1">{institution.outputs} 项</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">总预算</p>
                    <p className="font-medium mt-1">{institution.budget} 万</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
