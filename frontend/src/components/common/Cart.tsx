'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CartItem } from '../ui/CartItem';
import Image from 'next/image';
import Container from './Container';
import { Pencil } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    oldPrice: number | string;
    image: string;
    author: string;
}

interface ProductListProps {
    products: Product[];
}

export default function CartPage({ products }: ProductListProps) {
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
    const [paymentOption, setPaymentOption] = useState('upon-receipt');

    const normalizedProducts = useMemo(() => {
        return products.map(p => ({
            ...p,
            price: Math.floor(Number(p.price)),
            oldPrice: Math.floor(Number(p.oldPrice)),
        }));
    }, [products]);

    useEffect(() => {
        const initialQuantities = Object.fromEntries(normalizedProducts.map(p => [p.id, 1]));
        const initialSelections = Object.fromEntries(normalizedProducts.map(p => [p.id, true]));
        setQuantities(initialQuantities);
        setSelectedItems(initialSelections);
    }, [normalizedProducts]);

    const handleIncrease = (id: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: (prev[id] || 1) + 1,
        }));
    };

    const handleDecrease = (id: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) - 1),
        }));
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
            minimumFractionDigits: 2,
        });
    };

    const subtotal = normalizedProducts.reduce((total, product) => {
        if (!selectedItems[product.id]) return total;
        const qty = quantities[product.id] || 1;
        return total + product.price * qty;
    }, 0);

    const subtotal1 = normalizedProducts.reduce((total, product) => {
        if (!selectedItems[product.id]) return total;
        const qty = quantities[product.id] || 1;
        return total + product.oldPrice * qty;
    }, 0);

    const total = subtotal - 0.03 * subtotal;
    const saleCount = 0.03 * subtotal;

    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const formattedTomorrow = tomorrow.toLocaleDateString('ru-RU', options);
    const formattedDayAfter = dayAfterTomorrow.toLocaleDateString('ru-RU', options);

    const selectedCount = normalizedProducts.reduce((count, product) => {
        if (!selectedItems[product.id]) return count;
        return count + (quantities[product.id] || 1);
    }, 0);

    const totalCount = normalizedProducts.reduce((count, product) => {
        return count + (quantities[product.id] || 1);
    }, 0);

    const getProductWord = (count: number) => {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) return 'товар';
        if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'товара';
        return 'товаров';
    };

    return (
        <Container>
            <div className="flex items-start">
                {/* Левая колонка */}
                <div className="flex flex-col flex-1 gap-4">
                    {/* Корзина */}
                    <div className="bg-white p-4 rounded-[20px] shadow-md">
                        <div className="flex gap-4">
                            <h2 className="text-2xl font-semibold mb-2 p-2">Корзина</h2>
                            <h3 className="py-3 text-gray-400">{totalCount} {getProductWord(totalCount)}</h3>
                        </div>
                        <div className="space-y-4">
                            {normalizedProducts.map((product) => (
                                <CartItem
                                    key={product.id}
                                    image={product.image}
                                    title={product.name}
                                    description={product.description}
                                    price={product.price}
                                    oldPrice={product.oldPrice}
                                    quantity={quantities[product.id] || 1}
                                    onIncrease={() => handleIncrease(product.id)}
                                    onDecrease={() => handleDecrease(product.id)}
                                    selected={selectedItems[product.id] ?? true}
                                    onSelect={() => handleSelect(product.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Доставка */}
                    <div className="bg-white p-4 rounded-[20px] shadow-md relative">
                        <h2 className="text-xl font-semibold mb-2 p-2">Доставка</h2>
                        <div className="px-2">
                            <p className="text-base font-medium mb-1">Пункт выдачи: Москва, Волоколамское ш., д. 4</p>
                            <p className="text-sm text-gray-500 mb-4">Доставка: {formattedTomorrow} — {formattedDayAfter}</p>

                            <div className="flex flex-wrap gap-2">
                                {normalizedProducts.map((product) => (
                                    <div key={product.id} className="w-16 h-16 relative">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded-xl border"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Pencil size={18} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>

                    {/* Способ оплаты и Мои данные */}
                    <div className="flex gap-4">
                        {/* Способ оплаты */}
                        <div className="relative flex-1 bg-white p-4 rounded-[20px] shadow-md min-w-0">
                            <h2 className="text-xl font-semibold mb-2 p-2">Способ оплаты</h2>
                            <div className="px-2">
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center gap-2">
                                        <Image
                                            src="/assets/icons/cash.svg"
                                            alt="cash"
                                            width={27}
                                            height={22}
                                            className="object-contain mb-1.5"
                                        />
                                        <h3 className="ml-2">WB кошелек</h3>
                                    </label>
                                    <div className="flex w-[50px] h-[25px] rounded-2xl bg-green-100 justify-center items-center mb-1.5">
                                        <h3 className="text-green-600 font-medium">-3%</h3>
                                    </div>
                                </div>
                            </div>
                            <Pencil size={18} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>

                        {/* Мои данные */}
                        <div className="relative flex-1 bg-white p-4 rounded-[20px] shadow-md min-w-0">
                            <h2 className="text-xl font-semibold mb-2 p-2">Мои данные</h2>
                            <div className="px-2">
                                <div className="flex items-center gap-2 mt-2">
                                    <Image
                                        src="/assets/icons/user_cart.svg"
                                        alt="avatar"
                                        width={25}
                                        height={25}
                                        className="object-contain mb-2 opacity-15"
                                    />
                                    <h3 className="ml-2">Имя</h3>
                                    <h3 className="ml-2">+7 800 555-35-35</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Правая колонка — Итого */}
                <div className="w-[420px] ml-6 bg-white p-6 rounded-[20px] shadow-md flex flex-col sticky top-[100px] self-start">
                    <div>
                        <h2 className="text-xl font-medium mb-2">Доставка в пункт выдачи</h2>
                        <p className="text-md text-gray-500 mb-1">Москва, Волоколамское ш., д. 4</p>
                        <p className="text-md text-gray-500 mb-4">Ближайшая завтра</p>
                        <div className="flex justify-between">
                            <h3 className="font-medium mb-2">Оплата WB Кошельком</h3>
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
                            <span>Товары, {selectedCount} шт.</span>
                            <span className="font-medium">{formatPrice(subtotal1)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Моя скидка</span>
                            <span className="text-gray-500">{formatPrice(subtotal1 - subtotal)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Скидка WB Кошелька</span>
                            <span className="text-purple-600">{formatPrice(saleCount)}</span>
                        </div>

                        <div className="flex justify-between font-semibold text-lg mb-4">
                            <span>Итого</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <div className="flex gap-2">
                            <Image
                                src="/assets/icons/dolki.svg"
                                alt="avatar"
                                width={27}
                                height={27}
                                className="object-contain"
                            />
                            <h3 className="font-medium mt-1.5">Частями</h3>
                            <Image
                                src="/assets/icons/control.svg"
                                alt="control"
                                width={20}
                                height={20}
                                className="object-contain mt-0.5"
                            />
                        </div>
                    </div>
                    <button className="bg-[#A232E8] hover:bg-[#AF4DFD] text-white py-2 rounded-[14px] transition mt-4">
                        Заказать
                    </button>
                    <div className="flex mt-4">
                        <input
                            type="checkbox"
                            className="mt-1 w-6 h-6 text-purple-600 accent-purple-600"
                        />
                        <p className="text-xs text-gray-500">
                            Соглашаюсь с <a href="#" className="underline">правилами пользования торговой площадкой и возврата</a>
                        </p>
                    </div>
                </div>
            </div>
        </Container>


    );
}
