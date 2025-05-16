import React from "react";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { Product } from "../../types/product";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <Container>
      <div className="w-full max-w-[1400px]">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {products && products.length > 0 ? products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="p-4 bg-white rounded-xl hover:shadow-lg transition-all"
              style={{ width: 'var(--card-width)' }}
            >
              <div className="w-[190px] h-[250px] mx-auto mb-4 bg-gray-300 rounded-[10px] flex items-center justify-center overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={190}
                  height={250}
                  className="object-contain rounded-[10px]"
                />
              </div>

              <p className="text-xl font-bold text-black hover:bg-[linear-gradient(105deg,#6A11CB_0%,#2575FC_100%)] hover:bg-clip-text hover:text-transparent">
                {product.price}₽
              </p>

              <h3 className="text-[15px] font-Hauss truncate">
                <span className="font-book text-black">{product.author}</span>
                <span className="text-gray-600"> / {product.name}</span>
              </h3>

              <div className="flex items-center mb-2">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-500">
                  (100)
                </span>
              </div>
              <button className="w-full py-2 bg-[#1B2429] text-white rounded-[10px] transition-all 
                  hover:bg-[linear-gradient(105deg,#6A11CB_0%,#2575FC_100%)]">
                Добавить в корзину
              </button>
            </Link>
          )) : (
            <div className="col-span-full text-center py-10">Товары не найдены</div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProductList;
