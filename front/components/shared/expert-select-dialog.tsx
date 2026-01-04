"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { expertApi } from "@/lib/api"
import type { Expert } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

interface ExpertSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (experts: Expert[]) => void
  minCount?: number
  maxCount?: number
}

export function ExpertSelectDialog({
  open,
  onOpenChange,
  onSubmit,
  minCount = 3,
  maxCount = 5,
}: ExpertSelectDialogProps) {
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [allExperts, setAllExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(false)
  const [customExperts, setCustomExperts] = useState<Expert[]>([])

  useEffect(() => {
    if (open) {
      loadExperts()
    }
  }, [open])

  const loadExperts = async () => {
    try {
      setLoading(true)
      const response = await expertApi.getList({ pageNum: 1, pageSize: 100 })
      if (response.data) {
        setAllExperts(response.data.list || [])
      }
    } catch (error) {
      console.error("Failed to load experts:", error)
    } finally {
      setLoading(false)
    }
  }

  const experts = allExperts.filter(
    (e) =>
      e.name.includes(searchTerm) ||
      e.institution.includes(searchTerm) ||
      e.expertise.some((ex) => ex.includes(searchTerm)),
  )

  const toggleExpert = (expert: Expert) => {
    if (selectedExperts.find((e) => e.id === expert.id)) {
      setSelectedExperts(selectedExperts.filter((e) => e.id !== expert.id))
    } else if (selectedExperts.length < maxCount) {
      setSelectedExperts([...selectedExperts, expert])
    }
  }

  const handleRandomSelect = () => {
    const shuffled = [...allExperts].sort(() => 0.5 - Math.random())
    setSelectedExperts(shuffled.slice(0, minCount))
  }

  const handleAddExpert = (expert: Expert) => {
    if (selectedExperts.length >= maxCount) {
      toast({
        title: "已达到最大数量",
        description: `最多只能选择${maxCount}位专家`,
        variant: "destructive",
      })
      return
    }
    setSelectedExperts([...selectedExperts, expert])
  }

  const handleRemoveExpert = (expertId: number) => {
    setSelectedExperts(selectedExperts.filter((e) => e.id !== expertId))
  }

  const handleSubmit = () => {
    if (selectedExperts.length >= minCount && selectedExperts.length <= maxCount) {
      onSubmit(selectedExperts)
      onOpenChange(false)
      setSelectedExperts([])
      setSearchTerm("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>选择评审专家</DialogTitle>
          <p className="text-sm text-muted-foreground">
            请选择 {minCount}-{maxCount} 位专家进行评审，当前已选 {selectedExperts.length} 位
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="搜索专家姓名、单位或专业领域"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleRandomSelect} disabled={loading || allExperts.length < minCount}>
              随机抽取 {minCount} 位
            </Button>
          </div>

          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">加载专家列表中...</div>
            ) : experts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">暂无专家数据</div>
            ) : (
              experts.map((expert) => {
                const isSelected = selectedExperts.find((e) => e.id === expert.id)
                return (
                  <div
                    key={expert.id}
                    className={`flex items-start gap-3 p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                    onClick={() => toggleExpert(expert)}
                  >
                    <Checkbox checked={!!isSelected} onCheckedChange={() => toggleExpert(expert)} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{expert.name}</span>
                        <Badge variant="secondary">{expert.title}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{expert.institution}</p>
                      <div className="flex flex-wrap gap-1">
                        {expert.expertise.map((exp, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">已评审 {expert.reviewCount} 个项目</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedExperts.length < minCount || selectedExperts.length > maxCount}
          >
            确定（{selectedExperts.length}/{minCount}-{maxCount}）
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
