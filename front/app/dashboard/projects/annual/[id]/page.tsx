"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Upload, FileText, Download, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AnnualDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const searchParams = useSearchParams()
  const isViewMode = searchParams.get("view") === "true"

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

  const uploadedAttachments = isViewMode
    ? [
        { name: "年度检查报告.docx", size: "3.2 MB", type: "项目任务书" },
        { name: "经费使用明细表.xlsx", size: "1.5 MB", type: "财务决算报告" },
        { name: "阶段性成果汇总.pdf", size: "2.8 MB", type: "研究报告或技术总结" },
      ]
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">年度检查详情</h1>
              <p className="text-sm text-muted-foreground">查看年度检查信息</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-7xl space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">项目基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">项目编号：</div>
                <div>{project.number}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">项目名称：</div>
                <div>{project.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">项目类型：</div>
                <Badge variant="outline">{project.type}</Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">项目负责人：</div>
                <div>{project.leader}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">项目开始时间：</div>
                <div>{project.startDate}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">项目截止时间：</div>
                <div>{project.endDate}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">项目总预算（万元）：</div>
                <div>{project.totalBudget}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">申请专项经费（万元）：</div>
                <div>{project.specialFunding}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">自筹/其他资金（万元）：</div>
                <div>{project.selfFunding}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-1">项目承担单位（牵头单位）：</div>
              <div>{project.hostUnit}</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-1">项目承担单位（参与单位）：</div>
              <div>{project.participatingUnit}</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-1">主要研究内容及预期成果：</div>
              <Textarea value={project.researchContent} readOnly rows={6} className="resize-none" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">附件材料</h2>

            {!isViewMode && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  请上传年度检查所需的附件材料。支持 jpg/jpeg/png, pdf, doc/docx, xls/xlsx, ppt/pptx
                  格式，单个文件不超过 4M。
                </AlertDescription>
              </Alert>
            )}

            {isViewMode && uploadedAttachments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">序号</TableHead>
                    <TableHead>文件名称</TableHead>
                    <TableHead>文件类型</TableHead>
                    <TableHead>文件大小</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedAttachments.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          {file.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{file.type}</Badge>
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="py-2 border-b">
                    <div className="flex items-center justify-between">
                      <Label>
                        项目任务书：<span className="text-red-500">*</span>
                      </Label>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        上传附件
                      </Button>
                    </div>
                  </div>
                  <div className="py-2 border-b">
                    <div className="flex items-center justify-between">
                      <Label>项目变更材料：</Label>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        上传附件
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "研究报告或技术总结：",
                    "测试报告：",
                    "使用或应用报告：",
                    "财务决算报告：",
                    "验收专家名单：",
                    "项目自评报告：",
                    "其他：",
                  ].map((label) => (
                    <div key={label} className="py-2 border-b">
                      <div className="flex items-center justify-between">
                        <Label>{label}</Label>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          上传附件
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!isViewMode && (
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={() => router.back()}>
              取 消
            </Button>
            <Button variant="outline" size="lg">
              保存
            </Button>
            <Button size="lg">提 交</Button>
          </div>
        )}
      </div>
    </div>
  )
}
