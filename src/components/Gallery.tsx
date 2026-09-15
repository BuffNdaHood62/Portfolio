import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface GalleryProps {
  items: { src: string; caption: string }[];
}

export default function Gallery({ items }: GalleryProps) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-line">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={current.src}
            alt={current.caption}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[16/9] w-full object-cover"
          />
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`cap-${active}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-3 font-mono text-xs tracking-widest text-fog uppercase"
        >
          Fig. {String(active + 1).padStart(2, '0')} — {current.caption}
        </motion.p>
      </AnimatePresence>

      <div className="mt-6 flex gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}: ${item.caption}`}
            aria-current={i === active}
            className={`overflow-hidden rounded-md border transition-all ${
              i === active
                ? 'border-acid opacity-100'
                : 'border-line opacity-50 hover:opacity-90'
            }`}
          >
            <img src={item.src} alt="" className="aspect-video w-24 object-cover md:w-32" />
          </button>
        ))}
      </div>
    </div>
  );
}
