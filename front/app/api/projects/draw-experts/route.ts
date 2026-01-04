import { type NextRequest, NextResponse } from "next/server"
import { projects, experts } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, expertCount = 3, excludedExpertIds = [] } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.PRELIMINARY_APPROVED) {
      return NextResponse.json({ code: 400, message: "只有初审通过的项目可以抽取专家", data: null }, { status: 400 })
    }

    // 过滤可用专家
    const availableExperts = experts.filter(
      (e) => e.status === 1 && !excludedExpertIds.includes(e.id) && e.specialty.some((s) => project.field.includes(s)),
    )

    // 随机抽取专家
    const selectedExperts = []
    const shuffled = [...availableExperts].sort(() => 0.5 - Math.random())
    selectedExperts.push(...shuffled.slice(0, Math.min(expertCount, shuffled.length)))

    // 更新项目状态
    const index = projects.findIndex((p) => p.id === projectId)
    projects[index] = {
      ...project,
      status: PROJECT_STATUS.EXPERT_REVIEWING as any,
      statusName: "专家评审中",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "专家抽取成功",
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
    console.error("[v0] 专家抽取失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
