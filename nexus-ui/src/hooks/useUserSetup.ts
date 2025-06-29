"use client"

import { useEffect, useState } from "react"
import { getAccessToken, useUser } from "@auth0/nextjs-auth0"
import Cookies from "js-cookie"

export function useUserSetup() {
  const { user } = useUser()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!user || initialized) return

    async function init() {
      try {
        const token = await getAccessToken()

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

        const { userShop } = await res.json();
        Cookies.set("shopId", userShop.id, {
            path: "/",
            expires: 1,
            sameSite: "lax",
        });

        if (!res.ok) {
          const msg = await res.text()
          console.error("User init failed:", msg)
        } else {
          console.log("User initialized successfully.")
          setInitialized(true)
        }
      } catch (err) {
        console.error("User init error:", err)
      }
    }

    init()
  }, [user, initialized])
}