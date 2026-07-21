"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts"

type Props = {
  data:
    | {
        date: string
        views: number
      }[]
    | undefined
}

export default function ViewsChart({ data }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
              <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.15}
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="views"
            stroke="currentColor"
            strokeWidth={2}
            fill="url(#views)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
