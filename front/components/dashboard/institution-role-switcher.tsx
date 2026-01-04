"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { UserCircle, ChevronDown, CheckCircle2 } from "lucide-react"
import { INSTITUTION_ROLES, ROLE_CONFIG } from "@/lib/constants/institution-roles"
import { authStorage } from "@/lib/auth-storage"

export function InstitutionRoleSwitcher() {
  const [currentRole, setCurrentRole] = useState<string>(INSTITUTION_ROLES.PROJECT_LEADER)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)

    // Load user and role from authStorage
    const userData = authStorage.getUser()
    const savedRole = authStorage.getInstitutionRole()

    if (userData) {
      setUser(userData)
    }
    setCurrentRole(savedRole)
  }, [pathname])

  const handleRoleSwitch = (role: string) => {
    authStorage.saveInstitutionRole(role as any)
    setCurrentRole(role)
    // Refresh page to apply new permissions
    window.location.reload()
  }

  const isInstitutionDashboard = pathname.startsWith("/dashboard")

  if (!mounted || !isInstitutionDashboard) {
    return null
  }

  const roleConfig = ROLE_CONFIG[currentRole as keyof typeof ROLE_CONFIG]
  const userName = user?.name || user?.realName || "用户"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto py-2 px-3 gap-2 hover:bg-white/10 text-white border border-white/20">
          <div className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium">{userName}</span>
              <Badge variant="secondary" className="text-xs h-5 bg-white/20 text-white hover:bg-white/30">
                {roleConfig?.name || "项目负责人"}
              </Badge>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>切换角色</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleRoleSwitch(INSTITUTION_ROLES.PROJECT_LEADER)} className="cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <div>
                <div className="font-medium">项目负责人</div>
                <div className="text-xs text-muted-foreground">管理个人项目和提交申报</div>
              </div>
            </div>
            {currentRole === INSTITUTION_ROLES.PROJECT_LEADER && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleRoleSwitch(INSTITUTION_ROLES.ADMIN)} className="cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <div>
                <div className="font-medium">机构管理员</div>
                <div className="text-xs text-muted-foreground">审核项目和管理用户</div>
              </div>
            </div>
            {currentRole === INSTITUTION_ROLES.ADMIN && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
