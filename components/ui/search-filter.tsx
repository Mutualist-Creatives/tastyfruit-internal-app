"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters?: {
    label: string;
    key: string;
    options: { label: string; value: string }[];
  }[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  placeholder?: string;
}

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  filters = [],
  activeFilters,
  onFilterChange,
  onClearFilters,
  placeholder = "Cari...",
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value !== ""
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {filters.length > 0 && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? "border-primary bg-blue-50 text-primary"
                : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                {Object.values(activeFilters).filter((v) => v !== "").length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">Filter</h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {filter.label}
                </label>
                <select
                  value={activeFilters[filter.key] || ""}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Semua</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null;
            const filter = filters.find((f) => f.key === key);
            const option = filter?.options.find((o) => o.value === value);

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-primary text-white text-sm px-3 py-1 rounded-full"
              >
                {filter?.label}: {option?.label}
                <button
                  type="button"
                  onClick={() => onFilterChange(key, "")}
                  className="hover:bg-blue-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
