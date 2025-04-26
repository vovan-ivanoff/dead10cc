import React from 'react';
import { motion } from 'framer-motion';
import { menuIconVariants, lineVariants } from '../../lib/animation';
import '../../styles/sidemenu.css';

interface MenuButtonProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isAnimating: boolean;
  className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
  isMenuOpen, 
  toggleMenu,
  isAnimating,
  className = ''
}) => {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAnimating) {
      toggleMenu();
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`ml-[18px] relative w-[60px] h-[60px] group appearance-none focus:outline-none min-w-[60px] min-h-[60px] ${className}`}
      disabled={isAnimating}
    >
      <div
        className="w-full h-full rounded-[15px] border border-black opacity-35 group-hover:opacity-100 transition-opacity"
        style={{ borderWidth: '1px' }}
      />
      <motion.div
        className="absolute top-7 left-[19px] transform -translate-x-1/2 -translate-y-1/2"
        variants={menuIconVariants}
        animate={isMenuOpen ? 'open' : 'closed'}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-[30px] h-[3px] bg-black rounded-full absolute left-[-3px] transform -translate-x-1/2"
            variants={lineVariants}
            custom={index}
            style={{
              top: `${index * 4 - 4}px`,
              borderRadius: '50px',
            }}
          />
        ))}
      </motion.div>
    </button>
  );
};

export default MenuButton;