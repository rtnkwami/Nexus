import React from 'react';

interface FormData {
  name: string;
  price: string;
  stock: string;
  category: string;
}

type Category = string;

interface ProductEditFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  categories: Category[];
  categoriesLoading: boolean;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({
  formData,
  onInputChange,
  categories,
  categoriesLoading,
}) => {

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Product Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onInputChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onInputChange}
            disabled={categoriesLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select Category'}
            </option>
            {categories.categories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductEditForm;