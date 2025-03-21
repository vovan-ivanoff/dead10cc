"use client"

import React from "react";
import Container from "../components/Container";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

interface ProductListProps {
    products: Product[];
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice: number;
    image: string;
    author: string;
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <Container>
            <div className="w-full flex flex-col items-center px-[5%] sm:px-[7%] lg:px-[7%]">
                <div className="w-full max-w-screen-xl space-y-2 mb-4">
                    <div className="h-10 bg-gradient-to-r from-[#C800A1] via-[#981E97] to-[#470A68] rounded-xl flex items-center justify-center text-white font-medium text-sm">
                        <h3 className="mt-1">Реклама</h3>
                    </div>
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="h-28 custom-swiper rounded-xl"
                    >
                        <SwiperSlide>
                            <div className="h-28 bg-gradient-to-r from-[#C800A1] via-[#981E97] to-[#470A68] rounded-xl flex items-center justify-center text-white font-semibold sm:text-3xl md:text-4xl lg:text-6xl">
                                <h3 className="mt-1">Тут могла быть ваша реклама</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="h-28 bg-gradient-to-r from-[#C800A1] via-[#981E97] to-[#470A68] rounded-xl flex items-center justify-center text-white font-semibold sm:text-3xl md:text-4xl lg:text-6xl">
                                <h3 className="mt-1">И здесь</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="h-28 bg-gradient-to-r from-[#C800A1] via-[#981E97] to-[#470A68] rounded-xl flex items-center justify-center text-white font-semibold sm:text-3xl md:text-4xl lg:text-6xl">
                                <h3 className="mt-1">И даже тут!</h3>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className="w-full max-w-screen-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="p-4 rounded-lg hover:shadow-lg transition-all"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-[250px] object-contain rounded-md mb-4"
                            />
                            <div className="flex items-center">
                                <p className="text-xl font-semibold text-red-500 truncate">{product.price}₽</p>
                                <p className="ml-2 text-sm text-gray-500 line-through truncate">{product.oldPrice}₽</p>
                            </div>
                            <p className="text-sm text-red-500 mb-1 truncate">с WB Кошельком</p>
                            <div className="flex items-center mb-2">
                                <p className="text-sm text-black truncate">{product.author}</p>
                                <p className="text-sm text-gray-500 ml-1 truncate">/ {product.name}</p>
                            </div>
                            <button className="w-full p-2 bg-[#A232E8] text-white rounded-md hover:bg-[#5D1286] transition-colors ">
                                Добавить в корзину
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default ProductList;
