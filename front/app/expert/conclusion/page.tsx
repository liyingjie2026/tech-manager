"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataPagination } from "@/components/ui/data-pagination"
import { FileUp, Upload, CheckCircle, Clock, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { expertReviewApi } from "@/lib/api/expert-review"
import { useToast } from "@/hooks/use-toast"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { useRouter } from "next/navigation"
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
interface ExpertReview {
  id: number
  projectId: number
  projectCode: string
  projectName: string
  projectType: string
  institutionName: string
  reviewDeadline: string
  status: string
  conclusionStatus?: string
}

export default function ExpertConclusionPage() {
  const [reviews, setReviews] = useState<ExpertReview[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    waiting: 0,
    uploaded: 0,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadReviews()
    initProjectTypeMap()
  }, [currentPage, pageSize])

  const loadReviews = async () => {
    try {
      setLoading(true)

      const response = await expertReviewApi.getList({
        page: currentPage,
        pageSize: pageSize,
        status: "completed",
      })

      if (response.success && response.data) {
        const reviewList = response.data.records || []
        setReviews(reviewList)
        setTotal(response.data.total || 0)

        const waitingCount = reviewList.filter(
          (r: any) => !r.conclusionStatus || r.conclusionStatus === "pending",
        ).length
        const uploadedCount = reviewList.filter((r: any) => r.conclusionStatus === "uploaded").length

        setStats({
          waiting: waitingCount,
          uploaded: uploadedCount,
        })
      }
    } catch (error) {
      console.error("Failed to load reviews:", error)
      toast({
        title: "加载失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">评审结论上传</h1>
        <p className="text-sm text-muted-foreground mt-1">作为组长，您需要上传最终的评审结论文件</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.waiting}</div>
              <div className="text-sm text-muted-foreground">待上传结论</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.uploaded}</div>
              <div className="text-sm text-muted-foreground">已上传结论</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-blue-500/5 border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FileUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-500 mb-2">组长职责说明</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 作为评审组长，您需要综合所有专家的评审意见</li>
              <li>• 整理并撰写最终的评审结论文件</li>
              <li>• 上传的文件将作为该项目的最终评审结果</li>
              <li>• 支持 PDF、Word 格式，文件大小不超过 20MB</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6 border-b">
          <h3 className="font-semibold">待处理项目</h3>
        </div>
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">暂无待处理的评审项目</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>项目类型</TableHead>
                  <TableHead>申报单位</TableHead>
                  <TableHead>评审日期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => {
                  const isUploaded = review.conclusionStatus === "uploaded"
                  return (
                    <TableRow key={review.id}>
                      <TableCell className="font-mono">{review.projectCode || `PRJ-${review.projectId}`}</TableCell>
                      <TableCell className="font-medium">{review.projectName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getProjectTextType(review.projectType)}</Badge>
                      </TableCell>
                      <TableCell>{review.institutionName || "-"}</TableCell>
                      <TableCell>{review.reviewDeadline}</TableCell>
                      <TableCell>
                        {isUploaded ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            已上传
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                            <Clock className="h-3 w-3 mr-1" />
                            待上传
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/expert/conclusion/${review.id}/reviews`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            查看评审
                          </Button>
                          <Button
                            size="sm"
                            variant={isUploaded ? "outline" : "default"}
                            onClick={() => router.push(`/expert/conclusion/${review.id}/upload`)}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            {isUploaded ? "查看结论" : "上传结论"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="px-6 pb-6">
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
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
