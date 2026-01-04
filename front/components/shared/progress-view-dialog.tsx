"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface ProgressStep {
  id: number
  name: string
  status: "已完成" | "进行中" | "未开始"
  date?: string
  description?: string
}

interface ProgressViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  steps: ProgressStep[]
}

export function ProgressViewDialog({ open, onOpenChange, projectName, steps }: ProgressViewDialogProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已完成":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "进行中":
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "已完成":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{status}</Badge>
      case "进行中":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>进度查看</DialogTitle>
          <p className="text-sm text-muted-foreground">{projectName}</p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(step.status)}
                {index < steps.length - 1 && <div className="w-px h-full bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{step.name}</span>
                  {getStatusBadge(step.status)}
                </div>
                {step.description && <p className="text-sm text-muted-foreground mb-1">{step.description}</p>}
                {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
