import { features } from "@/lib/data"
import { notFound } from "next/navigation"
import { FeaturePageClient } from "./feature-page-client"

export default async function FeatureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  const feature = features.find((f) => f.id === resolvedParams.id)

  if (!feature) {
    notFound()
  }

  return <FeaturePageClient feature={feature} />
}
