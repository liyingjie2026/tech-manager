"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Eye, Copy, Trash2, Power } from "lucide-react"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

export default function ApplicationConfigPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [batches, setBatches] = useState<any[]>([])

  const loadBatches = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await batchApi.list({ page: currentPage, pageSize })

      // Mock data
      setBatches([
        {
          id: 1,
          name: "2025年度科技创新项目第一批",
          startDate: "2025-01-01",
          endDate: "2025-03-31",
          directions: ["地质灾害", "国土规划", "智慧监管"],
          qualification: "省级以上资质",
          limit: "5个/单位",
          status: "active",
        },
        {
          id: 2,
          name: "2025年度重大专项项目",
          startDate: "2025-02-01",
          endDate: "2025-04-30",
          directions: ["生态保护", "资源勘查"],
          qualification: "国家级资质",
          limit: "2个/单位",
          status: "active",
        },
        {
          id: 3,
          name: "2024年度科技创新项目第二批",
          startDate: "2024-07-01",
          endDate: "2024-09-30",
          directions: ["测绘地理", "大数据"],
          qualification: "省级以上资质",
          limit: "5个/单位",
          status: "finished",
        },
      ])
      setTotal(12)
    } catch (error) {
      console.error("Failed to load batches:", error)
    }
  }

  useEffect(() => {
    loadBatches()
  }, [currentPage, pageSize])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">申报配置</h1>
          <p className="text-sm text-muted-foreground mt-1">配置项目申报批次、支持方向、资质要求等信息</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增批次
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="批次名称" className={`pl-9 ${UI_CONSTANTS.INPUT_HEIGHT}`} />
            </div>
            <div className="flex gap-2">
              <Button className={`flex-1 ${UI_CONSTANTS.BUTTON_HEIGHT}`}>查询</Button>
              <Button variant="outline" className={`flex-1 ${UI_CONSTANTS.BUTTON_HEIGHT}`}>
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">批次列表</CardTitle>
          <Badge variant="default">活动批次: 2</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>批次名称</TableHead>
                <TableHead>申报时间范围</TableHead>
                <TableHead>支持方向</TableHead>
                <TableHead>资质要求</TableHead>
                <TableHead>申报上限</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>
                        {batch.startDate} 至 {batch.endDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {batch.directions.map((dir: string) => (
                        <Badge key={dir} variant="secondary">
                          {dir}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{batch.qualification}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={batch.status === "active" ? "text-primary font-medium" : "text-muted-foreground"}>
                      {batch.limit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={batch.status === "active" ? "default" : "outline"}
                      className={batch.status === "active" ? "gap-1" : ""}
                    >
                      {batch.status === "active" && <Power className="h-3 w-3" />}
                      {batch.status === "active" ? "进行中" : "已结束"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Copy className="h-4 w-4" />
                      </Button>
                      {batch.status === "finished" && (
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
