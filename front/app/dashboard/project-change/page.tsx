"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ApprovalHistoryDialog } from "@/components/shared/approval-history-dialog"
import { ProgressViewDialog } from "@/components/shared/progress-view-dialog"

export default function ProjectChangePage() {
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState("")

  const changes = [
    {
      id: 1,
      status: "未提交",
      projectNo: "KJ202502001",
      projectName: "****项目数据融合技术研究...",
      changeItem: "计划变更",
      date: "2025-02-02",
      submitter: "李小刚",
    },
    {
      id: 2,
      status: "已提交",
      projectNo: "KJ202502001",
      projectName: "*****试点关键技术研究...",
      changeItem: "任务变更",
      date: "2025-02-02",
      submitter: "李小刚",
    },
    {
      id: 3,
      status: "已审批",
      projectNo: "KJ202502001",
      projectName: "****项目数据融合技术研究...",
      changeItem: "项目经理变更",
      date: "2025-02-02",
      submitter: "李小刚",
    },
  ]

  const approvalSteps = [
    {
      id: 1,
      approver: "张三",
      role: "部门负责人",
      status: "已通过" as const,
      comment: "同意变更",
      time: "2025-02-03 09:30",
    },
    { id: 2, approver: "李四", role: "分管领导", status: "已通过" as const, comment: "同意", time: "2025-02-03 14:20" },
    { id: 3, approver: "王五", role: "主管领导", status: "待审批" as const },
  ]

  const progressSteps = [
    { id: 1, name: "提交申请", status: "已完成" as const, date: "2025-02-02 10:30", description: "李小刚提交变更申请" },
    { id: 2, name: "部门审批", status: "已完成" as const, date: "2025-02-03 09:30", description: "张三审批通过" },
    { id: 3, name: "分管领导审批", status: "进行中" as const, date: "2025-02-03 14:20", description: "李四审批中" },
    { id: 4, name: "主管领导审批", status: "未开始" as const },
    { id: 5, name: "完成", status: "未开始" as const },
  ]

  const handleApprovalHistory = (projectName: string) => {
    setSelectedProject(projectName)
    setApprovalDialogOpen(true)
  }

  const handleProgressView = (projectName: string) => {
    setSelectedProject(projectName)
    setProgressDialogOpen(true)
  }

  const handleSubmit = (id: number) => {
    console.log("[v0] Submitting change:", id)
    // TODO: Implement submit logic
  }

  const handleDelete = (id: number) => {
    console.log("[v0] Deleting change:", id)
    // TODO: Implement delete logic
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[{ label: "首页", href: "/dashboard" }, { label: "项目管理" }, { label: "项目变更" }]} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-4 flex-1">
              <CardTitle>项目变更</CardTitle>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">项目名称:</label>
                  <Input placeholder="请输入内容" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">项目编号:</label>
                  <Input placeholder="请输入内容" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">项目预算:</label>
                  <Input placeholder="请输入内容" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button>查询</Button>
                <Button variant="outline">重置</Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Link href="/dashboard/project-change/edit/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                新增
              </Button>
            </Link>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Edit className="h-4 w-4" />
              修改
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              批量删除
            </Button>
            <span className="text-sm text-muted-foreground ml-2 flex items-center">已选2项</span>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Input type="checkbox" className="h-4 w-4" />
                  </TableHead>
                  <TableHead>流程状态</TableHead>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>变更事项</TableHead>
                  <TableHead>变更发起时间</TableHead>
                  <TableHead>提交人</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changes.map((change) => (
                  <TableRow key={change.id}>
                    <TableCell>
                      <Input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          change.status === "已审批" ? "default" : change.status === "已提交" ? "secondary" : "outline"
                        }
                      >
                        {change.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{change.projectNo}</TableCell>
                    <TableCell className="font-medium">{change.projectName}</TableCell>
                    <TableCell>{change.changeItem}</TableCell>
                    <TableCell>{change.date}</TableCell>
                    <TableCell>{change.submitter}</TableCell>
                    <TableCell>{change.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {change.status === "未提交" && (
                          <>
                            <Link href={`/dashboard/project-change/edit/${change.id}`}>
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                编辑
                              </Button>
                            </Link>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-primary p-0 h-auto"
                              onClick={() => handleSubmit(change.id)}
                            >
                              提交
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-red-500 p-0 h-auto"
                              onClick={() => handleDelete(change.id)}
                            >
                              删除
                            </Button>
                          </>
                        )}
                        {change.status === "已提交" && (
                          <>
                            <Link href={`/dashboard/project-change/${change.id}`}>
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                详情
                              </Button>
                            </Link>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-primary p-0 h-auto"
                              onClick={() => handleProgressView(change.projectName)}
                            >
                              审批进度
                            </Button>
                          </>
                        )}
                        {change.status === "已审批" && (
                          <>
                            <Link href={`/dashboard/project-change/${change.id}`}>
                              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                详情
                              </Button>
                            </Link>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-primary p-0 h-auto"
                              onClick={() => handleApprovalHistory(change.projectName)}
                            >
                              审批历史
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">共101项数据</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">20条/页</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  ...
                </Button>
                <Button variant="outline" size="sm">
                  11
                </Button>
              </div>
              <span className="text-sm">跳至</span>
              <Input className="w-16 h-8" defaultValue="11" />
              <span className="text-sm">/20页</span>
              <Button size="sm">跳转</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ApprovalHistoryDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        projectName={selectedProject}
        steps={approvalSteps}
      />

      <ProgressViewDialog
        open={progressDialogOpen}
        onOpenChange={setProgressDialogOpen}
        projectName={selectedProject}
        steps={progressSteps}
      />
    </div>
  )
}
