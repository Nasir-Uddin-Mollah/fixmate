"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Size = { width: number; height: number };

const ActivityChart = ({
  data,
  color = "#2563eb",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-56 min-w-0 w-full">
      {size.width > 0 && size.height > 0 ? (
        <BarChart
          width={size.width}
          height={size.height}
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
            itemStyle={{ color: "var(--popover-foreground)" }}
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      ) : null}
    </div>
  );
};

export default ActivityChart;
