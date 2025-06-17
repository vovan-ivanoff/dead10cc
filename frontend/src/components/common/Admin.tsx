"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Product, ProductCreate, ProductUpdate } from "@/types/product";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/api/admin/products";
import { Plus, Minus, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/AdminButton";
import { Input } from "@/components/ui/AdminInput";
import { Card } from "@/components/ui/CardFull";
import Image from 'next/image';
import { checkAuth } from '@/api/auth';
import { useRouter } from 'next/navigation';

type FormDataType = Omit<ProductCreate, 'image'> & {
  image: File | string | null;
  article: number;
  rating: number;
  reviews: number;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    price: 0,
    seller: '',
    description: '',
    tags: [],
    image: null,
    article: 0,
    rating: 0,
    reviews: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProducts, setShowProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  const productsPerPage = 20;

  const loadAllProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setAllProducts(data);
      setDisplayedProducts(data.slice(0, displayCount));
      setHasMore(data.length > displayCount);
    } catch (err) {
      setError('Ошибка загрузки товаров');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [displayCount]);

  const loadMoreProducts = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      const newCount = displayCount + productsPerPage;
      setDisplayCount(newCount);
      setDisplayedProducts(allProducts.slice(0, newCount));
      setHasMore(newCount < allProducts.length);
      setIsLoadingMore(false);
    }, 300);
  }, [displayCount, allProducts, hasMore, isLoadingMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, loadMoreProducts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      async function checkAuthorization() {
        try {
          const user = await checkAuth();
          if (user) {
            setIsAuthorized(true);
            await loadAllProducts();
          } else {
            setIsAuthorized(false);
            router.push('/');
          }
        } catch (error) {
          console.error('Authorization check failed:', error);
          setIsAuthorized(false);
          router.push('/');
        }
      }
      checkAuthorization();
    }
  }, [loadAllProducts, router]);

  useEffect(() => {
    if (searchId) {
      setDisplayedProducts(
        allProducts
          .filter(p => p.id.toString().includes(searchId))
          .slice(0, displayCount)
      );
    } else {
      setDisplayedProducts(allProducts.slice(0, displayCount));
    }
  }, [allProducts, displayCount, searchId]);

  if (isAuthorized === false) {
    return (
      <div className="p-6">
        <h1 className="text-5xl font-extrabold text-center mb-6">Доступ запрещен</h1>
        <p className="text-center text-xl">Пожалуйста, авторизуйтесь для доступа к этой странице</p>
      </div>
    );
  }

  if (isAuthorized === null) {
    return (
      <div className="p-6">
        <div className="text-center">Проверка авторизации...</div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'image') {
      const file = files?.[0] ?? null;
      if (file && !file.type.startsWith('image/')) {
        setError('Пожалуйста, загрузите изображение');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
    } else if (name === 'tags') {
      setFormData(prev => ({ ...prev, tags: value.split(',').map(t => t.trim()) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await checkAuth();
    if (!user) {
      setError('Сессия истекла. Пожалуйста, войдите снова');
      setIsAuthorized(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (editId !== null) {
        const currentProduct = displayedProducts.find(p => p.id === editId);
        if (!currentProduct) {
          throw new Error('Товар не найден');
        }

        const updatedData: ProductUpdate = {
          id: editId,
          article: currentProduct.article,
          title: currentProduct.title,
          price: Number(formData.price),
          tags: currentProduct.tags,
          seller: currentProduct.seller,
          rating: currentProduct.rating,
          reviews: currentProduct.reviews,
          description: currentProduct.description,
        };

        console.log('Измененные данные:', updatedData);
        const updated = await updateProduct(editId, updatedData);
        
        setProducts(prevProducts => {
          const index = prevProducts.findIndex(p => p.id === editId);
          if (index === -1) {
            return [...prevProducts, updated];
          }
          const newProducts = [...prevProducts];
          newProducts[index] = updated;
          return newProducts;
        });

        setDisplayedProducts(prevProducts => {
          const index = prevProducts.findIndex(p => p.id === editId);
          if (index === -1) {
            return [...prevProducts, updated];
          }
          const newProducts = [...prevProducts];
          newProducts[index] = updated;
          return newProducts;
        });
        
        setEditId(null);
      } else {
        const created = await createProduct(formData as ProductCreate);
        setProducts(prevProducts => [...prevProducts, created]);
        setDisplayedProducts(prevProducts => [...prevProducts, created]);
      }
      setFormData({
        title: '',
        price: 0,
        seller: '',
        description: '',
        tags: [],
        image: null,
        article: 0,
        rating: 0,
        reviews: 0,
      });
      setShowAddForm(false);
    } catch (err) {
      setError(editId ? 'Ошибка обновления товара' : 'Ошибка создания товара');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditId(product.id);
    setFormData({
      title: product.title,
      price: product.price,
      seller: product.seller,
      description: product.description,
      tags: product.tags ?? [],
      image: product.image,
      article: product.article,
      rating: product.rating,
      reviews: product.reviews,
    });
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить товар?')) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch {
      setError('Ошибка удаления товара');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-5xl font-extrabold text-center mb-6">Админ-панель</h1>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {isLoading && <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">Загрузка...</div>}

      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold">{editId ? 'Редактировать товар' : 'Добавить товар'}</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} disabled={isLoading} className="ml-4 bg-white text-black hover:text-[#5D1286]">
          {showAddForm ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showAddForm ? 1 : 0, height: showAddForm ? 'auto' : 0 }}
        className="overflow-hidden mb-6"
      >
        <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
          <Input name="title" placeholder="Название" value={formData.title} onChange={handleInputChange} required />
          <Input name="price" type="number" placeholder="Цена" value={formData.price} onChange={handleInputChange} required />
          <Input name="seller" placeholder="Продавец" value={formData.seller} onChange={handleInputChange} required />
          <Input name="description" placeholder="Описание" value={formData.description} onChange={handleInputChange} required />
          <Input
            name="article"
            placeholder="Артикул"
            value={formData.article}
            onChange={handleInputChange}
            required
          />
          <Input name="tags" placeholder="Теги (через запятую)" value={formData.tags.join(', ')} onChange={handleInputChange} />
          <Input 
            name="image" 
            type="file" 
            onChange={handleInputChange} 
            required={!editId}
            accept="image/*"
          />
          {editId && formData.image && typeof formData.image === 'string' && (
            <div className="mb-2">
              <p className="text-sm text-gray-500">Текущее изображение:</p>
              <Image 
                src={formData.image} 
                alt="Current product" 
                width={100} 
                height={100} 
                className="border rounded"
              />
            </div>
          )}
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
            {editId ? 'Сохранить изменения' : 'Добавить товар'}
          </Button>
        </form>
      </motion.div>

      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold">Список товаров</h2>
        <Button onClick={() => setShowProducts(!showProducts)} className="ml-4 bg-white text-black hover:text-[#5D1286]">
          {showProducts ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showProducts ? 1 : 0, height: showProducts ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <Input
          placeholder="Поиск по ID"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          className="mb-4"
        />
        {displayedProducts.map(product => (
          <Card key={product.id} className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.title}
                  width={60}
                  height={60}
                  className="rounded"
                />
              )}
              <div className="ml-4">
                <h3 className="font-bold">{product.title}</h3>
                <p>ID: {product.id}</p>
                <p>Цена: {product.price} руб.</p>
                <p>Продавец: {product.seller}</p>
              </div>
            </div>
            <div>
              <Button onClick={() => handleEditProduct(product)} className="mr-2 bg-yellow-400 text-black">
                <Edit className="w-4 h-4" />
              </Button>
              <Button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 hover:bg-red-700 text-white">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {isLoadingMore && (
          <div className="text-center py-4">Загрузка следующих товаров...</div>
        )}
        {!hasMore && !isLoading && (
          <div className="text-center py-4 text-gray-500">Все товары загружены</div>
        )}
      </motion.div>
    </div>
  );
}
