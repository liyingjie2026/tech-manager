"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

interface ApprovalStep {
  id: number
  approver: string
  role: string
  status: "已通过" | "已拒绝" | "待审批"
  comment?: string
  time?: string
}

interface ApprovalHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  steps: ApprovalStep[]
}

export function ApprovalHistoryDialog({ open, onOpenChange, projectName, steps }: ApprovalHistoryDialogProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已通过":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "已拒绝":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "已通过":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{status}</Badge>
      case "已拒绝":
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>审批历史</DialogTitle>
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
                  <div>
                    <span className="font-medium">{step.approver}</span>
                    <span className="text-sm text-muted-foreground ml-2">({step.role})</span>
                  </div>
                  {getStatusBadge(step.status)}
                </div>
                {step.comment && <p className="text-sm text-muted-foreground mb-1">{step.comment}</p>}
                {step.time && <p className="text-xs text-muted-foreground">{step.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
