"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { authApi } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [form, setForm] = useState({
    organizationType: "",
    organizationName: "",
    creditCode: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    if (!form.agreeTerms) {
      setError("请同意用户协议和隐私政策")
      return
    }

    if (!form.organizationType) {
      setError("请选择机构类型")
      return
    }

    setLoading(true)

    try {
      const response = await authApi.register({
        username: form.username,
        password: form.password,
        realName: form.contactPerson,
        phone: form.contactPhone,
        email: form.contactEmail,
        institutionId: form.creditCode,
        userType: "institution",
      })

      if (response.data) {
        toast({
          title: "注册成功",
          description: "请等待管理员审核",
        })
        router.push("/login")
      } else {
        setError(response.message || "注册失败，请稍后重试")
      }
    } catch (err: any) {
      setError(err.message || "网络错误，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/images/logo.png" alt="湖南自然资源" width={80} height={80} className="rounded-full" />
          </div>
          <CardTitle className="text-2xl">科研机构注册</CardTitle>
          <CardDescription>请填写完整的机构信息进行注册</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">机构信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationType">机构类型</Label>
                  <Select
                    value={form.organizationType}
                    onValueChange={(value) => setForm({ ...form, organizationType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择机构类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">高等院校</SelectItem>
                      <SelectItem value="research">科研院所</SelectItem>
                      <SelectItem value="enterprise">企业</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizationName">机构名称</Label>
                  <Input
                    id="organizationName"
                    placeholder="请输入机构全称"
                    value={form.organizationName}
                    onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditCode">统一社会信用代码</Label>
                <Input
                  id="creditCode"
                  placeholder="请输入18位统一社会信用代码"
                  value={form.creditCode}
                  onChange={(e) => setForm({ ...form, creditCode: e.target.value })}
                  maxLength={18}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">联系人信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">联系人姓名</Label>
                  <Input
                    id="contactPerson"
                    placeholder="请输入联系人姓名"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">联系电话</Label>
                  <Input
                    id="contactPhone"
                    placeholder="请输入联系电话"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">电子邮箱</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="请输入电子邮箱"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">账号信息</h3>
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  placeholder="请输入用户名（6-20位字符）"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  minLength={6}
                  maxLength={20}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    minLength={6}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    minLength={6}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={form.agreeTerms}
                onCheckedChange={(checked) => setForm({ ...form, agreeTerms: checked as boolean })}
                disabled={loading}
              />
              <label
                htmlFor="agreeTerms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                我已阅读并同意
                <Link href="#" className="text-primary hover:underline mx-1">
                  用户协议
                </Link>
                和
                <Link href="#" className="text-primary hover:underline ml-1">
                  隐私政策
                </Link>
              </label>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => router.push("/login")}
                disabled={loading}
              >
                返回登录
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    注册中...
                  </>
                ) : (
                  "提交注册"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
