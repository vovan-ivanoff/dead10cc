"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "../components/common/Container";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductList from "../components/common/Main";
import { getRecommendedProducts, getAllProducts } from "../api/recomendations";
import "../styles/globals.css";

interface Product {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  rating: number;
  reviews?: number;
  preview?: string;
}

export default function Home() {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const productsPerPage = 20;

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [recommended, all] = await Promise.all([
        getRecommendedProducts(10),
        getAllProducts()
      ]);
      setRecommendedProducts(recommended);
      setAllProducts(all.slice(0, displayCount));
      setHasMore(all.length > displayCount);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [displayCount]);

  const loadMoreProducts = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      const newCount = displayCount + productsPerPage;
      setDisplayCount(newCount);
      setAllProducts(prevProducts => {
        const allProducts = [...prevProducts];
        return allProducts.slice(0, newCount);
      });
      setHasMore(allProducts.length > newCount);
      setIsLoadingMore(false);
    }, 300);
  }, [displayCount, allProducts, hasMore, isLoadingMore]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, loadMoreProducts]);

  return (
    <main>
      <Header />
      <Container>
        {loading ? (
          <div className="text-center py-4">Загрузка товаров...</div>
        ) : (
          <>
            {recommendedProducts.length > 0 && (
              <div className="mb-8">
                <ProductList products={recommendedProducts} />
              </div>
            )}
            <div>
              <ProductList products={allProducts} />
            </div>
            {isLoadingMore && (
              <div className="text-center py-4">Загрузка следующих товаров...</div>
            )}
          </>
        )}
      </Container>
      <Footer />
    </main>
  );
}
