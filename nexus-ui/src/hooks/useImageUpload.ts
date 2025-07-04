import { useState, useCallback } from 'react';

export const useImageUpload = (initialImages: string[] = []) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const handleImageUpload = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  }, [handleImageUpload]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (selectedImageIndex >= index && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  }, [selectedImageIndex]);

  const selectImage = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  return {
    images,
    selectedImageIndex,
    dragOver,
    setImages,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    selectImage
  };
};
