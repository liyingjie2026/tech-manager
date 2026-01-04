"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QueryDetailPage() {
  const router = useRouter()

  const queryDetail = {
    title: "高性能计算资源需求",
    type: "计算资源",
    urgency: "紧急",
    submitDate: "2025-03-15",
    status: "已发布",
    budget: "50-100",
    deadline: "2025-04-15",
    description:
      "因项目需要，急需一批高性能计算资源用于大规模遥感影像处理。具体要求：\n1. GPU节点：至少4张A100\n2. 存储：20TB高速存储\n3. 网络：万兆互联\n4. 使用时长：3个月",
    contact: "张三",
    phone: "13800138000",
  }

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
              <BreadcrumbPage>需求详情</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{queryDetail.title}</CardTitle>
          <Badge variant="destructive">{queryDetail.urgency}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">需求类型</p>
              <p className="font-medium">{queryDetail.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">发布日期</p>
              <p className="font-medium">{queryDetail.submitDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">当前状态</p>
              <Badge variant="outline">{queryDetail.status}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">预算范围</p>
              <p className="font-medium">{queryDetail.budget}万元</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">期望解决时间</p>
              <p className="font-medium">{queryDetail.deadline}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">需求描述</h3>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">{queryDetail.description}</div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">联系方式</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">联系人</p>
                <p className="font-medium">{queryDetail.contact}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">联系电话</p>
                <p className="font-medium">{queryDetail.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
