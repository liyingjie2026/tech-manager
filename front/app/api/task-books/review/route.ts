import { type NextRequest, NextResponse } from "next/server"
import { projects, taskBooks } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskBookId, action, comment, reviewerId, reviewerName } = body

    // 查找任务书
    const taskBook = taskBooks.find((t) => t.id === taskBookId)
    if (!taskBook) {
      return NextResponse.json({ code: 404, message: "任务书不存在", data: null }, { status: 404 })
    }

    // 查找项目
    const project = projects.find((p) => p.id === taskBook.projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 更新任务书状态
    const taskBookIndex = taskBooks.findIndex((t) => t.id === taskBookId)
    const newTaskBookStatus = action === "approve" ? "approved" : "drafting"
    taskBooks[taskBookIndex] = {
      ...taskBook,
      status: newTaskBookStatus as any,
      statusName: action === "approve" ? "已批准" : "需修改",
      reviewComment: comment,
      approvedAt: action === "approve" ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    }

    // 更新项目状态
    const projectIndex = projects.findIndex((p) => p.id === taskBook.projectId)
    const newProjectStatus = action === "approve" ? PROJECT_STATUS.TASK_APPROVED : PROJECT_STATUS.TASK_DRAFTING
    projects[projectIndex] = {
      ...project,
      status: newProjectStatus as any,
      statusName: action === "approve" ? "任务书已批准" : "任务书编制中",
      taskBookStatus: newTaskBookStatus as any,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: action === "approve" ? "任务书审核通过" : "任务书需修改",
      data: {
        project: projects[projectIndex],
        taskBook: taskBooks[taskBookIndex],
      },
    })
  } catch (error) {
    console.error("[v0] 任务书审核失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
