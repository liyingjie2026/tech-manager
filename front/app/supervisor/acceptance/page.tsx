"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Users, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { acceptanceApi } from "@/lib/api/acceptance"
import { getStatusText, getStatusColor } from "@/lib/utils/status-maps"

export default function AcceptancePage() {
  const { toast } = useToast()
  const [acceptances, setAcceptances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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
      })
      if (response.data) {
        const list = response.data.records || response.data.list || []
        setAcceptances(list)
        setTotal(response.data.total || list.length)
      }
    } catch (error) {
      console.error("Failed to load acceptances:", error)
      toast({
        title: "加载失败",
        description: "无法加载验收列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredAcceptances = acceptances.filter((acceptance) => {
    const matchesSearch =
      acceptance.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acceptance.id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || acceptance.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">结题验收</h1>
          <p className="text-sm text-muted-foreground mt-1">管理项目结题验收和成果鉴定</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">待组织</p>
              <p className="text-3xl font-bold mt-2">
                {acceptances.filter((a) => a.status === "pending" || a.status === "待组织").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">评审中</p>
              <p className="text-3xl font-bold mt-2">
                {acceptances.filter((a) => a.status === "in_progress" || a.status === "评审中").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">已验收</p>
              <p className="text-3xl font-bold mt-2">
                {acceptances.filter((a) => a.status === "completed" || a.status === "已验收").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">优秀项目</p>
              <p className="text-3xl font-bold mt-2">{acceptances.filter((a) => (a.avgScore || 0) >= 90).length}</p>
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="验收状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待组织</SelectItem>
                <SelectItem value="reviewing">评审中</SelectItem>
                <SelectItem value="completed">已验收</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Acceptances Table */}
      <Card>
        <CardHeader>
          <CardTitle>验收列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : filteredAcceptances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无验收数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>验收编号</TableHead>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>承担单位</TableHead>
                  <TableHead>项目负责人</TableHead>
                  <TableHead>立项时间</TableHead>
                  <TableHead>验收时间</TableHead>
                  <TableHead>项目总预算(万元)</TableHead>
                  <TableHead>实际使用经费(万元)</TableHead>
                 
                  <TableHead>验收状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAcceptances.map((acceptance) => (
                  <TableRow key={acceptance.id}>
                    <TableCell className="font-mono">{acceptance.id}</TableCell>
                    <TableCell className="font-mono">{acceptance.projectNo}</TableCell>
                    <TableCell className="font-medium">{acceptance.projectName}</TableCell>
                    <TableCell>{acceptance.institutionName}</TableCell>
                    <TableCell>{acceptance.projectLeader}</TableCell>
                    <TableCell>{acceptance.createTime}</TableCell>
                    <TableCell>{acceptance.acceptanceTime}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{acceptance.totalBudget || 0}</Badge>
                    </TableCell>
                    <TableCell>
                         <Badge variant="outline">{acceptance.usedBudget || 0}</Badge>
                      {/* <Badge variant={acceptance.reviewedCount === acceptance.expertCount ? "default" : "secondary"}>
                        {acceptance.reviewedCount || 0}
                      </Badge> */}
                    </TableCell>
        
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(acceptance.status)}>
                        {getStatusText(acceptance.status, "acceptance")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {acceptance.status === "待组织" && (
                          <Button variant="ghost" size="sm">
                            <Users className="h-4 w-4" />
                          </Button>
                        )}
                        {acceptance.status === "评审中" && (
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
