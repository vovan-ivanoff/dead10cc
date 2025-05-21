"use client"

import { useState, useEffect } from "react";
import Container from "../components/common/Container";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductList from "../components/common/Main";
import { checkAuth } from "../api/auth";
import { getProductPage } from "../api/admin/products";
import '../styles/globals.css';

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  rating?: number;
  description?: string;
  preview?: string;
}

interface LocalProduct {
  id: number;
  name: string;
  price: number;
  author: string;
  image: string;
  reviews?: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  rating?: number;
  reviews?: number;
  preview?: string;
}

export default function Home() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const transformLocalProduct = (item: LocalProduct): Product => ({
    id: item.id,
    title: item.name,
    price: item.price,
    seller: item.author,
    image: item.image,
    reviews: item.reviews,
    rating: item.reviews
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const user = await checkAuth();
        if (user) {
          const apiProducts: ApiProduct[] = await getProductPage();
          setProductList(apiProducts);
        } else {
          const response = await fetch("/data/data.json");
          const localProducts: LocalProduct[] = await response.json();
          const formattedProducts = localProducts.map(transformLocalProduct);
          setProductList(formattedProducts);
        }
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
        const response = await fetch("/data/data.json");
        const localProducts: LocalProduct[] = await response.json();
        const formattedProducts = localProducts.map(transformLocalProduct);
        setProductList(formattedProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <Container>
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">Загрузка...</div>
          </main>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Container>
        <main className="flex-grow">
          <ProductList products={productList} />
        </main>
      </Container>
      <Footer />
    </div>
  );
}