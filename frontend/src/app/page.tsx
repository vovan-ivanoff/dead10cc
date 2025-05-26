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

interface DataJsonProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  author: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPageIndex, setNextPageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loadingRef = useRef(false);
  const authCheckedRef = useRef(false);

  const loadDataJsonProducts = useCallback(async () => {
    try {
      const response = await fetch('/data/data.json');
      const data: DataJsonProduct[] = await response.json();
      
      const formattedProducts = data.map(product => ({
        id: product.id,
        title: product.name,
        price: Number(product.price),
        seller: product.author,
        image: `/assets/images/pictures/${product.image.split('/').pop()}`,
        rating: 0,
        preview: product.description
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading data.json products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
        image: p.image || '/assets/images/pictures/no-image.svg',
        seller: p.seller || 'Не указан'
      }));

      setProducts(prev => 
        isInitialLoad ? newProducts : [...prev, ...newProducts]
      );

      if (!isInitialLoad) {
        setNextPageIndex(currentPageIndex + 1);
      } else {
        setNextPageIndex(1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [nextPageIndex]);

  useEffect(() => {
    if (authCheckedRef.current) return;
    
    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setIsAuthenticated(!!isAuth);
        if (isAuth) {
          loadProducts(true);
        } else {
          loadDataJsonProducts();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        loadDataJsonProducts();
      } finally {
        authCheckedRef.current = true;
      }
    };
    
    verifyAuth();
  }, [loadProducts, loadDataJsonProducts]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleScroll = () => {
      if (loadingRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        loadProducts(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadProducts, isAuthenticated]);

  return (
    <main>
      <Header />
      <Container>
        {loading ? (
          <div className="text-center py-4">Загрузка товаров...</div>
        ) : (
          <>
            <ProductList products={products} />
            {loadingRef.current && isAuthenticated && (
              <div className="text-center py-4">Загрузка...</div>
            )}
          </>
        )}
      </Container>
      <Footer />
    </main>
  );
}
