import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Eye, Trash2, Power, PowerOff } from "lucide-react"

export default function PublishManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">发布管理</h1>
          <p className="text-sm text-muted-foreground mt-1">发布通知公告、科技快讯、科研成果等信息到首页</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增发布
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
              <Input placeholder="标题关键词" className="pl-9" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="发布类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notice">通知公告</SelectItem>
                <SelectItem value="news">科技快讯</SelectItem>
                <SelectItem value="achievement">科研成果</SelectItem>
                <SelectItem value="download">下载中心</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="发布状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="unpublished">已下线</SelectItem>
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
          <CardTitle className="text-base">发布列表</CardTitle>
          <div className="flex gap-2">
            <Badge variant="default">已发布: 45</Badge>
            <Badge variant="secondary">草稿: 3</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>发布类型</TableHead>
                <TableHead>发布人</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead>浏览量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium max-w-md">关于开展2025年度科技创新项目申报工作的通知</TableCell>
                <TableCell>
                  <Badge variant="outline">通知公告</Badge>
                </TableCell>
                <TableCell>张管理员</TableCell>
                <TableCell>2025-01-15 10:30</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">1,256次</span>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="gap-1">
                    <Power className="h-3 w-3" />
                    已发布
                  </Badge>
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
                      <PowerOff className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium max-w-md">湖南省地质灾害智能监测技术取得重大突破</TableCell>
                <TableCell>
                  <Badge variant="outline">科技快讯</Badge>
                </TableCell>
                <TableCell>李编辑</TableCell>
                <TableCell>2025-01-18 14:20</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">892次</span>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="gap-1">
                    <Power className="h-3 w-3" />
                    已发布
                  </Badge>
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
                      <PowerOff className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium max-w-md">自然资源大数据智能分析平台研究成果展示</TableCell>
                <TableCell>
                  <Badge variant="outline">科研成果</Badge>
                </TableCell>
                <TableCell>王编辑</TableCell>
                <TableCell>2025-01-20 09:15</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">654次</span>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="gap-1">
                    <Power className="h-3 w-3" />
                    已发布
                  </Badge>
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
                      <PowerOff className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium max-w-md">科技项目申报表模板及填写说明</TableCell>
                <TableCell>
                  <Badge variant="outline">下载中心</Badge>
                </TableCell>
                <TableCell>张管理员</TableCell>
                <TableCell>
                  <span className="text-muted-foreground">--</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">--</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">草稿</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="default">
                      <Power className="h-4 w-4 mr-1" />
                      发布
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
