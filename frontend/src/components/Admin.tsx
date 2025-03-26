'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/AdminButton";
import { Input } from "@/components/ui/AdminInput";
import { Card, CardContent } from "@/components/ui/CardFull";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/api/admin/products";
import { Product, ProductCreate, ProductUpdate } from "@/types/product";

export default function AdminProductsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductCreate>({
    name: "",
    price: 0,
    oldPrice: 0,
    author: "",
    description: "",
    image: "" // Начальное значение — строка, но будет обрабатываться как файл
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Ошибка загрузки товаров");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.target;
    
    // Явное приведение типа для name
    const fieldName = name as keyof ProductCreate;

    if (fieldName === "image" && files && files.length > 0) {
      const file = files[0];
      if (file && !file.type.startsWith('image/')) {
        setError('Пожалуйста, загрузите изображение');
        return;
      }
      if (file) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: file
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: type === "number" ? Number(value) : value
      }));
    }
  };

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (editId !== null) {
        const updateData: ProductUpdate = {
          id: editId,
          ...formData
        };
        const updatedProduct = await updateProduct(editId, updateData);
        setProducts(products.map(p => p.id === editId ? updatedProduct : p));
        setEditId(null);
      } else {
        const newProduct = await createProduct(formData);
        setProducts([...products, newProduct]);
      }
      
      setFormData({ 
        name: "", 
        price: 0, 
        oldPrice: 0, 
        author: "", 
        description: "", 
        image: "" 
      });
      setShowAddForm(false);
    } catch (err) {
      setError(editId ? "Ошибка обновления товара" : "Ошибка создания товара");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      author: product.author,
      description: product.description,
      image: product.image
    });
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить товар?")) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError("Ошибка удаления товара");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = searchId
    ? products.filter(product => product.id.toString().includes(searchId))
    : products;

  return (
    <div className="p-6">
      <div className="flex justify-center">
        <h1 className="text-5xl font-extrabold">Админ-панель</h1>
      </div>
      
      {/* Отображение ошибок */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          Загрузка...
        </div>
      )}

      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">{editId ? "Редактирование товара" : "Добавление товара"}</h1>
        <Button
          className="bg-white hover:text-[#5D1286] hover:bg-white text-black ml-10"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={isLoading}
        >
          {showAddForm ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </Button>
      </div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showAddForm ? 1 : 0, height: showAddForm ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <form className="mb-6 space-y-4 p-1" onSubmit={handleAddOrUpdateProduct}>
          <Input 
            className="w-[260px]" 
            name="name" 
            placeholder="Название" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Стоимость по скидке</label>
            <Input 
              className="w-[260px]" 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleInputChange} 
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Стоимость до скидки</label>
            <Input 
              className="w-[260px]" 
              type="number" 
              name="oldPrice" 
              value={formData.oldPrice} 
              onChange={handleInputChange} 
              required 
              disabled={isLoading}
            />
          </div>

          <Input 
            className="w-[260px]" 
            name="author" 
            placeholder="Продавец" 
            value={formData.author} 
            onChange={handleInputChange} 
            required 
            disabled={isLoading}
          />
          <Input 
            className="w-[260px]" 
            name="description" 
            placeholder="Описание" 
            value={formData.description} 
            onChange={handleInputChange} 
            required 
            multiline
            rows={3}
            disabled={isLoading}
          />
          <Input 
            className="w-[260px]" 
            type="file" 
            name="image"
            onChange={handleInputChange}
            required 
            disabled={isLoading}
          />

          <Button 
            type="submit" 
            className="rounded-xl bg-[#A232E8] hover:bg-[#AF4DFD] text-white transition-all duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? "Обработка..." : editId ? "Сохранить изменения" : "Добавить товар"}
          </Button>
        </form>
      </motion.div>

      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold">Список товаров на платформе</h2>
        <Button
          className="bg-white hover:text-[#5D1286] hover:bg-white text-black ml-10"
          onClick={() => setShowProducts(!showProducts)}
          disabled={isLoading}
        >
          {showProducts ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </Button>
      </div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showProducts ? 1 : 0, height: showProducts ? "auto" : 0 }}
        className="overflow-hidden p-1"
      >
        <Input 
          className="mb-4 w-[260px]" 
          placeholder="Поиск по ID" 
          value={searchId} 
          onChange={(e) => setSearchId(e.target.value)}
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="text-center py-4">Загрузка товаров...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4 rounded-lg hover:shadow-lg transition-all">
                  {product.image && (
                    <img 
                      src={typeof product.image === 'string' 
                        ? product.image 
                        : URL.createObjectURL(product.image)} 
                      alt={product.name}
                      className="w-full h-[250px] object-contain rounded-md mb-4"
                      onLoad={(e) => {
                        if (typeof product.image !== 'string') {
                          URL.revokeObjectURL(e.currentTarget.src);
                        }
                      }}
                    />
                  )}
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <div className="flex items-center mb-2">
                      <p className="text-sm text-black truncate">{product.author}</p>
                      <p className="text-sm text-gray-500 ml-1 truncate">/ {product.description}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-red-500 truncate">{product.price}₽</p>
                      <p className="ml-2 text-sm text-gray-500 line-through truncate">{product.oldPrice}₽</p>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        onClick={() => handleEditProduct(product)} 
                        className="bg-[#A232E8] hover:bg-[#AF4DFD] text-white text-sm py-1 px-2 flex items-center transition-all duration-300 ease-in-out"
                        disabled={isLoading}
                      >
                        <Edit className="w-3 h-3" /> <span className="mt-1">Редактировать</span>
                      </Button>
                      <Button 
                        onClick={() => handleDeleteProduct(product.id)} 
                        className="bg-black hover:bg-red-600 text-white text-sm py-1 px-2 flex items-center transition-all duration-300 ease-in-out"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-3 h-3" /> <span className="mt-1">Удалить</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      <a className="flex justify-center mt-10" href="/">
        <img src="/logos/logowb1.svg" alt="Wildberries Logo" />
      </a>
    </div>
  );
}
