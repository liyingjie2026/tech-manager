"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { budgetApi } from "@/lib/api/budget" // Updated import path from budgetApi to budget
import { useToast } from "@/hooks/use-toast"

export default function BudgetManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [budgetList, setBudgetList] = useState<any[]>([])
  const [changeRecords, setChangeRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [budgetPagination, setBudgetPagination] = useState({
    page: 1,
    pageSize: UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  })

  const [changesPagination, setChangesPagination] = useState({
    page: 1,
    pageSize: UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  })

  const { toast } = useToast()

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true)
        const response = await budgetApi.list({
          page: budgetPagination.page,
          size: budgetPagination.pageSize,
          keyword: searchQuery,
        })

        if (response.data) {
          setBudgetList(response.data.records || [])
          setBudgetPagination((prev) => ({ ...prev, total: response.data.total || 0 }))
        }
      } catch (error) {
        console.error("Failed to load budget data:", error)
        toast({
          title: "加载失败",
          description: "无法加载经费数据",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBudgetData()
  }, [budgetPagination.page, budgetPagination.pageSize, searchQuery])

  useEffect(() => {
    const fetchChangeRecords = async () => {
      try {
        const response = await budgetApi.getChangeRecords({
          page: changesPagination.page,
          size: changesPagination.pageSize,
          keyword: searchQuery,
        })

        if (response.data) {
          setChangeRecords(response.data.records || [])
          setChangesPagination((prev) => ({ ...prev, total: response.data.total || 0 }))
        }
      } catch (error) {
        console.error("Failed to load change records:", error)
      }
    }

    fetchChangeRecords()
  }, [changesPagination.page, changesPagination.pageSize, searchQuery])

  const getStatusBadge = (status: string) => {
    const variants: any = {
      已审批: "default",
      审批中: "secondary",
      已驳回: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">项目管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>经费管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>经费管理</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="budget" className="space-y-6">
            <TabsList>
              <TabsTrigger value="budget">项目经费</TabsTrigger>
              <TabsTrigger value="changes">变更记录</TabsTrigger>
            </TabsList>

            <TabsContent value="budget" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Input
                    placeholder="请输入项目名称或编号"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-64 ${UI_CONSTANTS.INPUT_HEIGHT}`}
                  />
                  <Button className={UI_CONSTANTS.BUTTON_HEIGHT}>
                    <Search className="h-4 w-4 mr-2" />
                    查询
                  </Button>
                  <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
                    重置
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Input type="checkbox" className="h-4 w-4" />
                      </TableHead>
                      <TableHead>项目编号</TableHead>
                      <TableHead>项目名称</TableHead>
                      <TableHead>总预算(元)</TableHead>
                      <TableHead>省财政专项(元)</TableHead>
                      <TableHead>自筹/其他(元)</TableHead>
                      <TableHead>已使用(元)</TableHead>
                      <TableHead>剩余(元)</TableHead>
                      <TableHead>使用率</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input type="checkbox" className="h-4 w-4" />
                        </TableCell>
                        <TableCell className="font-medium">{item.projectNo}</TableCell>
                        <TableCell>{item.projectName}</TableCell>
                        <TableCell>{item.totalBudget.toLocaleString()}</TableCell>
                        <TableCell>{item.provincialFunds.toLocaleString()}</TableCell>
                        <TableCell>{item.selfFunds.toLocaleString()}</TableCell>
                        <TableCell className="text-orange-600">{item.usedAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">{item.remainingAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.usageRate}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/dashboard/budget-management/${item.id}`}>
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                详情
                              </Button>
                            </Link>
                            <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                              变更申请
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {budgetPagination.total > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">每页显示</span>
                    <Select
                      value={budgetPagination.pageSize.toString()}
                      onValueChange={(value) =>
                        setBudgetPagination({ ...budgetPagination, page: 1, pageSize: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-20 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">条</span>
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            budgetPagination.page > 1 &&
                            setBudgetPagination({ ...budgetPagination, page: budgetPagination.page - 1 })
                          }
                          className={budgetPagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {[...Array(Math.ceil(budgetPagination.total / budgetPagination.pageSize))].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setBudgetPagination({ ...budgetPagination, page: i + 1 })}
                            isActive={budgetPagination.page === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            budgetPagination.page < Math.ceil(budgetPagination.total / budgetPagination.pageSize) &&
                            setBudgetPagination({ ...budgetPagination, page: budgetPagination.page + 1 })
                          }
                          className={
                            budgetPagination.page >= Math.ceil(budgetPagination.total / budgetPagination.pageSize)
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            <TabsContent value="changes" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Input
                    placeholder="请输入项目名称或编号"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-64 ${UI_CONSTANTS.INPUT_HEIGHT}`}
                  />
                  <Button className={UI_CONSTANTS.BUTTON_HEIGHT}>
                    <Search className="h-4 w-4 mr-2" />
                    查询
                  </Button>
                  <Button variant="outline" className={UI_CONSTANTS.BUTTON_HEIGHT}>
                    重置
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Input type="checkbox" className="h-4 w-4" />
                      </TableHead>
                      <TableHead>项目编号</TableHead>
                      <TableHead>项目名称</TableHead>
                      <TableHead>变更类型</TableHead>
                      <TableHead>变更金额(元)</TableHead>
                      <TableHead>变更原因</TableHead>
                      <TableHead>申请日期</TableHead>
                      <TableHead>申请人</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {changeRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Input type="checkbox" className="h-4 w-4" />
                        </TableCell>
                        <TableCell className="font-medium">{record.projectNo}</TableCell>
                        <TableCell>{record.projectName}</TableCell>
                        <TableCell>{record.changeType}</TableCell>
                        <TableCell className={record.changeAmount > 0 ? "text-green-600" : "text-red-600"}>
                          {record.changeAmount > 0 ? "+" : ""}
                          {record.changeAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={record.changeReason}>
                          {record.changeReason}
                        </TableCell>
                        <TableCell>{record.changeDate}</TableCell>
                        <TableCell>{record.applicant}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {changesPagination.total > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">每页显示</span>
                    <Select
                      value={changesPagination.pageSize.toString()}
                      onValueChange={(value) =>
                        setChangesPagination({ ...changesPagination, page: 1, pageSize: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-20 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">条</span>
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            changesPagination.page > 1 &&
                            setChangesPagination({ ...changesPagination, page: changesPagination.page - 1 })
                          }
                          className={changesPagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {[...Array(Math.ceil(changesPagination.total / changesPagination.pageSize))].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setChangesPagination({ ...changesPagination, page: i + 1 })}
                            isActive={changesPagination.page === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            changesPagination.page < Math.ceil(changesPagination.total / changesPagination.pageSize) &&
                            setChangesPagination({ ...changesPagination, page: changesPagination.page + 1 })
                          }
                          className={
                            changesPagination.page >= Math.ceil(changesPagination.total / changesPagination.pageSize)
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
