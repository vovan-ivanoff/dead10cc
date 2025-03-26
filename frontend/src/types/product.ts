export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice: number;
    image: string | File;
    author: string;
  }
  
  export type ProductCreate = Omit<Product, 'id'>;
  export type ProductUpdate = Partial<Product> & { id: number };