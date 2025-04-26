export interface ProductBase {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  author: string;
}

export interface Product extends ProductBase {
  image: string;
}

export interface ProductForm extends ProductBase {
  image: File | string;
}

export type ProductCreate = Omit<ProductForm, 'id'>;
export type ProductUpdate = Partial<ProductForm> & { id: number };
