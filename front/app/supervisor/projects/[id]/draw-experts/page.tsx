"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { expertApi } from "@/lib/api/expert"
import { projectApi } from "@/lib/api/project"
import { PageHeader } from "@/components/page-header"
import { Users, Shuffle } from "lucide-react"

export default function DrawExpertsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()

  const [project, setProject] = useState<any>(null)
  const [availableExperts, setAvailableExperts] = useState<any[]>([])
  const [selectedExperts, setSelectedExperts] = useState<number[]>([])
  const [expertCount, setExpertCount] = useState(5)
  const [loading, setLoading] = useState(true)
  const [drawing, setDrawing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    loadProjectAndExperts()
  }, [unwrappedParams.id])

  const loadProjectAndExperts = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading project and experts for ID:", unwrappedParams.id)

      // Load project details
      const projectResponse = await projectApi.getById(Number(unwrappedParams.id))
      console.log("[v0] Project loaded:", projectResponse.data)
      if (projectResponse.data) {
        setProject(projectResponse.data)
      }

      // Load available experts
      const expertsResponse = await expertApi.getList({
        page: 1,
        pageSize: 100,
        status: "active",
      })
      console.log("[v0] Available experts loaded:", expertsResponse.data)
      if (expertsResponse.data) {
        const expertsList = expertsResponse.data.records || expertsResponse.data.list || []
        setAvailableExperts(expertsList)
      }
    } catch (error) {
      console.error("[v0] Failed to load data:", error)
      toast({
        title: "加载失败",
        description: "无法加载项目或专家信息",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRandomDraw = async () => {
    try {
      setDrawing(true)
      console.log("[v0] Drawing experts for project:", unwrappedParams.id, "count:", expertCount)

      const response = await expertApi.drawExperts({
        projectId: Number(unwrappedParams.id),
        count: expertCount,
      })

      console.log("[v0] Draw experts response:", response)

      if (response.success && response.data) {
        const drawnExperts = response.data
        setSelectedExperts(drawnExperts.map((e: any) => e.id))
        toast({
          title: "抽取成功",
          description: `已随机抽取 ${drawnExperts.length} 位专家`,
        })
      } else {
        throw new Error(response.message || "抽取失败")
      }
    } catch (error: any) {
      console.error("[v0] Failed to draw experts:", error)
      toast({
        title: "抽取失败",
        description: error.message || "随机抽取专家失败，请重试",
        variant: "destructive",
      })
    } finally {
      setDrawing(false)
    }
  }

  const handleToggleExpert = (expertId: number) => {
    setSelectedExperts((prev) => (prev.includes(expertId) ? prev.filter((id) => id !== expertId) : [...prev, expertId]))
  }

  const handleConfirm = async () => {
    if (selectedExperts.length === 0) {
      toast({
        title: "请选择专家",
        description: "至少需要选择一位专家",
        variant: "destructive",
      })
      return
    }

    try {
      setConfirming(true)
      console.log("[v0] Confirming expert selection for project:", unwrappedParams.id)
      console.log("[v0] Selected experts:", selectedExperts)

      const response = await expertApi.saveSelection({
        projectId: Number(unwrappedParams.id),
        expertIds: selectedExperts,
        selectionType: "random",
        selectionDate: new Date().toISOString(),
      })

      console.log("[v0] Save selection response:", response)

      if (response.success || response.code === 200) {
        toast({
          title: "确认成功",
          description: "专家已分配，将进入评审流程",
        })
        setTimeout(() => {
          router.push("/supervisor/projects")
        }, 1500)
      } else {
        throw new Error(response.message || "确认失败")
      }
    } catch (error: any) {
      console.error("[v0] Failed to confirm selection:", error)
      toast({
        title: "确认失败",
        description: error.message || "确认专家选择失败，请重试",
        variant: "destructive",
      })
    } finally {
      setConfirming(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <PageHeader
            title="抽取专家"
            description={project ? `${project.name}` : ""}
            showBack
            backUrl="/supervisor/projects"
          />
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-6xl space-y-6">
        {/* Project Info */}
        {project && (
          <Card>
            <CardHeader>
              <CardTitle>项目信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">项目名称：</span>
                  <span className="font-medium">{project.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">申报单位：</span>
                  <span className="font-medium">{project.institutionName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">项目负责人：</span>
                  <span className="font-medium">{project.leaderName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Draw Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              专家抽取
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">抽取数量：</span>
                <Input
                  type="number"
                  min="3"
                  max="10"
                  value={expertCount}
                  onChange={(e) => setExpertCount(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">位专家</span>
              </div>
              <Button onClick={handleRandomDraw} disabled={drawing}>
                <Shuffle className="mr-2 h-4 w-4" />
                {drawing ? "抽取中..." : "随机抽取"}
              </Button>
            </div>

            {selectedExperts.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedExperts.length} 位专家已选择</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Experts List */}
        <Card>
          <CardHeader>
            <CardTitle>可用专家列表</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">选择</TableHead>
                  <TableHead>专家姓名</TableHead>
                  <TableHead>所属单位</TableHead>
                  <TableHead>职称</TableHead>
                  <TableHead>专业领域</TableHead>
                  <TableHead>评审次数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableExperts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      暂无可用专家
                    </TableCell>
                  </TableRow>
                ) : (
                  availableExperts.map((expert) => (
                    <TableRow key={expert.id} className={selectedExperts.includes(expert.id) ? "bg-primary/5" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedExperts.includes(expert.id)}
                          onCheckedChange={() => handleToggleExpert(expert.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{expert.name || expert.expertName}</TableCell>
                      <TableCell>{expert.institution || expert.workUnit}</TableCell>
                      <TableCell>{expert.title || expert.professionalTitle}</TableCell>
                      <TableCell>{expert.specialty || expert.researchField}</TableCell>
                      <TableCell>{expert.reviewCount || 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={confirming || selectedExperts.length === 0}>
            {confirming ? "确认中..." : `确认分配 (${selectedExperts.length}位)`}
          </Button>
        </div>
      </div>
    </div>
  )
}
