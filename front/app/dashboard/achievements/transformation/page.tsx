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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, Plus } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { achievementApi } from "@/lib/api/achievement"
import { PageHeader } from "@/components/ui/page-header"

export default function AchievementTransformationPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [transformations, setTransformations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isRelatedToProject, setIsRelatedToProject] = useState("yes")
  const [searchParams, setSearchParams] = useState({
    achievementName: "",
    inLibrary: "all",
  })

  useEffect(() => {
    loadData()
  }, [currentPage, pageSize])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await achievementApi.getTransformations({
        current: currentPage,
        size: pageSize,
        ...searchParams,
      })

      if (response.data) {
        setTransformations(response.data.records || response.data.list || [])
        setTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error("Failed to load transformations:", error)
      setTransformations([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadData()
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="成果转化" subtitle="管理科研成果转化案例" backHref="/dashboard/achievements" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">成果管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>成果转化</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">成果名称:</span>
            <Input
              placeholder="请输入"
              className={`${UI_CONSTANTS.INPUT_HEIGHT} w-64`}
              value={searchParams.achievementName}
              onChange={(e) => setSearchParams({ ...searchParams, achievementName: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">是否入成果库:</span>
            <Select
              value={searchParams.inLibrary}
              onValueChange={(v) => setSearchParams({ ...searchParams, inLibrary: v })}
            >
              <SelectTrigger className={`${UI_CONSTANTS.INPUT_HEIGHT} w-32`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="yes">是</SelectItem>
                <SelectItem value="no">否</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="gap-2" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          查询
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                新增转化案例
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增转化案例</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>成果名称:</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="成果1" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="achievement1">成果1</SelectItem>
                      <SelectItem value="achievement2">成果2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>是否关联项目:</Label>
                    <RadioGroup value={isRelatedToProject} onValueChange={setIsRelatedToProject} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="trans-yes" />
                        <Label htmlFor="trans-yes">是</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="trans-no" />
                        <Label htmlFor="trans-no">否</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>关联项目名称:</Label>
                    <Input placeholder="模糊搜索" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>成果建设单位:</Label>
                  <Input defaultValue="湖南省第三测绘院" disabled />
                </div>

                <div className="space-y-2">
                  <Label>成果简要:</Label>
                  <Textarea
                    rows={3}
                    placeholder="续填C02070201成果信息维护内页面的成果简介"
                    className="text-sm text-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>研发周期:</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1年</SelectItem>
                        <SelectItem value="2years">2年</SelectItem>
                        <SelectItem value="3years">3年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>成果转化时间:</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>转化方式及过程:</Label>
                  <Textarea rows={4} />
                </div>

                <div className="space-y-2">
                  <Label>转化收益:</Label>
                  <Textarea rows={4} />
                </div>

                <div className="space-y-2">
                  <Label>单位内部或外部的第三方技术转移机构发挥的作用:</Label>
                  <Textarea rows={4} />
                </div>

                <div className="space-y-2">
                  <Label>收益的分配情况:</Label>
                  <Textarea rows={4} />
                </div>

                <div className="space-y-2">
                  <Label>转化成果应用领域:</Label>
                  <Textarea rows={4} />
                </div>

                <div className="space-y-2">
                  <Label>产生的经济和社会效益:</Label>
                  <Textarea rows={4} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  取消
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  保存
                </Button>
                <Button onClick={() => setDialogOpen(false)}>提交</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Input type="checkbox" className="h-4 w-4" />
                  </TableHead>
                  <TableHead>序号</TableHead>
                  <TableHead>成果名称</TableHead>
                  <TableHead>关联项目</TableHead>
                  <TableHead>成果建设单位</TableHead>
                  <TableHead>转化时间</TableHead>
                  <TableHead>案例状态</TableHead>
                  <TableHead>转化成果</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transformations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>{item.no}</TableCell>
                    <TableCell className="font-medium">{item.achievementName}</TableCell>
                    <TableCell>{item.relatedProject}</TableCell>
                    <TableCell>{item.constructionUnit}</TableCell>
                    <TableCell>{item.transformationDate}</TableCell>
                    <TableCell>{item.reviewStatus}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        {item.reviewStatus === "待提交" ? (
                          <>
                            <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                              编辑
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-blue-600"
                              onClick={() =>
                                (window.location.href = `/dashboard/achievements/transformation/${item.id}`)
                              }
                            >
                              详情
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-blue-600"
                              onClick={() =>
                                (window.location.href = `/dashboard/achievements/transformation/${item.id}`)
                              }
                            >
                              详情
                            </Button>
                            <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                              撤回
                            </Button>
                          </>
                        )}
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
