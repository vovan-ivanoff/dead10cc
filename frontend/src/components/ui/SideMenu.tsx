import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SideMenuProps {
  onClose: () => void;
}

const menuItems = [
  { name: 'Облако подарков', icon: '/icons/sidemenu/gift.svg' },
  { name: 'Сертификаты Wildberries', icon: '/icons/sidemenu/certificate.svg' },
  { name: 'Тренд', icon: '/icons/sidemenu/trend.svg' },
  { name: 'Экспресс-доставка', icon: '/icons/sidemenu/delivery.svg' },
  { name: 'Женщинам', icon: '/icons/sidemenu/women.svg' },
  { name: 'Обувь', icon: '/icons/sidemenu/shoes.svg' },
  { name: 'Детям', icon: '/icons/sidemenu/kids.svg' },
  { name: 'Мужчинам', icon: '/icons/sidemenu/men.svg' },
  { name: 'Дом', icon: '/icons/sidemenu/home.svg' },
  { name: 'Красота', icon: '/icons/sidemenu/beauty.svg' },
  { name: 'Аксессуары', icon: '/icons/sidemenu/accessories.svg' },
  { name: 'Электроника', icon: '/icons/sidemenu/electronics.svg' },
  { name: 'Игрушки', icon: '/icons/sidemenu/toys.svg' },
  { name: 'Мебель', icon: '/icons/sidemenu/furniture.svg' },
  { name: 'Товары для взрослых', icon: '/icons/sidemenu/adult.svg' },
  { name: 'Продукты', icon: '/icons/sidemenu/food.svg' },
  { name: 'Цветы', icon: '/icons/sidemenu/flowers.svg' },
  { name: 'Бытовая техника', icon: '/icons/sidemenu/appliances.svg' },
  { name: 'Зоотовары', icon: '/icons/sidemenu/pets.svg' },
  { name: 'Спорт', icon: '/icons/sidemenu/sport.svg' },
  { name: 'Автотовары', icon: '/icons/sidemenu/auto.svg' },
  { name: 'Транспортные средства', icon: '/icons/sidemenu/transport.svg' },
  { name: 'Книги', icon: '/icons/sidemenu/books.svg' },
  { name: 'Ювелирные изделия', icon: '/icons/sidemenu/jewelry.svg' },
  { name: 'Для ремонта', icon: '/icons/sidemenu/repair.svg' },
  { name: 'Сад и дача', icon: '/icons/sidemenu/garden.svg' },
  { name: 'Здоровье', icon: '/icons/sidemenu/health.svg' },
  { name: 'Канцтовары', icon: '/icons/sidemenu/stationery.svg' },
  { name: 'Сделано в России', icon: '/icons/sidemenu/russia.svg' },
  { name: 'Культурный код', icon: '/icons/sidemenu/culture.svg' },
  { name: 'Акции', icon: '/icons/sidemenu/sale.svg' },
];

const SideMenu: React.FC<SideMenuProps> = ({ onClose }) => {
  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.querySelector('.side-menu');
      if (menu && !menu.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <>
      {/* Затемняющий фон */}
      <div
        onClick={onClose} // Закрытие меню при клике на фон
        className="fixed top-[115px] left-0 w-full h-[calc(100vh-115px)] bg-black bg-opacity-50 z-30"
      />

      {/* Меню */}
      <div
        className="fixed top-[115px] left-0 w-[350px] h-[calc(100vh-115px)] bg-white shadow-lg z-40 overflow-y-auto side-menu"
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