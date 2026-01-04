"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, Trash2 } from "lucide-react"
import { useState } from "react"

export default function ProjectChangeEditPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("basic")

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "首页", href: "/dashboard" },
          { label: "项目管理" },
          { label: "项目变更", href: "/dashboard/project-change" },
          { label: "变更申请" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>项目变更申请</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="change">变更内容</TabsTrigger>
              <TabsTrigger value="attachment">附件材料</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">
                    项目名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="projectName" defaultValue="项目数据融合技术研究" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectNo">
                    项目编号 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="projectNo" defaultValue="KJ202502001" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changeType">
                    变更类型 <span className="text-red-500">*</span>
                  </Label>
                  <Select defaultValue="plan">
                    <SelectTrigger id="changeType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plan">计划变更</SelectItem>
                      <SelectItem value="task">任务变更</SelectItem>
                      <SelectItem value="budget">经费变更</SelectItem>
                      <SelectItem value="member">人员变更</SelectItem>
                      <SelectItem value="schedule">进度变更</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changeDate">
                    变更申请日期 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="changeDate" type="date" defaultValue="2025-02-02" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="change" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="changeReason">
                    变更原因 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="changeReason"
                    placeholder="请详细说明变更原因"
                    className="min-h-[120px]"
                    defaultValue="由于项目实施过程中发现原定技术路线存在局限性，需要调整研究方向和任务分工。"
                  />
                  <p className="text-xs text-muted-foreground text-right">0/500</p>
                </div>

                <div className="space-y-2">
                  <Label>变更前内容</Label>
                  <div className="rounded-md border p-4 bg-muted/50">
                    <p className="text-sm">
                      原计划采用传统数据融合算法，预计6个月完成数据清洗和融合工作，由张三负责算法开发，李四负责数据处理。
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changeAfter">
                    变更后内容 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="changeAfter"
                    placeholder="请详细说明变更后的内容"
                    className="min-h-[120px]"
                    defaultValue="调整为采用深度学习融合算法，预计8个月完成，由王五负责算法开发，张三转为负责模型训练，李四继续负责数据处理。"
                  />
                  <p className="text-xs text-muted-foreground text-right">0/500</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changeImpact">变更影响分析</Label>
                  <Textarea
                    id="changeImpact"
                    placeholder="请说明变更对项目进度、经费、成果等方面的影响"
                    className="min-h-[100px]"
                    defaultValue="进度延后2个月，需增加GPU计算资源费用约5万元，预期成果质量将显著提升。"
                  />
                  <p className="text-xs text-muted-foreground text-right">0/300</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachment" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>变更申请附件</Label>
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    上传文件
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  支持 jpg/jpeg/png, pdf, doc/docx, xls/xlsx, ppt/pptx, zip, rar，单个文件不超过 10M，最多支持 10
                  个附件。
                </p>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>序号</TableHead>
                        <TableHead>文件名称</TableHead>
                        <TableHead>文件类型</TableHead>
                        <TableHead>文件大小</TableHead>
                        <TableHead>上传时间</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          变更申请说明.docx
                        </TableCell>
                        <TableCell>docx</TableCell>
                        <TableCell>2.3 MB</TableCell>
                        <TableCell>2025-02-02 10:30</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                              预览
                            </Button>
                            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                              下载
                            </Button>
                            <Button variant="link" size="sm" className="text-destructive p-0 h-auto">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-600" />
                          技术路线对比分析.pdf
                        </TableCell>
                        <TableCell>pdf</TableCell>
                        <TableCell>1.8 MB</TableCell>
                        <TableCell>2025-02-02 10:35</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                              预览
                            </Button>
                            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                              下载
                            </Button>
                            <Button variant="link" size="sm" className="text-destructive p-0 h-auto">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" size="lg">
              取消
            </Button>
            <Button size="lg">保存</Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              提交
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
