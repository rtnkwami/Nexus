import React, { useState, useEffect } from 'react';
import { format, subDays, subMonths, startOfYear, endOfYear, differenceInDays, parse, isValid } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const quickFilters = [
  {
    label: "Last 7 days",
    value: "last7days",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }),
    granularity: "daily"
  },
  {
    label: "Last 30 days",
    value: "last30days",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() }),
    granularity: "daily"
  },
  {
    label: "Last 90 days",
    value: "last90days",
    getRange: () => ({ from: subDays(new Date(), 89), to: new Date() }),
    granularity: "weekly"
  },
  {
    label: "Last 12 months",
    value: "last12months",
    getRange: () => ({ from: subMonths(new Date(), 12), to: new Date() }),
    granularity: "monthly"
  },
  {
    label: "Year to Date",
    value: "ytd",
    getRange: () => ({ from: startOfYear(new Date()), to: new Date() }),
    granularity: "monthly"
  },
  {
    label: "Last Year",
    value: "lastYear",
    getRange: () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      return { from: startOfYear(lastYear), to: endOfYear(lastYear) };
    },
    granularity: "monthly"
  }
];

const getGranularityForRange = (from: Date, to: Date) => {
    if (!from || !to) return 'daily';
    const days = differenceInDays(to, from);
    if (days <= 31) return 'daily';
    if (days <= 365) return 'weekly';
    return 'monthly';
};

export default function SalesPerformanceFilter({ onFilterChange }) {
  const [selectedFilter, setSelectedFilter] = useState(quickFilters[1]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [date, setDate] = useState({
    from: selectedFilter.getRange().from,
    to: selectedFilter.getRange().to,
  });

  // Set default filter on mount
  useEffect(() => {
    if (onFilterChange) {
      const range = selectedFilter.getRange();
      onFilterChange({ ...range, granularity: selectedFilter.granularity });
    }
  }, []);

  // Handler for selecting a pre-defined filter
  const handleQuickFilterSelect = (filter) => {
    setSelectedFilter(filter);
    const range = filter.getRange();
    setDate(range); // Also update the calendar state
    if (onFilterChange) {
      onFilterChange({ ...range, granularity: filter.granularity });
    }
  };

  // Handler for applying a custom date range
  const handleApplyCustomRange = () => {
    if (date?.from && date?.to) {
      const customFilter = {
        label: `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`,
        value: "custom",
        getRange: () => ({ from: date.from, to: date.to }),
        granularity: getGranularityForRange(date.from, date.to)
      };
      setSelectedFilter(customFilter);
      if (onFilterChange) {
        onFilterChange({
          from: date.from,
          to: date.to,
          granularity: customFilter.granularity
        });
      }
      setPopoverOpen(false);
    }
  };
  
  // Handler to cancel and close the popover
  const handleCancel = () => {
    // Reset date to the currently active filter's range before closing
    const currentRange = selectedFilter.getRange();
    setDate(currentRange);
    setPopoverOpen(false);
  }

  return (
    <div className="flex items-center gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-between px-3 py-2">
            <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 opacity-70" />
                <span className="truncate">{selectedFilter.label}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px]">
          {quickFilters.map((filter) => (
            <DropdownMenuItem
              key={filter.value}
              onClick={() => handleQuickFilterSelect(filter)}
            >
              {filter.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
            <Button variant="outline" className="px-3 py-2">Custom Range</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="p-3 grid grid-cols-2 gap-x-4">
            <div className="grid gap-1">
              <Label htmlFor="from" className="text-sm font-medium text-slate-700">Start date</Label>
              <Input
                id="from"
                value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const parsedDate = parse(e.target.value, 'yyyy-MM-dd', new Date());
                  if (isValid(parsedDate)) {
                    setDate(prev => ({ ...prev, from: parsedDate }));
                  }
                }}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="to" className="text-sm font-medium text-slate-700">End date</Label>
              <Input
                id="to"
                value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const parsedDate = parse(e.target.value, 'yyyy-MM-dd', new Date());
                    if (isValid(parsedDate)) {
                    setDate(prev => ({ ...prev, to: parsedDate }));
                  }
                }}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
          <div className="border-t">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
          <div className="flex justify-end items-center gap-x-2 p-3 border-t">
              <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
              <Button size="sm" onClick={handleApplyCustomRange} disabled={!date?.from || !date?.to}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}