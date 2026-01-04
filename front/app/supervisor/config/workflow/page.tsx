"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Play, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import Link from "next/link"

export default function WorkflowConfigPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [workflows, setWorkflows] = useState<any[]>([])

  const loadWorkflows = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await workflowApi.list({ page: currentPage, pageSize, searchTerm })

      // Mock data
      setWorkflows([
        {
          id: "1",
          code: "WF_PROJECT_APPLY",
          name: "项目申报流程",
          type: "项目管理",
          version: "v1.0",
          status: "启用",
          createTime: "2024-01-01",
          nodes: 5,
        },
        {
          id: "2",
          code: "WF_PROJECT_CHANGE",
          name: "项目变更流程",
          type: "项目管理",
          version: "v1.0",
          status: "启用",
          createTime: "2024-01-02",
          nodes: 4,
        },
        {
          id: "3",
          code: "WF_MIDTERM_CHECK",
          name: "中期检查流程",
          type: "项目管理",
          version: "v1.0",
          status: "启用",
          createTime: "2024-01-03",
          nodes: 3,
        },
        {
          id: "4",
          code: "WF_ACCEPTANCE",
          name: "项目验收流程",
          type: "项目管理",
          version: "v1.0",
          status: "启用",
          createTime: "2024-01-04",
          nodes: 6,
        },
        {
          id: "5",
          code: "WF_ACHIEVEMENT",
          name: "成果鉴定流程",
          type: "成果管理",
          version: "v1.0",
          status: "停用",
          createTime: "2024-01-05",
          nodes: 4,
        },
      ])
      setTotal(18)
    } catch (error) {
      console.error("Failed to load workflows:", error)
    }
  }

  useEffect(() => {
    loadWorkflows()
  }, [currentPage, pageSize, searchTerm])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">流程配置</h1>
          <p className="text-sm text-muted-foreground mt-1">配置和管理系统业务流程</p>
        </div>
        <Link href="/supervisor/config/workflow/design/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建流程
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索流程名称或编码..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${UI_CONSTANTS.INPUT_HEIGHT}`}
              />
            </div>
            <Select>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.INPUT_HEIGHT}`}>
                <SelectValue placeholder="流程类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="project">项目管理</SelectItem>
                <SelectItem value="achievement">成果管理</SelectItem>
                <SelectItem value="resource">资源管理</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.INPUT_HEIGHT}`}>
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
              搜索
            </Button>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>流程列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>流程编码</TableHead>
                <TableHead>流程名称</TableHead>
                <TableHead>流程类型</TableHead>
                <TableHead>版本</TableHead>
                <TableHead>节点数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-mono text-sm">{workflow.code}</TableCell>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{workflow.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{workflow.version}</TableCell>
                  <TableCell>{workflow.nodes} 个</TableCell>
                  <TableCell>
                    <Badge variant={workflow.status === "启用" ? "default" : "secondary"}>{workflow.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{workflow.createTime}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/supervisor/config/workflow/design/${workflow.id}`}>
                        <Button variant="ghost" size="sm" title="设计流程">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" title="复制流程">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title={workflow.status === "启用" ? "停用" : "启用"}>
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="删除">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每页显示</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UI_CONSTANTS.PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">共 {total} 条</span>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
                    className={
                      currentPage >= Math.ceil(total / pageSize) ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
