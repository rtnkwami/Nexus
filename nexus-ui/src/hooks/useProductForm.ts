// This custom hook manages the state and logic for the product creation and update form.
// It handles form state, validation, API submission, and success/error handling.

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAccessToken } from "@auth0/nextjs-auth0"

// ProductFormData defines the shape of the form fields for product creation/updating.
export interface ProductFormData {
  name: string
  price: string
  description: string
  // imageUrl: string
  stock: string
  category: string
}

// Product type represents a product as stored in the backend, with numeric price and stock.
export interface Product extends Omit<ProductFormData, 'price' | 'stock'> {
  id: string
  price: number
  stock: number
}

// Options for configuring the useProductForm hook.
interface UseProductFormOptions {
  mode: 'create' | 'update' // Determines if the form is for creating or updating a product
  productId?: string        // Product ID (required for update)
  initialData?: Partial<ProductFormData> // Initial form values (for editing)
  onSuccess?: (updated: Product) => void // Callback after successful submit
  title?: string            // Optional form title
}

// useProductForm manages form state, validation, and submission for product forms.
export function useProductForm({ 
  mode, 
  initialData = {}, 
  productId, 
  onSuccess 
}: UseProductFormOptions) {
  const router = useRouter()
  // isLoading tracks the loading state during form submission
  const [isLoading, setIsLoading] = useState(false)
  // form holds the current values of the form fields
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    // imageUrl: "",
    stock: "",
    category: "",
    ...initialData
  })

  // handleChange updates the form state when an input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // resetForm resets the form to its initial state
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      // imageUrl: "",
      stock: "",
      category: "",
      ...initialData
    })
  }

  // validateForm checks for required fields and valid values
  const validateForm = (): string | null => {
    if (!form.name.trim()) return "Product name is required"
    if (!form.price || parseFloat(form.price) <= 0) return "Price must be greater than 0"
    if (!form.category.trim()) return "Category is required"
    if (!form.stock || parseInt(form.stock) < 1) return "Stock must be at least 1"
    return null
  }

  // handleSubmit validates and submits the form to the backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setIsLoading(true)

    // Prepare the payload for the API request
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
      // Get the user's access token for authentication
      const token = await getAccessToken()
      // Determine the API endpoint and HTTP method based on mode
      const url = mode === 'create' 
        ? 'http://localhost:5000/shops/products'
        : `http://localhost:5000/shops/products/${productId}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      // Send the request to the backend API
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

      // Parse the response and extract the saved product
      const json = await res.json()
      const savedProduct = json.product

      // Call the onSuccess callback if provided, otherwise redirect
      if (onSuccess) {
        onSuccess(savedProduct)
      } else {
        router.push("/shop/products")
      }
    } catch (err) {
      // Handle errors and notify the user
      console.error("Error:", err)
      alert(`Failed to ${mode} product.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Return form state and handlers for use in the form component
  return {
    form,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm
  }
}