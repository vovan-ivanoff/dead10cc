"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/FavoriteInput";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice: number;
    image: string;
    author: string;
    dateAdded: string;
    popularity: number;
}

interface ProductListProps {
    products: Product[];
}

const sortOptions = [
    { value: "date-asc", label: "По дате ↑" },
    { value: "date-desc", label: "По дате ↓" },
    { value: "price-asc", label: "По цене ↑" },
    { value: "price-desc", label: "По цене ↓" },
    { value: "popularity-asc", label: "По популярности ↑" },
    { value: "popularity-desc", label: "По популярности ↓" },
];

const FavoritesPage: React.FC<ProductListProps> = ({ products }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState<string>("price-asc");
    const [activeTab, setActiveTab] = useState<"favorites" | "brands">("favorites");

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesStock = !inStockOnly || product.price > 0;
            return matchesSearch && matchesStock;
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "date-asc":
                    return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
                case "date-desc":
                    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
                case "popularity-asc":
                    return a.popularity - b.popularity;
                case "popularity-desc":
                    return b.popularity - a.popularity;
                default:
                    return 0;
            }
        });

    return (
        <Container>
            <div className="w-full flex flex-col px-[5%] sm:px-[7%] lg:px-[7%] py-6">
                {/* Верхний блок */}
                <div className="flex flex-col justify-between mb-6 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setActiveTab("favorites")}
                                className={`text-2xl font-bold transition-colors duration-200 ${activeTab === "favorites" ? "text-black" : "text-gray-400"
                                    }`}
                            >
                                Избранное
                            </button>
                            <button
                                onClick={() => setActiveTab("brands")}
                                className={`text-2xl font-bold transition-colors duration-200 ${activeTab === "brands" ? "text-black" : "text-gray-400"
                                    }`}
                            >
                                Любимые бренды
                            </button>
                        </div>

                        {activeTab === "favorites" && (
                            <div className="flex items-center gap-4 mt-2 flex-nowrap w-full justify-between">
                                <div className="w-80">
                                    <Select onValueChange={(value) => setSortOrder(value)} value={sortOrder}>
                                        <SelectTrigger className="w-full border border-gray-300 hover:border-gray-500 focus:border-gray-700 transition-colors duration-200 rounded-xl text-sm py-1 flex items-center pt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white shadow-md animate-fade-in rounded-xl">
                                            {sortOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex w-40 flex-nowrap">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={inStockOnly}
                                            onChange={() => setInStockOnly(!inStockOnly)}
                                            className="w-4 h-4 text-purple-600 accent-purple-600"
                                        />
                                        <span className="whitespace-nowrap flex items-center pt-1.5">Снова в наличии</span>
                                    </label>
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Поиск по названию..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-gray-100 w-72 px-4 py-2 border border-gray-300 rounded-xl text-sm ml-auto pt-2.5"
                                />
                            </div>
                        )}
                    </div>
                </div>


                {/* Контент */}
                {activeTab === "brands" ? (
                    <div className="w-full py-20 text-xl text-gray-500 flex flex-col items-center text-center">
                        <Image
                            src="/icons/badge.webp"
                            alt="brands"
                            width={80}
                            height={80}
                            className="object-contain rounded-md mb-4"
                        />
                        <h3 className="font-medium text-black">Любимых брендов пока нет</h3>
                        <h3 className="text-lg">Добавляйте их сюда, чтобы не пропускать новинки и акции</h3>
                        <Link href="/">
                            <button className="mt-4 text-lg w-40 h-10 w-[250px] p-2 bg-[#A232E8] hover:bg-[#AF4DFD] text-white rounded-xl transition-all duration-300 ease-in-out">
                                Вернуться на главную
                            </button>
                        </Link>
                    </div>

                ) : (
                    <div className="w-full max-w-screen-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="p-4 rounded-xl hover:shadow-lg transition-all"
                            >
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={250}
                                    height={250}
                                    className="w-full h-[250px] object-contain rounded-md mb-4"
                                />
                                <div className="flex items-center">
                                    <p className="text-xl font-semibold text-red-500 truncate">
                                        {product.price}₽
                                    </p>
                                    <p className="ml-2 text-sm text-gray-500 line-through truncate">
                                        {product.oldPrice}₽
                                    </p>
                                </div>
                                <p className="text-sm text-red-500 mb-1 truncate">
                                    с WB Кошельком
                                </p>
                                <div className="flex items-center mb-2">
                                    <p className="text-sm text-black truncate">{product.author}</p>
                                    <p className="text-sm text-gray-500 ml-1 truncate">
                                        / {product.name}
                                    </p>
                                </div>
                                <button className="w-full p-2 bg-[#A232E8] hover:bg-[#AF4DFD] text-white rounded-xl transition-all duration-300 ease-in-out">
                                    Добавить в корзину
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default FavoritesPage;
