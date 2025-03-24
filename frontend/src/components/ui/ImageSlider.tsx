"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const images = [
  "/icons/slide1.svg",
  "/icons/slide1.svg",
  "/icons/slide1.svg",
  "/icons/slide1.svg",
  "/icons/slide1.svg",
];

const ImageSlider: React.FC = () => {
  return (
    <div className="w-full max-w-screen-xl rounded-[15px] overflow-hidden">
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        modules={[Autoplay, Pagination]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[165px] rounded-[15px] overflow-hidden">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 4px;
          height: 4px;
          background-color: gray;
          opacity: 1;
          margin: 0 5px !important;
        }

        .swiper-pagination-bullet-active {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;