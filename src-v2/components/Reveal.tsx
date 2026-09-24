import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li';
}

const TAGS = { div: m.div, li: m.li };

export default function Reveal({ children, className, delay = 0, y = 28, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];

  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

interface LineMaskProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Masked line reveal for display typography — text slides up from behind an overflow mask. */
export function LineMask({ children, delay = 0, className }: LineMaskProps) {
  const reduce = useReducedMotion();

  return (
    <span className={`block overflow-hidden ${className ?? ''}`}>
      <m.span
        className="block will-change-transform"
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </m.span>
    </span>
  );
}
