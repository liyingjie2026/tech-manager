"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { transformationApi } from "@/lib/api/transformation"
import { toast } from "@/hooks/use-toast"
import { getStatusText } from "@/lib/utils/status-maps"

export default function TransformationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<any>(null)

  useEffect(() => {
    loadDetail()
  }, [params.id])

  const loadDetail = async () => {
    setLoading(true)
    try {
      const response = await transformationApi.getById(Number(params.id))

      if (response.data) {
        setDetail(response.data)
      } else {
        toast({
          title: "加载失败",
          description: response.message || "无法加载成果转化详情",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to load transformation detail:", error)
      toast({
        title: "加载失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-muted-foreground">暂无数据</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">成果管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/achievements/transformation">成果转化</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>转化详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>成果转化详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">成果名称:</Label>
              <div className="flex-1">{detail.achievementName || "-"}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">是否关联项目:</Label>
              <div className="flex-1">{detail.relatedProject}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">关联项目名称:</Label>
              <div className="flex-1">{detail.relatedProjectName}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">成果建设单位:</Label>
              <div className="flex-1">{detail.constructionUnit}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">研发周期:</Label>
              <div className="flex-1">{detail.developmentPeriod}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">转化时间:</Label>
              <div className="flex-1">{detail.transformationDate || "-"}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">转化类型:</Label>
              <div className="flex-1">{detail.transformationType || "-"}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">转化单位:</Label>
              <div className="flex-1">{detail.transformationUnit || "-"}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">负责人:</Label>
              <div className="flex-1">{detail.principalName || "-"}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">转化收益:</Label>
              <div className="flex-1">{detail.transformationBenefit ? `${detail.transformationBenefit}万元` : "-"}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">成果简介:</Label>
              <div className="flex-1">{detail.achievementBrief || "-"}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">转化方式及过程:</Label>
              <div className="flex-1">{detail.transformationProcess || "-"}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">应用领域:</Label>
              <div className="flex-1">{detail.applicationField || "-"}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">经济和社会效益:</Label>
              <div className="flex-1">{detail.economicBenefit || "-"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t">
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">审核状态:</Label>
              <div className="flex-1">{getStatusText(detail.status, "transformation")}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">提交人:</Label>
              <div className="flex-1">{detail.submitter}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">提交时间:</Label>
              <div className="flex-1">{detail.submitDate}</div>
            </div>
            <div className="flex gap-4">
              <Label className="w-32 text-right text-muted-foreground shrink-0">创建时间:</Label>
              <div className="flex-1">{detail.createTime || "-"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
