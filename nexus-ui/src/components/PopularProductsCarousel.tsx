"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  images: string[];
  rank?: string;
};

type ProductCardProps = {
  product: Product;
  isCenter: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, isCenter }) => {
  return (
    <Link href={`/products/${product.id}`}>
        <div
        className={`bg-white rounded-lg overflow-hidden transition-all duration-300 ${
            isCenter ? "shadow-2xl" : "shadow-md"
        }`}
        >
        <div className="aspect-square overflow-hidden">
            <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            />
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category}
            </span>
            </div>
        </div>
        </div>
    </Link>
  );
};

type PopularProductsCarouselProps = {
  products: Product[];
};

const positions = {
  prev: { x: -250, scale: 0.9, opacity: 0.5, rotateY: 15, zIndex: 0 },
  center: { x: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 1 },
  next: { x: 250, scale: 0.9, opacity: 0.5, rotateY: -15, zIndex: 0 },
};

const PopularProductsCarousel: React.FC<PopularProductsCarouselProps> = ({ products }) => {
  const [[currentIndex, direction], setCurrentIndex] = useState<[number, number]>([0, 0]);

  const nextSlide = () => {
    setCurrentIndex(([prev]) => [(prev + 1) % products.length, 1]);
  };

  const prevSlide = () => {
    setCurrentIndex(([prev]) => [(prev - 1 + products.length) % products.length, -1]);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  if (products.length === 0) {
    return <div className="text-gray-500">No popular products found.</div>;
  }

  const prevIndex = (currentIndex - 1 + products.length) % products.length;
  const nextIndex = (currentIndex + 1) % products.length;

  const visibleProducts = [
    { product: products[prevIndex], position: "prev" },
    { product: products[currentIndex], position: "center" },
    { product: products[nextIndex], position: "next" },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">

        <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">
            Featured This Week
        </h2>
      <div className="relative overflow-visible py-8 h-[500px] flex items-center justify-center perspective-1000">
        <AnimatePresence initial={false} custom={direction}>
          {visibleProducts.map(({ product, position }) => (
            <motion.div
              key={`${product.id}-${position}`}
              initial={{ ...positions[position], opacity: 0 }}
              animate={positions[position]}
              exit={{ ...positions[position], opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute w-72"
              style={{ transformStyle: "preserve-3d" }}
            >
              <ProductCard product={product} isCenter={position === "center"} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 z-20"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 z-20"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      <div className="flex justify-center mt-6 gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex([index, index > currentIndex ? 1 : -1])}
            className={`w-2 h-2 rounded-full transition-all duration-200
              ${index === currentIndex ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularProductsCarousel;
