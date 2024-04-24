"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { Filters, useFilterDispatch } from "./filterContext";
import { DestinyActivityDefinition } from "bungie-api-ts/destiny2";

interface FilterItemProps {
  field: keyof Filters;
  label: string;
  data: DestinyActivityDefinition[];
}

export function FilterItem({ field, label, data }: FilterItemProps) {
  const dispatch = useFilterDispatch();
  const [selected, setSelected] = React.useState<string>();

  return (
    <div className="w-full">
      <Label className="text-xs text-white">{label}</Label>
      <Select
        value={selected}
        onValueChange={(value) => {
          setSelected(value);

          if (value !== "(All)") {
            dispatch!({
              type: "Add filter",
              payload: {
                field,
                value,
              },
            });
          } else {
            dispatch!({
              type: "Remove filter",
              payload: {
                field,
              },
            });
          }
        }}
      >
        <SelectTrigger className="w-full rounded-none text-sm h-0 px-4 py-3 bg-slate-800 border-slate-700 text-slate-200">
          <SelectValue placeholder="(All)" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800/50 backdrop-blur rounded-none border-slate-700 text-slate-200">
          <SelectGroup>
            <SelectItem
              className="focus:bg-slate-700 rounded-none"
              value={"(All)"}
            >
              (All)
            </SelectItem>
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
  );
}
