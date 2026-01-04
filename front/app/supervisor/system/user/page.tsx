"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, KeyRound } from "lucide-react"
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
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

const users = [
  {
    id: "1",
    username: "admin",
    name: "系统管理员",
    phone: "13800138000",
    role: "系统管理员",
    status: "启用",
    lastLogin: "2025-01-15 10:30",
  },
  {
    id: "2",
    username: "dept01",
    name: "张三",
    phone: "13800138001",
    role: "处室管理员",
    status: "启用",
    lastLogin: "2025-01-15 09:20",
  },
  {
    id: "3",
    username: "expert01",
    name: "李四",
    phone: "13800138002",
    role: "评审专家",
    status: "启用",
    lastLogin: "2025-01-14 14:30",
  },
  {
    id: "4",
    username: "inst01",
    name: "王五",
    phone: "13800138003",
    role: "机构用户",
    status: "启用",
    lastLogin: "2025-01-14 11:20",
  },
  {
    id: "5",
    username: "test01",
    name: "测试用户",
    phone: "13800138004",
    role: "项目管理员",
    status: "停用",
    lastLogin: "2025-01-10 16:00",
  },
]

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total] = useState(users.length)

  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">用户管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理系统用户账号和权限</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新增用户
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增用户</DialogTitle>
              <DialogDescription>创建新的系统用户账号</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input id="username" placeholder="请输入用户名" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input id="name" placeholder="请输入姓名" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input id="phone" placeholder="请输入手机号" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" type="email" placeholder="请输入邮箱" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">系统管理员</SelectItem>
                    <SelectItem value="dept">处室管理员</SelectItem>
                    <SelectItem value="project">项目管理员</SelectItem>
                    <SelectItem value="expert">评审专家</SelectItem>
                    <SelectItem value="institution">机构用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">初始密码</Label>
                <Input id="password" type="password" placeholder="系统自动生成" disabled />
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、姓名或手机号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${UI_CONSTANTS.INPUT_HEIGHT}`}
              />
            </div>
            <Select>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.SELECT_HEIGHT}`}>
                <SelectValue placeholder="角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value="admin">系统管理员</SelectItem>
                <SelectItem value="dept">处室管理员</SelectItem>
                <SelectItem value="expert">评审专家</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className={`w-40 ${UI_CONSTANTS.SELECT_HEIGHT}`}>
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
              搜索
            </Button>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表 (共 {total} 条)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户名</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>最后登录</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono">{user.username}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "启用" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {total > 0 && (
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

      {/* ... existing dialogs ... */}
    </div>
  )
}
