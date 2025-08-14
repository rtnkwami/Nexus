// This file defines the responsive layout for all pages under /shop.
// It provides a persistent sidebar for navigation and a main content area for child routes.

"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Package, ShoppingCart, Settings, Menu, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

/**
 * ShopLayout wraps all /shop pages with a responsive sidebar and main content area.
 */
export default function ShopLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div>
      {/* Mobile hamburger menu button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed left-4 top-20 z-50 rounded-md bg-background p-2 shadow-md border md:hidden"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - responsive */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen flex-col justify-between border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          "transform md:translate-x-0",
          "md:flex",
          isMobileMenuOpen ? "flex translate-x-0" : "hidden -translate-x-full md:flex"
        )}
      >
        {/* Sidebar top section with navigation links */}
        <div>
          {/* Sidebar title and collapse button */}
          <div className="border-b p-6 text-lg font-semibold mt-16 flex items-center justify-between">
            {!isCollapsed && <span>Shop Management</span>}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-1 rounded-md hover:bg-accent transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
          {/* Navigation links for shop sections */}
          <nav className="flex flex-col gap-2 p-4">
            <NavSection 
              title="Analytics"
              icon={Home}
              pathPrefix="/shop/analytics"
              pathname={pathname}
              isCollapsed={isCollapsed}
              // ## CHANGE 1: Pass the `toggleCollapse` function down ##
              onCollapseClick={toggleCollapse}
            >
              <NavLink 
                href="/shop/analytics/overview"
                icon={Package}
                onClick={closeMobileMenu}
                isActive={pathname === "/shop/analytics/overview"}
              >
                Overview
              </NavLink>
              <NavLink 
                href="/shop/analytics/sales-performance"
                icon={Package}
                onClick={closeMobileMenu}
                isActive={pathname === "/shop/analytics/sales-performance"}
              >
                Sales Performance
              </NavLink>
              <NavLink 
                href="/shop/analytics/product-insights"
                icon={Package}
                onClick={closeMobileMenu}
                isActive={pathname === "/shop/analytics/product-insights"}
              >
                Product Insights
              </NavLink>
            </NavSection>
            <NavLink 
              href="/shop/products" 
              icon={Package}
              onClick={closeMobileMenu}
              isActive={pathname === "/shop/products"}
              isCollapsed={isCollapsed}
            >
              Inventory
            </NavLink>
            <NavLink 
              href="/shop/orders" 
              icon={ShoppingCart}
              onClick={closeMobileMenu}
              isActive={pathname === "/shop/orders"}
              isCollapsed={isCollapsed}
            >
              Orders
            </NavLink>
          </nav>
        </div>

        {/* Sidebar bottom section with settings link */}
        <div className="border-t p-4">
          <NavLink 
            href="/shop/settings" 
            icon={Settings}
            onClick={closeMobileMenu}
            isActive={pathname === "/shop/settings"}
            isCollapsed={isCollapsed}
          >
            Settings
          </NavLink>
        </div>
      </aside>

      {/* Main content area - responsive */}
      <main 
        className={cn(
          "h-screen overflow-y-auto pt-16",
          "ml-0 pl-16 pr-6 pb-6 md:pl-6 md:pr-6 md:pb-6",
          isCollapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        {children}
      </main>
    </div>
  )
}

/**
 * NavLink is a helper component for sidebar navigation.
 */
function NavLink({
  href,
  icon: IconComponent,
  children,
  onClick,
  isActive = false,
  isCollapsed = false,
}: {
  href: string
  icon: any
  children: ReactNode
  onClick?: () => void
  isActive?: boolean
  isCollapsed?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center rounded-md text-sm font-medium transition-colors group relative",
        isCollapsed ? "p-3 justify-center" : "px-3 py-2 gap-3",
        !isActive && "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground font-semibold"
      )}
      title={isCollapsed ? children?.toString() : undefined}
    >
      <IconComponent className={cn("transition-all", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
      {!isCollapsed && (
        <span className="whitespace-nowrap">{children}</span>
      )}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {children}
        </div>
      )}
    </Link>
  )
}

function NavSection({
  title,
  icon: IconComponent,
  isCollapsed,
  pathPrefix,
  children,
  pathname,
  onCollapseClick, // Added prop
}: {
  title: string
  icon: any
  pathPrefix: string
  isCollapsed?: boolean
  children: ReactNode
  pathname: string
  onCollapseClick?: () => void // Added prop type
}) {
  const isActive = pathname.startsWith(pathPrefix)
  const [isOpen, setIsOpen] = useState(isActive)

  return (
    <div>
      <button
        type="button"
        // ## CHANGE 2: Updated onClick logic ##
        onClick={() => {
          if (isCollapsed) {
            // If the sidebar is collapsed, call the function to expand it.
            onCollapseClick?.()
            // Also, ensure the submenu is set to open.
            setIsOpen(true)
          } else {
            // Otherwise, just toggle the submenu as before.
            setIsOpen(!isOpen)
          }
        }}
        className={cn(
          "flex items-center justify-between w-full text-sm font-medium rounded-md transition-colors group relative",
          isCollapsed ? "p-3 justify-center" : "px-3 py-2",
          isActive ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
        title={isCollapsed ? title : undefined}
      >
        <div className="flex items-center gap-3">
            <IconComponent className={cn("transition-all", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
            {!isCollapsed && <span className="whitespace-nowrap">{title}</span>}
        </div>
        
        {!isCollapsed && (
            <ChevronDown 
                className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
            />
        )}

        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {title}
          </div>
        )}
      </button>

      {!isCollapsed && isOpen && (
        <div className="pl-6 mt-1 flex flex-col gap-1">
          {children}
        </div>
      )}
    </div>
  )
}