// This custom hook ensures the authenticated user is registered in the backend
// and that the user's shop ID is available in cookies for API requests.
// It runs once per session after login and sets up the user's shop context.

"use client"

import { useEffect, useState } from "react"
import { getAccessToken, useUser } from "@auth0/nextjs-auth0"
import Cookies from "js-cookie"

/**
 * useUserSetup registers the user in the backend (if needed) and stores the shop ID in cookies.
 * - Runs after login to ensure the backend has a user record and a shop for this user.
 * - Stores the shopId in a cookie for use in subsequent API requests.
 * - Only runs once per session, or when the user changes.
 */
export function useUserSetup() {
  const { user } = useUser()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Only run if user is present and not already initialized
    if (!user || initialized) return

    // init registers the user and sets up the shop context
    async function init() {
      try {
        // Get access token for authenticated API requests
        const token = await getAccessToken()

        // Register the user in the backend and get the user's shop
        const res = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: {
              sub: user.sub,
              name: user.name,
            },
          }),
        })

        // Parse the response and extract the shop ID
        const { userShop } = await res.json();
        Cookies.set("shopId", userShop.id, {
            path: "/",
            expires: 1,
            sameSite: "lax",
        });

        if (!res.ok) {
          // Log error if user registration failed
          const msg = await res.text()
          console.error("User init failed:", msg)
        } else {
          // Mark as initialized to prevent duplicate requests
          console.log("User initialized successfully.")
          setInitialized(true)
        }
      } catch (err) {
        // Log any errors during setup
        console.error("User init error:", err)
      }
    }

    init()
  }, [user, initialized])
}