"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, Eye, Plus, FileText } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"

export default function DemandsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    // 需求提出单位
    unitName: "湖南省第三测绘院",
    location: "长沙市天心区",
    contactName: "胡歌",
    contactPhone: "13111929202",
    contactIdCard: "430625199203112931",
    // 需求具体信息
    demandName: "",
    field: "",
    expectedLevel: "",
    currentMaturityLevel: "",
    targetMaturityLevel: "",
    breakthroughTypes: [] as string[],
    totalInvestment: "200.00",
    suggestedFunding: "200.00",
    projectType: "",
    duration: "",
    // 大文本框
    researchBackground: "",
    keyProblems: "",
    expectedResults: "",
    expectedBenefits: "",
    technicalIndicators: "",
  })

  const fields = ["工业技术", "工业技术", "工业技术", "工业技术", "工业技术", "工业技术", "工业技术", "工业技术"]
  const expectedLevels = ["国际领先", "国际先进", "国内领先", "国内先进", "其他"]
  const maturityLevels = ["1级", "2级", "3级", "4级", "5级", "6级", "7级", "8级", "9级"]
  const breakthroughTypeOptions = [
    "卡脖子技术",
    "填补国内空白技术",
    "国产化替代",
    "前沿颠覆性技术",
    "关键共性技术",
    "其他",
  ]
  const projectTypes = ["重大项目", "一般项目", "重点项目", "一般项目", "其他"]
  const durations = ["1年", "2年", "3年"]

  const handleBreakthroughTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        breakthroughTypes: [...prev.breakthroughTypes, type],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        breakthroughTypes: prev.breakthroughTypes.filter((t) => t !== type),
      }))
    }
  }

  const handleSubmit = () => {
    console.log("提交需求:", formData)
    setShowAddDialog(false)
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">需求征集</h1>
          <p className="text-sm text-muted-foreground mt-1">查看和提交科研需求，参与揭榜挂帅</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增需求
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="需求名称/关键词" className={`${UI_CONSTANTS.INPUT_HEIGHT} pl-9`} />
            </div>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                <SelectValue placeholder="需求领域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disaster">地质灾害</SelectItem>
                <SelectItem value="planning">国土规划</SelectItem>
                <SelectItem value="ecology">生态保护</SelectItem>
                <SelectItem value="survey">资源勘查</SelectItem>
                <SelectItem value="monitoring">智慧监管</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.INPUT_HEIGHT}>
                <SelectValue placeholder="需求状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">征集中</SelectItem>
                <SelectItem value="bidding">揭榜中</SelectItem>
                <SelectItem value="closed">已结束</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button className="flex-1">查询</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">需求列表</CardTitle>
          <div className="flex gap-2">
            <Badge variant="default">征集中: 12</Badge>
            <Badge variant="secondary">揭榜中: 8</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>需求编号</TableHead>
                <TableHead>需求名称</TableHead>
                <TableHead>需求领域</TableHead>
                <TableHead>发布单位</TableHead>
                <TableHead>经费预算</TableHead>
                <TableHead>截止日期</TableHead>
                <TableHead>需求状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono">DM2025001</TableCell>
                <TableCell className="font-medium">地质灾害风险智能评估系统开发</TableCell>
                <TableCell>
                  <Badge variant="outline">地质灾害</Badge>
                </TableCell>
                <TableCell>改革发展与科技处</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">100万元</span>
                </TableCell>
                <TableCell>2025-03-31</TableCell>
                <TableCell>
                  <Badge variant="default">征集中</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      查看详情
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      我要揭榜
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">DM2025002</TableCell>
                <TableCell className="font-medium">国土空间规划大数据分析平台</TableCell>
                <TableCell>
                  <Badge variant="outline">国土规划</Badge>
                </TableCell>
                <TableCell>自然资源事务中心</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">80万元</span>
                </TableCell>
                <TableCell>2025-04-15</TableCell>
                <TableCell>
                  <Badge variant="secondary">揭榜中</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      查看详情
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">DM2025003</TableCell>
                <TableCell className="font-medium">生态保护修复效果监测技术研究</TableCell>
                <TableCell>
                  <Badge variant="outline">生态保护</Badge>
                </TableCell>
                <TableCell>改革发展与科技处</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">60万元</span>
                </TableCell>
                <TableCell>2025-03-20</TableCell>
                <TableCell>
                  <Badge variant="default">征集中</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      查看详情
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      我要揭榜
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[95vw] min-w-[900px] w-auto max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="sr-only">新增需求</DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-2">
            {/* 一、需求提出单位 */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600"></span>
                一、需求提出单位
              </h3>
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      单位名称：
                    </td>
                    <td className="border border-gray-300 px-2 py-2 min-w-[200px]">
                      <Input
                        value={formData.unitName}
                        onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                        className="border-0 shadow-none h-8"
                      />
                    </td>
                    <td className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      所在市州（县市区）：
                    </td>
                    <td className="border border-gray-300 px-2 py-2 min-w-[180px]">
                      <Select
                        value={formData.location}
                        onValueChange={(v) => setFormData({ ...formData, location: v })}
                      >
                        <SelectTrigger className="border-0 shadow-none h-8">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="长沙市天心区">长沙市天心区</SelectItem>
                          <SelectItem value="长沙市岳麓区">长沙市岳麓区</SelectItem>
                          <SelectItem value="长沙市芙蓉区">长沙市芙蓉区</SelectItem>
                          <SelectItem value="株洲市">株洲市</SelectItem>
                          <SelectItem value="湘潭市">湘潭市</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      联系人姓名：
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="border-0 shadow-none h-8"
                      />
                    </td>
                    <td className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      联系人电话：
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="border-0 shadow-none h-8"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      联系人身份证号：
                    </td>
                    <td className="border border-gray-300 px-2 py-2" colSpan={3}>
                      <Input
                        value={formData.contactIdCard}
                        onChange={(e) => setFormData({ ...formData, contactIdCard: e.target.value })}
                        className="border-0 shadow-none h-8 max-w-[300px]"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 二、需求具体信息 */}
            <div>
              <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600"></span>
                二、需求具体信息
              </h3>
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {/* 需求名称 */}
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 w-36 whitespace-nowrap">需求名称：</td>
                    <td className="border border-gray-300 px-2 py-2" colSpan={3}>
                      <Input
                        className="border-0 shadow-none h-8 px-2"
                        placeholder="请输入需求名称"
                        value={formData.demandName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, demandName: e.target.value }))}
                      />
                    </td>
                  </tr>

                  {/* 所属领域 */}
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">所属领域：</td>
                    <td className="border border-gray-300 px-2 py-3" colSpan={3}>
                      <RadioGroup
                        value={formData.field}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, field: v }))}
                        className="flex flex-wrap gap-x-6 gap-y-2"
                      >
                        {fields.map((field, index) => (
                          <div key={index} className="flex items-center space-x-1.5">
                            <RadioGroupItem value={`${field}-${index}`} id={`field-${index}`} className="h-4 w-4" />
                            <Label htmlFor={`field-${index}`} className="font-normal cursor-pointer text-sm">
                              {field}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </td>
                  </tr>

                  {/* 预期水平 */}
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">预期水平：</td>
                    <td className="border border-gray-300 px-2 py-3" colSpan={3}>
                      <RadioGroup
                        value={formData.expectedLevel}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, expectedLevel: v }))}
                        className="flex flex-wrap gap-x-6 gap-y-2"
                      >
                        {expectedLevels.map((level) => (
                          <div key={level} className="flex items-center space-x-1.5">
                            <RadioGroupItem value={level} id={`level-${level}`} className="h-4 w-4" />
                            <Label htmlFor={`level-${level}`} className="font-normal cursor-pointer text-sm">
                              {level}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </td>
                  </tr>

                  {/* 技术成熟度等级 */}
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 text-center" colSpan={4}>
                      <span className="font-medium">技术成熟度等级</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">当前等级</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Select
                        value={formData.currentMaturityLevel}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, currentMaturityLevel: v }))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          {maturityLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">攻关后等级</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Select
                        value={formData.targetMaturityLevel}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, targetMaturityLevel: v }))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          {maturityLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>

                  {/* 攻关类型 */}
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">攻关类型（可多选）</td>
                    <td className="border border-gray-300 px-2 py-3" colSpan={3}>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {breakthroughTypeOptions.map((type) => (
                          <div key={type} className="flex items-center space-x-1.5">
                            <Checkbox
                              id={`type-${type}`}
                              checked={formData.breakthroughTypes.includes(type)}
                              onCheckedChange={(checked) => handleBreakthroughTypeChange(type, checked as boolean)}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer text-sm">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>

                  {/* 预期研发投入 */}
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 text-center" colSpan={4}>
                      <span className="font-medium">预期研发投入</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">总投资：</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="h-8 w-32"
                          value={formData.totalInvestment}
                          onChange={(e) => setFormData((prev) => ({ ...prev, totalInvestment: e.target.value }))}
                        />
                        <span className="text-sm">万元</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">建议财政支持经费：</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="h-8 w-32"
                          value={formData.suggestedFunding}
                          onChange={(e) => setFormData((prev) => ({ ...prev, suggestedFunding: e.target.value }))}
                        />
                        <span className="text-sm">万元</span>
                      </div>
                    </td>
                  </tr>

                  {/* 建议项目类型 */}
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">建议项目类型：</td>
                    <td className="border border-gray-300 px-2 py-3" colSpan={3}>
                      <RadioGroup
                        value={formData.projectType}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, projectType: v }))}
                        className="flex flex-wrap gap-x-6 gap-y-2"
                      >
                        {projectTypes.map((type, index) => (
                          <div key={index} className="flex items-center space-x-1.5">
                            <RadioGroupItem value={`${type}-${index}`} id={`project-${index}`} className="h-4 w-4" />
                            <Label htmlFor={`project-${index}`} className="font-normal cursor-pointer text-sm">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </td>
                  </tr>

                  {/* 攻关时限 */}
                  <tr className="border-b">
                    <td className="border border-gray-300 bg-muted/30 whitespace-nowrap">攻关时限：</td>
                    <td className="border border-gray-300 px-2 py-3" colSpan={3}>
                      <RadioGroup
                        value={formData.duration}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, duration: v }))}
                        className="flex flex-wrap gap-x-6 gap-y-2"
                      >
                        {durations.map((d) => (
                          <div key={d} className="flex items-center space-x-1.5">
                            <RadioGroupItem value={d} id={`duration-${d}`} className="h-4 w-4" />
                            <Label htmlFor={`duration-${d}`} className="font-normal cursor-pointer text-sm">
                              {d}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 大文本框区域 */}
            <div className="mt-6 space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  1、研究背景和攻关目的、意义（简要说明研究背景、组织该项科技攻关的必要性和意义，限800字）
                </Label>
                <Textarea
                  className="mt-2 min-h-[100px]"
                  placeholder="请描述项目实施后预期产生的社会经济效益..."
                  value={formData.researchBackground}
                  onChange={(e) => setFormData((prev) => ({ ...prev, researchBackground: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">2、拟解决的关键科技问题，技术路线及可行性，限800字</Label>
                <Textarea
                  className="mt-2 min-h-[100px]"
                  placeholder="请描述项目实施后预期产生的社会经济效益..."
                  value={formData.keyProblems}
                  onChange={(e) => setFormData((prev) => ({ ...prev, keyProblems: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  3、预期成果及水平，明确预期科技攻关成果和不少于5项的技术指标参数。成果需量化，作为项目结题考核指标，限500字
                </Label>
                <Textarea
                  className="mt-2 min-h-[100px]"
                  placeholder="请描述项目实施后预期产生的社会经济效益..."
                  value={formData.expectedResults}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expectedResults: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  4、预期效益。（阐述突破该项技术在经济、社会、生态等各方面的效益，限300字）
                </Label>
                <Textarea
                  className="mt-2 min-h-[100px]"
                  placeholder="请描述项目实施后预期产生的社会经济效益..."
                  value={formData.expectedBenefits}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expectedBenefits: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  5、技术指标对标分析（技术拥有单位及主要量化技术指标，限300字）
                </Label>
                <Textarea
                  className="mt-2 min-h-[100px]"
                  placeholder="请描述项目成果的转化应用计划..."
                  value={formData.technicalIndicators}
                  onChange={(e) => setFormData((prev) => ({ ...prev, technicalIndicators: e.target.value }))}
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-center mt-6">
              <Button onClick={handleSubmit} className="px-12">
                提交
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
