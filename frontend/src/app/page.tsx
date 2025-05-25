"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Container from "../components/common/Container";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductList from "../components/common/Main";
import { getRecommendedProducts } from "../api/recomendations";
import { checkAuth } from "../api/auth";
import "../styles/globals.css";

interface Product {
  id: number | string;
  title: string;
  price: number;
  seller: string;
  image: string;
  rating: number;
  reviews?: number;
  preview?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPageIndex, setNextPageIndex] = useState(0);
  const loadingRef = useRef(false);
  const authCheckedRef = useRef(false);

  const loadProducts = useCallback(async (isInitialLoad: boolean) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    if (isInitialLoad) setLoading(true);

    try {
      const currentPageIndex = isInitialLoad ? 0 : nextPageIndex;
      const response = await getRecommendedProducts(
        currentPageIndex,
        24,
        isInitialLoad
      );

      const newProducts = response.content.map((p, i) => ({ 
        ...p, 
        id: `content_${p.article}_${currentPageIndex}_${i}`,
        image: p.image || '', // Заглушка для изображения
        seller: p.seller || 'Не указан' // Заглушка для продавца
      }));

      setProducts(prev => 
        isInitialLoad ? newProducts : [...prev, ...newProducts]
      );

      // Увеличиваем индекс СРАЗУ после успешной загрузки
      if (!isInitialLoad) {
        setNextPageIndex(currentPageIndex + 1);
      } else {
        setNextPageIndex(1); // После первой загрузки следующая страница - 1
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [nextPageIndex]);

  // Первая загрузка и проверка авторизации
  useEffect(() => {
    if (authCheckedRef.current) return;
    
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        authCheckedRef.current = true;
        loadProducts(true);
      }
    };
    
    verifyAuth();
  }, [loadProducts]);

  // Подгрузка при скролле
  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        loadProducts(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadProducts]);

  return (
    <main>
      <Header />
      <Container>
        {loading ? (
          <div className="text-center py-4">Загрузка товаров...</div>
        ) : (
          <>
            <ProductList products={products} />
            {loadingRef.current && (
              <div className="text-center py-4">Загрузка...</div>
            )}
          </>
        )}
      </Container>
      <Footer />
    </main>
  );
}
