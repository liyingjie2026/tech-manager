"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, KeyRound, Power, PowerOff } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { INSTITUTION_ROLES, ROLE_CONFIG } from "@/lib/constants/institution-roles"
import { userApi } from "@/lib/api/user"
import { getStatusText } from "@/lib/utils/status-maps"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function InstitutionUsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadUsers()
  }, [currentPage, pageSize])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await userApi.getList({ pageNum: currentPage, pageSize })
      if (response.data) {
        setUsers(response.data.list || [])
        setTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
      toast({
        title: "加载失败",
        description: "无法加载用户列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("确定要删除此用户吗？")) {
      try {
        await userApi.delete(userId)
        setUsers(users.filter((u) => u.id !== userId))
        toast({ title: "删除成功", description: "用户已被删除" })
      } catch (error) {
        toast({ title: "删除失败", variant: "destructive" })
      }
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const statusValue = currentStatus === "active" || currentStatus === "1" ? "0" : "1"
    const newStatus = statusValue === "1" ? "active" : "inactive"

    try {
      await userApi.updateStatus(userId, statusValue)
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: statusValue } : u)))
      toast({
        title: statusValue === "1" ? "已启用" : "已停用",
        description: `用户已${statusValue === "1" ? "启用" : "停用"}`,
      })
    } catch (error) {
      toast({ title: "操作失败", variant: "destructive" })
    }
  }

  const handleResetPassword = async (userId: string) => {
    if (confirm("确定要重置此用户的密码吗？")) {
      try {
        await userApi.resetPassword(userId)
        toast({ title: "重置成功", description: "新密码已发送至用户邮箱" })
      } catch (error) {
        toast({ title: "重置失败", variant: "destructive" })
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理本机构的用户账号</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateUser}>
              <Plus className="mr-2 h-4 w-4" />
              新增用户
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "编辑用户" : "新增用户"}</DialogTitle>
              <DialogDescription>{editingUser ? "修改用户信息" : "创建新的机构用户账号"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input id="username" placeholder="请输入用户名" defaultValue={editingUser?.username} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="realName">姓名</Label>
                <Input id="realName" placeholder="请输入姓名" defaultValue={editingUser?.realName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input id="phone" placeholder="请输入手机号" defaultValue={editingUser?.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" type="email" placeholder="请输入邮箱" defaultValue={editingUser?.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select defaultValue={editingUser?.role || INSTITUTION_ROLES.PROJECT_LEADER}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={INSTITUTION_ROLES.PROJECT_LEADER}>
                      {ROLE_CONFIG[INSTITUTION_ROLES.PROJECT_LEADER].name}
                    </SelectItem>
                    <SelectItem value={INSTITUTION_ROLES.ADMIN}>{ROLE_CONFIG[INSTITUTION_ROLES.ADMIN].name}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {editingUser?.role
                    ? ROLE_CONFIG[editingUser.role as keyof typeof ROLE_CONFIG]?.description
                    : ROLE_CONFIG[INSTITUTION_ROLES.PROJECT_LEADER].description}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、姓名或手机号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
              />
            </div>
            <Select>
              <SelectTrigger className="w-40" style={{ height: UI_CONSTANTS.SELECT_HEIGHT }}>
                <SelectValue placeholder="角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value={INSTITUTION_ROLES.PROJECT_LEADER}>项目负责人</SelectItem>
                <SelectItem value={INSTITUTION_ROLES.ADMIN}>机构管理员</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40" style={{ height: UI_CONSTANTS.SELECT_HEIGHT }}>
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无用户数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>手机号</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>项目数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>最后登录</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono">{user.username}</TableCell>
                    <TableCell className="font-medium">{user.realName}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ROLE_CONFIG[user.role].name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.projectCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "1" || user.status === "active" ? "default" : "secondary"}>
                        {getStatusText(user.status, "user")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleResetPassword(user.id)}>
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user.id, user.status)}>
                          {user.status === "1" || user.status === "active" ? (
                            <PowerOff className="h-4 w-4 text-orange-600" />
                          ) : (
                            <Power className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
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
    </div>
  )
}
