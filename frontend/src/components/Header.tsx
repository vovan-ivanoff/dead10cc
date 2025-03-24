"use client";

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Container from './Container';
import AuthModal from './ui/AuthModal';
import SideMenu from './ui/SideMenu';
import { motion, AnimatePresence } from 'framer-motion';
import '../app/globals.css';
import '../app/header.css';
import { useZoom } from './hooks/useZoom';
import MenuButton from './ui/MenuButton';
import RightIcons from './ui/RightIcons';
import { sideMenuVariants } from '../lib/animation';

const Header: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isZoom200OrGreater, setIsZoom200OrGreater] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(100);

  useZoom();

  useEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) return;

    const checkZoom = () => {
      const zoomLevel = Math.round(window.devicePixelRatio * 100);
      setCurrentZoom(zoomLevel);
      setIsZoom200OrGreater(zoomLevel >= 200);
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkZoom();
        }
      }
    });

    observer.observe(headerElement, {
      attributes: true,
    });

    checkZoom();

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const headerElement = headerRef.current;
      if (!headerElement) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsSticky(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHeaderHeight = (zoom: number) => {
    switch (zoom) {
      case 200:
        return 64;
      default:
        return 114;
    }
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('overflow-hidden', isMenuOpen);
  };

  return (
    <div className="header-wrapper" id="header-wrapper">
      <header className="header" id="header" ref={headerRef} style={{
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? '0' : 'auto',
          left: isSticky ? '0' : 'auto',
          width: '100%',
          zIndex: isSticky ? 1000 : 'auto',
          height: isSticky ? '85px' : `${getHeaderHeight(currentZoom)}px`,
          padding: isSticky ? '0 0 0 0' : '20px 0 0 0',
          background: 'linear-gradient(to top, #FD48D7 10%, #7B07F8 90%)',
          boxShadow: isSticky ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'height 0.3s ease, padding 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
        }}>
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

              <MenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>

            <div className="flex-grow flex items-center">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Найти на Wildberries"
                  className="search-bar-input"
                  style={{ 
                    height: 'var(--search-bar-height)',
                  }}
                />
              </div>
            </div>

            <RightIcons isZoom200OrGreater={isZoom200OrGreater} handleLoginClick={handleLoginClick} />
          </div>
        </Container>
        <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sideMenuVariants}
            >
              <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default Header;