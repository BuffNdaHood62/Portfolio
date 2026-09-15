import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      const nearContact = document.getElementById('contact')?.getBoundingClientRect().top ?? Infinity;
      setVisible(past && nearContact > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-acid px-5 py-3 font-mono text-xs font-medium tracking-widest text-base uppercase shadow-[0_8px_30px_rgba(204,255,0,0.25)] transition-transform hover:scale-105 md:right-8 md:bottom-8"
        >
          Start a project
          <span aria-hidden>→</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
