"use client";

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Container from './Container';
import AuthModal from '../ui/AuthModal';
import RightIcons from '../ui/RightIcons';
import '../../styles/globals.css';
import '../../styles/header.css';

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 0 && !isSticky) {
        setIsSticky(true);
      } else if (scrollPosition === 0 && isSticky) {
        setIsSticky(false);
      }
    };

    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, [isSticky]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isAuthModalOpen);
  }, [isAuthModalOpen]);

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      {isSticky && <div style={{ height: headerRef.current?.offsetHeight || '114px' }} />}
      
      <div 
        className={`header-wrapper ${isSticky ? 'sticky' : ''}`}
        ref={headerRef}
      >
        <header className="header">
          <div className="header-container">
            <Container>
            <div className="header-left">
              <Link href="/" className="logo-link">
                {/* Основное лого */}
                <Image
                  src="/assets/images/logos/logo.svg"
                  alt="Логотип"
                  width={160}
                  height={1}
                  className="logo-image logo-default"
                  style={{ height: 'auto' }}
                  priority
                />
                {/* Лого при наведении */}
                <Image
                  src="/assets/images/logos/logosyh.svg"
                  alt="Логотип"
                  width={160}
                  height={1}
                  className="logo-image logo-hover"
                  style={{ height: 'auto' }}
                  priority
                />
              </Link>
            </div>

              <div className="search-wrapper">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Найти на Snaply"
                    className="search-input"
                    aria-label="Поиск по сайту"
                  />
                </div>
              </div>
              <div>
                <RightIcons handleLoginClick={handleLoginClick} />
              </div>
            </Container>
          </div>

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        </header>
      </div>
    </>
  );
};

export default Header;
