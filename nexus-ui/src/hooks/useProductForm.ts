import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAccessToken } from "@auth0/nextjs-auth0"

export interface ProductFormData {
  name: string
  price: string
  description: string
//   imageUrl: string
  stock: string
  category: string
}

export interface Product extends Omit<ProductFormData, 'price' | 'stock'> {
  id: string
  price: number
  stock: number
}

interface UseProductFormOptions {
  mode: 'create' | 'update'
  productId?: string
  initialData?: Partial<ProductFormData>
  onSuccess?: (updated: Product) => void   // <‑‑ changed
  title?: string
}

export function useProductForm({ 
  mode, 
  initialData = {}, 
  productId, 
  onSuccess 
}: UseProductFormOptions) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    // imageUrl: "",
    stock: "",
    category: "",
    ...initialData
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
    //   imageUrl: "",
      stock: "",
      category: "",
      ...initialData
    })
  }

  const validateForm = (): string | null => {
    if (!form.name.trim()) return "Product name is required"
    if (!form.price || parseFloat(form.price) <= 0) return "Price must be greater than 0"
    if (!form.category.trim()) return "Category is required"
    if (!form.stock || parseInt(form.stock) < 1) return "Stock must be at least 1"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setIsLoading(true)

    const payload = {
      product: {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        // ...(form.imageUrl && { imageUrl: form.imageUrl })
      },
    }

    try {
      const token = await getAccessToken()
      const url = mode === 'create' 
        ? 'http://localhost:5000/shops/products'
        : `http://localhost:5000/shops/products/${productId}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed to ${mode} product`)
      }

      const json = await res.json()
      const savedProduct = json.product

      if (onSuccess) {
        onSuccess(savedProduct)
      } else {
        router.push("/shop/products")
      }
    } catch (err) {
      console.error("Error:", err)
      alert(`Failed to ${mode} product.`)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm
  }
}