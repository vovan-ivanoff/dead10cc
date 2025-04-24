'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SideMenuProps {
  onClose: () => void;
  isOpen: boolean;
}

const menuItems = [
  { name: 'Облако подарков', icon: '/assets/icons/sidemenu/gift.svg' },
  { name: 'Сертификаты Snaply', icon: '/assets/icons/sidemenu/certificate.svg' },
  { name: 'Тренд', icon: '/assets/icons/sidemenu/trend.svg' },
  { name: 'Экспресс-доставка', icon: '/assets/icons/sidemenu/delivery.svg' },
  { name: 'Женщинам', icon: '/assets/icons/sidemenu/women.svg' },
  { name: 'Обувь', icon: '/assets/icons/sidemenu/shoes.svg' },
  { name: 'Детям', icon: '/assets/icons/sidemenu/kids.svg' },
  { name: 'Мужчинам', icon: '/assets/icons/sidemenu/men.svg' },
  { name: 'Дом', icon: '/assets/icons/sidemenu/home.svg' },
  { name: 'Красота', icon: '/assets/icons/sidemenu/beauty.svg' },
  { name: 'Аксессуары', icon: '/assets/icons/sidemenu/accessories.svg' },
  { name: 'Электроника', icon: '/assets/icons/sidemenu/electronics.svg' },
  { name: 'Игрушки', icon: '/assets/icons/sidemenu/toys.svg' },
  { name: 'Мебель', icon: '/assets/icons/sidemenu/furniture.svg' },
  { name: 'Товары для взрослых', icon: '/assets/icons/sidemenu/adult.svg' },
  { name: 'Продукты', icon: '/assets/icons/sidemenu/food.svg' },
  { name: 'Цветы', icon: '/assets/icons/sidemenu/flowers.svg' },
  { name: 'Бытовая техника', icon: '/assets/icons/sidemenu/appliances.svg' },
  { name: 'Зоотовары', icon: '/assets/icons/sidemenu/pets.svg' },
  { name: 'Спорт', icon: '/assets/icons/sidemenu/sport.svg' },
  { name: 'Автотовары', icon: '/assets/icons/sidemenu/auto.svg' },
  { name: 'Транспортные средства', icon: '/assets/icons/sidemenu/transport.svg' },
  { name: 'Книги', icon: '/assets/icons/sidemenu/books.svg' },
  { name: 'Ювелирные изделия', icon: '/assets/icons/sidemenu/jewelry.svg' },
  { name: 'Для ремонта', icon: '/assets/icons/sidemenu/repair.svg' },
  { name: 'Сад и дача', icon: '/assets/icons/sidemenu/garden.svg' },
  { name: 'Здоровье', icon: '/assets/icons/sidemenu/health.svg' },
  { name: 'Канцтовары', icon: '/assets/icons/sidemenu/stationery.svg' },
  { name: 'Сделано в России', icon: '/assets/icons/sidemenu/russia.svg' },
  { name: 'Культурный код', icon: '/assets/icons/sidemenu/culture.svg' },
  { name: 'Акции', icon: '/assets/icons/sidemenu/sale.svg' },
];

const SideMenu: React.FC<SideMenuProps> = ({ onClose, isOpen }) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.querySelector('.side-menu');
      if (menu && !menu.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed top-[115px] left-0 w-full h-[calc(100vh-115px)] bg-black bg-opacity-50 z-30"
        />
      )}

      <div
        className={`fixed top-[115px] left-0 w-[350px] h-[calc(100vh-115px)] bg-white shadow-lg z-40 overflow-y-auto side-menu transition-transform duration-300 ${
          isOpen ? 'open' : ''
        }`}
      >
        <div className="p-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href="#"
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={17}
                height={17}
                className="mr-3"
              />
              <span className="font-hauss font-book text-base">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
