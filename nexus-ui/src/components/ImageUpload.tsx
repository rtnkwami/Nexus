import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  dragOver: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputChange
}) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2">Drag and drop images here, or click to select</p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
      >
        Choose Images
      </label>
    </div>
  );
};

export default ImageUpload;
