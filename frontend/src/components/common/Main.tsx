import React, { useState } from "react";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { addToCart } from "@/api/cart";
import { trackUserAction } from "@/api/recomendations";
import { AddToCartModal } from "@/components/ui/AddToCartModal";

interface ProductListProps {
  products: Array<{
    id: number | string;
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

// Заготовка для изображения-заглушки
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2QjZCNkIiPk5vIGltYWdlPC90ZXh0Pjwvc3ZnPg==';

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<{ id: number | string; name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

   const handleAddToCart = async (e: React.MouseEvent, productId: number | string, productName: string) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedProduct({ id: productId, name: productName });
    setIsModalOpen(true);
  };

  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set(prev).add(src));
  };

  const getSafeImageSrc = (preview?: string, image?: string) => {
    const imgSrc = preview || image;
    if (!imgSrc || failedImages.has(imgSrc)) {
      return placeholderImage;
    }
    return imgSrc;
  };

  const handleConfirmAddToCart = async () => {
    if (selectedProduct) {
      // Безопасное преобразование ID в число
      const numericId = typeof selectedProduct.id === 'string' 
        ? parseInt(selectedProduct.id.split('_')[1] || selectedProduct.id, 10) 
        : selectedProduct.id;
      
      const success = await addToCart(numericId);
      if (success) {
        await trackUserAction(numericId, 'ADDED_TO_CART');
      }
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const getProductId = (id: number | string): string => {
    console.log('Original product ID:', id);
    if (typeof id === 'string') {
      // Извлекаем article из формата content_article_page_index
      const parts = id.split('_');
      if (parts.length >= 2 && parts[0] === 'content' && parts[1]) {
        const result = parts[1];
        console.log('Extracted article ID:', result);
        return result;
      }
      console.log('Using original string ID:', id);
      return id;
    }
    console.log('Using numeric ID:', id.toString());
    return id.toString();
  };

  // Функция для безопасного получения строкового значения
  const getSafeString = (value?: string, defaultValue: string = ''): string => {
    return value || defaultValue;
  };

  return (
    <Container>
      <div className="w-full max-w-[1400px]">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products && products.length > 0 ? products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${getProductId(product.id)}`}
              className="p-4 bg-white rounded-xl hover:shadow-lg transition-all"
              style={{ width: 'var(--card-width)' }}
            >
              <div className="w-[190px] h-[250px] mx-auto mb-4 bg-gray-300 rounded-[10px] flex items-center justify-center overflow-hidden relative">
                <Image
                  src={getSafeImageSrc(product.preview, product.image)}
                  alt={getSafeString(product.title, product.name || 'Product')}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-[10px]"
                  unoptimized={process.env.NODE_ENV !== 'production'}
                  priority={false}
                  onError={() => handleImageError(product.preview || product.image || '')}
                />
              </div>

              <p className="text-xl font-bold text-black hover:bg-gradient-to-r from-[#6A11CB] to-[#2575FC] hover:bg-clip-text hover:text-transparent">
                {product.price}₽
              </p>

              <h3 className="text-[15px] font-Hauss truncate">
                <span className="font-book text-black">
                  {getSafeString(product.seller, product.author)}
                </span>
                {product.seller || product.author ? ' / ' : ''}
                <span className="text-gray-600">
                  {getSafeString(product.title, product.name)}
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
                onClick={(e) => handleAddToCart(e, product.id, getSafeString(product.title, product.name || 'Unknown Product'))}
                className="w-full py-2 bg-[#1B2429] text-white rounded-[10px] transition-all hover:bg-gradient-to-r from-[#6A11CB] to-[#2575FC]">
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
        productName={selectedProduct?.name || 'Unknown Product'}
      />
    </Container>
  );
};

export default ProductList;
