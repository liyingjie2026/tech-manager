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
import { Search, Eye, CheckCircle2, XCircle, FileText, Clock, CheckSquare, Calendar } from "lucide-react"
import { acceptanceApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { Pagination } from "@/components/ui/pagination"

export default function AcceptanceReviewPage() {
  const [acceptanceList, setAcceptanceList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAcceptance, setSelectedAcceptance] = useState<any>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewOpinion, setReviewOpinion] = useState("")
  const [reviewResult, setReviewResult] = useState<"pass" | "reject">("pass")

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)

  const loadAcceptances = async () => {
    setLoading(true)
    try {
      const response = await acceptanceApi.getList({
        page: currentPage,
        size: pageSize,
        keyword: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })

      if (response.data) {
        setAcceptanceList(response.data.records || [])
        setTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error("Failed to load acceptances:", error)
      toast({
        title: "加载失败",
        description: "无法加载验收列表，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAcceptances()
  }, [currentPage, pageSize, searchTerm, statusFilter])

  const handleOpenReview = (acceptance: any) => {
    setSelectedAcceptance(acceptance)
    setReviewDialogOpen(true)
    setReviewOpinion("")
  }

  const handleSubmitReview = async () => {
    if (!selectedAcceptance || !reviewOpinion.trim()) {
      toast({
        title: "请输入审核意见",
        variant: "destructive",
      })
      return
    }

    try {
      if (reviewResult === "pass") {
        await acceptanceApi.review(selectedAcceptance.id, true, reviewOpinion)
      } else {
        await acceptanceApi.review(selectedAcceptance.id, false, reviewOpinion)
      }

      toast({
        title: reviewResult === "pass" ? "审核通过" : "审核驳回",
        description: `验收申请已${reviewResult === "pass" ? "通过" : "驳回"}`,
      })

      setReviewDialogOpen(false)
      loadAcceptances()
    } catch (error) {
      toast({
        title: "操作失败",
        description: "审核失败，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending: { label: "待审核", variant: "default" },
      reviewing: { label: "审核中", variant: "secondary" },
      passed: { label: "已通过", variant: "outline" },
      failed: { label: "未通过", variant: "destructive" },
    }
    const config = statusConfig[status] || { label: status, variant: "default" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const paginatedAcceptances = acceptanceList.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">验收审核</h1>
          <p className="text-muted-foreground mt-2">审核项目负责人提交的验收申请</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>验收申请列表</CardTitle>
          <CardDescription>查看和审核项目验收申请</CardDescription>
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
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="reviewing">审核中</SelectItem>
                <SelectItem value="passed">已通过</SelectItem>
                <SelectItem value="failed">未通过</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>承担单位</TableHead>
                  <TableHead>完成时间</TableHead>
                  <TableHead>申请时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAcceptances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      暂无验收申请
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAcceptances.map((acceptance) => (
                    <TableRow key={acceptance.id}>
                      <TableCell className="font-medium">{acceptance.projectCode}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {acceptance.name || acceptance.projectName || "-"}
                      </TableCell>
                      <TableCell>{acceptance.leadInstitution}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {acceptance.completionDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{acceptance.applicationDate}</TableCell>
                      <TableCell>{getStatusBadge(acceptance.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedAcceptance(acceptance)}>
                                <Eye className="h-4 w-4 mr-1" />
                                查看
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>验收申请详情</DialogTitle>
                                <DialogDescription>
                                  {selectedAcceptance?.projectCode} -{" "}
                                  {selectedAcceptance?.name || selectedAcceptance?.projectName}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedAcceptance && (
                                <Tabs defaultValue="content" className="w-full">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="content">验收内容</TabsTrigger>
                                    <TabsTrigger value="history">审核历史</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="content" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground">项目编号</Label>
                                        <p className="mt-1 font-medium">{selectedAcceptance.projectCode}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">承担单位</Label>
                                        <p className="mt-1 font-medium">{selectedAcceptance.leadInstitution}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <Label className="text-muted-foreground">项目名称</Label>
                                        <p className="mt-1 font-medium">
                                          {selectedAcceptance.name || selectedAcceptance.projectName}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">完成时间</Label>
                                        <p className="mt-1 font-medium">{selectedAcceptance.completionDate}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">申请时间</Label>
                                        <p className="mt-1 font-medium">{selectedAcceptance.applicationDate}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">完成情况总结</Label>
                                      <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedAcceptance.completionSummary}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">主要成果</Label>
                                      <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedAcceptance.achievements}
                                      </p>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="history" className="space-y-4">
                                    <div className="space-y-4">
                                      <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <div className="w-0.5 h-full bg-border mt-2" />
                                        </div>
                                        <div className="flex-1 pb-4">
                                          <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-medium">提交验收申请</h4>
                                            <span className="text-sm text-muted-foreground">
                                              {selectedAcceptance.applicationDate}
                                            </span>
                                          </div>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedAcceptance.submittedBy} 提交了验收申请
                                          </p>
                                        </div>
                                      </div>

                                      {selectedAcceptance.institutionReviewTime && (
                                        <div className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                            <div
                                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                selectedAcceptance.institutionReviewResult === "pass"
                                                  ? "bg-green-100"
                                                  : "bg-red-100"
                                              }`}
                                            >
                                              <CheckSquare
                                                className={`h-4 w-4 ${
                                                  selectedAcceptance.institutionReviewResult === "pass"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                              />
                                            </div>
                                            {selectedAcceptance.supervisorReviewTime && (
                                              <div className="w-0.5 h-full bg-border mt-2" />
                                            )}
                                          </div>
                                          <div className="flex-1 pb-4">
                                            <div className="flex items-center justify-between mb-1">
                                              <h4 className="font-medium">机构审核</h4>
                                              <span className="text-sm text-muted-foreground">
                                                {selectedAcceptance.institutionReviewTime}
                                              </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                              {selectedAcceptance.institutionReviewerName}
                                            </p>
                                            <div className="p-3 bg-muted rounded-md">
                                              <p className="text-sm">{selectedAcceptance.institutionReviewOpinion}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {selectedAcceptance.supervisorReviewTime && (
                                        <div className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                            <div
                                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                selectedAcceptance.supervisorReviewResult === "pass"
                                                  ? "bg-green-100"
                                                  : "bg-red-100"
                                              }`}
                                            >
                                              <CheckCircle2
                                                className={`h-4 w-4 ${
                                                  selectedAcceptance.supervisorReviewResult === "pass"
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
                                                {selectedAcceptance.supervisorReviewTime}
                                              </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                              {selectedAcceptance.supervisorReviewerName}
                                            </p>
                                            <div className="p-3 bg-muted rounded-md">
                                              <p className="text-sm">{selectedAcceptance.supervisorReviewOpinion}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {!selectedAcceptance.institutionReviewTime && (
                                        <div className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                              <Clock className="h-4 w-4 text-yellow-600" />
                                            </div>
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium">等待机构审核</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                              验收申请正在等待机构管理员审核
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
                          {acceptance.status === "pending" && (
                            <Button size="sm" onClick={() => handleOpenReview(acceptance)}>
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

          {total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">共 {total} 条</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UI_CONSTANTS.PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} 条/页
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(total / pageSize)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>验收申请审核</DialogTitle>
            <DialogDescription>请对验收申请进行审核并填写审核意见</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground">项目编号</Label>
              <p className="mt-1 font-medium">{selectedAcceptance?.projectCode}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目名称</Label>
              <p className="mt-1 font-medium">{selectedAcceptance?.name || selectedAcceptance?.projectName}</p>
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
