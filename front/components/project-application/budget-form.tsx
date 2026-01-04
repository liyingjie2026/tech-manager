"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Upload, Download, Edit } from "lucide-react"

export function BudgetForm() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">项目经费预算</h3>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> 新增
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" /> 批量删除
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" /> 导入
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> 下载模板
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
              <TableHead>预算科目名称</TableHead>
              <TableHead>合计(万元)</TableHead>
              <TableHead>省财政专项经费(万元)</TableHead>
              <TableHead>自筹/其他经费(万元)</TableHead>
              <TableHead>提交人</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Input type="checkbox" className="w-4 h-4" />
              </TableCell>
              <TableCell>经费支出方向</TableCell>
              <TableCell>20.00</TableCell>
              <TableCell>20.00</TableCell>
              <TableCell>10.00</TableCell>
              <TableCell>陈红</TableCell>
              <TableCell>2025-02-01</TableCell>
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
              <TableCell>直接费用</TableCell>
              <TableCell>10.00</TableCell>
              <TableCell>10.00</TableCell>
              <TableCell>10.00</TableCell>
              <TableCell>刘鹏</TableCell>
              <TableCell>2025-02-01</TableCell>
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
              <TableCell>设备费</TableCell>
              <TableCell>30.00</TableCell>
              <TableCell>30.00</TableCell>
              <TableCell>10.00</TableCell>
              <TableCell>张凯峰</TableCell>
              <TableCell>2025-02-01</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-1" /> 编辑
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="bg-muted/50 font-medium">
              <TableCell></TableCell>
              <TableCell>合计</TableCell>
              <TableCell>60.00</TableCell>
              <TableCell>60.00</TableCell>
              <TableCell>30.00</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
