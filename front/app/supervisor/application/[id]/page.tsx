"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, FileText, Download } from "lucide-react"
import { useState, useEffect } from "react"
import {useParams, useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { projectApi } from "@/lib/api/project"
import { PageHeader } from "@/components/page-header"

export default function ApplicationReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState<any>(null)

  useEffect(() => {
    loadProjectData()
  }, [params.id])

  const loadProjectData = async () => {
    try {
      setLoading(true)
      const response = await projectApi.getById(Number(params.id))

      if (!response.data) {
        toast({
          title: "项目不存在",
          description: "无法找到该项目信息，请检查项目ID是否正确",
          variant: "destructive",
        })
        setProjectData(null)
        return
      }

      setProjectData(response.data)
    } catch (error) {
      console.error("[v0] Failed to load project:", error)
      toast({
        title: "加载失败",
        description: "系统异常，请联系管理员",
        variant: "destructive",
      })
      setProjectData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: "操作失败",
        description: "请输入驳回原因",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await projectApi.preliminaryReview(Number(params.id), {
        passed: false,
        comment: rejectReason,
      })

      if (response.data) {
        toast({
          title: "操作成功",
          description: "项目已驳回",
        })
        setShowRejectDialog(false)
        setTimeout(() => router.push("/supervisor/application"), 1500)
      }
    } catch (error) {
      console.error("Failed to reject:", error)
      toast({
        title: "操作失败",
        description: "驳回失败，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleApprove = async () => {
    try {
      const response = await projectApi.preliminaryReview(Number(params.id), {
        passed: true,
        comment: "初审通过",
      })

      if (response.data) {
        toast({
          title: "操作成功",
          description: "项目初审通过",
        })
        setShowApproveDialog(false)
        setTimeout(() => router.push("/supervisor/application"), 1500)
      }
    } catch (error) {
      console.error("Failed to approve:", error)
      toast({
        title: "操作失败",
        description: "审批失败，请稍后重试",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">项目不存在</p>
          <Button onClick={() => router.back()}>返回</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="项目详情"
        description={`项目编号: ${projectData.projectNo || params.id}`}
        showBack
        backUrl="/supervisor/application"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
              <XCircle className="h-4 w-4 mr-2" />
              驳回
            </Button>
            <Button onClick={() => setShowApproveDialog(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              通过
            </Button>
          </>
        }
      />

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="summary">汇总表</TabsTrigger>
          <TabsTrigger value="situation">项目情况</TabsTrigger>
          <TabsTrigger value="institution">申报单位</TabsTrigger>
          <TabsTrigger value="members">项目成员</TabsTrigger>
          <TabsTrigger value="background">研究背景</TabsTrigger>
          <TabsTrigger value="implementation">实施计划</TabsTrigger>
          <TabsTrigger value="performance">绩效指标</TabsTrigger>
          <TabsTrigger value="budget">预算填报</TabsTrigger>
          <TabsTrigger value="attachments">其它附件</TabsTrigger>
        </TabsList>

        {/* Tab 1: 汇总表 - Using real data */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>项目汇总信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">项目名称</Label>
                  <p className="mt-1 font-medium">{projectData.name}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">申报批次</Label>
                  <p className="mt-1">{projectData.projectBatch || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">项目负责人</Label>
                  <p className="mt-1">{projectData.leaderName}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">联系电话</Label>
                  <p className="mt-1">{projectData.leaderPhone}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">项目预算</Label>
                  <p className="mt-1 font-semibold text-primary">{projectData.totalBudget}万元</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">实施周期</Label>
                  <p className="mt-1">
                    {projectData.startDate} 至 {projectData.endDate}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div>
                  <Label className="text-muted-foreground">支持方向</Label>
                  <p className="mt-1">{projectData.projectCategory || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">支持方向说明</Label>
                  <p className="mt-1 text-sm leading-relaxed">{projectData.researchField || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">目的意义 (150字以内)</Label>
                  <p className="mt-1 text-sm leading-relaxed">{projectData.objective || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">拟解决问题 (100字以内)</Label>
                  <p className="mt-1 text-sm leading-relaxed">{projectData.content || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">主要研究内容 (150字以内)</Label>
                  <p className="mt-1 text-sm leading-relaxed">{projectData.content || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">主要进度安排 (150字以内)</Label>
                  <p className="mt-1 text-sm leading-relaxed">{projectData.expectedResult || "暂无"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 项目情况 */}
        <TabsContent value="situation">
          <Card>
            <CardHeader>
              <CardTitle>项目详细情况</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-muted-foreground">项目名称</Label>
                <p className="mt-1 font-medium">{projectData.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">申请类型</Label>
                  <p className="mt-1">{projectData.innovationPlatform || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">项目类别</Label>
                  <p className="mt-1">{projectData.projectCategory || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">项目类型（科研类）</Label>
                  <p className="mt-1">{projectData.researchField || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">项目类型</Label>
                  <p className="mt-1">{projectData.projectType || "暂无"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">项目开始时间</Label>
                  <p className="mt-1">{projectData.startDate}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">项目截止时间</Label>
                  <p className="mt-1">{projectData.endDate}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">项目总预算（万元）</Label>
                  <p className="mt-1 font-semibold text-primary">{projectData.totalBudget}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">申请专项经费（万元）</Label>
                  <p className="mt-1 font-semibold text-primary">{projectData.applyBudget}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">自筹/其他资金（万元）</Label>
                  <p className="mt-1">{projectData.selfBudget}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">项目的目的和意义 (限300字)</Label>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">{projectData.objective || "暂无"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">拟解决的关键问题 (限100字)</Label>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                  {projectData.innovationPoints || "暂无"}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">项目主要研究内容 (限150字)</Label>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">{projectData.content || "暂无"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">主要进度安排 (限150字)</Label>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                  {projectData.expectedResult || "暂无"}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">现有工作基础与优势 (限800字)</Label>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                  {projectData.applicationProspects || "暂无"}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">项目的组织实施与保障措施 (限500字)</Label>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">暂无</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 申报单位 - Updated to match research side with auto-fill logic */}
        <TabsContent value="institution">
          <Card>
            <CardHeader>
              <CardTitle>申报单位信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="font-semibold mb-4">一、申报单位信息</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-muted-foreground">单位名称</Label>
                    <p className="mt-1">{projectData.institutionName || projectData.institution}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">单位性质</Label>
                    <p className="mt-1">{projectData.institutionNature || "事业单位"}</p>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-muted-foreground">统一社会信用代码</Label>
                    <p className="mt-1 font-mono">{projectData.institutionCreditCode || "123456789012345678"}</p>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-muted-foreground">通讯地址</Label>
                    <p className="mt-1">
                      {projectData.institutionAddress || "湖南省长沙市天心区芙蓉南路地质信息产业园总部基地"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-muted-foreground">单位所在地</Label>
                    <p className="mt-1">
                      {projectData.institutionLocation || "湖南省长沙市天心区芙蓉南路地质信息产业园总部基地"}
                    </p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">法人代表</Label>
                    <p className="mt-1">{projectData.institutionLegalRep || "赵强"}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">联系人</Label>
                    <p className="mt-1">{projectData.institutionContactPerson || "李明"}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">联系电话</Label>
                    <p className="mt-1">{projectData.institutionContactPhone || "0731-88888888"}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">电子邮箱</Label>
                    <p className="mt-1">{projectData.institutionEmail || "contact@hn2survey.com"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">二、参与单位信息</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>序号</TableHead>
                        <TableHead>单位名称</TableHead>
                        <TableHead>单位性质</TableHead>
                        <TableHead>统一社会信用代码</TableHead>
                        <TableHead>通讯地址</TableHead>
                        <TableHead>单位所在地</TableHead>
                        <TableHead>法人代表</TableHead>
                        <TableHead>联系电话</TableHead>
                        <TableHead>手机</TableHead>
                        <TableHead>电子邮箱</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectData.cooperativeInstitutions?.map((inst: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{inst.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{inst.nature}</Badge>
                          </TableCell>
                          <TableCell className="font-mono">{inst.creditCode}</TableCell>
                          <TableCell>{inst.address}</TableCell>
                          <TableCell>{inst.location}</TableCell>
                          <TableCell>{inst.legalRep}</TableCell>
                          <TableCell>{inst.phone}</TableCell>
                          <TableCell>{inst.mobile}</TableCell>
                          <TableCell>{inst.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 项目成员 - Updated table structure to match research side */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>项目团队成员</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>序号</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>性别</TableHead>
                      <TableHead>出生年月</TableHead>
                      <TableHead>证件类型</TableHead>
                      <TableHead>证件号</TableHead>
                      <TableHead>民族</TableHead>
                      <TableHead>单位/职称</TableHead>
                      <TableHead>职责/职务</TableHead>
                      <TableHead>所在部门</TableHead>
                      <TableHead>学位</TableHead>
                      <TableHead>毕业院校</TableHead>
                      <TableHead>联系电话</TableHead>
                      <TableHead>手机</TableHead>
                      <TableHead>电子邮箱</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectData.members?.map((member: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.gender}</TableCell>
                        <TableCell>{member.birthDate}</TableCell>
                        <TableCell>{member.idType}</TableCell>
                        <TableCell>{member.idNumber}</TableCell>
                        <TableCell>{member.ethnicity}</TableCell>
                        <TableCell>{member.unitTitle}</TableCell>
                        <TableCell>{member.duty}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>{member.degree}</TableCell>
                        <TableCell>{member.graduationSchool}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>{member.mobile}</TableCell>
                        <TableCell>{member.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: 研究背景 - Removed institution columns from representative projects table */}
        <TabsContent value="background">
          <Card>
            <CardHeader>
              <CardTitle>研究背景与基础</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-muted-foreground">项目负责人研究背景</Label>
                <p className="mt-2 text-sm leading-relaxed">
                  {projectData.leaderBackground ||
                    "项目负责人张教授长期从事地质灾害监测预警技术研究，在地质灾害防治领域具有深厚的研究基础。主持过多项国家级和省级科研项目，在地质灾害监测预警技术方面取得了一系列创新成果。发表学术论文30余篇，其中SCI/EI收录15篇，获得授权发明专利5项。"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">项目负责人及团队成员承担的代表性科研项目</h3>
                <div className="border rounded-lg overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>序号</TableHead>
                        <TableHead>项目名称</TableHead>
                        <TableHead>项目来源</TableHead>
                        <TableHead>经费（万元）</TableHead>
                        <TableHead>起止时间</TableHead>
                        <TableHead>承担角色</TableHead>
                        <TableHead>结题情况</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectData.projects?.map((proj: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{proj.name}</TableCell>
                          <TableCell>{proj.source}</TableCell>
                          <TableCell>{proj.budget}</TableCell>
                          <TableCell>
                            {proj.startDate} 至 {proj.endDate}
                          </TableCell>
                          <TableCell>{proj.role}</TableCell>
                          <TableCell>
                            <Badge
                              variant={proj.status === "已结题" ? "outline" : "secondary"}
                              className={
                                proj.status === "已结题" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                              }
                            >
                              {proj.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">项目负责人代表性论文/专利</h3>
                <div className="space-y-3">
                  {projectData.publications?.map((pub: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{pub.title}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                            <span>{pub.authors}</span>
                            <span>•</span>
                            <span>{pub.journal}</span>
                            {pub.volume && (
                              <>
                                <span>•</span>
                                <span>{pub.volume}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{pub.year}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{pub.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">现有研究基础与条件</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {projectData.foundation ||
                    "项目申报单位在地质灾害防治领域具有深厚的研究基础。拥有地质灾害监测预警重点实验室，配备了先进的监测设备和分析仪器。建立了完善的产学研合作机制，与多家高校和科研院所保持长期合作关系。已承担多项国家级和省级科研项目，在地质灾害监测预警技术方面取得了一系列创新成果，具备开展本项目研究的良好条件。"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: 实施计划 */}
        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle>项目实施计划</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">年度实施计划</h3>
                <div className="space-y-4">
                  {projectData.annualPlans?.map((plan: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-primary">{plan.year}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {plan.startDate} 至 {plan.endDate}
                          </p>
                        </div>
                        <Badge variant="secondary">{plan.budget}</Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">主要工作内容：</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {plan.tasks.map((task: string, taskIndex: number) => (
                              <li key={taskIndex}>{task}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">主要目标：</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {plan.goals.map((goal: string, goalIndex: number) => (
                              <li key={goalIndex}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">组织管理措施</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {projectData.managementMeasures ||
                    "成立项目领导小组和技术专家组，建立项目管理制度和质量保证体系。实行项目负责人制，明确各成员职责分工。建立定期例会制度，及时沟通协调解决问题。加强过程管理和质量控制，确保项目按计划顺利实施。"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">保障措施</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  {projectData.guaranteeMeasures?.map((measure: string, index: number) => (
                    <li key={index}>{measure}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: 绩效指标 */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>项目绩效指标</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">一、产出指标</h3>
                <div className="space-y-3">
                  {projectData.outputIndicators?.map((indicator: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{indicator.name}</p>
                        <Badge>{indicator.target}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{indicator.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">二、效益指标</h3>
                <div className="space-y-3">
                  {projectData.benefitIndicators?.map((indicator: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">{indicator.name}</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {indicator.details.map((detail: string, detailIndex: number) => (
                          <li key={detailIndex}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">三、可持续影响指标</h3>
                <div className="p-4 border rounded-lg">
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {projectData.sustainableIndicators?.map((indicator: string, index: number) => (
                      <li key={index}>{indicator}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">四、满意度指标</h3>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-medium">用户满意度</p>
                    <Badge variant="secondary">{projectData.satisfactionTarget || "≥ 90%"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {projectData.satisfactionDescription ||
                      "通过问卷调查、座谈会等方式，收集项目成果使用单位和受益群众的意见反馈，用户满意度达到90%以上。"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 8: 预算填报 */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>项目预算明细</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                <span className="font-semibold">项目总预算</span>
                <span className="text-2xl font-semibold text-primary">{projectData.totalBudget} 万元</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">申请专项经费</p>
                  <p className="text-xl font-semibold text-primary">{projectData.specialFunding} 万元</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">自筹/其他资金</p>
                  <p className="text-xl font-semibold">{projectData.selfFunding} 万元</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">预算科目分类</h3>
                <div className="space-y-3">
                  {projectData.budgetCategories?.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-lg text-primary">{item.amount}万元</p>
                          <Badge variant="secondary">{item.ratio}%</Badge>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-primary transition-all" style={{ width: `${item.ratio}%` }} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.detail.map((d: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 mt-1">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">年度预算分配</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>年度</TableHead>
                        <TableHead>预算金额（万元）</TableHead>
                        <TableHead>占比</TableHead>
                        <TableHead>主要用途</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectData.annualBudget?.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.year}</TableCell>
                          <TableCell className="font-semibold">{item.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.ratio}%</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.usage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 9: 其它附件 - Updated file type display to show extensions */}
        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle>项目附件材料</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>附件名称</TableHead>
                      <TableHead>文件名称</TableHead>
                      <TableHead>文件类型</TableHead>
                      <TableHead>文件大小</TableHead>
                      <TableHead>上传时间</TableHead>
                      <TableHead>说明</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectData.attachments?.map((file: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell>{file.fileName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{file.type}</Badge>
                        </TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{file.uploadTime}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{file.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => window.open(file.previewUrl, "_blank")}>
                              <FileText className="h-4 w-4 mr-1" />
                              预览
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => window.open(file.downloadUrl, "_blank")}>
                              <Download className="h-4 w-4 mr-1" />
                              下载
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">附件上传说明</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>支持的文件格式：PDF、Word、Excel、图片（JPG/PNG）</li>
                  <li>单个文件大小不超过20MB</li>
                  <li>必须上传的附件：承诺书、推荐书、查重报告</li>
                  <li>其他材料可司根据项目自际情况选择性上传</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>驳回项目</DialogTitle>
            <DialogDescription>请输入驳回原因，将通知申报单位进行修改。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">驳回原因</Label>
              <Textarea
                id="reason"
                placeholder="请输入驳回原因..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              确认驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>初审通过</DialogTitle>
            <DialogDescription>确认该项目初审通过，项目将进入后续评审流程。</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              项目通过初审后，系统将自动通知申请单位，并开放专家评审功能。请确认项目材料完整、信息准确后再执行此操作。
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              取消
            </Button>
            <Button onClick={handleApprove}>确认通过</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
