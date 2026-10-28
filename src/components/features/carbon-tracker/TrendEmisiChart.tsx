"use client";

import { useState, memo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import type { EmisiData } from "@/types/carbon";
import DataBadge from "@/components/common/DataBadge";

interface TrendEmisiChartProps {
  data: EmisiData[];
  view: "weekly" | "monthly";
  onViewChange: (view: "weekly" | "monthly") => void;
}

const mockWeeklyData: EmisiData[] = [
  { day: "Sen", value: 45 },
  { day: "Sel", value: 38 },
  { day: "Rab", value: 52 },
  { day: "Kam", value: 28 },
  { day: "Jum", value: 61 },
  { day: "Sab", value: 33 },
  { day: "Min", value: 47 },
];

const mockMonthlyData: EmisiData[] = [
  { month: "Jan", value: 320 },
  { month: "Feb", value: 295 },
  { month: "Mar", value: 410 },
  { month: "Apr", value: 280 },
  { month: "Mei", value: 350 },
  { month: "Jun", value: 390 },
  { month: "Jul", value: 310 },
  { month: "Agu", value: 265 },
  { month: "Sep", value: 430 },
  { month: "Okt", value: 380 },
];

const mockComparisonWeekly = [
  { day: "Sen", you: 45, reference: 55 },
  { day: "Sel", you: 38, reference: 52 },
  { day: "Rab", you: 52, reference: 58 },
  { day: "Kam", you: 28, reference: 50 },
  { day: "Jum", you: 61, reference: 60 },
  { day: "Sab", you: 33, reference: 48 },
  { day: "Min", you: 47, reference: 54 },
];

const TARGET = 380;
const ACTIVE_INDEX = 3;

/* ── Custom Tooltip ── */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#A8D5BA] bg-white px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-[#2D5F3F]">{label}</p>
      <p className="text-gray-600">
        {payload[0].value}{" "}
        <span className="text-gray-400">kg CO₂</span>
      </p>
    </div>
  );
}

const TrendEmisiChart = memo(function TrendEmisiChart({
  data,
  view,
  onViewChange,
}: TrendEmisiChartProps) {
  const chartData =
    data.length > 0
      ? data
      : view === "weekly"
      ? mockWeeklyData
      : mockMonthlyData;

  const xKey = view === "weekly" ? "day" : "month";
  const targetLine = view === "weekly" ? 50 : TARGET;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Main Chart Card ── */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        {/* Card header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-[#1A1A1A]">
              Estimasi Tren Emisi Karbon <DataBadge variant="demo" label="Data Sampel" />
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Perkiraan kg CO₂e per {view === "weekly" ? "hari" : "bulan"}
            </p>
          </div>
          {/* Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
            {(["weekly", "monthly"] as const).map((v) => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                aria-pressed={view === v}
                className="rounded-md px-3 py-1 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-1"
                style={
                  view === v
                    ? { backgroundColor: "#0F3D2E", color: "#fff" }
                    : { backgroundColor: "transparent", color: "#6b7280" }
                }
              >
                {v === "weekly" ? "Mingguan" : "Bulanan"}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div role="img" aria-label={`Grafik batang sampel estimasi emisi ${view === "weekly" ? "mingguan" : "bulanan"} dalam kg CO₂e`}>
        <ResponsiveContainer width="100%" height={290}>
          <BarChart
            data={chartData}
            margin={{ top: 22, right: 12, left: -10, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "kg CO₂e",
                angle: -90,
                position: "insideLeft",
                offset: 14,
                style: { fontSize: 9, fill: "#9CA3AF" },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(168,213,186,0.15)" }} />
            <ReferenceLine
              y={targetLine}
              stroke="#EF4444"
              strokeDasharray="6 3"
              label={{
                value: `Batas Target: ${targetLine} kg CO₂e`,
                position: "top",
                dy: -6,
                style: { fontSize: 10, fill: "#DC2626", fontWeight: 600 },
              }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === ACTIVE_INDEX ? "#2D5F3F" : "#A8D5BA"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* ── Comparison Chart Card ── */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1A1A1A]">
            Perbandingan Emisi Anda vs Rata-rata Surabaya
          </h4>
          <DataBadge variant="demo" label="Ilustratif" />
        </div>

        <div role="img" aria-label="Grafik perbandingan sampel emisi Anda dengan rata-rata Surabaya">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={mockComparisonWeekly}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 9, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                border: "1px solid #A8D5BA",
                borderRadius: 8,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="you"
              name="Anda"
              stroke="#2D5F3F"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="reference"
              name="Rata-rata Warga Kota"
              stroke="#A8D5BA"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

export default TrendEmisiChart;
