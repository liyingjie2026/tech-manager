"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit, Upload, Download } from "lucide-react"

export function UnitInfoForm() {
  const [units, setUnits] = useState([
    {
      id: 1,
      name: "湖南省第三测绘院",
      nature: "事业单位",
      code: "12430000444888888X",
      contact: "张三",
      phone: "13800138000",
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">参与单位信息</h3>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> 新增
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增参与单位</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">单位名称</Label>
                  <Input className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">单位性质</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">事业单位</SelectItem>
                      <SelectItem value="2">企业</SelectItem>
                      <SelectItem value="3">高校</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">统一社会信用代码</Label>
                  <Input className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">联系人</Label>
                  <Input className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">联系电话</Label>
                  <Input className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Trash2 className="mr-2 h-4 w-4" /> 批量删除
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> 导入
          </Button>
          <Button variant="outline">
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
              <TableHead>单位名称</TableHead>
              <TableHead>单位性质</TableHead>
              <TableHead>统一社会信用代码</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>
                  <Input type="checkbox" className="w-4 h-4" />
                </TableCell>
                <TableCell>{unit.name}</TableCell>
                <TableCell>{unit.nature}</TableCell>
                <TableCell>{unit.code}</TableCell>
                <TableCell>{unit.contact}</TableCell>
                <TableCell>{unit.phone}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> 编辑
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
