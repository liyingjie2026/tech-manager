"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/ui/page-header"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search } from "lucide-react"
import { demandApi } from "@/lib/api/demand"
import { useToast } from "@/hooks/use-toast"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

interface BidItem {
  id: string
  title: string
  status: "待确认" | "待揭榜" | "已揭榜"
  unitName: string
  keywords: string
  field: string
  deadline: string
  budget: string
}

export default function BidPage() {
  const { toast } = useToast()
  const [bidList, setBidList] = useState<BidItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showBidDialog, setShowBidDialog] = useState(false)
  const [selectedBid, setSelectedBid] = useState<BidItem | null>(null)
  const [bidReason, setBidReason] = useState("")

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  })

  useEffect(() => {
    loadDemands()
  }, [pagination.page, pagination.pageSize])

  const loadDemands = async () => {
    try {
      setLoading(true)
      const response = await demandApi.getList({
        current: pagination.page,
        size: pagination.pageSize,
        status: "published",
      })
      if (response.data) {
        const items = (response.data.records || response.data.list || response.data || []).map((demand: any) => ({
          id: demand.id,
          title: demand.title,
          status: demand.bidStatus || "待揭榜",
          unitName: demand.institutionName || "",
          keywords: demand.keywords || "",
          field: demand.field || "",
          deadline: demand.deadline || "",
          budget: demand.budget || "",
        }))
        setBidList(items)
        setPagination((prev) => ({ ...prev, total: response.data.total || items.length }))
      }
    } catch (error) {
      console.error("Failed to load demands:", error)
      toast({
        title: "加载失败",
        description: "无法加载揭榜列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "待确认":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">{status}</Badge>
      case "待揭榜":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">{status}</Badge>
      case "已揭榜":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleBid = (item: BidItem) => {
    setSelectedBid(item)
    setShowBidDialog(true)
  }

  const handleSubmitBid = async () => {
    if (!selectedBid) return
    try {
      await demandApi.create({ demandId: selectedBid.id, reason: bidReason } as any)
      toast({ title: "揭榜成功", description: "您的揭榜申请已提交" })
      setShowBidDialog(false)
      setBidReason("")
      loadDemands()
    } catch (error) {
      toast({ title: "揭榜失败", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="我要揭榜" subtitle="浏览可揭榜项目，参与科研攻关" backHref="/dashboard" />

      {/* 筛选条件 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <Label className="shrink-0 text-sm">榜单状态</Label>
              <Select defaultValue="已揭榜">
                <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="待确认">待确认</SelectItem>
                  <SelectItem value="待揭榜">待揭榜</SelectItem>
                  <SelectItem value="已揭榜">已揭榜</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="shrink-0 text-sm">榜单名称</Label>
              <Input placeholder="请输入" className={UI_CONSTANTS.INPUT_HEIGHT} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="shrink-0 text-sm">技术关键词</Label>
              <Input placeholder="请输入" className={UI_CONSTANTS.INPUT_HEIGHT} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="shrink-0 text-sm">技术领域</Label>
              <Select defaultValue="国土资源管理">
                <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="国土资源管理">国土资源管理</SelectItem>
                  <SelectItem value="地质灾害防治">地质灾害防治</SelectItem>
                  <SelectItem value="测绘地理信息">测绘地理信息</SelectItem>
                  <SelectItem value="生态修复">生态修复</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="shrink-0 text-sm">榜单金额</Label>
              <Select defaultValue="10万及以下">
                <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10万及以下">10万及以下</SelectItem>
                  <SelectItem value="10-50万">10-50万</SelectItem>
                  <SelectItem value="50-100万">50-100万</SelectItem>
                  <SelectItem value="100万以上">100万以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button className={UI_CONSTANTS.BUTTON_HEIGHT}>
              <Search className="h-4 w-4 mr-2" />
              查询
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 榜单数量 */}
      <div className="text-sm text-muted-foreground">
        共 <span className="text-primary font-medium">{pagination.total}</span> 个榜单
      </div>

      {/* 榜单卡片列表 */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">加载中...</div>
      ) : bidList.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">暂无可揭榜项目</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bidList.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-medium text-sm leading-tight line-clamp-2 flex-1">{item.title}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex">
                    <span className="shrink-0 w-16">单位名称</span>
                    <span className="text-foreground">{item.unitName}</span>
                  </div>
                  <div className="flex">
                    <span className="shrink-0 w-16">技术关键词</span>
                    <span className="text-foreground">{item.keywords}</span>
                  </div>
                  <div className="flex">
                    <span className="shrink-0 w-16">技术领域</span>
                    <span className="text-foreground">{item.field}</span>
                  </div>
                  <div className="flex">
                    <span className="shrink-0 w-16">完成时限</span>
                    <span className="text-foreground">{item.deadline}</span>
                  </div>
                  <div className="flex">
                    <span className="shrink-0 w-16">预计出资</span>
                    <span className="text-foreground">{item.budget}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleBid(item)}
                    disabled={item.status === "已揭榜"}
                  >
                    立即揭榜
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1">
                    查看详情
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">每页显示</span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => setPagination({ ...pagination, page: 1, pageSize: Number.parseInt(value) })}
            >
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">条</span>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.page > 1 && setPagination({ ...pagination, page: pagination.page - 1 })}
                  className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {[...Array(Math.ceil(pagination.total / pagination.pageSize))].map((_, i) => {
                const pageNumber = i + 1
                if (
                  pageNumber === 1 ||
                  pageNumber === Math.ceil(pagination.total / pagination.pageSize) ||
                  (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                ) {
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setPagination({ ...pagination, page: pageNumber })}
                        isActive={pagination.page === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (pageNumber === pagination.page - 2 || pageNumber === pagination.page + 2) {
                  return (
                    <PaginationItem key={i}>
                      <span className="px-4">...</span>
                    </PaginationItem>
                  )
                }
                return null
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    pagination.page < Math.ceil(pagination.total / pagination.pageSize) &&
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  className={
                    pagination.page >= Math.ceil(pagination.total / pagination.pageSize)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* 揭榜对话框 */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认揭榜</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="font-medium">榜单名称</Label>
              <p className="text-sm text-muted-foreground mt-1">{selectedBid?.title}</p>
            </div>
            <div>
              <Label className="font-medium">揭榜理由</Label>
              <Textarea
                className="mt-2"
                placeholder="请说明您的揭榜理由和优势..."
                value={bidReason}
                onChange={(e) => setBidReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBidDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitBid}>确认揭榜</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
