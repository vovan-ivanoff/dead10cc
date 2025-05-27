"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Container from "../components/common/Container";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductList from "../components/common/Main";
import { getRecommendedProducts } from "../api/recomendations";
import { checkAuth } from "../api/auth";
import { getProductPage } from "../api/admin/products"; // Импортируем функцию получения страницы товаров
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

interface RawProduct {
  article: number;
  title: string;
  price: number;
  seller?: string;
  image?: string;
  rating: number;
  reviews?: number;
  description?: string;
}

type RecommendationBlock = RawProduct[] | { paging: string };

interface RecommendationResponse {
  content: RecommendationBlock;
  collaborative: RecommendationBlock;
  base?: RawProduct[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPageIndex, setNextPageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loadingRef = useRef(false);
  const authCheckedRef = useRef(false);
  const baseOffsetRef = useRef(0);

  const isProductArray = (data: RecommendationBlock): data is RawProduct[] => {
    return Array.isArray(data);
  };

  // Загрузка продуктов для неавторизованного пользователя через getProductPage
  const loadProductsForGuest = useCallback(
    async (isInitialLoad: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (isInitialLoad) setLoading(true);

      try {
        const currentPageIndex = isInitialLoad ? 0 : nextPageIndex;
        const pageSize = 24;

        // Передаём только pageIndex и pageSize
        const apiProducts = await getProductPage(currentPageIndex, pageSize);

        const newProducts: Product[] = apiProducts.map((p, i) => ({
          id: `guest_${p.id}_${currentPageIndex}_${i}`,
          title: p.title,
          price: p.price,
          seller: p.seller || "Не указан",
          image: p.image || "/assets/images/pictures/no-image.svg",
          rating: p.rating,
          reviews: p.reviews,
          preview: p.preview || p.description,
        }));

        setProducts((prev) => (isInitialLoad ? newProducts : [...prev, ...newProducts]));
        setNextPageIndex(currentPageIndex + 1);
      } catch (error) {
        console.error("Error loading guest products:", error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [nextPageIndex]
  );

  // Загрузка продуктов для авторизованного пользователя (оставляем без изменений)
  const loadProducts = useCallback(
    async (isInitialLoad: boolean) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      if (isInitialLoad) setLoading(true);

      try {
        const currentPageIndex = isInitialLoad ? 0 : nextPageIndex;
        const response: RecommendationResponse = await getRecommendedProducts(
          currentPageIndex,
          24,
          isInitialLoad
        );

        let contentItems: RawProduct[] = [];
        let collaborativeItems: RawProduct[] = [];

        if (isProductArray(response.content)) {
          contentItems = response.content;
        }
        if (isProductArray(response.collaborative)) {
          collaborativeItems = response.collaborative;
        }

        const contentEnded = contentItems.length === 0;
        const collaborativeEnded = collaborativeItems.length === 0;

        const newProducts: Product[] = [...contentItems, ...collaborativeItems].map(
          (p: RawProduct, i: number) => ({
            id: `${isProductArray(response.content) ? "content" : "collab"}_${p.article}_${currentPageIndex}_${i}`,
            title: p.title,
            price: p.price,
            seller: p.seller || "Не указан",
            image: p.image || "/assets/images/pictures/no-image.svg",
            rating: p.rating,
            reviews: p.reviews,
            preview: p.description,
          })
        );

        if (contentEnded && collaborativeEnded && Array.isArray(response.base)) {
          const baseProducts: Product[] = response.base.map((p: RawProduct, i: number) => ({
            id: `base_${p.article}_${baseOffsetRef.current + i}`,
            title: p.title,
            price: p.price,
            seller: p.seller || "Не указан",
            image: p.image || "/assets/images/pictures/no-image.svg",
            rating: p.rating,
            reviews: p.reviews,
            preview: p.description,
          }));

          baseOffsetRef.current += response.base.length;
          newProducts.push(...baseProducts);
        }

        setProducts((prev) => (isInitialLoad ? newProducts : [...prev, ...newProducts]));
        setNextPageIndex(currentPageIndex + 1);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [nextPageIndex]
  );

  useEffect(() => {
    if (authCheckedRef.current) return;

    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setIsAuthenticated(!!isAuth);

        if (isAuth) {
          loadProducts(true);
        } else {
          loadProductsForGuest(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        loadProductsForGuest(true);
      } finally {
        authCheckedRef.current = true;
      }
    };

    verifyAuth();
  }, [loadProducts, loadProductsForGuest]);

  useEffect(() => {
    if (!isAuthenticated) {
      const handleScroll = () => {
        if (loadingRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 500) {
          loadProductsForGuest(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loadProductsForGuest, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const handleScroll = () => {
        if (loadingRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 500) {
          loadProducts(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
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
            {loadingRef.current && <div className="text-center py-4">Загрузка...</div>}
          </>
        )}
      </Container>
      <Footer />
    </main>
  );
}
