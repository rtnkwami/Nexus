import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProductForm, type ProductFormData } from "@/hooks/useProductForm"

interface ProductFormProps {
  mode: 'create' | 'update'
  initialData?: Partial<ProductFormData>
  productId?: string
  onSuccess?: () => void
  title?: string
}

export function ProductForm({ 
  mode, 
  initialData, 
  productId, 
  onSuccess,
  title 
}: ProductFormProps) {
  const { form, isLoading, handleChange, handleSubmit } = useProductForm({
    mode,
    initialData,
    productId,
    onSuccess
  })

  const defaultTitle = mode === 'create' ? 'Add New Product' : 'Update Product'

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || defaultTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <Textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Input
            name="price"
            placeholder="Price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <Input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <Input
            name="stock"
            placeholder="Stock"
            type="number"
            min="1"
            value={form.stock}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          {/* <Input
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
            disabled={isLoading}
          /> */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading 
              ? (mode === 'create' ? 'Creating...' : 'Updating...') 
              : (mode === 'create' ? 'Create Product' : 'Update Product')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}