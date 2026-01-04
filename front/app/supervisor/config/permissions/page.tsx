"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const modules = [
  {
    id: "project",
    name: "项目管理",
    pages: [
      {
        id: "project-list",
        name: "项目列表",
        buttons: [
          { id: "add", name: "新增项目" },
          { id: "edit", name: "编辑" },
          { id: "delete", name: "删除" },
          { id: "export", name: "导出" },
          { id: "import", name: "导入" },
        ],
      },
      {
        id: "project-detail",
        name: "项目详情",
        buttons: [
          { id: "submit", name: "提交审核" },
          { id: "save", name: "保存" },
          { id: "cancel", name: "取消" },
        ],
      },
      {
        id: "project-approval",
        name: "项目审批",
        buttons: [
          { id: "approve", name: "审批通过" },
          { id: "reject", name: "审批驳回" },
          { id: "return", name: "退回修改" },
        ],
      },
    ],
  },
  {
    id: "achievement",
    name: "成果管理",
    pages: [
      {
        id: "achievement-list",
        name: "成果列表",
        buttons: [
          { id: "add", name: "新增成果" },
          { id: "edit", name: "编辑" },
          { id: "delete", name: "删除" },
          { id: "export", name: "导出" },
        ],
      },
      {
        id: "achievement-review",
        name: "成果审核",
        buttons: [
          { id: "approve", name: "审核通过" },
          { id: "reject", name: "审核不通过" },
        ],
      },
    ],
  },
  {
    id: "system",
    name: "系统管理",
    pages: [
      {
        id: "user-list",
        name: "用户管理",
        buttons: [
          { id: "add", name: "新增用户" },
          { id: "edit", name: "编辑" },
          { id: "delete", name: "删除" },
          { id: "reset-pwd", name: "重置密码" },
        ],
      },
      {
        id: "role-list",
        name: "角色管理",
        buttons: [
          { id: "add", name: "新增角色" },
          { id: "edit", name: "编辑" },
          { id: "delete", name: "删除" },
          { id: "set-permissions", name: "配置权限" },
        ],
      },
    ],
  },
]

const roles = [
  { id: "1", name: "系统管理员", code: "ADMIN" },
  { id: "2", name: "处室管理员", code: "DEPT_MGR" },
  { id: "3", name: "项目管理员", code: "PROJECT_MGR" },
  { id: "4", name: "评审专家", code: "EXPERT" },
  { id: "5", name: "机构用户", code: "INSTITUTION" },
]

export default function PermissionsManagementPage() {
  const [selectedRole, setSelectedRole] = useState("1")
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  const togglePermission = (key: string) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePage = (moduleId: string, pageId: string, checked: boolean) => {
    const page = modules.find((m) => m.id === moduleId)?.pages.find((p) => p.id === pageId)
    if (!page) return

    const newPermissions = { ...permissions }
    page.buttons.forEach((button) => {
      newPermissions[`${pageId}-${button.id}`] = checked
    })
    setPermissions(newPermissions)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">权限管理</h1>
          <p className="text-sm text-muted-foreground mt-1">配置角色的页面和按钮级权限</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          保存权限
        </Button>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-6">
        {/* Roles List */}
        <Card>
          <CardHeader>
            <CardTitle>角色列表</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 p-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedRole === role.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                >
                  <div className="font-medium">{role.name}</div>
                  <div className="text-xs opacity-70">{role.code}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>权限配置</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  当前角色：{roles.find((r) => r.id === selectedRole)?.name}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{module.name}</h3>
                    <Badge variant="secondary">{module.pages.length} 个页面</Badge>
                  </div>
                  {module.pages.map((page) => {
                    const allChecked = page.buttons.every((btn) => permissions[`${page.id}-${btn.id}`])
                    const someChecked = page.buttons.some((btn) => permissions[`${page.id}-${btn.id}`])

                    return (
                      <div key={page.id} className="ml-4 space-y-2">
                        <div className="flex items-center space-x-2 border-b pb-2">
                          <Checkbox
                            id={page.id}
                            checked={allChecked}
                            onCheckedChange={(checked) => togglePage(module.id, page.id, checked as boolean)}
                          />
                          <Label htmlFor={page.id} className="font-medium cursor-pointer">
                            {page.name}
                          </Label>
                          {someChecked && !allChecked && (
                            <Badge variant="outline" className="text-xs">
                              部分
                            </Badge>
                          )}
                        </div>
                        <div className="ml-6 grid grid-cols-3 gap-2">
                          {page.buttons.map((button) => {
                            const key = `${page.id}-${button.id}`
                            return (
                              <div key={button.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={key}
                                  checked={permissions[key] || false}
                                  onCheckedChange={() => togglePermission(key)}
                                />
                                <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                                  {button.name}
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
