"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Plus, Edit, Calendar } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

export default function EquipmentPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // const response = await equipmentApi.getList({ page: currentPage, pageSize })
        // setEquipment(response.data.records)
        // setTotal(response.data.total)
      } catch (error) {
        console.error("Failed to load equipment:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentPage, pageSize])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">科研仪器管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理和共享科研仪器设备资源</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增仪器
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
              <Input placeholder="仪器名称/型号" className={`pl-9 ${UI_CONSTANTS.INPUT_HEIGHT}`} />
            </div>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="仪器类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="survey">测量仪器</SelectItem>
                <SelectItem value="test">测试仪器</SelectItem>
                <SelectItem value="analysis">分析仪器</SelectItem>
                <SelectItem value="observation">观测仪器</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="使用状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">可用</SelectItem>
                <SelectItem value="in-use">使用中</SelectItem>
                <SelectItem value="maintenance">维护中</SelectItem>
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
          <CardTitle className="text-base">仪器列表</CardTitle>
          <div className="flex gap-2">
            <Badge variant="default">总数: 128</Badge>
            <Badge variant="secondary">可用: 95</Badge>
            <Badge variant="outline">使用中: 28</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>仪器编号</TableHead>
                <TableHead>仪器名称</TableHead>
                <TableHead>型号</TableHead>
                <TableHead>仪器类别</TableHead>
                <TableHead>所属单位</TableHead>
                <TableHead>借用次数</TableHead>
                <TableHead>使用状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono">EQ2025001</TableCell>
                <TableCell className="font-medium">全站仪</TableCell>
                <TableCell>Leica TS16</TableCell>
                <TableCell>测量仪器</TableCell>
                <TableCell>湖南大学</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">45次</span>
                </TableCell>
                <TableCell>
                  <Badge variant="default">可用</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      预约记录
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">EQ2025002</TableCell>
                <TableCell className="font-medium">三维激光扫描仪</TableCell>
                <TableCell>FARO Focus3D</TableCell>
                <TableCell>测量仪器</TableCell>
                <TableCell>中南大学</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">32次</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">使用中</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      预约记录
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">EQ2025003</TableCell>
                <TableCell className="font-medium">无人机航测系统</TableCell>
                <TableCell>DJI Phantom 4 RTK</TableCell>
                <TableCell>观测仪器</TableCell>
                <TableCell>湖南师范大学</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">58次</span>
                </TableCell>
                <TableCell>
                  <Badge variant="default">可用</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      预约记录
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
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
