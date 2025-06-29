// src/app/shop/layout.tsx
import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, Package, ShoppingCart, Settings } from "lucide-react"

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* --- fixed sidebar --- */}
      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r bg-background md:flex">
        {/* top links */}
        <div>
          <div className="border-b p-6 text-lg font-semibold">Shop Management</div>
          <nav className="flex flex-col gap-2 p-4">
            <NavLink href="/shop" icon={<Home className="h-4 w-4" />}>Dashboard</NavLink>
            <NavLink href="/shop/products" icon={<Package className="h-4 w-4" />}>Products</NavLink>
            <NavLink href="/shop/orders" icon={<ShoppingCart className="h-4 w-4" />}>Orders</NavLink>
          </nav>
        </div>

        {/* bottom link */}
        <div className="border-t p-4">
          <NavLink href="/shop/settings" icon={<Settings className="h-4 w-4" />}>Settings</NavLink>
        </div>
      </aside>

      {/* --- main scroll area --- */}
      <main className="ml-0 mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 md:ml-64">
        {children}
      </main>
    </div>
  )
}

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
