import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-20" />
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <Skeleton className="h-32" />
      </Card>

      <Card className="p-6">
        <Skeleton className="h-96" />
      </Card>
    </div>
  )
}
