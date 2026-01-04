"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Search, Eye, Calendar } from "lucide-react"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { expertReviewApi } from "@/lib/api/expert-review"
import { useToast } from "@/hooks/use-toast"

export default function ExpertHistoryPage() {
  const [projectName, setProjectName] = useState("")
  const [projectId, setProjectId] = useState("")
  const [reviewDate, setReviewDate] = useState("")
  const [projectType, setProjectType] = useState("")
  const [selectedReview, setSelectedReview] = useState<any | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [stats, setStats] = useState({
    totalReviews: 0,
    monthlyReviews: 0,
    averageScore: 0,
    passRate: 0,
  })

  useEffect(() => {
    loadHistory()
  }, [currentPage, pageSize])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await expertReviewApi.getList({
        page: currentPage,
        pageSize: pageSize,
        status: "completed",
        projectName: projectName || undefined,
        projectId: projectId || undefined,
        reviewDate: reviewDate || undefined,
        projectType: projectType !== "all" ? projectType : undefined,
      })

      if (response.data) {
        setHistory(response.data.records || [])
        setTotal(response.data.total || 0)

        const records = response.data.records || []
        const totalReviews = response.data.total || 0
        const monthlyReviews = records.filter((r: any) => {
          const reviewMonth = new Date(r.reviewDate).getMonth()
          return reviewMonth === new Date().getMonth()
        }).length
        const averageScore =
          records.reduce((sum: number, r: any) => sum + (r.totalScore || 0), 0) / Math.max(records.length, 1)
        const passRate = (records.filter((r: any) => r.result === "通过").length / Math.max(records.length, 1)) * 100

        setStats({
          totalReviews,
          monthlyReviews,
          averageScore,
          passRate,
        })
      }
    } catch (error) {
      console.error("Failed to load history:", error)
      toast({
        title: "加载失败",
        description: "无法加载评审历史",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadHistory()
  }

  const handleReset = () => {
    setProjectName("")
    setProjectId("")
    setReviewDate("")
    setProjectType("")
    setCurrentPage(1)
  }

  const handleViewScores = (review: any) => {
    setSelectedReview(review)
    setShowDetailDialog(true)
  }

  const totalPages = Math.ceil(total / pageSize)

  const renderPagination = () => {
    const pages = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    if (totalPages <= 1) return null

    pages.push(
      <PaginationItem key={1}>
        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    if (showEllipsisStart) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    if (showEllipsisEnd) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return pages
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">评审历史</h1>
        <p className="text-sm text-muted-foreground mt-1">查看您过往的项目评审记录</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <div className="text-sm text-muted-foreground">累计评审</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">本月评审</div>
          <div className="text-2xl font-bold">{stats.monthlyReviews}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">平均评分</div>
          <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">通过率</div>
          <div className="text-2xl font-bold">{stats.passRate.toFixed(0)}%</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="relative">
            <Input
              placeholder="请输入项目名称"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={UI_CONSTANTS.INPUT_HEIGHT}
            />
          </div>
          <div className="relative">
            <Input
              placeholder="请输入项目编号"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className={UI_CONSTANTS.INPUT_HEIGHT}
            />
          </div>
          <div className="relative">
            <Input
              type="date"
              placeholder="评审时间"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className={UI_CONSTANTS.INPUT_HEIGHT}
            />
          </div>
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
              <SelectValue placeholder="项目类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="major">重大项目</SelectItem>
              <SelectItem value="application">应用技术类</SelectItem>
              <SelectItem value="general">一般项目</SelectItem>
              <SelectItem value="youth">青年项目</SelectItem>
              <SelectItem value="basic">基础研究类</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            查询
          </Button>
          <Button variant="outline" onClick={handleReset}>
            重置
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>项目编号</TableHead>
              <TableHead>项目名称</TableHead>
              <TableHead>项目类型</TableHead>
              <TableHead>评审类型</TableHead>
              <TableHead>总分</TableHead>
              <TableHead>评审日期</TableHead>
              <TableHead>评审结果</TableHead>
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
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.projectId}</TableCell>
                  <TableCell className="font-medium">{item.projectName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{item.reviewType}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">{item.totalScore}</span>
                    <span className="text-muted-foreground text-sm">/100</span>
                  </TableCell>
                  <TableCell>{item.reviewDate}</TableCell>
                  <TableCell>
                    <Badge variant="default">{item.result}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewScores(item)}>
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4 pt-4 border-t px-4 pb-4">
          <div className="text-sm text-muted-foreground">共 {total} 条</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <select
                className={`border rounded px-2 ${UI_CONSTANTS.PAGINATION.SELECT_HEIGHT} text-sm`}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}条/页
                  </option>
                ))}
              </select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {renderPagination()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Card>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>评审打分详情</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">项目名称</div>
                  <div className="font-medium">{selectedReview.projectName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">项目编号</div>
                  <div className="font-medium">{selectedReview.projectId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">评审日期</div>
                  <div className="font-medium">{selectedReview.reviewDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">总分</div>
                  <div className="text-2xl font-bold text-primary">{selectedReview.totalScore}</div>
                </div>
              </div>

              {selectedReview.scores && (
                <div className="space-y-4">
                  {Object.entries(selectedReview.scores).map(([category, items]: [string, any]) => (
                    <Card key={category} className="p-4">
                      <h4 className="font-semibold mb-3">{category}</h4>
                      <div className="space-y-2">
                        {Object.entries(items).map(([item, score]: [string, any]) => (
                          <div key={item} className="flex items-center justify-between">
                            <span className="text-sm">{item}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(score / 20) * 100}%` }} />
                              </div>
                              <span className="font-semibold text-primary w-8 text-right">{score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
