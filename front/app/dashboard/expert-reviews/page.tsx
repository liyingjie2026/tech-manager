"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, FileText, Clock, CheckCircle2, AlertCircle, Vote, FileUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { expertReviewApi } from "@/lib/api/expert-review"
import { authStorage } from "@/lib/auth-storage"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

interface ReviewProject {
  id: number
  projectId: string
  name: string
  projectType: string
  institution: string
  deadline: string
  status: "pending" | "reviewed" | "completed"
  reviewType: string
  description?: string
  budget?: number
  leaderName?: string
  leaderPhone?: string
  createdTime?: string
}

export default function ExpertReviewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<ReviewProject[]>([])
  const [currentExpert, setCurrentExpert] = useState<{ id: number; name: string } | null>(null)

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  })

  useEffect(() => {
    const user = authStorage.getUser()
    if (user && user.expertId) {
      setCurrentExpert({
        id: user.expertId,
        name: user.expertName || user.realName || user.username,
      })
      console.log("[v0] Expert loaded from authStorage:", { id: user.expertId, name: user.expertName })
    } else {
      console.log("[v0] No expert info found in authStorage")
    }
  }, [])

  useEffect(() => {
    if (currentExpert) {
      loadProjects()
    }
  }, [currentExpert, searchParams, pagination.page, pagination.pageSize])

  const loadProjects = async () => {
    if (!currentExpert) return

    try {
      setLoading(true)
      const response = await expertReviewApi.getList({
        current: pagination.page,
        size: pagination.pageSize,
        expertId: currentExpert.id,
        ...Object.fromEntries(searchParams.entries()),
      })

      console.log("[v0] Expert reviews loaded:", response)

      if (response.data) {
        const projectsList = response.data.records || response.data.items || response.data
        setProjects(Array.isArray(projectsList) ? projectsList : [])
        setPagination((prev) => ({ ...prev, total: response.data.total || 0 }))
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error("[v0] Failed to load expert reviews:", error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadProjects()
  }

  const handleViewDetail = (id: number) => {
    router.push(`/dashboard/expert-reviews/${id}`)
  }

  const handleVoteLeader = (projectId: string) => {
    router.push(`/dashboard/expert-reviews/vote-leader?projectId=${projectId}`)
  }

  const handleLeaderConclusion = () => {
    router.push(`/dashboard/expert-reviews/leader-conclusion`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-500">待评审</Badge>
      case "reviewed":
        return <Badge className="bg-blue-500">已评审待结论</Badge>
      case "completed":
        return <Badge className="bg-green-500">已完成</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">待评审项目</h1>
          <p className="text-sm text-gray-500 mt-1">查看并评审分配给您的项目</p>
        </div>
        <Button onClick={handleLeaderConclusion} variant="outline">
          <FileUp className="h-4 w-4 mr-2" />
          组长上传结论
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待评审</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "pending").length}</div>
            <p className="text-xs text-gray-500 mt-1">需要尽快评审</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已评审待结论</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "reviewed").length}</div>
            <p className="text-xs text-gray-500 mt-1">等待组长上传结论</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "completed").length}</div>
            <p className="text-xs text-gray-500 mt-1">评审已完成</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总计项目</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-gray-500 mt-1">全部评审任务</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>项目筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>项目名称</Label>
              <Input
                placeholder="输入项目名称"
                className={UI_CONSTANTS.INPUT_HEIGHT}
                value={searchParams.get("keyword") || ""}
                onChange={(e) => router.push(`/dashboard/expert-reviews?keyword=${e.target.value}`)}
              />
            </div>
            <div className="space-y-2">
              <Label>评审状态</Label>
              <Select
                value={searchParams.get("status") || ""}
                onValueChange={(value) => router.push(`/dashboard/expert-reviews?status=${value}`)}
              >
                <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待评审</SelectItem>
                  <SelectItem value="reviewed">已评审待结论</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>评审类型</Label>
              <Select
                value={searchParams.get("reviewType") || ""}
                onValueChange={(value) => router.push(`/dashboard/expert-reviews?reviewType=${value}`)}
              >
                <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="initial">初审</SelectItem>
                  <SelectItem value="midterm">中期评审</SelectItem>
                  <SelectItem value="final">结题评审</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className={`w-full ${UI_CONSTANTS.BUTTON_HEIGHT}`}>
                <Search className="h-4 w-4 mr-2" />
                搜索
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>项目列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">暂无待评审项目</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>项目编号</TableHead>
                    <TableHead>项目名称</TableHead>
                    <TableHead>申报单位</TableHead>
                    <TableHead>项目负责人</TableHead>
                    <TableHead>评审类型</TableHead>
                    <TableHead>截止日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-mono text-sm">{project.projectId}</TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.institution}</TableCell>
                      <TableCell>{project.leaderName || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.reviewType}</Badge>
                      </TableCell>
                      <TableCell>{project.deadline}</TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {project.status === "pending" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleVoteLeader(project.projectId)}>
                                <Vote className="h-4 w-4 mr-2" />
                                投票选组长
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetail(project.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                专家评审
                              </Button>
                            </>
                          )}
                          {project.status === "reviewed" && (
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetail(project.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看评审
                            </Button>
                          )}
                          {project.status === "completed" && (
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetail(project.id)}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              查看结论
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination.total > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">每页显示</span>
                    <Select
                      value={pagination.pageSize.toString()}
                      onValueChange={(value) =>
                        setPagination({ ...pagination, page: 1, pageSize: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-20 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">条</span>
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            pagination.page > 1 && setPagination({ ...pagination, page: pagination.page - 1 })
                          }
                          className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {[...Array(Math.ceil(pagination.total / pagination.pageSize))].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setPagination({ ...pagination, page: i + 1 })}
                            isActive={pagination.page === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            pagination.page < Math.ceil(pagination.total / pagination.pageSize) &&
                            setPagination({ ...pagination, page: pagination.page + 1 })
                          }
                          className={
                            pagination.page >= Math.ceil(pagination.total / pagination.pageSize)
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
