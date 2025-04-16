"use client";

import React from "react";
import { Bell, CreditCard, Settings, Smartphone, Heart, ShoppingCart, Star, HelpCircle, RotateCcw, MessageSquare, LogOut } from "lucide-react";
import { Button } from "./ui/AdminButton";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ProfilePage: React.FC = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col md:flex-row gap-6 xl:px-24 md:px-4 transition-all duration-300 ease-in-out">
            <div className="w-full md:w-[435px] bg-white p-6 rounded-[20px] shadow-md">
                <div className="relative bg-white flex flex-col gap-4">
                    <div className="absolute top-0 right-0">
                        <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer transition-all hover:scale-105" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Image
                            src="/icons/avatar.svg"
                            alt="avatar"
                            width={51}
                            height={50}
                            className="object-contain mb-2"
                        />
                        <div className="group text-lg font-semibold">
                            <h3 className="font-[570] text-lg group-hover:bg-gradient-to-r group-hover:from-[#C800A1] group-hover:to-[#981E97] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">Имя пользователя</h3>
                        </div>
                        <Image
                            src="/icons/control.svg"
                            alt="control"
                            width={20}
                            height={20}
                            className="object-contain mb-2"
                        />

                    </div>
                    <div className="p-3 bg-[#FEECEC] rounded-[14px] text-sm h-[80px] hover:bg-red-100 transition-all ease-in-out">
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        <div className="col-span-2 bg-gray-100 p-3 rounded-[14px] text-sm flex flex-col hover:bg-gray-200 transition-all ease-in-out">
                            <div className="flex">
                                <span className="text-gray-500">WB скидка</span>
                                <Image
                                    src="/icons/control.svg"
                                    alt="control1"
                                    width={16}
                                    height={16}
                                    className="object-contain"
                                />

                            </div>
                            <div className="font-medium">до 30%</div>
                        </div>
                        <div className="col-span-3 bg-gray-100 p-3 rounded-[14px] text-sm flex flex-col h-full">
                            <span className="text-gray-500">Оплата при получении</span>
                            <div className="font-medium">до 137 100₽</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-sm text-gray-500">Финансы</h4>
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="bg-gray-100 flex items-center gap-2 pl-3 py-1 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                                <CreditCard className="w-4 h-4" />
                                <span className="mt-1 text-black">Способы оплаты</span>
                            </div>
                            <div className="bg-gray-100 flex items-center gap-2 pl-3 py-1 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                                <CreditCard className="w-4 h-4" />
                                <span className="mt-1 text-black">Реквизиты</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-sm text-gray-500">Управление</h4>
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="bg-gray-100 flex items-center gap-2 pl-3 py-1 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                                <Settings className="w-4 h-4" />
                                <span className="mt-1 text-black">Настройки</span>
                            </div>
                            <div className="bg-gray-100 flex items-center gap-2 pl-3 py-1 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                                <Smartphone className="w-4 h-4" />
                                <span className="mt-1 text-black">Ваши устройства</span>
                            </div>
                        </div>
                        <Button
                            className="w-full flex items-center justify-center gap-2 mt-4 p-3 bg-[#A232E8] hover:bg-[#AF4DFD] text-white rounded-[14px] font-semibold transition-all duration-300 ease-in-out"
                            onClick={() => router.push('/')}>
                            <LogOut className="w-5 h-5 mb-0.5" />
                            <h2 className="font-medium mt-1">Выйти</h2>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-3/4 gap-4 flex flex-col">
                <div className="w-full grid gap-3 md:grid-cols-1 lg:grid-cols-2">
                    <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
                        <div className="flex flex-col ml-2">
                            <div className="flex items-center">
                                <Image
                                    src="/icons/cash.svg"
                                    alt="cash"
                                    width={27}
                                    height={22}
                                    className="object-contain"
                                />
                                <span className="font-[570] ml-3 text-lg mt-2 group-hover:bg-gradient-to-r group-hover:from-[#C800A1] group-hover:to-[#981E97] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">0 ₽</span>
                            </div>
                            <span className="text-sm mt-2 text-gray-500">WB Кошелёк</span>
                        </div>
                        <Button className="bg-purple-100 w-[100px] text-purple-600 text-center hover:bg-purple-200 rounded-[10px] transition-all duration-300 ease-in-out">
                            <h1 className="mt-1">Пополнить</h1>
                        </Button>
                    </div>

                    <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
                        <div className="flex flex-col ml-2">
                            <div className="flex items-center">
                                <Image
                                    src="/icons/dolki.svg"
                                    alt="avatar"
                                    width={27}
                                    height={27}
                                    className="object-contain"
                                />
                                <span className="font-[570] ml-3 text-lg mt-2 group-hover:bg-gradient-to-r group-hover:from-[#C800A1] group-hover:to-[#981E97] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">30000 ₽</span>
                            </div>
                            <span className="text-sm mt-2 text-gray-500">Лимит на оплату частями</span>
                        </div>
                        <Image
                            src="/icons/control.svg"
                            alt="control"
                            width={32}
                            height={32}
                            className="object-contain mr-1"
                        />
                    </div>
                </div>

                <div className="w-full grid gap-3 grid-cols-1 hidden lg:flex shadow-md rounded-[20px]">
                    <div className="bg-gradient-to-bl from-pink-50 to-pink-200 rounded-[20px] h-[100px] w-full hover:scale-[1.01] transition-all duration-300"></div>
                </div>

                <div className="w-full grid md:grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
                        <div className="flex flex-col ml-2">
                            <span className="font-[570] text-lg mt-2 group-hover:bg-gradient-to-r group-hover:from-[#C800A1] group-hover:to-[#981E97] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">Избранное</span>
                            <span className="text-gray-500 text-sm">230 товаров</span>
                        </div>
                        <Heart className="w-7 h-7 text-purple-500 hover:text-purple-700 hover:scale-110 cursor-pointer transition-all duration-200" />
                    </div>

                    <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
                        <div className="flex flex-col ml-2">
                            <span className="font-[570] text-lg mt-2 group-hover:bg-gradient-to-r group-hover:from-[#C800A1] group-hover:to-[#981E97] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">Покупки</span>
                            <span className="text-gray-500 text-sm">Смотреть</span>
                        </div>
                        <ShoppingCart className="w-7 h-7 text-purple-500 hover:text-purple-700 hover:scale-110 cursor-pointer transition-all duration-200" />
                    </div>

                    <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
                        <div className="flex flex-col ml-2">
                            <span className="font-[570] text-lg mt-2 group-hover:bg-gradient-to-r group-hover:from-[#C800A1] group-hover:to-[#981E97] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">Ждут оценки</span>
                            <span className="text-gray-500 text-sm">29 товаров</span>
                        </div>
                        <Star className="w-7 h-7 text-purple-500 hover:text-purple-700 hover:scale-110 cursor-pointer transition-all duration-200" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[20px] shadow-md">
                    <h3 className="font-[570] text-lg mb-3">Сервис и помощь</h3>
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 pl-3 py-2 bg-gray-100 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                            <MessageSquare className="w-5 h-5 text-gray-500" />
                            <span className="mt-1">Написать в поддержку</span>
                        </div>
                        <div className="flex items-center gap-2 pl-3 py-2 bg-gray-100 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                            <RotateCcw className="w-5 h-5 text-gray-500" />
                            <span className="mt-1">Вернуть товар</span>
                        </div>
                        <div className="flex items-center gap-2 pl-3 py-2 bg-gray-100 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                            <HelpCircle className="w-5 h-5 text-gray-500" />
                            <span className="mt-1">Вопросы и ответы</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
