import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
}

/** Draggable before/after image comparison. */
export default function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  caption,
}: BeforeAfterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - 4));
    if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + 4));
  };

  return (
    <div>
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        className="relative touch-none overflow-hidden rounded-lg border border-line select-none"
        role="slider"
        aria-label="Before and after comparison"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        <img src={after} alt={afterLabel} className="aspect-[3/2] w-full object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img
            src={before}
            alt={beforeLabel}
            className="aspect-[3/2] w-full object-cover grayscale"
            draggable={false}
          />
        </div>

        <span className="absolute top-4 left-4 rounded-full bg-base/80 px-3 py-1 font-mono text-[0.65rem] tracking-widest text-ink uppercase backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-acid px-3 py-1 font-mono text-[0.65rem] tracking-widest text-base uppercase">
          {afterLabel}
        </span>

        {/* handle */}
        <div
          className="absolute inset-y-0 w-px bg-acid"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-acid font-mono text-xs text-base shadow-[0_0_20px_rgba(204,255,0,0.4)]">
            ↔
          </div>
        </div>
      </div>
      {caption && (
        <p className="mt-3 font-mono text-xs tracking-widest text-fog uppercase">{caption}</p>
      )}
    </div>
  );
}
