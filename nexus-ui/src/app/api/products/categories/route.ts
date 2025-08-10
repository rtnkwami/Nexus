// app/api/products/categories/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Make request to your backend API
    const response = await fetch(
      `http://localhost:5000/products/categories`,
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
    
    // Return the categories data
    return NextResponse.json({
      categories: data.categories || data || []
    })
    
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}