"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CreateSubTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  tasks: any[]
  onSubmit: (data: any) => void
}

export function CreateSubTaskDialog({ open, onOpenChange, projectName, tasks, onSubmit }: CreateSubTaskDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    parentTaskNumber: "",
    parentTaskName: "",
    taskNumber: "父级任务编号加二位序列号",
    isMilestone: "是",
    taskName: "",
    taskDescription: "",
    priority: "一般",
    startDate: "",
    endDate: "",
    taskLeader: "",
    contactMethod: "",
    taskUnit: "",
  })

  const handleParentTaskChange = (taskId: string) => {
    const selectedTask = tasks.find((t) => t.id === taskId)
    if (selectedTask) {
      setFormData({
        ...formData,
        parentTaskNumber: selectedTask.taskNumber,
        parentTaskName: selectedTask.taskName,
      })
    }
  }

  const handleSubmit = () => {
    if (!formData.parentTaskNumber) {
      toast({
        title: "提示",
        description: "请选择父级任务",
        variant: "destructive",
      })
      return
    }
    if (!formData.taskName) {
      toast({
        title: "提示",
        description: "请输入任务名称",
        variant: "destructive",
      })
      return
    }
    onSubmit({
      taskNumber: `${formData.parentTaskNumber}.${String(Math.floor(Math.random() * 99) + 1).padStart(2, "0")}`,
      taskName: formData.taskName,
      taskType: "子任务",
      wbs: "",
      leader: formData.taskLeader || "管理员",
      unit: formData.taskUnit || "未指定",
      startDate: formData.startDate,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建子任务</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>项目名称：</Label>
            <Input value={projectName} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>父级任务编号：</Label>
            <Select onValueChange={handleParentTaskChange}>
              <SelectTrigger>
                <SelectValue placeholder="编码自动生成" />
              </SelectTrigger>
              <SelectContent>
                {tasks
                  .filter((t) => t.taskType === "里程碑节点")
                  .map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.taskNumber} - {task.taskName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>父级任务名称：</Label>
            <Input placeholder="任务名称" value={formData.parentTaskName} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>任务编号：</Label>
            <Input value={formData.taskNumber} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>是否里程碑：</Label>
            <RadioGroup
              value={formData.isMilestone}
              onValueChange={(value) => setFormData({ ...formData, isMilestone: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="是" id="sub-milestone-yes" />
                <Label htmlFor="sub-milestone-yes" className="font-normal cursor-pointer">
                  是
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="否" id="sub-milestone-no" />
                <Label htmlFor="sub-milestone-no" className="font-normal cursor-pointer">
                  否
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>任务名称：</Label>
            <Input
              placeholder="任务名称"
              value={formData.taskName}
              onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>任务描述：</Label>
            <Textarea
              placeholder="这里是任务描述、任务描述"
              value={formData.taskDescription}
              onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
              rows={4}
              maxLength={300}
            />
            <div className="text-right text-sm text-muted-foreground">{formData.taskDescription.length}/300</div>
          </div>

          <div className="space-y-2">
            <Label>优先级：</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="一般">一般</SelectItem>
                <SelectItem value="高">高</SelectItem>
                <SelectItem value="紧急">紧急</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>开始时间：</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>截止时间：</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>任务责任人：</Label>
            <div className="flex gap-2">
              <Input
                value={formData.taskLeader}
                onChange={(e) => setFormData({ ...formData, taskLeader: e.target.value })}
                className="flex-1"
              />
              <Button variant="outline" type="button">
                +选择人员
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>联系方式：</Label>
            <Input
              placeholder="负责人联系电话自动带出"
              value={formData.contactMethod}
              onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>任务承担单位：</Label>
            <div className="flex gap-2">
              <Input
                value={formData.taskUnit}
                onChange={(e) => setFormData({ ...formData, taskUnit: e.target.value })}
                className="flex-1"
              />
              <Button variant="outline" type="button">
                +选择单位
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取 消
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            保 存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
