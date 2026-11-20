import React, { useEffect, useRef, useState } from 'react';

interface CardHoverOliveBorderProps {
  borderRadius?: number;
  strokeWidth?: number;
  color?: string;
}

/**
 * Traces the exact rounded outer perimeter of a card clockwise on group hover/focus
 * with perfectly uniform line thickness along all 4 edges and corners.
 */
export const CardHoverOliveBorder: React.FC<CardHoverOliveBorderProps> = ({
  borderRadius = 16,
  strokeWidth = 1.5,
  color = '#3A4F37',
}) => {
  const hostRef = useRef<SVGSVGElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const svg = hostRef.current;
    if (!svg) return;

    const measure = () => {
      const rect = svg.getBoundingClientRect();
      const w = Math.round(rect.width * 2) / 2;
      const h = Math.round(rect.height * 2) / 2;
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  const half = strokeWidth / 2;
  const rectW = Math.max(0, size.w - strokeWidth);
  const rectH = Math.max(0, size.h - strokeWidth);
  const rx = Math.max(0, borderRadius - half);

  return (
    <svg
      ref={hostRef}
      aria-hidden="true"
      viewBox={size.w > 0 && size.h > 0 ? `0 0 ${size.w} ${size.h}` : undefined}
      className="pointer-events-none absolute -inset-px w-[calc(100%+2px)] h-[calc(100%+2px)] z-20"
    >
      {rectW > 0 && rectH > 0 && (
        <rect
          x={half}
          y={half}
          width={rectW}
          height={rectH}
          rx={rx}
          ry={rx}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          pathLength={1000}
          strokeDasharray={1002}
          className="[stroke-dashoffset:1002] group-hover:[stroke-dashoffset:0] group-focus-within:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-700 ease-in-out"
        />
      )}
    </svg>
  );
};
