"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, RotateCcw, Plus } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { awardApi } from "@/lib/api/award"
import { toast } from "@/hooks/use-toast"

export default function AchievementAwardsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [awards, setAwards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState<"add" | "edit">("add")
  const [searchParams, setSearchParams] = useState({
    name: "",
    projectNo: "",
    awardName: "",
  })

  useEffect(() => {
    loadData()
  }, [currentPage, pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await awardApi.list({
        page: currentPage,
        size: pageSize,
        keyword: searchParams.name || searchParams.projectNo || searchParams.awardName,
      })

      if (response.data) {
        setAwards(response.data.records || [])
        setTotal(response.data.total || 0)
      } else {
        toast({
          title: "加载失败",
          description: response.message || "无法加载获奖记录列表",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to load awards:", error)
      toast({
        title: "加载失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditMode("add")
    setDialogOpen(true)
  }

  const handleEdit = () => {
    setEditMode("edit")
    setDialogOpen(true)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadData()
  }

  const handleReset = () => {
    setSearchParams({ name: "", projectNo: "", awardName: "" })
    setCurrentPage(1)
    loadData()
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">项目管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/achievements">成果管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>项目获奖</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">项目名称:</span>
            <Input
              placeholder="请输入"
              className={`${UI_CONSTANTS.INPUT_HEIGHT} w-48`}
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">项目编号:</span>
            <Input
              placeholder="请输入"
              className={`${UI_CONSTANTS.INPUT_HEIGHT} w-48`}
              value={searchParams.projectNo}
              onChange={(e) => setSearchParams({ ...searchParams, projectNo: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">获奖名称:</span>
            <Input
              placeholder="请输入"
              className={`${UI_CONSTANTS.INPUT_HEIGHT} w-48`}
              value={searchParams.awardName}
              onChange={(e) => setSearchParams({ ...searchParams, awardName: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
          <Button className="gap-2" onClick={handleSearch}>
            <Search className="h-4 w-4" />
            查询
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              批量删除
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleEdit}>
              修改
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" onClick={handleAdd}>
                  <Plus className="h-4 w-4" />
                  新增
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editMode === "add" ? "新增获奖信息" : "修改获奖信息"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>项目名称:</Label>
                      <Input placeholder="请输入项目名称" />
                    </div>
                    <div className="space-y-2">
                      <Label>项目编号:</Label>
                      <Input placeholder="请输入项目编号" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>获奖名称:</Label>
                      <Input placeholder="请输入获奖名称" />
                    </div>
                    <div className="space-y-2">
                      <Label>颁奖单位:</Label>
                      <Input placeholder="请输入颁奖单位" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>获奖日期:</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>获奖等级:</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="national">国家级</SelectItem>
                          <SelectItem value="provincial">省级</SelectItem>
                          <SelectItem value="municipal">市级</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>获奖描述:</Label>
                    <Textarea rows={4} placeholder="请输入获奖描述" />
                  </div>

                  <div className="space-y-2">
                    <Label>获奖证书附件:</Label>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        上传附件
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        支持pdf, doc/docx, xls/xlsx, ppt/pptx，单个文件大小不超过4M，最多支持10个附件。
                      </span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>确定</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Input type="checkbox" className="h-4 w-4" />
                  </TableHead>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>获奖名称</TableHead>
                  <TableHead>颁奖单位</TableHead>
                  <TableHead>获奖日期</TableHead>
                  <TableHead>获奖等级</TableHead>
                  <TableHead>提交人</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awards.map((award) => (
                  <TableRow key={award.id}>
                    <TableCell>
                      <Input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>{award.projectNo}</TableCell>
                    <TableCell className="font-medium">{award.name || award.projectName || "-"}</TableCell>
                    <TableCell>{award.awardName}</TableCell>
                    <TableCell>{award.awardUnit}</TableCell>
                    <TableCell>{award.awardDate}</TableCell>
                    <TableCell>{award.awardLevel}</TableCell>
                    <TableCell>{award.submitter}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Button variant="link" size="sm" className="p-0 h-auto text-blue-600" onClick={handleEdit}>
                          修改
                        </Button>
                        <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                          详情
                        </Button>
                        <Button variant="link" size="sm" className="p-0 h-auto text-red-600">
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每页显示</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v))
                  setCurrentPage(1)
                }}
              >
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
              <span className="text-sm text-muted-foreground">条，共 {total} 条</span>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
