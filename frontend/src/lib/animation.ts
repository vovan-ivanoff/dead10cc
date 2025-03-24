import { Variants } from 'framer-motion';

export const menuIconVariants: Variants = {
  open: {
    rotate: 0,
    y: 3,
    transition: { duration: 0.2 },
  },
  closed: {
    rotate: 0,
    y: 0,
    transition: { duration: 0.2 },
  },
};

export const lineVariants: Variants = {
  open: (custom: number) => ({
    opacity: custom === 1 ? 0 : 1,
    y: custom === 0 ? 2 : custom === 2 ? -6 : 0,
    rotate: custom === 0 ? 45 : custom === 2 ? -45 : 0,
    transition: { duration: 0.2 },
  }),
  closed: (custom: number) => ({
    opacity: 1,
    y: custom === 0 ? -6 : custom === 2 ? 6 : 0,
    rotate: 0,
    transition: { duration: 0.2 },
  }),
};

export const sideMenuVariants: Variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30, ease: 'easeInOut' },
  },
  closed: {
    x: '-100%',
    opacity: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30, ease: 'easeInOut' },
  },
};