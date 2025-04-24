"use client";

import React from "react";
import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
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
          <div className="h-10 bg-gradient-to-r from-[#4F46E5] via-[#8A3FFC] to-[#EC4899] rounded-xl flex items-center justify-center text-white font-medium text-sm">
            <h3 className="mt-1">Реклама</h3>
          </div>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView="auto"
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="h-36 custom-swiper rounded-xl px-[5%] sm:px-[7%] lg:px-[7%] max-w-screen-xl mx-auto"
        >
          <SwiperSlide>
            <div className="h-36 bg-gradient-to-r from-[#4F46E5] via-[#8A3FFC] to-[#EC4899] rounded-2xl flex items-center justify-center text-white font-semibold sm:text-4xl md:text-4xl lg:text-6xl">
              <h3 className="mt-1">Тут могла быть ваша реклама</h3>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-36 bg-gradient-to-r from-[#4F46E5] via-[#8A3FFC] to-[#EC4899] rounded-2xl flex items-center justify-center text-white font-semibold sm:text-4xl md:text-4xl lg:text-6xl">
              <h3 className="mt-1">И здесь</h3>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-36 bg-gradient-to-r from-[#4F46E5] via-[#8A3FFC] to-[#EC4899] rounded-2xl flex items-center justify-center text-white font-semibold sm:text-4xl md:text-4xl lg:text-6xl">
              <h3 className="mt-1">И даже тут!</h3>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="w-full max-w-screen-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="block">
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
                <button className="w-full p-2 bg-[#A232E8] hover:bg-[#AF4DFD] text-white rounded-xl border-radius-[15px] transition-all duration-300 ease-in-out">
                  Добавить в корзину
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ProductList;
