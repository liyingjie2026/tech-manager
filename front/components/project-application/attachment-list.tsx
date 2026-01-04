"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, FileText, Eye } from "lucide-react"

export function AttachmentList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">附件列表</h3>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> 上传附件
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
              <TableHead>文件名称</TableHead>
              <TableHead>文件类型</TableHead>
              <TableHead>提交人</TableHead>
              <TableHead>提交时间</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Input type="checkbox" className="w-4 h-4" />
              </TableCell>
              <TableCell>1</TableCell>
              <TableCell className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                项目数据融合技术研究.docx
              </TableCell>
              <TableCell>docx</TableCell>
              <TableCell>陈红</TableCell>
              <TableCell>2025-01-01</TableCell>
              <TableCell>2025-02-01</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" /> 详情
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Input type="checkbox" className="w-4 h-4" />
              </TableCell>
              <TableCell>2</TableCell>
              <TableCell className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-500" />
                项目演示文稿.ppt
              </TableCell>
              <TableCell>ppt</TableCell>
              <TableCell>刘鹏</TableCell>
              <TableCell>2025-01-01</TableCell>
              <TableCell>2025-02-01</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" /> 详情
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Input type="checkbox" className="w-4 h-4" />
              </TableCell>
              <TableCell>3</TableCell>
              <TableCell className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-500" />
                数据统计表.xlsx
              </TableCell>
              <TableCell>xlsx</TableCell>
              <TableCell>张凯峰</TableCell>
              <TableCell>2025-01-01</TableCell>
              <TableCell>2025-02-01</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" /> 详情
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
