"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  const project = {
    number: "2024KY01",
    name: "****项目数据融合技术研究",
    type: "后补助项目",
    leader: "胡歌",
    startDate: "2022-01-01",
    endDate: "2022-12-12",
    totalBudget: "20.00",
    specialFunding: "5.00",
    selfFunding: "5.00",
    hostUnit: "****研究院",
    participatingUnit: "湖南省三测绘院",
    researchContent: `研究内容：1.高温地热井高效钻进技术与快速破岩路径钻进技术开发下高温岩体的受力模型型及抗钻规律；地热储层钻进破岩方法及其特机理，
2.高温地热井高效钻进技术，2.高温地热井井筒完整性稳定性技术，高温地热井并筒稳定性力学推导与数理建模，围岩流变影响机理，以及共楚关键装置与稳定技术；3.高温地热井并体检测与稳定技术，
预期成果：1.掌握高温岩体高效钻进技术，提出高温地热井井筒稳定性术了多参数，形成地热井高效取热与综合利用技术，打造示范应用基地；2.发表高水平论文4—5篇；3.获授权国家发明专利2—3项；4.获得国家及省部级级项目2—3项。实用1-2项。`,
  }

  const tasks = [
    {
      name: "****项目数据融合技术研究",
      businessType: "任务拆解",
      taskNumber: "RW202502001",
      taskName: "项目中报",
      description: "",
      wbs: "1",
      taskType: "里程碑节点",
      parentWbs: "",
    },
    {
      name: "****项目数据融合技术研究",
      businessType: "任务拆解",
      taskNumber: "RW202502001",
      taskName: "任务分配",
      description: "",
      wbs: "2.1",
      taskType: "子任务",
      parentWbs: "2",
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
              <h1 className="text-xl font-bold">任务书详情</h1>
              <p className="text-sm text-muted-foreground">查看任务书信息</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-7xl space-y-6">
        {/* Basic Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">项目基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>项目编号：</Label>
                <Input value={project.number} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目名称：</Label>
                <Input value={project.name} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目类型：</Label>
                <Select value={project.type} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="后补助项目">后补助项目</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>项目负责人：</Label>
                <Input value={project.leader} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目开始时间：</Label>
                <Input type="date" value={project.startDate} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目截止时间：</Label>
                <Input type="date" value={project.endDate} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目总预算（万元）：</Label>
                <Input value={project.totalBudget} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>申请专项经费（万元）：</Label>
                <Input value={project.specialFunding} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>自筹/其他资金（万元）：</Label>
                <Input value={project.selfFunding} readOnly className="bg-muted" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label>项目成员：</Label>
              <Input value="张三;李四;王五;马六" readOnly className="bg-muted" />
            </div>
            <div className="mt-4 space-y-2">
              <Label>项目承担单位（牵头单位）：</Label>
              <Input value={project.hostUnit} readOnly className="bg-muted" />
            </div>
            <div className="mt-4 space-y-2">
              <Label>项目承担单位（参与单位）：</Label>
              <Input value={project.participatingUnit} readOnly className="bg-muted" />
            </div>
            <div className="mt-4 space-y-2">
              <Label>主要研究内容及预期成果：</Label>
              <Textarea value={project.researchContent} rows={6} className="resize-none bg-muted" readOnly />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500">*</span>
                <Label>签订的项目任务书：</Label>
                <FileText className="h-4 w-4 text-primary" />
                <a href="#" className="text-primary hover:underline text-sm">
                  ****项目数据融合技术研究任务书.doc
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Plan */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">实施进度计划</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>任务编号</TableHead>
                  <TableHead>任务类型</TableHead>
                  <TableHead>任务名称</TableHead>
                  <TableHead>任务描述</TableHead>
                  <TableHead>负责机构/单位</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead>任务开始日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell className="font-mono">{task.taskNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.businessType}</Badge>
                    </TableCell>
                    <TableCell>{task.taskName}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>湖南省三测绘院</TableCell>
                    <TableCell>管理员</TableCell>
                    <TableCell>2025-02-02</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            取 消
          </Button>
          <Button size="lg">提 交</Button>
        </div>
      </div>
    </div>
  )
}
