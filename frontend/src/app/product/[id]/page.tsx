"use client"

import Container from "@/components/common/Container";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import '@/styles/globals.css';
import ProductPage from "@/components/common/Product";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { findProductByArticle } from "@/api/admin/products";
import { Product } from "@/types/product";
import { checkAuth } from "@/api/auth";

interface LocalProduct {
    id: number;
    name: string;
    price: number;
    author: string;
    image: string;
    reviews?: number;
}

interface ApiProductResponse {
    id: number;
    article: number;
    title: string;
    price: number;
    tags: string[];
    seller: string;
    rating: number;
    reviews: number;
    description: string;
}

const transformLocalProduct = (item: LocalProduct): Product => ({
    id: item.id,
    title: item.name,
    price: item.price,
    seller: item.author,
    image: item.image,
    reviews: item.reviews || 0,
    rating: 5,
    article: item.id,
    description: "",
    tags: []
});

const transformApiProduct = (item: ApiProductResponse): Product => ({
    id: item.id,
    article: item.article,
    title: item.title,
    price: item.price,
    seller: item.seller,
    image: '/assets/images/pictures/no-image.svg', // дефолтное изображение
    reviews: item.reviews,
    rating: item.rating,
    description: item.description,
    tags: item.tags
});

export default function ProductDetail() {
    const params = useParams();
    const productId = params.id;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                // Проверяем авторизацию
                const user = await checkAuth();
                
                if (user) {
                    // Если пользователь авторизован, получаем данные с сервера
                    console.log('Fetching product with article:', productId);
                    // Извлекаем article из ID
                    const article = typeof productId === 'string' 
                        ? parseInt(productId.split('_')[1] || productId, 10)
                        : Number(productId);
                    console.log('Extracted article:', article);
                    const response = await findProductByArticle(article);
                    // Получаем первый элемент из массива, так как API возвращает массив
                    const productData = Array.isArray(response) ? response[0] : response;
                    if (productData) {
                        const transformedProduct = transformApiProduct(productData);
                        console.log('Received product data from API:', transformedProduct);
                        setProduct(transformedProduct);
                    } else {
                        setError("Товар не найден");
                    }
                } else {
                    // Если пользователь не авторизован, получаем данные из локального JSON
                    console.log('Fetching product with ID from local data:', productId);
                    const response = await fetch("/data/data.json");
                    const localProducts: LocalProduct[] = await response.json();
                    const localProduct = localProducts.find(p => p.id === Number(productId));
                    
                    if (localProduct) {
                        const transformedProduct = transformLocalProduct(localProduct);
                        console.log('Found local product:', transformedProduct);
                        setProduct(transformedProduct);
                    } else {
                        setError("Товар не найден");
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setError("Ошибка при загрузке товара");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return (
        <div className="flex flex-col mih-h-screen">
            <Header />
            <Container>
                <main className="flex-grow">
                    {loading ? (
                        <div className="text-center p-10">Загрузка...</div>
                    ) : error ? (
                        <div className="text-center p-10 text-red-500">{error}</div>
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