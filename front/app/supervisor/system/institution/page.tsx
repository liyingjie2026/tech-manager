"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, CheckCircle, Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { institutionApi, type InstitutionDTO } from "@/lib/api/institution"

export default function InstitutionManagementPage() {
  const [institutions, setInstitutions] = useState<InstitutionDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [viewingInstitution, setViewingInstitution] = useState<InstitutionDTO | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false)
  const [auditingInstitution, setAuditingInstitution] = useState<InstitutionDTO | null>(null)
  const [auditComment, setAuditComment] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<InstitutionDTO | null>(null)
  const [formData, setFormData] = useState({
    institutionName: "",
    institutionType: "university",
    creditCode: "",
    legalPerson: "",
    address: "",
    contactPerson: "",
    contactPhone: "",
    email: "",
    qualification: "",
    businessScope: "",
    description: "",
  })
  const { toast } = useToast()

  const getInstitutionTypeText = (type: string): string => {
    const typeMap: Record<string, string> = {
      university: "高校",
      research_institute: "科研院所",
      enterprise: "企业",
      government: "政府机构",
      ngo: "非政府组织",
      other: "其他",
    }
    return typeMap[type] || type
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    } catch (error) {
      return dateString
    }
  }

  const loadInstitutions = async () => {
    setLoading(true)
    try {
      const response = await institutionApi.getList({
        page,
        size: 10,
        keyword: searchTerm || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })

      if (response.success && response.data) {
        setInstitutions(response.data.records || [])
        setTotal(response.data.total || 0)
      } else {
        toast({
          title: "加载失败",
          description: response.message || "无法加载机构列表",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Load institutions error:", error)
      toast({
        title: "加载失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInstitutions()
  }, [page, typeFilter, statusFilter])

  const handleSearch = () => {
    setPage(1)
    loadInstitutions()
  }

  const handleReset = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setStatusFilter("all")
    setPage(1)
    loadInstitutions()
  }

  const handleView = (institution: InstitutionDTO) => {
    setViewingInstitution(institution)
    setIsViewDialogOpen(true)
  }

  const handleApprove = (institution: InstitutionDTO) => {
    setAuditingInstitution(institution)
    setAuditComment("")
    setIsAuditDialogOpen(true)
  }

  const handleSubmitAudit = async (status: "approved" | "rejected") => {
    if (!auditingInstitution) return

    try {
      const response = await institutionApi.audit(auditingInstitution.id, {
        status,
        comment: auditComment || undefined,
      })

      if (response.success) {
        toast({
          title: "审核成功",
          description: `机构已${status === "approved" ? "通过" : "拒绝"}审核`,
        })
        setIsAuditDialogOpen(false)
        setAuditingInstitution(null)
        setAuditComment("")
        loadInstitutions()
      } else {
        toast({
          title: "审核失败",
          description: response.message || "操作失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Audit error:", error)
      toast({
        title: "审核失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleCreate = () => {
    setFormData({
      institutionName: "",
      institutionType: "university",
      creditCode: "",
      legalPerson: "",
      address: "",
      contactPerson: "",
      contactPhone: "",
      email: "",
      qualification: "",
      businessScope: "",
      description: "",
    })
    setIsCreateDialogOpen(true)
  }

  const handleSubmitCreate = async () => {
    if (!formData.institutionName || !formData.institutionType) {
      toast({
        title: "验证失败",
        description: "请填写机构名称和类型",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await institutionApi.create(formData)
      if (response.success) {
        toast({
          title: "创建成功",
          description: "机构已成功创建",
        })
        setIsCreateDialogOpen(false)
        loadInstitutions()
      } else {
        toast({
          title: "创建失败",
          description: response.message || "操作失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Create institution error:", error)
      toast({
        title: "创建失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (institution: InstitutionDTO) => {
    setEditingInstitution(institution)
    setFormData({
      institutionName: institution.name || "",
      institutionType: institution.type || "university",
      creditCode: institution.unifiedCode || "",
      legalPerson: institution.legalPerson || "",
      address: institution.address || "",
      contactPerson: institution.contactPerson || "",
      contactPhone: institution.contactPhone || "",
      email: institution.email || "",
      qualification: institution.nature || "",
      businessScope: institution.location || "",
      description: "",
    })
    setIsEditDialogOpen(true)
  }

  const handleSubmitEdit = async () => {
    if (!editingInstitution || !formData.institutionName || !formData.institutionType) {
      toast({
        title: "验证失败",
        description: "请填写机构名称和类型",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await institutionApi.update(editingInstitution.id, formData)
      if (response.success) {
        toast({
          title: "更新成功",
          description: "机构信息已更新",
        })
        setIsEditDialogOpen(false)
        setEditingInstitution(null)
        loadInstitutions()
      } else {
        toast({
          title: "更新失败",
          description: response.message || "操作失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update institution error:", error)
      toast({
        title: "更新失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (institution: InstitutionDTO) => {
    if (!confirm(`确定要删除机构"${institution.name}"吗？此操作不可恢复。`)) {
      return
    }

    try {
      const response = await institutionApi.delete(institution.id)
      if (response.success) {
        toast({
          title: "删除成功",
          description: "机构已删除",
        })
        loadInstitutions()
      } else {
        toast({
          title: "删除失败",
          description: response.message || "操作失败",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete institution error:", error)
      toast({
        title: "删除失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: "待审核",
      approved: "已审核",
      rejected: "已拒绝",
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    if (status === "approved") return "default"
    if (status === "rejected") return "destructive"
    return "secondary"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">机构管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理注册科研机构信息和资质审核</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          新增机构
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索机构名称或联系人..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="机构类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="university">高等院校</SelectItem>
                <SelectItem value="research">科研院所</SelectItem>
                <SelectItem value="enterprise">企业</SelectItem>
                <SelectItem value="government">政府机构</SelectItem>
                <SelectItem value="ngo">非政府组织</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="审核状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="approved">已审核</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="rejected">已拒绝</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              搜索
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Institutions Table */}
      <Card>
        <CardHeader>
          <CardTitle>机构列表 (共 {total} 条)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : institutions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>机构名称</TableHead>
                  <TableHead>机构类型</TableHead>
                  <TableHead>联系人</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>项目数量</TableHead>
                  <TableHead>审核状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institutions.map((institution) => (
                  <TableRow key={institution.id}>
                    <TableCell className="font-medium">{institution.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getInstitutionTypeText(institution.type)}</Badge>
                    </TableCell>
                    <TableCell>{institution.contactPerson || "-"}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{institution.contactPhone || "-"}</TableCell>
                    <TableCell>{formatDate(institution.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{institution.projectCount || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(institution.status)}>{getStatusText(institution.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(institution)} title="查看详情">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(institution)} title="编辑">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(institution)} title="删除">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                        {institution.status === "pending" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleApprove(institution)} title="审核">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>机构详情</DialogTitle>
          </DialogHeader>
          {viewingInstitution && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">机构名称</Label>
                <p className="mt-1">{viewingInstitution.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">机构类型</Label>
                <p className="mt-1">{getInstitutionTypeText(viewingInstitution.type)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">统一社会信用代码</Label>
                <p className="mt-1">{viewingInstitution.unifiedCode || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">法定代表人</Label>
                <p className="mt-1">{viewingInstitution.legalPerson || "-"}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">地址</Label>
                <p className="mt-1">{viewingInstitution.address || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">联系人</Label>
                <p className="mt-1">{viewingInstitution.contactPerson || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">联系电话</Label>
                <p className="mt-1">{viewingInstitution.contactPhone || "-"}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">邮箱</Label>
                <p className="mt-1">{viewingInstitution.email || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">审核状态</Label>
                <p className="mt-1">
                  <Badge variant={getStatusVariant(viewingInstitution.status)}>
                    {getStatusText(viewingInstitution.status)}
                  </Badge>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Audit Dialog */}
      <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>审核机构</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>机构名称</Label>
              <p className="mt-1 font-medium">{auditingInstitution?.name}</p>
            </div>
            <div>
              <Label>审核意见</Label>
              <Textarea
                value={auditComment}
                onChange={(e) => setAuditComment(e.target.value)}
                placeholder="请输入审核意见（可选）"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAuditDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={() => handleSubmitAudit("rejected")}>
              拒绝
            </Button>
            <Button onClick={() => handleSubmitAudit("approved")}>通过</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增机构</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  机构名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="请输入机构名称"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  机构类型 <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.institutionType}
                  onValueChange={(value) => setFormData({ ...formData, institutionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">高校</SelectItem>
                    <SelectItem value="research_institute">科研院所</SelectItem>
                    <SelectItem value="enterprise">企业</SelectItem>
                    <SelectItem value="government">政府机构</SelectItem>
                    <SelectItem value="ngo">非政府组织</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">统一社会信用代码</label>
                <Input
                  value={formData.creditCode}
                  onChange={(e) => setFormData({ ...formData, creditCode: e.target.value })}
                  placeholder="请输入统一社会信用代码"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">法定代表人</label>
                <Input
                  value={formData.legalPerson}
                  onChange={(e) => setFormData({ ...formData, legalPerson: e.target.value })}
                  placeholder="请输入法定代表人"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">联系人</label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="请输入联系人"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">联系电话</label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="请输入联系电话"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">电子邮箱</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入电子邮箱"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">地址</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="请输入地址"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">资质情况</label>
              <Input
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="请输入资质情况"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">业务范围</label>
              <Input
                value={formData.businessScope}
                onChange={(e) => setFormData({ ...formData, businessScope: e.target.value })}
                placeholder="请输入业务范围"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">机构简介</label>
              <Textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入机构简介"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitCreate}>确定</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑机构</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  机构名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="请输入机构名称"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  机构类型 <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.institutionType}
                  onValueChange={(value) => setFormData({ ...formData, institutionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">高校</SelectItem>
                    <SelectItem value="research_institute">科研院所</SelectItem>
                    <SelectItem value="enterprise">企业</SelectItem>
                    <SelectItem value="government">政府机构</SelectItem>
                    <SelectItem value="ngo">非政府组织</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">统一社会信用代码</label>
                <Input
                  value={formData.creditCode}
                  onChange={(e) => setFormData({ ...formData, creditCode: e.target.value })}
                  placeholder="请输入统一社会信用代码"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">法定代表人</label>
                <Input
                  value={formData.legalPerson}
                  onChange={(e) => setFormData({ ...formData, legalPerson: e.target.value })}
                  placeholder="请输入法定代表人"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">联系人</label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="请输入联系人"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">联系电话</label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="请输入联系电话"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">电子邮箱</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入电子邮箱"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">地址</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="请输入地址"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">资质情况</label>
              <Input
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="请输入资质情况"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">业务范围</label>
              <Input
                value={formData.businessScope}
                onChange={(e) => setFormData({ ...formData, businessScope: e.target.value })}
                placeholder="请输入业务范围"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">机构简介</label>
              <Textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入机构简介"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitEdit}>确定</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
