"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "../components/common/Container";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductList from "../components/common/Main";
import { getRecommendedProducts } from "../api/recomendations";
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
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 24;

  const loadProducts = useCallback(async (isInitialLoad: boolean = false) => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      console.log('Loading page:', pageIndex);
      const { content, collaborative } = await getRecommendedProducts(pageIndex, pageSize);
      
      // Генерируем уникальные ID для контентных товаров
      const contentWithIds = content.map((product, index) => ({
        ...product,
        id: `content_${product.id}_${pageIndex}_${index}`
      }));
      
      // Генерируем уникальные ID для коллаборативных товаров
      const collaborativeWithIds = collaborative.map((product, index) => ({
        ...product,
        id: `collab_${product.id}_${pageIndex}_${index}`
      }));

      const newProducts = [...contentWithIds, ...collaborativeWithIds];
      console.log('New products count:', newProducts.length);
      
      setProducts(prev => {
        const updatedProducts = [...prev, ...newProducts];
        console.log('Total products after update:', updatedProducts.length);
        return updatedProducts;
      });

      // Проверяем, есть ли еще товары для загрузки
      const hasMoreProducts = content.length > 0 || collaborative.length > 0;
      console.log('Has more products:', hasMoreProducts);
      setHasMore(hasMoreProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
      setLoading(false);
    }
  }, [pageIndex, isLoadingMore]);

  const loadMoreProducts = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    console.log('Loading more products, current pageIndex:', pageIndex);
    setPageIndex(prev => prev + 1);
  }, [hasMore, isLoadingMore, pageIndex]);

  // Начальная загрузка
  useEffect(() => {
    loadProducts(true);
  }, []);

  // Загрузка при изменении pageIndex
  useEffect(() => {
    if (pageIndex > 0) {
      loadProducts(false);
    }
  }, [pageIndex, loadProducts]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollPosition = scrollTop + clientHeight;
      const scrollThreshold = scrollHeight - 500;

      if (scrollPosition >= scrollThreshold) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log('Scroll threshold reached, triggering load more');
          loadMoreProducts();
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isLoadingMore, hasMore, loadMoreProducts]);

  return (
    <main>
      <Header />
      <Container>
        {loading ? (
          <div className="text-center py-4">Загрузка товаров...</div>
        ) : (
          <ProductList products={products} />
        )}
      </Container>
      <Footer />
    </main>
  );
}
