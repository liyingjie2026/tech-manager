"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/ui/page-header"
import {
  Search,
  FileText,
  TrendingUp,
  Award,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  Download,
  Eye,
  Calendar,
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { assessmentApi } from "@/lib/api/assessment"

interface AnnualMaterial {
  id: string
  year: string
  type: "年度任务书" | "年度任务完成情况报告" | "年度工作总结" | "其他材料"
  fileName: string
  fileSize: string
  uploadTime: string
  status: "待审核" | "已通过" | "已退回"
  deadline: string
  remark?: string
}

interface Assessment {
  id: string
  year: string
  quarter: string
  organization: string
  score: number
  rank: string
  projectCount: number
  completionRate: number
  status: "待评价" | "评价中" | "已完成"
  evaluator: string
  evaluateTime?: string
}

export default function AssessmentPage() {
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    year: "2025",
    type: "",
    file: null as File | null,
    remark: "",
  })
  const [loading, setLoading] = useState(true)

  const [annualMaterials, setAnnualMaterials] = useState<AnnualMaterial[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])

  const [materialsPagination, setMaterialsPagination] = useState({
    page: 1,
    pageSize: UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  })

  const [assessmentsPagination, setAssessmentsPagination] = useState({
    page: 1,
    pageSize: UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
  })

  useEffect(() => {
    fetchData()
  }, [
    materialsPagination.page,
    materialsPagination.pageSize,
    assessmentsPagination.page,
    assessmentsPagination.pageSize,
  ])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [materialsRes, assessmentsRes] = await Promise.all([
        assessmentApi.getMaterials({
          current: materialsPagination.page,
          size: materialsPagination.pageSize,
        }),
        assessmentApi.list({
          current: assessmentsPagination.page,
          size: assessmentsPagination.pageSize,
        }),
      ])

      setAnnualMaterials(materialsRes.data.records || [])
      setMaterialsPagination((prev) => ({ ...prev, total: materialsRes.data.total || 0 }))
      setAssessments(assessmentsRes.data.records || [])
      setAssessmentsPagination((prev) => ({ ...prev, total: assessmentsRes.data.total || 0 }))
    } catch (error) {
      console.error("Failed to load assessment data:", error)
      setAnnualMaterials([])
      setAssessments([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadForm({ ...uploadForm, file })
    }
  }

  const handleUploadSubmit = async () => {
    try {
      await assessmentApi.uploadMaterial({
        year: uploadForm.year,
        type: uploadForm.type,
        fileName: uploadForm.file?.name || "",
        filePath: "/files/assessment/" + uploadForm.file?.name,
        fileSize: uploadForm.file?.size || 0,
        remark: uploadForm.remark,
      })
      setShowUploadDialog(false)
      setUploadForm({ year: "2025", type: "", file: null, remark: "" })
      fetchData()
    } catch (error) {
      console.error("Failed to upload material:", error)
    }
  }

  const summaryStats = {
    totalCount: assessments.length,
    averageScore:
      assessments.length > 0 ? (assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length).toFixed(1) : "0",
    excellentCount: assessments.filter((a) => a.rank === "优秀").length,
    pendingMaterials: annualMaterials.filter((m) => m.status === "待上传").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="考核评价"
        subtitle="根据湖南省自然资源厅要求，定期对科研机构进行考核评价"
        backHref="/dashboard"
      />

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本年度考核次数</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalCount}</div>
            <p className="text-xs text-gray-500 mt-1">季度考核</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均分数</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.averageScore}</div>
            <p className="text-xs text-green-600 mt-1">基于实际数据</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">优秀次数</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.excellentCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              占比{" "}
              {summaryStats.totalCount > 0
                ? ((summaryStats.excellentCount / summaryStats.totalCount) * 100).toFixed(0)
                : 0}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待上传材料</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.pendingMaterials}</div>
            <p className="text-xs text-orange-600 mt-1">请及时上传</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>年度材料上传</CardTitle>
            <Button onClick={() => setShowUploadDialog(true)} className={UI_CONSTANTS.BUTTON_HEIGHT}>
              <Plus className="h-4 w-4 mr-2" />
              上传材料
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 材料上传提醒 */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">材料上传提醒</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• 年度任务书：每年1月31日前提交</li>
                  <li>• 年度任务完成情况报告：每年6月30日前提交上年度报告</li>
                  <li>• 年度工作总结：每年1月31日前提交上年度总结</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 已上传材料列表 */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>年度</TableHead>
                <TableHead>材料类型</TableHead>
                <TableHead>文件名称</TableHead>
                <TableHead>文件大小</TableHead>
                <TableHead>上传时间</TableHead>
                <TableHead>截止日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {annualMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.year}年</TableCell>
                  <TableCell className="font-medium">{material.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {material.fileName}
                    </div>
                  </TableCell>
                  <TableCell>{material.fileSize}</TableCell>
                  <TableCell>{material.uploadTime}</TableCell>
                  <TableCell>{material.deadline}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        material.status === "已通过"
                          ? "default"
                          : material.status === "待审核"
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        material.status === "已通过"
                          ? "bg-green-100 text-green-800"
                          : material.status === "待审核"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {material.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" title="预览">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="下载">
                        <Download className="h-4 w-4" />
                      </Button>
                      {material.status === "待审核" && (
                        <Button variant="ghost" size="sm" title="删除" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {materialsPagination.total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">每页显示</span>
                <Select
                  value={materialsPagination.pageSize.toString()}
                  onValueChange={(value) =>
                    setMaterialsPagination({ ...materialsPagination, page: 1, pageSize: Number.parseInt(value) })
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
                        materialsPagination.page > 1 &&
                        setMaterialsPagination({ ...materialsPagination, page: materialsPagination.page - 1 })
                      }
                      className={materialsPagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {[...Array(Math.ceil(materialsPagination.total / materialsPagination.pageSize))].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setMaterialsPagination({ ...materialsPagination, page: i + 1 })}
                        isActive={materialsPagination.page === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        materialsPagination.page <
                          Math.ceil(materialsPagination.total / materialsPagination.pageSize) &&
                        setMaterialsPagination({ ...materialsPagination, page: materialsPagination.page + 1 })
                      }
                      className={
                        materialsPagination.page >= Math.ceil(materialsPagination.total / materialsPagination.pageSize)
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

      {/* 考核列表 */}
      <Card>
        <CardHeader>
          <CardTitle>考核记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <Label>评价年度</Label>
              <Select defaultValue="2025">
                <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025年</SelectItem>
                  <SelectItem value="2024">2024年</SelectItem>
                  <SelectItem value="2023">2023年</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>评价季度</Label>
              <Select>
                <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                  <SelectValue placeholder="请选择季度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1">第一季度</SelectItem>
                  <SelectItem value="q2">第二季度</SelectItem>
                  <SelectItem value="q3">第三季度</SelectItem>
                  <SelectItem value="q4">第四季度</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>评价状态</Label>
              <Select>
                <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="待评价">待评价</SelectItem>
                  <SelectItem value="评价中">评价中</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className={UI_CONSTANTS.BUTTON_HEIGHT}>
                <Search className="h-4 w-4 mr-2" />
                查询
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>评价年度</TableHead>
                <TableHead>评价季度</TableHead>
                <TableHead>机构名称</TableHead>
                <TableHead>项目数量</TableHead>
                <TableHead>完成率</TableHead>
                <TableHead>评价分数</TableHead>
                <TableHead>评价等级</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>评价人</TableHead>
                <TableHead>评价时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.year}</TableCell>
                  <TableCell>{assessment.quarter}</TableCell>
                  <TableCell className="font-medium">{assessment.organization}</TableCell>
                  <TableCell>{assessment.projectCount}</TableCell>
                  <TableCell>{assessment.completionRate}%</TableCell>
                  <TableCell className="font-medium">{assessment.score}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assessment.rank === "优秀" ? "default" : assessment.rank === "良好" ? "secondary" : "outline"
                      }
                    >
                      {assessment.rank}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assessment.status === "已完成"
                          ? "default"
                          : assessment.status === "评价中"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {assessment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{assessment.evaluator}</TableCell>
                  <TableCell>{assessment.evaluateTime || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" size="sm">
                      查看详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {assessmentsPagination.total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">每页显示</span>
                <Select
                  value={assessmentsPagination.pageSize.toString()}
                  onValueChange={(value) =>
                    setAssessmentsPagination({ ...assessmentsPagination, page: 1, pageSize: Number.parseInt(value) })
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
                        assessmentsPagination.page > 1 &&
                        setAssessmentsPagination({ ...assessmentsPagination, page: assessmentsPagination.page - 1 })
                      }
                      className={assessmentsPagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {[...Array(Math.ceil(assessmentsPagination.total / assessmentsPagination.pageSize))].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setAssessmentsPagination({ ...assessmentsPagination, page: i + 1 })}
                        isActive={assessmentsPagination.page === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        assessmentsPagination.page <
                          Math.ceil(assessmentsPagination.total / assessmentsPagination.pageSize) &&
                        setAssessmentsPagination({ ...assessmentsPagination, page: assessmentsPagination.page + 1 })
                      }
                      className={
                        assessmentsPagination.page >=
                        Math.ceil(assessmentsPagination.total / assessmentsPagination.pageSize)
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

      {/* 评价标准说明 */}
      <Card>
        <CardHeader>
          <CardTitle>评价标准说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">评价维度</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 项目完成情况（40分）：按时完成率、质量评价等</li>
              <li>• 成果产出（30分）：论文、专利、软著、技术标准等</li>
              <li>• 经费使用（20分）：预算执行率、经费使用合规性等</li>
              <li>• 团队建设（10分）：人才培养、团队稳定性等</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">评价等级</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 优秀：90分及以上</li>
              <li>• 良好：80-89分</li>
              <li>• 合格：60-79分</li>
              <li>• 不合格：60分以下</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>上传年度材料</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  年度 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={uploadForm.year}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025年</SelectItem>
                    <SelectItem value="2024">2024年</SelectItem>
                    <SelectItem value="2023">2023年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  材料类型 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={uploadForm.type}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择材料类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="年度任务书">年度任务书</SelectItem>
                    <SelectItem value="年度任务完成情况报告">年度任务完成情况报告</SelectItem>
                    <SelectItem value="年度工作总结">年度工作总结</SelectItem>
                    <SelectItem value="其他材料">其他材料</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                上传文件 <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  {uploadForm.file ? (
                    <div className="text-sm">
                      <span className="text-blue-600 font-medium">{uploadForm.file.name}</span>
                      <p className="text-gray-500 mt-1">点击重新选择文件</p>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <span className="text-blue-600 font-medium">点击上传文件</span>
                      <p className="text-gray-500 mt-1">支持 PDF、Word、Excel 格式，最大 50MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>备注说明</Label>
              <Textarea
                placeholder="请输入备注说明（选填）"
                value={uploadForm.remark}
                onChange={(e) => setUploadForm({ ...uploadForm, remark: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              取消
            </Button>
            <Button onClick={handleUploadSubmit} disabled={!uploadForm.type || !uploadForm.file}>
              确认上传
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
