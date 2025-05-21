export interface ProductBase {
  id: number;
  article: number;
  title: string;
  description: string;
  price: number;
  seller: string;
  rating: number;
  reviews: number;
  tags: string[];
}

export interface Product extends ProductBase {
  image: string;
}

export interface ProductForm extends Omit<ProductBase, 'id'> {
  image: File | string;
}

export type ProductCreate = Omit<ProductForm, 'article' | 'rating' | 'reviews' | 'id'>;

export type ProductUpdate = Partial<ProductForm> & { id: number };
