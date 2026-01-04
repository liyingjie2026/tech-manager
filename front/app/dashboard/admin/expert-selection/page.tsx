"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { expertApi } from "@/lib/api/expert"
import { projectApi } from "@/lib/api/project"
import { useToast } from "@/hooks/use-toast"
import { Search, ShuffleIcon, CheckCircle } from "lucide-react"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { expertReviewApi } from "@/lib/api/expert-review" // Import expertReviewApi

interface Expert {
  id: number
  name: string
  institutionName: string
  researchField: string
  title: string
  phone: string
  email: string
  status: string
}

interface Project {
  id: number
  projectNo: string
  name: string
  institutionName: string
}

export default function ExpertSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")
  const { toast } = useToast()

  const [project, setProject] = useState<Project | null>(null)
  const [experts, setExperts] = useState<Expert[]>([])
  const [selectedExperts, setSelectedExperts] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [searchForm, setSearchForm] = useState({
    name: "",
    institutionName: "",
    researchField: "",
    title: "全部", // Updated default value
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (projectId) {
      loadProject(Number(projectId))
    }
    loadExperts()
  }, [projectId])

  const loadProject = async (id: number) => {
    try {
      const response = await projectApi.getById(id)
      if (response.data) {
        setProject(response.data)
      }
    } catch (error) {
      console.error("[v0] Failed to load project:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目信息",
        variant: "destructive",
      })
    }
  }

  const loadExperts = async () => {
    try {
      setLoading(true)
      const response = await expertApi.getList({
        pageNum: currentPage,
        pageSize,
        status: "approved",
        available: "1",
        ...searchForm,
      })
      if (response.data) {
        setExperts(response.data.list || [])
        setTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error("[v0] Failed to load experts:", error)
      toast({
        title: "加载失败",
        description: "无法加载专家列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadExperts()
  }

  const handleRandomSelect = () => {
    if (experts.length === 0) {
      toast({
        title: "提示",
        description: "没有可选择的专家",
        variant: "destructive",
      })
      return
    }

    const count = Math.min(5, experts.length)
    const shuffled = [...experts].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count).map((e) => e.id)
    setSelectedExperts(selected)

    toast({
      title: "抽取成功",
      description: `已随机抽取 ${count} 位专家`,
    })
  }

  const handleToggleExpert = (expertId: number) => {
    setSelectedExperts((prev) => (prev.includes(expertId) ? prev.filter((id) => id !== expertId) : [...prev, expertId]))
  }

  const handleConfirm = async () => {
    if (selectedExperts.length === 0) {
      toast({
        title: "提示",
        description: "请至少选择一位专家",
        variant: "destructive",
      })
      return
    }

    if (!projectId) {
      toast({
        title: "错误",
        description: "项目ID不存在",
        variant: "destructive",
      })
      return
    }

    try {
      await expertReviewApi.assignExperts(Number(projectId), selectedExperts)

      toast({
        title: "分配成功",
        description: `已为项目分配 ${selectedExperts.length} 位评审专家`,
      })

      router.push(`/supervisor/review`)
    } catch (error) {
      console.error("[v0] Failed to assign experts:", error)
      toast({
        title: "分配失败",
        description: "无法分配专家，请稍后重试",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">专家抽取</h1>
        <p className="text-sm text-muted-foreground mt-1">为项目抽取评审专家</p>
      </div>

      {project && (
        <Card>
          <CardHeader>
            <CardTitle>项目信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">项目编号：</span>
                <span className="font-medium">{project.projectNo}</span>
              </div>
              <div>
                <span className="text-muted-foreground">项目名称：</span>
                <span className="font-medium">{project.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">承担单位：</span>
                <span className="font-medium">{project.institutionName}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>筛选条件</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">已选择 {selectedExperts.length} 位专家</Badge>
              <Button variant="outline" onClick={handleRandomSelect} className={UI_CONSTANTS.BUTTON_HEIGHT}>
                <ShuffleIcon className="h-4 w-4 mr-2" />
                随机抽取5位
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>专家姓名</Label>
              <Input
                placeholder="请输入"
                value={searchForm.name}
                onChange={(e) => setSearchForm({ ...searchForm, name: e.target.value })}
                className={UI_CONSTANTS.INPUT_HEIGHT}
              />
            </div>
            <div className="space-y-2">
              <Label>所属机构</Label>
              <Input
                placeholder="请输入"
                value={searchForm.institutionName}
                onChange={(e) => setSearchForm({ ...searchForm, institutionName: e.target.value })}
                className={UI_CONSTANTS.INPUT_HEIGHT}
              />
            </div>
            <div className="space-y-2">
              <Label>研究领域</Label>
              <Input
                placeholder="请输入"
                value={searchForm.researchField}
                onChange={(e) => setSearchForm({ ...searchForm, researchField: e.target.value })}
                className={UI_CONSTANTS.INPUT_HEIGHT}
              />
            </div>
            <div className="space-y-2">
              <Label>职称</Label>
              <Select
                value={searchForm.title}
                onValueChange={(value) => setSearchForm({ ...searchForm, title: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="正高级">正高级</SelectItem>
                  <SelectItem value="副高级">副高级</SelectItem>
                  <SelectItem value="中级">中级</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleSearch} className={UI_CONSTANTS.BUTTON_HEIGHT}>
              <Search className="h-4 w-4 mr-2" />
              查询
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>专家库（共 {total} 位）</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : experts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无专家数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">选择</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>所属机构</TableHead>
                  <TableHead>研究领域</TableHead>
                  <TableHead>职称</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>邮箱</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experts.map((expert) => (
                  <TableRow key={expert.id} className={selectedExperts.includes(expert.id) ? "bg-muted/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedExperts.includes(expert.id)}
                        onCheckedChange={() => handleToggleExpert(expert.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{expert.name}</TableCell>
                    <TableCell>{expert.institutionName}</TableCell>
                    <TableCell>{expert.researchField}</TableCell>
                    <TableCell>{expert.title}</TableCell>
                    <TableCell>{expert.phone}</TableCell>
                    <TableCell>{expert.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每页显示</span>
              <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20">
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
              <span className="text-sm text-muted-foreground">条</span>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {[...Array(Math.min(7, Math.ceil(total / pageSize)))].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                    className={
                      currentPage >= Math.ceil(total / pageSize) ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          取消
        </Button>
        <Button onClick={handleConfirm} disabled={selectedExperts.length === 0}>
          <CheckCircle className="h-4 w-4 mr-2" />
          确认分配（{selectedExperts.length}位专家）
        </Button>
      </div>
    </div>
  )
}
