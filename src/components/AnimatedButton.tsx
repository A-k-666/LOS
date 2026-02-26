import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
}

export default function AnimatedButton({ children, className, onClick, type = 'button', disabled, title }: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
      title={title}
    >
      {children}
    </motion.button>
  );
}
