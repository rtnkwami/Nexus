// components/NavBarProductSearch.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NavbarProductSearchProps {
  placeholder?: string
  className?: string
}

export default function NavbarProductSearch({ 
  placeholder = "Search our product catalog...",
  className = ""
}: NavbarProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const wasSelectionMade = useRef(false)

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    try {
      setLoading(true)
      const res = await fetch(
        `http://localhost:5000/products/search-suggestions?q=${encodeURIComponent(query)}`
      )
      if (!res.ok) throw new Error("Failed to fetch suggestions")
      const data = await res.json()
      setSuggestions(data)
    } catch (err) {
      console.error(err)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Debounce search input
  useEffect(() => {
    if (wasSelectionMade.current) {
      // Skip fetching after user picked something
      wasSelectionMade.current = false
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(searchTerm)
        setActiveIndex(-1) // reset highlight
      }, 300)

      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
      }
  }, [searchTerm])

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = searchTerm.trim()
    if (trimmed) {
      router.push(`/products/search?search=${encodeURIComponent(trimmed)}`)
      setSuggestions([])
      setActiveIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex(prev => (prev >= suggestions.length - 1 ? 0 : prev + 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1))
        break
      case "Enter":
        e.preventDefault()
        let chosen
        if (activeIndex !== -1) {
          chosen = suggestions[activeIndex]
        } else {
          chosen = suggestions[0]
        }
        if (chosen) {
          setSearchTerm(chosen.name)
          setSuggestions([])
          setActiveIndex(-1)
          wasSelectionMade.current = true
          router.push(`/products/search?search=${encodeURIComponent(chosen.name)}`)
        }
        break
      case "Escape":
        setSuggestions([])
        setActiveIndex(-1)
        break
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-24 w-full h-12 !text-base !leading-relaxed rounded-md"
        />

        <Button
          type="submit"
          size="lg"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-4 text-sm font-medium"
          disabled={!searchTerm.trim()}
        >
          Search
        </Button>
      </form>

      {/* 🔹 Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border mt-1 w-full rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className={`p-2 cursor-pointer ${
                idx === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              onMouseDown={() => { // use onMouseDown so click fires before blur
                setSearchTerm(s.name)
                setSuggestions([])
                setActiveIndex(-1)
                wasSelectionMade.current = true
                router.push(`/products/search?search=${encodeURIComponent(s.name)}`)
              }}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}

      {/* Optional: loading indicator */}
      {loading && (
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
          Loading...
        </div>
      )}
    </div>
  )
}
