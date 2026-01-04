"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { authStorage } from "@/lib/auth-storage"
import { authApi } from "@/lib/api/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const typeParam = searchParams.get("type")
  const [activeTab, setActiveTab] = useState(typeParam || "institution")

  useEffect(() => {
    if (typeParam && ["supervisor", "institution", "expert"].includes(typeParam)) {
      setActiveTab(typeParam)
    }
  }, [typeParam])

  const [supervisorForm, setSupervisorForm] = useState({ username: "", password: "" })
  const [institutionForm, setInstitutionForm] = useState({ username: "", password: "" })
  const [expertForm, setExpertForm] = useState({ username: "", password: "" })

  const handleLogin = async (
    e: React.FormEvent,
    form: { username: string; password: string; role?: string },
    userType: "supervisor" | "institution" | "expert",
    redirectPath: string,
  ) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await authApi.login({
        username: form.username,
        password: form.password,
        userType: userType,
      })

      if (response.data) {
        const { token, user } = response.data

        authStorage.saveToken(token)
        authStorage.saveUser({
          id: user.id.toString(),
          username: user.username,
          realName: user.realName || user.username, // 保存真实姓名
          name: user.realName || user.username,
          role: userType,
          institution: user.institutionName || "",
          institutionId: user.institutionId,
          institutionName: user.institutionName,
          email: user.email,
          phone: user.phone,
          expertId: user.expertId,
          expertName: user.expertName,
        })

        if (userType === "institution" && form.role) {
          authStorage.saveInstitutionRole(form.role as any)
        }

        let targetPath = redirectPath
        if (userType === "supervisor") {
          targetPath = "/supervisor/dashboard"
        } else if (userType === "institution") {
          targetPath = "/dashboard"
        } else if (userType === "expert") {
          targetPath = "/expert/review"
        }

        router.push(targetPath)
      } else {
        setError(response.message || "用户名或密码错误")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError("登录失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  const handleSupervisorLogin = (e: React.FormEvent) => {
    handleLogin(e, supervisorForm, "supervisor", "/supervisor/dashboard")
  }

  const handleInstitutionLogin = (e: React.FormEvent) => {
    handleLogin(e, institutionForm, "institution", "/dashboard")
  }

  const handleExpertLogin = (e: React.FormEvent) => {
    handleLogin(e, expertForm, "expert", "/expert/review")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/------logo.jpg" alt="湖南自然资源" width={80} height={80} className="rounded-full" />
          </div>
          <CardTitle className="text-2xl">科研项目管理系统</CardTitle>
          <CardDescription>请选择您的身份登录</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v)
              setError(null)
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="supervisor">监管端</TabsTrigger>
              <TabsTrigger value="institution">科研端</TabsTrigger>
              <TabsTrigger value="expert">专家端</TabsTrigger>
            </TabsList>

            <TabsContent value="supervisor">
              <form onSubmit={handleSupervisorLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supervisor-username">用户名</Label>
                  <Input
                    id="supervisor-username"
                    placeholder="请输入用户名"
                    value={supervisorForm.username}
                    onChange={(e) => setSupervisorForm({ ...supervisorForm, username: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervisor-password">密码</Label>
                  <Input
                    id="supervisor-password"
                    type="password"
                    placeholder="请输入密码"
                    value={supervisorForm.password}
                    onChange={(e) => setSupervisorForm({ ...supervisorForm, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="institution">
              <form onSubmit={handleInstitutionLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institution-username">用户名</Label>
                  <Input
                    id="institution-username"
                    placeholder="请输入用户名"
                    value={institutionForm.username}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, username: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution-password">密码</Label>
                  <Input
                    id="institution-password"
                    type="password"
                    placeholder="请输入密码"
                    value={institutionForm.password}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  还没有账号？
                  <Link href="/register" className="text-primary hover:underline ml-1">
                    立即注册
                  </Link>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="expert">
              <form onSubmit={handleExpertLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expert-username">用户名</Label>
                  <Input
                    id="expert-username"
                    placeholder="请输入用户名"
                    value={expertForm.username}
                    onChange={(e) => setExpertForm({ ...expertForm, username: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expert-password">密码</Label>
                  <Input
                    id="expert-password"
                    type="password"
                    placeholder="请输入密码"
                    value={expertForm.password}
                    onChange={(e) => setExpertForm({ ...expertForm, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              返回首页
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
