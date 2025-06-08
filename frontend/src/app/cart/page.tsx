"use client"

import CartPage from "@/components/common/Cart";
import Header from "@/components/common/Header";
import Container from "@/components/common/Container";
import Footer from "@/components/common/Footer";
import { useState, useEffect } from "react";
import { getCart } from "@/api/cart";
import { getProduct } from "@/api/admin/products";

interface Product {
    id: number;
    article: number;
    title: string;
    description: string;
    price: number;
    image: string;
    seller: string;
    rating: number;
    reviews: number;
    tags: string[];
    preview?: string;
    quantity: number;
}

export default function Cart() {
    const [productList, setProductList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartData = await getCart();
                const products = await Promise.all(
                    Object.entries(cartData.products).map(async ([productId, count]) => {
                        const product = await getProduct(parseInt(productId));
                        return {
                            ...product,
                            quantity: count
                        };
                    })
                );
                setProductList(products);
            } catch (error) {
                console.error("Ошибка загрузки корзины:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    return (
        <div className="flex flex-col mih-h-screen bg-gray-100">
            <Header />
            <Container>
                <main className="flex-grow">
                    {loading ? (
                        <div className="text-center py-4">Загрузка корзины...</div>
                    ) : (
                        <CartPage products={productList} />
                    )}
                </main>
            </Container>
            <Footer />
        </div>
    );
}