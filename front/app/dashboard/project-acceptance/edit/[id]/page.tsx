"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProjectAcceptanceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = params as unknown as { id: string }
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({
    research: null,
    testing: null,
    application: null,
    financial: null,
    experts: null,
    selfEvaluation: null,
    others: null,
  })

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: "项目管理" }, { label: "项目验收" }, { label: "验收申请" }]} />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          请上传您需的资料填资料并提交材料。支持 jpg/jpeg/png, pdf, doc/docx, xls/xlsx, ppt/pptx, zip,
          rar，单个文件大小不超过 4M。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">项目编号：</Label>
              <div className="flex-1">
                <Input value="2024KY01" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">项目名称：</Label>
              <div className="flex-1">
                <Input value="****项目数据融合技术研究" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">项目类型：</Label>
              <div className="flex-1">
                <Select disabled>
                  <SelectTrigger className="bg-muted">
                    <SelectValue placeholder="一般项目" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">一般项目</SelectItem>
                    <SelectItem value="major">重大项目</SelectItem>
                    <SelectItem value="youth">青年项目</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">项目负责人：</Label>
              <div className="flex-1">
                <Input value="胡歌" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">项目开始时间：</Label>
              <div className="flex-1">
                <Input type="date" value="2022-01-01" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">项目截止时间：</Label>
              <div className="flex-1">
                <Input type="date" value="2022-12-12" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">项目总预算（万元）：</Label>
              <div className="flex-1">
                <Input value="20.00" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">申请专项经费（万元）：</Label>
              <div className="flex-1">
                <Input value="5.00" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-40 text-right mr-4 pt-2">自筹/其他资金（万元）：</Label>
              <div className="flex-1">
                <Input value="5.00" readOnly className="bg-muted" />
              </div>
            </div>
          </div>

          <div className="flex">
            <Label className="w-40 text-right mr-4 pt-2">项目承担单位（承头单位）：</Label>
            <div className="flex-1">
              <Input value="****研究院" readOnly className="bg-muted" />
            </div>
          </div>

          <div className="flex">
            <Label className="w-40 text-right mr-4 pt-2">项目承担单位（参与单位）：</Label>
            <div className="flex-1">
              <Input value="湖南省二测绘院" readOnly className="bg-muted" />
            </div>
          </div>

          <div className="flex">
            <Label className="w-40 text-right mr-4 pt-2">主要研究内容及预期成果：</Label>
            <div className="flex-1">
              <Textarea
                rows={6}
                value="研究内容：1.高温地热井高效钻进技术与快速破岩路径试验研究作用下高温岩体的受力模型及损伤规律；地热储层探岩破碎装法及碎岩机理；高温地热井高效钻进技术。2.高温地热井钻具失效机理与强安开关钻头、井下共核失效机理与防护技术、高温地热井下整套根组与封堵技术、管柱防腐与优选及绝缘工作用电。以及整个储钻组链检验技术；3.高温地热钻完井整套高效作用链技术，钻地热储井高效作用场技术，打运示范应用体系；2.发表高水平论文4~5篇；3.获授权国家发明专利2~3项；4.获得国家及省级奖项目2~3项、奖励1~2项。"
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">项目计划书：</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  预览
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  下载
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">项目合同书：</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  预览
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  下载
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">项目变更通知书：</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  预览
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  下载
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>项目验收申请</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget information */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div className="flex">
              <Label className="w-48 text-right mr-4 pt-2">项目总费用（万元）：</Label>
              <div className="flex-1">
                <Input value="20.00" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-48 text-right mr-4 pt-2">专项经费（万元）：</Label>
              <div className="flex-1">
                <Input value="5.00" readOnly className="bg-muted" />
              </div>
            </div>
            <div className="flex">
              <Label className="w-48 text-right mr-4 pt-2">自筹/其他资金（万元）：</Label>
              <div className="flex-1">
                <Input value="5.00" readOnly className="bg-muted" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start">
              <Label className="w-48 text-right mr-4 pt-2">研究报告或技术总结：</Label>
              <div className="flex-1">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  上传附件
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  未选择文件（支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx,
                  ppt/pptx，单个文件大小不超过4M，最多上传文件不得超过3个，最多支持10个附件。）
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Label className="w-48 text-right mr-4 pt-2">测试或应用证报告：</Label>
              <div className="flex-1">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  上传附件
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  未选择文件（支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx,
                  ppt/pptx，单个文件大小不超过4M，最多上传文件不得超过3个，最多支持10个附件。）
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Label className="w-48 text-right mr-4 pt-2">用户使用或应用报告：</Label>
              <div className="flex-1">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  上传附件
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  未选择文件（支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx,
                  ppt/pptx，单个文件大小不超过4M，最多上传文件不得超过3个，最多支持10个附件。）
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Label className="w-48 text-right mr-4 pt-2">财务决算报告：</Label>
              <div className="flex-1">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  上传附件
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  未选择文件（支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx,
                  ppt/pptx，单个文件大小不超过4M，最多上传文件不得超过3个，最多支持10个附件。）
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Label className="w-48 text-right mr-4 pt-2">验收专家建议名单：</Label>
              <div className="flex-1">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  上传附件
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  未选择文件（支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx,
                  ppt/pptx，单个文件大小不超过4M，最多上传文件不得超过3个，最多支持10个附件。）
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Label className="w-48 text-right mr-4 pt-2">项目绩效自评报告：</Label>
              <div className="flex-1">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  上传附件
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  未选择文件（支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx,
                  ppt/pptx，单个文件大小不超过4M，最多上传文件不得超过3个，最多支持10个附件。）
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Label className="w-48 text-right mr-4 pt-2">其他（视冠铭制说明）：</Label>
              <div className="flex-1">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  上传附件
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  未选择文件（支持jpg/jpeg/png, pdf, doc/docx, xls/xlsx,
                  ppt/pptx，单个文件大小不超过4M，最多上传文件不得超过3个，最多支持10个附件。）
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 pb-8">
        <Link href="/dashboard/project-acceptance">
          <Button variant="outline" size="lg">
            取 消
          </Button>
        </Link>
        <Button size="lg">保 存</Button>
        <Button size="lg">提 交</Button>
      </div>
    </div>
  )
}
