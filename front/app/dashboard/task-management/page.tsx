"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, Eye, FileText, Undo2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { taskBookApi } from "@/lib/api/taskbook"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getStatusText, getStatusColor } from "@/lib/utils/status-maps"

export default function TaskManagementPage() {
  console.log("=====start response.data========")
  const router = useRouter()
  const { toast } = useToast()
  const [taskBooks, setTaskBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const loadTaskBooks = async () => {
    try {
       
      setLoading(true)
      const response = await taskBookApi.getList({ pageNum: currentPage, pageSize })
     
      console.log(JSON.stringify(response.data))
      console.log("=====end response.data========");
      if (response.data) {
        const list = response.data.records || []
        setTaskBooks(list)
        setTotal(response.data.total || list.length)
      }
    } catch (error) {
      console.error("Failed to load task books:", error)
      toast({
        title: "加载失败",
        description: "无法加载任务书列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    
    loadTaskBooks()
  }, [currentPage, pageSize])

  const renderActions = (taskBook: any) => {
    const signStatus = taskBook.signStatus
    const auditStatus = taskBook.status

    // 待提交、待签订 → 任务书拆分、任务书提交
    if (auditStatus === "to_submit" && signStatus === "pending") {
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/dashboard/projects/task/${taskBook.id}/split`)}
          >
            <FileText className="h-4 w-4 mr-1" />
            任务书拆分
          </Button>
          <Button size="sm" onClick={() => handleSubmit(taskBook.id)}>
            <Upload className="h-4 w-4 mr-1" />
            任务书提交
          </Button>
        </div>
      )
    }

    // 待审核、流程中 → 查看、撤回
    if (auditStatus === "pending" && signStatus === "processing") {
      return (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/projects/task/${taskBook.id}`)}>
            <Eye className="h-4 w-4 mr-1" />
            查看
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleWithdraw(taskBook.id)}>
            <Undo2 className="h-4 w-4 mr-1" />
            撤回
          </Button>
        </div>
      )
    }

    // 已审核、流程中 → 查看
    if (auditStatus === "approved" && signStatus === "processing") {
      return (
        <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/projects/task/${taskBook.id}`)}>
          <Eye className="h-4 w-4 mr-1" />
          查看
        </Button>
      )
    }

    // 审核通过、已签订 → 查看
    if (auditStatus === "approved" && signStatus === "signed") {
      return (
        <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/projects/task/${taskBook.id}`)}>
          <Eye className="h-4 w-4 mr-1" />
          查看
        </Button>
      )
    }

    // 默认只显示查看
    return (
      <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/projects/task/${taskBook.id}`)}>
        <Eye className="h-4 w-4 mr-1" />
        查看
      </Button>
    )
  }

  const handleSubmit = async (id: string) => {
    try {
      await taskBookApi.submit(id)
      toast({
        title: "提交成功",
        description: "任务书已提交审核",
      })
      loadTaskBooks()
    } catch (error) {
      toast({
        title: "提交失败",
        description: "任务书提交失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleWithdraw = async (id: string) => {
    try {
      await taskBookApi.withdraw(id)
      toast({
        title: "撤回成功",
        description: "任务书已撤回",
      })
      loadTaskBooks()
    } catch (error) {
      toast({
        title: "撤回失败",
        description: "任务书撤回失败，请重试",
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">任务书管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理我的项目任务书</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索项目名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">搜索</Button>
            <Button variant="outline">重置</Button>
          </div>
        </CardContent>
      </Card>

      {/* Task Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>任务书列表</CardTitle>
          <CardDescription>共 {taskBooks.length} 条任务书记录</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : taskBooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无任务书数据</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务书编号</TableHead>
                    <TableHead>项目名称</TableHead>
                    <TableHead>任务书状态</TableHead>
                    <TableHead>审核状态</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead>签订时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskBooks.map((taskBook) => (
                    <TableRow key={taskBook.id}>
                      <TableCell className="font-mono">{taskBook.taskBookNo || taskBook.id}</TableCell>
                      <TableCell className="font-medium">{taskBook.projectName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(taskBook.signStatus)}>
                          {getStatusText(taskBook.signStatus, "taskbook_sign")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(taskBook.status)}>
                          {getStatusText(taskBook.status, "taskbook_audit")}
                        </Badge>
                      </TableCell>
                      <TableCell>{taskBook.submitTime || "-"}</TableCell>
                      <TableCell>{taskBook.signTime || "-"}</TableCell>
                      <TableCell className="text-right">{renderActions(taskBook)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-4 border-t mt-4">
                <div className="text-sm text-muted-foreground">共 {total} 条</div>
                <div className="flex items-center gap-2">
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(v) => {
                      setPageSize(Number(v))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10条/页</SelectItem>
                      <SelectItem value="20">20条/页</SelectItem>
                      <SelectItem value="50">50条/页</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      上一页
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
