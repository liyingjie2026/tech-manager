"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, FlaskConical, UserCheck, ChevronDown, Home } from "lucide-react"
import { authStorage } from "@/lib/auth-storage"
import { useToast } from "@/hooks/use-toast"

export function PortalSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const currentPortal = pathname.startsWith("/supervisor")
    ? "监测监管端"
    : pathname.startsWith("/expert")
      ? "专家端"
      : pathname.startsWith("/dashboard")
        ? "科研机构端"
        : "首页"

  const portals = [
    {
      name: "监测监管端",
      path: "/supervisor/dashboard",
      icon: Building2,
      description: "科研项目监管审批",
      color: "text-blue-600",
    },
    {
      name: "科研机构端",
      path: "/dashboard",
      icon: FlaskConical,
      description: "项目申报管理",
      color: "text-green-600",
    },
    {
      name: "专家端",
      path: "/expert/review",
      icon: UserCheck,
      description: "项目评审验收",
      color: "text-purple-600",
    },
  ]

  const handlePortalSwitch = (path: string) => {
    const targetPortal = path.startsWith("/supervisor")
      ? "监测监管端"
      : path.startsWith("/expert")
        ? "专家端"
        : "科研机构端"

    if (currentPortal !== targetPortal && currentPortal !== "首页") {
      authStorage.clearAuth()
      toast({
        title: "切换用户端",
        description: "请重新登录",
      })
      router.push("/login")
    } else {
      router.push(path)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          {currentPortal}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>切换用户端</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/")} className="cursor-pointer">
          <Home className="w-4 h-4 mr-2 text-gray-600" />
          <div>
            <div className="font-medium">系统首页</div>
            <div className="text-xs text-muted-foreground">返回门户首页</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {portals.map((portal) => {
          const Icon = portal.icon
          const isActive = pathname.startsWith(portal.path)
          return (
            <DropdownMenuItem
              key={portal.path}
              onClick={() => handlePortalSwitch(portal.path)}
              className="cursor-pointer"
              disabled={isActive}
            >
              <Icon className={`w-4 h-4 mr-2 ${portal.color}`} />
              <div>
                <div className="font-medium">{portal.name}</div>
                <div className="text-xs text-muted-foreground">{portal.description}</div>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
