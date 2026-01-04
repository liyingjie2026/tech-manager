"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useState, useEffect } from "react"
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

export default function ProjectAcceptancePage() {
  const { toast } = useToast()
  const [acceptances, setAcceptances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState("")
  const [projectNo, setProjectNo] = useState("")
  const [acceptanceStatus, setAcceptanceStatus] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGE_SIZE_DEFAULT)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadAcceptances()
  }, [currentPage, pageSize])

  const loadAcceptances = async () => {
    try {
      setLoading(true)
      const response = await acceptanceApi.getList({
        current: currentPage,
        size: pageSize,
        projectName,
        projectNo,
        status: acceptanceStatus,
      })
      if (response.data) {
        const listData = response.data.records || response.data.list || []
        const totalCount = response.data.total || listData.length
        setAcceptances(listData)
        setTotal(totalCount)
      }
    } catch (error) {
      console.error("Failed to load acceptances:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目验收列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadAcceptances()
  }

  const handleReset = () => {
    setProjectName("")
    setProjectNo("")
    setAcceptanceStatus("")
    setCurrentPage(1)
    loadAcceptances()
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[{ label: "项目管理" }, { label: "项目验收" }]} />

      <Card>
        <CardHeader>
          <CardTitle>项目验收列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-3 ${UI_CONSTANTS.GRID_GAP} mb-6`}>
            <div className="space-y-2">
              <label className="text-sm">项目名称:</label>
              <Input
                className={UI_CONSTANTS.INPUT_HEIGHT}
                placeholder="请输入内容"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">项目编号:</label>
              <Input
                className={UI_CONSTANTS.INPUT_HEIGHT}
                placeholder="请输入内容"
                value={projectNo}
                onChange={(e) => setProjectNo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">验收状态:</label>
              <Select value={acceptanceStatus} onValueChange={setAcceptanceStatus}>
                <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                  <SelectValue placeholder="请选择内容" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待发起</SelectItem>
                  <SelectItem value="failed">未通过</SelectItem>
                  <SelectItem value="passed">通过</SelectItem>
                  <SelectItem value="submitted">已提交</SelectItem>
                  <SelectItem value="in_progress">评审中</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`flex ${UI_CONSTANTS.BUTTON_GAP} mb-4`}>
            <Button onClick={handleSearch}>查询</Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>项目负责人</TableHead>
                  <TableHead>验收状态</TableHead>
                  <TableHead>项目验收时间</TableHead>
                
                  <TableHead>提交时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acceptances.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-mono">{item.projectNo}</TableCell>
                    <TableCell className="font-medium">{item.projectName}</TableCell>
        
                    <TableCell>{item.projectLeader}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "passed"
                            ? "default"
                            : item.acceptanceStatus === "failed"
                              ? "destructive"
                              : "outline"
                        }
                        className={getStatusColor(item.status)}
                      >
                        {getStatusText(item.status, "acceptance")}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.acceptanceTime}</TableCell>
                
                    <TableCell>{item.submitTime}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {item.status === "pending" && (
                          <>
                            <Link href={`/dashboard/project-acceptance/${item.id}`}>
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                详情
                              </Button>
                            </Link>
                            <Link href={`/dashboard/project-acceptance/${item.id}/edit`}>
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                编辑
                              </Button>
                            </Link>
                          </>
                        )}
                        {item.status === "completed" && (
                          <>
                            <Link href={`/dashboard/project-acceptance/${item.id}`}>
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                详情
                              </Button>
                            </Link>
                            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                              查看
                            </Button>
                          </>
                        )}
                        {item.status === "in_progress" && (
                          <>
                            <Link href={`/dashboard/project-acceptance/${item.id}`}>
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                详情
                              </Button>
                            </Link>
                            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                              审批进度
                            </Button>
                          </>
                        )}
                        {item.status === "passed" && (
                          <>
                            <Link href={`/dashboard/project-acceptance/${item.id}`}>
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                详情
                              </Button>
                            </Link>
                            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                              审批历史
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
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
        </CardContent>
      </Card>
    </div>
  )
}
