"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, RotateCcw } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DataPagination } from "@/components/ui/data-pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { achievementApi } from "@/lib/api/achievement"
import { useToast } from "@/hooks/use-toast"

export default function AchievementsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isRelatedToProject, setIsRelatedToProject] = useState("yes")
  const [searchParams, setSearchParams] = useState({
    name: "",
    achievementName: "",
    achievementType: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [currentPage, pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await achievementApi.getList({
        page: currentPage,
        pageSize: pageSize,
        ...searchParams,
      })

      if (response.data) {
        const listData = response.data.records || response.data.list || []
        const totalCount = response.data.total || listData.length
        setAchievements(listData)
        setTotal(totalCount)
      }
    } catch (error) {
      console.error("Failed to load achievements:", error)
      toast({
        title: "加载失败",
        description: "无法加载成果列表",
        variant: "destructive",
      })
      setAchievements([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadData()
  }

  const handleReset = () => {
    setSearchParams({ name: "", achievementName: "", achievementType: "" })
    setCurrentPage(1)
    loadData()
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[{ label: "首页", href: "/dashboard" }, { label: "成果管理" }]} />

      <Card>
        <CardHeader>
          <CardTitle>成果查询</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">项目名称:</span>
              <Input
                placeholder="请输入内容"
                className={UI_CONSTANTS.INPUT_HEIGHT}
                value={searchParams.name}
                onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">成果名称:</span>
              <Input
                placeholder="请输入内容"
                className={UI_CONSTANTS.INPUT_HEIGHT}
                value={searchParams.achievementName}
                onChange={(e) => setSearchParams({ ...searchParams, achievementName: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap w-20">成果类型:</span>
              <Input
                placeholder="请输入内容"
                className={UI_CONSTANTS.INPUT_HEIGHT}
                value={searchParams.achievementType}
                onChange={(e) => setSearchParams({ ...searchParams, achievementType: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
            <Button className="gap-2" onClick={handleSearch}>
              <Search className="h-4 w-4" />
              查询
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>成果列表</CardTitle>
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  新增成果
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>成果信息维护</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Section 1: Basic Information */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>供给单位:</Label>
                        <Input defaultValue="湖南省第三测绘院" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>是否关联项目:</Label>
                        <RadioGroup
                          value={isRelatedToProject}
                          onValueChange={setIsRelatedToProject}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes" />
                            <Label htmlFor="yes">是</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no" />
                            <Label htmlFor="no">否</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>项目名称:</Label>
                        <Input placeholder="搜索选择" />
                      </div>
                      <div className="space-y-2">
                        <Label>知识产权类型:</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="patent">专利</SelectItem>
                            <SelectItem value="copyright">著作权</SelectItem>
                            <SelectItem value="trademark">商标</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>知识产权编号:</Label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <Label>成果体现形式:</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="report">研究报告</SelectItem>
                            <SelectItem value="software">软件</SelectItem>
                            <SelectItem value="standard">标准规范</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>成果属性:</Label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <Label>成果所属领域:</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="国土空间规划" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urban-planning">国土空间规划</SelectItem>
                            <SelectItem value="surveying">测绘地理信息</SelectItem>
                            <SelectItem value="remote-sensing">遥感技术</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>主题词:</Label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <Label>第一完成单位:</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择单位" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unit1">单位一</SelectItem>
                            <SelectItem value="unit2">单位二</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>单位性质:</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择单位性质" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">事业单位</SelectItem>
                          <SelectItem value="private">企业</SelectItem>
                          <SelectItem value="university">高校</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>成果简介:</Label>
                      <Textarea rows={4} />
                    </div>

                    <div className="space-y-2">
                      <Label>应用范围:</Label>
                      <Textarea rows={4} />
                    </div>

                    <div className="space-y-2">
                      <Label>前景分析:</Label>
                      <Textarea rows={4} />
                    </div>

                    <div className="space-y-2">
                      <Label>成果附件:</Label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          上传附件
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          未选择文件（支持pdf, doc/docx, xls/xlsx, ppt/pptx，单个文件不大于4M，最多支持10个附件。）
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Information */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold">联系信息维护</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>联系人:</Label>
                        <Input defaultValue="胡歌" />
                      </div>
                      <div className="space-y-2">
                        <Label>联系电话:</Label>
                        <Input defaultValue="153281829198" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>通讯地址:</Label>
                      <Input defaultValue="湖南省长沙市天心区芙蓉南路222号地信大厦A座" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Edit className="h-4 w-4" />
              修改
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              批量删除
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Input type="checkbox" className="h-4 w-4" />
                  </TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>成果名称</TableHead>
                  <TableHead>成果类型</TableHead>
                  <TableHead>提交人</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "已审批" ? "default" : "secondary"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.projectNo}</TableCell>
                    <TableCell className="font-medium">{item.name || item.projectName || "-"}</TableCell>
                    <TableCell>{item.achievementName}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.submitter}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/achievements/${item.id}`}>
                          <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                            详情
                          </Button>
                        </Link>
                        <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                          预览
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            total={total}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </div>
  )
}
