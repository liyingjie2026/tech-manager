"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DataPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export function DataPagination({
  currentPage,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  className,
}: DataPaginationProps) {
  const [jumpPage, setJumpPage] = React.useState("")

  const handleJump = () => {
    const page = Number.parseInt(jumpPage)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpPage("")
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push(2)
      pages.push(3)

      if (currentPage > 4 && currentPage < totalPages - 3) {
        pages.push("...")
        pages.push(currentPage)
        pages.push("...")
      } else if (currentPage >= totalPages - 3) {
        pages.push("...")
      }

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="text-sm text-muted-foreground">共{total}项数据</div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}条/页
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">跳至</span>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleJump()
              }
            }}
            className="h-8 w-16 text-center"
          />
          <span className="text-sm text-muted-foreground">/{totalPages}页</span>
          <Button size="sm" className="h-8" onClick={handleJump}>
            跳转
          </Button>
        </div>
      </div>
    </div>
  )
}
