"use client";

import React, { useState } from "react";
import {
  Bell,
  CreditCard,
  Settings,
  Smartphone,
  Heart,
  ShoppingCart,
  Star,
  HelpCircle,
  RotateCcw,
  MessageSquare,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/AdminButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logout } from "../../api/auth";
import EditProfileModal from "../ui/EditProfileModal";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const handleSaveProfile = (name: string, gender: string) => {
    // пустышка
    console.log("Сохранено:", name, gender);
    setModalOpen(false);
  };

  const handleDeleteProfile = () => {
    // пустышка
    console.log("Профиль удалён");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 xl:px-8 md:px-4 transition-all duration-300 ease-in-out">
      <div className="w-full md:w-[435px] bg-white p-6 rounded-[20px] shadow-md">
        <div className="relative bg-white flex flex-col gap-4">
          <div className="absolute top-0 right-0">
            <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer transition-all hover:scale-105" />
          </div>
          <div
            className="group flex items-center cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <Image
              src="/assets/icons/avatar.svg"
              alt="avatar"
              width={51}
              height={50}
              className="object-contain mr-4"
            />
            <h3 className="text-lg font-[570] leading-none group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out transition-opacity opacity-100 group-hover:opacity-100">
              Имя пользователя
            </h3>
            <ChevronRight className="w-6 h-6 text-[#8C8989] opacity-50 translate-y-[1px] ml-1" />
          </div>
          <div className="p-3 bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] hover:opacity-80 rounded-[14px] text-sm h-[80px] transition-all duration-200 ease-in-out"></div>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2 bg-gray-100 p-3 rounded-[14px] text-sm flex flex-col hover:bg-gray-200 transition-all ease-in-out">
              <div className="flex items-center">
                <span className="text-gray-500">WB скидка</span>
                <ChevronRight className="w-3 h-3 text-[#8C8989] opacity-50" />
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
                <CreditCard className="w-5 h-5 translate-y-[-1px]" />
                <span className="font-hauss text-black text-[17px]">Способы оплаты</span>
              </div>
              <div className="bg-gray-100 flex items-center gap-2 pl-3 py-1 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                <CreditCard className="w-5 h-5 translate-y-[-1px]" />
                <span className="font-hauss text-black text-[17px]">Реквизиты</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-500">Управление</h4>
            <div className="flex flex-col gap-3 mt-2">
              <div className="bg-gray-100 flex items-center gap-2 pl-3 py-1 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                <Settings className="w-5 h-5 translate-y-[-1px]" />
                <span className="font-hauss text-black text-[17px]">Настройки</span>
              </div>
              <div className="bg-gray-100 flex items-center gap-2 pl-3 py-1 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                <Smartphone className="w-5 h-5 translate-y-[-1px]" />
                <span className="font-hauss text-black text-[17px]">Ваши устройства</span>
              </div>
            </div>
            <Button
              className="w-full flex items-center justify-center gap-2 mt-4 p-3 bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] hover:opacity-80 text-white rounded-[14px] font-semibold transition-all duration-300 ease-in-out"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mb-0.5" />
              <h2 className="font-medium">Выйти</h2>
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
                  src="/assets/icons/cash.svg"
                  alt="cash"
                  width={27}
                  height={22}
                  className="object-contain"
                />
                <span className="font-[570] ml-3 text-lg mt-2 group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">
                  0 ₽
                </span>
              </div>
              <span className="text-sm mt-2 text-gray-500">WB Кошелёк</span>
            </div>
            <Button className="bg-gray-100 w-[100px] text-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] text-center hover:bg-gray-200 rounded-[10px] transition-all duration-300 ease-in-out">
              <h1 className="mt-1">Пополнить</h1>
            </Button>
          </div>

          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <div className="flex items-center">
                <Image
                  src="/assets/icons/dolki.svg"
                  alt="avatar"
                  width={27}
                  height={27}
                  className="object-contain"
                />
                <span className="font-[570] ml-3 text-lg mt-2 group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">
                  30000 ₽
                </span>
              </div>
              <span className="text-sm mt-2 text-gray-500">Лимит на оплату частями</span>
            </div>
            <Image
              src="/assets/icons/control.svg"
              alt="control"
              width={12}
              height={12}
              className="object-contain mr-1"
            />
          </div>
        </div>

        <div className="w-full grid gap-3 grid-cols-1 hidden lg:flex shadow-md rounded-[20px]">
          <div className="bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] hover:opacity-80 rounded-[20px] h-[100px] w-full hover:scale-[1.01] transition-all duration-300"></div>
        </div>

        <div className="w-full grid md:grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <span className="font-[570] text-lg mt-2 group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">
                Избранное
              </span>
              <span className="text-gray-500 text-sm">230 товаров</span>
            </div>
            <Heart className="w-7 h-7 text-[#6A11CB] group-hover:text-[#2575FC] group-hover:scale-110 cursor-pointer transition-all duration-200" />
          </div>

          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <span className="font-[570] text-lg mt-2 group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">
                Покупки
              </span>
              <span className="text-gray-500 text-sm">Смотреть</span>
            </div>
            <ShoppingCart className="w-7 h-7 text-[#6A11CB] group-hover:text-[#2575FC] group-hover:scale-110 cursor-pointer transition-all duration-200" />
          </div>

          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <span className="font-[570] text-lg mt-2 group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">
                Ждут оценки
              </span>
              <span className="text-gray-500 text-sm">29 товаров</span>
            </div>
            <Star className="w-7 h-7 text-[#6A11CB] group-hover:text-[#2575FC] group-hover:scale-110 cursor-pointer transition-all duration-200" />
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
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProfile}
        onLogout={handleLogout}
        onDelete={handleDeleteProfile}
        currentName="Имя пользователя"
        phoneNumber="+7 900 000-00-00"
        gender="Мужской"
      />
    </div>
  );
};

export default ProfilePage;
