"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { projectApi } from "@/lib/api/project"
import { getStatusText, getStatusColor } from "@/lib/utils/status-maps"
import {dictionaryApi} from "@/lib/api/dictionary"

export default function ProjectApprovalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState("")
  const [responsibleUnit, setResponsibleUnit] = useState("")
  const [reviewResult, setReviewResult] = useState("all")
  const [projectsWithExperts, setProjectsWithExperts] = useState<Set<number>>(new Set())
  const [projectsWithConclusions, setProjectsWithConclusions] = useState<Set<number>>(new Set())

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadProjects()
    initProjectTypeMap()
  }, [currentPage, pageSize])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await projectApi.list({ page: currentPage, pageSize })

      if (response.data) {
        const filtered = (response.data.records || []).filter(
          (p: any) =>
            p.status === "preliminary_approved" ||
            p.status === "preliminary_review_pending" ||
            p.status === "preliminary_review_passed" ||
            p.status === "preliminary_review_failed",
        )
        setProjects(filtered)
        setTotal(filtered.length)
        await checkExpertAssignments(filtered)
        await checkLeaderConclusions(filtered)
      }
    } catch (error) {
      console.error("[v0] Failed to load projects:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkExpertAssignments = async (projectList: any[]) => {
    const assignedSet = new Set<number>()

    for (const project of projectList) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.10.19:8090/api"}/expert-reviews/project/${project.id}`,
        )
        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            assignedSet.add(project.id)
          }
        }
      } catch (error) {
        console.error(`[v0] Failed to check expert assignment for project ${project.id}:`, error)
      }
    }

    setProjectsWithExperts(assignedSet)
  }

  const checkLeaderConclusions = async (projectList: any[]) => {
    const conclusionsSet = new Set<number>()

    for (const project of projectList) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.10.19:8090/api"}/expert-leaders/project/${project.id}`,
        )
        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.conclusionStatus === "uploaded") {
            conclusionsSet.add(project.id)
            console.log(`[v0] Project ${project.id} has leader conclusion uploaded`)
          }
        }
      } catch (error) {
        console.error(`[v0] Failed to check leader conclusion for project ${project.id}:`, error)
      }
    }

    setProjectsWithConclusions(conclusionsSet)
  }

  const handleTaskAssignment = async (project: any) => {
    try {
      await projectApi.issueTaskBook(project.id, {
        needMidterm: 0,
        needAnnual: 0,
      })
      toast({
        title: "任务书下发成功",
        description: `项目 ${project.name || project.id} 的任务书已下发到科研机构端`,
      })
      loadProjects()
    } catch (error) {
      toast({
        title: "下发失败",
        description: "任务书下发失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleExpertSelection = (project: any) => {
    router.push(`/supervisor/review/${project.id}/expert-selection`)
  }

  const defaultProjectTypeMap: Record<string, string> = {
  basic_research: "基础研究",
  applied_research: "应用研究",
  experimental_development: "试验发展",
  // ... 其他默认值
}
const initProjectTypeMap = async (): Promise<Record<string, string>> => {
  try {
    const response = await dictionaryApi.getByType("project_type");
    

    const records = response.data?.records || [];
    const dynamicMap: Record<string, string> = {};
    
    records.forEach(item => {
      if (item.itemValue && item.itemLabel) {
        dynamicMap[item.itemValue] = item.itemLabel;
      }
    });
    
    // 合并映射，动态数据覆盖默认值
    return { ...defaultProjectTypeMap, ...dynamicMap };
  } catch (error) {
    console.error("获取项目类型失败，使用默认值:", error);
    return defaultProjectTypeMap;
  }
};


  const getProjectTextType =  (projectType:string)  =>
  {
      return defaultProjectTypeMap[projectType];
  }
  const handleConfirmPass = async (project: any) => {
    try {
      await projectApi.preliminaryReviewPass(project.id, "监管端确认立项评审通过")
      toast({
        title: "确认成功",
        description: `项目 ${project.name || project.id} 已确认通过立项评审`,
      })
      loadProjects()
    } catch (error) {
      toast({
        title: "确认失败",
        description: "确认立项评审通过失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleConfirmFail = async (project: any) => {
    try {
      await projectApi.preliminaryReviewFail(project.id, "监管端确认立项评审未通过")
      toast({
        title: "确认成功",
        description: `项目 ${project.name || project.id} 已确认未通过立项评审`,
      })
      loadProjects()
    } catch (error) {
      toast({
        title: "确认失败",
        description: "确认立项评审未通过失败，请重试",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="outline" className={getStatusColor(status)}>
        {getStatusText(status, "review")}
      </Badge>
    )
  }

  const getActionButtons = (project: any) => {
    const status = project.status
    const hasExperts = projectsWithExperts.has(project.id)
    const hasConclusion = projectsWithConclusions.has(project.id)

    console.log(
      `[v0] Project ${project.id} - status: ${status}, hasExperts: ${hasExperts}, hasConclusion: ${hasConclusion}`,
    )

    if ((status === "preliminary_approved" || status === "preliminary_review_pending") && !hasExperts) {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/supervisor/review/${project.id}`)}>
            查看
          </Button>
          <Button variant="link" size="sm" onClick={() => handleExpertSelection(project)}>
            专家抽取
          </Button>
        </div>
      )
    }

    if (status === "preliminary_review_pending" && hasExperts && !hasConclusion) {
      return (
        <Button variant="link" size="sm" onClick={() => router.push(`/supervisor/review/${project.id}`)}>
          查看
        </Button>
      )
    }

    if (status === "preliminary_review_passed" && hasConclusion) {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/supervisor/review/${project.id}`)}>
            查看
          </Button>
          <Button variant="link" size="sm" onClick={() => handleConfirmPass(project)}>
            确认立项
          </Button>
        </div>
      )
    }

    if (status === "preliminary_review_failed") {
      return (
        <div className="flex gap-2">
          <Button variant="link" size="sm" onClick={() => router.push(`/supervisor/review/${project.id}`)}>
            查看
          </Button>
          <Button variant="link" size="sm" onClick={() => handleConfirmFail(project)}>
            驳回
          </Button>
        </div>
      )
    }

    return (
      <Button variant="link" size="sm" onClick={() => router.push(`/supervisor/review/${project.id}`)}>
        查看
      </Button>
    )
  }

  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProjects = projects.slice(startIndex, endIndex)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">立项评审</h1>
        <p className="text-sm text-muted-foreground mt-1">初审通过的项目进入立项评审和任务下发</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label>项目名称</Label>
              <Input placeholder="输入" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>责任单位</Label>
              <Input
                placeholder="输入检索"
                value={responsibleUnit}
                onChange={(e) => setResponsibleUnit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>评审结果</Label>
              <Select value={reviewResult} onValueChange={setReviewResult}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="preliminary_review_pending">待评审</SelectItem>
                  <SelectItem value="preliminary_review_passed">已通过</SelectItem>
                  <SelectItem value="preliminary_review_failed">未通过</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={loadProjects}>查 询</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>项目类型</TableHead>
                  <TableHead>立项评审状态</TableHead>
                  <TableHead>项目经理</TableHead>
                  <TableHead>项目承担单位</TableHead>
                  <TableHead>审核时间</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      暂无立项评审项目
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getProjectTextType(project.projectType) || "科研项目"}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>{project.leaderName || "-"}</TableCell>
                      <TableCell>{project.institutionName || "湖南省第三测绘院"}</TableCell>
                      <TableCell>{project.auditTime || "-"}</TableCell>
                      <TableCell>{project.submitTime || project.createTime || "-"}</TableCell>
                      <TableCell>{getActionButtons(project)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              共 {total} 条，第 {startIndex + 1}-{Math.min(endIndex, total)} 条
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10条/页</SelectItem>
                  <SelectItem value="20">20条/页</SelectItem>
                  <SelectItem value="50">50条/页</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  上一页
                </Button>
                <span className="flex items-center px-3 text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  下一页
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">前往</span>
              <Input
                className="w-16"
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Number(e.target.value)
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page)
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
