import { type NextRequest, NextResponse } from "next/server"

// 提交投标
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: {
        id: `BID${Date.now()}`,
        biddingId: params.id,
        ...body,
        status: "submitted",
        submitDate: new Date().toISOString(),
      },
      message: "投标提交成功",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "投标提交失败" }, { status: 500 })
  }
}
