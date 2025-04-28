"use client"

import { useParams } from "next/navigation";
import Container from "../../../components/Container";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import '../../globals.css';
import ProductPage from "@/components/Product";

export default function Product() {
    const { id } = useParams();

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