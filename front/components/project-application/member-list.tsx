"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Upload, Download } from "lucide-react"

export function MemberList() {
  const [members, setMembers] = useState([
    {
      id: 1,
      type: "项目负责人",
      name: "管理员",
      gender: "男",
      birth: "1980-01-01",
      idType: "居民身份证",
      idNumber: "430101198001011234",
      ethnicity: "汉族",
      address: "湖南省长沙市天心区芙蓉南路",
      title: "高级工程师",
      major: "测绘",
    },
    {
      id: 2,
      type: "项目负责人",
      name: "陈丽芳",
      gender: "女",
      birth: "1980-01-01",
      idType: "居民身份证",
      idNumber: "430101198001011234",
      ethnicity: "苗族",
      address: "湖南省长沙市天心区芙蓉南路",
      title: "中级工程师",
      major: "测绘",
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)

  const openEditDialog = (member?: any) => {
    setEditingMember(member || null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => openEditDialog()}>
              <Plus className="h-4 w-4" />
              新增
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? "编辑成员" : "新增成员"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>成员类型 *</Label>
                <Select defaultValue={editingMember?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="项目负责人">项目负责人</SelectItem>
                    <SelectItem value="主要研究人员">主要研究人员</SelectItem>
                    <SelectItem value="参与人员">参与人员</SelectItem>
                    <SelectItem value="项目联系人">项目联系人</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>姓名 *</Label>
                <Input defaultValue={editingMember?.name} placeholder="请输入" />
              </div>
              <div className="space-y-2">
                <Label>性别 *</Label>
                <Select defaultValue={editingMember?.gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="男">男</SelectItem>
                    <SelectItem value="女">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>出生年月 *</Label>
                <Input type="date" defaultValue={editingMember?.birth} />
              </div>
              <div className="space-y-2">
                <Label>证件类型 *</Label>
                <Select defaultValue={editingMember?.idType}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="居民身份证">居民身份证</SelectItem>
                    <SelectItem value="护照">护照</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>证件号码 *</Label>
                <Input defaultValue={editingMember?.idNumber} placeholder="请输入" />
              </div>
              <div className="space-y-2">
                <Label>民族 *</Label>
                <Select defaultValue={editingMember?.ethnicity}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="汉族">汉族</SelectItem>
                    <SelectItem value="苗族">苗族</SelectItem>
                    <SelectItem value="回族">回族</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>身份证地址 *</Label>
                <Input defaultValue={editingMember?.address} placeholder="请输入" />
              </div>
              <div className="space-y-2">
                <Label>职称 *</Label>
                <Select defaultValue={editingMember?.title}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="高级工程师">高级工程师</SelectItem>
                    <SelectItem value="中级工程师">中级工程师</SelectItem>
                    <SelectItem value="技术员">技术员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>从事专业 *</Label>
                <Input defaultValue={editingMember?.major} placeholder="请输入" />
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

        <Button variant="outline" className="gap-2 bg-transparent">
          <Trash2 className="h-4 w-4" />
          批量删除
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          导入
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          下载模板
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">序号</TableHead>
              <TableHead>成员类型</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>性别</TableHead>
              <TableHead>出生年月</TableHead>
              <TableHead>证件类型</TableHead>
              <TableHead>证件号码</TableHead>
              <TableHead>民族</TableHead>
              <TableHead>身份证地址</TableHead>
              <TableHead>职称</TableHead>
              <TableHead>从事专业</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={member.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{member.type}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.gender}</TableCell>
                <TableCell>{member.birth}</TableCell>
                <TableCell>{member.idType}</TableCell>
                <TableCell>{member.idNumber}</TableCell>
                <TableCell>{member.ethnicity}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={member.address}>
                  {member.address}
                </TableCell>
                <TableCell>{member.title}</TableCell>
                <TableCell>{member.major}</TableCell>
                <TableCell>
                  <Button variant="link" size="sm" className="text-primary" onClick={() => openEditDialog(member)}>
                    编辑详情
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
