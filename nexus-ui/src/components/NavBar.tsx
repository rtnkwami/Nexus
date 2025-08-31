// This file defines the main navigation bar for the application.
// It displays the app logo, user authentication state, and a user menu with navigation links.

"use client"
import { useUser } from "@auth0/nextjs-auth0"
import Link from "next/link"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useUserSetup } from "@/hooks/useUserSetup"
import NavbarProductSearch from "@/components/NavBarProductSearch"
import CartDrawer from "@/components/CartDrawer"

/**
 * Navbar component renders the top navigation bar.
 * - Shows the app logo and name.
 * - Displays user avatar and dropdown menu if authenticated.
 * - Shows a sign-in button if not authenticated.
 * - Includes a product search bar in the center.
 * - Includes a cart drawer button.
 * - Uses Auth0 for authentication state.
 */
export default function Navbar() {
  // Get the current user and loading state from Auth0
  const { user, isLoading } = useUser()
  // Run user setup logic (e.g., ensure user exists in backend)
  useUserSetup()

  return (
    <nav className="sticky top-0 z-50 flex h-20 items-center justify-between border-b bg-white px-8">
      <Link href="/" className="flex items-center text-2xl font-semibold flex-shrink-0">
        <Image
        src={"https://static.vecteezy.com/system/resources/previews/049/590/071/non_2x/networking-nexus-icon-line-illustration-vector.jpg"}
        alt="Nexus Logo"
        width={40}
        height={40}
        />
        Nexus
      </Link>

      <div className="flex-1 max-w-md mx-8">
        <NavbarProductSearch placeholder="Search products..." />
      </div>

      <div className="flex items-center space-x-4 flex-shrink-0">
        <CartDrawer />

        {/* Show user menu if authenticated, otherwise show sign-in button */}
        {!isLoading &&
          (user ? (
            <DropdownMenu>
              {/* Avatar triggers the dropdown menu */}
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={user.picture ?? ""} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                {/* User info section in dropdown */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.picture ?? ""} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Navigation links in dropdown */}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/shop/analytics/overview" className="cursor-pointer">
                    Shop Management
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    Account
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign out link */}
                <DropdownMenuItem asChild>
                  <a
                    href="/auth/logout"
                    className="w-full cursor-pointer rounded-md text-red-600 hover:bg-red-50 focus:bg-red-100"
                  >
                    Sign Out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Show sign-in button if not authenticated
            <Button asChild variant="outline">
              <a href="/auth/login">Sign In</a>
            </Button>
          ))}
      </div>
    </nav>
  )
}