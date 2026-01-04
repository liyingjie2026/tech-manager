"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ProjectInfoForm } from "@/components/project-application/project-info-form"
import { SummaryTable } from "@/components/project-application/summary-table"
import { UnitInfoForm } from "@/components/project-application/unit-info-form"
import { MemberList } from "@/components/project-application/member-list"
import { ResearchBackground } from "@/components/project-application/research-background"
import { BudgetForm } from "@/components/project-application/budget-form"
import { AttachmentList } from "@/components/project-application/attachment-list"
import { SchedulePlan } from "@/components/project-application/schedule-plan"
import { PerformanceIndicators } from "@/components/project-application/performance-indicators"

export default function ProjectApplicationPage() {
  const [activeTab, setActiveTab] = useState("project-info")

  const tabs = [
    { id: "project-info", label: "项目情况" },
    { id: "summary", label: "汇总表" },
    { id: "unit-info", label: "申报单位信息" },
    { id: "members", label: "项目成员" },
    { id: "background", label: "研究背景" },
    { id: "budget", label: "预算" },
    { id: "attachments", label: "其他附件" },
    { id: "schedule", label: "项目实施进度计划" },
    { id: "indicators", label: "绩效指标" },
  ]

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[{ label: "首页", href: "/dashboard" }, { label: "立项管理" }, { label: "项目申报" }]} />

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-border">
              <TabsList className="h-auto w-full justify-start gap-2 bg-transparent p-0 flex-wrap">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-t-lg rounded-b-none border border-transparent data-[state=active]:border-border px-4 py-2"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="mt-6">
              <TabsContent value="project-info">
                <ProjectInfoForm />
              </TabsContent>
              <TabsContent value="summary">
                <SummaryTable />
              </TabsContent>
              <TabsContent value="unit-info">
                <UnitInfoForm />
              </TabsContent>
              <TabsContent value="members">
                <MemberList />
              </TabsContent>
              <TabsContent value="background">
                <ResearchBackground />
              </TabsContent>
              <TabsContent value="budget">
                <BudgetForm />
              </TabsContent>
              <TabsContent value="attachments">
                <AttachmentList />
              </TabsContent>
              <TabsContent value="schedule">
                <SchedulePlan />
              </TabsContent>
              <TabsContent value="indicators">
                <PerformanceIndicators />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-border">
            <Button variant="outline" className="w-32 bg-transparent">
              取消
            </Button>
            <Button variant="outline" className="w-32 bg-transparent">
              保存
            </Button>
            <Button className="w-32">提交</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
