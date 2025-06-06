"use client"

import CartPage from "@/components/common/Cart";
import Header from "@/components/common/Header";
import Container from "@/components/common/Container";
import Footer from "@/components/common/Footer";
import { useState, useEffect } from "react";

export default function Cart() {
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        fetch("/data/cart.json")
            .then((res) => res.json())
            .then((data) => setProductList(data))
            .catch((error) => console.error("Ошибка загрузки данных:", error));
    }, []);

    return (
        <div className="flex flex-col mih-h-screen bg-gray-100">
            <Header />
            <Container>
                <main className="flex-grow">
                    <CartPage products={productList} />
                </main>
            </Container>
            <Footer />
        </div>
    );
}