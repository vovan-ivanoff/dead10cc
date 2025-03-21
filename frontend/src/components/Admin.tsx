"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import "../app/globals.css";
import { Plus, Minus, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  image: string;
  author: string;
}

export default function AdminProductsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [searchId, setSearchId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    oldPrice: 0,
    author: "",
    description: "",
    image: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Ошибка загрузки данных:", error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name.includes("price") ? Number(value) : value });
  };

  const handleAddOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      setProducts(products.map((p) => (p.id === editId ? { ...p, ...formData } : p)));
      setEditId(null);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...formData,
      };
      setProducts([...products, newProduct]);
    }
    setFormData({ name: "", price: 0, oldPrice: 0, author: "", description: "", image: "" });
    setShowAddForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditId(product.id);
    setFormData(product);
    setShowAddForm(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const filteredProducts = searchId
    ? products.filter((product) => product.id.toString() === searchId)
    : products;

  return (
    <div className="p-6">
      <div className="flex justify-center">
        <h1 className="text-5xl font-extrabold">Админ-панель</h1>
      </div>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">{editId ? "Редактирование товара" : "Добавление товара"}</h1>
        <Button
          className="bg-white hover:text-[#5D1286] hover:bg-white text-black ml-10"
          onClick={() => setShowAddForm(!showAddForm)}
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
          <Input className="w-[260px]" name="name" placeholder="Название" value={formData.name} onChange={handleInputChange} required />

          <div>
            <label className="block text-sm font-medium text-gray-700">Стоимость по скидке</label>
            <Input className="w-[260px]" type="number" name="price" value={formData.price} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Стоимость до скидки</label>
            <Input className="w-[260px]" type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} required />
          </div>

          <Input className="w-[260px]" name="author" placeholder="Продавец" value={formData.author} onChange={handleInputChange} required />
          <Input className="w-[260px]" name="description" placeholder="Описание" value={formData.description} onChange={handleInputChange} required />
          <Input className="w-[260px]" type="file" required />

          <Button type="submit" className="bg-[#A232E8] hover:bg-[#5D1286] text-white">
            {editId ? "Сохранить изменения" : "Добавить товар"}
          </Button>
        </form>

      </motion.div>

      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold">Список товаров на платформе</h2>
        <Button
          className="bg-white hover:text-[#5D1286] hover:bg-white text-black ml-10"
          onClick={() => setShowProducts(!showProducts)}
        >
          {showProducts ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </Button>

      </div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showProducts ? 1 : 0, height: showProducts ? "auto" : 0 }}
        className="overflow-hidden p-1"
      >
        <Input className="mb-4 w-[260px]" placeholder="Поиск по ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardContent className="p-4 rounded-lg hover:shadow-lg transition-all">
                  <img src={product.image} alt={product.name} className="w-full h-[250px] object-contain rounded-md mb-4" />
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
                    <Button onClick={() => handleEditProduct(product)} className="bg-[#A232E8] hover:bg-[#5D1286] text-white text-sm py-1 px-2 flex items-center">
                      <Edit className="w-3 h-3" /> <span className="mt-1">Редактировать</span>
                    </Button>
                    <Button onClick={() => handleDeleteProduct(product.id)} className="bg-black hover:bg-red-600 text-white text-sm py-1 px-2 flex items-center">
                      <Trash2 className="w-3 h-3" /> <span className="mt-1">Удалить</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <a className="flex justify-center mt-10" href="/">
        <img src="/logos/logowb1.svg"></img>
      </a>
    </div>
  );
}
