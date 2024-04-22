"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManifest } from "@/lib/manifest/useManifest";
import React from "react";
import { useFilterDispatch, useFilters } from "../filter/filterContext";
import { DestinyAggregateActivityResults } from "bungie-api-ts/destiny2";

export function ActivityFilters({
  aggregateActivities,
}: {
  aggregateActivities: DestinyAggregateActivityResults;
}) {
  const manifest = useManifest();
  const { filters } = useFilters();
  const dispatch = useFilterDispatch();

  const [selected, setSelected] = React.useState<string>();

  React.useEffect(() => {
    if (filters.activityMode && filters.activityMode !== selected) {
      setSelected(filters.activityMode);
    }

    if (!filters.activityMode) {
      setSelected("(All)");
    }
  }, [filters.activityMode, selected]);

  const data = React.useMemo(() => {
    if (!manifest) {
      return [];
    }

    const results: any = {};
    for (const activity of aggregateActivities.activities) {
      const destinyActivity =
        manifest.DestinyActivityDefinition[activity.activityHash];

      if (
        !destinyActivity ||
        destinyActivity.displayProperties.name === "" ||
        !destinyActivity.directActivityModeHash
      ) {
        continue;
      }

      const activityType =
        manifest.DestinyActivityModeDefinition[
          destinyActivity.directActivityModeHash
        ];

      if (activityType.displayProperties.name === "") {
        continue;
      }

      results[activityType.displayProperties.name] = activityType;
    }

    return Object.values(results) as any[];
  }, [manifest, aggregateActivities]);

  if (!manifest) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-white ">Activity Mode</Label>
        <Select
          onValueChange={(value) => {
            setSelected(value);

            if (value !== "(All)") {
              console.log(value);
              dispatch!({
                type: "Add filter",
                payload: { field: "activityMode", value },
              });
            } else {
              dispatch!({
                type: "Remove filter",
                payload: { field: "activityMode" },
              });
            }
          }}
          value={selected}
        >
          <SelectTrigger className="w-full rounded-none text-sm h-0 px-4 py-3 bg-slate-800 border-slate-700 text-slate-200">
            <SelectValue placeholder="(All)" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800/50 backdrop-blur rounded-none border-slate-700 text-slate-200">
            <SelectGroup>
              <SelectItem value={"(All)"}>(All)</SelectItem>
              {data.map((def) =>
                def.displayProperties.name !== "" &&
                def.displayProperties.name !== "All" ? (
                  <SelectItem
                    value={def.hash as any}
                    key={def.hash}
                    className="focus:bg-slate-700 rounded-none"
                  >
                    {def.displayProperties.name}
                  </SelectItem>
                ) : null
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-white ">Activity Mode</Label>
        <Select
          onValueChange={(value) => {
            setSelected(value);

            if (value !== "(All)") {
              console.log(value);
              dispatch!({
                type: "Add filter",
                payload: { field: "activityMode", value },
              });
            } else {
              dispatch!({
                type: "Remove filter",
                payload: { field: "activityMode" },
              });
            }
          }}
          value={selected}
        >
          <SelectTrigger className="w-full rounded-none text-sm h-0 px-4 py-3 bg-slate-800 border-slate-700 text-slate-200">
            <SelectValue placeholder="(All)" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800/50 backdrop-blur rounded-none border-slate-700 text-slate-200">
            <SelectGroup>
              <SelectItem value={"(All)"}>(All)</SelectItem>
              {data.map((def) =>
                def.displayProperties.name !== "" &&
                def.displayProperties.name !== "All" ? (
                  <SelectItem
                    value={def.hash as any}
                    key={def.hash}
                    className="focus:bg-slate-700 rounded-none"
                  >
                    {def.displayProperties.name}
                  </SelectItem>
                ) : null
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-white ">Activity Mode</Label>
        <Select
          onValueChange={(value) => {
            setSelected(value);

            if (value !== "(All)") {
              console.log(value);
              dispatch!({
                type: "Add filter",
                payload: { field: "activityMode", value },
              });
            } else {
              dispatch!({
                type: "Remove filter",
                payload: { field: "activityMode" },
              });
            }
          }}
          value={selected}
        >
          <SelectTrigger className="w-full rounded-none text-sm h-0 px-4 py-3 bg-slate-800 border-slate-700 text-slate-200">
            <SelectValue placeholder="(All)" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800/50 backdrop-blur rounded-none border-slate-700 text-slate-200">
            <SelectGroup>
              <SelectItem value={"(All)"}>(All)</SelectItem>
              {data.map((def) =>
                def.displayProperties.name !== "" &&
                def.displayProperties.name !== "All" ? (
                  <SelectItem
                    value={def.hash as any}
                    key={def.hash}
                    className="focus:bg-slate-700 rounded-none"
                  >
                    {def.displayProperties.name}
                  </SelectItem>
                ) : null
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
