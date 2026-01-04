"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileText, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

export default function ProjectChangeDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "首页", href: "/dashboard" },
          { label: "项目管理" },
          { label: "项目变更", href: "/dashboard/project-change" },
          { label: "变更详情" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/project-change">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">计划变更申请</h1>
            <p className="text-muted-foreground text-sm">申请编号: BG20250202001</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">打印申请表</Button>
          <Button>提交审批</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>变更基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>项目名称</Label>
                  <Input value="****项目数据融合技术研究" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>项目编号</Label>
                  <Input value="KJ202502001" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>变更事项</Label>
                  <Input value="计划变更" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>申请日期</Label>
                  <Input value="2025-02-02" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>变更原因</Label>
                <Textarea
                  className="min-h-[100px]"
                  value="因关键设备采购延迟，导致原定实验计划无法按期进行，需调整项目中期检查及验收时间节点。"
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>变更内容对比</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  <h3 className="font-semibold text-muted-foreground">变更前</h3>
                  <div className="space-y-2">
                    <Label>中期检查时间</Label>
                    <div className="font-medium">2025-06-30</div>
                  </div>
                  <div className="space-y-2">
                    <Label>项目验收时间</Label>
                    <div className="font-medium">2025-12-31</div>
                  </div>
                </div>
                <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-primary">变更后</h3>
                  <div className="space-y-2">
                    <Label>中期检查时间</Label>
                    <div className="font-medium text-primary">2025-08-30</div>
                  </div>
                  <div className="space-y-2">
                    <Label>项目验收时间</Label>
                    <div className="font-medium text-primary">2026-02-28</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>附件材料</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">设备采购延迟说明函.pdf</p>
                      <p className="text-xs text-muted-foreground">2.5 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    预览
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">新项目进度计划表.xlsx</p>
                      <p className="text-xs text-muted-foreground">1.2 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    下载
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>审批流程</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-muted space-y-8">
                <div className="relative">
                  <div className="absolute -left-[29px] top-0 bg-primary text-primary-foreground rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">提交申请</p>
                    <p className="text-xs text-muted-foreground">李小刚 - 2025-02-02 10:30</p>
                    <p className="text-sm bg-muted p-2 rounded mt-1">已提交变更申请，请领导审批。</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-0 bg-primary text-primary-foreground rounded-full p-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">部门审核</p>
                    <p className="text-xs text-muted-foreground">待审核</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-0 bg-muted text-muted-foreground rounded-full p-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">科研处审批</p>
                    <p className="text-xs text-muted-foreground">待审批</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
