"use client";

import { useManifest } from "@/lib/manifest/useManifest";
import {
  DestinyActivityDefinition,
  DestinyActivityTypeDefinition,
  DestinyAggregateActivityResults,
  DestinyHistoricalStatsValue,
} from "bungie-api-ts/destiny2";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useFilters } from "../filter/filterContext";

interface AggregateDataTableProps {
  aggregateActivities: DestinyAggregateActivityResults;
}

type AggregateColumn = {
  activity: DestinyActivityDefinition;
  activityType: DestinyActivityTypeDefinition;
  values: Record<string, DestinyHistoricalStatsValue>;
};

export const aggregateColumns = [
  {
    accessorKey: "activity.displayProperties.name",
    header: "Name",
  },

  {
    accessorKey: "activityType.displayProperties.name",
    header: "Activity Type",
  },

  {
    accessorKey: "values.activitySecondsPlayed.basic.displayValue",
    header: "Time Played",
  },
  // {
  //   accessorKey: "values.fastestCompletionMsForActivity.basic.displayValue",
  //   header: "Fastest Completion Time",
  // },
  {
    accessorKey: "values.activityCompletions.basic.displayValue",
    header: "Completions",
  },
  {
    accessorKey: "values.activityKills.basic.displayValue",
    header: "Kills",
  },
  {
    accessorKey: "values.activityDeaths.basic.displayValue",
    header: "Deaths",
  },

  {
    accessorKey: "values.activityAssists.basic.displayValue",
    header: "Assists",
  },

  {
    accessorKey: "values.activityKillsDeathsAssists.basic.displayValue",
    header: "K/D/A Ratio",
  },
  {
    accessorKey: "values.activityPrecisionKills.basic.displayValue",
    header: "Precision Kills",
  },
  {
    accessorKey: "values.activityWins.basic.displayValue",
    header: "Wins",
  },
  {
    accessorKey: "values.fastestCompletionMsForActivity.basic.displayValue",
    header: "Fastest Completion Time",
  },
  {
    accessorKey: "values.activityBestSingleGameScore.basic.displayValue",
    header: "Highest Score",
  },
];

export function AggregateDataTable({
  aggregateActivities,
}: AggregateDataTableProps) {
  const manifest = useManifest();
  const { filters } = useFilters();

  const mergedColumnData = React.useMemo(() => {
    const data: AggregateColumn[] = [];

    if (!manifest) {
      return null;
    }

    for (const activity of aggregateActivities.activities) {
      const destinyActivity =
        manifest.DestinyActivityDefinition[activity.activityHash];

      if (!destinyActivity) {
        continue;
      }

      const activityType =
        manifest.DestinyActivityTypeDefinition[
          destinyActivity.activityTypeHash
        ];

      if (
        destinyActivity.displayProperties.name === "" ||
        !destinyActivity.activityModeHashes
      ) {
        continue;
      }

      if (filters.activityMode) {
        if (
          !destinyActivity.activityModeHashes.includes(
            parseInt(filters.activityMode)
          )
        ) {
          continue;
        }
      }

      data.push({
        values: activity.values,
        activity: destinyActivity,
        activityType,
      });
    }

    return data;
  }, [manifest, filters, aggregateActivities]);

  const table = useReactTable({
    data: mergedColumnData ?? [],
    columns: aggregateColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (mergedColumnData === null) {
    return null;
  }

  return (
    <div className="">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-slate-800 border-b-slate-700/50  w-full hover:bg-slate-800"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-white text-sm">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className=" border-slate-700/50 bg-slate-800/30 hover:bg-slate-900"
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      index === 0 ? "text-slate-100" : "text-slate-400"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={aggregateColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
