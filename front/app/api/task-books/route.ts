import type { NextRequest } from "next/server"
import { forwardToBackend } from "@/lib/api-helper"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = `/task-books?${searchParams.toString()}`
  return forwardToBackend(endpoint, request)
}
