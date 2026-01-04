"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { useState, useEffect } from "react"
import { dictionaryApi } from "@/lib/api/dictionary"
import { toast } from "sonner"

interface DictionaryItemDisplay {
  id: number
  dictValue: string
  dictLabel: string
  status: number
  sort: number
  remark?: string
}

interface DictionaryDisplay {
  id: number
  dictType: string
  dictName: string
  status: number
  items: DictionaryItemDisplay[]
}

export default function DictionaryConfigPage() {
  const [activeTab, setActiveTab] = useState("nature")
  const [dictionaries, setDictionaries] = useState<Record<string, DictionaryDisplay>>({})
  const [loading, setLoading] = useState(false)

  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DictionaryItemDisplay | null>(null)
  const [currentDictId, setCurrentDictId] = useState<number | null>(null)

  const [itemFormData, setItemFormData] = useState({
    dictValue: "",
    dictLabel: "",
    status: 1,
    sort: 0,
    remark: "",
  })

  const dictTypeMap: Record<string, string> = {
    nature: "project_nature",
    type: "project_type",
    category: "project_category",
    task: "task_type",
  }

  const loadDictionaries = async () => {
    setLoading(true)
    try {
      const types = Object.values(dictTypeMap)
      const results = await Promise.all(types.map((type) => dictionaryApi.getByType(type)))

      console.log("[v0] Dictionary API results:", results)

      const dictMap: Record<string, DictionaryDisplay> = {}
      Object.keys(dictTypeMap).forEach((key, index) => {
        const response = results[index]
        let items: DictionaryItemDisplay[] = []

        // Backend returns { success, data, message }
        if (response.success && response.data) {
          // Data is an array of { id, label, value, sort, description }
          console.log(`[v0] Processing ${key} with data:`, response.data)

          items = (response.data as any[]).map((item: any) => {
            console.log(`[v0] Item ${item.id}:`, {
              value: item.value,
              label: item.label,
              description: item.description,
              sort: item.sort,
            })

            return {
              id: item.id,
              dictValue: item.value || "", // Backend uses 'value'
              dictLabel: item.label || "", // Backend uses 'label'
              status: 1,
              sort: item.sort || 0,
              remark: item.description || "", // Backend uses 'description'
            }
          })

          console.log(`[v0] Processed items for ${key}:`, items)
        }

        dictMap[key] = {
          id: index + 1,
          dictType: dictTypeMap[key],
          dictName: key,
          status: 1,
          items: items,
        }
      })

      console.log("[v0] Final processed dictionaries:", dictMap)
      setDictionaries(dictMap)
    } catch (error) {
      console.error("[v0] Failed to load dictionaries:", error)
      toast.error("加载字典数据失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDictionaries()
  }, [])

  const handleCreateItem = async () => {
    if (!currentDictId) return

    try {
      const response = await dictionaryApi.addItem(currentDictId, itemFormData)
      if (response.success) {
        toast.success("添加成功")
        setIsItemDialogOpen(false)
        resetFormData()
        loadDictionaries()
      } else {
        toast.error(response.message || "添加失败")
      }
    } catch (error) {
      console.error("[v0] Failed to create item:", error)
      toast.error("添加失败")
    }
  }

  const handleUpdateItem = async () => {
    if (!currentDictId || !editingItem) return

    try {
      const updateData = {
        itemValue: itemFormData.dictValue,
        itemLabel: itemFormData.dictLabel,
        sortOrder: itemFormData.sort,
        description: itemFormData.remark,
      }
      console.log("[v0] Updating item - dictId:", currentDictId, "itemId:", editingItem.id, "data:", updateData)

      const response = await dictionaryApi.updateItem(currentDictId, editingItem.id, updateData)
      console.log("[v0] Update response:", response)

      if (response.success) {
        toast.success("更新成功")
        setIsEditDialogOpen(false)
        setEditingItem(null)
        resetFormData()
        await loadDictionaries()
      } else {
        toast.error(response.message || "更新失败")
      }
    } catch (error) {
      console.error("[v0] Failed to update item:", error)
      toast.error("更新失败")
    }
  }

  const handleDeleteItem = async (dictId: number, itemId: number) => {
    if (!confirm("确定要删除这个字典项吗？")) return

    try {
      const response = await dictionaryApi.deleteItem(dictId, itemId)
      if (response.success) {
        toast.success("删除成功")
        loadDictionaries()
      } else {
        toast.error(response.message || "删除失败")
      }
    } catch (error) {
      console.error("[v0] Failed to delete item:", error)
      toast.error("删除失败")
    }
  }

  const handleMoveItem = async (dictId: number, item: DictionaryItemDisplay, direction: "up" | "down") => {
    const newSort = direction === "up" ? item.sort - 1 : item.sort + 1
    try {
      const response = await dictionaryApi.updateItem(dictId, item.id, { sort: newSort })
      if (response.success) {
        toast.success("排序更新成功")
        loadDictionaries()
      }
    } catch (error) {
      console.error("[v0] Failed to move item:", error)
      toast.error("排序更新失败")
    }
  }

  const resetFormData = () => {
    setItemFormData({
      dictValue: "",
      dictLabel: "",
      status: 1,
      sort: 0,
      remark: "",
    })
  }

  const openCreateDialog = (dictId: number) => {
    setCurrentDictId(dictId)
    resetFormData()
    setIsItemDialogOpen(true)
  }

  const openEditDialog = (dictId: number, item: DictionaryItemDisplay) => {
    setCurrentDictId(dictId)
    setEditingItem(item)
    setItemFormData({
      dictValue: item.dictValue,
      dictLabel: item.dictLabel,
      status: item.status,
      sort: item.sort,
      remark: item.remark || "",
    })
    setIsEditDialogOpen(true)
  }

  const renderDictionaryTable = (dictKey: string, title: string) => {
    const dict = dictionaries[dictKey]
    const items = dict?.items || []

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button size="sm" onClick={() => openCreateDialog(dict?.id || 0)}>
            <Plus className="h-4 w-4 mr-2" />
            新增
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">排序</TableHead>
                  <TableHead>字典值</TableHead>
                  <TableHead>字典标签</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.sort}</TableCell>
                    <TableCell className="font-mono">{item.dictValue}</TableCell>
                    <TableCell className="font-medium">{item.dictLabel}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 1 ? "default" : "secondary"}>
                        {item.status === 1 ? "启用" : "禁用"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.remark || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleMoveItem(dict.id, item, "up")}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleMoveItem(dict.id, item, "down")}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(dict.id, item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDeleteItem(dict.id, item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">字典管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理系统中的项目性质、项目类型、项目分类和任务类型等字典数据
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="nature">项目性质</TabsTrigger>
          <TabsTrigger value="type">项目类型</TabsTrigger>
          <TabsTrigger value="category">项目分类</TabsTrigger>
          <TabsTrigger value="task">任务类型</TabsTrigger>
        </TabsList>

        <TabsContent value="nature">{renderDictionaryTable("nature", "项目性质字典")}</TabsContent>

        <TabsContent value="type">{renderDictionaryTable("type", "项目类型字典")}</TabsContent>

        <TabsContent value="category">{renderDictionaryTable("category", "项目分类字典")}</TabsContent>

        <TabsContent value="task">{renderDictionaryTable("task", "任务类型字典")}</TabsContent>
      </Tabs>

      <Dialog
        open={isItemDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsItemDialogOpen(false)
            setIsEditDialogOpen(false)
            setEditingItem(null)
            resetFormData()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "编辑字典项" : "新增字典项"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dictValue">字典值</Label>
              <Input
                id="dictValue"
                value={itemFormData.dictValue}
                onChange={(e) => setItemFormData({ ...itemFormData, dictValue: e.target.value })}
                placeholder="请输入字典值，如：youth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dictLabel">字典标签</Label>
              <Input
                id="dictLabel"
                value={itemFormData.dictLabel}
                onChange={(e) => setItemFormData({ ...itemFormData, dictLabel: e.target.value })}
                placeholder="请输入字典标签，如：一般项目"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <Select
                value={itemFormData.status.toString()}
                onValueChange={(value) => setItemFormData({ ...itemFormData, status: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">启用</SelectItem>
                  <SelectItem value="0">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort">排序</Label>
              <Input
                id="sort"
                type="number"
                value={itemFormData.sort}
                onChange={(e) => setItemFormData({ ...itemFormData, sort: Number.parseInt(e.target.value) || 0 })}
                placeholder="请输入排序号"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remark">备注</Label>
              <Textarea
                id="remark"
                value={itemFormData.remark}
                onChange={(e) => setItemFormData({ ...itemFormData, remark: e.target.value })}
                placeholder="请输入备注信息"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsItemDialogOpen(false)
                setIsEditDialogOpen(false)
                setEditingItem(null)
                resetFormData()
              }}
            >
              取消
            </Button>
            <Button onClick={editingItem ? handleUpdateItem : handleCreateItem}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
