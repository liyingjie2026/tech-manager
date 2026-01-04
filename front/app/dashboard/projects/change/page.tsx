"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { changeApi } from "@/lib/api/change"
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

export default function ProjectChangePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [changes, setChanges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [projectNumber, setProjectNumber] = useState("")
  const [projectName, setProjectName] = useState("")
  const [projectStatus, setProjectStatus] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGE_SIZE_DEFAULT)
  const [total, setTotal] = useState(0)
  const [changeHistory, setChangeHistory] = useState<any[]>([])

  useEffect(() => {
    loadChanges()
  }, [currentPage, pageSize])

  const loadChanges = async () => {
    try {
      setLoading(true)
      const response = await changeApi.getList({
        page: currentPage,
        pageSize: pageSize,
        projectNumber,
        projectName,
        status: projectStatus,
      })
      if (response.data) {
        const listData = response.data.records || response.data.list || []
        const totalCount = response.data.total || listData.length
        setChanges(listData)
        setTotal(totalCount)
      }
    } catch (error) {
      console.error("Failed to load changes:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目变更列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadChangeHistory = async (projectId: string) => {
    try {
      const response = await changeApi.getHistory(projectId)
      if (response.data) {
        setChangeHistory(response.data)
      }
    } catch (error) {
      console.error("Failed to load change history:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目变更记录",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="secondary" className={getStatusColor(status)}>
        {getStatusText(status, "change")}
      </Badge>
    )
  }

  const getActions = (item: any) => {
    const flowStatus = item.flowStatus || item.status

    if (flowStatus === "draft") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/project-change/edit/${item.id}`)}>
            编辑
          </Button>
          <Button variant="link" size="sm" onClick={() => handleSubmit(item.id)}>
            提交
          </Button>
          <Button variant="link" size="sm" className="text-destructive" onClick={() => handleDelete(item.id)}>
            删除
          </Button>
        </div>
      )
    }

    if (flowStatus === "in_progress" || flowStatus === "submitted") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/project-change/${item.id}`)}>
            详情
          </Button>
          <Button variant="link" size="sm" onClick={() => handleViewProgress(item.id)}>
            审批进度
          </Button>
        </div>
      )
    }

    if (flowStatus === "approved" || flowStatus === "completed") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/project-change/${item.id}`)}>
            详情
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setShowHistory(true)
              loadChangeHistory(item.id)
            }}
          >
            审批历史
          </Button>
        </div>
      )
    }

    return (
      <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/project-change/${item.id}`)}>
        详情
      </Button>
    )
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadChanges()
  }

  const handleReset = () => {
    setProjectNumber("")
    setProjectName("")
    setProjectStatus("")
    setCurrentPage(1)
    loadChanges()
  }

  const handleSubmit = async (changeId: string) => {
    try {
      await changeApi.submit(changeId)
      toast({
        title: "提交成功",
        description: "项目变更已提交审批",
      })
      loadChanges()
    } catch (error) {
      toast({
        title: "提交失败",
        description: "无法提交项目变更",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (changeId: string) => {
    if (confirm("确定删除此项目变更吗？")) {
      try {
        await changeApi.delete(changeId)
        toast({
          title: "删除成功",
          description: "项目变更已删除",
        })
        loadChanges()
      } catch (error) {
        toast({
          title: "删除失败",
          description: "无法删除项目变更",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewProgress = (changeId: string) => {
    router.push(`/dashboard/project-change/${changeId}/progress`)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">项目变更</h1>
        <p className="text-sm text-muted-foreground mt-1">管理项目变更申请和审核</p>
      </div>

      <Card className="p-4">
        <div className={`grid grid-cols-3 ${UI_CONSTANTS.GRID_GAP} items-end`}>
          <div className="space-y-2">
            <label className="text-sm font-medium">项目编号：</label>
            <Input
              className={UI_CONSTANTS.INPUT_HEIGHT}
              placeholder="2024KY01"
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
            <label className="text-sm font-medium">项目状态：</label>
            <Select value={projectStatus} onValueChange={setProjectStatus}>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="请输入" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="ongoing">进行中</SelectItem>
                <SelectItem value="completed">已验收</SelectItem>
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
                <TableHead>项目编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>项目状态</TableHead>
                <TableHead>变更状态/记录</TableHead>
                <TableHead>项目开始时间</TableHead>
                <TableHead>项目结束时间</TableHead>
                <TableHead>项目计划工期（天）</TableHead>
                <TableHead>项目负责人</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    暂无项目变更数据
                  </TableCell>
                </TableRow>
              ) : (
                changes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.projectNumber}</TableCell>
                    <TableCell>{item.projectName}</TableCell>
                    <TableCell>{item.projectStatus}</TableCell>
                    <TableCell>{getStatusBadge(item.changeStatus)}</TableCell>
                    <TableCell>{item.startDate}</TableCell>
                    <TableCell>{item.endDate}</TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>{item.leader}</TableCell>
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
            <SheetTitle>项目变更记录</SheetTitle>
          </SheetHeader>
          {changeHistory.length === 0 ? (
            <div className="mt-6 text-center py-8 text-muted-foreground">暂无变更记录</div>
          ) : (
            changeHistory.map((historyItem, index) => (
              <div key={index} className="relative pl-6 mt-6">
                <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-red-500" />
                {index < changeHistory.length - 1 && (
                  <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border" />
                )}
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{historyItem.timestamp}</div>
                  <div className="text-sm">{historyItem.comment}</div>
                  <div className="text-sm ml-4 whitespace-pre-line text-muted-foreground">{historyItem.details}</div>
                </div>
              </div>
            ))
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
