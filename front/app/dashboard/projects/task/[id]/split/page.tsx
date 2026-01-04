"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, FileDown, Upload, Check } from "lucide-react"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { CreateSubTaskDialog } from "@/components/task/create-subtask-dialog"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { taskBookApi } from "@/lib/api/taskbook" // Updated import path from taskBookApi to taskbook

const 流程中 = "流程中"

const steps = [
  { id: 1, name: "拆分任务书", description: "创建和管理项目任务" },
  { id: 2, name: "导出任务书", description: "导出任务书文档" },
  { id: 3, name: "上传盖章任务书", description: "上传已盖章的任务书" },
  { id: 4, name: "提交审核", description: "提交任务书进行审核" },
]

export default function TaskSplitPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showCreateSubTask, setShowCreateSubTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [exportedTaskBook, setExportedTaskBook] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      if (!id) return

      setLoading(true)
      try {
        const response = await taskBookApi.getTasks(Number(id))
        if (response.data) {
          setTasks(response.data)
        }
      } catch (error) {
        console.error("Failed to load tasks:", error)
        toast({
          title: "加载失败",
          description: "无法加载任务列表",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [id])

  const project = {
    number: "2024KY01",
    name: "****项目数据融合技术研究",
    type: "后补助项目",
    startDate: "2022-01-01",
    endDate: "2022-12-12",
    totalBudget: "20.00",
    specialFunding: "5.00",
    selfFunding: "5.00",
    hostUnit: "****研究院",
    participatingUnit: "湖南省三测绘院",
    researchContent: `研究内容：1.高温地热井高效钻进技术与快速破岩路径钻进技术开发下高温岩体的受力模型型及抗钻规律；地热储层钻进破岩方法及其特机理。
2.高温地热井高效钻进技术，2.高温地热井井筒完整性稳定性技术，高温地热井并筒稳定性力学推导与数理建模，围岩流变影响机理，以及共楚关键装置与稳定技术；3.高温地热井并体检测与稳定技术。
预期成果：1.掌握高温岩体高效钻进技术，提出高温地热井井筒稳定性术了多参数，形成地热井高效取热与综合利用技术，打造示范应用基地；2.发表高水平论文4—5篇；3.获授权国家发明专利2—3项；4.获得国家及省部级级项目2—3项。实用1-2项。`,
  }

  const handleExportTaskBook = () => {
    setExportedTaskBook(true)
    toast({
      title: "导出成功",
      description: "任务书已导出，请盖章后上传",
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      toast({
        title: "上传成功",
        description: "任务书上传成功",
      })
    }
  }

  const handleSubmitReview = () => {
    if (!uploadedFile) {
      toast({
        title: "提示",
        description: "请先上传盖章后的任务书才能提交审核",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "提交成功",
      description: `任务书已提交审核，状态将变更为${流程中}`,
    })
    router.push("/dashboard/projects/task")
  }

  const handleCreateTask = (taskData: any) => {
    const newTask = {
      id: String(tasks.length + 1),
      projectName: project.name,
      taskNumber: `RW${Date.now()}`,
      ...taskData,
    }
    setTasks([...tasks, newTask])
    setShowCreateTask(false)
  }

  const handleCreateSubTask = (subTaskData: any) => {
    const newSubTask = {
      id: String(tasks.length + 1),
      projectName: project.name,
      ...subTaskData,
    }
    setTasks([...tasks, newSubTask])
    setShowCreateSubTask(false)
  }

  const handleNextStep = () => {
    if (currentStep === 1 && tasks.length === 0) {
      toast({
        title: "提示",
        description: "请至少创建一个任务后再继续",
        variant: "destructive",
      })
      return
    }
    if (currentStep === 2 && !exportedTaskBook) {
      toast({
        title: "提示",
        description: "请先导出任务书后再继续",
        variant: "destructive",
      })
      return
    }
    if (currentStep === 3 && !uploadedFile) {
      toast({
        title: "提示",
        description: "请先上传盖章后的任务书再继续",
        variant: "destructive",
      })
      return
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return tasks.length > 0
      case 2:
        return exportedTaskBook
      case 3:
        return uploadedFile !== null
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">任务书拆分</h1>
              <p className="text-sm text-muted-foreground">按步骤完成任务书拆分和提交</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-7xl space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                        currentStep > step.id
                          ? "bg-green-600 text-white"
                          : currentStep === step.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500",
                      )}
                    >
                      {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          currentStep >= step.id ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {step.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-4 mb-8 transition-colors",
                        currentStep > step.id ? "bg-green-600" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Basic Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">项目基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>项目编号：</Label>
                <Input value={project.number} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目名称：</Label>
                <Input value={project.name} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>项目类型：</Label>
                <Select value={project.type} disabled>
                  <SelectTrigger className="bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="后补助项目">后补助项目</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>项目开始时间：</Label>
                  <Input type="date" value={project.startDate} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>项目截止时间：</Label>
                  <Input type="date" value={project.endDate} readOnly className="bg-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>项目总预算（万元）：</Label>
                <Input value={project.totalBudget} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>申请专项经费（万元）：</Label>
                <Input value={project.specialFunding} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>自筹/其他资金（万元）：</Label>
                <Input value={project.selfFunding} readOnly className="bg-muted" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label>项目承担单位（牵头单位）：</Label>
              <Input value={project.hostUnit} readOnly className="bg-muted" />
            </div>
            <div className="mt-4 space-y-2">
              <Label>项目承担单位（参与单位）：</Label>
              <Input value={project.participatingUnit} readOnly className="bg-muted" />
            </div>
            <div className="mt-4 space-y-2">
              <Label>主要研究内容及预期成果：</Label>
              <Textarea value={project.researchContent} rows={5} className="resize-none bg-muted" readOnly />
            </div>
          </CardContent>
        </Card>

        {currentStep === 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold">任务拆分列表</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setShowCreateTask(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" />
                    创建任务
                  </Button>
                  <Button onClick={() => setShowCreateSubTask(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    创建子任务
                  </Button>
                  <Button variant="outline">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    修改
                  </Button>
                  <Button variant="destructive">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    删除任务
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>项目名称</TableHead>
                      <TableHead>项目编号</TableHead>
                      <TableHead>业务类型</TableHead>
                      <TableHead>任务编号</TableHead>
                      <TableHead>任务名称</TableHead>
                      <TableHead>WBS编号</TableHead>
                      <TableHead>任务类型</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{task.projectName}</TableCell>
                        <TableCell className="font-mono">{project.number}</TableCell>
                        <TableCell>任务拆解</TableCell>
                        <TableCell className="font-mono">{task.taskNumber}</TableCell>
                        <TableCell>{task.taskName}</TableCell>
                        <TableCell>{task.wbs}</TableCell>
                        <TableCell>{task.taskType}</TableCell>
                        <TableCell>
                          <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                            详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {tasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>暂无任务，请点击"创建任务"开始拆分</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">导出任务书</h2>
              <div className="text-center py-12 space-y-6">
                <div className="text-muted-foreground">
                  <FileDown className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                  <p className="text-lg">已完成任务拆分，共 {tasks.length} 个任务</p>
                  <p className="mt-2">请导出任务书文档，然后线下盖章后再上传</p>
                </div>
                <Button
                  size="lg"
                  onClick={handleExportTaskBook}
                  disabled={exportedTaskBook}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileDown className="h-5 w-5 mr-2" />
                  {exportedTaskBook ? "已导出任务书" : "导出任务书"}
                </Button>
                {exportedTaskBook && (
                  <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    任务书已导出，请盖章后继续下一步
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">上传已盖章任务书</h2>
              <div className="text-center py-12 space-y-6">
                <div className="text-muted-foreground">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                  <p className="text-lg">请上传已盖章的任务书文档</p>
                  <p className="mt-2 text-sm">支持格式：.doc, .docx, .pdf</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <Button size="lg" className="relative bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-5 w-5 mr-2" />
                    选择文件上传
                    <input
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  {uploadedFile && (
                    <div className="text-sm text-green-600 flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      已上传: {uploadedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">提交审核</h2>
              <div className="text-center py-12 space-y-6">
                <div className="text-muted-foreground">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <p className="text-lg font-medium">所有步骤已完成</p>
                  <div className="mt-6 text-left max-w-md mx-auto space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>已完成任务拆分（{tasks.length} 个任务）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>已导出任务书</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>已上传盖章任务书：{uploadedFile?.name}</span>
                    </div>
                  </div>
                  <p className="mt-6">确认所有信息无误后，点击下方按钮提交审核</p>
                </div>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmitReview}>
                  提交审核
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" size="lg" onClick={handlePrevStep} disabled={currentStep === 1}>
            上一步
          </Button>
          <div className="text-sm text-muted-foreground flex items-center">
            第 {currentStep} 步，共 {steps.length} 步
          </div>
          {currentStep < 4 ? (
            <Button
              size="lg"
              onClick={handleNextStep}
              disabled={!canProceedToNext()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              下一步
            </Button>
          ) : (
            <Button variant="outline" size="lg" onClick={() => router.push("/dashboard/projects/task")}>
              返回列表
            </Button>
          )}
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        projectName={project.name}
        onSubmit={handleCreateTask}
      />

      {/* Create SubTask Dialog */}
      <CreateSubTaskDialog
        open={showCreateSubTask}
        onOpenChange={setShowCreateSubTask}
        projectName={project.name}
        tasks={tasks}
        onSubmit={handleCreateSubTask}
      />
    </div>
  )
}
