"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Clock, User, Phone } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
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
              <BreadcrumbLink href="/dashboard/resources">我找资源</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>资源详情</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">高分辨率电子显微镜</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">分析仪器</Badge>
              <Badge className="bg-green-600">可借阅</Badge>
            </div>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">立即预约</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>借阅申请</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>借阅资源</Label>
                <Input value="高分辨率电子显微镜" disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>开始时间 *</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label>结束时间 *</Label>
                  <Input type="datetime-local" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>申请人</Label>
                <Input value="张三" disabled />
              </div>
              <div className="space-y-2">
                <Label>联系电话 *</Label>
                <Input placeholder="请输入联系电话" />
              </div>
              <div className="space-y-2">
                <Label>借阅用途 *</Label>
                <Textarea placeholder="请简要说明借阅用途" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setDialogOpen(false)}>提交申请</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>设备介绍</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">设备图片占位符</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">功能描述</h3>
                <p className="text-muted-foreground leading-relaxed">
                  本设备具有超高分辨率成像能力，可实现原子级别的微观结构观察。配备了能谱分析附件，可同时进行微区成分分析。
                  适用于材料科学、生物医学、地质矿产等领域的微观形貌观察与成分分析。
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">技术指标</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>加速电压：20-300 kV</li>
                  <li>点分辨率：0.19 nm</li>
                  <li>线分辨率：0.10 nm</li>
                  <li>放大倍数：50x - 1,500,000x</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>使用须知</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-decimal list-inside text-muted-foreground space-y-2">
                <li>预约使用需提前至少24小时申请。</li>
                <li>首次使用者必须参加设备操作培训并获得上机资格证。</li>
                <li>样品必须干燥、无挥发性、无磁性（特殊样品请咨询管理员）。</li>
                <li>使用过程中如遇异常情况，请立即停止操作并联系管理员。</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">存放地点</p>
                  <p className="text-sm text-muted-foreground">实验楼 A301 室</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">开放时间</p>
                  <p className="text-sm text-muted-foreground">周一至周五 09:00 - 17:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">管理员</p>
                  <p className="text-sm text-muted-foreground">王老师</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">联系电话</p>
                  <p className="text-sm text-muted-foreground">0731-88888888</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>预约日历</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
