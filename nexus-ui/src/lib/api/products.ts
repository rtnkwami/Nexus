import { getAccessToken } from "@auth0/nextjs-auth0"

export const deleteProduct = async (productId: string) => {
  const token = await getAccessToken()
  const res = await fetch(`http://localhost:5000/shops/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to delete product")
}
  return true
}