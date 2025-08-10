import React from 'react';
import { ChevronLeft, Save } from 'lucide-react';

interface ProductHeaderProps {
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ onBack, onSave, isSaving }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Inventory
      </button>
      
      <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default ProductHeader;