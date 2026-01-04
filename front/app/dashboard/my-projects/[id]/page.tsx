"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TableHeader } from "@/components/ui/table"
import { formatDate } from "@/lib/utils/date-format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Calendar, Users, CheckCircle, Clock, FileText, TrendingUp, Target, Package } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { projectApi } from "@/lib/api/project"
import type { Project } from "@/lib/api/types"
import { getStatusColor, getStatusText } from "@/lib/utils/status-maps"
import { PageHeader } from "@/components/page-header"

interface ProjectDetail extends Project {
  institutionName?: string
  leaderName?: string
  leaderPhone?: string
  statusName?: string
  auditStatus?: string
  workflowStage?: string
  auditComment?: string
}

const projectTypeMap: Record<string, string> = {
  basic_research: "基础研究",
  applied_research: "应用研究",
  experimental_development: "试验发展",
  technology_development: "技术开发",
  soft_science: "软科学研究",
  other: "其他",
}

const getProjectTypeText = (type: string): string => {
  return projectTypeMap[type] || type || "-"
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [budgetData, setBudgetData] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getById(Number(id))
        if (response.data) {
          setProject(response.data)
        }
        // TODO: Load budget, achievements, and milestones data from API
        // const budgetResponse = await projectApi.getBudget(Number(id))
        // setBudgetData(budgetResponse.data || [])
      } catch (error) {
        console.error("Failed to load project data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const formatMoney = (amount: number): string => {
    return `¥${(amount / 10000).toFixed(2)}万元`
  }

  const handleEdit = () => {
    // 跳转到项目编辑页面
    router.push(`/dashboard/projects/apply?id=${params.id}`)
  }

  const loadProjectDetail = async () => {
    try {
      setLoading(true)
      const response = await projectApi.getById(Number(params.id))
      if (response.data) {
        setProject(response.data)
      }
    } catch (error) {
      console.error("Failed to load project:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjectDetail()
  }, [params.id])

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  if (!project) {
    return <div className="p-6">项目不存在</div>
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/my-projects">我的项目</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>项目详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title={project.name}
        description={
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> {project.projectNo}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {project.institutionName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {project.leaderName}
            </span>
            <Badge variant="secondary" className={cn("bg-blue-100 text-blue-700", getStatusColor(project.status))}>
              {getStatusText(project.status, "project")}
            </Badge>
          </div>
        }
        showBack
        backUrl="/dashboard/my-projects"
        backText="返回列表"
        actions={<Button onClick={handleEdit}>编辑项目</Button>}
      />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:w-auto">
          <TabsTrigger value="overview">项目概览</TabsTrigger>
          <TabsTrigger value="content">研究内容</TabsTrigger>
          <TabsTrigger value="budget">预算执行</TabsTrigger>
          <TabsTrigger value="progress">进度管理</TabsTrigger>
          <TabsTrigger value="team">团队成员</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Basic Info - 使用正确的字段名 */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">项目编号</span>
                    <p className="font-medium">{project.projectNo || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">项目类型</span>
                    <p className="font-medium">{getProjectTypeText(project.projectType)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">项目类别</span>
                    <p className="font-medium">{project.projectCategory || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">研究领域</span>
                    <p className="font-medium">{project.researchField || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">牵头单位</span>
                    <p className="font-medium">{project.institutionName || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">项目负责人</span>
                    <p className="font-medium">{project.leaderName || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">联系电话</span>
                    <p className="font-medium">{project.leaderPhone || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">起止时间</span>
                    <p className="font-medium">
                      {formatDate(project.startDate)} 至 {formatDate(project.endDate)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">总预算</span>
                    <p className="font-medium text-blue-600">{formatMoney(project.totalBudget)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">申请预算</span>
                    <p className="font-medium">{formatMoney(project.applyFunding)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">自筹经费</span>
                    <p className="font-medium">{formatMoney(project.selfFunding)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">查重率</span>
                    <p className="font-medium">
                      {project.duplicateRate != null ? `${project.duplicateRate.toFixed(2)}%` : "-"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">研究目标</h3>
                    <p className="text-sm leading-relaxed">{project.researchObjective || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">研究内容</h3>
                    <p className="text-sm leading-relaxed">{project.researchContent || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column: Status & Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>项目状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>当前状态</span>
                      <Badge variant="secondary">{getStatusText(project.status, "project")}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>审核状态</span>
                      <Badge variant="outline">{getStatusText(project.auditStatus, "audit")}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>工作流阶段</span>
                      <span>{project.workflowStage || "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>提交时间</span>
                      <span>{formatDate(project.submitTime)}</span>
                    </div>
                    {project.auditComment && (
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">审核意见</span>
                        <p className="text-sm bg-muted/30 p-2 rounded">{project.auditComment}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>快捷入口</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <FileText className="mr-2 h-4 w-4" /> 查看申报书
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" /> 任务分解
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" /> 经费明细
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Clock className="mr-2 h-4 w-4" /> 变更记录
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                研究目标
              </CardTitle>
            </CardHeader>
            <CardContent>{project.researchObjective || "暂无项目目标信息"}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                研究内容
              </CardTitle>
            </CardHeader>
            <CardContent>{project.researchContent || "暂无研究内容信息"}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>经费预算执行情况</CardTitle>
            </CardHeader>
            <CardContent>
              {!budgetData || budgetData.length === 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">总预算</div>
                      <div className="text-2xl font-bold">{formatMoney(project.totalBudget)}</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">申请预算</div>
                      <div className="text-2xl font-bold">{formatMoney(project.applyFunding)}</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">自筹经费</div>
                      <div className="text-2xl font-bold">{formatMoney(project.selfFunding)}</div>
                    </div>
                  </div>
                  <div className="text-center text-muted-foreground py-4">暂无详细预算执行数据</div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {budgetData.map((item, index) => (
                      <div key={index} className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">{item.item}</div>
                        <div className="flex justify-between items-end">
                          <span className="text-2xl font-bold">{formatMoney(item.used)}</span>
                          <span className="text-xs text-muted-foreground">/ {formatMoney(item.budget)}</span>
                        </div>
                        <Progress value={item.rate} className="h-2" />
                        <div className="text-xs text-right text-muted-foreground">{item.rate}%</div>
                      </div>
                    ))}
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>支出科目</TableHead>
                          <TableHead className="text-right">预算金额(元)</TableHead>
                          <TableHead className="text-right">已执行金额(元)</TableHead>
                          <TableHead className="text-right">执行率</TableHead>
                          <TableHead className="text-right">结余金额(元)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {budgetData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.item}</TableCell>
                            <TableCell className="text-right">{item.budget.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{item.used.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{item.rate}%</TableCell>
                            <TableCell className="text-right">{(item.budget - item.used).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>实施进度监控</CardTitle>
            </CardHeader>
            <CardContent>
              {milestones.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">暂无进度数据</div>
              ) : (
                <div className="relative border-l-2 border-muted ml-4 space-y-8 py-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-8">
                      <div
                        className={cn(
                          "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background",
                          milestone.status === "completed"
                            ? "border-green-500 bg-green-500"
                            : milestone.status === "in-progress"
                              ? "border-blue-500 bg-blue-50"
                              : "border-muted-foreground",
                        )}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className={cn("font-medium", milestone.status === "pending" && "text-muted-foreground")}>
                            {milestone.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{milestone.date}</p>
                        </div>
                        <Badge
                          variant={
                            milestone.status === "completed"
                              ? "default"
                              : milestone.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {milestone.status === "completed"
                            ? "已完成"
                            : milestone.status === "in-progress"
                              ? "进行中"
                              : "未开始"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>团队成员</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: Implement team members section */}
              <div className="text-center text-muted-foreground py-8">暂无团队成员数据</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
