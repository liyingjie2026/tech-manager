"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Search, RotateCcw } from "lucide-react"
import { projectApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  getStatusText,
  getStatusColor,
  getProjectTypeText,
  getProjectCategoryText,
  getResearchFieldText,
} from "@/lib/utils/status-maps"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { authStorage } from "@/lib/auth-storage"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { DataPagination } from "@/components/ui/data-pagination"
import { formatDate } from "@/lib/utils/date-format"
import { formatMoney } from "@/lib/utils/money-format"

type UserRole = "project-leader" | "institution-admin"

const projectTypeMap: Record<string, string> = {
  basic_research: "基础研究",
  applied_research: "应用研究",
  experimental_development: "试验发展",
  technology_development: "技术开发",
  soft_science: "软科学研究",
  other: "其他",
}

const getProjectTypeTextFallback = (type: string): string => {
  return projectTypeMap[type] || type || "-"
}

interface Project {
  id: number
  projectNo: string
  name: string
  projectType: string
  projectCategory: string
  researchField: string
  demandId: number
  institutionId: number
  institutionName: string
  leaderId: number
  leaderName: string
  leaderPhone: string
  startDate: string
  endDate: string
  totalBudget: number
  applyFunding: number // Changed from applyBudget
  selfFunding: number // Changed from selfBudget
  researchObjective: string // Changed from objective
  researchContent: string // Changed from content
  expectedResults: string // Changed from expectedResult
  status: string
  auditStatus: string
  workflowStage: string
  auditComment: string
  auditTime: string
  auditBy: number
  submitTime: string
  duplicateRate: number
  createTime: string
  updateTime: string
}

export default function MyProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [searchCode, setSearchCode] = useState("")
  const [searchStatus, setSearchStatus] = useState("")
  const [searchLeader, setSearchLeader] = useState("")
  const [searchYear, setSearchYear] = useState("")
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null)

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectingProjectId, setRejectingProjectId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const [isInstitutionAdmin, setIsInstitutionAdmin] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGE_SIZE_DEFAULT)
  const [total, setTotal] = useState(0)

  const getCurrentRole = (): UserRole => {
    if (typeof window === "undefined") return "project-leader"
    const user = authStorage.getUser()
    if (user && user.institutionRole) {
      return user.institutionRole === "institution_admin" ? "institution-admin" : "project-leader"
    }
    const role = authStorage.getInstitutionRole()
    if (role === "institution_admin") return "institution-admin"
    return "project-leader"
  }

  useEffect(() => {
    const user = authStorage.getUser()
    const role = user?.institutionRole || authStorage.getInstitutionRole()
    setIsInstitutionAdmin(role === "institution_admin" || role === "institution-admin")
    loadProjects()
  }, [searchStatus])

  useEffect(() => {
    loadProjects()
  }, [searchStatus, currentPage, pageSize])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const params: any = {
        current: currentPage,
        size: pageSize,
      }
      if (searchName) params.keyword = searchName
      if (searchCode) params.projectNo = searchCode
      if (searchStatus) params.status = searchStatus
      if (searchLeader) params.leaderName = searchLeader
      if (searchYear) params.year = searchYear

      const response = await projectApi.list(params)

      const projectData = response.data?.records || response.records || response.data || []
      const totalCount = response.data?.total || response.total || projectData.length

      setProjects(projectData)
      setTotal(totalCount)
    } catch (error) {
      console.error("[v0] Error loading projects:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadProjects()
  }

  const handleReset = () => {
    setSearchName("")
    setSearchCode("")
    setSearchStatus("")
    setSearchLeader("")
    setSearchYear("")
    loadProjects()
  }

  const getActionButtons = (project: any) => {
    const status = project.status || project.auditStatus

    if (status === "submitted") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/my-projects/${project.id}`)}>
            查看
          </Button>
          <Button variant="link" size="sm" className="text-destructive" onClick={() => handleWithdraw(project)}>
            撤回
          </Button>
        </div>
      )
    }

    if (status === "under_review" || status === "preliminary_review_pending") {
      return (
        <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/my-projects/${project.id}`)}>
          查看
        </Button>
      )
    }

    if (status === "approved" || status === "preliminary_review_passed") {
      return (
        <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/my-projects/${project.id}`)}>
          查看
        </Button>
      )
    }

    if (status === "in_progress") {
      return (
        <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/my-projects/${project.id}`)}>
          查看
        </Button>
      )
    }

    return (
      <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/my-projects/${project.id}`)}>
        查看
      </Button>
    )
  }

  const handleWithdraw = async (project: any) => {
    try {
      await projectApi.withdraw(project.id)
      toast({
        title: "撤回成功",
        description: `项目 ${project.name} 已撤回`,
      })
      loadProjects()
    } catch (error) {
      toast({
        title: "撤回失败",
        description: "项目撤回失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleApprove = async (projectId: number) => {
    try {
      const response = await projectApi.approve(projectId)
      if (response.success || response.data) {
        toast({
          title: "审核成功",
          description: "项目已审核通过",
        })
        loadProjects()
      } else {
        throw new Error(response.message || "审核失败")
      }
    } catch (error: any) {
      toast({
        title: "审核失败",
        description: error.message || "无法审核项目，请重试",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    if (!rejectingProjectId || !rejectReason.trim()) {
      toast({
        title: "驳回失败",
        description: "请填写驳回原因",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await projectApi.reject(rejectingProjectId, rejectReason)
      if (response.success || response.data) {
        toast({
          title: "驳回成功",
          description: "项目已驳回",
        })
        setRejectDialogOpen(false)
        setRejectingProjectId(null)
        setRejectReason("")
        loadProjects()
      } else {
        throw new Error(response.message || "驳回失败")
      }
    } catch (error: any) {
      toast({
        title: "驳回失败",
        description: error.message || "无法驳回项目，请重试",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = async () => {
    if (!deletingProjectId) return

    try {
      await projectApi.delete(deletingProjectId)
      toast({
        title: "删除成功",
        description: "项目已删除",
      })
      setDeleteDialogOpen(false)
      setDeletingProjectId(null)
      loadProjects()
    } catch (error) {
      toast({
        title: "删除失败",
        description: "无法删除项目，请重试",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">首页</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>项目一览</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>

      <Card>
        <CardHeader>
          <CardTitle>项目查询</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">项目名称:</span>
              <Input
                className={UI_CONSTANTS.INPUT_HEIGHT}
                placeholder="请输入内容"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">项目编号:</span>
              <Input
                className={UI_CONSTANTS.INPUT_HEIGHT}
                placeholder="请输入内容"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">项目状态:</span>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentRole() === "project-leader" ? (
                    <>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="approval_pending">立项申请</SelectItem>
                      <SelectItem value="approved">已立项</SelectItem>
                      <SelectItem value="in_progress">进行中</SelectItem>
                      <SelectItem value="rejected">已驳回</SelectItem>
                      <SelectItem value="completed">已验收</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="approval_pending">立项申请</SelectItem>
                      <SelectItem value="submitted">已提交</SelectItem>
                      <SelectItem value="approved">已立项</SelectItem>
                      <SelectItem value="in_progress">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="rejected">已驳回</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            {(getCurrentRole() === "institution-admin" || isInstitutionAdmin) && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap w-20">项目负责人:</span>
                  <Input
                    className={UI_CONSTANTS.INPUT_HEIGHT}
                    placeholder="请输入负责人姓名"
                    value={searchLeader}
                    onChange={(e) => setSearchLeader(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap w-20">年度:</span>
                  <Select value={searchYear} onValueChange={setSearchYear}>
                    <SelectTrigger className={UI_CONSTANTS.SELECT_HEIGHT}>
                      <SelectValue placeholder="请选择年度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025年</SelectItem>
                      <SelectItem value="2024">2024年</SelectItem>
                      <SelectItem value="2023">2023年</SelectItem>
                      <SelectItem value="2022">2022年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <div className={`flex justify-end ${UI_CONSTANTS.BUTTON_GAP} mt-4`}>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
            <Button className="gap-2" onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
              {loading ? "查询中..." : "查询"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>项目列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目状态</TableHead>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>项目类型</TableHead>
                  <TableHead>项目类别</TableHead>
                  <TableHead>研究领域</TableHead>
                  <TableHead>所属机构</TableHead>
                  <TableHead>项目负责人</TableHead>
                  <TableHead>开始时间</TableHead>
                  <TableHead>结束时间</TableHead>
                  <TableHead>总预算(万元)</TableHead>
                  <TableHead className="text-center">查重率</TableHead>
                  <TableHead>审核状态</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(project.status)}>
                          {getStatusText(project.status, "project")}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.projectNo || "-"}</TableCell>
                      <TableCell className="font-medium min-w-[200px]">{project.name || "-"}</TableCell>
                      <TableCell>{getProjectTypeText(project.projectType)}</TableCell>
                      <TableCell>{getProjectCategoryText(project.projectCategory)}</TableCell>
                      <TableCell>{getResearchFieldText(project.researchField)}</TableCell>
                      <TableCell>{project.institutionName || "-"}</TableCell>
                      <TableCell>{project.leaderName || "-"}</TableCell>
                      <TableCell>{formatDate(project.startDate)}</TableCell>
                      <TableCell>{formatDate(project.endDate)}</TableCell>
                      <TableCell>{formatMoney(project.totalBudget)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <div className="border border-blue-500 rounded px-3 py-1 min-w-[70px] text-center">
                            <span className="text-blue-600 font-medium">
                              {project.duplicateRate != null ? project.duplicateRate.toFixed(2) : "0.00"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(project.auditStatus || project.status)}>
                          {getStatusText(project.auditStatus || project.status, "project")}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(project.submitTime)}</TableCell>
                      <TableCell>{getActionButtons(project)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="border-t pt-4">
              <DataPagination
                currentPage={currentPage}
                totalPages={Math.ceil(total / pageSize)}
                pageSize={pageSize}
                total={total}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(1)
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>确定要删除该项目吗？此操作不可恢复。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>驳回项目</DialogTitle>
            <DialogDescription>请填写驳回原因</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="请输入驳回原因..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              确认驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
