"use client";

import { useManifest } from "@/lib/manifest/useManifest";
import React from "react";
import { Props } from "../../../page";
import useSWR from "swr";
import { getAggregateActivities } from "../page";
import { Filter } from "lucide-react";

/**
 * Can filter by Activity Mode, Activity, Location
 */

type Filters = {
  activityMode: string | undefined;
  activity: string | undefined;
  // location: string | undefined
};
type FilterState = {
  // data
  filters: Filters;
};

type Actions =
  | { type: "Add filter"; payload: { field: keyof Filters; value: string } }
  | { type: "Remove filter"; payload: { field: keyof Filters } };

const FilterContext = React.createContext<FilterState>({
  filters: {
    activity: undefined,
    activityMode: undefined,
  },
});
const FilterDispatchContext =
  React.createContext<React.Dispatch<Actions> | null>(null);

function activitiesDataReducer(state: FilterState, action: Actions) {
  console.log(action);

  switch (action.type) {
    case "Add filter": {
      const { field, value } = action.payload;

      return {
        ...state,
        filters: {
          ...state.filters,
          [field]: value,
        },
      };
    }
    case "Remove filter": {
      const { field } = action.payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          [field]: undefined,
        },
      };
    }
    default: {
      throw new Error("Something went wrong here. Unknown action type");
    }
  }
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, dispatch] = React.useReducer(activitiesDataReducer, {
    filters: {
      activityMode: undefined,
      activity: undefined,
    },
  });

  return (
    <FilterContext.Provider value={filters}>
      <FilterDispatchContext.Provider value={dispatch}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return React.useContext(FilterContext);
}

export function useFilterDispatch() {
  return React.useContext(FilterDispatchContext);
}
