"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Search } from "lucide-react"
import { userApi } from "@/lib/api"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Personnel {
  id: string
  name: string
  username: string
  userId: string
  loginAccount: string
  organization: string
  phone: string
  creator: string
  isEnabled: boolean
}

export default function PersonnelManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null)
  const [loading, setLoading] = useState(true)
  const [personnel, setPersonnel] = useState<Personnel[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        setLoading(true)
        const response = await userApi.getList({ page: currentPage, size: pageSize })
        setPersonnel(response.data.items || [])
        setTotal(response.data.total || 0)
      } catch (error) {
        console.error("Failed to load personnel:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPersonnel()
  }, [currentPage, pageSize])

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    loginAccount: "",
    organization: "",
    phone: "",
    isEnabled: true,
  })

  const filteredPersonnel = personnel.filter(
    (p) => p.name.includes(searchTerm) || p.loginAccount.includes(searchTerm) || p.phone.includes(searchTerm),
  )

  const handleEdit = (person: Personnel) => {
    setEditingPersonnel(person)
    setFormData({
      name: person.name,
      username: person.username,
      loginAccount: person.loginAccount,
      organization: person.organization,
      phone: person.phone,
      isEnabled: person.isEnabled,
    })
    setShowDialog(true)
  }

  const handleAdd = () => {
    setEditingPersonnel(null)
    setFormData({
      name: "",
      username: "",
      loginAccount: "",
      organization: "",
      phone: "",
      isEnabled: true,
    })
    setShowDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingPersonnel) {
        await userApi.update(editingPersonnel.id, formData)
      } else {
        await userApi.create(formData)
      }
      const response = await userApi.getList({ page: currentPage, size: pageSize })
      setPersonnel(response.data.items || [])
      setShowDialog(false)
    } catch (error) {
      console.error("Failed to save personnel:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除该人员吗？")) {
      try {
        await userApi.delete(id)
        setPersonnel(personnel.filter((p) => p.id !== id))
      } catch (error) {
        console.error("Failed to delete personnel:", error)
      }
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const person = personnel.find((p) => p.id === id)
      if (person?.isEnabled) {
        await userApi.disable(id)
      } else {
        await userApi.enable(id)
      }
      setPersonnel(personnel.map((p) => (p.id === id ? { ...p, isEnabled: !p.isEnabled } : p)))
    } catch (error) {
      console.error("Failed to toggle status:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">人员管理</h1>
        <Button onClick={handleAdd}>
          <UserPlus className="mr-2 h-4 w-4" />
          新增人员
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索姓名、登录账号或手机号"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>用户编号</TableHead>
                <TableHead>登录账号</TableHead>
                <TableHead>所属单位</TableHead>
                <TableHead>手机号码</TableHead>
                <TableHead>创建人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonnel.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.userId}</TableCell>
                  <TableCell>{person.loginAccount}</TableCell>
                  <TableCell>{person.organization}</TableCell>
                  <TableCell>{person.phone}</TableCell>
                  <TableCell>{person.creator}</TableCell>
                  <TableCell>
                    <Badge variant={person.isEnabled ? "default" : "secondary"}>
                      {person.isEnabled ? "启用" : "停用"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="link" className="p-0 h-auto" onClick={() => handleEdit(person)}>
                        编辑
                      </Button>
                      <Button variant="link" className="p-0 h-auto" onClick={() => handleToggleStatus(person.id)}>
                        {person.isEnabled ? "停用" : "启用"}
                      </Button>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-red-600"
                        onClick={() => handleDelete(person.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPersonnel ? "编辑人员" : "新增人员"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">用户姓名</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="请输入用户姓名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">用户编号</Label>
              <Input id="userId" value={editingPersonnel?.userId || "编码自动生成"} disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loginAccount">登录账号</Label>
              <Input
                id="loginAccount"
                value={formData.loginAccount}
                onChange={(e) => setFormData({ ...formData, loginAccount: e.target.value })}
                placeholder="请输入登录账号"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">所属单位</Label>
              <Select
                value={formData.organization}
                onValueChange={(value) => setFormData({ ...formData, organization: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择所属单位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="湖南省第三测绘院">湖南省第三测绘院</SelectItem>
                  <SelectItem value="湖南省地质研究所">湖南省地质研究所</SelectItem>
                  <SelectItem value="长沙市规划设计院">长沙市规划设计院</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">手机号码</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入手机号码"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creator">创建人</Label>
              <Input
                id="creator"
                value={editingPersonnel?.creator || "自动填入创建人"}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>是否启用</Label>
              <RadioGroup
                value={formData.isEnabled ? "enabled" : "disabled"}
                onValueChange={(value) => setFormData({ ...formData, isEnabled: value === "enabled" })}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="disabled" id="disabled" />
                    <Label htmlFor="disabled" className="font-normal">
                      不启用
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enabled" id="enabled" />
                    <Label htmlFor="enabled" className="font-normal">
                      启用
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
