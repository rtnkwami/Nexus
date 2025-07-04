// This file defines the layout for all pages under /shop.
// It provides a persistent sidebar for navigation and a main content area for child routes.

import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, Package, ShoppingCart, Settings } from "lucide-react"

/**
 * ShopLayout wraps all /shop pages with a sidebar and main content area.
 * The sidebar contains navigation links for shop management sections.
 * The main area displays the currently selected child page.
 */
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* --- fixed sidebar --- */}
      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r bg-background md:flex">
        {/* Sidebar top section with navigation links */}
        <div>
          {/* Sidebar title */}
          <div className="border-b p-6 text-lg font-semibold">Shop Management</div>
          {/* Navigation links for shop sections */}
          <nav className="flex flex-col gap-2 p-4">
            <NavLink href="/shop" icon={<Home className="h-4 w-4" />}>
              Analytics Dashboard
            </NavLink>
            <NavLink href="/shop/products" icon={<Package className="h-4 w-4" />}>
              Products
            </NavLink>
            <NavLink href="/shop/orders" icon={<ShoppingCart className="h-4 w-4" />}>
              Orders
            </NavLink>
          </nav>
        </div>

        {/* Sidebar bottom section with settings link */}
        <div className="border-t p-4">
          <NavLink href="/shop/settings" icon={<Settings className="h-4 w-4" />}>
            Settings
          </NavLink>
        </div>
      </aside>

      {/* --- main scroll area --- */}
      {/* The main content area shifts right on desktop to accommodate the sidebar */}
      <main className="ml-0 mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 md:ml-64">
        {children}
      </main>
    </div>
  )
}

/**
 * NavLink is a helper component for sidebar navigation.
 * It renders a styled link with an icon and label.
 */
function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      {children}
    </Link>
  )
}
