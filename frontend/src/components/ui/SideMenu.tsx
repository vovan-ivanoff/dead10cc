'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { sideMenuVariants } from '../../lib/animation';
import '../../styles/sidemenu.css';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('side-menu-open');
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('side-menu-open');
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setInternalIsOpen(true);
    }
  }, [isOpen]);

  const handleAnimationComplete = (definition: string) => {
    if (definition === 'closed') {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {internalIsOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="side-menu-overlay"
            onClick={onClose}
          />
        )}
          <motion.div
            ref={menuRef}
            key="menu"
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            exit="closed"
            variants={sideMenuVariants}
            onAnimationComplete={handleAnimationComplete}
            className="side-menu-container"
          >
          <div className="side-menu-content">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href="#"
                className="side-menu-item"
                onClick={onClose}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="side-menu-icon"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <span className="side-menu-text">{item.name}</span>
              </Link>
            ))}
          </div>
          </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SideMenu;