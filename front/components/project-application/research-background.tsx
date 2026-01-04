"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Upload, Download, Edit } from "lucide-react"

export function ResearchBackground() {
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [paperDialogOpen, setPaperDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [editingPaper, setEditingPaper] = useState<any>(null)

  const openProjectDialog = (project?: any) => {
    setEditingProject(project || null)
    setProjectDialogOpen(true)
  }

  const openPaperDialog = (paper?: any) => {
    setEditingPaper(paper || null)
    setPaperDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Representative Projects */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium border-l-4 border-primary pl-2">
            项目负责人及团队最近承担的代表性科研项目
          </h3>
          <div className="flex gap-2">
            <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => openProjectDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> 新增
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProject ? "编辑代表性项目" : "新增代表性项目"}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>项目编号 *</Label>
                    <Input defaultValue={editingProject?.code} placeholder="请输入项目编号" />
                  </div>
                  <div className="space-y-2">
                    <Label>项目负责人 *</Label>
                    <Input defaultValue={editingProject?.leader} placeholder="请输入负责人姓名" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>项目名称 *</Label>
                    <Input defaultValue={editingProject?.name} placeholder="请输入项目名称" />
                  </div>
                  <div className="space-y-2">
                    <Label>项目性质 *</Label>
                    <Select defaultValue={editingProject?.nature}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="计划下达类">计划下达类</SelectItem>
                        <SelectItem value="服务购买类">服务购买类</SelectItem>
                        <SelectItem value="科研类">科研类</SelectItem>
                        <SelectItem value="信息化类">信息化类</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>项目类型 *</Label>
                    <Select defaultValue={editingProject?.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="科技项目">科技项目</SelectItem>
                        <SelectItem value="基础研究">基础研究</SelectItem>
                        <SelectItem value="应用研究">应用研究</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>项目开始时间 *</Label>
                    <Input type="date" defaultValue={editingProject?.startDate} />
                  </div>
                  <div className="space-y-2">
                    <Label>项目结束时间 *</Label>
                    <Input type="date" defaultValue={editingProject?.endDate} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>项目经费预算(万元) *</Label>
                    <Input type="number" defaultValue={editingProject?.budget} placeholder="请输入经费" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => setProjectDialogOpen(false)}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
                <TableHead>项目编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>项目负责人</TableHead>
                <TableHead>项目性质</TableHead>
                <TableHead>项目类型</TableHead>
                <TableHead>起止时间</TableHead>
                <TableHead>经费(万元)</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input type="checkbox" className="w-4 h-4" />
                </TableCell>
                <TableCell>KJ202502001</TableCell>
                <TableCell>项目数据融合技术研究</TableCell>
                <TableCell>管理员</TableCell>
                <TableCell>计划下达类</TableCell>
                <TableCell>科技项目</TableCell>
                <TableCell>2025-02-01 ~ 2025-02-28</TableCell>
                <TableCell>100.00</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      openProjectDialog({
                        code: "KJ202502001",
                        name: "项目数据融合技术研究",
                        leader: "管理员",
                        nature: "计划下达类",
                        type: "科技项目",
                        startDate: "2025-02-01",
                        endDate: "2025-02-28",
                        budget: 100,
                      })
                    }
                  >
                    <Edit className="h-4 w-4 mr-1" /> 编辑
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Input type="checkbox" className="w-4 h-4" />
                </TableCell>
                <TableCell>KJ202502002</TableCell>
                <TableCell>试点关键技术研究</TableCell>
                <TableCell>陈丽芳</TableCell>
                <TableCell>服务购买类</TableCell>
                <TableCell>科技项目</TableCell>
                <TableCell>2025-02-01 ~ 2025-02-28</TableCell>
                <TableCell>32.00</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => openProjectDialog()}>
                    <Edit className="h-4 w-4 mr-1" /> 编辑
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Section 2: Representative Papers/Patents */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium border-l-4 border-primary pl-2">
            项目负责人及团队在相关方向的代表性论文或专利
          </h3>
          <div className="flex gap-2">
            <Dialog open={paperDialogOpen} onOpenChange={setPaperDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => openPaperDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> 新增
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPaper ? "编辑论文/专利" : "新增论文/专利"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>发表时间 *</Label>
                    <Input type="date" defaultValue={editingPaper?.publishDate} />
                  </div>
                  <div className="space-y-2">
                    <Label>著作名称 *</Label>
                    <Input defaultValue={editingPaper?.title} placeholder="请输入著作名称" />
                  </div>
                  <div className="space-y-2">
                    <Label>出版杂志名称 *</Label>
                    <Input defaultValue={editingPaper?.journal} placeholder="请输入杂志名称" />
                  </div>
                  <div className="space-y-2">
                    <Label>作者排名 *</Label>
                    <Input type="number" defaultValue={editingPaper?.authorRank} placeholder="请输入排名" />
                  </div>
                  <div className="space-y-2">
                    <Label>备注</Label>
                    <Textarea defaultValue={editingPaper?.remark} placeholder="请输入备注信息" rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPaperDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => setPaperDialogOpen(false)}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
                <TableHead>发表时间</TableHead>
                <TableHead>著作名称</TableHead>
                <TableHead>出版杂志名称</TableHead>
                <TableHead>作者排名</TableHead>
                <TableHead>备注</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input type="checkbox" className="w-4 h-4" />
                </TableCell>
                <TableCell>2025-02-01</TableCell>
                <TableCell>科技创新项目风险监管与调控的研究</TableCell>
                <TableCell>科技管理研究</TableCell>
                <TableCell>1</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      openPaperDialog({
                        publishDate: "2025-02-01",
                        title: "科技创新项目风险监管与调控的研究",
                        journal: "科技管理研究",
                        authorRank: 1,
                        remark: "-",
                      })
                    }
                  >
                    <Edit className="h-4 w-4 mr-1" /> 编辑
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Input type="checkbox" className="w-4 h-4" />
                </TableCell>
                <TableCell>2025-02-01</TableCell>
                <TableCell>环保企业正逐渐成为环保科技创新主体</TableCell>
                <TableCell>环境科学</TableCell>
                <TableCell>2</TableCell>
                <TableCell>获奖论文</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => openPaperDialog()}>
                    <Edit className="h-4 w-4 mr-1" /> 编辑
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
