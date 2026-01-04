"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { acceptanceApi } from "@/lib/api/acceptance"
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

const AcceptancePage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [acceptances, setAcceptances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [projectNumber, setProjectNumber] = useState("")
  const [projectName, setProjectName] = useState("")
  const [reviewStatus, setReviewStatus] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGE_SIZE_DEFAULT)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadAcceptances()
  }, [currentPage, pageSize])

  const loadAcceptances = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading acceptances with params:", {
        current: currentPage,
        size: pageSize,
        projectNumber,
        projectName,
        reviewStatus,
      })
      const response = await acceptanceApi.getList({
        current: currentPage,
        size: pageSize,
        projectNumber,
        projectName,
        reviewStatus,
      })
      console.log("[v0] Acceptance API response:", response)
      if (response.data) {
        const listData = response.data.records || response.data.list || []
        const totalCount = response.data.total || listData.length
        console.log("[v0] Acceptances loaded:", listData.length, "items, total:", totalCount)
        setAcceptances(listData)
        setTotal(totalCount)
      }
    } catch (error) {
      console.error("[v0] Failed to load acceptances:", error)
      toast({
        title: "加载失败",
        description: "无法加载验收评审列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="secondary" className={getStatusColor(status)}>
        {getStatusText(status, "acceptance")}
      </Badge>
    )
  }

  const getActions = (item: any) => {
    const checkStatus = item.reviewStatus || item.status

    if (checkStatus === "draft" || checkStatus === "pending") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/projects/acceptance/${item.id}`)}>
            详情
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => router.push(`/dashboard/projects/acceptance/${item.id}/edit`)}
          >
            编辑
          </Button>
        </div>
      )
    }

    return (
      <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/projects/acceptance/${item.id}`)}>
        详情
      </Button>
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(acceptances.map((item) => item.id))
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
    loadAcceptances()
  }

  const handleReset = () => {
    setProjectNumber("")
    setProjectName("")
    setReviewStatus("")
    setCurrentPage(1)
    loadAcceptances()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">项目验收评审</h1>
        <p className="text-sm text-muted-foreground mt-1">管理和提交项目验收材料</p>
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
            <label className="text-sm font-medium">验收状态：</label>
            <Select value={reviewStatus} onValueChange={setReviewStatus}>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="待验收" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="pending">待验收</SelectItem>
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
                  <Checkbox checked={selectedIds.length === acceptances.length} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead>项目编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>验收状态</TableHead>
                <TableHead>验收时间</TableHead>
                <TableHead>提交人</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acceptances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无验收评审数据
                  </TableCell>
                </TableRow>
              ) : (
                acceptances.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-mono">{item.projectNo || item.projectNumber}</TableCell>
                    <TableCell>{item.projectName}</TableCell>
                    <TableCell>{getStatusBadge(item.status || item.reviewStatus)}</TableCell>
                    <TableCell>{item.acceptanceTime || item.submitTime}</TableCell>
                    <TableCell>{item.projectLeader || item.submitter}</TableCell>
                    <TableCell>{item.updateTime || item.submitTime}</TableCell>
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
    </div>
  )
}

export default AcceptancePage
