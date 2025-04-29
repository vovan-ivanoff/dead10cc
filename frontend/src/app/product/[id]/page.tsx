"use client"

import Container from "@/components/common/Container";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import '@/styles/globals.css';
import ProductPage from "@/components/common/Product";

export default function Product() {
    return (
        <div className="flex flex-col mih-h-screen">
            <Header />
            <Container>
                <main className="flex-grow">
                    <ProductPage />
                </main>
            </Container>
            <Footer />
        </div>
    );
}