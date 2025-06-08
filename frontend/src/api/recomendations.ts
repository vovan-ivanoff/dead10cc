import { Product } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface UserAction {
  id: number;
  user_id: number;
  product_id: number;
  action: 'VIEWED' | 'ADDED_TO_CART' | 'PURCHASED';
}

export const trackUserAction = async (productId: number, action: UserAction['action']) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/recommendations/${productId}/statistics`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
    return response.ok;
  } catch (error) {
    console.error('Tracking error:', error);
    return false;
  }
};

export const getRecommendedProducts = async (
  pageIndex: number = 0,
  pageSize: number = 24,
  refresh: boolean = false
): Promise<{ content: Product[]; collaborative: Product[] }> => {
  const url = new URL(`${API_BASE_URL}/api/v1/recommendations/`);
  url.searchParams.append('page_index', pageIndex.toString());
  url.searchParams.append('page_size', pageSize.toString());
  
  if (refresh) {
    url.searchParams.append('refresh', 'true');
  }

  console.log('Making request to:', url.toString()); // Добавьте это

  const response = await fetch(url.toString(), {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const data = await response.json();
  console.log('Received data:', data); // И это
  return data;
};

// Добавляем новые функции для работы с другими типами рекомендаций
export const getInterestingProducts = async (): Promise<number[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/recommendations`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.interesting_products || [];
  } catch (error) {
    console.error('Error fetching interesting products:', error);
    return [];
  }
};

export const getSimilarUsers = async (): Promise<Array<{user_id: number, similarity: number}>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/recommendations`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.similar_users || [];
  } catch (error) {
    console.error('Error fetching similar users:', error);
    return [];
  }
};

export const getRelevantProducts = async (): Promise<Array<{article: number, relevance: number}>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/recommendations`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.relevant_products || [];
  } catch (error) {
    console.error('Error fetching relevant products:', error);
    return [];
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
