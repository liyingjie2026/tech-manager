"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table"
import { ArrowLeft, FileText } from "lucide-react"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  return <TaskDetailContent id={id} />
}

function TaskDetailContent({ id }: { id: string }) {
  const router = useRouter()

  const project = {
    number: "2024KY01",
    name: "****项目数据融合技术研究",
    type: "后补助项目",
    startDate: "2022-01-01",
    endDate: "2022-12-12",
    totalBudget: 20.0,
    specialFunding: 5.0,
    selfFunding: 5.0,
    hostUnit: "****研究院",
    participatingUnit: "湖南省三测绘院",
    leader: "胡歌",
    researchContent: `研究内容：1.高温地热井高效钻进技术与快速破岩路径钻进技术开发下高温岩体的受力模型型及抗钻规律；地热储层钻进破岩方法及其特机理，高温地热井高效钻进技术，2.高温地热井井筒完整性稳定性技术，高温地热井并筒稳定性力学推导与数理建模，围岩流变影响机理，以及共楚关键装置与稳定技术；3.高温地热井并体检测与稳定技术。
预期成果：1.掌握高温岩体高效钻进技术，提出高温地热井井筒稳定性术了多参数，形成地热井高效取热与综合利用技术，打造示范应用基地；2.发表高水平论文4—5篇；3.获授权国家发明专利2—3项；4.获得国家及省部级级项目2—3项。实用1-2项。`,
    hasMidterm: "是",
    midtermDate: "2022-01-01",
    hasAnnual: "是",
    annualDate: "2022-01-01",
  }

  const taskPlan = [
    {
      name: "****项目数据融合技术研究",
      taskNumber: "RW202502001",
      taskType: "里程碑节点",
      taskName: "项目申报",
      description: "",
      orgName: "湖南省三测绘院",
      person: "管理员",
      startDate: "2025-02-02",
    },
    {
      name: "****项目数据融合技术研究",
      taskNumber: "RW202502001",
      taskType: "",
      taskName: "任务分配",
      description: "",
      orgName: "湖南省三测绘院",
      person: "管理员",
      startDate: "2025-02-02",
    },
    {
      name: "****项目数据融合技术研究",
      taskNumber: "RW202502001",
      taskType: "里程碑节点",
      taskName: "项目验收",
      description: "",
      orgName: "湖南省三测绘院",
      person: "管理员",
      startDate: "2025-02-02",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">任务书详情</h1>
              <p className="text-sm text-muted-foreground">查看项目任务书详细信息</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* 项目基本信息 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">项目基本信息</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex items-start gap-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">项目编号：</Label>
                    <div className="flex-1">{project.number}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">项目名称：</Label>
                    <div className="flex-1">{project.name}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">项目类型：</Label>
                    <div className="flex-1">
                      <Badge variant="outline">{project.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">项目开始时间：</Label>
                    <div className="flex-1">{project.startDate}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">项目截止时间：</Label>
                    <div className="flex-1">{project.endDate}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">项目总预算（万元）：</Label>
                    <div className="flex-1">{project.totalBudget}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">申请专项经费（万元）：</Label>
                    <div className="flex-1">{project.specialFunding}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">自筹/其他资金（万元）：</Label>
                    <div className="flex-1">{project.selfFunding}</div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">
                      项目承担单位（牵头单位）：
                    </Label>
                    <div className="flex-1">{project.hostUnit}</div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">
                      项目承担单位（参与单位）：
                    </Label>
                    <div className="flex-1">{project.participatingUnit}</div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <Label className="text-muted-foreground whitespace-nowrap min-w-32">主要研究内容及预期成果：</Label>
                    <div className="flex-1 whitespace-pre-wrap text-sm">{project.researchContent}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 签订的项目任务书 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-red-600">签订的项目任务书：</span>
                <a href="#" className="text-primary hover:underline">
                  ****项目数据融合技术研究任务书.doc
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 实施进度计划 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">实施进度计划</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">
                        <Checkbox disabled />
                      </TableHead>
                      <TableHead className="min-w-[180px]">项目名称</TableHead>
                      <TableHead className="min-w-[120px]">任务编号</TableHead>
                      <TableHead className="min-w-[100px]">任务类型</TableHead>
                      <TableHead className="min-w-[100px]">任务名称</TableHead>
                      <TableHead className="min-w-[120px]">任务描述</TableHead>
                      <TableHead className="min-w-[140px]">负责机构/单位</TableHead>
                      <TableHead className="min-w-[80px]">负责人</TableHead>
                      <TableHead className="min-w-[120px]">任务开始时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskPlan.map((task, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox disabled />
                        </TableCell>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell className="font-mono text-sm">{task.taskNumber}</TableCell>
                        <TableCell>{task.taskType && <Badge variant="secondary">{task.taskType}</Badge>}</TableCell>
                        <TableCell>{task.taskName}</TableCell>
                        <TableCell className="text-muted-foreground">{task.description || "-"}</TableCell>
                        <TableCell>{task.orgName}</TableCell>
                        <TableCell>{task.person}</TableCell>
                        <TableCell className="text-sm">{task.startDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 中期检查配置 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">中期检查配置</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-8">
                  <Label className="text-muted-foreground w-28">是否中期检查</Label>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          project.hasMidterm === "是" ? "border-primary" : "border-input"
                        }`}
                      >
                        {project.hasMidterm === "是" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm">是</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          project.hasMidterm === "否" ? "border-primary" : "border-input"
                        }`}
                      >
                        {project.hasMidterm === "否" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm">否</span>
                    </div>
                  </div>
                  <Label className="text-muted-foreground w-28">中期检查时间</Label>
                  <div className="text-sm">{project.midtermDate}</div>
                </div>
                <div className="flex items-center gap-8">
                  <Label className="text-muted-foreground w-28">是否年度检查</Label>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          project.hasAnnual === "是" ? "border-primary" : "border-input"
                        }`}
                      >
                        {project.hasAnnual === "是" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm">是</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          project.hasAnnual === "否" ? "border-primary" : "border-input"
                        }`}
                      >
                        {project.hasAnnual === "否" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm">否</span>
                    </div>
                  </div>
                  <Label className="text-muted-foreground w-28">年度检查时间</Label>
                  <div className="text-sm">{project.annualDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button variant="outline" size="lg" onClick={() => router.back()}>
              返回
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
