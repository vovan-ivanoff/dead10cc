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
import MenuButton from './ui/MenuButton';
import RightIcons from './ui/RightIcons';
import { sideMenuVariants } from '../lib/animation';

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;
  
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > 0 && !isSticky) {
        setIsSticky(true);
      } 
      else if (scrollPosition === 0 && isSticky) {
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('overflow-hidden', !isMenuOpen);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
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
                  <Image
                    src="/logos/logo.svg"
                    alt="Логотип"
                    width={240}
                    height={38}
                    className="logo-image"
                    priority
                  />
                </Link>
                <MenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
              </div>

              <div className="search-wrapper">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Найти на Wildberries"
                    className="search-input"
                  />
                </div>
              </div>

              <div className="header-right">
                <RightIcons handleLoginClick={() => setIsAuthModalOpen(true)} />
              </div>
            </Container>
          </div>
          
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onAuthSuccess={handleAuthSuccess}  
          />

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideMenuVariants}
              >
                <SideMenu 
                  isOpen={isMenuOpen} 
                  onClose={toggleMenu}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>
    </>
  );
};

export default Header;