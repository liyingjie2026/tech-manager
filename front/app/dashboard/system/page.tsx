"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrganizationManagementPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    orgName: "湖南省第三测绘院",
    idType: "统一社会信用代码",
    idNumber: "91430000MA4L1234XX",
    province: "湖南省",
    city: "长沙市",
    district: "岳麓区",
    detailedAddress: "麓谷大道123号",
    legalName: "张三",
    legalIdType: "居民身份证",
    legalIdNumber: "430102198501011234",
    qualification: "土地资源",
    qualificationLevel: "甲级",
    loginUsername: "test1",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = () => {
    // 提交逻辑
    setIsEditing(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">单位信息管理</h1>
        {!isEditing && <Button onClick={() => setIsEditing(true)}>编辑</Button>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>单位信息管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="orgName">单位/企业名称</Label>
              <Input
                id="orgName"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                placeholder="请输入企业、个体工商户、政府机关、社会团体的名称"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idType">单位/企业证件号</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.idType}
                  onValueChange={(value) => setFormData({ ...formData, idType: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="统一社会信用代码">统一社会信用代码</SelectItem>
                    <SelectItem value="营业执照">营业执照</SelectItem>
                    <SelectItem value="组织机构代码">组织机构代码</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="请输入企业、个体工商户、政府机关、社会团体证件号码"
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>证件地址</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.province}
                  onValueChange={(value) => setFormData({ ...formData, province: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="选择省份" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="湖南省">湖南省</SelectItem>
                    <SelectItem value="湖北省">湖北省</SelectItem>
                    <SelectItem value="广东省">广东省</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData({ ...formData, city: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="选择地市" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="长沙市">长沙市</SelectItem>
                    <SelectItem value="株洲市">株洲市</SelectItem>
                    <SelectItem value="湘潭市">湘潭市</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData({ ...formData, district: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="选择区县" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="岳麓区">岳麓区</SelectItem>
                    <SelectItem value="芙蓉区">芙蓉区</SelectItem>
                    <SelectItem value="天心区">天心区</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Input
                value={formData.detailedAddress}
                onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
                placeholder="请输入证件详细地址"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="legalName">法定代表人姓名</Label>
              <Input
                id="legalName"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                placeholder="请输入法定代表人姓名"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>法定代表人证件号</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.legalIdType}
                  onValueChange={(value) => setFormData({ ...formData, legalIdType: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="居民身份证">居民身份证</SelectItem>
                    <SelectItem value="护照">护照</SelectItem>
                    <SelectItem value="港澳通行证">港澳通行证</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={formData.legalIdNumber}
                  onChange={(e) => setFormData({ ...formData, legalIdNumber: e.target.value })}
                  placeholder="请输入法定代表人身份证号码"
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>企业资质</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.qualification}
                  onValueChange={(value) => setFormData({ ...formData, qualification: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="土地资源">土地资源</SelectItem>
                    <SelectItem value="测绘资质">测绘资质</SelectItem>
                    <SelectItem value="规划设计">规划设计</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={formData.qualificationLevel}
                  onChange={(e) => setFormData({ ...formData, qualificationLevel: e.target.value })}
                  placeholder="请输入资质名称及等级"
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>账号管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="loginUsername">登录用户名</Label>
              <Input id="loginUsername" value={formData.loginUsername} disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">密码修改</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="请输入新密码"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="confirmPassword">密码确认</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="请再次输入新密码"
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>保存</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
