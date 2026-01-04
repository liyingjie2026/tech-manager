"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Project } from "@/lib/types"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
  mode: "create" | "edit" | "view"
  onSubmit?: (data: Partial<Project>) => void
}

export function ProjectDialog({ open, onOpenChange, project, mode, onSubmit }: ProjectDialogProps) {
  const [formData, setFormData] = useState<Partial<Project>>(
    project || {
      name: "",
      type: "",
      field: "",
      institution: "",
      leader: "",
      budget: 0,
      duration: "",
      description: "",
    },
  )

  const handleSubmit = () => {
    onSubmit?.(formData)
    onOpenChange(false)
  }

  const isViewMode = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "新建项目" : mode === "edit" ? "编辑项目" : "项目详情"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>项目名称 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isViewMode}
                placeholder="请输入项目名称"
              />
            </div>

            <div className="space-y-2">
              <Label>项目类型 *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="重点研发">重点研发</SelectItem>
                  <SelectItem value="科技攻关">科技攻关</SelectItem>
                  <SelectItem value="基础研究">基础研究</SelectItem>
                  <SelectItem value="应用示范">应用示范</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>研究领域 *</Label>
              <Select
                value={formData.field}
                onValueChange={(value) => setFormData({ ...formData, field: value })}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="计算机科学">计算机科学</SelectItem>
                  <SelectItem value="生物医药">生物医药</SelectItem>
                  <SelectItem value="新材料">新材料</SelectItem>
                  <SelectItem value="新能源">新能源</SelectItem>
                  <SelectItem value="智能制造">智能制造</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>申报单位 *</Label>
              <Input
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                disabled={isViewMode}
                placeholder="请输入单位名称"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>项目负责人 *</Label>
              <Input
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                disabled={isViewMode}
                placeholder="请输入负责人姓名"
              />
            </div>

            <div className="space-y-2">
              <Label>项目周期 *</Label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                disabled={isViewMode}
                placeholder="如：36个月"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>项目预算（元）*</Label>
            <Input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              disabled={isViewMode}
              placeholder="请输入预算金额"
            />
          </div>

          <div className="space-y-2">
            <Label>项目简介 *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isViewMode}
              placeholder="请输入项目简介"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isViewMode ? "关闭" : "取消"}
          </Button>
          {!isViewMode && <Button onClick={handleSubmit}>{mode === "create" ? "创建" : "保存"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
