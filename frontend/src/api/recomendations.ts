import { Product } from "@/types/product";
import { getProduct } from "./admin/products";
import { checkAuth } from "./auth";

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

export const getRecommendedProducts = async (count: number = 4): Promise<Product[]> => {
  try {
    const user = await checkAuth();
    if (!user) throw new Error('User not authenticated');

    const recResponse = await fetch(`${API_BASE_URL}/api/v1/recommendations?count=${count}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!recResponse.ok) {
      console.error('Failed to fetch recommendations, status:', recResponse.status);
      return [];
    }

    const data = await recResponse.json();
    console.log('Recommendations API response:', data);

    // Если API возвращает массив — используем его, иначе ищем поле recommendedIds
    let recommendedIds: number[] = [];

    if (Array.isArray(data)) {
      recommendedIds = data;
    } else if (Array.isArray(data.recommendedIds)) {
      recommendedIds = data.recommendedIds;
    } else {
      console.error('Cannot find recommendedIds array in API response');
      return [];
    }

    if (!Array.isArray(recommendedIds)) {
      console.error('recommendedIds is not an array:', recommendedIds);
      return [];
    }

    if (recommendedIds.length === 0) {
      console.warn('Recommended products list is empty');
      return [];
    }

    const products = await Promise.all(
      recommendedIds.map(id => getProduct(id).catch(() => null))
    );

    return products.filter(Boolean) as Product[];
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
};
