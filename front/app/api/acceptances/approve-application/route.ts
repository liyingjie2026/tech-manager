import { type NextRequest, NextResponse } from "next/server"
import { projects, experts } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

// 监管端审批验收申请并抽取专家
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, action, comment, expertCount = 3 } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.ACCEPTANCE_APPLYING) {
      return NextResponse.json({ code: 400, message: "项目不在验收申请阶段", data: null }, { status: 400 })
    }

    if (action !== "approve") {
      // 驳回验收申请
      const index = projects.findIndex((p) => p.id === projectId)
      projects[index] = {
        ...project,
        status: PROJECT_STATUS.EXECUTING as any,
        statusName: "执行中",
        updatedAt: new Date().toISOString(),
      }

      return NextResponse.json({
        code: 200,
        message: "验收申请已驳回",
        data: projects[index],
      })
    }

    // 批准验收申请，自动抽取专家
    const availableExperts = experts.filter((e) => e.status === 1 && e.specialty.some((s) => project.field.includes(s)))

    // 随机抽取专家
    const selectedExperts = []
    const shuffled = [...availableExperts].sort(() => 0.5 - Math.random())
    selectedExperts.push(...shuffled.slice(0, Math.min(expertCount, shuffled.length)))

    // 更新项目状态为验收评审中
    const index = projects.findIndex((p) => p.id === projectId)
    projects[index] = {
      ...project,
      status: PROJECT_STATUS.ACCEPTANCE_REVIEWING as any,
      statusName: "验收评审中",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "验收申请已批准，专家已抽取",
      data: {
        project: projects[index],
        selectedExperts: selectedExperts.map((e) => ({
          id: e.id,
          name: e.name,
          institution: e.institution,
          title: e.title,
          specialty: e.specialty,
        })),
      },
    })
  } catch (error) {
    console.error("[v0] 验收申请审批失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
