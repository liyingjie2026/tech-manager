"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function QuerySearchPage() {
  const queries = [
    {
      id: 1,
      title: "高性能计算资源需求",
      type: "计算资源",
      urgency: "紧急",
      submitDate: "2025-03-15",
      status: "已发布",
      responses: 3,
    },
    {
      id: 2,
      title: "遥感影像数据处理算法合作",
      type: "技术合作",
      urgency: "普通",
      submitDate: "2025-03-10",
      status: "审核中",
      responses: 0,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>需求征集</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>需求查询</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">需求标题:</span>
              <Input placeholder="请输入内容" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">需求类型:</span>
              <Input placeholder="请输入内容" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">状态:</span>
              <Input placeholder="请输入内容" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              查询
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>我的需求列表</CardTitle>
          <Link href="/dashboard/query-search/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增需求
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Input type="checkbox" className="h-4 w-4" />
                  </TableHead>
                  <TableHead>需求标题</TableHead>
                  <TableHead>需求类型</TableHead>
                  <TableHead>紧急程度</TableHead>
                  <TableHead>提交日期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>响应数</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge variant={item.urgency === "紧急" ? "destructive" : "secondary"}>{item.urgency}</Badge>
                    </TableCell>
                    <TableCell>{item.submitDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.responses}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/query-search/${item.id}`}>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            查看
                          </Button>
                        </Link>
                        <Button variant="link" size="sm" className="p-0 h-auto text-red-600">
                          关闭
                        </Button>
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
