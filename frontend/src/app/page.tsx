"use client"

import { useState, useEffect } from "react";
import Container from "../components/common/Container";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductList from "../components/common/Main";
import { getProducts } from "../api/products";
import '../styles/globals.css';

export default function Home() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching products...");
    setLoading(true);
    getProducts()
      .then((data) => {
        console.log("Products received:", data);
        setProductList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col mih-h-screen">
      <Header />
      <Container>
        <main className="flex-grow">
          {loading ? (
            <div className="text-center p-10">Загрузка...</div>
          ) : error ? (
            <div className="text-center p-10 text-red-500">Ошибка: {error}</div>
          ) : (
            <ProductList products={productList} />
          )}
        </main>
      </Container>
      <Footer />
    </div>
  );
}
