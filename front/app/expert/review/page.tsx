"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Eye, Clock, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { expertReviewApi, type ReviewProject } from "@/lib/api/expert-review"
import { useToast } from "@/hooks/use-toast"
import { getStatusText, getReviewTypeText } from "@/lib/utils/status-maps"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {dictionaryApi} from "@/lib/api/dictionary"
  const defaultProjectTypeMap: Record<string, string> = {
  basic_research: "基础研究",
  applied_research: "应用研究",
  experimental_development: "试验发展",
  // ... 其他默认值
}
const  initProjectTypeMap= async (): Promise<Record<string, string>> => {
  try {
    const response = await dictionaryApi.getByType("project_type");
  
    const records = response.data?.records || [];
    const dynamicMap: Record<string, string> = {};
    
    records.forEach(item => {
      if (item.itemValue && item.itemLabel) {
        dynamicMap[item.itemValue] = item.itemLabel;
      }
    });
    
    // 合并映射，动态数据覆盖默认值
    return { ...defaultProjectTypeMap, ...dynamicMap };
  } catch (error) {
    console.error("获取项目类型失败，使用默认值:", error);
    return defaultProjectTypeMap;
  }
};


  const getProjectTextType =  (projectType:string)  =>
  {
      return defaultProjectTypeMap[projectType];
  }
export default function ExpertReviewPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [reviews, setReviews] = useState<ReviewProject[]>([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const { toast } = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const getCurrentExpertId = () => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        return user.id || user.expertId || user.userId
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }
    return null
  }

  const loadReviews = async () => {
    setLoading(true)
    try {
      const expertId = getCurrentExpertId()

      const response = await expertReviewApi.getList({
        page: currentPage,
        pageSize,
        keyword: searchTerm || undefined,
        status: activeTab !== "all" ? activeTab : undefined,
        expertId: expertId || undefined,
      })

      if (response.success && response.data) {
        const records = response.data.records || []
        setReviews(records)
        setTotal(response.data.total || records.length)

        setStatistics({
          pending: records.filter((r: any) => r.status === "pending").length,
          approved: records.filter((r: any) => r.status === "approved").length,
          rejected: records.filter((r: any) => r.status === "rejected").length,
        })
      } else {
        toast({
          title: "加载失败",
          description: response.message || "无法加载评审项目",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error loading expert reviews:", error)
      toast({
        title: "加载失败",
        description: error.message || "网络错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
    initProjectTypeMap()
  }, [activeTab, currentPage, pageSize])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, any> = {
      pending: { variant: "secondary" as const, icon: Clock, color: "text-orange-500" },
      approved: { variant: "default" as const, icon: CheckCircle, color: "text-green-500" },
      rejected: { variant: "destructive" as const, icon: AlertCircle, color: "text-red-500" },
    }
    return statusConfig[status] || statusConfig.pending
  }

  const formatDate = (dateTime: any) => {
    if (!dateTime) return "-"
    try {
      const date = new Date(dateTime)
      return date.toLocaleDateString("zh-CN")
    } catch (e) {
      return "-"
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">待评审项目</h1>
        <p className="text-sm text-muted-foreground mt-1">查看并完成分配给您的评审任务</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{statistics.pending}</div>
              <div className="text-sm text-muted-foreground">待审核</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{statistics.approved}</div>
              <div className="text-sm text-muted-foreground">已通过</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{statistics.rejected}</div>
              <div className="text-sm text-muted-foreground">已驳回</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Tabs */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="请输入项目名称或项目编号"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={loadReviews}>
            <Filter className="h-4 w-4 mr-2" />
            查询
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="pending">待审核</TabsTrigger>
            <TabsTrigger value="approved">已通过</TabsTrigger>
            <TabsTrigger value="rejected">已驳回</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Review List */}
      <Card>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">暂无评审项目</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>项目类型</TableHead>
                  <TableHead>申报单位</TableHead>
                  <TableHead>评审类型</TableHead>
                  <TableHead>截止时间</TableHead>
                  <TableHead>评审状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => {
                  const statusConfig = getStatusBadge(review.status)
                  const Icon = statusConfig.icon
                  return (
                    <TableRow key={review.id}>
                      <TableCell className="font-mono">{review.projectNo || review.projectId}</TableCell>
                      <TableCell className="font-medium">{review.projectName || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getProjectTextType(review.projectType) || "-"}</Badge>
                      </TableCell>
                      <TableCell>{review.institutionName || review.institution || "-"}</TableCell>
                      <TableCell>
                        <Badge>{getReviewTypeText(review.reviewType)}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(review.reviewEndTime || review.deadline)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${statusConfig.color}`} />
                          <Badge variant={statusConfig.variant}>{getStatusText(review.status, "review")}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/expert/review/${review.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              查看
                            </Button>
                          </Link>
                          {review.status === "pending" && (
                            <Link href={`/expert/review/${review.id}`}>
                              <Button size="sm">专家评审</Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-4 border-t">
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
      </Card>
    </div>
  )
}
