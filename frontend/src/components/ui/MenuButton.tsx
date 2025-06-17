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
      className={`ml-[5px] mr-[15px] relative w-[60px] h-[60px] group appearance-none focus:outline-none min-w-[60px] min-h-[60px] ${className}`}
      disabled={isAnimating}
    >
      <div
        className={`w-full h-full rounded-[15px] border-[2px] transition-all duration-300 ${
          isMenuOpen || 'group-hover:border-transparent'
        } ${
          isMenuOpen || 'group-hover:bg-gradient-to-br from-[#6A11CB] to-[#2575FC]'
        }`}
      >
        <div className={`w-full h-full rounded-[14px] ${
          isMenuOpen ? 'bg-white' : 
          'group-hover:bg-white bg-transparent'
        }`} />
      </div>
      
      <motion.div
        className="absolute top-7 left-[19px] transform -translate-x-1/2 -translate-y-1/2"
        variants={menuIconVariants}
        animate={isMenuOpen ? 'open' : 'closed'}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`w-[30px] h-[3px] rounded-full absolute left-[-3px] transform -translate-x-1/2 ${
              isMenuOpen || 'group-hover:bg-gradient-to-r from-[#6A11CB] to-[#2575FC]'
            }`}
            variants={lineVariants}
            custom={index}
            style={{
              top: `${index * 4 - 4}px`,
              background: isMenuOpen 
                ? 'linear-gradient(105deg, #6A11CB 0%, #2575FC 100%)' 
                : 'black',
            }}
          />
        ))}
      </motion.div>
    </button>
  );
};

export default MenuButton;