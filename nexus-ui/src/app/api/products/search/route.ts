// app/api/products/search/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('Hello World')
  try {
    const { searchParams } = new URL(request.url)
    console.log(searchParams);
    
    // Extract search parameters
    const search = searchParams.get('search') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query parameters for your backend API
    const queryParams = new URLSearchParams()
    
    if (search) queryParams.append('search', search)
    if (minPrice) queryParams.append('minPrice', minPrice)
    if (maxPrice) queryParams.append('maxPrice', maxPrice)
    if (category) queryParams.append('category', category)
    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())

    // Make request to your backend API
    const response = await fetch(
      `http://localhost:5000/products?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Return the exact structure your frontend expects
    return NextResponse.json({
      products: data.products || [],
      pagination: data.pagination || null
    })
    
  } catch (error) {
    console.error('Product search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}