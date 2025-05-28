import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkAuth, Profile } from '../../api/auth';
import '../../styles/righticons.css';

interface RightIconsProps {
  handleLoginClick: () => void;
}

const RightIcons: React.FC<RightIconsProps> = ({ handleLoginClick }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await checkAuth();
        setProfile(user);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return null;

  return (
    <div className="right-icons">
      <Link href="/addresses" className="right-icon-item">
        <span className="icon-label">Адреса</span>
      </Link>

      {profile ? (
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
