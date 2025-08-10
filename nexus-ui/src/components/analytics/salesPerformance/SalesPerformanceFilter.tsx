"use client";

import * as React from "react";
import { subDays, subMonths, startOfYear, endOfYear } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon } from "lucide-react";

const quickFilters = [
  {
    label: "Last 7 days",
    value: "last7days",
    getRange: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
      granularity: "daily"
    })
  },
  {
    label: "Last 30 days",
    value: "last30days",
    getRange: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
      granularity: "daily"
    })
  },
  {
    label: "Last 90 days",
    value: "last90days",
    getRange: () => ({
      from: subDays(new Date(), 89),
      to: new Date(),
      granularity: "weekly"
    })
  },
  {
    label: "Last 12 months",
    value: "last12months",
    getRange: () => ({
      from: subMonths(new Date(), 12),
      to: new Date(),
      granularity: "monthly"
    })
  },
  {
    label: "Year to Date",
    value: "ytd",
    getRange: () => ({
      from: startOfYear(new Date()),
      to: new Date(),
      granularity: "monthly"
    })
  },
  {
    label: "Last Year",
    value: "lastYear",
    getRange: () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      return {
        from: startOfYear(lastYear),
        to: endOfYear(lastYear),
        granularity: "monthly"
      };
    }
  }
];

export default function SalesPerformanceFilter({ onFilterChange }) {
  const [selectedFilter, setSelectedFilter] = React.useState(quickFilters[1]); // Default to Last 30 days

  React.useEffect(() => {
    // Set default filter on mount
    const defaultRange = selectedFilter.getRange();
    if (onFilterChange) {
      onFilterChange(defaultRange);
    }
  }, []);

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    const range = filter.getRange();
    if (onFilterChange) {
      onFilterChange(range);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {selectedFilter.label}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {quickFilters.map((filter) => (
          <DropdownMenuItem
            key={filter.value}
            onClick={() => handleFilterSelect(filter)}
          >
            {filter.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}