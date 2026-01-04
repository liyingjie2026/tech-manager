"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye, Edit, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

const initialBasicData = [
  {
    id: "DATA001",
    name: "湖南省地质灾害点数据库",
    category: "地质数据",
    institution: "湖南省地质研究所",
    format: "SHP/GDB",
    size: "2.5GB",
    updateDate: "2025-01-10",
    borrowCount: 15,
    status: "可借阅",
  },
  {
    id: "DATA002",
    name: "国土空间规划基础数据",
    category: "规划数据",
    institution: "湖南大学",
    format: "SHP",
    size: "1.8GB",
    updateDate: "2024-12-25",
    borrowCount: 22,
    status: "可借阅",
  },
]

export default function BasicDataPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)

  const [searchTerm, setSearchTerm] = useState("")
  const [basicData, setBasicData] = useState<any[]>(initialBasicData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // const response = await resourceApi.getList({ page: currentPage, pageSize, searchTerm })
        // setBasicData(response.data.records)
        // setTotal(response.data.total)
        setTotal(initialBasicData.length)
      } catch (error) {
        console.error("Failed to load basic data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentPage, pageSize, searchTerm])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">基础数据管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理和共享科研基础数据资源</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新增数据
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">数据总数</p>
              <p className="text-3xl font-bold mt-2">{basicData.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">可借阅</p>
              <p className="text-3xl font-bold mt-2">{basicData.filter((data) => data.status === "可借阅").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">借阅中</p>
              <p className="text-3xl font-bold mt-2">{basicData.filter((data) => data.status === "借阅中").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">总容量</p>
              <p className="text-3xl font-bold mt-2">
                {basicData.reduce((total, data) => total + Number.parseFloat(data.size), 0)}GB
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索数据名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${UI_CONSTANTS.INPUT_HEIGHT}`}
              />
            </div>
            <Select>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.SELECT_HEIGHT}`}>
                <SelectValue placeholder="数据分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="geology">地质数据</SelectItem>
                <SelectItem value="planning">规划数据</SelectItem>
                <SelectItem value="environment">环境数据</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>数据列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>数据编号</TableHead>
                <TableHead>数据名称</TableHead>
                <TableHead>数据分类</TableHead>
                <TableHead>提供单位</TableHead>
                <TableHead>数据格式</TableHead>
                <TableHead>数据大小</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead>借阅次数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {basicData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                basicData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell className="font-mono">{data.id}</TableCell>
                    <TableCell className="font-medium">{data.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{data.category}</Badge>
                    </TableCell>
                    <TableCell>{data.institution}</TableCell>
                    <TableCell className="font-mono text-sm">{data.format}</TableCell>
                    <TableCell>{data.size}</TableCell>
                    <TableCell>{data.updateDate}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{data.borrowCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{data.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
