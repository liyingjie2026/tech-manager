"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp, Search } from "lucide-react"

interface Qualification {
  id: string
  qualificationType: string
  qualificationLevel: string
  certificateNumber: string
  issuingAuthority: string
  issueDate: string
  expiryDate: string
  status: "待审核" | "已通过" | "已驳回"
  attachmentName?: string
}

export default function QualificationManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [qualifications, setQualifications] = useState<Qualification[]>([])

  const [newQualification, setNewQualification] = useState({
    qualificationType: "",
    qualificationLevel: "",
    certificateNumber: "",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
    attachment: null as File | null,
  })

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call when qualification API is implemented
        // const response = await qualificationApi.getList({ page: 1, size: 100 })
        // setQualifications(response.data.items || [])
        setQualifications([])
      } catch (error) {
        console.error("Failed to load qualifications:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchQualifications()
  }, [])

  const handleSubmit = async () => {
    try {
      // TODO: Call actual API to create qualification
      // await qualificationApi.create(newQualification)
      const qualification: Qualification = {
        id: Date.now().toString(),
        ...newQualification,
        status: "待审核",
        attachmentName: newQualification.attachment?.name,
      }
      setQualifications([...qualifications, qualification])
      setShowDialog(false)
      setNewQualification({
        qualificationType: "",
        qualificationLevel: "",
        certificateNumber: "",
        issuingAuthority: "",
        issueDate: "",
        expiryDate: "",
        attachment: null,
      })
    } catch (error) {
      console.error("Failed to create qualification:", error)
    }
  }

  const filteredQualifications = qualifications.filter((q) => {
    const matchesSearch = q.qualificationType.includes(searchTerm) || q.certificateNumber.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">资质管理</h1>
        <Button onClick={() => setShowDialog(true)}>
          <FileUp className="mr-2 h-4 w-4" />
          新增资质
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索资质类型或证书编号"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="待审核">待审核</SelectItem>
                <SelectItem value="已通过">已通过</SelectItem>
                <SelectItem value="已驳回">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>资质类型</TableHead>
                <TableHead>资质等级</TableHead>
                <TableHead>证书编号</TableHead>
                <TableHead>发证机关</TableHead>
                <TableHead>发证日期</TableHead>
                <TableHead>有效期至</TableHead>
                <TableHead>附件</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQualifications.map((qualification) => (
                <TableRow key={qualification.id}>
                  <TableCell>{qualification.qualificationType}</TableCell>
                  <TableCell>{qualification.qualificationLevel}</TableCell>
                  <TableCell>{qualification.certificateNumber}</TableCell>
                  <TableCell>{qualification.issuingAuthority}</TableCell>
                  <TableCell>{qualification.issueDate}</TableCell>
                  <TableCell>{qualification.expiryDate}</TableCell>
                  <TableCell>
                    {qualification.attachmentName && (
                      <Button variant="link" className="p-0 h-auto">
                        {qualification.attachmentName}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        qualification.status === "已通过"
                          ? "default"
                          : qualification.status === "待审核"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {qualification.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto">
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增资质</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualificationType">资质类型</Label>
                <Select
                  value={newQualification.qualificationType}
                  onValueChange={(value) => setNewQualification({ ...newQualification, qualificationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择资质类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="土地资源">土地资源</SelectItem>
                    <SelectItem value="测绘资质">测绘资质</SelectItem>
                    <SelectItem value="规划设计">规划设计</SelectItem>
                    <SelectItem value="工程咨询">工程咨询</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualificationLevel">资质等级</Label>
                <Select
                  value={newQualification.qualificationLevel}
                  onValueChange={(value) => setNewQualification({ ...newQualification, qualificationLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择资质等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="甲级">甲级</SelectItem>
                    <SelectItem value="乙级">乙级</SelectItem>
                    <SelectItem value="丙级">丙级</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificateNumber">证书编号</Label>
                <Input
                  id="certificateNumber"
                  value={newQualification.certificateNumber}
                  onChange={(e) => setNewQualification({ ...newQualification, certificateNumber: e.target.value })}
                  placeholder="请输入证书编号"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuingAuthority">发证机关</Label>
                <Input
                  id="issuingAuthority"
                  value={newQualification.issuingAuthority}
                  onChange={(e) => setNewQualification({ ...newQualification, issuingAuthority: e.target.value })}
                  placeholder="请输入发证机关"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">发证日期</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={newQualification.issueDate}
                  onChange={(e) => setNewQualification({ ...newQualification, issueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">有效期至</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newQualification.expiryDate}
                  onChange={(e) => setNewQualification({ ...newQualification, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">资质证书附件</Label>
              <Input
                id="attachment"
                type="file"
                onChange={(e) =>
                  setNewQualification({
                    ...newQualification,
                    attachment: e.target.files?.[0] || null,
                  })
                }
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="text-sm text-gray-500">支持上传PDF、JPG、PNG格式文件，大小不超过10MB</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>提交审核</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
