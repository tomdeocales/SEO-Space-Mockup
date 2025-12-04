"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { categories, getCategoryScore } from "@/lib/data"

interface ParityRadarChartProps {
    competitor: "semrush" | "peec"
}

export function ParityRadarChart({ competitor }: ParityRadarChartProps) {
    const chartData = categories.map((category) => ({
        category,
        you: getCategoryScore(category, competitor), // Using the score as "You"
        competitor: Math.min(100, Math.max(40, getCategoryScore(category, competitor) + (Math.random() * 40 - 20))), // Mock competitor data relative to score
    }))

    const chartConfig = {
        you: {
            label: "You",
            color: "var(--chart-1)",
        },
        competitor: {
            label: competitor === "semrush" ? "SEMrush" : "peec",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col border border-border">
            <CardHeader className="items-center pb-4">
                <CardTitle>Competitive Parity Analysis</CardTitle>
                <CardDescription>Comparing feature coverage across key categories</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={chartData}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <PolarAngleAxis dataKey="category" />
                            <PolarGrid />
                            <Radar
                                name="You"
                                dataKey="you"
                                stroke="var(--color-you)"
                                fill="var(--color-you)"
                                fillOpacity={0.6}
                            />
                            <Radar
                                name={competitor === "semrush" ? "SEMrush" : "peec"}
                                dataKey="competitor"
                                stroke="var(--color-competitor)"
                                fill="var(--color-competitor)"
                                fillOpacity={0.3}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Overall parity trending up by 5.2% <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Showing parity scores for the current period
                </div>
            </CardFooter>
        </Card>
    )
}
