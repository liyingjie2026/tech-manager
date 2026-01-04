"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { ArrowLeft, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewQueryPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/query-search">需求征集</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>新增需求</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>发布新需求</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label>需求标题 *</Label>
              <Input placeholder="请输入简明扼要的标题" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>需求类型 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resource">计算资源</SelectItem>
                    <SelectItem value="data">数据资源</SelectItem>
                    <SelectItem value="tech">技术合作</SelectItem>
                    <SelectItem value="expert">专家咨询</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>紧急程度 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                    <SelectItem value="critical">非常紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>期望解决时间</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>预算范围(万元)</Label>
                <Input placeholder="请输入预算范围" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>需求描述 *</Label>
              <Textarea placeholder="请详细描述您的需求背景、具体要求和预期目标" rows={6} />
            </div>

            <div className="space-y-2">
              <Label>附件上传</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">支持pdf, doc/docx, jpg/png格式，单个文件不超过10M</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  点击上传
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>联系人 *</Label>
                <Input placeholder="请输入联系人姓名" />
              </div>
              <div className="space-y-2">
                <Label>联系电话 *</Label>
                <Input placeholder="请输入联系电话" />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" className="w-32 bg-transparent" onClick={() => router.back()}>
              取消
            </Button>
            <Button variant="outline" className="w-32 bg-transparent">
              保存草稿
            </Button>
            <Button className="w-32">提交发布</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
