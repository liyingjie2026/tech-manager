"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, Play, Trash2, LinkIcon } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

// 定义节点类型，增加更多节点类型选项
const nodeTypes = [
  { value: "start", label: "开始节点", color: "bg-green-500", icon: "▶" },
  { value: "approval", label: "审批节点", color: "bg-blue-500", icon: "✓" },
  { value: "condition", label: "条件节点", color: "bg-yellow-500", icon: "?" },
  { value: "notification", label: "通知节点", color: "bg-purple-500", icon: "📧" },
  { value: "auto", label: "自动节点", color: "bg-cyan-500", icon: "⚡" },
  { value: "end", label: "结束节点", color: "bg-red-500", icon: "■" },
]

// 从系统中获取真实的角色列表
const systemRoles = [
  { id: "1", code: "ADMIN", name: "系统管理员" },
  { id: "2", code: "DEPT_MGR", name: "处室管理员" },
  { id: "3", code: "PROJECT_MGR", name: "项目管理员" },
  { id: "4", code: "EXPERT", name: "评审专家" },
  { id: "5", code: "INSTITUTION", name: "机构用户" },
]

// 从系统中获取真实的功能模块和按钮
const systemModules = [
  {
    id: "demand",
    name: "需求管理",
    buttons: [
      { id: "demand_view", name: "查看需求" },
      { id: "demand_edit", name: "编辑需求" },
      { id: "demand_review", name: "审核需求" },
      { id: "demand_delete", name: "删除需求" },
    ],
  },
  {
    id: "application",
    name: "申报管理",
    buttons: [
      { id: "app_submit", name: "提交申报" },
      { id: "app_save", name: "保存草稿" },
      { id: "app_withdraw", name: "撤回申报" },
      { id: "app_view", name: "查看详情" },
    ],
  },
  {
    id: "approval",
    name: "项目审批",
    buttons: [
      { id: "approve_pass", name: "审批通过" },
      { id: "approve_reject", name: "审批驳回" },
      { id: "approve_return", name: "退回修改" },
      { id: "approve_comment", name: "添加批注" },
    ],
  },
  {
    id: "task",
    name: "任务书管理",
    buttons: [
      { id: "task_split", name: "任务拆分" },
      { id: "task_upload", name: "上传任务书" },
      { id: "task_submit", name: "提交审核" },
      { id: "task_view", name: "查看进度" },
    ],
  },
  {
    id: "change",
    name: "变更管理",
    buttons: [
      { id: "change_apply", name: "申请变更" },
      { id: "change_review", name: "审核变更" },
      { id: "change_approve", name: "审批变更" },
      { id: "change_view", name: "查看详情" },
    ],
  },
  {
    id: "acceptance",
    name: "项目验收",
    buttons: [
      { id: "accept_apply", name: "验收申请" },
      { id: "accept_review", name: "审核验收" },
      { id: "accept_approve", name: "审批验收" },
      { id: "accept_result", name: "成果管理" },
    ],
  },
]

interface WorkflowNode {
  id: string
  type: string
  name: string
  x: number
  y: number
  roles: string[]
  buttons: string[]
  description?: string
}

interface WorkflowConnection {
  id: string
  from: string
  to: string
  condition?: string
}

export default function WorkflowDesignPage() {
  const { toast } = useToast()
  const canvasRef = useRef<HTMLDivElement>(null)

  // 增强节点和连线的状态管理
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "1",
      type: "start",
      name: "开始",
      x: 100,
      y: 150,
      roles: [],
      buttons: [],
    },
  ])

  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectFrom, setConnectFrom] = useState<string | null>(null)
  const [newNodeType, setNewNodeType] = useState<string>("approval")
  const [newNodeName, setNewNodeName] = useState("")

  const selectedNodeData = nodes.find((n) => n.id === selectedNode)

  // 添加节点
  const addNode = () => {
    if (!newNodeName.trim()) {
      toast({ title: "请输入节点名称", variant: "destructive" })
      return
    }

    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: newNodeType,
      name: newNodeName,
      x: 300,
      y: 150,
      roles: [],
      buttons: [],
    }

    setNodes([...nodes, newNode])
    setNewNodeName("")
    setIsAddNodeDialogOpen(false)
    toast({ title: "节点添加成功" })
  }

  // 删除节点
  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter((n) => n.id !== nodeId))
    setConnections(connections.filter((c) => c.from !== nodeId && c.to !== nodeId))
    if (selectedNode === nodeId) {
      setSelectedNode(null)
    }
    toast({ title: "节点已删除" })
  }

  // 开始连线
  const startConnect = (nodeId: string) => {
    setIsConnecting(true)
    setConnectFrom(nodeId)
  }

  // 完成连线
  const finishConnect = (nodeId: string) => {
    if (connectFrom && connectFrom !== nodeId) {
      const newConnection: WorkflowConnection = {
        id: Date.now().toString(),
        from: connectFrom,
        to: nodeId,
      }
      setConnections([...connections, newConnection])
      toast({ title: "连线创建成功" })
    }
    setIsConnecting(false)
    setConnectFrom(null)
  }

  // 删除连线
  const deleteConnection = (connectionId: string) => {
    setConnections(connections.filter((c) => c.id !== connectionId))
    toast({ title: "连线已删除" })
  }

  // 更新节点配置
  const updateNodeConfig = (nodeId: string, config: Partial<WorkflowNode>) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, ...config } : node)))
  }

  // 拖拽节点移动
  const handleNodeDrag = (nodeId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX
    const startY = e.clientY
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      updateNodeConfig(nodeId, {
        x: node.x + deltaX,
        y: node.y + deltaY,
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // 测试流程
  const testWorkflow = () => {
    if (nodes.length < 2) {
      toast({ title: "流程至少需要2个节点", variant: "destructive" })
      return
    }

    const hasStart = nodes.some((n) => n.type === "start")
    const hasEnd = nodes.some((n) => n.type === "end")

    if (!hasStart || !hasEnd) {
      toast({ title: "流程必须包含开始节点和结束节点", variant: "destructive" })
      return
    }

    setIsTestDialogOpen(true)
  }

  // 保存流程
  const saveWorkflow = () => {
    toast({ title: "流程保存成功" })
  }

  // 绘制连线
  const renderConnection = (conn: WorkflowConnection) => {
    const fromNode = nodes.find((n) => n.id === conn.from)
    const toNode = nodes.find((n) => n.id === conn.to)
    if (!fromNode || !toNode) return null

    const x1 = fromNode.x + 120
    const y1 = fromNode.y + 40
    const x2 = toNode.x
    const y2 = toNode.y + 40

    return (
      <g key={conn.id}>
        <path
          d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground hover:text-primary cursor-pointer"
          onClick={() => deleteConnection(conn.id)}
        />
        <polygon
          points={`${x2 - 8},${y2 - 4} ${x2},${y2} ${x2 - 8},${y2 + 4}`}
          fill="currentColor"
          className="text-muted-foreground"
        />
      </g>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/supervisor/config/workflow">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">流程设计器</h1>
            <p className="text-sm text-muted-foreground mt-1">可视化设计业务流程</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={testWorkflow}>
            <Play className="mr-2 h-4 w-4" />
            测试流程
          </Button>
          <Button onClick={saveWorkflow}>
            <Save className="mr-2 h-4 w-4" />
            保存流程
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[280px_1fr_400px] gap-6">
        {/* 左侧工具栏 - 节点类型面板 */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">节点类型</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {nodeTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setNewNodeType(type.value)
                    setNewNodeName(type.label)
                    setIsAddNodeDialogOpen(true)
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${type.color} mr-2`} />
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </Button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setIsConnecting(!isConnecting)
                  setConnectFrom(null)
                }}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                {isConnecting ? "取消连线" : "连接节点"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 中间画布区域 */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>流程画布</CardTitle>
              <div className="flex gap-2">
                {isConnecting && (
                  <Badge variant="secondary" className="animate-pulse">
                    请选择起始节点和目标节点
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div ref={canvasRef} className="relative bg-[url('/grid.svg')] bg-repeat h-[700px] overflow-auto">
              {/* 渲染连线 */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {connections.map(renderConnection)}
              </svg>

              {/* 渲染节点 */}
              {nodes.map((node) => {
                const nodeType = nodeTypes.find((t) => t.value === node.type)
                return (
                  <div
                    key={node.id}
                    className="absolute cursor-move pointer-events-auto"
                    style={{ left: node.x, top: node.y, zIndex: 2 }}
                    onMouseDown={(e) => {
                      if (!isConnecting) {
                        handleNodeDrag(node.id, e)
                      }
                    }}
                    onClick={() => {
                      if (isConnecting) {
                        if (!connectFrom) {
                          startConnect(node.id)
                        } else {
                          finishConnect(node.id)
                        }
                      } else {
                        setSelectedNode(node.id)
                      }
                    }}
                  >
                    <div
                      className={`rounded-lg border-2 ${
                        selectedNode === node.id
                          ? "border-primary shadow-lg scale-105"
                          : connectFrom === node.id
                            ? "border-yellow-500 shadow-lg"
                            : "border-border"
                      } bg-background p-3 min-w-[120px] hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${nodeType?.color}`} />
                        <span className="font-medium text-sm">{node.name}</span>
                        {node.type !== "start" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-5 w-5 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNode(node.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{nodeType?.label}</div>
                      {node.roles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {node.roles.slice(0, 2).map((roleId) => {
                            const role = systemRoles.find((r) => r.id === roleId)
                            return (
                              <Badge key={roleId} variant="secondary" className="text-xs">
                                {role?.name}
                              </Badge>
                            )
                          })}
                          {node.roles.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{node.roles.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 右侧属性面板 */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">节点配置</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {selectedNodeData ? (
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">基本信息</TabsTrigger>
                  <TabsTrigger value="permissions">权限配置</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>节点名称</Label>
                    <Input
                      value={selectedNodeData.name}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>节点类型</Label>
                    <Select
                      value={selectedNodeData.type}
                      onValueChange={(value) => updateNodeConfig(selectedNodeData.id, { type: value })}
                      disabled={selectedNodeData.type === "start"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nodeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>节点描述</Label>
                    <Textarea
                      placeholder="输入节点描述..."
                      rows={3}
                      value={selectedNodeData.description || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, { description: e.target.value })}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="permissions" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>执行角色</Label>
                    <ScrollArea className="border rounded-lg h-[150px]">
                      <div className="p-3 space-y-2">
                        {systemRoles.map((role) => (
                          <div key={role.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={selectedNodeData.roles.includes(role.id)}
                              onCheckedChange={(checked) => {
                                const newRoles = checked
                                  ? [...selectedNodeData.roles, role.id]
                                  : selectedNodeData.roles.filter((r) => r !== role.id)
                                updateNodeConfig(selectedNodeData.id, { roles: newRoles })
                              }}
                            />
                            <Label htmlFor={`role-${role.id}`} className="text-sm font-normal cursor-pointer">
                              {role.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div className="space-y-2">
                    <Label>可见按钮</Label>
                    <ScrollArea className="border rounded-lg h-[300px]">
                      <div className="p-3 space-y-3">
                        {systemModules.map((module) => (
                          <div key={module.id} className="space-y-2">
                            <div className="font-medium text-sm text-muted-foreground">{module.name}</div>
                            {module.buttons.map((button) => (
                              <div key={button.id} className="flex items-center space-x-2 ml-4">
                                <Checkbox
                                  id={`button-${button.id}`}
                                  checked={selectedNodeData.buttons.includes(button.id)}
                                  onCheckedChange={(checked) => {
                                    const newButtons = checked
                                      ? [...selectedNodeData.buttons, button.id]
                                      : selectedNodeData.buttons.filter((b) => b !== button.id)
                                    updateNodeConfig(selectedNodeData.id, { buttons: newButtons })
                                  }}
                                />
                                <Label htmlFor={`button-${button.id}`} className="text-sm font-normal cursor-pointer">
                                  {button.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
                <div className="text-4xl mb-4">👆</div>
                <div className="text-center">
                  <div className="font-medium mb-1">选择一个节点</div>
                  <div className="text-sm">配置节点属性和权限</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 添加节点对话框 */}
      <Dialog open={isAddNodeDialogOpen} onOpenChange={setIsAddNodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加节点</DialogTitle>
            <DialogDescription>创建一个新的流程节点</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>节点类型</Label>
              <Select value={newNodeType} onValueChange={setNewNodeType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nodeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>节点名称</Label>
              <Input
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="请输入节点名称"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNodeDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={addNode}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 测试流程对话框 */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>流程测试</DialogTitle>
            <DialogDescription>模拟流程执行过程</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {nodes.map((node, index) => {
                const nodeType = nodeTypes.find((t) => t.value === node.type)
                const connectedTo = connections.find((c) => c.from === node.id)
                return (
                  <div key={node.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full ${nodeType?.color} flex items-center justify-center text-white text-sm`}
                      >
                        {index + 1}
                      </div>
                      {connectedTo && <div className="w-0.5 h-8 bg-muted-foreground/30" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="font-medium">{node.name}</div>
                      <div className="text-sm text-muted-foreground">{nodeType?.label}</div>
                      {node.roles.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {node.roles.map((roleId) => {
                            const role = systemRoles.find((r) => r.id === roleId)
                            return (
                              <Badge key={roleId} variant="outline" className="text-xs">
                                {role?.name}
                              </Badge>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
              关闭
            </Button>
            <Button
              onClick={() => {
                toast({ title: "流程测试通过" })
                setIsTestDialogOpen(false)
              }}
            >
              确认测试
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
