"use client"

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Container from "../../../components/common/Container";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import '../../../styles/globals.css';
import ProductPage from "@/components/common/Product";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice: number;
    image: string;
    author: string;
}

export default function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/data/data.json")
            .then((res) => res.json())
            .then((data: Product[]) => {
                const found = data.find((p) => p.id === Number(id));
                setProduct(found || null);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка загрузки товара:", error);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="flex flex-col mih-h-screen">
            <Header />
            <Container>
                <main className="flex-grow">
                    <ProductPage product={product} />
                </main>
            </Container>
            <Footer />
        </div>
    );
}