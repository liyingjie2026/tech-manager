import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// 模拟需求数据
const demands = [
  {
    id: "dem-001",
    code: "XQ2025001",
    title: "这里是需求名称",
    field: "测技术领域",
    expectedLevel: "国内领先",
    breakthroughTypes: ["卡脖子技术"],
    currentMaturityLevel: "实验室阶段",
    targetMaturityLevel: "产业化阶段",
    totalInvestment: 200,
    suggestedFunding: 200,
    projectType: "重大项目",
    duration: "2年",
    background: "简要说明研究背景、组织该项科技攻关的必要性和意义，限800字",
    keyProblems: "拟解决的关键科技问题，技术路线及可行性，限800字",
    expectedResults:
      "预期成果及水平，明确预期科技攻关成果和不少于5项的技术指标参数，成果需量化，作为项目结题考核指标。限500字",
    expectedBenefits: "预期效益。（阐述突破该项技术在经济、社会、生态等各方面的效益，限300字",
    technicalAnalysis: "技术指标对标分析（技术拥有单位及主要量化技术指标，限300字",
    institutionId: "inst-002",
    institutionName: "湖南省第三测绘院",
    contactPerson: "胡歌",
    contactPhone: "13111929202",
    contactIdCard: "430625199203112931",
    city: "长沙市天心区",
    status: "pending",
    statusName: "未审核",
    submittedAt: "2025-09-17",
    createdAt: "2025-09-17",
    updatedAt: "2025-09-17",
  },
  {
    id: "dem-002",
    code: "XQ2025002",
    title: "这里是需求名称",
    field: "测技术领域",
    expectedLevel: "国内领先",
    breakthroughTypes: ["卡脖子技术"],
    currentMaturityLevel: "",
    targetMaturityLevel: "",
    totalInvestment: 200,
    suggestedFunding: 200,
    projectType: "重大项目",
    duration: "2年",
    background: "",
    keyProblems: "",
    expectedResults: "",
    expectedBenefits: "",
    technicalAnalysis: "",
    institutionId: "inst-002",
    institutionName: "湖南省第三测绘院",
    contactPerson: "胡歌",
    contactPhone: "13111929202",
    contactIdCard: "430625199203112931",
    city: "长沙市天心区",
    status: "approved",
    statusName: "审核通过",
    submittedAt: "2025-09-17",
    createdAt: "2025-09-17",
    updatedAt: "2025-09-17",
  },
  {
    id: "dem-003",
    code: "XQ2025003",
    title: "这里是需求名称",
    field: "测技术领域",
    expectedLevel: "国内领先",
    breakthroughTypes: ["卡脖子技术"],
    currentMaturityLevel: "",
    targetMaturityLevel: "",
    totalInvestment: 200,
    suggestedFunding: 200,
    projectType: "重大项目",
    duration: "2年",
    background: "",
    keyProblems: "",
    expectedResults: "",
    expectedBenefits: "",
    technicalAnalysis: "",
    institutionId: "inst-002",
    institutionName: "湖南省第三测绘院",
    contactPerson: "胡歌",
    contactPhone: "13111929202",
    contactIdCard: "430625199203112931",
    city: "长沙市天心区",
    status: "pending",
    statusName: "未审核",
    submittedAt: "2025-09-17",
    createdAt: "2025-09-17",
    updatedAt: "2025-09-17",
  },
  {
    id: "dem-004",
    code: "XQ2025004",
    title: "这里是需求名称",
    field: "测技术领域",
    expectedLevel: "国内领先",
    breakthroughTypes: ["卡脖子技术"],
    currentMaturityLevel: "",
    targetMaturityLevel: "",
    totalInvestment: 200,
    suggestedFunding: 200,
    projectType: "一般项目",
    duration: "2年",
    background: "",
    keyProblems: "",
    expectedResults: "",
    expectedBenefits: "",
    technicalAnalysis: "",
    institutionId: "inst-002",
    institutionName: "湖南省第三测绘院",
    contactPerson: "胡歌",
    contactPhone: "13111929202",
    contactIdCard: "430625199203112931",
    city: "长沙市天心区",
    status: "rejected",
    statusName: "已驳回",
    submittedAt: "2025-09-17",
    createdAt: "2025-09-17",
    updatedAt: "2025-09-17",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get("keyword")
    const status = searchParams.get("status")

    let filteredDemands = [...demands]

    if (keyword) {
      filteredDemands = filteredDemands.filter((d) => d.title.includes(keyword) || d.code.includes(keyword))
    }

    if (status) {
      filteredDemands = filteredDemands.filter((d) => d.status === status)
    }

    return NextResponse.json({
      code: 200,
      message: "success",
      data: {
        records: filteredDemands,
        total: filteredDemands.length,
        current: 1,
        size: 10,
      },
    })
  } catch (error) {
    console.error("[v0] Demands GET error:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newDemand = {
      id: `dem-${String(demands.length + 1).padStart(3, "0")}`,
      code: `XQ2025${String(demands.length + 1).padStart(3, "0")}`,
      ...body,
      status: "pending",
      statusName: "未审核",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    demands.push(newDemand)

    return NextResponse.json({
      code: 200,
      message: "创建成功",
      data: newDemand,
    })
  } catch (error) {
    console.error("[v0] Demands POST error:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
