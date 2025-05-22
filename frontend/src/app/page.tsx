"use client";

import { useState, useEffect } from "react";
import Container from "../components/common/Container";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductList from "../components/common/Main";
import { checkAuth } from "../api/auth";
import { getRecommendedProducts } from "../api/recomendations";
import "../styles/globals.css";

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
  rating: number; // теперь строго number
  reviews?: number;
  preview?: string;
}

export default function Home() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  type ApiProduct = Omit<Product, "rating"> & { rating?: number };

  const transformLocalProduct = (item: LocalProduct): Product => ({
    id: item.id,
    title: item.name,
    price: item.price,
    seller: item.author,
    image: item.image,
    reviews: item.reviews,
    rating: item.reviews ?? 0,
  });

  useEffect(() => {
    const loadProducts = async () => {
      const normalizeApiProduct = (item: ApiProduct): Product => ({
        id: item.id,
        title: item.title ?? "Без названия",
        price: item.price,
        seller: item.seller ?? "Неизвестно",
        image: item.image,
        preview: item.preview,
        reviews: item.reviews,
        rating: item.rating ?? 0,
      });

      try {
        const user = await checkAuth();
        if (user) {
          const recommended: ApiProduct[] = await getRecommendedProducts();
          const formattedProducts = recommended.map(normalizeApiProduct);
          setProductList(formattedProducts);
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
