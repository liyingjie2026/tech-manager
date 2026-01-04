"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, RotateCcw, Plus, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
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
import { duplicateCheckApi, type DuplicateCheckResultDTO } from "@/lib/api/duplicate-check"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/ui/page-header"

export default function DuplicateCheckPage() {
  const { toast } = useToast()
  const [records, setRecords] = useState<DuplicateCheckResultDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewCheck, setShowNewCheck] = useState(false)
  const [searchParams, setSearchParams] = useState({
    projectName: "",
    projectCode: "",
    applicant: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  })

  useEffect(() => {
    fetchRecords()
  }, [pagination.page, pagination.pageSize])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await duplicateCheckApi.getList({
        current: pagination.page,
        size: pagination.pageSize,
        ...searchParams,
      })

      if (response.data) {
        // Map the response to match the expected format
        const mappedRecords: DuplicateCheckResultDTO[] = response.data.records.map((project: any) => ({
          id: project.id,
          projectId: project.id,
          projectName: project.name, // Use project.name directly since backend Entity uses 'name', not 'projectName'
          projectCode: project.code || project.projectNo,
          checkType: "立项查重",
          duplicateRate: project.duplicateRate || 0,
          similarity: project.duplicateRate || 0,
          status: project.duplicateCheckStatus || "未检测",
          applicant: project.leaderName || project.applicant,
          applicantName: project.leaderName || project.applicant,
          checkTime: project.duplicateCheckTime || project.createTime,
          createTime: project.createTime,
          similarProjects: project.similarProjects || [],
        }))

        setRecords(mappedRecords)
        setPagination((prev) => ({ ...prev, total: response.data.total || 0 }))
      } else {
        throw new Error(response.message || "获取查重记录失败")
      }
    } catch (error: any) {
      console.error("Failed to load duplicate check records:", error)
      toast({
        title: "加载失败",
        description: error.message || "无法加载查重记录",
        variant: "destructive",
      })
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchRecords()
  }

  const handleReset = () => {
    setSearchParams({
      projectName: "",
      projectCode: "",
      applicant: "",
    })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const stats = {
    total: records.length,
    passed: records.filter((r) => r.similarity < 30).length,
    warning: records.filter((r) => r.similarity >= 30 && r.similarity < 50).length,
    high: records.filter((r) => r.similarity >= 50).length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="项目信息查重"
        subtitle="对项目申请书在已立项的科研项目申报书资料库中进行检索查重"
        backHref="/dashboard"
      >
        <Button onClick={() => setShowNewCheck(!showNewCheck)}>
          <Plus className="h-4 w-4 mr-2" />
          新建查重
        </Button>
      </PageHeader>

      {showNewCheck && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">项目名称 *</Label>
                  <Input id="projectName" placeholder="请输入项目名称" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkType">查重类型 *</Label>
                  <Input id="checkType" placeholder="立项查重" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">上传申请书 *</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">点击上传或拖拽文件到此处</p>
                  <p className="text-xs text-gray-400">支持 PDF、Word 格式，大小不超过 50MB</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewCheck(false)}>
                  取消
                </Button>
                <Button>开始查重</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">总查重次数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">通过查重</p>
                <p className="text-2xl font-bold">{stats.passed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">需要关注</p>
                <p className="text-2xl font-bold">{stats.warning}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">高重复率</p>
                <p className="text-2xl font-bold">{stats.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目查询</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">项目名称:</span>
              <Input
                placeholder="请输入内容"
                className={UI_CONSTANTS.INPUT_HEIGHT}
                value={searchParams.projectName}
                onChange={(e) => setSearchParams({ ...searchParams, projectName: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">项目编号:</span>
              <Input
                placeholder="请输入内容"
                className={UI_CONSTANTS.INPUT_HEIGHT}
                value={searchParams.projectCode}
                onChange={(e) => setSearchParams({ ...searchParams, projectCode: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">申请人:</span>
              <Input
                placeholder="请输入内容"
                className={UI_CONSTANTS.INPUT_HEIGHT}
                value={searchParams.applicant}
                onChange={(e) => setSearchParams({ ...searchParams, applicant: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className={`gap-2 bg-transparent ${UI_CONSTANTS.BUTTON_HEIGHT}`}
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
            <Button className={`gap-2 ${UI_CONSTANTS.BUTTON_HEIGHT}`} onClick={handleSearch}>
              <Search className="h-4 w-4" />
              查询
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>查重列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>查重类型</TableHead>
                  <TableHead>重复率</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>申请人</TableHead>
                  <TableHead>检测时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium max-w-xs">{record.projectName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.checkType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={record.similarity} className="w-20 h-2" />
                          <span
                            className={`text-sm font-medium ${
                              record.similarity < 30
                                ? "text-green-600"
                                : record.similarity < 50
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {record.similarity}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "已完成"
                              ? "default"
                              : record.status === "检测中"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.applicant}</TableCell>
                      <TableCell>{record.checkTime ? new Date(record.checkTime).toLocaleString() : "-"}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/duplicate-check/${record.id}`}>
                          <Button variant="link" size="sm">
                            查看详情
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">每页显示</span>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => setPagination({ ...pagination, page: 1, pageSize: Number.parseInt(value) })}
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
                      onClick={() => pagination.page > 1 && setPagination({ ...pagination, page: pagination.page - 1 })}
                      className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {[...Array(Math.ceil(pagination.total / pagination.pageSize))].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setPagination({ ...pagination, page: i + 1 })}
                        isActive={pagination.page === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        pagination.page < Math.ceil(pagination.total / pagination.pageSize) &&
                        setPagination({ ...pagination, page: pagination.page + 1 })
                      }
                      className={
                        pagination.page >= Math.ceil(pagination.total / pagination.pageSize)
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-3">查重说明</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              • <strong>查重范围：</strong>对申请书在已立项科研项目申报书资料库中进行全文检索比对
            </li>
            <li>
              • <strong>重复率判定：</strong>
            </li>
            <li className="ml-6">- 绿色（0-30%）：正常范围，可以提交申报</li>
            <li className="ml-6">- 黄色（30-50%）：需要关注，建议修改后重新查重</li>
            <li className="ml-6">- 红色（50%以上）：重复率过高，不建议申报</li>
            <li>
              • <strong>查重时效：</strong>查重报告保留3个月，过期后需重新检测
            </li>
            <li>
              • <strong>申报要求：</strong>建议在正式提交前进行查重检测，重复率应控制在30%以下
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
