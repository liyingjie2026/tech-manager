"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Eye, Download, BookOpen, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { resourceApi } from "@/lib/api"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { PageHeader } from "@/components/ui/page-header"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Achievement {
  id: string
  projectName: string
  projectCode: string
  institution: string
  leader: string
  members: string[]
  startDate: string
  endDate: string
  keywords: string[]
  category: string
  description: string
  results: string
  borrowCount: number
  referenceCount: number
  status: "已结题" | "进行中"
}

interface BorrowApplication {
  id: string
  achievementId: string
  achievementName: string
  applicant: string
  institution: string
  applyDate: string
  borrowType: "线上借阅" | "成果下载" | "实体借阅"
  purpose: string
  status: "待审核" | "已通过" | "已拒绝"
}

export default function ResourceSharingPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [myApplications, setMyApplications] = useState<BorrowApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    projectName: "",
    leader: "",
    institution: "",
    startDate: "",
    endDate: "",
    category: "全部", // Updated default value to be a non-empty string
  })

  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showBorrowDialog, setShowBorrowDialog] = useState(false)
  const [borrowForm, setBorrowForm] = useState({
    borrowType: "线上借阅" as BorrowApplication["borrowType"],
    purpose: "",
  })

  const [achievementsPage, setAchievementsPage] = useState(1)
  const [applicationsPage, setApplicationsPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [achievementsTotal, setAchievementsTotal] = useState(0)
  const [applicationsTotal, setApplicationsTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [achievementsRes, applicationsRes] = await Promise.all([
          resourceApi.getDataList({ page: achievementsPage, size: pageSize }),
          resourceApi.getBorrowRequests({ page: applicationsPage, size: pageSize }),
        ])
        setAchievements(achievementsRes.data.items || [])
        setAchievementsTotal(achievementsRes.data.total || 0)
        setMyApplications(applicationsRes.data.items || [])
        setApplicationsTotal(applicationsRes.data.total || 0)
      } catch (error) {
        console.error("Failed to load resource data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [achievementsPage, applicationsPage, pageSize])

  const handleViewDetail = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setShowDetailDialog(true)
  }

  const handleBorrowApply = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setShowBorrowDialog(true)
  }

  const handleSubmitBorrow = async () => {
    if (!selectedAchievement) return
    try {
      await resourceApi.createBorrowRequest({
        achievementId: selectedAchievement.id,
        borrowType: borrowForm.borrowType,
        purpose: borrowForm.purpose,
      })
      setShowBorrowDialog(false)
      setBorrowForm({ borrowType: "线上借阅", purpose: "" })
    } catch (error) {
      console.error("Failed to submit borrow request:", error)
    }
  }

  const filteredAchievements = achievements.filter((achievement) => {
    if (searchFilters.keyword && !achievement.keywords.some((k) => k.includes(searchFilters.keyword))) return false
    if (searchFilters.projectName && !achievement.projectName.includes(searchFilters.projectName)) return false
    if (searchFilters.leader && !achievement.leader.includes(searchFilters.leader)) return false
    if (searchFilters.institution && !achievement.institution.includes(searchFilters.institution)) return false
    if (searchFilters.category !== "全部" && achievement.category !== searchFilters.category) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader title="科研成果检索与借阅" subtitle="查询和借阅已完成的科研项目成果资料" backHref="/dashboard" />

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">成果检索</TabsTrigger>
          <TabsTrigger value="my-borrow">我的借阅申请</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          {/* Search filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">检索条件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyword">关键词</Label>
                  <Input
                    id="keyword"
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                    value={searchFilters.keyword}
                    onChange={(e) => setSearchFilters({ ...searchFilters, keyword: e.target.value })}
                    placeholder="请输入关键词"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">项目名称</Label>
                  <Input
                    id="projectName"
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                    value={searchFilters.projectName}
                    onChange={(e) => setSearchFilters({ ...searchFilters, projectName: e.target.value })}
                    placeholder="请输入项目名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leader">项目负责人</Label>
                  <Input
                    id="leader"
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                    value={searchFilters.leader}
                    onChange={(e) => setSearchFilters({ ...searchFilters, leader: e.target.value })}
                    placeholder="请输入负责人姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">所属单位</Label>
                  <Input
                    id="institution"
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                    value={searchFilters.institution}
                    onChange={(e) => setSearchFilters({ ...searchFilters, institution: e.target.value })}
                    placeholder="请输入单位名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">开始时间</Label>
                  <Input
                    id="startDate"
                    type="date"
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                    value={searchFilters.startDate}
                    onChange={(e) => setSearchFilters({ ...searchFilters, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">结束时间</Label>
                  <Input
                    id="endDate"
                    type="date"
                    style={{ height: UI_CONSTANTS.INPUT_HEIGHT }}
                    value={searchFilters.endDate}
                    onChange={(e) => setSearchFilters({ ...searchFilters, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">项目类别</Label>
                  <Select
                    value={searchFilters.category}
                    onValueChange={(value) => setSearchFilters({ ...searchFilters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全部">全部</SelectItem>
                      <SelectItem value="标准项目">标准项目</SelectItem>
                      <SelectItem value="重大项目">重大项目</SelectItem>
                      <SelectItem value="一般项目">一般项目</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full" style={{ height: UI_CONSTANTS.BUTTON_HEIGHT }}>
                    <Search className="h-4 w-4 mr-2" />
                    查询
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">检索结果</CardTitle>
                <span className="text-sm text-gray-500">共 {achievementsTotal} 个成果</span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">加载中...</div>
              ) : achievements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">暂无数据</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>项目名称</TableHead>
                      <TableHead>项目编号</TableHead>
                      <TableHead>所属单位</TableHead>
                      <TableHead>项目负责人</TableHead>
                      <TableHead>项目时间</TableHead>
                      <TableHead>项目类别</TableHead>
                      <TableHead>借用次数</TableHead>
                      <TableHead>引用次数</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {achievements.map((achievement) => (
                      <TableRow key={achievement.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate" title={achievement.projectName}>
                            {achievement.projectName}
                          </div>
                        </TableCell>
                        <TableCell>{achievement.projectCode}</TableCell>
                        <TableCell>{achievement.institution}</TableCell>
                        <TableCell>{achievement.leader}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {achievement.startDate} 至 {achievement.endDate}
                        </TableCell>
                        <TableCell>{achievement.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-blue-500" />
                            {achievement.borrowCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            {achievement.referenceCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={achievement.status === "已结题" ? "default" : "secondary"}>
                            {achievement.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetail(achievement)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleBorrowApply(achievement)}>
                              <BookOpen className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
                        onClick={() => setAchievementsPage(Math.max(1, achievementsPage - 1))}
                        className={achievementsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(Math.min(7, Math.ceil(achievementsTotal / pageSize)))].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setAchievementsPage(i + 1)}
                          isActive={achievementsPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setAchievementsPage(Math.min(Math.ceil(achievementsTotal / pageSize), achievementsPage + 1))
                        }
                        className={
                          achievementsPage >= Math.ceil(achievementsTotal / pageSize)
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

        <TabsContent value="my-borrow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">我的借阅申请</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">加载中...</div>
              ) : myApplications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">暂无数据</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>项目名称</TableHead>
                      <TableHead>申请人</TableHead>
                      <TableHead>申请单位</TableHead>
                      <TableHead>申请时间</TableHead>
                      <TableHead>借阅方式</TableHead>
                      <TableHead>申请用途</TableHead>
                      <TableHead>审核状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate" title={app.achievementName}>
                            {app.achievementName}
                          </div>
                        </TableCell>
                        <TableCell>{app.applicant}</TableCell>
                        <TableCell>{app.institution}</TableCell>
                        <TableCell>{app.applyDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{app.borrowType}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={app.purpose}>
                            {app.purpose}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              app.status === "已通过"
                                ? "default"
                                : app.status === "待审核"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {app.status === "已通过" && (
                            <Button variant="ghost" size="sm">
                              {app.borrowType === "成果下载" ? (
                                <>
                                  <Download className="h-4 w-4 mr-1" />
                                  下载
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  查看
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>科研成果详情</DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">项目名称</Label>
                  <p className="mt-1 font-medium">{selectedAchievement.projectName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">项目编号</Label>
                  <p className="mt-1">{selectedAchievement.projectCode}</p>
                </div>
                <div>
                  <Label className="text-gray-500">所属单位</Label>
                  <p className="mt-1">{selectedAchievement.institution}</p>
                </div>
                <div>
                  <Label className="text-gray-500">项目负责人</Label>
                  <p className="mt-1">{selectedAchievement.leader}</p>
                </div>
                <div>
                  <Label className="text-gray-500">项目成员</Label>
                  <p className="mt-1">{selectedAchievement.members.join("、")}</p>
                </div>
                <div>
                  <Label className="text-gray-500">项目类别</Label>
                  <p className="mt-1">{selectedAchievement.category}</p>
                </div>
                <div>
                  <Label className="text-gray-500">开始时间</Label>
                  <p className="mt-1">{selectedAchievement.startDate}</p>
                </div>
                <div>
                  <Label className="text-gray-500">结束时间</Label>
                  <p className="mt-1">{selectedAchievement.endDate}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-500">关键词</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedAchievement.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-500">项目描述</Label>
                <p className="mt-1 text-sm leading-relaxed">{selectedAchievement.description}</p>
              </div>

              <div>
                <Label className="text-gray-500">研究成果</Label>
                <p className="mt-1 text-sm leading-relaxed">{selectedAchievement.results}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedAchievement.borrowCount}</p>
                  <p className="text-sm text-gray-500 mt-1">借用次数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedAchievement.referenceCount}</p>
                  <p className="text-sm text-gray-500 mt-1">引用次数</p>
                </div>
                <div className="text-center">
                  <Badge
                    className="text-base px-4 py-2"
                    variant={selectedAchievement.status === "已结题" ? "default" : "secondary"}
                  >
                    {selectedAchievement.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">项目状态</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              关闭
            </Button>
            <Button
              onClick={() => {
                setShowDetailDialog(false)
                if (selectedAchievement) handleBorrowApply(selectedAchievement)
              }}
            >
              申请借阅
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBorrowDialog} onOpenChange={setShowBorrowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>申请借阅</DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-500">项目名称</Label>
                <p className="mt-1 font-medium">{selectedAchievement.projectName}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="borrowType">借阅方式 *</Label>
                <Select
                  value={borrowForm.borrowType}
                  onValueChange={(value: BorrowApplication["borrowType"]) =>
                    setBorrowForm({ ...borrowForm, borrowType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="线上借阅">线上借阅</SelectItem>
                    <SelectItem value="成果下载">成果下载</SelectItem>
                    <SelectItem value="实体借阅">实体借阅</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {borrowForm.borrowType === "线上借阅" && "在线查看项目成果材料"}
                  {borrowForm.borrowType === "成果下载" && "下载项目成果文件到本地"}
                  {borrowForm.borrowType === "实体借阅" && "借阅项目实体材料档案"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">借阅用途 *</Label>
                <Textarea
                  id="purpose"
                  value={borrowForm.purpose}
                  onChange={(e) => setBorrowForm({ ...borrowForm, purpose: e.target.value })}
                  placeholder="请说明借阅该成果的目的和用途，例如：借鉴研究思路、技术方法参考、项目申报参考等"
                  rows={4}
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>温馨提示：</strong>
                  <br />
                  1. 借阅申请需经主管部门审核通过后方可生效
                  <br />
                  2. 借阅材料仅供学习参考，严禁用于商业用途
                  <br />
                  3. 借阅和引用次数将作为成果价值考核的参考依据
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBorrowDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitBorrow} disabled={!borrowForm.purpose.trim()}>
              提交申请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
