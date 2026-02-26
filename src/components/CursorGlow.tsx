import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [visible, setVisible] = useState(false);

  const springX = useSpring(0, { stiffness: 150, damping: 15 });
  const springY = useSpring(0, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [visible, springX, springY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] rounded-full"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, hsl(183 58% 50% / 0.08) 0%, transparent 70%)',
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
