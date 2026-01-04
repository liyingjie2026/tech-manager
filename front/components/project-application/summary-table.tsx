"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function SummaryTable() {
  const [formData, setFormData] = useState({
    purpose: "",
    problem: "",
    content: "",
    schedule: "",
  })

  const handleTextChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Project Name */}
      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <Label className="text-right font-medium text-gray-700">项目名称：</Label>
        <Input value="项目数据融合技术研究" disabled className="bg-gray-50" />
      </div>

      {/* Support Direction */}
      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <Label className="text-right font-medium text-gray-700">支持方向：</Label>
        <Select>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="direction1">方向一</SelectItem>
            <SelectItem value="direction2">方向二</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Support Direction Description */}
      <div className="grid grid-cols-[140px_1fr] gap-4">
        <Label className="text-right font-medium text-gray-700 pt-2">支持方向说明：</Label>
        <Textarea placeholder="请输入" className="min-h-[80px]" />
      </div>

      {/* Purpose and Significance */}
      <div className="grid grid-cols-[140px_1fr] gap-4">
        <div className="text-right pt-2">
          <Label className="font-medium text-gray-700 block">目的意义</Label>
          <span className="text-xs text-gray-500">(150字以内)：</span>
        </div>
        <div className="relative">
          <Textarea
            placeholder="请输入"
            className="min-h-[100px] pb-6"
            maxLength={150}
            value={formData.purpose}
            onChange={(e) => handleTextChange("purpose", e.target.value)}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">{formData.purpose.length}/150</div>
        </div>
      </div>

      {/* Proposed Solution/Problem */}
      <div className="grid grid-cols-[140px_1fr] gap-4">
        <div className="text-right pt-2">
          <Label className="font-medium text-gray-700 block">拟解决问题</Label>
          <span className="text-xs text-gray-500">(100字以内)：</span>
        </div>
        <div className="relative">
          <Textarea
            placeholder="请输入"
            className="min-h-[100px] pb-6"
            maxLength={100}
            value={formData.problem}
            onChange={(e) => handleTextChange("problem", e.target.value)}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">{formData.problem.length}/100</div>
        </div>
      </div>

      {/* Main Research Content */}
      <div className="grid grid-cols-[140px_1fr] gap-4">
        <div className="text-right pt-2">
          <Label className="font-medium text-gray-700 block">主要研究内容</Label>
          <span className="text-xs text-gray-500">(150字以内)：</span>
        </div>
        <div className="relative">
          <Textarea
            placeholder="请输入"
            className="min-h-[100px] pb-6"
            maxLength={150}
            value={formData.content}
            onChange={(e) => handleTextChange("content", e.target.value)}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">{formData.content.length}/150</div>
        </div>
      </div>

      {/* Main Schedule Arrangement */}
      <div className="grid grid-cols-[140px_1fr] gap-4">
        <div className="text-right pt-2">
          <Label className="font-medium text-gray-700 block">主要进度安排</Label>
          <span className="text-xs text-gray-500">(150字以内)：</span>
        </div>
        <div className="relative">
          <Textarea
            placeholder="请输入"
            className="min-h-[100px] pb-6"
            maxLength={150}
            value={formData.schedule}
            onChange={(e) => handleTextChange("schedule", e.target.value)}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">{formData.schedule.length}/150</div>
        </div>
      </div>
    </div>
  )
}
