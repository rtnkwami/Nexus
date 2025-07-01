"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getAccessToken } from "@auth0/nextjs-auth0"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    stock: "",
    category: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (parseInt(form.stock) < 1) {
      alert("Stock must be at least 1")
      return
    }

    const payload = {
      product: {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
      },
    }

    try {
      const token = await getAccessToken()

      const res = await fetch(`http://localhost:5000/shops/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create product")

      router.push("/shop/products")
    } catch (err) {
      console.error("Error:", err)
      alert("Failed to create product.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
            <Input
              name="price"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
            <Input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />
            <Input
              name="stock"
              placeholder="Stock"
              type="number"
              min="1"
              value={form.stock}
              onChange={handleChange}
              required
            />
            {/* <Input
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
            /> */}
            <Button type="submit" className="w-full">
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
