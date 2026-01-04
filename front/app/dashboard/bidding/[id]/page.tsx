"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight } from "lucide-react"

// 模拟榜单详情数据
const bidDetail = {
  id: "1",
  title: "基于矿业权数据的空间关系压覆智能比对关键技术研究",
  unitName: "湖南省第三测绘院",
  contactPerson: "胡歌",
  contactPhone: "18311224466",
  bidEndDate: "2025-08-30",
  deadline: "2026-12-31",
  budget: "30万元",
  techField: "矿业权空间关系压覆分析",
  keywords: "测绘,空间关系,矿业权,智能比对",
  description:
    "为解决传统矿业权空间关系压覆查询比对效率低下，易产生遗漏错误，审批时效长等问题，进一步提升政务服务审批效率，本文探索基于自然资源数据的高分辨率地图，利用高性能IGServer等信息技术，建设矿业权数据空间压覆智能比对系统，研究智能比对分析和动态调整比例尺，动态注记等关键技术，输出图文分析报告。",
  otherRequirements: "其它要求其它要求其它要求其它要求其它要求其它要求其它要求其它要求。",
  bidRecords: [{ id: 1, bidder: "张三", unitName: "湖南省第三测绘院" }],
}

export default function BidDetailPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-4">
      {/* 面包屑导航 */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span className="hover:text-primary cursor-pointer" onClick={() => router.push("/dashboard/bidding")}>
          我要揭榜
        </span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">榜单详情</span>
      </div>

      {/* 榜单详情卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b">
          <CardTitle className="text-base font-medium">榜单详情</CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            返回
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* 左侧图片 */}
            <div className="w-40 h-32 bg-muted rounded border flex items-center justify-center shrink-0">
              <img src="/project-thumbnail.png" alt="榜单图片" className="w-full h-full object-cover rounded" />
            </div>

            {/* 右侧信息 */}
            <div className="flex-1 space-y-4">
              {/* 标题 */}
              <h2 className="text-lg font-medium text-primary">{bidDetail.title}</h2>

              {/* 基本信息网格 */}
              <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
                <div className="flex">
                  <span className="text-muted-foreground w-24 shrink-0">单位名称</span>
                  <span className="text-foreground">{bidDetail.unitName}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-16 shrink-0">联系人</span>
                  <span className="text-foreground">{bidDetail.contactPerson}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-16 shrink-0">联系电话</span>
                  <span className="text-foreground">{bidDetail.contactPhone}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24 shrink-0">揭榜结束时间</span>
                  <span className="text-foreground">{bidDetail.bidEndDate}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-16 shrink-0">完成时限</span>
                  <span className="text-foreground">{bidDetail.deadline}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-16 shrink-0">预计出资</span>
                  <span className="text-foreground">{bidDetail.budget}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24 shrink-0">技术领域</span>
                  <span className="text-foreground">{bidDetail.techField}</span>
                </div>
                <div className="flex col-span-2">
                  <span className="text-muted-foreground w-16 shrink-0">技术关键词</span>
                  <span className="text-foreground">{bidDetail.keywords}</span>
                </div>
              </div>

              {/* 榜单描述 */}
              <div className="text-sm">
                <span className="text-muted-foreground">榜单描述</span>
                <p className="text-foreground mt-1 leading-relaxed">{bidDetail.description}</p>
              </div>

              {/* 其他要求 */}
              <div className="text-sm">
                <span className="text-muted-foreground">其他要求</span>
                <p className="text-foreground mt-1">{bidDetail.otherRequirements}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 揭榜记录 */}
      <Card>
        <CardHeader className="py-4 px-6 border-b">
          <CardTitle className="text-base font-medium">揭榜记录</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 text-center">序号</TableHead>
                <TableHead className="text-center">揭榜人</TableHead>
                <TableHead className="text-center">单位名称</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bidDetail.bidRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-center">{record.id}</TableCell>
                  <TableCell className="text-center">{record.bidder}</TableCell>
                  <TableCell className="text-center">{record.unitName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
