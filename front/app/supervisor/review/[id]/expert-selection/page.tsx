"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { projectApi } from "@/lib/api/project"
import { expertApi } from "@/lib/api/expert"
import { expertReviewApi } from "@/lib/api/expert-review"

export default function ExpertSelectionPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const [projectData, setProjectData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [reviewGroupName, setReviewGroupName] = useState("")
  const [reviewRuleName, setReviewRuleName] = useState("")
  const [reviewDeadline, setReviewDeadline] = useState("")
  const [showDrawnExperts, setShowDrawnExperts] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const [screeningConditions, setScreeningConditions] = useState([{ type: "", value: "", reason: "" }])
  const [specialtyRequirements, setSpecialtyRequirements] = useState([
    {
      specialty: "",
      plannedCount: 3,
      actualCount: 0,
      confirmedCount: 0,
      drawRound: "第1轮次",
    },
  ])
  const [drawnExperts, setDrawnExperts] = useState<any[]>([])
  const [availableExperts, setAvailableExperts] = useState<any[]>([])
  const [selectedExpertIds, setSelectedExpertIds] = useState<number[]>([])
  const [loadingExperts, setLoadingExperts] = useState(false)

  useEffect(() => {
    loadProjectData()
    loadExperts()
  }, [params.id])

  const loadProjectData = async () => {
    try {
      setLoading(true)
      const response = await projectApi.getById(Number(params.id))

      if (response.data) {
        setProjectData(response.data)
      } else {
        toast({
          title: "加载失败",
          description: response.message || "无法加载项目数据",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to load project:", error)
      toast({
        title: "加载失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadExperts = async () => {
    try {
      setLoadingExperts(true)
      const response = await expertApi.getList({
        current: 1,
        size: 100,
      })

      if (response.data) {
        setAvailableExperts(response.data.records || [])
      }
    } catch (error) {
      console.error("Failed to load experts:", error)
    } finally {
      setLoadingExperts(false)
    }
  }

  const addScreeningCondition = () => {
    setScreeningConditions([...screeningConditions, { type: "", value: "", reason: "" }])
  }

  const removeScreeningCondition = (index: number) => {
    setScreeningConditions(screeningConditions.filter((_, i) => i !== index))
  }

  const addSpecialtyRequirement = () => {
    setSpecialtyRequirements([
      ...specialtyRequirements,
      {
        specialty: "",
        plannedCount: 3,
        actualCount: 0,
        confirmedCount: 0,
        drawRound: "第1轮次",
      },
    ])
  }

  const removeSpecialtyRequirement = (index: number) => {
    setSpecialtyRequirements(specialtyRequirements.filter((_, i) => i !== index))
  }

  const handleDrawExperts = () => {
    if (!reviewGroupName.trim()) {
      toast({
        title: "操作失败",
        description: "请填写评审组名称",
        variant: "destructive",
      })
      return
    }

    if (availableExperts.length === 0) {
      toast({
        title: "操作失败",
        description: "当前没有可用的专家，请先在专家管理中添加专家",
        variant: "destructive",
      })
      return
    }

    setLoadingExperts(true)

    setTimeout(() => {
      const requiredCount = specialtyRequirements.reduce((sum, req) => sum + req.plannedCount, 0) || 3

      const shuffled = [...availableExperts].sort(() => Math.random() - 0.5)
      const drawn = shuffled.slice(0, Math.min(requiredCount, availableExperts.length))

      const drawnExpertsWithMetadata = drawn.map((expert: any, index: number) => ({
        id: expert.id,
        name: expert.name,
        specialty: expert.specialty || expert.researchField || "-", // 使用specialty或researchField
        institution: expert.organization || "-", // 映射organization为institution
        phone: expert.phone || "-",
        drawOrder: String(index + 1).padStart(2, "0"),
        confirmStatus: "待确认",
      }))

      setDrawnExperts(drawnExpertsWithMetadata)
      setSelectedExpertIds(drawnExpertsWithMetadata.map((e: any) => e.id))
      setShowDrawnExperts(true)
      setLoadingExperts(false)

      toast({
        title: "抽取成功",
        description: `已成功抽取${drawnExpertsWithMetadata.length}位专家`,
      })
    }, 800)
  }

  const handleDeleteExpert = (expertId: number) => {
    setDrawnExperts(drawnExperts.filter((e) => e.id !== expertId))
    setSelectedExpertIds(selectedExpertIds.filter((id) => id !== expertId))
    toast({
      title: "删除成功",
      description: "已移除该专家",
    })
  }

  const handlePublishReview = () => {
    if (!reviewGroupName.trim()) {
      toast({
        title: "操作失败",
        description: "请填写评审组名称",
        variant: "destructive",
      })
      return
    }

    if (!showDrawnExperts || drawnExperts.length === 0) {
      toast({
        title: "操作失败",
        description: "请先进行专家抽取",
        variant: "destructive",
      })
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmPublish = async () => {
    if (selectedExpertIds.length === 0) {
      toast({
        title: "操作失败",
        description: "请先抽取专家",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await expertReviewApi.createReview({
        projectId: Number(params.id),
        reviewType: "preliminary",
        expertIds: selectedExpertIds,
        reviewDate: reviewDeadline,
      })

      if (response.data) {
        toast({
          title: "发布成功",
          description: `已成功发布评审通知，${selectedExpertIds.length}位专家可在专家端查看评审任务`,
          duration: 5000,
        })

        setShowConfirmDialog(false)

        setTimeout(() => {
          router.push("/supervisor/review")
        }, 2000)
      } else {
        toast({
          title: "发布失败",
          description: response.message || "无法发布评审通知",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to publish review:", error)
      toast({
        title: "发布失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const updatePlannedCount = (index: number, value: string) => {
    const count = Number.parseInt(value) || 0
    const newRequirements = [...specialtyRequirements]
    newRequirements[index].plannedCount = count
    setSpecialtyRequirements(newRequirements)
  }

  const projectName = projectData?.projectName || projectData?.name || "-"

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">项目不存在</p>
          <Button onClick={() => router.back()}>返回</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </Button>
              <h1 className="text-2xl font-semibold">专家抽取</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">项目基本信息</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">项目名称：</span>
                <span>{projectName}</span>
              </div>
              <div>
                <span className="font-medium">申报单位：</span>
                <span>{projectData?.institutionName || "-"}</span>
              </div>
              <div>
                <span className="font-medium">项目负责人：</span>
                <span>{projectData?.leaderName || "-"}</span>
              </div>
            </div>
          </div>

          {loadingExperts ? (
            <div className="rounded-lg border bg-card p-6">
              <div className="text-center text-muted-foreground">加载专家库...</div>
            </div>
          ) : availableExperts.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <div className="text-center">
                <p className="text-yellow-800">当前专家库中没有可用专家，请先在专家管理中添加专家</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-blue-50 border-blue-200 p-6">
              <div className="text-center">
                <p className="text-blue-800">专家库中共有 {availableExperts.length} 位可用专家</p>
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">评审规则</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>评审组名称</Label>
                <Input
                  value={reviewGroupName}
                  onChange={(e) => setReviewGroupName(e.target.value)}
                  placeholder="请输入评审组名称"
                />
              </div>
              <div className="space-y-2">
                <Label>评分规则名称</Label>
                <Select value={reviewRuleName} onValueChange={setReviewRuleName}>
                  <SelectTrigger>
                    <SelectValue placeholder="规则名称请搜索" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rule1">评分规则1</SelectItem>
                    <SelectItem value="rule2">评分规则2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">专家抽取屏蔽条件设置</h2>
              <Button variant="link" size="sm" onClick={addScreeningCondition}>
                编辑
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>屏蔽条件分类</TableHead>
                  <TableHead>屏蔽条件值</TableHead>
                  <TableHead>屏蔽原因</TableHead>
                  <TableHead className="w-[140px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {screeningConditions.map((condition, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="专家工作单位（含兼职）" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="institution">专家工作单位（含兼职）</SelectItem>
                          <SelectItem value="expertise">专家姓名</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input placeholder="请输入屏蔽条件值" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="请输入屏蔽原因" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="link" size="sm" onClick={addScreeningCondition}>
                          添加
                        </Button>
                        <Button variant="link" size="sm" onClick={() => removeScreeningCondition(index)}>
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">专业要求设置</h2>
              <Button variant="link" size="sm" onClick={addSpecialtyRequirement}>
                编辑
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>专业类别</TableHead>
                  <TableHead className="w-[140px]">计划抽取专家人数</TableHead>
                  <TableHead className="w-[140px]">实际抽取专家人数</TableHead>
                  <TableHead className="w-[140px]">确定参加人数</TableHead>
                  <TableHead className="w-[120px]">抽取轮次</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specialtyRequirements.map((req, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input placeholder="选择专业类别" defaultValue={req.specialty} />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={req.plannedCount}
                        onChange={(e) => updatePlannedCount(index, e.target.value)}
                        className="text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={req.actualCount} readOnly className="text-center" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={req.confirmedCount} readOnly className="text-center" />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{req.drawRound}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="link" size="sm" onClick={addSpecialtyRequirement}>
                          添加
                        </Button>
                        <Button variant="link" size="sm" onClick={() => removeSpecialtyRequirement(index)}>
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">评审设置</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>评审截止日期</Label>
                <Input type="date" value={reviewDeadline} onChange={(e) => setReviewDeadline(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" onClick={handleDrawExperts} disabled={loadingExperts}>
              {loadingExperts ? "抽取中..." : "确认抽取"}
            </Button>
          </div>

          {showDrawnExperts && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-medium">专家抽取结果</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">序号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>专业</TableHead>
                    <TableHead>工作单位</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead className="w-[80px]">抽取顺序</TableHead>
                    <TableHead className="w-[80px]">确认人员</TableHead>
                    <TableHead>确认人时间</TableHead>
                    <TableHead className="w-[100px]">参加状态</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drawnExperts.map((expert, index) => (
                    <TableRow key={expert.id}>
                      <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                      <TableCell>{expert.name}</TableCell>
                      <TableCell>{expert.specialty}</TableCell>
                      <TableCell>{expert.institution}</TableCell>
                      <TableCell>{expert.phone}</TableCell>
                      <TableCell>{expert.drawOrder}</TableCell>
                      <TableCell>{expert.confirmStatus}</TableCell>
                      <TableCell>2025-12-13 16:25</TableCell>
                      <TableCell>
                        <Select defaultValue={expert.confirmStatus}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="待确认">待确认</SelectItem>
                            <SelectItem value="参加">参加</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" onClick={() => handleDeleteExpert(expert.id)}>
                          删除
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setShowDrawnExperts(false)}>
                  取消
                </Button>
                <Button onClick={handlePublishReview}>确认并布置评审通知</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认发布评审</DialogTitle>
            <DialogDescription>
              确认后将向{selectedExpertIds.length}位专家发送评审通知，专家可在专家端查看并参与评审。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              取消
            </Button>
            <Button onClick={confirmPublish}>确认发布</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
