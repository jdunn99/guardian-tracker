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
import { getPGCR } from "../../../../../_components/activities/actions";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import React from "react";
import { PostGameCarnageReport } from "../../../../../_components/activities/post-game-carnage/post-game-carnage-report";
import {
  DestinyActivityDefinition,
  DestinyActivityTypeDefinition,
} from "bungie-api-ts/destiny2";

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
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<any>();

  const reversed = data
    .map((item) => {
      return item;
    })
    .reverse();

  async function onClick(_: any, data: any) {
    setIsOpen(true);
    setSelected(data.payload);
  }

  const { activityDefinition, activityType } = React.useMemo(() => {
    const data: {
      activityDefinition: DestinyActivityDefinition | null;
      activityType: DestinyActivityTypeDefinition | null;
    } = {
      activityDefinition: null,
      activityType: null,
    };

    if (!selected || !manifest) {
      return data;
    }

    const activityDefinition =
      manifest.DestinyActivityDefinition[selected.activityDetails.referenceId];

    if (activityDefinition && activityDefinition.directActivityModeHash) {
      data.activityDefinition = activityDefinition;
    }

    data.activityType =
      manifest.DestinyActivityModeDefinition[
        manifest.DestinyActivityDefinition[
          selected.activityDetails.directorActivityHash
        ].directActivityModeHash!
      ];

    return data;
  }, [manifest, selected]);

  if (!manifest) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={reversed} margin={{ top: 20, bottom: 20, right: 30 }}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            dataKey="period"
            tick={{ display: "none" }}
            className="text-xs"
          >
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
      <SheetContent className=" p-0">
        <SheetHeader>
          {activityDefinition && activityType ? (
            <PostGameCarnageReport
              activity={selected}
              activityDefinition={activityDefinition}
              activityType={activityType}
            />
          ) : null}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
