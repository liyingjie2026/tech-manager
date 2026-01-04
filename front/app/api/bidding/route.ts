import { type NextRequest, NextResponse } from "next/server"

// 获取招标项目列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || "all"

    const mockBiddings = [
      {
        id: "BID001",
        demandId: "DEM001",
        demandName: "城市三维建模服务需求",
        institution: "某市规划局",
        budget: 500000,
        publishDate: "2025-02-01",
        deadline: "2025-03-01",
        status: "bidding",
        bidCount: 3,
        description: "需要对城区进行三维建模",
      },
    ]

    let filtered = mockBiddings
    if (status !== "all") {
      filtered = mockBiddings.filter((item) => item.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获取招标列表失败" }, { status: 500 })
  }
}
