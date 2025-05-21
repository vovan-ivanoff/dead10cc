import { Product } from '../types/product';

// Функция для получения списка продуктов
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("/data/data.json");
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      price: Math.round(Number(item.price)),
      oldPrice: Math.round(Number(item.price) * 1.2)
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Функция для получения конкретного продукта по ID
export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch("/data/data.json");
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    const product = data.find((p: any) => p.id.toString() === id.toString());
    
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    return {
      ...product,
      price: Math.round(Number(product.price)),
      oldPrice: Math.round(Number(product.price) * 1.2)
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}; 