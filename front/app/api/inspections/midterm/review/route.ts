import { type NextRequest, NextResponse } from "next/server"
import { projects, midtermChecks } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkId, action, comment, reviewerId, reviewerName } = body

    // 查找检查记录
    const check = midtermChecks.find((c) => c.id === checkId)
    if (!check) {
      return NextResponse.json({ code: 404, message: "检查记录不存在", data: null }, { status: 404 })
    }

    // 更新检查记录
    const checkIndex = midtermChecks.findIndex((c) => c.id === checkId)
    midtermChecks[checkIndex] = {
      ...check,
      status: action === "approve" ? ("passed" as any) : ("failed" as any),
      statusName: action === "approve" ? "已通过" : "未通过",
      reviewComment: comment,
      reviewTime: new Date().toISOString(),
    }

    // 更新项目状态
    const projectIndex = projects.findIndex((p) => p.id === check.projectId)
    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        status: PROJECT_STATUS.EXECUTING as any,
        statusName: "执行中",
        updatedAt: new Date().toISOString(),
      }
    }

    return NextResponse.json({
      code: 200,
      message: action === "approve" ? "中期检查通过" : "中期检查未通过",
      data: {
        check: midtermChecks[checkIndex],
        project: projects[projectIndex],
      },
    })
  } catch (error) {
    console.error("[v0] 中期检查审核失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
