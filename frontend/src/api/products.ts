const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface SearchProduct {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  rating: number;
  reviews?: number;
  description?: string;
}

export const searchProducts = async (query: string): Promise<SearchProduct[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/find/${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}; 