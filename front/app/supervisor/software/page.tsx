"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Plus, Edit, Download, Share2 } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

export default function SoftwarePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [software, setSoftware] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await softwareApi.getList({ page: currentPage, pageSize })
        // setSoftware(response.data.records)
        // setTotal(response.data.total)
      } catch (error) {
        console.error("Failed to load software:", error)
      }
    }
    fetchData()
  }, [currentPage, pageSize])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">专业软件管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理和发布可共享的专业软件资源</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增软件
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="软件名称/关键词" className={`pl-9 ${UI_CONSTANTS.INPUT_HEIGHT}`} />
            </div>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="软件类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analysis">数据分析</SelectItem>
                <SelectItem value="modeling">建模仿真</SelectItem>
                <SelectItem value="processing">数据处理</SelectItem>
                <SelectItem value="visualization">可视化</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="共享状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">可共享</SelectItem>
                <SelectItem value="unavailable">不可共享</SelectItem>
              </SelectContent>
            </Select>
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
          <CardTitle className="text-base">软件列表</CardTitle>
          <div className="flex gap-2">
            <Badge variant="default">总数: {total}</Badge>
            <Badge variant="secondary">可共享: {software.filter((s) => s.sharedStatus === "available").length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>软件名称</TableHead>
                <TableHead>版本号</TableHead>
                <TableHead>软件类型</TableHead>
                <TableHead>所属单位</TableHead>
                <TableHead>借用次数</TableHead>
                <TableHead>共享状态</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {software.map((s, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.version}</Badge>
                  </TableCell>
                  <TableCell>{s.type}</TableCell>
                  <TableCell>{s.unit}</TableCell>
                  <TableCell>
                    <span className="text-primary font-medium">{s.borrowCount}次</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.sharedStatus === "available" ? "default" : "secondary"}>{s.sharedStatus}</Badge>
                  </TableCell>
                  <TableCell>{s.updateDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        {s.sharedStatus === "available" ? (
                          <Download className="h-4 w-4" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
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
              <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
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
                  <span className="text-sm">第 {currentPage} 页</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage((p) => p + 1)} className="cursor-pointer" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
