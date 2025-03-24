import React from 'react';
import { motion } from 'framer-motion';
import { menuIconVariants, lineVariants } from '../../lib/animation';

interface MenuButtonProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <button 
      onClick={toggleMenu}
      className="ml-[18px] relative w-[60px] h-[60px] group appearance-none focus:outline-none min-w-[60px] min-h-[60px]"
    >
      <div
        className="w-full h-full rounded-[15px] border border-white opacity-35 group-hover:opacity-100 transition-opacity"
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
            className="w-[30px] h-[3px] bg-white rounded-full absolute left-[-3px] transform -translate-x-1/2"
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