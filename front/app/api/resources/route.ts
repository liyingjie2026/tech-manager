import { type NextRequest, NextResponse } from "next/server"

// 获取资源列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")

    const mockResources = [
      {
        id: "RES001",
        name: "高精度全站仪",
        type: "equipment",
        model: "TS16",
        manufacturer: "徕卡",
        purchaseDate: "2023-01-15",
        price: 150000,
        status: "available",
        location: "测绘实验室",
        manager: "李工程师",
        description: "用于高精度测量",
      },
      {
        id: "RES002",
        name: "ArcGIS Pro",
        type: "software",
        version: "3.1",
        manufacturer: "Esri",
        purchaseDate: "2023-06-20",
        licenseCount: 10,
        expiryDate: "2025-06-20",
        status: "active",
        manager: "王工程师",
        description: "GIS分析软件",
      },
    ]

    let filtered = mockResources
    if (type !== "all") {
      filtered = mockResources.filter((item) => item.type === type)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages: 1,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获取资源列表失败" }, { status: 500 })
  }
}

// 添加资源
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: {
        id: `RES${Date.now()}`,
        ...body,
        status: "available",
      },
      message: "资源添加成功",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "资源添加失败" }, { status: 500 })
  }
}
