"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { demandApi } from "@/lib/api/demand"
import { useToast } from "@/hooks/use-toast"
import { getStatusText, getStatusColor } from "@/lib/utils/status-maps"

export default function DemandManagementPage() {
  const { toast } = useToast()
  const [demands, setDemands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [domainFilter, setDomainFilter] = useState("全部")
  const [levelFilter, setLevelFilter] = useState("全部")
  const [statusFilter, setStatusFilter] = useState("全部")

  useEffect(() => {
    loadDemands()
  }, [])

  const loadDemands = async () => {
    try {
      setLoading(true)
      const response = await demandApi.getList({ page: 1, pageSize: 100 })
      if (response.data) {
        setDemands(response.data.records || response.data.list || [])
      }
    } catch (error) {
      console.error("[v0] Failed to load demands:", error)
      toast({
        title: "加载失败",
        description: "无法加载需求列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="secondary" className={getStatusColor(status)}>
        {getStatusText(status, "demand")}
      </Badge>
    )
  }

  const filteredDemands = demands.filter((demand) => {
    const matchesSearchTerm =
      searchTerm === "" || demand.name?.includes(searchTerm) || demand.title?.includes(searchTerm)
    const matchesDomainFilter =
      domainFilter === "全部" || demand.domain === domainFilter || demand.field === domainFilter
    const matchesLevelFilter =
      levelFilter === "全部" || demand.level === levelFilter || demand.expectedLevel === levelFilter
    const matchesStatusFilter = statusFilter === "全部" || getStatusText(demand.status, "demand") === statusFilter

    return matchesSearchTerm && matchesDomainFilter && matchesLevelFilter && matchesStatusFilter
  })

  const totalCount = demands.length
  const collectingCount = demands.filter((d) => d.status === "pending").length
  const matchedCount = demands.filter((d) => d.status === "approved").length

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">需求总数</p>
              <p className="text-3xl font-bold mt-2">{totalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">征集中</p>
              <p className="text-3xl font-bold mt-2">{collectingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">已匹配</p>
              <p className="text-3xl font-bold mt-2">{matchedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">揭榜总数</p>
              <p className="text-3xl font-bold mt-2">
                {demands.filter((d) => d.bidCount).reduce((sum, d) => sum + (d.bidCount || 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">需求名称</label>
              <div className="relative">
                <Input
                  placeholder="输入关键词搜索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">所属领域</label>
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="就技术领域">就技术领域</SelectItem>
                  <SelectItem value="其他领域">其他领域</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">预期水平</label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="国际领先">国际领先</SelectItem>
                  <SelectItem value="国际先进">国际先进</SelectItem>
                  <SelectItem value="国内领先">国内领先</SelectItem>
                  <SelectItem value="国内先进">国内先进</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">审核状态</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="未审核">未审核</SelectItem>
                  <SelectItem value="审核通过">审核通过</SelectItem>
                  <SelectItem value="已驳回">已驳回</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button>
              <Search className="mr-2 h-4 w-4" />
              查询
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground mb-4">点击审核/查看按钮跳转BD0101</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">序号</TableHead>
                <TableHead>需求名称</TableHead>
                <TableHead>所属领域</TableHead>
                <TableHead>申报单位</TableHead>
                <TableHead>预期水平</TableHead>
                <TableHead>攻关类型</TableHead>
                <TableHead>提报时间</TableHead>
                <TableHead>审核状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : filteredDemands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    暂无需求数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredDemands.map((demand, index) => (
                  <TableRow key={demand.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{demand.name || demand.title}</TableCell>
                    <TableCell>{demand.domain || demand.field}</TableCell>
                    <TableCell>{demand.unit || demand.institutionName}</TableCell>
                    <TableCell>{demand.level || demand.expectedLevel}</TableCell>
                    <TableCell>{demand.type || demand.attackType}</TableCell>
                    <TableCell>{demand.submitTime || demand.createTime}</TableCell>
                    <TableCell>{getStatusBadge(demand.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {demand.status === "pending" ? (
                          <>
                            <Link href={`/supervisor/demand/${demand.id}`}>
                              <Button variant="link" size="sm">
                                查看
                              </Button>
                            </Link>
                            <Link href={`/supervisor/demand/${demand.id}/review`}>
                              <Button variant="link" size="sm">
                                审核
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <Link href={`/supervisor/demand/${demand.id}`}>
                            <Button variant="link" size="sm">
                              查看
                            </Button>
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
