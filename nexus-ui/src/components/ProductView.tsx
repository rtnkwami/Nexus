"use client";
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const ProductView = ({ productId }: { productId: string }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products/${productId}`);
        const data = await res.json();
        console.log(data)
        console.log()
        console.log(data.product)
        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      // Optionally show success message
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      // Optionally show error message
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) return <p>Loading...</p>;

  const hasImages = product.images && product.images.length > 0;
  const currentImage = hasImages ? product.images[selectedImageIndex] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image Section */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="bg-gray-100 rounded-xl flex items-center justify-center">
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-auto max-h-[700px] object-contain"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {hasImages && product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index 
                    ? 'border-green-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <p className="text-sm">{product.category}</p>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-2xl font-bold text-gray-800">&#8373;{product.price.toFixed(2)}</p>
        <p className="text-gray-700">{product.description}</p>

        <div className="flex items-center space-x-4 mt-4">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
            min={1}
            max={product.stock}
            className="w-16 border rounded px-2 py-1"
          />
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="bg-black hover:bg-gray-700 text-white font-medium px-5 py-2 rounded"
          >
            {isAddingToCart ? 'Adding...' : 'Add to cart'}
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
        </p>

        <div className="mt-6 border-t pt-4">
          <p className="text-gray-700 font-medium">Guaranteed Safe Checkout</p>
          <div className="flex space-x-4 mt-2">
            <img src="/visa.svg" alt="Visa" className="h-6" />
            <img src="/mastercard.svg" alt="MasterCard" className="h-6" />
            <img src="/amex.svg" alt="Amex" className="h-6" />
            <img src="/discover.svg" alt="Discover" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;