import React, { useState } from "react";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { addToCart } from "@/api/cart";
import { trackUserAction } from "@/api/recomendations";
import { AddToCartModal } from "@/components/ui/AddToCartModal";

interface ProductListProps {
  products: Array<{
    id: number;
    name?: string;
    title?: string;
    price: number;
    author?: string;
    seller?: string;
    image: string;
    preview?: string;
    reviews?: number;
    rating: number;
  }>;
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedProduct({ id: productId, name: productName });
    setIsModalOpen(true);
  };

  const handleConfirmAddToCart = async () => {
    if (selectedProduct) {
      const success = await addToCart(selectedProduct.id);
      if (success) {
        await trackUserAction(selectedProduct.id, 'ADDED_TO_CART');
      }
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Container>
      <div className="w-full max-w-[1400px]">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products && products.length > 0 ? products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="p-4 bg-white rounded-xl hover:shadow-lg transition-all"
              style={{ width: 'var(--card-width)' }}
            >
              <div className="w-[190px] h-[250px] mx-auto mb-4 bg-gray-300 rounded-[10px] flex items-center justify-center overflow-hidden relative">
                <Image
                  src={product.preview || product.image}
                  alt={product.title || product.name || 'Product'}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-[10px]"
                  unoptimized={process.env.NODE_ENV !== 'production'}
                  priority={false}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/images/fallback-product.png';
                  }}
                />
              </div>

              <p className="text-xl font-bold text-black hover:bg-[linear-gradient(105deg,#6A11CB_0%,#2575FC_100%)] hover:bg-clip-text hover:text-transparent">
                {product.price}₽
              </p>

              <h3 className="text-[15px] font-Hauss truncate">
                <span className="font-book text-black">
                  {product.seller || product.author}
                </span>
                <span className="text-gray-600">
                  {' / '}
                  {product.title || product.name}
                </span>
              </h3>

              <div className="flex items-center mb-2">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < Math.round(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-500">
                  ({product.reviews || 0})
                </span>
              </div>
              <button 
                onClick={(e) => handleAddToCart(e, product.id, product.title || product.name || '')}
                className="w-full py-2 bg-[#1B2429] text-white rounded-[10px] transition-all 
                    hover:bg-[linear-gradient(105deg,#6A11CB_0%,#2575FC_100%)]">
                Добавить в корзину
              </button>
            </Link>
          )) : (
            <div className="col-span-full text-center py-10">Товары не найдены</div>
          )}
        </div>
      </div>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAddToCart}
        productName={selectedProduct?.name || ''}
      />
    </Container>
  );
};

export default ProductList;
