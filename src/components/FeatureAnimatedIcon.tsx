import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface FeatureAnimatedIconProps {
  index: number;
  isActive?: boolean;
}

/**
 * Fine-line (~1.25px effective rendered stroke at 52x52px), subtly animated icons
 * matching each of the 6 "Why Leonardo House" feature pillars.
 */
export const FeatureAnimatedIcon: React.FC<FeatureAnimatedIconProps> = ({
  index,
  isActive = false,
}) => {
  const prefersReduced = useReducedMotion();

  switch (index) {
    // 01. Heated outdoor pool & poolside shower
    case 0:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-[52px] h-[52px] shrink-0"
        >
          <motion.g
            style={{ originX: '12px', originY: '8.5px' }}
            animate={prefersReduced ? undefined : { rotate: 360 }}
            transition={{ duration: isActive ? 18 : 28, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="12" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="0.6" />
            <path
              d="M12 3.5V4.5M12 12.5V13.5M7 8.5H8M16 8.5H17M8.5 5L9.2 5.7M14.8 11.3L15.5 12M15.5 5L14.8 5.7M9.2 11.3L8.5 12"
              stroke="currentColor"
              strokeWidth="0.56"
              strokeLinecap="round"
            />
          </motion.g>
          <motion.path
            d="M3.5 16.5C5.2 15.2 7 15.2 8.7 16.5C10.4 17.8 12.2 17.8 13.9 16.5C15.6 15.2 17.4 15.2 20.5 16.5"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinecap="round"
            animate={prefersReduced ? undefined : { x: [-0.9, 0.9, -0.9] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M5 19.8C6.7 18.7 8.4 18.7 10.1 19.8C11.8 20.9 13.5 20.9 15.2 19.8C16.8 18.8 18.2 18.8 19.5 19.6"
            stroke="currentColor"
            strokeWidth="0.56"
            strokeLinecap="round"
            opacity="0.78"
            animate={prefersReduced ? undefined : { x: [0.9, -0.9, 0.9] }}
            transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      );

    // 02. Two separate villas / houses for complete privacy
    case 1:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-[52px] h-[52px] shrink-0"
        >
          {/* Main house (left) */}
          <path
            d="M2.5 12.5L8.5 7L14.5 12.5"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.2 11V19.5H12.8V11"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.rect
            x="7.3"
            y="14"
            width="2.4"
            height="2.8"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="0.55"
            animate={prefersReduced ? undefined : { opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Smaller guest house (right) */}
          <motion.g
            animate={prefersReduced ? undefined : { y: [0, -0.7, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M13.5 14L17.5 10.5L21.5 14"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.8 13V19.5H20.2V13"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        </svg>
      );

    // 03. Covered terrace & wood-fired fireplace / grill
    case 2:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-[52px] h-[52px] shrink-0"
        >
          {/* Warm rising aroma / ember wisps */}
          <motion.path
            d="M9 7.8C8.4 6.7 9.6 5.8 9 4.5"
            stroke="currentColor"
            strokeWidth="0.56"
            strokeLinecap="round"
            animate={prefersReduced ? undefined : { y: [0.8, -1.2, 0.8], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M12 7C11.4 5.7 12.6 4.7 12 3.3"
            stroke="currentColor"
            strokeWidth="0.56"
            strokeLinecap="round"
            animate={prefersReduced ? undefined : { y: [1, -1.4, 1], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 3.1, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M15 7.8C14.4 6.7 15.6 5.8 15 4.5"
            stroke="currentColor"
            strokeWidth="0.56"
            strokeLinecap="round"
            animate={prefersReduced ? undefined : { y: [0.8, -1.2, 0.8], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.8, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Gently flickering flame over stone hearth */}
          <motion.path
            d="M12 9.5C12 9.5 15.2 12.3 15.2 14.8C15.2 16.6 13.8 18 12 18C10.2 18 8.8 16.6 8.8 14.8C8.8 12.3 12 9.5 12 9.5Z"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinejoin="round"
            style={{ originX: '12px', originY: '17px' }}
            animate={prefersReduced ? undefined : { scaleY: [0.94, 1.07, 0.94], scaleX: [1.03, 0.96, 1.03] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <path
            d="M5 20.5H19"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </svg>
      );

    // 04. Estate olive grove & homemade olive oil tasting
    case 3:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-[52px] h-[52px] shrink-0"
        >
          {/* Gently swaying olive sprig */}
          <motion.g
            style={{ originX: '6px', originY: '19px' }}
            animate={prefersReduced ? undefined : { rotate: [-4, 4, -4] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M5.5 19.5C8 14.5 12.5 9.5 18.5 5"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
            <path
              d="M9.2 12.8C6.6 11.7 5.6 9.3 7 7.4C9.2 8.2 9.9 10.6 9.2 12.8Z"
              stroke="currentColor"
              strokeWidth="0.58"
              strokeLinejoin="round"
            />
            <path
              d="M13 10C15.7 9.4 17.8 10.9 17.2 13.3C14.8 13.4 13.2 12 13 10Z"
              stroke="currentColor"
              strokeWidth="0.58"
              strokeLinejoin="round"
            />
            <path
              d="M16.2 6.8C15.5 4.5 17.1 2.8 19.3 3.4C19.1 5.6 17.8 6.7 16.2 6.8Z"
              stroke="currentColor"
              strokeWidth="0.56"
              strokeLinejoin="round"
            />
          </motion.g>
          {/* Delicate olive / golden oil droplet */}
          <motion.circle
            cx="11.5"
            cy="15.8"
            r="1.9"
            stroke="currentColor"
            strokeWidth="0.58"
            animate={prefersReduced ? undefined : { scale: [0.92, 1.08, 0.92] }}
            style={{ originX: '11.5px', originY: '15.8px' }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      );

    // 05. Family comfort & children's play corner
    case 4:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-[52px] h-[52px] shrink-0"
        >
          {/* Warm pulsing family heart */}
          <motion.path
            d="M12 19.8C12 19.8 5 15.2 5 10.3C5 7.9 6.8 6.2 9 6.2C10.4 6.2 11.4 7 12 8.2C12.6 7 13.6 6.2 15 6.2C17.2 6.2 19 7.9 19 10.3C19 15.2 12 19.8 12 19.8Z"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinejoin="round"
            style={{ originX: '12px', originY: '13px' }}
            animate={prefersReduced ? undefined : { scale: [1, 1.08, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Playful floating star sparkle */}
          <motion.path
            d="M18.5 3.8V6.2M17.3 5H19.7"
            stroke="currentColor"
            strokeWidth="0.56"
            strokeLinecap="round"
            animate={prefersReduced ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
            style={{ originX: '18.5px', originY: '5px' }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      );

    // 06. Covered parking & base for exploring Istria
    case 5:
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-[52px] h-[52px] shrink-0"
        >
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="0.6" />
          <motion.g
            style={{ originX: '12px', originY: '12px' }}
            animate={prefersReduced ? undefined : { rotate: [-10, 14, -10] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M15.2 8.8L13.3 13.3L8.8 15.2L10.7 10.7L15.2 8.8Z"
              stroke="currentColor"
              strokeWidth="0.58"
              strokeLinejoin="round"
            />
          </motion.g>
          <circle cx="12" cy="12" r="0.9" fill="currentColor" />
        </svg>
      );
  }
};
