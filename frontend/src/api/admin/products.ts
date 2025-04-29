import { Product, ProductCreate, ProductUpdate, ProductForm } from '../../types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PREFIX = '/api/v1/admin';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/products`, {
      credentials: 'include',
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
    const preparedData = await prepareProductData(productData);

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/products`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preparedData),
    });

    if (!response.ok) throw new Error('Failed to create product');
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, productData: ProductUpdate): Promise<Product> => {
  try {
    const preparedData = await prepareProductData(productData);

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/products/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preparedData),
    });

    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/products/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

const prepareProductData = async (productData: ProductCreate | ProductForm | ProductUpdate) => { 
  const { image, ...otherData } = productData;

  let imageBase64: string | undefined = undefined;

  if (image instanceof File) {
    imageBase64 = await fileToBase64(image);
  } else if (typeof image === 'string') {
    imageBase64 = image;
  }

  return {
    ...otherData,
    ...(imageBase64 ? { image: imageBase64 } : {}),
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}
