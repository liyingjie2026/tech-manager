"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { annualApi } from "@/lib/api/annual"
import { useToast } from "@/hooks/use-toast"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { getStatusText, getStatusColor } from "@/lib/utils/status-maps"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function AnnualCheckPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [annuals, setAnnuals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [projectNumber, setProjectNumber] = useState("")
  const [projectName, setProjectName] = useState("")
  const [reviewStatus, setReviewStatus] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGE_SIZE_DEFAULT)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadAnnuals()
  }, [currentPage, pageSize])

  const loadAnnuals = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading annuals with params:", {
        current: currentPage,
        size: pageSize,
        projectNumber,
        projectName,
        reviewStatus,
      })
      const response = await annualApi.getList({
        current: currentPage,
        size: pageSize,
        projectNumber,
        projectName,
        reviewStatus,
      })
      console.log("[v0] Annual API response:", response)
      if (response.data) {
        const listData = response.data.records || response.data.list || []
        const totalCount = response.data.total || listData.length
        console.log("[v0] Annuals loaded:", listData.length, "items, total:", totalCount)
        setAnnuals(listData)
        setTotal(totalCount)
      }
    } catch (error) {
      console.error("[v0] Failed to load annuals:", error)
      toast({
        title: "加载失败",
        description: "无法加载年度检查列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="secondary" className={getStatusColor(status)}>
        {getStatusText(status, "annual")}
      </Badge>
    )
  }

  const getActions = (item: any) => {
    const checkStatus = item.reviewStatus || item.status

    if (checkStatus === "draft" || checkStatus === "pending") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/projects/annual/${item.id}`)}>
            详情
          </Button>
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/projects/annual/${item.id}/edit`)}>
            编辑
          </Button>
        </div>
      )
    }

    if (checkStatus === "submitted" || checkStatus === "in_progress") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/projects/annual/${item.id}`)}>
            详情
          </Button>
          <Button variant="link" size="sm" onClick={() => setShowHistory(true)}>
            查看进度
          </Button>
        </div>
      )
    }

    if (checkStatus === "approved" || checkStatus === "passed") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/projects/annual/${item.id}`)}>
            详情
          </Button>
          <Button variant="link" size="sm" onClick={() => setShowHistory(true)}>
            审批历史
          </Button>
        </div>
      )
    }

    return (
      <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/projects/annual/${item.id}`)}>
        详情
      </Button>
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(annuals.map((item) => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadAnnuals()
  }

  const handleReset = () => {
    setProjectNumber("")
    setProjectName("")
    setReviewStatus("")
    setCurrentPage(1)
    loadAnnuals()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">年度检查</h1>
        <p className="text-sm text-muted-foreground mt-1">查看和提交年度检查材料</p>
      </div>

      <Card className="p-4">
        <div className={`grid grid-cols-3 ${UI_CONSTANTS.GRID_GAP} items-end`}>
          <div className="space-y-2">
            <label className="text-sm font-medium">项目编号：</label>
            <Input
              className={UI_CONSTANTS.INPUT_HEIGHT}
              placeholder="输入后显示"
              value={projectNumber}
              onChange={(e) => setProjectNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">项目名称：</label>
            <Input
              className={UI_CONSTANTS.INPUT_HEIGHT}
              placeholder="输入后显示"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">检查状态：</label>
            <Select value={reviewStatus} onValueChange={setReviewStatus}>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="待检查" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="pending">待检查</SelectItem>
                <SelectItem value="submitted">已提交</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={`flex justify-end mt-4 ${UI_CONSTANTS.BUTTON_GAP}`}>
          <Button variant="outline" onClick={handleReset}>
            重 置
          </Button>
          <Button onClick={handleSearch}>查 询</Button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">加载中...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={selectedIds.length === annuals.length} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead>项目编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>检查状态</TableHead>
          
                <TableHead>年度检查时间</TableHead>
                <TableHead>项目负责人</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {annuals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    暂无年度检查数据
                  </TableCell>
                </TableRow>
              ) : (
                annuals.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-mono">{item.projectNo}</TableCell>
                    <TableCell>{item.projectName}</TableCell>
                    <TableCell>{getStatusBadge(item.status || item.reviewStatus)}</TableCell>
                    <TableCell>{item.checkYear}</TableCell>
        
                    <TableCell>{item.projectLeader}</TableCell>
                    <TableCell>{item.submitTime}</TableCell>
                    <TableCell>{getActions(item)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">共 {total} 条</div>
          <div className="flex items-center gap-4">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UI_CONSTANTS.PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}条/页
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => i + 1)
                  .filter((page) => {
                    const totalPages = Math.ceil(total / pageSize)
                    if (totalPages <= 7) return true
                    if (page === 1 || page === totalPages) return true
                    if (Math.abs(page - currentPage) <= 1) return true
                    return false
                  })
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return [
                        <PaginationItem key={`ellipsis-${page}`}>
                          <span className="px-2">...</span>
                        </PaginationItem>,
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>,
                      ]
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < Math.ceil(total / pageSize) && setCurrentPage(currentPage + 1)}
                    className={
                      currentPage >= Math.ceil(total / pageSize) ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Card>

      <Sheet open={showHistory} onOpenChange={setShowHistory}>
        <SheetContent className="w-[400px]">
          <SheetHeader>
            <SheetTitle>年度检查记录</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">{/* Placeholder for history records */}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
