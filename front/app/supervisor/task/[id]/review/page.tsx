"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default async function TaskReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <TaskReviewContent id={id} />
}

function TaskReviewContent({ id }: { id: string }) {
  const router = useRouter()
  const [hasMidterm, setHasMidterm] = useState("是")
  const [hasAnnual, setHasAnnual] = useState("是")
  const [midtermDate, setMidtermDate] = useState("2022-01-01")
  const [annualDate, setAnnualDate] = useState("2022-01-01")

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

  const handlePass = () => {
    console.log("[v0] 审核通过", { hasMidterm, midtermDate, hasAnnual, annualDate })
    router.push("/supervisor/task")
  }

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
              <h1 className="text-xl font-bold">任务书审核</h1>
              <p className="text-sm text-muted-foreground">审核项目任务书</p>
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
                        <Checkbox />
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
                          <Checkbox />
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

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">中期检查配置</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-8">
                  <Label className="w-28">是否中期检查</Label>
                  <RadioGroup value={hasMidterm} onValueChange={setHasMidterm} className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="是" id="midterm-yes" />
                      <Label htmlFor="midterm-yes" className="font-normal cursor-pointer">
                        是
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="否" id="midterm-no" />
                      <Label htmlFor="midterm-no" className="font-normal cursor-pointer">
                        否
                      </Label>
                    </div>
                  </RadioGroup>
                  <Label className="w-28">中期检查时间</Label>
                  <Input
                    type="date"
                    value={midtermDate}
                    onChange={(e) => setMidtermDate(e.target.value)}
                    disabled={hasMidterm === "否"}
                    className="w-48"
                  />
                </div>
                <div className="flex items-center gap-8">
                  <Label className="w-28">是否年度检查</Label>
                  <RadioGroup value={hasAnnual} onValueChange={setHasAnnual} className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="是" id="annual-yes" />
                      <Label htmlFor="annual-yes" className="font-normal cursor-pointer">
                        是
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="否" id="annual-no" />
                      <Label htmlFor="annual-no" className="font-normal cursor-pointer">
                        否
                      </Label>
                    </div>
                  </RadioGroup>
                  <Label className="w-28">年度检查时间</Label>
                  <Input
                    type="date"
                    value={annualDate}
                    onChange={(e) => setAnnualDate(e.target.value)}
                    disabled={hasAnnual === "否"}
                    className="w-48"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={() => router.back()}>
              返回
            </Button>
            <Button size="lg" onClick={handlePass}>
              通过
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
