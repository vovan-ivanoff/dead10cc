import { Product, ProductCreate, ProductUpdate } from '../../types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1/admin';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/products`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (productData: ProductCreate): Promise<Product> => {
  try {
    const formData = new FormData();
    
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'image' && key !== 'id') {
        formData.append(key, value.toString());
      }
    });    

    if (productData.image) {
      const image = productData.image instanceof File 
                    ? productData.image 
                    : await urlToFile(productData.image);
      formData.append('image', image);
    }
    

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/products`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to create product');
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: number, 
  productData: ProductUpdate
): Promise<Product> => {
  try {
    const formData = new FormData();
    
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'image' && key !== 'id') {
        formData.append(key, value.toString());
      }
    });    

    if (productData.image) {
      const image = productData.image instanceof File 
                    ? productData.image 
                    : await urlToFile(productData.image);
      formData.append('image', image);
    }    

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/products/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

async function urlToFile(imageUrl: string): Promise<File> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], 'product-image', { type: blob.type });
}

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/products/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};