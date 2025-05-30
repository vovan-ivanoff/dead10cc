const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const getCart = async (): Promise<{ products: Record<string, number> }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/carts`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { products: {} };
  }
};

export const addToCart = async (productId: number, count: number = 1): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/carts/${productId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

export const deleteFromCart = async (productId: number, count: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/carts/${productId}/${count}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting from cart:', error);
    return false;
  }
};

export const clearCart = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/carts`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};