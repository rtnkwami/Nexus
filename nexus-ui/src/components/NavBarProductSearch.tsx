// components/NavBarProductSearch.tsx
"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NavbarProductSearchProps {
  placeholder?: string
  className?: string
}

/**
 * Lightweight product search component for the navbar
 * Redirects to the search results page when a search is performed
 */
export default function NavbarProductSearch({ 
  placeholder = "Search our product catalog...",
  className = ""
}: NavbarProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const trimmedSearchTerm = searchTerm.trim()
    if (trimmedSearchTerm) {
      // Navigate to search results page with query parameter
      router.push(`/products/search?search=${encodeURIComponent(trimmedSearchTerm)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-20 w-full"
      />
      <Button
        type="submit"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
        disabled={!searchTerm.trim()}
      >
        Search
      </Button>
    </form>
  )
}