import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AmenityAnimatedIconProps {
  groupId: string;
}

/**
 * Thin (~1.25px stroke), subtly animated 64x64 fine-line icons illustrating each amenity module title.
 * Uses Leonardo House olive (#3A4F37) and warm brushed brass (#9A804B).
 */
export const AmenityAnimatedIcon: React.FC<AmenityAnimatedIconProps> = ({ groupId }) => {
  const prefersReduced = useReducedMotion();

  if (groupId === 'outdoor') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-16 h-16 shrink-0"
      >
        {/* Slowly rotating warm sun */}
        <motion.g
          style={{ originX: '44px', originY: '18px' }}
          animate={prefersReduced ? undefined : { rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="44" cy="18" r="6" stroke="#9A804B" strokeWidth="1.25" />
          <path
            d="M44 7.5V9.5M44 26.5V28.5M33.5 18H35.5M52.5 18H54.5M36.6 10.6L38 12M50 24L51.4 25.4M51.4 10.6L50 12M38 24L36.6 25.4"
            stroke="#9A804B"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Graceful olive branch framing left side of terrace/pool */}
        <motion.g
          style={{ originX: '14px', originY: '42px' }}
          animate={prefersReduced ? undefined : { rotate: [-2, 2.5, -2] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M12 41C14 31 18 22 25 14"
            stroke="#3A4F37"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M16 28C11.5 26 9.5 21.5 12 18C15.5 19.5 17 24 16 28Z"
            stroke="#3A4F37"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M19.5 22C24 21 27.5 23.5 26.5 27.5C22.5 27.5 19.8 25 19.5 22Z"
            stroke="#3A4F37"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M23.5 15.5C22.5 11.5 25 8.5 28.5 9.5C28 13.2 26 15.2 23.5 15.5Z"
            stroke="#3A4F37"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Gentle undulating pool water ripples */}
        <motion.path
          d="M10 46.5C14.5 44 19.5 44 24 46.5C28.5 49 33.5 49 38 46.5C42.5 44 47.5 44 52 46.5"
          stroke="#3A4F37"
          strokeWidth="1.3"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { x: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M14 53C18.5 50.8 23.5 50.8 28 53C32.5 55.2 37.5 55.2 42 53C46 51.2 49.5 51.2 53 52.8"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { x: [1.5, -1.5, 1.5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    );
  }

  if (groupId === 'kitchen') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-16 h-16 shrink-0"
      >
        {/* Rising delicate aroma wisps */}
        <motion.path
          d="M25 22C23.5 19.5 26.5 17.5 25 15"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { y: [1.5, -2.5, 1.5], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M32 20C30.5 17 33.5 14.5 32 11.5"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { y: [2, -3, 2], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 3.6, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M39 22C37.5 19.5 40.5 17.5 39 15"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { y: [1.5, -2.5, 1.5], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 3.2, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle gently lifted cloche dome */}
        <motion.g
          animate={prefersReduced ? undefined : { y: [0, -1.5, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="32" cy="25.5" r="2" stroke="#9A804B" strokeWidth="1.25" />
          <path
            d="M15 44C15 34.6 22.6 27.5 32 27.5C41.4 27.5 49 34.6 49 44"
            stroke="#3A4F37"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M21.5 39.5C22.8 35.5 26 32.5 30 31.5"
            stroke="#9A804B"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Dining platter & subtle fork/knife accents */}
        <path
          d="M10 47.5H54"
          stroke="#3A4F37"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M14 52H50"
          stroke="#9A804B"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    );
  }

  if (groupId === 'bedrooms-bathroom') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-16 h-16 shrink-0"
      >
        {/* Serene floating crescent moon & star */}
        <motion.path
          d="M46.5 11.5C43.5 12.2 41.5 15 42 18C42.5 21.2 45.5 23.2 48.6 22.7C49.6 22.5 50.5 22.1 51.2 21.5C49 21.7 46.8 20 46.4 17.6C46 15.2 47.1 12.9 49 11.8C48.2 11.5 47.4 11.4 46.5 11.5Z"
          stroke="#9A804B"
          strokeWidth="1.25"
          strokeLinejoin="round"
          animate={prefersReduced ? undefined : { y: [0, -2, 0], rotate: [-2, 3, -2] }}
          style={{ originX: '46px', originY: '17px' }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M36 13.5V16.5M34.5 15H37.5"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
          style={{ originX: '36px', originY: '15px' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Boutique double bed with arched headboard & soft pillows */}
        <path
          d="M14 38V24C14 21.8 15.8 20 18 20H32"
          stroke="#3A4F37"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M17 34V29.5C17 28.1 18.1 27 19.5 27H26.5C27.9 27 29 28.1 29 29.5V34"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M31 34V29.5C31 28.1 32.1 27 33.5 27H40.5C41.9 27 43 28.1 43 29.5V34"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M10 38C10 35.8 11.8 34 14 34H50C52.2 34 54 35.8 54 38V47H10V38Z"
          stroke="#3A4F37"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M14 47V52M50 47V52M10 41.5H54"
          stroke="#3A4F37"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (groupId === 'house-rules') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-16 h-16 shrink-0"
      >
        {/* Editorial house charter / stay rules frame */}
        <path
          d="M14 14C14 12.3 15.3 11 17 11H38C39.7 11 41 12.3 41 14V50C41 51.7 39.7 53 38 53H17C15.3 53 14 51.7 14 50V14Z"
          stroke="#FAF8F4"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        {/* Top binding notch */}
        <path
          d="M23.5 11V9.5C23.5 8.7 24.2 8 25 8H30C30.8 8 31.5 8.7 31.5 9.5V11"
          stroke="#D5C37E"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Delicate rule lines & subtle animated checkmarks */}
        <motion.path
          d="M19.5 22L21.5 24L25 20"
          stroke="#D5C37E"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={prefersReduced ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path
          d="M28 22.5H35.5"
          stroke="#D8DFD4"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <motion.path
          d="M19.5 31L21.5 33L25 29"
          stroke="#D5C37E"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={prefersReduced ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 3.4, delay: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path
          d="M28 31.5H35.5"
          stroke="#D8DFD4"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <path
          d="M20 40.5H33.5M20 45.5H29.5"
          stroke="#D8DFD4"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Gently swinging villa key symbolizing check-in/out & respectful stay */}
        <motion.g
          style={{ originX: '49px', originY: '19px' }}
          animate={prefersReduced ? undefined : { rotate: [-4, 4, -4] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="49" cy="23.5" r="4.5" stroke="#D5C37E" strokeWidth="1.25" />
          <circle cx="49" cy="23.5" r="1.2" stroke="#D5C37E" strokeWidth="1.1" />
          <path
            d="M49 28V48M49 41.5H53M49 45.5H52"
            stroke="#FAF8F4"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Subtle sparkle accent */}
        <motion.path
          d="M49 11.5V14.5M47.5 13H50.5"
          stroke="#D5C37E"
          strokeWidth="1.15"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
          style={{ originX: '49px', originY: '13px' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    );
  }

  if (groupId === 'location') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-16 h-16 shrink-0"
      >
        {/* Subtle Istrian hillside & coastal horizon lines */}
        <path
          d="M10 47C17 43 24 43 32 46.5C40 50 47 49 54 45.5"
          stroke="#3A4F37"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M15 52.5C22.5 49.8 30 50.2 38 52.5C43.5 54 48.5 53.5 53 51.5"
          stroke="#9A804B"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Expanding subtle brass location pulse under the pin */}
        <motion.ellipse
          cx="32"
          cy="43.5"
          rx="8"
          ry="2.6"
          stroke="#9A804B"
          strokeWidth="1.2"
          animate={
            prefersReduced
              ? undefined
              : { scale: [0.82, 1.28, 0.82], opacity: [0.85, 0.25, 0.85] }
          }
          style={{ originX: '32px', originY: '43.5px' }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Gently floating fine-line architectural location pin */}
        <motion.g
          animate={prefersReduced ? undefined : { y: [0, -2.5, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M32 12C24.8 12 19 17.7 19 24.8C19 33.4 29.2 41.2 31.3 42.7C31.7 43 32.3 43 32.7 42.7C34.8 41.2 45 33.4 45 24.8C45 17.7 39.2 12 32 12Z"
            stroke="#3A4F37"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="24.5" r="4.5" stroke="#9A804B" strokeWidth="1.25" />
          <circle cx="32" cy="24.5" r="1.3" fill="#9A804B" />
        </motion.g>

        {/* Subtle compass star accent */}
        <motion.path
          d="M50 15.5V19.5M48 17.5H52"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
          style={{ originX: '50px', originY: '17.5px' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    );
  }

  if (groupId === 'booking') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-16 h-16 shrink-0"
      >
        {/* Outer fine-line reservation calendar frame */}
        <path
          d="M12 19C12 16.8 13.8 15 16 15H48C50.2 15 52 16.8 52 19V48C52 50.2 50.2 52 48 52H16C13.8 52 12 50.2 12 48V19Z"
          stroke="#3A4F37"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M12 24.5H52"
          stroke="#3A4F37"
          strokeWidth="1.2"
        />

        {/* Binding rings */}
        <path
          d="M22.5 10.5V17.5M41.5 10.5V17.5"
          stroke="#9A804B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />

        {/* Minimalist month grid accents */}
        <path
          d="M21 31.5H23M31 31.5H33M41 31.5H43M21 38.5H23M21 45.5H23M31 45.5H33M41 45.5H43"
          stroke="#3A4F37"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Gently pulsing selected stay dates */}
        <motion.rect
          x="28"
          y="35"
          width="17.5"
          height="7"
          rx="3.5"
          stroke="#9A804B"
          strokeWidth="1.25"
          style={{ originX: '36.75px', originY: '38.5px' }}
          animate={prefersReduced ? undefined : { opacity: [0.65, 1, 0.65], scale: [0.97, 1.03, 0.97] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Delicate sparkle accent over date selection */}
        <motion.path
          d="M52.5 10V13.5M50.75 11.75H54.25"
          stroke="#9A804B"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={prefersReduced ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
          style={{ originX: '52.5px', originY: '11.75px' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    );
  }

  // 'family-comfort' — Villa home, climate comfort & seamless Wi-Fi connectivity
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-16 h-16 shrink-0"
    >
      {/* Subtle radiating Wi-Fi / comfort waves above villa roof */}
      <motion.path
        d="M23 19.5C28 15 36 15 41 19.5"
        stroke="#9A804B"
        strokeWidth="1.2"
        strokeLinecap="round"
        animate={prefersReduced ? undefined : { opacity: [0.3, 1, 0.3], y: [1, -1, 1] }}
        transition={{ duration: 3, delay: 0.35, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M18.5 14.5C26 8.5 38 8.5 45.5 14.5"
        stroke="#9A804B"
        strokeWidth="1.15"
        strokeLinecap="round"
        animate={prefersReduced ? undefined : { opacity: [0.2, 0.9, 0.2], y: [1.5, -1, 1.5] }}
        transition={{ duration: 3, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Thin villa roofline & welcoming doorway */}
      <path
        d="M12 34L32 19L52 34"
        stroke="#3A4F37"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 30.5V52H47V30.5"
        stroke="#3A4F37"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Warm gently pulsing heart symbolizing family comfort & hospitality */}
      <motion.path
        d="M32 45.5C32 45.5 24.5 40.8 24.5 35.8C24.5 33.6 26.2 32 28.3 32C29.8 32 31.1 32.8 32 34.1C32.9 32.8 34.2 32 35.7 32C37.8 32 39.5 33.6 39.5 35.8C39.5 40.8 32 45.5 32 45.5Z"
        stroke="#9A804B"
        strokeWidth="1.25"
        strokeLinejoin="round"
        style={{ originX: '32px', originY: '38px' }}
        animate={prefersReduced ? undefined : { scale: [1, 1.09, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
};
