"use client"

import Container from "@/components/common/Container";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import '@/styles/globals.css';
import ProductPage from "@/components/common/Product";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct } from "@/api/products";
import { Product } from "@/types/product";

export default function ProductDetail() {
    const params = useParams();
    const productId = params.id;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProduct(Number(productId))
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка загрузки данных:", error);
                setLoading(false);
            });
    }, [productId]);

    return (
        <div className="flex flex-col mih-h-screen">
            <Header />
            <Container>
                <main className="flex-grow">
                    {loading ? (
                        <div className="text-center p-10">Загрузка...</div>
                    ) : product ? (
                        <ProductPage product={product} />
                    ) : (
                        <div className="text-center p-10">Товар не найден</div>
                    )}
                </main>
            </Container>
            <Footer />
        </div>
    );
}