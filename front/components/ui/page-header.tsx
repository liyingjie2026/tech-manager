"use client"

import type React from "react"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  onBack?: () => void
  showBackButton?: boolean
  children?: React.Node
}

export function PageHeader({ title, subtitle, backHref, onBack, showBackButton = true, children }: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 flex-1">
        {showBackButton && (
          <Button variant="outline" size="icon" onClick={handleBack} className="shrink-0 bg-transparent">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}
