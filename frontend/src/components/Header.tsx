"use client";

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import Container from './Container';
import AuthModal from './ui/AuthModal';
import SideMenu from './ui/SideMenu';
import '../app/globals.css';
import '../app/header.css';

const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Состояние для модального окна
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для меню

  const handleLoginClick = () => {
    setIsAuthModalOpen(true); // Открываем модальное окно
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false); // Закрываем модальное окно
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Переключение видимости меню
  };

  return (
    <header className="header">
      <Container>
        <div className="flex items-center justify-between py-10">
          <div className="logo-menu">
            <div className="flex-shrink-0 transform -translate-y-1">
              <Link href="/">
                <Image
                  src="/logos/logo.svg"
                  alt="Логотип"
                  width={240}
                  height={38}
                />
              </Link>
            </div>

            <button 
              onClick={toggleMenu}
              className="ml-[18px] relative w-[60px] h-[60px] group appearance-none focus:outline-none min-w-[60px] min-h-[60px]">
              <div
                className="w-full h-full rounded-[15px] border border-white opacity-35 group-hover:opacity-100 transition-opacity"
                style={{ borderWidth: '1px' }}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-[25px] h-[3px] bg-white rounded-full" />
                <div className="w-[25px] h-[3px] bg-white rounded-full mt-[6px]" />
                <div className="w-[25px] h-[3px] bg-white rounded-full mt-[6px]" />
              </div>
            </button>
          </div>

          <div className="flex-grow flex items-center ml-[15px]">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Найти на Wildberries"
                className="w-full h-[60px] rounded-[17px] bg-white focus:outline-none px-4 text-black text-[1rem] font-sans font-regular"
              />
            </div>
          </div>

          <div className="right-icons">
            <div className="flex flex-col items-center address">
              <Image
                  src="/icons/address.svg"
                  alt="Адрес"
                  width={20}
                  height={30}
                />
              <Link href="/addresses" className="mt-[0.5rem] text-white text-[0.875rem] font-hauss font-medium opacity-50 hover:opacity-100">
                Адреса
              </Link>
            </div>

            <div className="flex flex-col items-center" onClick={handleLoginClick}>
              <Image
                  src="/icons/user.svg"
                  alt="Авторизация"
                  width={25}
                  height={25}
                />
              <button className="mt-[0.5rem] text-white text-[0.875rem] font-hauss font-medium opacity-50 hover:opacity-100">
                Войти
              </button>
            </div>

            <div className="flex flex-col items-center">
              <Image
                  src="/icons/trash.svg"
                  alt="Корзина"
                  width={25}
                  height={25}
                />
              <Link href="/cart" className="mt-[0.5rem] text-white text-[0.875rem] font-hauss font-medium opacity-50 hover:opacity-100">
                Корзина
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />

      {isMenuOpen && <SideMenu onClose={toggleMenu} />}
    </header>
  );
};

export default Header;
