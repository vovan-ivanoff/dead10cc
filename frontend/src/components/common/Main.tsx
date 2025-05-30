import React, { useState } from "react";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { addToCart } from "@/api/cart";
import { trackUserAction } from "@/api/recomendations";
import { findProductByArticle } from "@/api/admin/products";

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
const placeholderImage = '/assets/images/pictures/default.jpg';

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [inCartProducts, setInCartProducts] = useState<Set<string>>(new Set());

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

  const getProductId = (id: number | string): string => {
    console.log('Original product ID:', id);
    if (typeof id === 'string') {
      // Извлекаем article из формата type_article_page_index
      const parts = id.split('_');
      if (parts.length >= 2 && parts[0] && ['content', 'base', 'collaborative', 'guest'].includes(parts[0])) {
        const articleId = parts[1];
        if (typeof articleId === 'string') {
          console.log('Extracted article ID:', articleId);
          return articleId;
        }
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

  const handleAddToCart = async (e: React.MouseEvent, product: ProductListProps['products'][0]) => {
    e.preventDefault();
    
    const productId = getProductId(product.id);
    
    if (inCartProducts.has(productId)) {
      window.location.href = '/cart';
      return;
    }

    try {
      let article: number;
      
      if (typeof product.id === 'string') {
        const parts = product.id.split('_');
        if (parts.length >= 2 && parts[0] === 'content' && parts[1]) {
          article = parseInt(parts[1]);
        } else {
          throw new Error('Invalid product ID format');
        }
      } else {
        article = product.id;
      }

      if (isNaN(article)) {
        throw new Error('Invalid article number');
      }

      setIsLoading(prev => ({ ...prev, [productId]: true }));

      // Ищем товар по артикулу
      const foundProducts = await findProductByArticle(article);
      
      if (foundProducts && foundProducts.length > 0) {
        const productToAdd = foundProducts[0];
        
        if (!productToAdd) {
          throw new Error('Product not found');
        }

        // Добавляем товар в корзину
        const success = await addToCart(Number(productToAdd.id));
        
        if (success) {
          // Отслеживаем действие пользователя
          await trackUserAction(Number(productToAdd.id), 'ADDED_TO_CART');
          setInCartProducts(prev => new Set(prev).add(productId));
        }
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <Container>
      <div className="w-full max-w-[1400px]">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products && products.length > 0 ? products.map((product) => {
            const productId = getProductId(product.id);
            const isInCart = inCartProducts.has(productId);
            
            return (
              <Link
                key={product.id}
                href={`/product/${productId}`}
                className="p-4 bg-white rounded-xl hover:shadow-lg transition-all"
                style={{ width: 'var(--card-width)' }}
              >
                <div className="w-[190px] h-[250px] mx-auto mb-4 bg-white rounded-[10px] flex items-center justify-center overflow-hidden relative">
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
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={isLoading[productId]}
                  className={`w-full py-2 text-white rounded-[10px] transition-all ${
                    isInCart 
                      ? 'bg-[linear-gradient(105deg,#6A11CB_0%,#2575FC_100%)] hover:brightness-110' 
                      : 'bg-[#1B2429] hover:bg-gradient-to-r from-[#6A11CB] to-[#2575FC]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading[productId] 
                    ? 'Добавление...' 
                    : isInCart 
                      ? 'В корзине' 
                      : 'Добавить в корзину'}
                </button>
              </Link>
            );
          }) : (
            <div className="col-span-full text-center py-10">Товары не найдены</div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProductList;
