import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface ChartDataItem {
  name: string;
  count: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-2.5 shadow-elevated text-xs space-y-1">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-primary font-bold tabular-nums">
          {payload[0].value} عنصر
        </p>
      </div>
    );
  }
  return null;
}

interface DashboardAnalyticsChartProps {
  data: ChartDataItem[];
}

export function DashboardAnalyticsChart({ data }: DashboardAnalyticsChartProps) {
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <div>
          <h3 className="font-semibold text-foreground text-base">توزيع موارد المنصة</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            حجم وتوزيع المحتوى والبيانات الحالية
          </p>
        </div>
        <div className="p-2 rounded-xl bg-primary-subtle text-primary border border-primary/20">
          <TrendingUp className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
              opacity={0.6}
            />
            <XAxis
              dataKey="name"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={6}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-6}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardAnalyticsChart;
