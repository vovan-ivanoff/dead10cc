import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Profile } from '../../api/auth';

interface RightIconsProps {
  handleLoginClick: () => void;
  onProfileUpdate?: (profile: Profile | null) => void;
}

const RightIcons: React.FC<RightIconsProps> = ({ 
  handleLoginClick
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => { 
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('authToken');
      setIsAuthenticated(!!newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="right-icons">
      <div className="flex flex-col items-center address">
        <Link href="/addresses" className="flex flex-col items-center">
          <Image
            src="/assets/icons/address.svg"
            alt="Адрес"
            width={15}
            height={30}
            className="cursor-pointer icon-base"
          />
          <span className="icon-label">Адреса</span>
        </Link>
      </div>

      <div className="flex flex-col items-center">
        {isAuthenticated ? (
          <Link href="/profile" className="flex flex-col items-center">
            <Image
              src="/assets/icons/user.svg"
              alt="Профиль"
              width={20}
              height={25}
              className="cursor-pointer icon-base"
            />
            <span className="icon-label">Профиль</span>
          </Link>
        ) : (
          <button
            onClick={handleLoginClick}
            className="flex flex-col items-center"
          >
            <Image
              src="/assets/icons/user.svg"
              alt="Авторизация"
              width={20}
              height={25}
              className="cursor-pointer icon-base"
            />
            <span className="icon-label">Войти</span>
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <Link href="/cart" className="flex flex-col items-center">
          <Image
            src="/assets/icons/trash.svg"
            alt="Корзина"
            width={20}
            height={25}
            className="cursor-pointer icon-base"
          />
          <span className="icon-label">Корзина</span>
        </Link>
      </div>
    </div>
  );
};

export default RightIcons;