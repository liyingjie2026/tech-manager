"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, CheckCircle2, XCircle, Clock } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { achievementApi } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function AchievementReviewPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await achievementApi.getList({
          current: currentPage,
          size: pageSize,
          type: typeFilter || undefined,
          status: statusFilter || undefined,
        })

        if (response.code === 200 && response.data) {
          setAchievements(response.data.records || [])
          setTotal(response.data.total || 0)

          const pending = response.data.records?.filter((a: any) => a.status === "pending").length || 0
          const approved = response.data.records?.filter((a: any) => a.status === "approved").length || 0
          const rejected = response.data.records?.filter((a: any) => a.status === "rejected").length || 0
          setStats({ pending, approved, rejected })
        }
      } catch (error) {
        console.error("Failed to load achievements:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentPage, pageSize, statusFilter, typeFilter])

  const handleApprove = async (id: number) => {
    try {
      await achievementApi.review(id, true)
      setCurrentPage(1)
    } catch (error) {
      console.error("Failed to approve achievement:", error)
    }
  }

  const handleReject = async (id: number) => {
    try {
      await achievementApi.review(id, false)
      setCurrentPage(1)
    } catch (error) {
      console.error("Failed to reject achievement:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">成果审核</h1>
        <p className="text-sm text-muted-foreground mt-1">审核科研机构提交的项目成果信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索项目名称或成果名称" className={`pl-9 ${UI_CONSTANTS.INPUT_HEIGHT}`} />
            </div>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="审核状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                <SelectValue placeholder="成果类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paper">论文</SelectItem>
                <SelectItem value="patent">专利</SelectItem>
                <SelectItem value="software">软件著作权</SelectItem>
                <SelectItem value="standard">标准规范</SelectItem>
                <SelectItem value="report">研究报告</SelectItem>
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
          <CardTitle className="text-base">成果列表</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">待审核: {stats.pending}</Badge>
            <Badge variant="default">已通过: {stats.approved}</Badge>
            <Badge variant="destructive">已驳回: {stats.rejected}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>项目编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>成果名称</TableHead>
                <TableHead>成果类型</TableHead>
                <TableHead>申报单位</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead>审核状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : achievements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无成果数据
                  </TableCell>
                </TableRow>
              ) : (
                achievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-mono">{achievement.projectNo}</TableCell>
                    <TableCell>{achievement.projectName}</TableCell>
                    <TableCell>{achievement.achievementName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{achievement.achievementType}</Badge>
                    </TableCell>
                    <TableCell>{achievement.institutionName}</TableCell>
                    <TableCell>{achievement.submitTime}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          achievement.status === "pending"
                            ? "secondary"
                            : achievement.status === "approved"
                              ? "default"
                              : "destructive"
                        }
                        className="gap-1"
                      >
                        {achievement.status === "pending" ? (
                          <>
                            <Clock className="h-3 w-3" />
                            待审核
                          </>
                        ) : achievement.status === "approved" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            已通过
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            已驳回
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/supervisor/achievements/${achievement.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          查看
                        </Button>
                        {achievement.status === "pending" && (
                          <>
                            <Button size="sm" variant="default" onClick={() => handleApprove(achievement.id)}>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              通过
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(achievement.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              驳回
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
