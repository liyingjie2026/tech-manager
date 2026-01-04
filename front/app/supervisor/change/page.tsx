"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { changeApi } from "@/lib/api/change"
import { getStatusText, getStatusColor,changeTypeMap } from "@/lib/utils/status-maps"

export default function ChangeManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [changes, setChanges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [statistics, setStatistics] = useState({
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadChanges()
    loadStatistics()
  }, [currentPage, pageSize])

  const loadChanges = async () => {
    try {
      setLoading(true)
      const response = await changeApi.getList({
        page: currentPage,
        pageSize,
        changeType: filterType !== "all" ? filterType : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      })

      if (response.data) {
        setChanges(response.data.records || [])
        setTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error("[v0] Failed to load changes:", error)
      toast({
        title: "加载失败",
        description: "无法加载变更申请列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const response = await changeApi.getStatistics()
      if (response.data) {
        setStatistics({
          pending: response.data.pending || 0,
          reviewing: 0,
          approved: response.data.approved || 0,
          rejected: response.data.rejected || 0,
        })
      }
    } catch (error) {
      console.error("[v0] Failed to load statistics:", error)
    }
  }

  const handleReview = async (id: string, approved: boolean) => {
    try {
      await changeApi.approve(id, approved ? "审核通过" : "审核拒绝")
      toast({
        title: approved ? "审核通过" : "审核拒绝",
        description: `变更申请已${approved ? "通过" : "拒绝"}`,
      })
      loadChanges()
      loadStatistics()
    } catch (error) {
      toast({
        title: "操作失败",
        description: "审核操作失败，请重试",
        variant: "destructive",
      })
    }
  }

  const filteredChanges = changes.filter((change) => {
    if (
      searchTerm &&
      !change.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !change.changeNo?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">变更管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理项目执行过程中的变更申请</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">待审核</p>
              <p className="text-3xl font-bold mt-2">{statistics.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">审核中</p>
              <p className="text-3xl font-bold mt-2">{statistics.reviewing}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">已通过</p>
              <p className="text-3xl font-bold mt-2">{statistics.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">已拒绝</p>
              <p className="text-3xl font-bold mt-2">{statistics.rejected}</p>
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
                placeholder="搜索项目名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="变更类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="member">成员变更</SelectItem>
                <SelectItem value="time">时间调整</SelectItem>
                <SelectItem value="budget">预算调整</SelectItem>
                <SelectItem value="content">内容调整</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="审核状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="reviewing">审核中</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="rejected">已拒绝</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterType("all")
                setFilterStatus("all")
                loadChanges()
              }}
            >
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>变更申请列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>变更编号</TableHead>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>承担单位</TableHead>
                  <TableHead>变更类型</TableHead>
                  <TableHead>变更原因</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead>审核状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChanges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      暂无变更申请数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredChanges.map((change) => (
                    <TableRow key={change.id}>
                      <TableCell className="font-mono">{change.changeNo || change.id}</TableCell>
                      <TableCell className="font-mono">{change.projectNo || "-"}</TableCell>
                      <TableCell className="font-medium">{change.projectName || "-"}</TableCell>
                      <TableCell>{change.institutionName || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getStatusText(change.changeType,"prjChange") || "-"}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{change.changeReason || "-"}</TableCell>
                      <TableCell>{change.submitTime || change.createTime || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(change.status)}>
                          {getStatusText(change.status, "demand")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/supervisor/change/${change.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {change.status === "submitted" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleReview(change.id, true)}>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleReview(change.id, false)}>
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
