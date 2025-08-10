"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAccessToken } from "@auth0/nextjs-auth0";

// hooks
import { useCategories } from "@/hooks/useCategories";
import { useImageUpload } from "@/hooks/useImageUpload";

// components
import ProductHeader from "@/components/ProductHeader";
import ImageDisplay from "@/components/ImageDisplay";
import ImageUpload from "@/components/ImageUpload";
import ProductEditForm from "@/components/ProductEditForm";
import RichTextEditor from "@/components/RichTextEditor";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

type FormData = {
  name: string;
  price: string;
  stock: string;
  category: string;
  images: string[];
};

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });
  const [description, setDescription] = useState("");
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const {
    images,
    selectedImageIndex,
    dragOver,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    selectImage,
    uploadPendingImages,
    updateRemoteUrls,
    setImageAsDisplay,
  } = useImageUpload(loadedImages);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/shops/products/${productId}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { product } = await res.json();

        const productImages = product.images ?? [];
        
        setFormData({
          name: product.name ?? "",
          price: product.price?.toString() ?? "",
          stock: product.stock?.toString() ?? "",
          category: product.category ?? "",
          images: productImages,
        });
        setDescription(product.description ?? "");
        setLoadedImages(productImages);
        
        // 🔸 NEW: Update the hook with loaded images
        updateRemoteUrls(productImages);
        
        setLoading(false);
      } catch (err: any) {
        setError(`Could not load product: ${err.message}`);
        setLoading(false);
      }
    })();
  }, [productId, updateRemoteUrls]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFormattedData = () => ({
    ...formData,
    price: parseFloat(formData.price) || 0,
    stock: parseInt(formData.stock) || 0,
    description:
      document.getElementById("description-editor")?.innerHTML || description,
  });

  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 🔸 Upload new images first and get full list of URLs
      const finalImages = await uploadPendingImages();

      const payload = {
        product: getFormattedData(),
        images: finalImages,
      };

      const token = await getAccessToken();

      const res = await fetch(`http://localhost:5000/shops/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      alert("Product updated successfully!");
      
      // 🔸 Update the form data with the new images
      setFormData(prev => ({ ...prev, images: finalImages }));
      
    } catch (err: any) {
      alert(`Failed to update product: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => router.back();

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <ProductHeader onBack={handleBack} onSave={handleSave} isSaving={isSaving} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* images */}
          <div className="space-y-6">
            <ImageDisplay
              images={images}
              selectedImageIndex={selectedImageIndex}
              onSelectImage={selectImage}
              onRemoveImage={removeImage}
              onSetAsDisplayImage={setImageAsDisplay}
            />
            <ImageUpload
              dragOver={dragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileInputChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            />
          </div>

          {/* details form */}
          <div className="space-y-6">
            <ProductEditForm
              formData={formData}
              onInputChange={handleInputChange}
              categories={categories}
              categoriesLoading={categoriesLoading}
            />
          </div>
        </div>

        {/* description */}
        <RichTextEditor description={description} onDescriptionChange={setDescription} />

        {/* categories warning */}
        {categoriesError && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Warning: Could not load categories. Using default options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;