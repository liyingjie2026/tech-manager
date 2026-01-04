import { type NextRequest, NextResponse } from "next/server"
import { projects, taskBooks } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, taskBookData } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.TASK_ISSUED && project.status !== PROJECT_STATUS.TASK_DRAFTING) {
      return NextResponse.json({ code: 400, message: "项目不在任务书编制阶段", data: null }, { status: 400 })
    }

    // 创建或更新任务书
    const newTaskBook = {
      id: `task-${Date.now()}`,
      projectId,
      ...taskBookData,
      status: "submitted" as any,
      statusName: "已提交",
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    taskBooks.push(newTaskBook)

    // 更新项目状态
    const index = projects.findIndex((p) => p.id === projectId)
    projects[index] = {
      ...project,
      status: PROJECT_STATUS.TASK_REVIEWING as any,
      statusName: "任务书审核中",
      taskBookId: newTaskBook.id,
      taskBookStatus: "submitted" as any,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "任务书提交成功",
      data: {
        project: projects[index],
        taskBook: newTaskBook,
      },
    })
  } catch (error) {
    console.error("[v0] 任务书提交失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
