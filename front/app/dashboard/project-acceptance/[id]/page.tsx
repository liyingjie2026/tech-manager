"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ProjectAcceptanceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "首页", href: "/dashboard" },
          { label: "项目管理" },
          { label: "项目验收", href: "/dashboard/project-acceptance" },
          { label: "验收详情" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/project-acceptance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">项目验收申请</h1>
            <p className="text-muted-foreground text-sm">项目: ****项目数据融合技术研究</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">预览验收书</Button>
          <Button>提交验收</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>考核指标完成情况</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>指标类型</TableHead>
                  <TableHead>指标名称</TableHead>
                  <TableHead>计划目标值</TableHead>
                  <TableHead>实际完成值</TableHead>
                  <TableHead>完成状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>技术指标</TableCell>
                  <TableCell>数据融合准确率</TableCell>
                  <TableCell>≥ 90%</TableCell>
                  <TableCell>92.5%</TableCell>
                  <TableCell>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" /> 达标
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>技术指标</TableCell>
                  <TableCell>系统响应时间</TableCell>
                  <TableCell>≤ 1s</TableCell>
                  <TableCell>0.8s</TableCell>
                  <TableCell>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" /> 达标
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>产出指标</TableCell>
                  <TableCell>发表SCI论文</TableCell>
                  <TableCell>2篇</TableCell>
                  <TableCell>2篇</TableCell>
                  <TableCell>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" /> 达标
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>产出指标</TableCell>
                  <TableCell>申请发明专利</TableCell>
                  <TableCell>1项</TableCell>
                  <TableCell>2项</TableCell>
                  <TableCell>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" /> 超额完成
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>项目总结摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-[200px]"
                value="本项目针对多源异构数据融合难题，提出了一种基于深度学习的自适应融合算法。经过两年的研究，成功构建了数据融合平台，实现了对地质、水文、气象等多类数据的统一管理和高效融合。
主要创新点包括：
1. 提出了多模态特征对齐机制，解决了异构数据时空基准不统一的问题。
2. 设计了动态权重分配网络，提高了融合结果的鲁棒性。
项目成果已在省自然资源厅相关业务系统中得到应用，显著提升了数据服务效率。"
                readOnly
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>验收材料清单</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>项目验收申请表</span>
                  </div>
                  <Button variant="link" size="sm">
                    查看
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>项目技术总结报告</span>
                  </div>
                  <Button variant="link" size="sm">
                    查看
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>项目经费决算表</span>
                  </div>
                  <Button variant="link" size="sm">
                    查看
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>附件材料（论文、专利等）</span>
                  </div>
                  <Button variant="link" size="sm">
                    查看
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
