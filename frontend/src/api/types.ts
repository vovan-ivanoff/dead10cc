export type Product = {
    id: string;
    name: string;
    price: number;
  };
  
  export type ApiResponse<T> = {
    data: T;
    error?: string;
  };