"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  type: "approve" | "score"
  onSubmit: (data: { decision?: string; score?: number; comments: string }) => void
}

export function ReviewDialog({ open, onOpenChange, title, type, onSubmit }: ReviewDialogProps) {
  const [decision, setDecision] = useState<string>("approve")
  const [score, setScore] = useState<number>(80)
  const [comments, setComments] = useState("")

  const handleSubmit = () => {
    onSubmit({
      decision: type === "approve" ? decision : undefined,
      score: type === "score" ? score : undefined,
      comments,
    })
    onOpenChange(false)
    // 重置表单
    setDecision("approve")
    setScore(80)
    setComments("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {type === "approve" && (
            <div className="space-y-2">
              <Label>审核结果 *</Label>
              <RadioGroup value={decision} onValueChange={setDecision}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="font-normal cursor-pointer">
                    通过
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="font-normal cursor-pointer">
                    不通过
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="revise" id="revise" />
                  <Label htmlFor="revise" className="font-normal cursor-pointer">
                    需修改
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {type === "score" && (
            <div className="space-y-2">
              <Label>评分：{score} 分</Label>
              <Slider
                value={[score]}
                onValueChange={(value) => setScore(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0分</span>
                <span>50分</span>
                <span>100分</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>审核意见 *</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="请输入审核意见"
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!comments.trim()}>
            提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
