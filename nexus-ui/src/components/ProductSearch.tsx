"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Interface for search filters
export interface SearchFilters {
  searchTerm: string
  minPrice?: number
  maxPrice?: number
  category?: string
}

// Interface for component props
interface ProductSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClearSearch?: () => void  // Optional callback for clearing search
  isLoading?: boolean
  placeholder?: string
  categories?: string[]
  showClearButton?: boolean  // Whether to show the clear search button
  hasActiveSearch?: boolean  // Whether there's an active search
}

/**
 * ProductSearch component provides basic and advanced search functionality
 * for products with a clean, collapsible interface.
 */
export default function ProductSearch({
  onSearch,
  onClearSearch,
  isLoading = false,
  placeholder = "Search products...",
  categories = [],
  showClearButton = false,
  hasActiveSearch = false
}: ProductSearchProps) {
  // State for search filters
  const [searchTerm, setSearchTerm] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [category, setCategory] = useState("")
  
  // State for advanced search visibility
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  // Handle basic search (Enter key or search button)
  const handleBasicSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const filters: SearchFilters = {
      searchTerm: searchTerm.trim(),
      ...(minPrice && { minPrice: parseFloat(minPrice) }),
      ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
      ...(category && { category })
    }
    
    onSearch(filters)
  }

  // Handle advanced search form submission
  const handleAdvancedSearch = (e: React.FormEvent) => {
    e.preventDefault()
    handleBasicSearch()
  }

  // Clear all filters and reset search
  const handleClearAll = () => {
    setSearchTerm("")
    setMinPrice("")
    setMaxPrice("")
    setCategory("")
    setIsAdvancedOpen(false)
    
    // Call parent's clear search function if provided
    if (onClearSearch) {
      onClearSearch()
    } else {
      // Fallback: trigger search with empty filters
      onSearch({ searchTerm: "" })
    }
  }

  // Clear just the local filter inputs (for advanced search form)
  const handleClearFilters = () => {
    setSearchTerm("")
    setMinPrice("")
    setMaxPrice("")
    setCategory("")
    onSearch({ searchTerm: "" })
  }

  // Check if any filters are active
  const hasLocalFilters = searchTerm || minPrice || maxPrice || category
  const hasAdvancedFilters = minPrice || maxPrice || category

  return (
    <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
      <div className="w-full space-y-4">
        {/* Main search bar */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBasicSearch()}
              className="pl-10 pr-4"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleBasicSearch}
            disabled={isLoading}
            className="px-4"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
          
          {/* Clear search button - shows when there are active filters or active search */}
          {(showClearButton || hasActiveSearch || hasLocalFilters) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="px-3 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
          
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`px-3 ${hasAdvancedFilters ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Advanced
              {hasAdvancedFilters && (
                <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2rem] h-5 flex items-center justify-center">
                  {[minPrice, maxPrice, category].filter(Boolean).length}
                </span>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        {/* Advanced search form - now below the search bar */}
        <CollapsibleContent>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Advanced Search</h3>
              {hasAdvancedFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            <form onSubmit={handleAdvancedSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Min Price */}
                <div className="space-y-2">
                  <Label htmlFor="minPrice" className="text-sm font-medium">
                    Min Price
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0.00"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full"
                  />
                </div>
                
                {/* Max Price */}
                <div className="space-y-2">
                  <Label htmlFor="maxPrice" className="text-sm font-medium">
                    Max Price
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="999.99"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full"
                  />
                </div>
                
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdvancedOpen(false)}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-4"
                >
                  {isLoading ? "Searching..." : "Apply Filters"}
                </Button>
              </div>
            </form>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}