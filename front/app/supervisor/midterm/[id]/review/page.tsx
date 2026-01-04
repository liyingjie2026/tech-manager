"use client"

import { use, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function MidtermReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [reviewOpinion, setReviewOpinion] = useState("")

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
    researchContent: `研究内容：1.高温地热井高效钻进技术与快速破岩路径钻进技术开发下高温岩体的受力模型型及抗钻规律；地热储层钻进破岩方法及其特机理，
2.高温地热井高效钻进技术，2.高温地热井井筒完整性稳定性技术，高温地热井并筒稳定性力学推导与数理建模，围岩流变影响机理，以及共楚关键装置与稳定技术；3.高温地热井并体检测与稳定技术，
预期成果：1.掌握高温岩体高效钻进技术，提出高温地热井井筒稳定性术了多参数，形成地热井高效取热与综合利用技术，打造示范应用基地；2.发表高水平论文4—5篇；3.获授权国家发明专利2—3项；4.获得国家及省部级级项目2—3项。实用1-2项。`,
  }

  const midtermMaterials = [
    {
      category: "研究报告或技术总结：",
      files: ["****项目数据融合技术研究项目研究报告.doc"],
    },
    {
      category: "测试或识证报告：",
      files: ["****项目数据融合技术研究项目见证报告.doc", "****项目数据融合技术研究项目见证报告.png"],
    },
    {
      category: "用户使用或应用报告：",
      files: ["****项目数据融合技术研究项目用户使用手册.pdf"],
    },
    {
      category: "财务决算报告：",
      files: ["****项目数据融合技术研究项目财务决算报告.doc", "配套决算材料.rar"],
    },
    {
      category: "验收专家建议名单：",
      files: ["****项目数据融合技术研究项目验收专家建议.pdf", "验收专家名单.xls"],
    },
    {
      category: "项目绩效自评报告：",
      files: ["****项目数据融合技术研究项目绩效自评报告.doc"],
    },
    {
      category: "其他（规范制定说明）：",
      files: ["其它说明材料.doc"],
    },
  ]

  const handleReject = () => {
    console.log("审核不通过")
    router.push("/supervisor/midterm")
  }

  const handleApprove = () => {
    console.log("审核通过")
    router.push("/supervisor/midterm")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">中期检查审核</h1>
              <p className="text-sm text-muted-foreground">审核项目中期检查材料</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">项目编号：</div>
                  <div className="font-medium">{project.number}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">项目名称：</div>
                  <div className="font-medium">{project.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">项目类型：</div>
                  <div>
                    <Badge variant="outline">{project.type}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">项目负责人：</div>
                  <div className="font-medium">胡歌</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">项目开始时间：</div>
                  <div className="font-medium">{project.startDate}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">项目截止时间：</div>
                  <div className="font-medium">{project.endDate}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">项目总预算（万元）：</div>
                  <div className="font-medium">{project.totalBudget}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">申请专项经费（万元）：</div>
                  <div className="font-medium">{project.specialFunding}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">自筹/其他资金（万元）：</div>
                  <div className="font-medium">{project.selfFunding}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">项目承担单位（牵头单位）：</div>
                <div className="font-medium">{project.hostUnit}</div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">项目承担单位（参与单位）：</div>
                <div className="font-medium">{project.participatingUnit}</div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">主要研究内容及预期成果：</div>
                <Textarea value={project.researchContent} readOnly rows={8} className="resize-none" />
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">项目计划书：</div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <a href="#" className="text-primary hover:underline text-sm">
                    项目计划书.docx
                  </a>
                  <Button variant="link" size="sm">
                    预览
                  </Button>
                  <Button variant="link" size="sm">
                    下载
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">项目合同书：</div>
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
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">项目变更通知书：</div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <a href="#" className="text-primary hover:underline text-sm">
                    项目变更通知书.png
                  </a>
                  <Button variant="link" size="sm">
                    预览
                  </Button>
                  <Button variant="link" size="sm">
                    下载
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 中期检查材料 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold">中期检查材料</h2>
                <Button variant="link" size="sm">
                  批量下载
                </Button>
              </div>
              <div className="space-y-4">
                {midtermMaterials.map((material, index) => (
                  <div key={index}>
                    <div className="text-sm font-medium mb-2">{material.category}</div>
                    <div className="space-y-2 pl-4">
                      {material.files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <a href="#" className="text-primary hover:underline text-sm">
                            {file}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 审核意见 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">审核意见</h2>
              <Textarea
                placeholder="填写审核意见"
                value={reviewOpinion}
                onChange={(e) => setReviewOpinion(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={handleReject}>
              审核不通过
            </Button>
            <Button size="lg" onClick={handleApprove}>
              审核通过
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
