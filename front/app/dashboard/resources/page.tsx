"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Eye, EyeOff, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { resourceApi } from "@/lib/api"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("instruments")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  // 科研仪器数据
  const [instruments, setInstruments] = useState([])
  const [dataResources, setDataResources] = useState([])
  const [softwareResources, setSoftwareResources] = useState([])

  const [instrumentsPage, setInstrumentsPage] = useState(1)
  const [dataPage, setDataPage] = useState(1)
  const [softwarePage, setSoftwarePage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [instrumentsTotal, setInstrumentsTotal] = useState(0)
  const [dataTotal, setDataTotal] = useState(0)
  const [softwareTotal, setSoftwareTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (activeTab === "instruments") {
          const response = await resourceApi.getEquipmentList({ page: instrumentsPage, size: pageSize })
          setInstruments(response.data.items || [])
          setInstrumentsTotal(response.data.total || 0)
        } else if (activeTab === "data") {
          const response = await resourceApi.getDataList({ page: dataPage, size: pageSize })
          setDataResources(response.data.items || [])
          setDataTotal(response.data.total || 0)
        } else if (activeTab === "software") {
          const response = await resourceApi.getSoftwareList({ page: softwarePage, size: pageSize })
          setSoftwareResources(response.data.items || [])
          setSoftwareTotal(response.data.total || 0)
        }
      } catch (error) {
        console.error("Failed to load resources:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeTab, instrumentsPage, dataPage, softwarePage, pageSize])

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[{ label: "首页", href: "/dashboard" }, { label: "资源共享" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">资源共享管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            维护本单位的科研仪器、基础数据和专业软件资源，支持自主选择是否公开展示
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加资源
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>添加资源</DialogTitle>
              <DialogDescription>填写资源信息并选择是否公开展示</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>资源类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择资源类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instrument">科研仪器</SelectItem>
                      <SelectItem value="data">基础数据</SelectItem>
                      <SelectItem value="software">专业软件</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>资源名称</Label>
                  <Input placeholder="请输入资源名称" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>型号/版本</Label>
                  <Input placeholder="请输入型号或版本号" />
                </div>
                <div className="space-y-2">
                  <Label>类别</Label>
                  <Input placeholder="请输入资源类别" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>资源描述</Label>
                <Textarea placeholder="请输入资源的详细描述" rows={3} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">公开展示</Label>
                  <p className="text-sm text-muted-foreground">
                    开启后，此资源将在门户网站的"共享资源"页面展示，供其他科研机构查看和借阅
                  </p>
                </div>
                <Switch />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">科研仪器</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instruments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              公开展示: {instruments.filter((i) => i.isPublic).length} 台
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">基础数据</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataResources.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              公开展示: {dataResources.filter((d) => d.isPublic).length} 项
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">专业软件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{softwareResources.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              公开展示: {softwareResources.filter((s) => s.isPublic).length} 项
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">累计借用次数</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {instruments.reduce((sum, i) => sum + i.borrowCount, 0) +
                dataResources.reduce((sum, d) => sum + d.borrowCount, 0) +
                softwareResources.reduce((sum, s) => sum + s.borrowCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">将作为年度考核依据</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="instruments">科研仪器</TabsTrigger>
          <TabsTrigger value="data">基础数据</TabsTrigger>
          <TabsTrigger value="software">专业软件</TabsTrigger>
        </TabsList>

        <TabsContent value="instruments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>科研仪器列表</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="搜索仪器..."
                    className={UI_CONSTANTS.INPUT_WIDTH_MD}
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                  />
                  <Button variant="outline" size="icon" className={UI_CONSTANTS.BUTTON_HEIGHT}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>仪器名称</TableHead>
                    <TableHead>型号</TableHead>
                    <TableHead>类别</TableHead>
                    <TableHead>位置</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>公开状态</TableHead>
                    <TableHead>借用次数</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instruments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "正常" ? "default" : "secondary"}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.isPublic ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">公开</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">私有</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.borrowCount} 次</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">每页显示</span>
                  <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={String(size)}>
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
                        onClick={() => setInstrumentsPage(Math.max(1, instrumentsPage - 1))}
                        className={instrumentsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(Math.ceil(instrumentsTotal / pageSize))].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink onClick={() => setInstrumentsPage(i + 1)} isActive={instrumentsPage === i + 1}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setInstrumentsPage(Math.min(Math.ceil(instrumentsTotal / pageSize), instrumentsPage + 1))
                        }
                        className={
                          instrumentsPage >= Math.ceil(instrumentsTotal / pageSize)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>基础数据列表</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="搜索数据..."
                    className={UI_CONSTANTS.INPUT_WIDTH_MD}
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                  />
                  <Button variant="outline" size="icon" className={UI_CONSTANTS.BUTTON_HEIGHT}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>数据名称</TableHead>
                    <TableHead>数据量</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>格式</TableHead>
                    <TableHead>公开状态</TableHead>
                    <TableHead>借用次数</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataResources.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.format}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.isPublic ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">公开</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">私有</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.borrowCount} 次</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">每页显示</span>
                  <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={String(size)}>
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
                        onClick={() => setDataPage(Math.max(1, dataPage - 1))}
                        className={dataPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(Math.ceil(dataTotal / pageSize))].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink onClick={() => setDataPage(i + 1)} isActive={dataPage === i + 1}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setDataPage(Math.min(Math.ceil(dataTotal / pageSize), dataPage + 1))}
                        className={
                          dataPage >= Math.ceil(dataTotal / pageSize)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="software" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>专业软件列表</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="搜索软件..."
                    className={UI_CONSTANTS.INPUT_WIDTH_MD}
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                  />
                  <Button variant="outline" size="icon" className={UI_CONSTANTS.BUTTON_HEIGHT}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>软件名称</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>授权</TableHead>
                    <TableHead>席位数</TableHead>
                    <TableHead>公开状态</TableHead>
                    <TableHead>借用次数</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {softwareResources.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.version}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.license}</TableCell>
                      <TableCell>{item.seats}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.isPublic ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">公开</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">私有</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.borrowCount} 次</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">每页显示</span>
                  <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UI_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={String(size)}>
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
                        onClick={() => setSoftwarePage(Math.max(1, softwarePage - 1))}
                        className={softwarePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(Math.ceil(softwareTotal / pageSize))].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink onClick={() => setSoftwarePage(i + 1)} isActive={softwarePage === i + 1}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setSoftwarePage(Math.min(Math.ceil(softwareTotal / pageSize), softwarePage + 1))}
                        className={
                          softwarePage >= Math.ceil(softwareTotal / pageSize)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
