"use client";

import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCustomTooltip } from "../chart-custom-tooltip";
import { useManifest } from "@/lib/manifest/useManifest";

interface ActivitiesLineChartProps {
  data: any[];
  dataKey: string;
  label: string;
}

export function ActivitiesLineChart({
  data,
  dataKey,
  label,
}: ActivitiesLineChartProps) {
  const manifest = useManifest();

  const reversed = data
    .map((item) => {
      return item;
    })
    .reverse();

  function onClick(_: any, data: any) {
    const { payload } = data;
    const instanceId = payload.activityDetails.instanceId;
  }

  if (!manifest) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={reversed} margin={{ top: 20, bottom: 20, right: 30 }}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="period" tick={{ display: "none" }} className="text-xs">
          <Label value={label} offset={10} position={"bottom"} fill="white" />
        </XAxis>

        <YAxis type="number" className="text-xs"></YAxis>
        <Tooltip
          content={(props) => (
            <ChartCustomTooltip
              {...props}
              secondLabel={label}
              manifest={manifest}
            />
          )}
        />
        <Line
          stroke="#eab308"
          dataKey={dataKey}
          type="monotone"
          activeDot={{
            onClick,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
