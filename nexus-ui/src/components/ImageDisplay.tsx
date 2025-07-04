import React from 'react';
import { X } from 'lucide-react';

interface ImageDisplayProps {
  images: string[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  onRemoveImage: (index: number) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, selectedImageIndex, onSelectImage, onRemoveImage }) => {
  return (
    <div className="space-y-6">
      <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[selectedImageIndex]}
            alt="Product"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image selected
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto p-2">
          {images.map((image, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => onSelectImage(index)}
              />
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;