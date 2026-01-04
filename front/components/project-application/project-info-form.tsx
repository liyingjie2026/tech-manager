"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

export function ProjectInfoForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="after:content-['*'] after:text-destructive after:ml-0.5">项目名称</Label>
        <Input defaultValue="项目数据融合技术研究" />
      </div>

      <div className="space-y-2">
        <Label className="after:content-['*'] after:text-destructive after:ml-0.5">项目类型</Label>
        <Select defaultValue="innovation">
          <SelectTrigger>
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="innovation">自然资源科研创新及标准化</SelectItem>
            <SelectItem value="other">其他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="after:content-['*'] after:text-destructive after:ml-0.5">申请类型</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="type1">类型1</SelectItem>
            <SelectItem value="type2">类型2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>项目预算(万元)</Label>
        <Input placeholder="请输入内容" />
      </div>

      <div className="space-y-2">
        <Label className="after:content-['*'] after:text-destructive after:ml-0.5">项目性质</Label>
        <Input defaultValue="科研类" disabled />
      </div>

      <div className="space-y-2">
        <Label className="after:content-['*'] after:text-destructive after:ml-0.5">项目类型(科研类)</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="type1">基础研究</SelectItem>
            <SelectItem value="type2">应用研究</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>项目开始时间</Label>
        <DatePicker />
      </div>

      <div className="space-y-2">
        <Label>项目截止时间</Label>
        <DatePicker />
      </div>

      <div className="space-y-2">
        <Label>申请专项经费(万元)</Label>
        <Input placeholder="请输入" />
      </div>

      <div className="space-y-2">
        <Label>自筹/其他资金(万元)</Label>
        <Input placeholder="请输入" />
      </div>

      <div className="col-span-full space-y-2">
        <Label>项目目的和意义 (限300字)</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">1.项目提出背景与意义</Label>
            <Textarea placeholder="请输入" className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">2.国内外发展现状与趋势</Label>
            <Textarea placeholder="请输入" className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">3.项目拟重点解决的问题</Label>
            <Textarea placeholder="请输入" className="min-h-[100px]" />
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">0/300</div>
      </div>

      <div className="col-span-full space-y-2">
        <Label>项目主要研究内容 (限800字)</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">1.关键研究内容</Label>
            <Textarea placeholder="请输入" className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">2.关键技术和创新点</Label>
            <Textarea placeholder="请输入" className="min-h-[100px]" />
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">0/800</div>
      </div>

      <div className="col-span-full space-y-2">
        <Label>现有工作基础与优势 (限800字)</Label>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">项目申报单位及主要参与单位研发基础及条件</Label>
          <Textarea placeholder="请输入" className="min-h-[100px]" />
        </div>
        <div className="text-right text-xs text-muted-foreground">0/800</div>
      </div>

      <div className="col-span-full space-y-2">
        <Label>项目的组织实施与保障措施 (限500字)</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">1.组织管理措施</Label>
            <Textarea placeholder="请输入" className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              2.进度安排(分年度列出项目实施进度安排,主要工作内容和主要目标)
            </Label>
            <Textarea placeholder="请输入" className="min-h-[100px]" />
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">0/500</div>
      </div>
    </div>
  )
}
