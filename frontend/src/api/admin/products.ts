import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductForm,
} from '../../types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const PUBLIC_PREFIX = '/api/v1';

interface ApiProduct {
  id: number;
  article: number;
  title: string;
  description: string;
  price: number;
  seller: string;
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  preview?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${PUBLIC_PREFIX}/products`, {
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

export const getProductPage = async (
  pageIndex: number = 0,
  pageSize: number = 24,
  filterBy: Record<string, unknown> = {}
): Promise<Product[]> => {
  // Формируем URL с query параметрами page_index и page_size
  const url = new URL(`${API_BASE_URL}${PUBLIC_PREFIX}/products/get_page`);
  url.searchParams.append('page_index', String(pageIndex));
  url.searchParams.append('page_size', String(pageSize));

  const requestOptions: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    // В тело отправляем только filter_by, как пустой объект или с фильтрами
    body: JSON.stringify(filterBy),
  };

  console.log('Making request to:', url.toString());
  console.log('Request body:', filterBy);

  const response = await fetch(url.toString(), requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  console.log('Received data:', data);

  if (data.pages === "reached end") {
    return [];
  }

  // Преобразование данных API в формат Product[]
  const products: Product[] = await Promise.all(data.map(async (apiProduct: ApiProduct) => {
    try {
      const previewUrl = `${API_BASE_URL}/api/v1/files/preview/${apiProduct.id}`;
      const previewResponse = await fetch(previewUrl, { credentials: 'include' });

      return {
        id: apiProduct.id,
        title: apiProduct.title,
        price: apiProduct.price,
        seller: apiProduct.seller || "Не указан",
        image: apiProduct.image || '/assets/images/pictures/default.jpg',
        rating: apiProduct.rating,
        reviews: apiProduct.reviews,
        preview: previewResponse.ok ? previewUrl : undefined,
        description: apiProduct.description,
      };
    } catch (error) {
      console.error(`Error checking preview for product ${apiProduct.id}:`, error);
      return {
        id: apiProduct.id,
        title: apiProduct.title,
        price: apiProduct.price,
        seller: apiProduct.seller || "Не указан",
        image: apiProduct.image || '/assets/images/pictures/default.jpg',
        rating: apiProduct.rating,
        reviews: apiProduct.reviews,
        preview: undefined,
        description: apiProduct.description,
      };
    }
  }));

  return products;
};


export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}${PUBLIC_PREFIX}/products/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Failed to fetch product with id ${id}`);
    }

    const product: ApiProduct = await response.json();

    let preview: string | undefined;
    try {
      const previewUrl = `${API_BASE_URL}${PUBLIC_PREFIX}/products/preview/${id}`;
      const previewResponse = await fetch(previewUrl, { credentials: 'include' });
      if (previewResponse.ok) {
        preview = previewUrl;
      }
    } catch (previewError) {
      console.error(`Error fetching preview for product ${id}:`, previewError);
    }

    return {
      ...product,
      price: Math.round(Number(product.price)),
      preview,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};


export const getProductPreview = async (productId: number): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}${PUBLIC_PREFIX}/products/preview/${productId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product preview');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching product preview:', error);
    throw error;
  }
};

export const createProduct = async (productData: ProductCreate): Promise<Product> => {
  try {
    const preparedData = await prepareProductData(productData);

    const response = await fetch(`${API_BASE_URL}${PUBLIC_PREFIX}/products`, {
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

export const updateProduct = async (
  id: number,
  productData: ProductUpdate
): Promise<Product> => {
  try {
    const preparedData = await prepareProductData(productData);

    const response = await fetch(`${API_BASE_URL}${PUBLIC_PREFIX}/products/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}${PUBLIC_PREFIX}/products/${id}`, {
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

export const findProductByArticle = async (article: number): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${PUBLIC_PREFIX}/products/find`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Failed to find product with article ${article}`);
    }

    const products: ApiProduct[] = await response.json();
    return products.map(product => ({
      ...product,
      price: Math.round(Number(product.price)),
      image: product.image || '/assets/images/pictures/default.jpg',
    }));
  } catch (error) {
    console.error('Error finding product:', error);
    throw error;
  }
};

const prepareProductData = async (
  productData: ProductCreate | ProductForm | ProductUpdate
) => {
  const { image, ...otherData } = productData;

  let imageBase64: string | undefined;

  if (image instanceof File) {
    imageBase64 = await fileToBase64(image);
  } else if (typeof image === 'string') {
    imageBase64 = image;
  }

  return {
    ...otherData,
    ...(imageBase64 ? { image: imageBase64 } : {}),
  };
};

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
