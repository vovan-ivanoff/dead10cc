'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CartItem } from '../ui/CartItem';
import Image from 'next/image';
import Container from './Container';
import { PieChart } from 'lucide-react';
import { addToCart, deleteFromCart, removeFromCart } from '@/api/cart';
import { trackUserAction } from '@/api/recomendations';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    seller: string;
    quantity: number;
}

interface ProductListProps {
    products: Product[];
}

export default function CartPage({ products }: ProductListProps) {
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
    const [paymentOption, setPaymentOption] = useState('upon-receipt');
    const [productList, setProductList] = useState(products);

    const normalizedProducts = useMemo(() => {
        return productList.map(p => ({
            ...p,
            price: Math.floor(Number(p.price)),
        }));
    }, [productList]);

    useEffect(() => {
        const initialQuantities = Object.fromEntries(normalizedProducts.map(p => [p.id, p.quantity]));
        const initialSelections = Object.fromEntries(normalizedProducts.map(p => [p.id, true]));
        setQuantities(initialQuantities);
        setSelectedItems(initialSelections);
    }, [normalizedProducts]);

    const handleIncrease = async (id: number) => {
        try {
            const success = await addToCart(id, 1);
            if (success) {
                setQuantities(prev => ({
                    ...prev,
                    [id]: (prev[id] || 1) + 1,
                }));
                await trackUserAction(id, 'ADDED_TO_CART');
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
        }
    };

    const handleDecrease = async (id: number) => {
        try {
            const currentQuantity = quantities[id] || 1;
            if (currentQuantity > 1) {
                const success = await removeFromCart(id, 1);
                if (success) {
                    setQuantities(prev => ({
                        ...prev,
                        [id]: currentQuantity - 1,
                    }));
                }
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const success = await deleteFromCart(id);
            if (success) {
                setProductList(prev => prev.filter(p => p.id !== id));
                setQuantities(prev => {
                    const newQuantities = { ...prev };
                    delete newQuantities[id];
                    return newQuantities;
                });
                setSelectedItems(prev => {
                    const newSelectedItems = { ...prev };
                    delete newSelectedItems[id];
                    return newSelectedItems;
                });
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedItems(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const formatPrice = (value: number) => {
        return value.toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const subtotal = normalizedProducts.reduce((total, product) => {
        if (!selectedItems[product.id]) return total;
        const qty = quantities[product.id] || 1;
        return total + product.price * qty;
    }, 0);

    const saleCount = Math.round(0.03 * subtotal);
    const total = subtotal - saleCount;
    const totalCount = normalizedProducts.reduce((total, product) => {
        if (!selectedItems[product.id]) return total;
        return total + (quantities[product.id] || 1);
    }, 0);
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;

    const getProductWord = (count: number) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'товаров';
        }

        if (lastDigit === 1) {
            return 'товар';
        }

        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'товара';
        }

        return 'товаров';
    };

    return (
        <Container>
            <div className="w-full max-w-[1400px] px-4">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    <div className="flex flex-col w-full lg:flex-1 gap-6">
                        <div className="bg-white p-5 rounded-[20px] shadow-md w-full">
                            <div className="flex gap-4 flex-wrap">
                                <h2 className="text-2xl font-semibold mb-2 p-2">Корзина</h2>
                                <h3 className="py-3 text-gray-400">{totalCount} {getProductWord(totalCount)}</h3>
                            </div>
                            <div className="space-y-6 w-full">
                                {normalizedProducts.map((product) => (
                                    <CartItem
                                        key={product.id}
                                        id={product.id}
                                        image={product.image}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        quantity={quantities[product.id] || 1}
                                        onIncrease={() => handleIncrease(product.id)}
                                        onDecrease={() => handleDecrease(product.id)}
                                        selected={selectedItems[product.id] ?? false}
                                        onSelect={() => handleSelect(product.id)}
                                        onDelete={() => handleDelete(product.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[380px] xl:w-[420px] bg-white p-6 rounded-[20px] shadow-md flex flex-col lg:sticky lg:top-[100px] self-start">
                        <div>
                            <h2 className="text-xl font-medium mb-2">Доставка в пункт выдачи</h2>
                            <p className="text-md text-gray-500 mb-1">Москва, Волоколамское ш., д. 4</p>
                            <p className="text-md text-gray-500 mb-4">Ближайшая завтра</p>
                            <div className="flex justify-between flex-wrap gap-2">
                                <h3 className="font-medium mb-2">Оплата SL Кошельком</h3>
                                <div className="flex w-[50px] h-[25px] rounded-2xl bg-green-100 justify-center items-center mb-1.5">
                                    <h3 className="text-green-600 font-medium">-3%</h3>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-4 bg-gray-200 rounded-[15px] p-1">
                                <button
                                    onClick={() => setPaymentOption('upon-receipt')}
                                    className={`flex-1 py-1 rounded-[10px] font-medium transition ${paymentOption === 'upon-receipt'
                                        ? 'bg-white text-black shadow'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    При получении
                                </button>
                                <button
                                    onClick={() => setPaymentOption('now')}
                                    className={`flex-1 py-1 rounded-[10px] font-medium transition ${paymentOption === 'now'
                                        ? 'bg-white text-black shadow'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    Сразу
                                </button>
                            </div>

                            <div className="flex justify-between mb-2">
                                <span>Товары, {totalCount} шт.</span>
                                <span className="font-medium">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span>Скидка SL Кошелька</span>
                                <span className="text-transparent bg-clip-text bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)]">{formatPrice(saleCount)}</span>
                            </div>

                            <div className="flex justify-between font-semibold text-lg mb-4">
                                <span>Итого</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <div className="flex gap-2">
                                <PieChart className="w-[27px] h-[27px] text-current flex-shrink-0 self-center" />
                                <h3 className="font-medium mt-1.5">Частями</h3>
                                <Image
                                    src="/assets/icons/control.svg"
                                    alt="control"
                                    width={8}
                                    height={8}
                                    className="object-contain mt-0.5"
                                />
                            </div>
                        </div>
                        <button className="bg-[#1B2429] hover:bg-[linear-gradient(105deg,#6A11CB_0%,#2575FC_100%)] text-white py-2 rounded-[10px] transition mt-4">
                            Заказать
                        </button>
                        <div className="flex mt-4 gap-2">
                            <input
                                type="checkbox"
                                className="mt-1 w-6 h-6 text-[#6A11CB] accent-[#6A11CB] flex-shrink-0"
                            />
                            <p className="text-xs text-gray-500">
                                Соглашаюсь с <a href="#" className="underline">правилами пользования торговой площадкой и возврата</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}