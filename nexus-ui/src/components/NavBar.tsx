"use client"
import { useUser } from "@auth0/nextjs-auth0"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, isLoading } = useUser()

  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b bg-white">
      <Link href="/" className="text-xl font-semibold">
        Nexus
      </Link>

      {!isLoading && (
        user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={user.picture ?? ""} alt="User avatar" />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              {/* Larger avatar in dropdown */}
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.picture ?? ""} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/shop" className="cursor-pointer">
                  Shop Management
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/account" className="cursor-pointer">
                  Account
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <a
                  href="/auth/logout"
                  className="w-full text-red-600 hover:bg-red-50 focus:bg-red-100 rounded-md cursor-pointer"
                >
                  Sign Out
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="outline">
            <a href="/auth/login">Sign In</a>
          </Button>
        )
      )}
    </nav>
  )
}