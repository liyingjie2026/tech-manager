"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { FileText, Upload } from "lucide-react"

export default function ChangeEditPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [formData, setFormData] = useState({
    projectNumber: "2024KY01",
    projectName: "****项目数据融合技术研究",
    projectType: "后补助项目",
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
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">项目变更申请</h1>
          <p className="text-sm text-muted-foreground mt-1">填写项目变更信息</p>
        </div>

        {/* Basic Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">项目基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>项目编号：</Label>
                <Input value={formData.projectNumber} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目名称：</Label>
                <Input value={formData.projectName} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目类型：</Label>
                <Select value={formData.projectType}>
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
                <Input value={formData.leader} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目开始时间：</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>项目截止时间：</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>项目总预算（万元）：</Label>
                <Input
                  value={formData.totalBudget}
                  onChange={(e) => handleInputChange("totalBudget", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>申请专项经费（万元）：</Label>
                <Input
                  value={formData.specialFunding}
                  onChange={(e) => handleInputChange("specialFunding", e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>自筹/其他资金（万元）：</Label>
                <Input
                  value={formData.selfFunding}
                  onChange={(e) => handleInputChange("selfFunding", e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>项目承担单位（牵头单位）：</Label>
                <Input value={formData.hostUnit} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>项目承担单位（参与单位）：</Label>
                <Input value={formData.participatingUnit} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>主要研究内容及预期成果：</Label>
                <Textarea
                  value={formData.researchContent}
                  rows={6}
                  className="resize-none"
                  onChange={(e) => handleInputChange("researchContent", e.target.value)}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-red-500">*项目计划书：</Label>
                <Button variant="link" size="sm" className="text-blue-600">
                  上传附件
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <a href="#" className="text-primary hover:underline text-sm">
                  项目合同书.pdf
                </a>
                <Button variant="link" size="sm">
                  预览
                </Button>
                <Button variant="link" size="sm">
                  下载
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-red-500">*项目合同书：</Label>
              </div>

              <div className="flex items-center justify-between">
                <Label>项目变更通知书：</Label>
                <Button variant="link" size="sm" className="text-blue-600">
                  上传附件
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Midterm Materials */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">中期检查材料</h2>
            <div className="space-y-4">
              {[
                "研究报告或技术总结：",
                "测试或见证报告：",
                "用户使用或应用报告：",
                "财务决算报告：",
                "验收专家建议名单：",
                "项目绩效自评报告：",
                "其他（规范制定说明）：",
              ].map((label) => (
                <div key={label} className="flex items-center justify-between py-2 border-b">
                  <Label>{label}</Label>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    上传附件
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    未选择文件（支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx,
                    ppt/pptx，单个文件大小不超过4M，单次上传文件不得超过3个，最多支持10个附件。）
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            取 消
          </Button>
          <Button variant="outline" size="lg">
            保存
          </Button>
          <Button size="lg">提 交</Button>
        </div>
      </div>
    </div>
  )
}
