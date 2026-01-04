"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit } from "lucide-react"

export function SchedulePlan() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">项目实施进度计划</h3>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> 新增
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" /> 批量删除
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Input type="checkbox" className="w-4 h-4" />
              </TableHead>
              <TableHead className="w-[50px]">序号</TableHead>
              <TableHead>项目实施内容</TableHead>
              <TableHead>实施内容负责人</TableHead>
              <TableHead>实施内容联系人</TableHead>
              <TableHead>开始时间</TableHead>
              <TableHead>结束时间</TableHead>
              <TableHead>提交人</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Input type="checkbox" className="w-4 h-4" />
              </TableCell>
              <TableCell>1</TableCell>
              <TableCell>项目数据融合技术研究</TableCell>
              <TableCell>管理员</TableCell>
              <TableCell>陈红</TableCell>
              <TableCell>2025-01-01</TableCell>
              <TableCell>2025-02-01</TableCell>
              <TableCell>李四光</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-1" /> 编辑
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Input type="checkbox" className="w-4 h-4" />
              </TableCell>
              <TableCell>2</TableCell>
              <TableCell>试点关键技术研究</TableCell>
              <TableCell>管理员</TableCell>
              <TableCell>刘鹏</TableCell>
              <TableCell>2025-01-01</TableCell>
              <TableCell>2025-02-01</TableCell>
              <TableCell>陈康</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-1" /> 编辑
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
