import React from 'react';
import { X } from 'lucide-react';

interface ImageDisplayProps {
  images: string[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  onRemoveImage: (index: number) => void;
  onSetAsDisplayImage: (index: number) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, selectedImageIndex, onSelectImage, onRemoveImage, onSetAsDisplayImage }) => {
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

      <div className="flex gap-4 flex-wrap p-2">
        {images.map((image, index) => (
          <div key={index} className="relative w-28 h-28">
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className={`w-full h-full object-cover rounded-lg cursor-pointer border-2 ${
                index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => onSelectImage(index)}
            />
            <button
              onClick={() => onRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
            {index !== 0 && (
              <button
                onClick={() => {
                  console.log('Clicked set display for index:', index);
                  onSetAsDisplayImage(index)}}
                className="absolute bottom-1 left-1 bg-white/80 text-xs text-blue-700 border border-blue-500 rounded px-1 py-0.5 hover:bg-blue-100"
              >
                Set as display
              </button>
            )}
            {index === 0 && (
              <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs rounded px-1 py-0.5">
                Display
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDisplay;