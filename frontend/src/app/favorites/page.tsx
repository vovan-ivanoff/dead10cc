"use client"

import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../globals.css';
import FavoritesPage from "@/components/Favorites";

export default function Home() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setProductList(data))
      .catch((error) => console.error("Ошибка загрузки данных:", error));
  }, []);

  return (
    <div className="flex flex-col mih-h-screen">
      <Header />
      <Container>
        <main className="flex-grow">
          <FavoritesPage products={productList} />
        </main>
      </Container>
      <Footer />
    </div>
  );
}
