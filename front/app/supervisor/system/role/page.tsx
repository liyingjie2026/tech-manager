"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roles = [
  {
    id: "1",
    code: "ADMIN",
    name: "系统管理员",
    description: "拥有系统所有权限",
    status: "启用",
    createTime: "2024-01-01",
  },
  {
    id: "2",
    code: "DEPT_MGR",
    name: "处室管理员",
    description: "负责项目审核和管理",
    status: "启用",
    createTime: "2024-01-02",
  },
  {
    id: "3",
    code: "PROJECT_MGR",
    name: "项目管理员",
    description: "负责项目日常管理",
    status: "启用",
    createTime: "2024-01-03",
  },
  { id: "4", code: "EXPERT", name: "评审专家", description: "负责项目评审", status: "启用", createTime: "2024-01-04" },
  {
    id: "5",
    code: "INSTITUTION",
    name: "机构用户",
    description: "科研机构管理员",
    status: "启用",
    createTime: "2024-01-05",
  },
]

const permissions = [
  { id: "1", name: "项目管理", children: ["项目申报", "项目审核", "项目变更", "项目验收"] },
  { id: "2", name: "成果管理", children: ["成果审核", "成果鉴定", "成果发布"] },
  { id: "3", name: "系统管理", children: ["用户管理", "角色管理", "机构管理", "权限管理"] },
  { id: "4", name: "数据统计", children: ["项目统计", "成果统计", "资源统计"] },
]

export default function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total] = useState(roles.length)

  const paginatedRoles = roles.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">角色管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理系统角色和权限配置</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新增角色
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增角色</DialogTitle>
              <DialogDescription>创建新的系统角色并配置相应权限</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">角色编码</Label>
                <Input id="code" placeholder="系统自动生成" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">角色名称</Label>
                <Input id="name" placeholder="请输入角色名称" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">角色描述</Label>
                <Textarea id="description" placeholder="请输入角色描述" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>权限配置</Label>
                <div className="border rounded-lg p-4 space-y-4">
                  {permissions.map((group) => (
                    <div key={group.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id={group.id} />
                        <Label htmlFor={group.id} className="font-medium">
                          {group.name}
                        </Label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {group.children.map((child, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`${group.id}-${index}`} />
                            <Label htmlFor={`${group.id}-${index}`} className="text-sm font-normal">
                              {child}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
                placeholder="搜索角色名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${UI_CONSTANTS.INPUT_HEIGHT}`}
              />
            </div>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
              搜索
            </Button>
            <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>角色列表 (共 {total} 条)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>角色编码</TableHead>
                <TableHead>角色名称</TableHead>
                <TableHead>角色描述</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-mono">{role.code}</TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-muted-foreground">{role.description}</TableCell>
                  <TableCell>
                    <Badge variant={role.status === "启用" ? "default" : "secondary"}>{role.status}</Badge>
                  </TableCell>
                  <TableCell>{role.createTime}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
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
    </div>
  )
}
