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
  Wallet,
  PieChart,
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
    console.log("Сохранено:", name, gender);
    setModalOpen(false);
  };

  const handleDeleteProfile = () => {
    console.log("Профиль удалён");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 xl:px-8 md:px-4 transition-all duration-300 ease-in-out">
      <div className="w-full md:w-[435px] bg-white p-6 rounded-[20px] shadow-md">
        <div className="relative bg-white flex flex-col gap-4">
          <div className="absolute top-0 right-0">
            <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer transition-all hover:scale-105 flex-shrink-0" />
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
              className="flex-shrink-0 self-center mr-4"
            />
            <h3 className="text-lg font-[570] leading-none self-center group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out transition-opacity opacity-100 group-hover:opacity-100">
              Имя пользователя
            </h3>
            <ChevronRight className="w-6 h-6 text-[#8C8989] opacity-50 flex-shrink-0 self-center" />
          </div>
          <div className="p-3 bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] hover:opacity-80 rounded-[14px] text-sm h-[80px] transition-all duration-200 ease-in-out"></div>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2 bg-gray-100 p-3 rounded-[14px] text-sm flex flex-col hover:bg-gray-200 transition-all ease-in-out">
              <div className="flex items-center">
                <span className="text-gray-500 leading-none">SL скидка</span>
                <ChevronRight className="w-3 h-3 text-[#8C8989] opacity-50 flex-shrink-0 self-center ml-1" />
              </div>
              <div className="font-medium leading-none mt-1">до 30%</div>
            </div>

            <div className="col-span-3 bg-gray-100 p-3 rounded-[14px] text-sm flex flex-col h-full">
              <span className="text-gray-500 leading-none">Оплата при получении</span>
              <div className="font-medium leading-none mt-1">до 137 100₽</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-500 leading-none">Финансы</h4>
            <div className="flex flex-col gap-3 mt-2">
              <div className="bg-gray-100 flex items-center gap-3 pl-3 py-2 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                <CreditCard className="w-5 h-5 text-gray-500 flex-shrink-0 self-center" />
                <span className="font-hauss text-black text-[17px] leading-none">Способы оплаты</span>
              </div>
              <div className="bg-gray-100 flex items-center gap-3 pl-3 py-2 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                <CreditCard className="w-5 h-5 text-gray-500 flex-shrink-0 self-center" />
                <span className="font-hauss text-black text-[17px] leading-none">Реквизиты</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-500 leading-none">Управление</h4>
            <div className="flex flex-col gap-3 mt-2">
              <div className="bg-gray-100 flex items-center gap-3 pl-3 py-2 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                <Settings className="w-5 h-5 text-gray-500 flex-shrink-0 self-center" />
                <span className="font-hauss text-black text-[17px] leading-none">Настройки</span>
              </div>
              <div className="bg-gray-100 flex items-center gap-3 pl-3 py-2 text-gray-600 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
                <Smartphone className="w-5 h-5 text-gray-500 flex-shrink-0 self-center" />
                <span className="font-hauss text-black text-[17px] leading-none">Ваши устройства</span>
              </div>
            </div>
            <Button
              className="w-full flex items-center justify-center gap-2 mt-4 p-3 
                        bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] 
                        hover:opacity-80 text-white rounded-[14px] 
                        font-semibold transition-all duration-300 ease-in-out"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 self-center" />
              <span className="font-medium leading-[1.1] self-center whitespace-nowrap">
                Выйти
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/4 gap-4 flex flex-col">
        <div className="w-full grid gap-3 grid-cols-1 lg:grid-cols-2">
          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <div className="flex items-center">
                <Wallet className="w-6 h-6 text-current flex-shrink-0 self-center" />
                <span className="font-[570] ml-2 text-lg group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity leading-none">
                  0 ₽
                </span>
              </div>
              <span className="text-sm mt-2 text-gray-500">SL Кошелёк</span>
            </div>
            <Button className="bg-gray-100 w-[100px] text-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] text-center group-hover:bg-gray-200 rounded-[10px] transition-all duration-300 ease-in-out">
              <h1 className="mt-1 font-normal leading-none">Пополнить</h1>
            </Button>
          </div>

          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <div className="flex items-center">
                <PieChart className="w-[27px] h-[27px] text-current flex-shrink-0 self-center" />
                <span className="font-[570] ml-2 text-lg group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity leading-none">
                  30000 ₽
                </span>
              </div>
              <span className="text-sm mt-2 text-gray-500">Лимит на оплату частями</span>
            </div>
            <ChevronRight className="w-12 h-12 text-gray-700 opacity-50 flex-shrink-0 mr-1" />
          </div>
        </div>

        <div className="w-full grid gap-3 grid-cols-1 lg:flex shadow-md rounded-[20px]">
          <div className="bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] hover:opacity-80 rounded-[20px] h-[100px] w-full hover:scale-[1.01] transition-all duration-300"></div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <span className="font-[570] text-lg mt-2 group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">
                Избранное
              </span>
              <span className="text-gray-500 text-sm">230 товаров</span>
            </div>
            <Heart className="w-7 h-7 text-black group-hover:text-[#2575FC] group-hover:scale-110 cursor-pointer transition-all duration-200 flex-shrink-0" />
          </div>

          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <span className="font-[570] text-lg mt-2 group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">
                Покупки
              </span>
              <span className="text-gray-500 text-sm">Смотреть</span>
            </div>
            <ShoppingCart className="w-7 h-7 text-black group-hover:text-[#2575FC] group-hover:scale-110 cursor-pointer transition-all duration-200 flex-shrink-0" />
          </div>

          <div className="group bg-white p-4 h-[100px] rounded-[20px] shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col ml-2">
              <span className="font-[570] text-lg mt-2 group-hover:bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] group-hover:bg-clip-text group-hover:text-transparent duration-500 ease-in-out opacity-100 group-hover:opacity-100 transition-opacity">
                Ждут оценки
              </span>
              <span className="text-gray-500 text-sm">29 товаров</span>
            </div>
            <Star className="w-7 h-7 text-black group-hover:text-[#2575FC] group-hover:scale-110 cursor-pointer transition-all duration-200 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-md">
          <h3 className="font-[570] text-lg mb-3">Сервис и помощь</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 pl-3 py-3 bg-gray-100 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
              <MessageSquare className="w-5 h-5 text-gray-500 flex-shrink-0 self-center" />
              <span className="text-s leading-none">Написать в поддержку</span>
            </div>
            <div className="flex items-center gap-3 pl-3 py-3 bg-gray-100 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
              <RotateCcw className="w-5 h-5 text-gray-500 flex-shrink-0 self-center" />
              <span className="text-s leading-none">Вернуть товар</span>
            </div>
            <div className="flex items-center gap-3 pl-3 py-3 bg-gray-100 rounded-[14px] hover:bg-gray-200 transition-all ease-in-out">
              <HelpCircle className="w-5 h-5 text-gray-500 flex-shrink-0 self-center" />
              <span className="text-s leading-none">Вопросы и ответы</span>
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
