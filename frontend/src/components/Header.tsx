import Link from 'next/link';
import React from 'react';
import Container from './Container';
import '../app/globals.css';

const Header: React.FC = () => {
  return (
    <header className="w-full h-[115px] bg-gradient-to-t from-[#FF49D6] via-[#E93FDD] to-[#9012F3]">
      <Container>
        <div className="flex items-center justify-between py-10">
          {/* Логотип и кнопка */}
          <div className="flex items-center">
            <div className="flex-shrink-0 transform -translate-y-1">
              <Link href="/">
                <img
                  src="/logo.svg"
                  alt="Логотип"
                  className="h-[38px] w-[240px]"
                />
              </Link>
            </div>

            {/* Кнопка с квадратом */}
            <button className="ml-[18px] relative w-[60px] h-[60px] group appearance-none focus:outline-none min-w-[60px] min-h-[60px]">
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

          {/* Search bar с фиксированной шириной и отступом */}
          <div className="ml-[15px] w-[calc(100%-calc(230px*2)-60px-15px)]">
            <input
              type="text"
              placeholder="Найти на Wildberries"
              className="w-full h-[60px] rounded-[17px] bg-white focus:outline-none px-4 text-black text-[17px] font-sans font-regular"
              style={{ maxWidth: '1020px', minWidth: '250px' }}
            />
          </div>

          <div className="flex items-center ml-[25px] space-x-[25px]">
            <div className="flex flex-col items-center">
              <img src="/icons/address.svg" alt="Адрес" className="w-[30px] h-[30px] mb-[5px]" />
              <Link href="/addresses" className="text-white text-[14px] font-sans font-medium opacity-50 hover:opacity-100">
                Адреса
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/user.svg" alt="Авторизация" className="w-[20px] h-[20px] mb-[5px]" />
              <Link href="/login" className="text-white text-[14px] font-sans font-medium opacity-50 hover:opacity-100">
                Войти
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/trash.svg" alt="Корзина" className="w-[25px] h-[25px] mb-[5px]" />
              <Link href="/cart" className="text-white text-[14px] font-sans font-medium opacity-50 hover:opacity-100">
                Корзина
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
