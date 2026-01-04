"use client"

import useSWR, { type SWRConfiguration } from "swr"
import { get } from "../api/client"
import type { PageResult } from "../types"

// 通用 fetcher
const fetcher = async (url: string): Promise<any> => {
  const response = await get(url)
  if (response.code !== 200) {
    throw new Error(response.message)
  }
  return response.data
}

// 通用数据获取 hook
export function useApi(url: string | null, config?: SWRConfiguration) {
  return useSWR(url, fetcher, {
    revalidateOnFocus: false,
    ...config,
  })
}

// 分页数据获取 hook
export function usePageApi<T>(url: string | null, params?: Record<string, any>, config?: SWRConfiguration) {
  const queryString = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null && v !== "")
          .map(([k, v]) => [k, String(v)]),
      ).toString()
    : ""

  const fullUrl = url ? `${url}${queryString}` : null

  return useSWR<PageResult<T>>(fullUrl, fetcher, {
    revalidateOnFocus: false,
    ...config,
  })
}

// 项目列表 hook
export function useProjects(params?: {
  page?: number
  pageSize?: number
  keyword?: string
  type?: string
  status?: string
  field?: string
}) {
  return usePageApi("/projects", params)
}

// 项目详情 hook
export function useProject(id: string | null) {
  return useApi(id ? `/projects/${id}` : null)
}

// 需求列表 hook
export function useDemands(params?: {
  page?: number
  pageSize?: number
  keyword?: string
  field?: string
  status?: string
  expectedLevel?: string
}) {
  return usePageApi("/demands", params)
}

// 任务书列表 hook
export function useTaskBooks(params?: {
  page?: number
  pageSize?: number
  keyword?: string
  projectType?: string
  status?: string
}) {
  return usePageApi("/task-books", params)
}

// 仪表盘数据 hook
export function useDashboard(userType: string) {
  return useApi(`/statistics/dashboard?userType=${userType}`)
}

// 项目统计 hook
export function useProjectStatistics() {
  return useApi("/projects/statistics")
}

// 需求统计 hook
export function useDemandStatistics() {
  return useApi("/demands/statistics")
}

// 任务书统计 hook
export function useTaskBookStatistics() {
  return useApi("/task-books/statistics")
}
