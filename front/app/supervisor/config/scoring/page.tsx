"use client"

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
import { Search, Plus, Edit, Eye, Copy, Star } from "lucide-react"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { useState } from "react"

export default function ScoringConfigPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(3) // Mock total, will be replaced by API

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">评分规则</h1>
          <p className="text-sm text-muted-foreground mt-1">配置不同项目类型的评分标准和权重</p>
        </div>
        <Button className={UI_CONSTANTS.FORM.BUTTON_HEIGHT}>
          <Plus className="h-4 w-4 mr-2" />
          新增规则
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 md:grid-cols-3 ${UI_CONSTANTS.FORM.GRID_GAP}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="规则名称" className={`pl-9 ${UI_CONSTANTS.FORM.INPUT_HEIGHT}`} />
            </div>
            <Select>
              <SelectTrigger className={UI_CONSTANTS.FORM.SELECT_HEIGHT}>
                <SelectValue placeholder="项目类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">一般项目</SelectItem>
                <SelectItem value="youth">青年项目</SelectItem>
                <SelectItem value="major">重大项目</SelectItem>
                <SelectItem value="application">应用技术类</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button className={`flex-1 ${UI_CONSTANTS.FORM.BUTTON_HEIGHT}`}>查询</Button>
              <Button variant="outline" className={`flex-1 bg-transparent ${UI_CONSTANTS.FORM.BUTTON_HEIGHT}`}>
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">评分规则列表</CardTitle>
          <Badge variant="default">启用中: 4</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>规则名称</TableHead>
                <TableHead>适用项目类型</TableHead>
                <TableHead>评分维度</TableHead>
                <TableHead>总分</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">一般项目评分标准（2025版）</TableCell>
                <TableCell>
                  <Badge variant="outline">一般项目</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>创新性(30分)</div>
                    <div>可行性(25分)</div>
                    <div>团队能力(25分)</div>
                    <div>预期成果(20分)</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">100分</span>
                  </div>
                </TableCell>
                <TableCell>2025-01-01</TableCell>
                <TableCell>
                  <Badge variant="default">启用中</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">青年项目评分标准（2025版）</TableCell>
                <TableCell>
                  <Badge variant="outline">青年项目</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>创新性(30分)</div>
                    <div>可行性(25分)</div>
                    <div>团队能力(25分)</div>
                    <div>预期成果(20分)</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">100分</span>
                  </div>
                </TableCell>
                <TableCell>2025-01-01</TableCell>
                <TableCell>
                  <Badge variant="default">启用中</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">重大项目评分标准（2025版）</TableCell>
                <TableCell>
                  <Badge variant="outline">重大项目</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>战略意义(35分)</div>
                    <div>技术创新(30分)</div>
                    <div>实施方案(20分)</div>
                    <div>产出效益(15分)</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">100分</span>
                  </div>
                </TableCell>
                <TableCell>2025-01-01</TableCell>
                <TableCell>
                  <Badge variant="default">启用中</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">应用技术类评分标准（2025版）</TableCell>
                <TableCell>
                  <Badge variant="outline">应用技术类</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>技术先进性(30分)</div>
                    <div>应用价值(30分)</div>
                    <div>推广前景(25分)</div>
                    <div>实施能力(15分)</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">100分</span>
                  </div>
                </TableCell>
                <TableCell>2025-01-01</TableCell>
                <TableCell>
                  <Badge variant="default">启用中</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每页显示</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                共 {total} 条，第 {currentPage} / {totalPages} 页
              </span>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>{currentPage}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
