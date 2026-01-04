"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataPagination } from "@/components/ui/data-pagination"
import { useToast } from "@/hooks/use-toast"
import { projectApi } from "@/lib/api/project"
import { Search } from "lucide-react"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { getStatusText, getStatusColor } from "@/lib/utils/status-maps"

export default function ApplicationManagementPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(UI_CONSTANTS.DEFAULT_PAGE)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadProjects()
  }, [currentPage, pageSize])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await projectApi.list({
        current: currentPage,
        size: pageSize,
      })

      if (response.data) {
        const filtered = (response.data.records || []).filter((p: any) => p.status !== "draft")
        setProjects(filtered)
        setTotal(response.data.total || filtered.length)
      }
    } catch (error) {
      console.error("[v0] Failed to load projects:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目列表，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleView = (project: any) => {
    router.push(`/supervisor/application/${project.id}`)
  }

  const handlePreliminaryReview = (project: any) => {
    router.push(`/supervisor/application/${project.id}/preliminary-review`)
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="secondary" className={getStatusColor(status)}>
        {getStatusText(status, "application")}
      </Badge>
    )
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.institutionName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(total / pageSize)

  const getActionButtons = (project: any) => {
    const status = project.status

    if (status === "submitted" || status === "pending") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => handleView(project)}>
            查看
          </Button>
          <Button variant="link" size="sm" onClick={() => handlePreliminaryReview(project)}>
            初审
          </Button>
        </div>
      )
    }

    if (status === "preliminary_approved" || status === "preliminary_review_passed") {
      return (
        <Button variant="link" size="sm" onClick={() => handleView(project)}>
          查看
        </Button>
      )
    }

    return (
      <Button variant="link" size="sm" onClick={() => handleView(project)}>
        查看
      </Button>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">申报管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理项目申报信息，进行初审操作</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className={UI_CONSTANTS.SEARCH_ICON_CLASS} />
              <Input
                placeholder="搜索项目名称或申报单位"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={UI_CONSTANTS.SEARCH_INPUT_CLASS}
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">序号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>申报单位</TableHead>
                  <TableHead>项目负责人</TableHead>
                  <TableHead>申报时间</TableHead>
                  <TableHead className="w-[120px]">项目状态</TableHead>
                  <TableHead className="w-[200px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      暂无项目数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project, index) => {
                    const statusInfo = getStatusBadge(project.status)
                    return (
                      <TableRow key={project.id}>
                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.institutionName || "-"}</TableCell>
                        <TableCell>{project.leaderName || "-"}</TableCell>
                        <TableCell>{project.createTime || "-"}</TableCell>
                        <TableCell>{statusInfo}</TableCell>
                        <TableCell>{getActionButtons(project)}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>

            {filteredProjects.length > 0 && (
              <div className="px-4 py-4 border-t">
                <DataPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
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
          </div>
        </div>
      </div>
    </div>
  )
}
