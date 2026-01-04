import { type NextRequest, NextResponse } from "next/server"

// 审核变更申请
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action, comment } = body

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ success: false, message: "无效的审核操作" }, { status: 400 })
    }

    const result = {
      id: params.id,
      status: action === "approve" ? "approved" : "rejected",
      reviewDate: new Date().toISOString(),
      reviewComment: comment,
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: action === "approve" ? "变更申请已通过" : "变更申请已驳回",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "审核操作失败" }, { status: 500 })
  }
}
