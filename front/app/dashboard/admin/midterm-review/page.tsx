"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Eye, CheckCircle2, XCircle, FileText, Clock, CheckSquare, DollarSign } from "lucide-react"
import { midtermApi } from "@/lib/api/midterm"
import { toast } from "@/hooks/use-toast"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { Pagination } from "@/components/ui/pagination"

export default function MidtermReviewPage() {
  const [checkList, setCheckList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCheck, setSelectedCheck] = useState<any>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewOpinion, setReviewOpinion] = useState("")
  const [reviewResult, setReviewResult] = useState<"pass" | "reject">("pass")

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filter checks
  const filteredChecks = checkList.filter((check) => {
    const matchesSearch =
      check.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.projectCode?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || check.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const loadMidtermChecks = async () => {
    setLoading(true)
    try {
      const response = await midtermApi.getList({
        page: currentPage,
        pageSize,
        keyword: searchTerm,
        status: statusFilter === "all" ? undefined : statusFilter,
      })
      setCheckList(response.records || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error("Failed to load midterm checks:", error)
      toast({
        title: "加载失败",
        description: "无法加载中期检查列表，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMidtermChecks()
  }, [currentPage, pageSize, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadMidtermChecks()
      } else {
        setCurrentPage(1)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleOpenReview = (check: any) => {
    setSelectedCheck(check)
    setReviewDialogOpen(true)
    setReviewOpinion("")
    setReviewResult("pass")
  }

  const handleSubmitReview = async () => {
    if (!reviewOpinion.trim()) {
      toast({
        title: "请输入审核意见",
        variant: "destructive",
      })
      return
    }

    try {
      await midtermApi.review(selectedCheck.id, {
        result: reviewResult,
        opinion: reviewOpinion,
      })

      setReviewDialogOpen(false)
      loadMidtermChecks()

      toast({
        title: reviewResult === "pass" ? "审核通过" : "审核驳回",
        description: `中期检查已${reviewResult === "pass" ? "提交至监管端" : "驳回"}`,
      })
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast({
        title: "提交失败",
        description: "审核提交失败，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending: { label: "待提交", variant: "outline" },
      pending_institution: { label: "待机构审核", variant: "default" },
      pending_supervisor: { label: "待监管审核", variant: "secondary" },
      approved: { label: "已审核通过", variant: "outline" },
      rejected: { label: "审核未通过", variant: "destructive" },
    }
    const config = statusConfig[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">中期检查审核</h1>
          <p className="text-muted-foreground mt-2">审核项目负责人提交的中期检查材料</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>中期检查列表</CardTitle>
          <CardDescription>查看和审核项目中期检查</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索项目名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${UI_CONSTANTS.INPUT_HEIGHT}`}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`w-[180px] ${UI_CONSTANTS.INPUT_HEIGHT}`}>
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending_institution">待机构审核</SelectItem>
                <SelectItem value="pending_supervisor">待监管审核</SelectItem>
                <SelectItem value="approved">已审核通过</SelectItem>
                <SelectItem value="rejected">审核未通过</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>检查年度</TableHead>
                  <TableHead>预算执行率</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : checkList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      暂无中期检查记录
                    </TableCell>
                  </TableRow>
                ) : (
                  checkList.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium">{check.projectCode}</TableCell>
                      <TableCell className="max-w-xs truncate">{check.projectName}</TableCell>
                      <TableCell>{check.checkYear}年</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={check.budgetUsageRate || 0} className="w-16 h-2" />
                          <span className="text-sm text-muted-foreground">{check.budgetUsageRate || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{check.submittedAt || "-"}</TableCell>
                      <TableCell>{getStatusBadge(check.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedCheck(check)}>
                                <Eye className="h-4 w-4 mr-1" />
                                查看
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>中期检查详情</DialogTitle>
                                <DialogDescription>
                                  {selectedCheck?.projectCode} - {selectedCheck?.projectName}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedCheck && (
                                <Tabs defaultValue="content" className="w-full">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="content">检查内容</TabsTrigger>
                                    <TabsTrigger value="history">审核历史</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="content" className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground">项目编号</Label>
                                        <p className="mt-1 font-medium">{selectedCheck.projectCode}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">检查年度</Label>
                                        <p className="mt-1 font-medium">{selectedCheck.checkYear}年</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">预算执行率</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                          <Progress value={selectedCheck.budgetUsageRate || 0} className="flex-1 h-2" />
                                          <span className="font-medium">{selectedCheck.budgetUsageRate || 0}%</span>
                                        </div>
                                      </div>
                                    </div>
                                    {selectedCheck.status !== "pending" && (
                                      <>
                                        <div>
                                          <Label className="text-muted-foreground">进展概述</Label>
                                          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedCheck.progressSummary || "暂无"}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">已完成工作</Label>
                                          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedCheck.completedWork || "暂无"}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">已取得成果</Label>
                                          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedCheck.achievedResults || "暂无"}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">存在问题</Label>
                                          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedCheck.problems || "暂无"}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">下一步计划</Label>
                                          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedCheck.nextPlan || "暂无"}
                                          </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-muted-foreground">已使用经费</Label>
                                            <div className="mt-1 flex items-center gap-2">
                                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                                              <span className="font-medium">
                                                {((selectedCheck.budgetUsed || 0) / 10000).toFixed(2)}万元
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </TabsContent>
                                  <TabsContent value="history" className="space-y-4">
                                    <div className="space-y-4">
                                      {selectedCheck.submittedAt && (
                                        <div className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                              <FileText className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="w-0.5 h-full bg-border mt-2" />
                                          </div>
                                          <div className="flex-1 pb-4">
                                            <div className="flex items-center justify-between mb-1">
                                              <h4 className="font-medium">提交检查</h4>
                                              <span className="text-sm text-muted-foreground">
                                                {selectedCheck.submittedAt}
                                              </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                              {selectedCheck.submittedBy} 提交了中期检查材料
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {selectedCheck.institutionReviewTime && (
                                        <div className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                            <div
                                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                selectedCheck.institutionReviewResult === "pass"
                                                  ? "bg-green-100"
                                                  : "bg-red-100"
                                              }`}
                                            >
                                              <CheckSquare
                                                className={`h-4 w-4 ${
                                                  selectedCheck.institutionReviewResult === "pass"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                              />
                                            </div>
                                            {selectedCheck.supervisorReviewTime && (
                                              <div className="w-0.5 h-full bg-border mt-2" />
                                            )}
                                          </div>
                                          <div className="flex-1 pb-4">
                                            <div className="flex items-center justify-between mb-1">
                                              <h4 className="font-medium">机构审核</h4>
                                              <span className="text-sm text-muted-foreground">
                                                {selectedCheck.institutionReviewTime}
                                              </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                              {selectedCheck.institutionReviewerName}
                                            </p>
                                            <div className="p-3 bg-muted rounded-md">
                                              <p className="text-sm">{selectedCheck.institutionReviewOpinion}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {selectedCheck.supervisorReviewTime && (
                                        <div className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                            <div
                                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                selectedCheck.supervisorReviewResult === "pass"
                                                  ? "bg-green-100"
                                                  : "bg-red-100"
                                              }`}
                                            >
                                              <CheckCircle2
                                                className={`h-4 w-4 ${
                                                  selectedCheck.supervisorReviewResult === "pass"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                              />
                                            </div>
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                              <h4 className="font-medium">监管审核</h4>
                                              <span className="text-sm text-muted-foreground">
                                                {selectedCheck.supervisorReviewTime}
                                              </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                              {selectedCheck.supervisorReviewerName}
                                            </p>
                                            <div className="p-3 bg-muted rounded-md">
                                              <p className="text-sm">{selectedCheck.supervisorReviewOpinion}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {!selectedCheck.institutionReviewTime && selectedCheck.status !== "pending" && (
                                        <div className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                              <Clock className="h-4 w-4 text-yellow-600" />
                                            </div>
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium">等待机构审核</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                              中期检查正在等待机构管理员审核
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              )}
                            </DialogContent>
                          </Dialog>
                          {check.status === "pending_institution" && (
                            <Button size="sm" onClick={() => handleOpenReview(check)}>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              审核
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && total > 0 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(total / pageSize)}
                pageSize={pageSize}
                total={total}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize)
                  setCurrentPage(1)
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>中期检查审核</DialogTitle>
            <DialogDescription>请对中期检查进行审核并填写审核意见</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground">项目编号</Label>
              <p className="mt-1 font-medium">{selectedCheck?.projectCode}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目名称</Label>
              <p className="mt-1 font-medium">{selectedCheck?.projectName}</p>
            </div>
            <div>
              <Label htmlFor="review-result">
                审核结果 <span className="text-destructive">*</span>
              </Label>
              <Select value={reviewResult} onValueChange={(value: any) => setReviewResult(value)}>
                <SelectTrigger id="review-result" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pass">审核通过，上报监管端</SelectItem>
                  <SelectItem value="reject">审核不通过，退回修改</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="review-opinion">
                审核意见 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="review-opinion"
                placeholder="请输入审核意见..."
                value={reviewOpinion}
                onChange={(e) => setReviewOpinion(e.target.value)}
                rows={5}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitReview}>
              {reviewResult === "pass" ? (
                <CheckCircle2 className="h-4 w-4 mr-1" />
              ) : (
                <XCircle className="h-4 w-4 mr-1" />
              )}
              提交审核
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
