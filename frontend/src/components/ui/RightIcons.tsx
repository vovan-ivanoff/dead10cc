import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Profile } from '../../api/auth';
import '../../styles/righticons.css';

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
      <Link href="/addresses" className="right-icon-item">
        <span className="icon-label">Адреса</span>
      </Link>

      {isAuthenticated ? (
        <Link href="/profile" className="right-icon-item">
          <span className="icon-label">Профиль</span>
        </Link>
      ) : (
        <button onClick={handleLoginClick} className="right-icon-item">
          <span className="icon-label">Войти</span>
        </button>
      )}

      <Link href="/cart" className="right-icon-item">
        <span className="icon-label">Корзина</span>
      </Link>
    </div>
  );
};

export default RightIcons;