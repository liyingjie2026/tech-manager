"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { taskBookApi } from "@/lib/api"

export default function TaskManagementPage() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [projectName, setProjectName] = useState("")
  const [projectNo, setProjectNo] = useState("")
  const [budget, setBudget] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [projectList, setProjectList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTaskBooks()
  }, [currentPage, pageSize])

  const loadTaskBooks = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading task books with params:", {
        current: currentPage,
        size: pageSize,
        projectName,
        projectNo,
      })
      const response = await taskBookApi.list({
        current: currentPage,
        size: pageSize,
        projectName: projectName || undefined,
        projectNo: projectNo || undefined,
      })
      console.log("[v0] Task book API response:", response)

      if (response?.data) {
        const listData = response.data.records || response.data || []
        const totalCount = response.data.total || listData.length
        console.log("[v0] Task books loaded:", listData.length, "items, total:", totalCount)
        setProjectList(listData)
        setTotal(totalCount)
      }
    } catch (error) {
      console.error("[v0] Failed to load task books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadTaskBooks()
  }

  const handleReset = () => {
    setProjectName("")
    setProjectNo("")
    setBudget("")
    setCurrentPage(1)
  }

  const renderActions = (status: string, id: string) => {
    if (status === "已签订" || status === "approved") {
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/projects/task/${id}`} className="text-blue-600 hover:underline">
            详情
          </Link>
          <Link href={`/dashboard/project-change/edit/${id}`} className="text-blue-600 hover:underline">
            项目变更
          </Link>
        </div>
      )
    } else if (status === "待签订" || status === "pending") {
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/projects/task/${id}/split`} className="text-blue-600 hover:underline">
            任务拆分
          </Link>
          <Link href={`/dashboard/projects/task/${id}/upload`} className="text-blue-600 hover:underline">
            任务书上传
          </Link>
          <Link href={`/dashboard/projects/task/${id}/submit`} className="text-blue-600 hover:underline">
            提交审核
          </Link>
        </div>
      )
    } else if (status === "流程中" || status === "in_progress") {
      return (
        <Link href={`/dashboard/projects/task/${id}/progress`} className="text-blue-600 hover:underline">
          查看进度
        </Link>
      )
    }
    return null
  }

  const totalPages = Math.ceil(total / pageSize)

  const renderPagination = () => {
    const pages = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    pages.push(
      <PaginationItem key={1}>
        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    if (showEllipsisStart) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    if (showEllipsisEnd) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return pages
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-sm text-muted-foreground">首页 / 项目管理 / 任务书管理</div>

      <Card className="p-6">
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm whitespace-nowrap">项目名称：</label>
              <Input
                placeholder="输入后显示"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={UI_CONSTANTS.INPUT_HEIGHT}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm whitespace-nowrap">项目编号：</label>
              <Input
                placeholder="请输入"
                value={projectNo}
                onChange={(e) => setProjectNo(e.target.value)}
                className={UI_CONSTANTS.INPUT_HEIGHT}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm whitespace-nowrap">项目预算：</label>
              <Input
                placeholder="请输入"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={UI_CONSTANTS.INPUT_HEIGHT}
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                展开 <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" className="px-8 bg-transparent" onClick={handleReset}>
                重 置
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 px-8" onClick={handleSearch} disabled={loading}>
                查 询
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>项目编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>任务书状态</TableHead>
                <TableHead>任务书是否已上传</TableHead>
                <TableHead>项目开始时间</TableHead>
                <TableHead>项目结束时间</TableHead>
                <TableHead>项目负责人</TableHead>
                <TableHead>项目牵头单位</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : projectList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                projectList.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-mono">{project.projectNo || project.taskBookNo || "-"}</TableCell>
                    <TableCell>{project.projectName || "-"}</TableCell>
                    <TableCell>{project.signStatus || project.status || "-"}</TableCell>
                    <TableCell>{project.taskBookUploaded ? "是" : "否"}</TableCell>
                    <TableCell>{project.startDate || "-"}</TableCell>
                    <TableCell>{project.endDate || "-"}</TableCell>
                    <TableCell>{project.projectLeader || "-"}</TableCell>
                    <TableCell>{project.institutionName || "-"}</TableCell>
                    {/* </CHANGE> */}
                    <TableCell>{renderActions(project.signStatus || project.status, project.id)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">共 {total} 条</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <select
                className={`border rounded px-2 ${UI_CONSTANTS.SELECT_HEIGHT} text-sm`}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}条/页
                  </option>
                ))}
              </select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {renderPagination()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">前往</span>
              <Input
                type="number"
                className="w-16 h-8"
                min="1"
                max={totalPages}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = Number.parseInt((e.target as HTMLInputElement).value)
                    if (value >= 1 && value <= totalPages) {
                      setCurrentPage(value)
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
