import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function BidDetailLoading() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-5 w-40" />
      <Card>
        <CardHeader className="py-4 px-6 border-b">
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-6">
            <Skeleton className="w-40 h-32 rounded" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4 px-6 border-b">
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
