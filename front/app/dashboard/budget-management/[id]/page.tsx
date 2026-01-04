"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BudgetDetailPage() {
  const router = useRouter()

  const budgetDetail = {
    projectNo: "KJ202502001",
    projectName: "项目数据融合技术研究",
    totalBudget: 100000.0,
    provincialFunds: 80000.0,
    selfFunds: 20000.0,
    usedAmount: 45000.0,
    remainingAmount: 55000.0,
    usageRate: 45,
  }

  const budgetItems = [
    {
      category: "设备费",
      totalBudget: 30000.0,
      provincialFunds: 25000.0,
      selfFunds: 5000.0,
      usedAmount: 15000.0,
      remainingAmount: 15000.0,
      usageRate: 50,
    },
    {
      category: "材料费",
      totalBudget: 20000.0,
      provincialFunds: 15000.0,
      selfFunds: 5000.0,
      usedAmount: 10000.0,
      remainingAmount: 10000.0,
      usageRate: 50,
    },
    {
      category: "测试化验加工费",
      totalBudget: 15000.0,
      provincialFunds: 12000.0,
      selfFunds: 3000.0,
      usedAmount: 8000.0,
      remainingAmount: 7000.0,
      usageRate: 53,
    },
    {
      category: "差旅费",
      totalBudget: 10000.0,
      provincialFunds: 8000.0,
      selfFunds: 2000.0,
      usedAmount: 5000.0,
      remainingAmount: 5000.0,
      usageRate: 50,
    },
    {
      category: "劳务费",
      totalBudget: 25000.0,
      provincialFunds: 20000.0,
      selfFunds: 5000.0,
      usedAmount: 7000.0,
      remainingAmount: 18000.0,
      usageRate: 28,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/budget-management">经费管理</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>经费详情</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目经费详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目编号</p>
              <p className="font-medium">{budgetDetail.projectNo}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目名称</p>
              <p className="font-medium">{budgetDetail.projectName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">总预算</p>
              <p className="text-xl font-semibold text-primary">¥{budgetDetail.totalBudget.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">经费使用率</p>
              <div className="flex items-center gap-4">
                <Progress value={budgetDetail.usageRate} className="flex-1" />
                <span className="text-lg font-semibold">{budgetDetail.usageRate}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">省财政专项经费</p>
                <p className="text-2xl font-semibold text-blue-600">¥{budgetDetail.provincialFunds.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">自筹/其他经费</p>
                <p className="text-2xl font-semibold text-purple-600">¥{budgetDetail.selfFunds.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">已使用金额</p>
                <p className="text-2xl font-semibold text-orange-600">¥{budgetDetail.usedAmount.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>预算科目明细</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>预算科目</TableHead>
                  <TableHead>总预算(元)</TableHead>
                  <TableHead>省财政专项(元)</TableHead>
                  <TableHead>自筹/其他(元)</TableHead>
                  <TableHead>已使用(元)</TableHead>
                  <TableHead>剩余(元)</TableHead>
                  <TableHead>使用率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>{item.totalBudget.toLocaleString()}</TableCell>
                    <TableCell>{item.provincialFunds.toLocaleString()}</TableCell>
                    <TableCell>{item.selfFunds.toLocaleString()}</TableCell>
                    <TableCell className="text-orange-600">{item.usedAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">{item.remainingAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={item.usageRate} className="w-20" />
                        <span className="text-sm">{item.usageRate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
