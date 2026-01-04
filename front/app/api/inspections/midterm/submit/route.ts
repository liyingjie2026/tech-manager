import { type NextRequest, NextResponse } from "next/server"
import { projects, midtermChecks } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, checkData } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.EXECUTING) {
      return NextResponse.json({ code: 400, message: "只有执行中的项目可以提交中期检查", data: null }, { status: 400 })
    }

    // 创建中期检查记录
    const newCheck = {
      id: `mid-${Date.now()}`,
      projectId,
      projectCode: project.code,
      projectName: project.name,
      ...checkData,
      status: "submitted" as any,
      statusName: "已提交",
      submittedAt: new Date().toISOString(),
    }
    midtermChecks.push(newCheck)

    // 更新项目状态
    const index = projects.findIndex((p) => p.id === projectId)
    projects[index] = {
      ...project,
      status: PROJECT_STATUS.MIDTERM_CHECKING as any,
      statusName: "中期检查中",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "中期检查提交成功",
      data: {
        project: projects[index],
        check: newCheck,
      },
    })
  } catch (error) {
    console.error("[v0] 中期检查提交失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
