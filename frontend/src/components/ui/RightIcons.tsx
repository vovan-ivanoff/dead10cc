import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RightIconsProps {
  isZoom200OrGreater: boolean;
  handleLoginClick: () => void;
}

const RightIcons: React.FC<RightIconsProps> = ({ isZoom200OrGreater, handleLoginClick }) => {
  const [profile, setProfile] = useState<{ id: string; phone: string } | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  return (
    <div className="right-icons">
      <div className="flex flex-col items-center address">
        <Link href="/addresses" className="flex flex-col items-center">
          <Image
            src="/icons/address.svg"
            alt="Адрес"
            width={15}
            height={30}
            className="cursor-pointer"
          />
          {!isZoom200OrGreater && (
            <span className="mt-[0.5rem] text-white text-[0.875rem] font-hauss font-medium opacity-50 hover:opacity-100">
              Адреса
            </span>
          )}
        </Link>
      </div>

      {!isZoom200OrGreater && (
        <>
          <div className="flex flex-col items-center">
            {profile ? (
              <Link href="/profile" className="flex flex-col items-center">
                <Image
                  src="/icons/user.svg"
                  alt="Профиль"
                  width={20}
                  height={25}
                  className="cursor-pointer"
                />
                <span className="mt-[0.5rem] text-white text-[0.875rem] font-hauss font-medium opacity-50 hover:opacity-100">
                  Профиль
                </span>
              </Link>
            ) : (
              <button
                onClick={handleLoginClick}
                className="flex flex-col items-center"
              >
                <Image
                  src="/icons/user.svg"
                  alt="Авторизация"
                  width={20}
                  height={25}
                  className="cursor-pointer"
                />
                <span className="mt-[0.5rem] text-white text-[0.875rem] font-hauss font-medium opacity-50 hover:opacity-100">
                  Войти
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-center">
            <Link href="/cart" className="flex flex-col items-center">
              <Image
                src="/icons/trash.svg"
                alt="Корзина"
                width={20}
                height={25}
                className="cursor-pointer"
              />
              <span className="mt-[0.5rem] text-white text-[0.875rem] font-hauss font-medium opacity-50 hover:opacity-100">
                Корзина
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default RightIcons;