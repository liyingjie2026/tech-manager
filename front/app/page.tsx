import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FlaskConical, UserCheck, Bell, Newspaper, Trophy, Download } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="湖南自然资源" width={40} height={40} className="rounded-full" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">湖南省自然资源科研项目管理</h1>
              <p className="text-xs text-muted-foreground">科技项目全生命周期管理平台</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                登录
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">注册</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">欢迎使用科研项目管理系统</h2>
          <p className="text-lg text-muted-foreground mb-12">
            提供科研项目申报、立项评审、过程管理、验收评价全流程服务
          </p>

          {/* Portal Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>监测监管端</CardTitle>
                <CardDescription>科研项目监管、审批、资源统筹</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login?type=supervisor">
                  <Button className="w-full">进入系统</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <FlaskConical className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>科研机构端</CardTitle>
                <CardDescription>项目申报、管理、成果提交</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login?type=institution">
                  <Button className="w-full bg-transparent" variant="outline">
                    进入系统
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <UserCheck className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>专家端</CardTitle>
                <CardDescription>项目评审、验收、评分</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login?type=expert">
                  <Button className="w-full bg-transparent" variant="outline">
                    进入系统
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Bell className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">通知公告</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="truncate">关于2025年度科研项目申报的通知</li>
                  <li className="truncate">项目中期检查工作安排</li>
                  <li className="truncate">科研成果转化政策解读</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Newspaper className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">科技快讯</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="truncate">自然资源领域最新研究动态</li>
                  <li className="truncate">科技创新成果推介会召开</li>
                  <li className="truncate">国家重点研发计划立项公示</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">科研成果</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="truncate">地质灾害防治技术突破</li>
                  <li className="truncate">国土空间规划创新应用</li>
                  <li className="truncate">测绘技术科技进步奖</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Download className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">下载中心</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="truncate">项目申报书模板</li>
                  <li className="truncate">任务书格式要求</li>
                  <li className="truncate">验收材料清单</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>湖南省自然资源厅科研项目管理系统 © 2025</p>
          <p className="mt-2">技术支持：自然资源事务中心</p>
        </div>
      </footer>
    </div>
  )
}
