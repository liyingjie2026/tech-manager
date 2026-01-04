"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Send, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { annualApi } from "@/lib/api/annual"
import { getStatusText, getStatusColor } from "@/lib/utils/status-maps"

export default function AnnualCheckPage() {
  const { toast } = useToast()
  const [annualChecks, setAnnualChecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadAnnualChecks()
  }, [currentPage, pageSize])

  const loadAnnualChecks = async () => {
    try {
      setLoading(true)
      const response = await annualApi.getList({
        current: currentPage,
        size: pageSize,
      })
      if (response.data) {
        const list = response.data.records || response.data.list || []
        setAnnualChecks(list)
        setTotal(response.data.total || list.length)
      }
    } catch (error) {
      console.error("Failed to load annual checks:", error)
      toast({
        title: "加载失败",
        description: "无法加载年度检查列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredChecks = annualChecks.filter((check) => {
    if (selectedYear !== "all" && check.year !== selectedYear) return false
    if (selectedStatus !== "all" && check.status !== selectedStatus) return false
    if (
      searchTerm &&
      !check.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !check.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">年度检查</h1>
          <p className="text-sm text-muted-foreground mt-1">管理项目年度检查和绩效评估</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          发起年度检查
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">待检查</p>
              <p className="text-3xl font-bold mt-2">
                {annualChecks.filter((check) => check.status === "pending" || check.status === "待检查").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">检查中</p>
              <p className="text-3xl font-bold mt-2">
                {annualChecks.filter((check) => check.status === "in_progress" || check.status === "检查中").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">已完成</p>
              <p className="text-3xl font-bold mt-2">
                {annualChecks.filter((check) => check.status === "completed" || check.status === "已完成").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">优秀项目</p>
              <p className="text-3xl font-bold mt-2">
                {annualChecks.filter((check) => check.rating === "excellent" || check.rating === "优秀").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索项目名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="检查年度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部年度</SelectItem>
                <SelectItem value="2025">2025年</SelectItem>
                <SelectItem value="2024">2024年</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="检查状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待检查</SelectItem>
                <SelectItem value="checking">检查中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checks Table */}
      <Card>
        <CardHeader>
          <CardTitle>年度检查列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : filteredChecks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无年度检查数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>检查编号</TableHead>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>承担单位</TableHead>
                  <TableHead>检查年度</TableHead>
                  <TableHead>年度预算</TableHead>
                  <TableHead>实际支出</TableHead>
                  <TableHead>产出数量</TableHead>
                  <TableHead>检查状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-mono">{check.id}</TableCell>
                    <TableCell className="font-mono">{check.projectNo}</TableCell>
                    <TableCell className="font-medium">{check.projectName}</TableCell>
                    <TableCell>{check.institutionName}</TableCell>
                    <TableCell>{check.year}年</TableCell>
                    <TableCell className="text-right">{check.budget}万元</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{check.spent}万元</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{check.outputCount || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(check.status)}>
                        {getStatusText(check.status, "annual")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {check.status === "检查中" && (
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
