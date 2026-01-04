"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ArrowLeft, AlertTriangle, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function DuplicateCheckReportPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // 模拟查重报告数据
  const report = {
    projectName: "*****项目数据融合技术研究",
    checkTime: "2025-03-01 14:32:25",
    overallSimilarity: 10,
    status: "passed", // passed, warning, failed
    fragments: [
      {
        id: 1,
        content:
          "国家超级计算长沙中心是由国家科技部正式批准建立的第三家、中西部第一家国家超级计算中心。由省政府投资建设，湖南大学负责运营。",
        similarity: 95,
        source: "湖南大学官网简介",
        sourceContent:
          "国家超级计算长沙中心是由国家科技部正式批准建立的第三家、中西部第一家国家超级计算中心。由省政府投资建设，湖南大学负责运营，国防科技大学提供技术支撑。",
        type: "heavy", // heavy (red), light (orange)
      },
      {
        id: 2,
        content: "高分辨率对地观测系统工程将统筹建设基于卫星、平流层飞艇和飞机的高分辨率对地观测系统，完善地面资源。",
        similarity: 65,
        source: "国家航天局公告",
        sourceContent:
          "该工程将统筹建设基于卫星、平流层飞艇和飞机的高分辨率对地观测系统，完善地面资源，与其他观测手段结合。",
        type: "light",
      },
    ],
    fullText: `
      一、项目情况
      1.项目的目的和意义
      本项目旨在解决多源异构数据的融合问题。国家超级计算长沙中心是由国家科技部正式批准建立的第三家、中西部第一家国家超级计算中心。由省政府投资建设，湖南大学负责运营。中心拥有强大的计算能力。
      
      2.项目主要研究内容
      高分辨率对地观测系统工程将统筹建设基于卫星、平流层飞艇和飞机的高分辨率对地观测系统，完善地面资源。我们将在此基础上开发新的数据处理算法。
      
      3.现有工作基础与优势
      团队在数据挖掘领域拥有丰富经验，已发表多篇高水平论文。
    `,
  }

  // 简单的文本高亮处理函数
  const renderHighlightedText = (text: string, fragments: typeof report.fragments) => {
    const parts = []
    const lastIndex = 0

    // 这是一个简化的实现，实际项目中需要更复杂的文本匹配算法
    // 这里我们假设fragments按在文本中出现的顺序排列

    // 为了演示，我们手动分割文本
    const textParts = [
      {
        text: "      一、项目情况\n      1.项目的目的和意义\n      本项目旨在解决多源异构数据的融合问题。",
        type: "normal",
      },
      {
        text: "国家超级计算长沙中心是由国家科技部正式批准建立的第三家、中西部第一家国家超级计算中心。由省政府投资建设，湖南大学负责运营。",
        type: "heavy",
      },
      { text: "中心拥有强大的计算能力。\n      \n      2.项目主要研究内容\n      ", type: "normal" },
      {
        text: "高分辨率对地观测系统工程将统筹建设基于卫星、平流层飞艇和飞机的高分辨率对地观测系统，完善地面资源。",
        type: "light",
      },
      {
        text: "我们将在此基础上开发新的数据处理算法。\n      \n      3.现有工作基础与优势\n      团队在数据挖掘领域拥有丰富经验，已发表多篇高水平论文。\n    ",
        type: "normal",
      },
    ]

    return textParts.map((part, index) => {
      if (part.type === "heavy") {
        return (
          <span key={index} className="bg-red-100 text-red-700 border-b-2 border-red-400 px-1">
            {part.text}
          </span>
        )
      } else if (part.type === "light") {
        return (
          <span key={index} className="bg-orange-100 text-orange-700 border-b-2 border-orange-400 px-1">
            {part.text}
          </span>
        )
      }
      return <span key={index}>{part.text}</span>
    })
  }

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <Breadcrumb
        items={[
          { label: "首页", href: "/dashboard" },
          { label: "信息查重", href: "/dashboard/duplicate-check" },
          { label: "查重报告" },
        ]}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">查重报告：{report.projectName}</h1>
          <p className="text-muted-foreground text-sm mt-1">查重时间：{report.checkTime}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回列表
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Left Column: Stats & Fragment List */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
          <Card>
            <CardHeader>
              <CardTitle>总体相似度</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative h-40 w-40 flex items-center justify-center rounded-full border-8 border-green-100">
                <div
                  className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent rotate-45"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% ${report.overallSimilarity}%, 0 ${report.overallSimilarity}%)`,
                  }}
                ></div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-green-600">{report.overallSimilarity}%</span>
                  <p className="text-xs text-muted-foreground mt-1">通过检测</p>
                </div>
              </div>
              <div className="w-full mt-6 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>重度相似 (80%-100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>轻度相似 (50%-80%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader>
              <CardTitle>相似片段 ({report.fragments.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <ScrollArea className="h-full">
                <div className="divide-y">
                  {report.fragments.map((fragment) => (
                    <div key={fragment.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          variant={fragment.type === "heavy" ? "destructive" : "default"}
                          className={fragment.type === "light" ? "bg-orange-500 hover:bg-orange-600" : ""}
                        >
                          相似度 {fragment.similarity}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">片段 {fragment.id}</span>
                      </div>
                      <p className="text-sm line-clamp-2 text-muted-foreground mb-2">{fragment.content}</p>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        来源：{fragment.source}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Document View */}
        <Card className="lg:col-span-3 flex flex-col overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle>文档比对视图</CardTitle>
            <CardDescription>橙色句子为轻度相似(50-80%)，红色句子为重度相似(80%-100%)</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex">
            {/* Main Text Area */}
            <div className="flex-1 p-6 overflow-auto border-r bg-white">
              <div className="prose max-w-none whitespace-pre-wrap leading-loose">
                {renderHighlightedText(report.fullText, report.fragments)}
              </div>
            </div>

            {/* Comparison Panel (Simulated for selected fragment) */}
            <div className="w-80 bg-muted/10 p-4 border-l overflow-auto hidden xl:block">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                相似来源对比
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">您的句子：</div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                    国家超级计算长沙中心是由国家科技部正式批准建立的第三家、中西部第一家国家超级计算中心。
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowLeft className="h-4 w-4 rotate-90 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">相似来源（湖南大学官网）：</div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800">
                    国家超级计算长沙中心是由国家科技部正式批准建立的第三家、中西部第一家国家超级计算中心...
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">您的句子：</div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-sm text-orange-800">
                    高分辨率对地观测系统工程将统筹建设基于卫星、平流层飞艇和飞机的高分辨率对地观测系统...
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowLeft className="h-4 w-4 rotate-90 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">相似来源（国家航天局）：</div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800">
                    该工程将统筹建设基于卫星、平流层飞艇和飞机的高分辨率对地观测系统...
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
