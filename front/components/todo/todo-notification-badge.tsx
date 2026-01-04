"use client"

import { Bell } from "lucide-react"
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
import { useEffect, useState } from "react"
import { todoApi } from "@/lib/api/todo"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

interface TodoItem {
  id: number
  title: string
  type: string
  priority: string
  dueDate?: string
  linkUrl?: string
}

export function TodoNotificationBadge() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTodos()
    // Refresh every 30 seconds
    const interval = setInterval(loadTodos, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const response = await todoApi.list({ current: 1, size: 5, status: "pending" })
      if (response.data) {
        setTodos(response.data.records || [])
        setUnreadCount(response.data.total || 0)
      }
    } catch (error) {
      console.error("Failed to load todos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      default:
        return "secondary"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>待办事项</span>
          <Badge variant="secondary">{unreadCount}</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">加载中...</div>
        ) : todos.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">暂无待办事项</div>
        ) : (
          <>
            {todos.map((todo) => (
              <DropdownMenuItem key={todo.id} asChild>
                <Link href={todo.linkUrl || "/dashboard/todos"} className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    <Badge variant={getPriorityColor(todo.priority)} className="text-xs">
                      {todo.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex-1 text-right">
                      {todo.dueDate &&
                        formatDistanceToNow(new Date(todo.dueDate), {
                          locale: zhCN,
                          addSuffix: true,
                        })}
                    </span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2 w-full">{todo.title}</p>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/todos" className="w-full text-center text-primary">
                查看全部待办
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
