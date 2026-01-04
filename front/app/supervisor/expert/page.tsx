"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Eye, Download, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { expertApi } from "@/lib/api/expert"
import { useToast } from "@/hooks/use-toast"
import { authStorage } from "@/lib/auth-storage"
import { useRouter } from "next/navigation"
import type { Expert } from "@/lib/types"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

const getTitleDisplay = (title: string | undefined): string => {
  if (!title) return "-"
  const titleMap: Record<string, string> = {
    professor: "教授",
    associate: "副教授",
    researcher: "研究员",
    senior: "高级工程师",
  }
  return titleMap[title] || title
}

export default function ExpertManagementPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingExpert, setViewingExpert] = useState<Expert | null>(null)
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null)
  const [experts, setExperts] = useState<Expert[]>([])
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fieldFilter, setFieldFilter] = useState("all")
  const [titleFilter, setTitleFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const token = authStorage.getToken()
    const user = authStorage.getUser()

    if (!token || !user) {
      toast({
        title: "未登录",
        description: "请先登录",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    loadExperts()
  }, [page, pageSize])

  const loadExperts = async () => {
    setIsLoading(true)
    try {
      const response = await expertApi.getList({ page, pageSize })

      if (response.success && response.data) {
        const records = response.data.records || response.data
        setTotal(response.data.total || records.length)

        const processedExperts = records.map((expert: any) => ({
          id: expert.id,
          userId: expert.userId,
          name: expert.name,
          gender: expert.gender,
          birthDate: expert.birthDate,
          idCard: expert.idCard,
          phone: expert.phone,
          email: expert.email,
          education: expert.education,
          degree: expert.degree,
          title: expert.title,
          major: expert.major,
          researchDirection: expert.researchDirection,
          workUnit: expert.workUnit,
          department: expert.department,
          position: expert.position,
          workYears: expert.workYears,
          expertise: expert.expertise,
          achievements: expert.achievements,
          bankName: expert.bankName,
          bankAccount: expert.bankAccount,
          photo: expert.photo,
          status: expert.status,
          remark: expert.remark,
          reviewCount: expert.reviewCount || 0,
          averageScore: expert.averageScore || 0,
        }))

        setExperts(processedExperts)
        setFilteredExperts(processedExperts)
      } else {
        setExperts([])
        setFilteredExperts([])
        setTotal(0)
      }
    } catch (error) {
      console.error("加载专家列表失败:", error)
      setExperts([])
      setFilteredExperts([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const filtered = experts.filter((expert) => {
      if (fieldFilter !== "all" && expert.researchDirection !== fieldFilter) {
        return false
      }
      if (titleFilter !== "all" && expert.title !== titleFilter) {
        return false
      }
      return true
    })

    setFilteredExperts(filtered)
  }, [fieldFilter, titleFilter, experts])

  const handleCreateExpert = async () => {
    try {
      const response = await expertApi.create(experts)

      if (response.success) {
        toast({
          title: "创建成功",
          description: response.message || "专家创建成功",
        })
        setIsDialogOpen(false)
        loadExperts()
      } else {
        toast({
          title: "创建失败",
          description: response.message || "专家创建失败",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "创建失败",
        description: error.message || "专家创建失败",
        variant: "destructive",
      })
    }
  }

  const handleEditExpert = (expert: Expert) => {
    console.log("[v0] 编辑专家:", expert)
    setEditingExpert(expert)
    setIsEditDialogOpen(true)
  }

  const handleUpdateExpert = async () => {
    if (!editingExpert) return

    console.log("[v0] 更新专家 with data:", experts)

    try {
      const response = await expertApi.update(editingExpert.id, experts)
      console.log("[v0] Update response:", response)

      if (response.success) {
        toast({
          title: "更新成功",
          description: response.message || "专家信息更新成功",
        })
        setIsEditDialogOpen(false)
        setEditingExpert(null)
        loadExperts()
      } else {
        toast({
          title: "更新失败",
          description: response.message || "更新专家信息失败",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("[v0] Update error:", error)
      toast({
        title: "更新失败",
        description: error.message || "更新专家信息失败",
        variant: "destructive",
      })
    }
  }

  const handleDeleteExpert = async (expert: Expert) => {
    if (!confirm(`确定要删除专家 ${expert.name} 吗？`)) {
      return
    }

    try {
      const response = await expertApi.delete(expert.id)

      if (response.success) {
        toast({
          title: "删除成功",
          description: response.message || "专家删除成功",
        })
        loadExperts()
      } else {
        toast({
          title: "删除失败",
          description: response.message || "专家删除失败",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.message || "专家删除失败",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (expert: Expert) => {
    const isEnabled = expert.status === 1 || expert.status === "1"
    const action = isEnabled ? "禁用" : "启用"

    try {
      // Call the appropriate API method
      const response = isEnabled ? await expertApi.disable(expert.id) : await expertApi.enable(expert.id)

      if (response.success) {
        toast({
          title: `${action}成功`,
          description: response.message || `专家已${action}`,
        })
        loadExperts()
      } else {
        toast({
          title: `${action}失败`,
          description: response.message || `专家${action}失败`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: `${action}失败`,
        description: error.message || `专家${action}失败`,
        variant: "destructive",
      })
    }
  }

  const handleSearch = () => {
    loadExperts()
  }

  const handleReset = () => {
    setSearchTerm("")
    setFieldFilter("all")
    setTitleFilter("all")
  }

  const handleViewExpert = (expert: Expert) => {
    console.log("[v0] 查看专家详情:", expert)
    setViewingExpert(expert)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">专家库管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理评审专家信息和专业领域</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            导入专家
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出专家
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新增专家
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增专家</DialogTitle>
                <DialogDescription>添加新的评审专家到专家库</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      placeholder="请输入姓名"
                      value={experts.expertName}
                      onChange={(e) => setExperts({ ...experts, expertName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">性别</Label>
                    <Select value={experts.gender} onValueChange={(value) => setExperts({ ...experts, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">职称</Label>
                    <Select value={experts.title} onValueChange={(value) => setExperts({ ...experts, title: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择职称" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professor">教授</SelectItem>
                        <SelectItem value="associate">副教授</SelectItem>
                        <SelectItem value="researcher">研究员</SelectItem>
                        <SelectItem value="senior">高级工程师</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field">专业领域</Label>
                    <Input
                      id="field"
                      placeholder="请输入专业领域"
                      onChange={(e) => setExperts({ ...experts, researchField: [e.target.value] })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">所属单位</Label>
                  <Input
                    id="institution"
                    placeholder="请输入所属单位"
                    value={experts.institution}
                    onChange={(e) => setExperts({ ...experts, institution: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">联系电话</Label>
                    <Input
                      id="phone"
                      placeholder="请输入联系电话"
                      value={experts.phone}
                      onChange={(e) => setExperts({ ...experts, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">电子邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入电子邮箱"
                      value={experts.email}
                      onChange={(e) => setExperts({ ...experts, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="research">研究领域</Label>
                  <Textarea
                    id="research"
                    placeholder="请输入研究领域"
                    rows={3}
                    value={experts.expertise}
                    onChange={(e) => setExperts({ ...experts, expertise: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements">主要成果</Label>
                  <Textarea
                    id="achievements"
                    placeholder="请输入主要科研成果"
                    rows={3}
                    value={experts.achievements}
                    onChange={(e) => setExperts({ ...experts, achievements: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateExpert}>确定</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索专家姓名、工作单位或研究领域..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${UI_CONSTANTS.INPUT_HEIGHT}`}
              />
            </div>
            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.SELECT_HEIGHT}`}>
                <SelectValue placeholder="研究领域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部领域</SelectItem>
                <SelectItem value="geology">地质学</SelectItem>
                <SelectItem value="surveying">测绘科学</SelectItem>
                <SelectItem value="environment">环境科学</SelectItem>
                <SelectItem value="it">信息技术</SelectItem>
              </SelectContent>
            </Select>
            <Select value={titleFilter} onValueChange={setTitleFilter}>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.SELECT_HEIGHT}`}>
                <SelectValue placeholder="职称" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部职称</SelectItem>
                <SelectItem value="professor">教授</SelectItem>
                <SelectItem value="associate">副教授</SelectItem>
                <SelectItem value="researcher">研究员</SelectItem>
              </SelectContent>
            </Select>
            <Button className={UI_CONSTANTS.BUTTON_HEIGHT}>搜索</Button>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑专家</DialogTitle>
            <DialogDescription>修改专家信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">姓名</Label>
                <Input
                  id="edit-name"
                  placeholder="请输入姓名"
                  value={experts.expertName}
                  onChange={(e) => setExperts({ ...experts, expertName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">性别</Label>
                <Select value={experts.gender} onValueChange={(value) => setExperts({ ...experts, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">职称</Label>
                <Select value={experts.title} onValueChange={(value) => setExperts({ ...experts, title: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择职称" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professor">教授</SelectItem>
                    <SelectItem value="associate">副教授</SelectItem>
                    <SelectItem value="researcher">研究员</SelectItem>
                    <SelectItem value="senior">高级工程师</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-field">专业领域</Label>
                <Input
                  id="edit-field"
                  placeholder="请输入专业领域"
                  value={experts.researchField?.[0] || ""}
                  onChange={(e) => setExperts({ ...experts, researchField: [e.target.value] })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-institution">所属单位</Label>
              <Input
                id="edit-institution"
                placeholder="请输入所属单位"
                value={experts.institution}
                onChange={(e) => setExperts({ ...experts, institution: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">联系电话</Label>
                <Input
                  id="edit-phone"
                  placeholder="请输入联系电话"
                  value={experts.phone}
                  onChange={(e) => setExperts({ ...experts, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">电子邮箱</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="请输入电子邮箱"
                  value={experts.email}
                  onChange={(e) => setExperts({ ...experts, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-research">研究领域</Label>
              <Textarea
                id="edit-research"
                placeholder="请输入研究领域"
                rows={3}
                value={experts.expertise}
                onChange={(e) => setExperts({ ...experts, expertise: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-achievements">主要成果</Label>
              <Textarea
                id="edit-achievements"
                placeholder="请输入主要科研成果"
                rows={3}
                value={experts.achievements}
                onChange={(e) => setExperts({ ...experts, achievements: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateExpert}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>专家详情</DialogTitle>
            <DialogDescription>查看专家的详细信息</DialogDescription>
          </DialogHeader>
          {viewingExpert && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">姓名</Label>
                  <p className="mt-1">{viewingExpert.name || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">性别</Label>
                  <p className="mt-1">
                    {viewingExpert.gender === "男" ? "男" : viewingExpert.gender === "女" ? "女" : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">职称</Label>
                  <p className="mt-1">{getTitleDisplay(viewingExpert.title)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">所属单位</Label>
                  <p className="mt-1">{viewingExpert.workUnit || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">联系电话</Label>
                  <p className="mt-1">{viewingExpert.phone || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">电子邮箱</Label>
                  <p className="mt-1">{viewingExpert.email || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">身份证号</Label>
                  <p className="mt-1">{viewingExpert.idCard || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">状态</Label>
                  <p className="mt-1">
                    <Badge
                      variant={viewingExpert.status === 1 || viewingExpert.status === "1" ? "default" : "secondary"}
                    >
                      {viewingExpert.status === 1 || viewingExpert.status === "1" ? "启用" : "禁用"}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">专业领域</Label>
                <p className="mt-1">{viewingExpert.researchDirection || viewingExpert.major || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">学历</Label>
                <p className="mt-1">{viewingExpert.education || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">研究领域</Label>
                <p className="mt-1 whitespace-pre-wrap">{viewingExpert.expertise || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">主要成果</Label>
                <p className="mt-1 whitespace-pre-wrap">{viewingExpert.achievements || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">评审次数</Label>
                <p className="mt-1">{viewingExpert.reviewCount || 0}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experts Table */}
      <Card>
        <CardHeader>
          <CardTitle>专家列表 (共 {total} 条)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : filteredExperts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>专业领域</TableHead>
                  <TableHead>职称</TableHead>
                  <TableHead>所属单位</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>评审次数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperts.map((expert) => (
                  <TableRow key={expert.id}>
                    <TableCell className="font-medium">{expert.name}</TableCell>
                    <TableCell>
                      {expert.researchDirection ? (
                        <Badge variant="outline">{expert.researchDirection}</Badge>
                      ) : expert.major ? (
                        <Badge variant="outline">{expert.major}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getTitleDisplay(expert.title) || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>{expert.workUnit || <span className="text-muted-foreground">-</span>}</TableCell>
                    <TableCell className="font-mono">
                      {expert.phone || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{expert.reviewCount || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={expert.status === 1 || expert.status === "1" ? "default" : "secondary"}>
                        {expert.status === 1 || expert.status === "1" ? "启用" : "禁用"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" title="查看详情" onClick={() => handleViewExpert(expert)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="编辑" onClick={() => handleEditExpert(expert)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={expert.status === 1 || expert.status === "1" ? "禁用" : "启用"}
                          onClick={() => handleToggleStatus(expert)}
                        >
                          {expert.status === 1 || expert.status === "1" ? (
                            <span className="text-orange-600">禁用</span>
                          ) : (
                            <span className="text-green-600">启用</span>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="删除"
                          onClick={() => handleDeleteExpert(expert)}
                          className="text-red-600 hover:text-red-700"
                        >
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && filteredExperts.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">共 {total} 条</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">每页显示</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(v) => {
                      setPageSize(Number(v))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
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
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  上一页
                </Button>
                <span className="text-sm">
                  第 {page} / {Math.ceil(total / pageSize)} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
