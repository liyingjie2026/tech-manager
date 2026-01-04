"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, FileText, Clock, CheckCircle, Trophy } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

interface BidItem {
  id: string
  title: string
  status: "待确认" | "待揭榜" | "已揭榜"
  unitName: string
  keywords: string
  techField: string
  deadline: string
  budget: string
}

const bidItems: BidItem[] = [
  {
    id: "1",
    title: "基于矿业权数据的空间关系压覆智能比对关...",
    status: "待确认",
    unitName: "湖南省第三测绘院",
    keywords: "测绘,空间关系,矿业权",
    techField: "矿业权空间关系压覆分析",
    deadline: "2026-12-31",
    budget: "30万元",
  },
  {
    id: "2",
    title: "基于矿业权数据的空间关系压覆智能比对关...",
    status: "待揭榜",
    unitName: "湖南省第三测绘院",
    keywords: "测绘,空间关系,矿业权",
    techField: "矿业权空间关系压覆分析",
    deadline: "2026-12-31",
    budget: "30万元",
  },
  {
    id: "3",
    title: "基于矿业权数据的空间关系压覆智能比对关...",
    status: "待揭榜",
    unitName: "湖南省第三测绘院",
    keywords: "测绘,空间关系,矿业权",
    techField: "矿业权空间关系压覆分析",
    deadline: "2026-12-31",
    budget: "30万元",
  },
  {
    id: "4",
    title: "基于矿业权数据的空间关系压覆智能比对关...",
    status: "已揭榜",
    unitName: "湖南省第三测绘院",
    keywords: "测绘,空间关系,矿业权",
    techField: "矿业权空间关系压覆分析",
    deadline: "2026-12-31",
    budget: "30万元",
  },
  {
    id: "5",
    title: "基于矿业权数据的空间关系压覆智能比对关...",
    status: "待确认",
    unitName: "湖南省第三测绘院",
    keywords: "测绘,空间关系,矿业权",
    techField: "矿业权空间关系压覆分析",
    deadline: "2026-12-31",
    budget: "30万元",
  },
  {
    id: "6",
    title: "基于矿业权数据的空间关系压覆智能比对关...",
    status: "待揭榜",
    unitName: "湖南省第三测绘院",
    keywords: "测绘,空间关系,矿业权",
    techField: "矿业权空间关系压覆分析",
    deadline: "2026-12-31",
    budget: "30万元",
  },
  {
    id: "7",
    title: "基于矿业权数据的空间关系压覆智能比对关...",
    status: "待揭榜",
    unitName: "湖南省第三测绘院",
    keywords: "测绘,空间关系,矿业权",
    techField: "矿业权空间关系压覆分析",
    deadline: "2026-12-31",
    budget: "30万元",
  },
  {
    id: "8",
    title: "基于矿业权数据的空间关系压覆智能比对关...",
    status: "已揭榜",
    unitName: "湖南省第三测绘院",
    keywords: "测绘,空间关系,矿业权",
    techField: "矿业权空间关系压覆分析",
    deadline: "2026-12-31",
    budget: "30万元",
  },
]

function getStatusBadge(status: BidItem["status"]) {
  switch (status) {
    case "待确认":
      return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-0">待确认</Badge>
    case "待揭榜":
      return <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-0">待揭榜</Badge>
    case "已揭榜":
      return <Badge className="bg-green-500 text-white hover:bg-green-500 border-0">已揭榜</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function BiddingPage() {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12) // Grid layout, use 12 items per page
  const [total, setTotal] = useState(123)

  const [selectedBid, setSelectedBid] = useState<BidItem | null>(null)
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)

  const [bidderInfo, setBidderInfo] = useState({
    contactName: "",
    contactPhone: "",
    unitName: "湖南省第三测绘院",
    planDescription: "",
  })

  const totalPages = Math.ceil(total / pageSize)

  const handleBid = (item: BidItem) => {
    setSelectedBid(item)
    setIsBidDialogOpen(true)
  }

  const handleSubmitBid = () => {
    console.log("揭榜:", selectedBid, bidderInfo)
    setIsBidDialogOpen(false)
    setBidderInfo({
      contactName: "",
      contactPhone: "",
      unitName: "湖南省第三测绘院",
      planDescription: "",
    })
  }

  const handleViewDetail = (item: BidItem) => {
    router.push(`/dashboard/bidding/${item.id}`)
  }

  const stats = [
    { label: "全部榜单", value: 123, icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "待确认", value: 25, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { label: "待揭榜", value: 68, icon: Trophy, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "已揭榜", value: 30, icon: CheckCircle, color: "text-primary", bgColor: "bg-primary/10" },
  ]

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4 items-end">
        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">榜单状态</Label>
          <Select defaultValue="已揭榜">
            <SelectTrigger className={`${UI_CONSTANTS.INPUT_HEIGHT} bg-background`}>
              <SelectValue placeholder="榜单状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              <SelectItem value="待确认">待确认</SelectItem>
              <SelectItem value="待揭榜">待揭榜</SelectItem>
              <SelectItem value="已揭榜">已揭榜</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">榜单名称</Label>
          <Input placeholder="请输入" className={`${UI_CONSTANTS.INPUT_HEIGHT} bg-background`} />
        </div>
        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">技术关键词</Label>
          <Input placeholder="请输入" className={`${UI_CONSTANTS.INPUT_HEIGHT} bg-background`} />
        </div>
        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">技术领域</Label>
          <Select defaultValue="国土资源管理">
            <SelectTrigger className={`${UI_CONSTANTS.INPUT_HEIGHT} bg-background`}>
              <SelectValue placeholder="技术领域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="国土资源管理">国土资源管理</SelectItem>
              <SelectItem value="测绘科学">测绘科学</SelectItem>
              <SelectItem value="地质学">地质学</SelectItem>
              <SelectItem value="信息技术">信息技术</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground mb-1.5 block">榜单金额</Label>
            <Select defaultValue="10万及以下">
              <SelectTrigger className={`${UI_CONSTANTS.INPUT_HEIGHT} bg-background`}>
                <SelectValue placeholder="榜单金额" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10万及以下">10万及以下</SelectItem>
                <SelectItem value="10-30万">10-30万</SelectItem>
                <SelectItem value="30-50万">30-50万</SelectItem>
                <SelectItem value="50万以上">50万以上</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-primary text-primary-foreground mt-5">
            <Search className="h-4 w-4 mr-1" />
            查询
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        共 <span className="text-primary font-medium">{total}</span> 个榜单
      </div>

      <div className="grid grid-cols-4 gap-4">
        {bidItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
          <div key={item.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* 卡片头部 - 标题和状态 */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm leading-tight line-clamp-2 flex-1">{item.title}</h3>
                {getStatusBadge(item.status)}
              </div>
            </div>

            {/* 卡片内容 - 详细信息 */}
            <div className="p-4 space-y-2 text-sm">
              <div className="flex">
                <span className="text-muted-foreground w-20 shrink-0">单位名称</span>
                <span className="text-foreground truncate">{item.unitName}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-20 shrink-0">技术关键词</span>
                <span className="text-foreground truncate">{item.keywords}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-20 shrink-0">技术领域</span>
                <span className="text-foreground truncate">{item.techField}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-20 shrink-0">完成时限</span>
                <span className="text-foreground">{item.deadline}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-20 shrink-0">预计出资</span>
                <span className="text-foreground">{item.budget}</span>
              </div>
            </div>

            {/* 卡片底部 - 操作按钮 */}
            <div className="px-4 pb-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => handleBid(item)}
                disabled={item.status === "已揭榜"}
              >
                立即揭榜
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-primary hover:text-primary"
                onClick={() => handleViewDetail(item)}
              >
                查看详情
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 7 && <span className="px-2">...</span>}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium">揭榜挂帅</DialogTitle>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-6">
            {/* 榜单信息 */}
            <div className="space-y-3">
              <h3 className="font-medium text-base border-l-4 border-primary pl-2">榜单信息</h3>
              {selectedBid && (
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-muted-foreground w-20 shrink-0">榜单名称</span>
                    <span className="text-foreground">基于矿业权数据的空间关系压覆智能比对关键技术研究</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-20 shrink-0">技术关键词</span>
                    <span className="text-foreground">{selectedBid.keywords}</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-20 shrink-0">榜单描述</span>
                    <span className="text-foreground leading-relaxed">
                      为解决传统矿业权空间关系压覆查询比对效率低下，易产生遗漏错误，审批时效长等问题，进一步提升政务服务审批效率，本文探索基于自然资源数据"一张图"，利用高性能IGServer等信息技术，建设矿业权数据空间压覆智能比对"数字员工"系统，研究智能比对分析和动态调整比例尺，动态注记等关键技术，输出图文分析报告。
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-20 shrink-0">其他要求</span>
                    <span className="text-foreground">其它要求其它要求其它要求其它要求其它要求其它要求其它要求。</span>
                  </div>
                </div>
              )}
            </div>

            {/* 揭榜人信息 */}
            <div className="space-y-3">
              <h3 className="font-medium text-base border-l-4 border-primary pl-2">揭榜人信息</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">联系人</Label>
                  <Input
                    value={bidderInfo.contactName}
                    onChange={(e) => setBidderInfo({ ...bidderInfo, contactName: e.target.value })}
                    placeholder="请输入联系人"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">联系电话</Label>
                  <Input
                    value={bidderInfo.contactPhone}
                    onChange={(e) => setBidderInfo({ ...bidderInfo, contactPhone: e.target.value })}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">单位名称</Label>
                  <Input value={bidderInfo.unitName} disabled className="bg-muted/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">方案描述</Label>
                <Textarea
                  value={bidderInfo.planDescription}
                  onChange={(e) => setBidderInfo({ ...bidderInfo, planDescription: e.target.value })}
                  placeholder="这里方案描述这里方案描述这里方案描述这里方案描述这里方案描述这里方案描述"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setIsBidDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitBid}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
