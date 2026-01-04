"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  showBack?: boolean
  backUrl?: string
  backText?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  showBack = false,
  backUrl,
  backText = "返回",
  actions,
}: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
      <div className="flex items-start gap-4 flex-1">
        {showBack && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="mt-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backText}
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
