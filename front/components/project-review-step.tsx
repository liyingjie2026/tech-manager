"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, ClipboardCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectReviewStepProps {
  // reviewData: ReviewData
  onComplete: () => void
}

export function ProjectReviewStep({ onComplete }: ProjectReviewStepProps) {
  //  console.log("reviewData>>>+"+JSON.stringify(reviewData))
  const [activeTab, setActiveTab] = useState("application")
  const [scores, setScores] = useState({
    application: { innovation: "", feasibility: "", team: "", budget: "", impact: "" },
    taskbook: { clarity: "", rationality: "", milestones: "", risk: "" },
    achievement: { completion: "", quality: "", innovation: "", application: "" },
  })
  const [opinions, setOpinions] = useState({
    application: "",
    taskbook: "",
    achievement: "",
  })

  const handleScoreChange = (section: string, key: string, value: string) => {
    setScores((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [key]: value },
    }))
  }

  const handleOpinionChange = (section: string, value: string) => {
    setOpinions((prev) => ({ ...prev, [section]: value }))
  }

  const calculateSectionTotal = (section: keyof typeof scores) => {
    return Object.values(scores[section]).reduce((sum, score) => sum + (Number.parseFloat(score) || 0), 0)
  }

  const calculateGrandTotal = () => {
    return (
      calculateSectionTotal("application") + calculateSectionTotal("taskbook") + calculateSectionTotal("achievement")
    )
  }

  const allScoresFilled = () => {
    return Object.values(scores).every((section) =>
      Object.values(section).every((score) => score !== "" && Number.parseFloat(score) >= 0),
    )
  }

  return (
    <div className="space-y-4">
      <Alert className="bg-primary/10 border-primary/30">
        <ClipboardCheck className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground">
          请对项目的申报内容、任务书和验收成果进行逐项评分和评价
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>项目评审</CardTitle>
          <CardDescription>项目数据融合技术研究 · KJ202502001</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="application">申报内容</TabsTrigger>
              <TabsTrigger value="taskbook">任务书</TabsTrigger>
              <TabsTrigger value="achievement">验收成果</TabsTrigger>
            </TabsList>

            {/* 申报内容评审 */}
            <TabsContent value="application" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">项目材料</h3>
                  <div className="space-y-3">
                    {[
                      { name: "项目申报书.pdf", size: "2.5 MB" },
                      { name: "可行性研究报告.pdf", size: "1.8 MB" },
                      { name: "技术路线图.png", size: "856 KB" },
                    ].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{file.size}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">评分项目</h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">创新性 (20分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="0-20"
                        value={scores.application.innovation}
                        onChange={(e) => handleScoreChange("application", "innovation", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">可行性 (20分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="0-20"
                        value={scores.application.feasibility}
                        onChange={(e) => handleScoreChange("application", "feasibility", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">团队能力 (20分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="0-20"
                        value={scores.application.team}
                        onChange={(e) => handleScoreChange("application", "team", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">经费合理性 (20分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="0-20"
                        value={scores.application.budget}
                        onChange={(e) => handleScoreChange("application", "budget", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">应用价值 (20分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="0-20"
                        value={scores.application.impact}
                        onChange={(e) => handleScoreChange("application", "impact", e.target.value)}
                      />
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">小计</span>
                        <span className="text-lg font-bold text-primary">
                          {calculateSectionTotal("application")}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>评审意见</Label>
                <Textarea
                  rows={4}
                  placeholder="请对申报内容进行评价..."
                  value={opinions.application}
                  onChange={(e) => handleOpinionChange("application", e.target.value)}
                />
              </div>
            </TabsContent>

            {/* 任务书评审 */}
            <TabsContent value="taskbook" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">任务书材料</h3>
                  <div className="space-y-3">
                    {[
                      { name: "项目任务书.pdf", size: "1.2 MB" },
                      { name: "实施方案.pdf", size: "980 KB" },
                    ].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{file.size}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">评分项目</h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">目标明确性 (25分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        placeholder="0-25"
                        value={scores.taskbook.clarity}
                        onChange={(e) => handleScoreChange("taskbook", "clarity", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">方案合理性 (25分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        placeholder="0-25"
                        value={scores.taskbook.rationality}
                        onChange={(e) => handleScoreChange("taskbook", "rationality", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">里程碑设置 (25分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        placeholder="0-25"
                        value={scores.taskbook.milestones}
                        onChange={(e) => handleScoreChange("taskbook", "milestones", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">风险控制 (25分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        placeholder="0-25"
                        value={scores.taskbook.risk}
                        onChange={(e) => handleScoreChange("taskbook", "risk", e.target.value)}
                      />
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">小计</span>
                        <span className="text-lg font-bold text-primary">{calculateSectionTotal("taskbook")}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>评审意见</Label>
                <Textarea
                  rows={4}
                  placeholder="请对任务书进行评价..."
                  value={opinions.taskbook}
                  onChange={(e) => handleOpinionChange("taskbook", e.target.value)}
                />
              </div>
            </TabsContent>

            {/* 验收成果评审 */}
            <TabsContent value="achievement" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">成果材料</h3>
                  <div className="space-y-3">
                    {[
                      { name: "项目验收报告.pdf", size: "3.2 MB" },
                      { name: "成果汇总.pdf", size: "2.1 MB" },
                      { name: "技术文档.pdf", size: "1.5 MB" },
                    ].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{file.size}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">评分项目</h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">完成度 (25分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        placeholder="0-25"
                        value={scores.achievement.completion}
                        onChange={(e) => handleScoreChange("achievement", "completion", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">成果质量 (25分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        placeholder="0-25"
                        value={scores.achievement.quality}
                        onChange={(e) => handleScoreChange("achievement", "quality", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">创新性 (25分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        placeholder="0-25"
                        value={scores.achievement.innovation}
                        onChange={(e) => handleScoreChange("achievement", "innovation", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">应用效果 (25分)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        placeholder="0-25"
                        value={scores.achievement.application}
                        onChange={(e) => handleScoreChange("achievement", "application", e.target.value)}
                      />
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">小计</span>
                        <span className="text-lg font-bold text-primary">
                          {calculateSectionTotal("achievement")}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>评审意见</Label>
                <Textarea
                  rows={4}
                  placeholder="请对验收成果进行评价..."
                  value={opinions.achievement}
                  onChange={(e) => handleOpinionChange("achievement", e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">综合评分</h3>
                <p className="text-sm text-muted-foreground">所有评分项目的总和</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{calculateGrandTotal()}</div>
                <div className="text-sm text-muted-foreground">/ 300分</div>
              </div>
            </div>
            <Button onClick={onComplete} disabled={!allScoresFilled()} className="w-full" size="lg">
              完成评审，进入下一步
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
