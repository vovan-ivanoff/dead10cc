import { apiClient } from './client';
import type { Product, ApiResponse } from './types';

export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get('/products');
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id'>) => {
  const response = await apiClient.post('/products', product);
  return response.data;
};