"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Eye, UserPlus, FileCheck, Calendar } from "lucide-react"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { achievementApi } from "@/lib/api"

export default function AchievementAppraisalPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [appraisals, setAppraisals] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadAppraisals = async () => {
    setLoading(true)
    try {
      const response = await achievementApi.getList({
        current: currentPage,
        size: pageSize,
        // Filter for appraisal achievements
        status: "appraisal",
      })

      if (response.code === 200 && response.data) {
        setAppraisals(response.data.records || [])
        setTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error("Failed to load appraisals:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppraisals()
  }, [currentPage, pageSize])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">成果鉴定</h1>
        <p className="text-sm text-muted-foreground mt-1">组织专家对项目成果进行鉴定评价</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索项目名称或成果名称" className={`pl-9 ${UI_CONSTANTS.INPUT_HEIGHT}`} />
            </div>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                <SelectValue placeholder="鉴定状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">待鉴定</SelectItem>
                <SelectItem value="in-progress">鉴定中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                <SelectValue placeholder="鉴定等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="international">国际领先</SelectItem>
                <SelectItem value="domestic-leading">国内领先</SelectItem>
                <SelectItem value="domestic-advanced">国内先进</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button className={`flex-1 ${UI_CONSTANTS.BUTTON_HEIGHT}`}>查询</Button>
              <Button variant="outline" className={`flex-1 ${UI_CONSTANTS.BUTTON_HEIGHT}`}>
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">鉴定列表</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">待鉴定: 8</Badge>
            <Badge variant="default">鉴定中: 5</Badge>
            <Badge variant="outline">已完成: 42</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>项目编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>成果名称</TableHead>
                <TableHead>申报单位</TableHead>
                <TableHead>申请时间</TableHead>
                <TableHead>鉴定状态</TableHead>
                <TableHead>鉴定等级</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appraisals.map((appraisal) => (
                <TableRow key={appraisal.id}>
                  <TableCell className="font-mono">{appraisal.projectCode}</TableCell>
                  <TableCell>{appraisal.projectName}</TableCell>
                  <TableCell>{appraisal.achievementName}</TableCell>
                  <TableCell>{appraisal.institution}</TableCell>
                  <TableCell>{appraisal.applyTime}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appraisal.status === "pending"
                          ? "secondary"
                          : appraisal.status === "in-progress"
                            ? "default"
                            : "outline"
                      }
                    >
                      {appraisal.status === "pending"
                        ? "待鉴定"
                        : appraisal.status === "in-progress"
                          ? "鉴定中"
                          : "已完成"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {appraisal.level ? (
                      <Badge variant="default">
                        {appraisal.level === "international"
                          ? "国际领先"
                          : appraisal.level === "domestic-leading"
                            ? "国内领先"
                            : "国内先进"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-1" />
                        查看
                      </Button>
                      {appraisal.status === "pending" && (
                        <Button size="sm" variant="default">
                          <UserPlus className="h-4 w-4 mr-1" />
                          组织鉴定
                        </Button>
                      )}
                      {appraisal.status === "in-progress" && (
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          鉴定进度
                        </Button>
                      )}
                      {appraisal.status === "completed" && (
                        <Button size="sm" variant="outline">
                          <FileCheck className="h-4 w-4 mr-1" />
                          鉴定报告
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每页显示</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UI_CONSTANTS.PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">共 {total} 条</span>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
                    className={
                      currentPage >= Math.ceil(total / pageSize) ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
