"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataPagination } from "@/components/ui/data-pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { projectApi, statisticsApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import {
  getStatusText,
  getStatusColor,
  getProjectTypeText,
  getProjectCategoryText,
  getResearchFieldText,
} from "@/lib/utils/status-maps"
export default function ProjectLibraryPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [projectType, setProjectType] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    applying: 0,
    executing: 0,
    completed: 0,
    totalBudget: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await projectApi.list({
          current: currentPage,
          size: pageSize,
          keyword: searchTerm,
          projectType: projectType === "all" ? undefined : projectType,
          status: status === "all" ? undefined : status,
        })

        if (response.data) {
          setProjects(response.data.records || [])
          setTotal(response.data.total || 0)
        }
      } catch (error) {
        console.error("Failed to load projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentPage, pageSize, searchTerm, projectType, status])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statisticsApi.getOverview()
        if (response.code === 200 && response.data) {
          setStats({
            total: response.data.totalProjects || 0,
            applying: response.data.pendingProjects || 0,
            executing: response.data.executingProjects || 0,
            completed: response.data.completedProjects || 0,
            totalBudget: 0, // Will be calculated from budget statistics
          })
        }

        // Fetch budget statistics
        const budgetResponse = await statisticsApi.getBudgetStatistics()
        if (budgetResponse.code === 200 && budgetResponse.data) {
          setStats((prev) => ({
            ...prev,
            totalBudget: budgetResponse.data.totalBudget || 0,
          }))
        }
      } catch (error) {
        console.error("Failed to load statistics:", error)
      }
    }
    fetchStats()
  }, [])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchTerm("")
    setProjectType("all")
    setStatus("all")
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">项目库管理</h1>
          <p className="text-sm text-muted-foreground mt-1">查看和管理所有科研项目</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          导出项目数据
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">项目总数</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">申报中</p>
              <p className="text-3xl font-bold mt-2">{stats.applying}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">执行中</p>
              <p className="text-3xl font-bold mt-2">{stats.executing}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">已结题</p>
              <p className="text-3xl font-bold mt-2">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">总预算</p>
              <p className="text-3xl font-bold mt-2">{(stats.totalBudget / 10000).toFixed(1)}亿</p>
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
                className={`pl-10 ${UI_CONSTANTS.INPUT_HEIGHT}`}
              />
            </div>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.SELECT_HEIGHT}`}>
                <SelectValue placeholder="项目类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="general">一般项目</SelectItem>
                <SelectItem value="major">重大项目</SelectItem>
                <SelectItem value="application">应用技术类</SelectItem>
                <SelectItem value="youth">青年项目</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.SELECT_HEIGHT}`}>
                <SelectValue placeholder="项目状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="applying">申报中</SelectItem>
                <SelectItem value="executing">执行中</SelectItem>
                <SelectItem value="completed">已结题</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT} onClick={handleSearch}>
              搜索
            </Button>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT} onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>项目列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>项目编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>承担单位</TableHead>
                <TableHead>项目负责人</TableHead>
                <TableHead>项目类型</TableHead>
                <TableHead>预算(万元)</TableHead>
                <TableHead>开始时间</TableHead>
                <TableHead>结束时间</TableHead>
                <TableHead>完成进度</TableHead>
                <TableHead>项目状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    暂无项目数据
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-mono">{project.projectNo}</TableCell>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.institutionName}</TableCell>
                    <TableCell>{project.leaderName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getProjectTypeText(project.projectType)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{project.totalBudget}</TableCell>
                    <TableCell>{project.startDate}</TableCell>
                    <TableCell>{project.endDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${project.completionRate || 0}%` }} />
                        </div>
                        <span className="text-sm font-medium">{project.completionRate || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.status === "completed" ? "default" : "secondary"}>{getStatusText(project.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/supervisor/projects/${project.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {total > 0 && (
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
              className="mt-4"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
