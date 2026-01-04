"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Briefcase, GraduationCap, Award } from "lucide-react"
import { useState, useEffect } from "react"

export default function ExpertProfilePage() {
  const [userInfo, setUserInfo] = useState({
    name: "专家",
    gender: "男",
    phone: "138****8888",
    email: "expert@example.com",
    institution: "湖南省科技厅",
    title: "教授",
    researchDirection: "地理信息系统、空间数据分析",
    specialties: ["地理信息", "数据分析", "空间规划"],
    bio: "长期从事地理信息系统研究...",
  })

  useEffect(() => {
    loadExpertProfile()
  }, [])

  const loadExpertProfile = async () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          const expertId = user.id || user.expertId

          if (expertId) {
            try {
              const response = await fetch(`/api/experts/${expertId}`)
              if (response.ok) {
                const expertData = await response.json()
                setUserInfo({
                  name: expertData.name || expertData.expertName || user.name || "专家",
                  gender: expertData.gender || user.gender || "男",
                  phone: expertData.phone || expertData.mobile || user.phone || "138****8888",
                  email: expertData.email || user.email || "expert@example.com",
                  institution:
                    expertData.institution || expertData.institutionName || user.institution || "湖南省科技厅",
                  title: expertData.title || expertData.expertTitle || user.title || "教授",
                  researchDirection: expertData.researchDirection || "地理信息系统、空间数据分析",
                  specialties: expertData.specialties ||
                    expertData.researchFields?.split(",") || ["地理信息", "数据分析"],
                  bio: expertData.bio || expertData.introduction || "长期从事相关领域研究...",
                })
                return
              }
            } catch (apiError) {
              console.error("Failed to load expert profile from API:", apiError)
            }
          }

          setUserInfo({
            name: user.name || user.username || user.realName || "专家",
            gender: user.gender || "男",
            phone: user.phone || user.mobile || "138****8888",
            email: user.email || "expert@example.com",
            institution: user.institution || user.institutionName || "湖南省科技厅",
            title: user.title || user.expertTitle || "教授",
            researchDirection: user.researchDirection || "地理信息系统、空间数据分析",
            specialties: user.specialties || user.researchFields?.split(",") || ["地理信息", "数据分析"],
            bio: user.bio || user.introduction || "长期从事相关领域研究...",
          })
        } catch (e) {
          console.error("Error parsing user data:", e)
        }
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">个人信息</h1>
        <p className="text-sm text-muted-foreground mt-1">查看和编辑您的专家信息</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{userInfo.name}</h3>
                <p className="text-sm text-muted-foreground">{userInfo.title}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {userInfo.specialties.map((spec, i) => (
                  <Badge key={i}>{spec}</Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">评审统计</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">累计评审</span>
                <span className="font-semibold">25 次</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">平均评分</span>
                <span className="font-semibold">82.5 分</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">通过率</span>
                <span className="font-semibold">88%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">评审等级</span>
                <Badge variant="default">优秀</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Edit Form */}
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">基本信息</h3>
              <Button variant="outline" size="sm">
                编辑
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>姓名</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input value={userInfo.name} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>性别</Label>
                <Input value={userInfo.gender} disabled />
              </div>

              <div className="space-y-2">
                <Label>联系电话</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input value={userInfo.phone} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>电子邮箱</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input value={userInfo.email} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>工作单位</Label>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <Input value={userInfo.institution} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>职称</Label>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <Input value={userInfo.title} disabled />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">专业信息</h3>
              <Button variant="outline" size="sm">
                编辑
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>研究方向</Label>
                <Input value={userInfo.researchDirection} disabled />
              </div>

              <div className="space-y-2">
                <Label>专业领域</Label>
                <div className="flex flex-wrap gap-2">
                  {userInfo.specialties.map((spec, i) => (
                    <Badge key={i}>{spec}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>个人简介</Label>
                <Textarea rows={4} value={userInfo.bio} disabled />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">主要成就</h3>
            </div>

            <div className="space-y-3">
              {[
                "国家自然科学基金重大项目负责人",
                "获湖南省科技进步一等奖",
                "发表SCI论文30余篇",
                "培养博士研究生15名",
              ].map((achievement, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
