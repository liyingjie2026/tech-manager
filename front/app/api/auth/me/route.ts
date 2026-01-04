import type { NextRequest } from "next/server"
import { forwardToBackend } from "@/lib/api-helper"

export async function GET(request: NextRequest) {
  return forwardToBackend("/auth/me", request)
}
