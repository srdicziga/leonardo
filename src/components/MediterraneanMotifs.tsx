import React, { useId } from 'react';

interface OliveBranchDecorationProps {
  className?: string;
  edge?: 'left' | 'right';
  variant?: 'fruiting' | 'harvest';
  tone?: 'atelier' | 'gilded';
}

/**
 * Atelier-grade Mediterranean botanical filigree ornament.
 * Combines brushed champagne-gold engraving, double hairline architectural corner framing,
 * slender velvet-olive and gold-foil lanceolate leaves with central vein etchings,
 * and jewel-sculpted olives catching the Istrian light.
 */
export const SwayingOliveBranch: React.FC<OliveBranchDecorationProps> = ({
  className = 'w-72 h-36',
  edge = 'right',
  variant = 'fruiting',
  tone = 'atelier',
}) => {
  const rawId = useId();
  const uid = rawId.replace(/:/g, '');
  const isRight = edge === 'right';
  const isGilded = tone === 'gilded';
  const isHarvest = variant === 'harvest';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${
        isRight
          ? 'right-0 animate-olive-sway-right origin-right'
          : 'left-0 animate-olive-sway origin-left'
      } ${className}`}
    >
      <svg
        viewBox="0 0 340 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible ${isRight ? '' : '-scale-x-100'}`}
      >
        <defs>
          {/* Champagne-Gold Architectural Metalwork */}
          <linearGradient id={`${uid}-gold-stem`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isGilded ? '#F4E7BC' : '#D5BD79'} />
            <stop offset="50%" stopColor={isGilded ? '#CFB46A' : '#9C803F'} />
            <stop offset="100%" stopColor={isGilded ? '#9C7F3B' : '#6F5824'} />
          </linearGradient>

          {/* Primary Leaf Finish */}
          <linearGradient id={`${uid}-leaf-primary`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isGilded ? '#F5EAC4' : '#587152'} />
            <stop offset="55%" stopColor={isGilded ? '#D8BF76' : '#3A4F37'} />
            <stop offset="100%" stopColor={isGilded ? '#9F8340' : '#253523'} />
          </linearGradient>

          {/* Secondary Shimmering Gold-Foil Leaf Finish */}
          <linearGradient id={`${uid}-leaf-foil`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isGilded ? '#FFF6D8' : '#EFE1B1'} />
            <stop offset="50%" stopColor={isGilded ? '#DFC67F' : '#C5AA63'} />
            <stop offset="100%" stopColor={isGilded ? '#A88A43' : '#8A6F32'} />
          </linearGradient>

          {/* Jewel-Sculpted Olive Finishes */}
          <radialGradient id={`${uid}-olive-gold`} cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFF8DB" />
            <stop offset="35%" stopColor="#DEC272" />
            <stop offset="78%" stopColor="#9B7E38" />
            <stop offset="100%" stopColor="#5D491B" />
          </radialGradient>

          <radialGradient id={`${uid}-olive-emerald`} cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor={isGilded ? '#E7DCB2' : '#95AF83'} />
            <stop offset="45%" stopColor={isGilded ? '#96A672' : '#4B6342'} />
            <stop offset="100%" stopColor={isGilded ? '#465636' : '#22311E'} />
          </radialGradient>

          {/* Ambient Foil Halo */}
          <radialGradient id={`${uid}-halo`} cx="82%" cy="32%" r="60%">
            <stop offset="0%" stopColor="#D8BE72" stopOpacity={isGilded ? '0.18' : '0.14'} />
            <stop offset="100%" stopColor="#D8BE72" stopOpacity="0" />
          </radialGradient>

          <filter id={`${uid}-drop`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              floodColor={isGilded ? '#0A1008' : '#1E251F'}
              floodOpacity={isGilded ? '0.35' : '0.14'}
            />
          </filter>
        </defs>

        {/* Soft Sun-Gilded Atelier Glow */}
        <ellipse cx="260" cy="54" rx="125" ry="62" fill={`url(#${uid}-halo)`} />

        {/* Architectural Double Hairline Corner Frame & Compass Star Finial */}
        <g opacity={isGilded ? '0.68' : '0.58'}>
          <path
            d="M340 16 L186 16"
            stroke={`url(#${uid}-gold-stem)`}
            strokeWidth="0.75"
            strokeDasharray="1 0"
          />
          <path
            d="M340 21 L226 21"
            stroke={`url(#${uid}-gold-stem)`}
            strokeWidth="0.5"
            strokeOpacity="0.65"
          />
          {/* Sculpted 4-Point Diamond Star Finial */}
          <path
            d="M174 16 L178.5 14.5 L180 10 L181.5 14.5 L186 16 L181.5 17.5 L180 22 L178.5 17.5 Z"
            fill={`url(#${uid}-leaf-foil)`}
          />
          <circle cx="158" cy="16" r="1.15" fill={`url(#${uid}-gold-stem)`} opacity="0.75" />
          <circle cx="144" cy="16" r="0.8" fill={`url(#${uid}-gold-stem)`} opacity="0.5" />
        </g>

        <g filter={`url(#${uid}-drop)`}>
          {/* Main Sweeping Gilded Stem emerging flush from edge (x=340) */}
          <path
            d={
              isHarvest
                ? 'M340 46 C284 42 214 58 148 88 C108 106 72 114 38 112'
                : 'M340 50 C282 48 212 66 136 96 C96 112 64 118 32 114'
            }
            stroke={`url(#${uid}-gold-stem)`}
            strokeWidth="2.1"
            strokeLinecap="round"
          />

          {/* Secondary Upper Graceful Arching Shoot */}
          <path
            d={
              isHarvest
                ? 'M262 49 C226 30 176 22 116 32'
                : 'M252 52 C216 32 164 26 98 38'
            }
            stroke={`url(#${uid}-gold-stem)`}
            strokeWidth="1.35"
            strokeLinecap="round"
          />

          {/* Delicate Lower Tendril */}
          <path
            d="M196 74 C166 96 134 116 88 128"
            stroke={`url(#${uid}-gold-stem)`}
            strokeWidth="1.05"
            strokeLinecap="round"
          />

          {/* Upper Spray: Alternating Velvet Emerald & Brushed Gold-Foil Leaves */}
          <g>
            <path
              d="M286 48 C272 26 244 16 218 24 C240 38 264 46 286 48 Z"
              fill={`url(#${uid}-leaf-primary)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.75"
            />
            <path d="M282 46 C260 35 240 29 221 25" stroke="#DFCA86" strokeWidth="0.55" strokeOpacity="0.8" />

            <path
              d="M230 37 C210 18 182 12 158 22 C180 32 206 38 230 37 Z"
              fill={`url(#${uid}-leaf-foil)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.7"
            />
            <path d="M226 36 C204 26 184 22 162 23" stroke="#FFF8DC" strokeWidth="0.5" strokeOpacity="0.7" />

            <path
              d="M174 30 C150 14 120 14 96 28 C122 36 148 36 174 30 Z"
              fill={`url(#${uid}-leaf-primary)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.75"
            />
            <path d="M170 29 C146 24 124 24 100 28" stroke="#DFCA86" strokeWidth="0.55" strokeOpacity="0.8" />

            <path
              d="M120 34 C96 24 72 28 54 42 C78 46 100 42 120 34 Z"
              fill={`url(#${uid}-leaf-foil)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.65"
            />
          </g>

          {/* Lower Spray: Sculpted Lanceolate Leaves with Fine Midrib Etching */}
          <g>
            <path
              d="M298 52 C280 76 254 90 226 86 C246 72 272 60 298 52 Z"
              fill={`url(#${uid}-leaf-foil)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.7"
            />
            <path d="M294 54 C272 68 252 78 230 85" stroke="#FFF8DC" strokeWidth="0.5" strokeOpacity="0.7" />

            <path
              d="M240 62 C220 88 194 102 166 98 C186 82 214 70 240 62 Z"
              fill={`url(#${uid}-leaf-primary)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.75"
            />
            <path d="M236 64 C214 78 194 88 170 96" stroke="#DFCA86" strokeWidth="0.55" strokeOpacity="0.8" />

            <path
              d="M180 86 C158 112 132 126 104 124 C124 106 152 94 180 86 Z"
              fill={`url(#${uid}-leaf-foil)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.7"
            />
            <path d="M176 88 C154 104 134 114 108 122" stroke="#FFF8DC" strokeWidth="0.5" strokeOpacity="0.7" />

            <path
              d="M126 102 C102 124 76 134 50 128 C72 114 98 106 126 102 Z"
              fill={`url(#${uid}-leaf-primary)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.7"
            />
            <path d="M122 104 C98 116 76 124 54 127" stroke="#DFCA86" strokeWidth="0.5" strokeOpacity="0.8" />

            {/* Graceful Terminal Tip Leaf */}
            <path
              d="M54 112 C34 118 14 118 2 112 C18 104 36 104 54 112 Z"
              fill={`url(#${uid}-leaf-foil)`}
              stroke={`url(#${uid}-gold-stem)`}
              strokeWidth="0.65"
            />
          </g>

          {/* Jewel-Sculpted Gilded & Emerald Olives with Specular Pearl Reflections */}
          <g className="animate-leaf-float">
            <path d="M266 54 C265 59 264 62 262 66" stroke={`url(#${uid}-gold-stem)`} strokeWidth="0.95" />
            <ellipse
              cx="260"
              cy="76"
              rx="8.5"
              ry="12.2"
              transform="rotate(20 260 76)"
              fill={`url(#${uid}-olive-gold)`}
              stroke="#E7D494"
              strokeWidth="0.85"
            />
            <ellipse
              cx="257.2"
              cy="71.8"
              rx="2.1"
              ry="4.2"
              transform="rotate(20 257.2 71.8)"
              fill="#FFFDF5"
              fillOpacity="0.72"
            />
            <circle cx="260" cy="65.5" r="1.4" fill="#D5BD79" />
          </g>

          <g className="animate-olive-drop">
            <path d="M206 44 C203 48 200 51 198 54" stroke={`url(#${uid}-gold-stem)`} strokeWidth="0.95" />
            <ellipse
              cx="194"
              cy="63"
              rx="9"
              ry="12.8"
              transform="rotate(-16 194 63)"
              fill={`url(#${uid}-olive-emerald)`}
              stroke="#DFCA86"
              strokeWidth="0.9"
            />
            <ellipse
              cx="191"
              cy="58.6"
              rx="2.2"
              ry="4.4"
              transform="rotate(-16 191 58.6)"
              fill="#FFFDF5"
              fillOpacity="0.62"
            />
            <circle cx="196.5" cy="51.5" r="1.4" fill="#D5BD79" />
          </g>

          <g className="animate-leaf-float">
            <path d="M142 78 C140 82 138 86 135 89" stroke={`url(#${uid}-gold-stem)`} strokeWidth="0.9" />
            <ellipse
              cx="131"
              cy="98"
              rx="8.2"
              ry="11.6"
              transform="rotate(26 131 98)"
              fill={`url(#${uid}-olive-gold)`}
              stroke="#E7D494"
              strokeWidth="0.85"
            />
            <ellipse
              cx="128.4"
              cy="94"
              rx="1.9"
              ry="3.9"
              transform="rotate(26 128.4 94)"
              fill="#FFFDF5"
              fillOpacity="0.72"
            />
            <circle cx="134" cy="87.5" r="1.3" fill="#D5BD79" />
          </g>

          {/* Optional 4th Harvest Olive for visual variation */}
          {isHarvest && (
            <g className="animate-olive-drop">
              <path d="M88 102 C85 106 83 109 81 112" stroke={`url(#${uid}-gold-stem)`} strokeWidth="0.85" />
              <ellipse
                cx="77"
                cy="120"
                rx="7.4"
                ry="10.6"
                transform="rotate(-14 77 120)"
                fill={`url(#${uid}-olive-emerald)`}
                stroke="#DFCA86"
                strokeWidth="0.85"
              />
              <ellipse
                cx="74.8"
                cy="116.5"
                rx="1.7"
                ry="3.4"
                transform="rotate(-14 74.8 116.5)"
                fill="#FFFDF5"
                fillOpacity="0.6"
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

/**
 * Refined gilded botanical crest with symmetrical champagne-gold olive laurel sprigs
 * and sculpted triple-olive medallion for estate concierge headers.
 */
export const OliveGroveCrest: React.FC<{ className?: string }> = ({ className = '' }) => {
  const rawId = useId();
  const uid = rawId.replace(/:/g, '');

  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#B89D58]/70 to-[#8B7344]" />
      <svg
        viewBox="0 0 132 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-28 sm:w-32 h-10 overflow-visible shrink-0"
      >
        <defs>
          <linearGradient id={`${uid}-crest-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFE1B2" />
            <stop offset="55%" stopColor="#B89B52" />
            <stop offset="100%" stopColor="#7A6128" />
          </linearGradient>
          <linearGradient id={`${uid}-crest-emerald`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#617C58" />
            <stop offset="100%" stopColor="#2B3D28" />
          </linearGradient>
          <radialGradient id={`${uid}-crest-jewel`} cx="34%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#FFF7DA" />
            <stop offset="45%" stopColor="#C8AA5E" />
            <stop offset="100%" stopColor="#6D5622" />
          </radialGradient>
        </defs>
        {/* Crossed Gilded Stems */}
        <path d="M12 32 C36 30 56 23 76 12" stroke={`url(#${uid}-crest-gold)`} strokeWidth="1.35" strokeLinecap="round" />
        <path d="M120 32 C96 30 76 23 56 12" stroke={`url(#${uid}-crest-gold)`} strokeWidth="1.35" strokeLinecap="round" />
        {/* Etched Alternating Gold & Emerald Leaves */}
        <path d="M28 29 C21 18 10 15 4 20 C12 27 20 29 28 29 Z" fill={`url(#${uid}-crest-emerald)`} stroke="#C8AA5E" strokeWidth="0.65" />
        <path d="M44 25 C37 12 26 8 18 13 C25 21 35 24 44 25 Z" fill={`url(#${uid}-crest-gold)`} stroke="#7A6128" strokeWidth="0.6" />
        <path d="M104 29 C111 18 122 15 128 20 C120 27 112 29 104 29 Z" fill={`url(#${uid}-crest-emerald)`} stroke="#C8AA5E" strokeWidth="0.65" />
        <path d="M88 25 C95 12 106 8 114 13 C107 21 97 24 88 25 Z" fill={`url(#${uid}-crest-gold)`} stroke="#7A6128" strokeWidth="0.6" />
        <path d="M40 28 C46 37 55 40 61 37 C56 30 48 28 40 28 Z" fill={`url(#${uid}-crest-emerald)`} stroke="#C8AA5E" strokeWidth="0.6" />
        <path d="M92 28 C86 37 77 40 71 37 C76 30 84 28 92 28 Z" fill={`url(#${uid}-crest-emerald)`} stroke="#C8AA5E" strokeWidth="0.6" />
        {/* Central Royal Trio of Olives */}
        <ellipse cx="57" cy="25" rx="5" ry="7.2" transform="rotate(-18 57 25)" fill={`url(#${uid}-crest-jewel)`} stroke="#E7D494" strokeWidth="0.7" />
        <ellipse cx="55.4" cy="22.4" rx="1.2" ry="2.4" transform="rotate(-18 55.4 22.4)" fill="#FFFDF5" fillOpacity="0.72" />
        <ellipse cx="75" cy="25" rx="5" ry="7.2" transform="rotate(18 75 25)" fill={`url(#${uid}-crest-jewel)`} stroke="#E7D494" strokeWidth="0.7" />
        <ellipse cx="73.4" cy="22.4" rx="1.2" ry="2.4" transform="rotate(18 73.4 22.4)" fill="#FFFDF5" fillOpacity="0.72" />
        <ellipse cx="66" cy="30" rx="5.5" ry="7.8" fill={`url(#${uid}-crest-emerald)`} stroke="#DFCA86" strokeWidth="0.8" />
        <ellipse cx="64.2" cy="27.2" rx="1.4" ry="2.6" fill="#FFFDF5" fillOpacity="0.6" />
      </svg>
      <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#B89D58]/70 to-[#8B7344]" />
    </div>
  );
};

/**
 * Jewel-like champagne-gold and deep-olive emblem for luxury amenity headings.
 */
export const OliveItemMark: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <circle cx="12" cy="12" r="10.5" fill="#FAF8F4" stroke="#C9B06B" strokeWidth="0.9" />
    <path d="M7 11.5 C10 7.5 13.5 6 17.5 5.5" stroke="#8B7344" strokeWidth="1.15" strokeLinecap="round" />
    <path
      d="M12.5 7 C13.5 4.2 16.5 3.6 18.8 5 C17 7.1 14.6 7.8 12.5 7 Z"
      fill="#C5AA63"
      stroke="#7A6128"
      strokeWidth="0.55"
    />
    <ellipse
      cx="10.2"
      cy="14.2"
      rx="3.2"
      ry="4.6"
      transform="rotate(-18 10.2 14.2)"
      fill="#3A4F37"
      stroke="#C9B06B"
      strokeWidth="0.75"
    />
    <ellipse
      cx="9.1"
      cy="12.8"
      rx="0.85"
      ry="1.6"
      transform="rotate(-18 9.1 12.8)"
      fill="#FFFDF5"
      fillOpacity="0.75"
    />
  </svg>
);

/**
 * Full-canopy Istrian olive grove botanical framing — dense olive branches laden with green,
 * golden-ripening, and dark violet olives framing all corners and the upper sunlit canopy.
 */
export const OliveGroveCanopy: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0">
      {/* Sun-dappled Mediterranean golden canopy wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(218,199,118,0.16),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(147,172,115,0.14),transparent_42%),radial-gradient(circle_at_88%_16%,rgba(196,178,104,0.12),transparent_42%)]" />

      {/* Distant Istrian olive grove silhouettes along the lower horizon */}
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 inset-x-0 w-full h-40 sm:h-52 opacity-[0.14]"
      >
        <path
          d="M0 190 Q240 142 520 174 T1060 162 T1440 184 L1440 220 L0 220 Z"
          fill="#0F170D"
        />
        {/* Stylised ancient olive tree crowns across the distant grove ridge */}
        <path d="M120 174 C105 148 122 126 146 130 C168 118 192 132 184 156 C202 162 198 180 178 180 Z" fill="#0F170D" />
        <path d="M310 166 C296 142 314 124 336 128 C354 114 382 126 372 150 C388 156 382 172 362 172 Z" fill="#0F170D" />
        <path d="M680 176 C666 154 682 136 704 140 C720 128 746 140 738 162 C752 168 746 182 726 182 Z" fill="#0F170D" />
        <path d="M1080 166 C1064 140 1084 120 1108 126 C1130 112 1160 126 1148 152 C1168 158 1160 176 1138 176 Z" fill="#0F170D" />
        <path d="M1285 178 C1272 156 1288 138 1310 142 C1326 130 1350 142 1342 164 C1356 168 1350 182 1330 182 Z" fill="#0F170D" />
      </svg>

      {/* Shared botanical SVG gradient definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="grove-leaf-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BFD1AF" />
            <stop offset="100%" stopColor="#6F8A5E" />
          </linearGradient>
          <linearGradient id="grove-leaf-deep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8AA379" />
            <stop offset="100%" stopColor="#48603C" />
          </linearGradient>
          <radialGradient id="grove-olive-green" cx="32%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#D7E59D" />
            <stop offset="50%" stopColor="#7C9445" />
            <stop offset="100%" stopColor="#3F4F20" />
          </radialGradient>
          <radialGradient id="grove-olive-gold" cx="32%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#F5E9A6" />
            <stop offset="48%" stopColor="#B8B34C" />
            <stop offset="100%" stopColor="#635F22" />
          </radialGradient>
          <radialGradient id="grove-olive-ripe" cx="32%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#A591AD" />
            <stop offset="52%" stopColor="#4F3E55" />
            <stop offset="100%" stopColor="#261C29" />
          </radialGradient>
        </defs>
      </svg>

      {/* TOP-LEFT LUSH OLIVE CANOPY BOUGH */}
      <div className="absolute -top-2 left-0 w-44 sm:w-72 lg:w-[420px] animate-olive-sway opacity-35 sm:opacity-75 lg:opacity-95">
        <svg viewBox="0 0 440 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible">
          {/* Gnarled main bough & secondary shoots */}
          <path d="M-8 34 C72 30 148 56 268 122 C310 146 355 156 392 152" stroke="#7E6751" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M55 36 C125 14 215 12 315 44" stroke="#8C735B" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M128 58 C168 96 196 138 212 194" stroke="#8C735B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M40 50 C62 108 76 154 74 205" stroke="#7E6751" strokeWidth="2.4" strokeLinecap="round" />

          {/* Dense Silvery-Green Olive Leaf Clusters */}
          <g>
            <path d="M42 32 C62 10 96 4 122 14 C98 28 70 34 42 32 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M110 22 C136 2 172 0 198 12 C172 24 140 26 110 22 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M188 22 C216 4 252 8 278 24 C250 32 218 30 188 22 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M262 34 C290 20 324 24 344 42 C316 48 286 44 262 34 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M88 46 C112 30 144 32 166 48 C140 56 112 56 88 46 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M160 66 C190 54 222 60 244 78 C216 84 186 78 160 66 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M235 104 C266 94 298 102 318 122 C288 126 258 118 235 104 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M312 142 C344 130 378 134 402 150 C372 158 340 154 312 142 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />

            {/* Lower drooping spray leaves */}
            <path d="M52 72 C24 94 12 124 20 150 C40 128 50 100 52 72 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M62 114 C38 140 32 174 44 198 C60 172 64 142 62 114 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M72 144 C94 166 104 196 96 220 C78 198 70 170 72 144 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M150 86 C126 112 118 146 130 172 C148 146 154 114 150 86 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M180 126 C158 154 156 186 172 210 C186 184 188 154 180 126 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M196 144 C224 162 242 188 242 214 C220 198 204 172 196 144 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
          </g>

          {/* Plump Fruiting Olives (11 olives clustered across branches) */}
          <g className="animate-leaf-float">
            <ellipse cx="86" cy="64" rx="9" ry="13" transform="rotate(-18 86 64)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.9" />
            <ellipse cx="83.5" cy="60" rx="2.3" ry="4.5" transform="rotate(-18 83.5 60)" fill="#FFFDF5" fillOpacity="0.6" />

            <ellipse cx="146" cy="44" rx="9.5" ry="13.5" transform="rotate(20 146 44)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.9" />
            <ellipse cx="143.5" cy="40" rx="2.4" ry="4.6" transform="rotate(20 143.5 40)" fill="#FFFDF5" fillOpacity="0.55" />

            <ellipse cx="222" cy="48" rx="8.8" ry="12.6" transform="rotate(-14 222 48)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.9" />
            <ellipse cx="219.8" cy="44" rx="2.2" ry="4.2" transform="rotate(-14 219.8 44)" fill="#FFFDF5" fillOpacity="0.45" />

            <ellipse cx="294" cy="64" rx="8.5" ry="12" transform="rotate(24 294 64)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.9" />
            <ellipse cx="291.8" cy="60.5" rx="2.1" ry="4" transform="rotate(24 291.8 60.5)" fill="#FFFDF5" fillOpacity="0.6" />
          </g>

          <g className="animate-olive-drop">
            <ellipse cx="44" cy="116" rx="9.2" ry="13" transform="rotate(14 44 116)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.9" />
            <ellipse cx="41.8" cy="112" rx="2.3" ry="4.4" transform="rotate(14 41.8 112)" fill="#FFFDF5" fillOpacity="0.55" />

            <ellipse cx="96" cy="144" rx="8.6" ry="12.2" transform="rotate(-22 96 144)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.9" />
            <ellipse cx="93.8" cy="140.5" rx="2" ry="4" transform="rotate(-22 93.8 140.5)" fill="#FFFDF5" fillOpacity="0.45" />

            <ellipse cx="164" cy="110" rx="9.4" ry="13.4" transform="rotate(16 164 110)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.9" />
            <ellipse cx="161.5" cy="106" rx="2.4" ry="4.5" transform="rotate(16 161.5 106)" fill="#FFFDF5" fillOpacity="0.6" />

            <ellipse cx="206" cy="166" rx="8.4" ry="12" transform="rotate(-12 206 166)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.9" />
            <ellipse cx="204" cy="162.5" rx="2" ry="4" transform="rotate(-12 204 162.5)" fill="#FFFDF5" fillOpacity="0.55" />

            <ellipse cx="272" cy="142" rx="8.2" ry="11.6" transform="rotate(28 272 142)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.9" />
            <ellipse cx="270" cy="139" rx="1.9" ry="3.8" transform="rotate(28 270 139)" fill="#FFFDF5" fillOpacity="0.45" />

            <ellipse cx="332" cy="168" rx="7.8" ry="11.2" transform="rotate(-20 332 168)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.9" />
            <ellipse cx="330.2" cy="165" rx="1.8" ry="3.6" transform="rotate(-20 330.2 165)" fill="#FFFDF5" fillOpacity="0.55" />

            <ellipse cx="114" cy="196" rx="8.2" ry="11.8" transform="rotate(15 114 196)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.9" />
            <ellipse cx="112" cy="193" rx="2" ry="3.8" transform="rotate(15 112 193)" fill="#FFFDF5" fillOpacity="0.55" />
          </g>
        </svg>
      </div>

      {/* TOP-RIGHT LUSH OLIVE CANOPY BOUGH (Mirrored organically) */}
      <div className="absolute -top-2 right-0 w-44 sm:w-72 lg:w-[420px] animate-olive-sway-right opacity-35 sm:opacity-75 lg:opacity-95">
        <svg viewBox="0 0 440 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible -scale-x-100">
          <path d="M-8 34 C72 30 148 56 268 122 C310 146 355 156 392 152" stroke="#7E6751" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M55 36 C125 14 215 12 315 44" stroke="#8C735B" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M128 58 C168 96 196 138 212 194" stroke="#8C735B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M40 50 C62 108 76 154 74 205" stroke="#7E6751" strokeWidth="2.4" strokeLinecap="round" />

          <g>
            <path d="M42 32 C62 10 96 4 122 14 C98 28 70 34 42 32 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M110 22 C136 2 172 0 198 12 C172 24 140 26 110 22 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M188 22 C216 4 252 8 278 24 C250 32 218 30 188 22 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M262 34 C290 20 324 24 344 42 C316 48 286 44 262 34 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M88 46 C112 30 144 32 166 48 C140 56 112 56 88 46 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M160 66 C190 54 222 60 244 78 C216 84 186 78 160 66 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M235 104 C266 94 298 102 318 122 C288 126 258 118 235 104 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M312 142 C344 130 378 134 402 150 C372 158 340 154 312 142 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M52 72 C24 94 12 124 20 150 C40 128 50 100 52 72 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M62 114 C38 140 32 174 44 198 C60 172 64 142 62 114 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M72 144 C94 166 104 196 96 220 C78 198 70 170 72 144 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
            <path d="M150 86 C126 112 118 146 130 172 C148 146 154 114 150 86 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.8" />
            <path d="M180 126 C158 154 156 186 172 210 C186 184 188 154 180 126 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.8" />
          </g>

          <g className="animate-olive-drop">
            <ellipse cx="86" cy="64" rx="9" ry="13" transform="rotate(-18 86 64)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.9" />
            <ellipse cx="83.5" cy="60" rx="2.3" ry="4.5" transform="rotate(-18 83.5 60)" fill="#FFFDF5" fillOpacity="0.55" />

            <ellipse cx="146" cy="44" rx="9.5" ry="13.5" transform="rotate(20 146 44)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.9" />
            <ellipse cx="143.5" cy="40" rx="2.4" ry="4.6" transform="rotate(20 143.5 40)" fill="#FFFDF5" fillOpacity="0.45" />

            <ellipse cx="222" cy="48" rx="8.8" ry="12.6" transform="rotate(-14 222 48)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.9" />
            <ellipse cx="219.8" cy="44" rx="2.2" ry="4.2" transform="rotate(-14 219.8 44)" fill="#FFFDF5" fillOpacity="0.6" />

            <ellipse cx="294" cy="64" rx="8.5" ry="12" transform="rotate(24 294 64)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.9" />
            <ellipse cx="291.8" cy="60.5" rx="2.1" ry="4" transform="rotate(24 291.8 60.5)" fill="#FFFDF5" fillOpacity="0.55" />
          </g>

          <g className="animate-leaf-float">
            <ellipse cx="44" cy="116" rx="9.2" ry="13" transform="rotate(14 44 116)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.9" />
            <ellipse cx="41.8" cy="112" rx="2.3" ry="4.4" transform="rotate(14 41.8 112)" fill="#FFFDF5" fillOpacity="0.6" />

            <ellipse cx="96" cy="144" rx="8.6" ry="12.2" transform="rotate(-22 96 144)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.9" />
            <ellipse cx="93.8" cy="140.5" rx="2" ry="4" transform="rotate(-22 93.8 140.5)" fill="#FFFDF5" fillOpacity="0.55" />

            <ellipse cx="164" cy="110" rx="9.4" ry="13.4" transform="rotate(16 164 110)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.9" />
            <ellipse cx="161.5" cy="106" rx="2.4" ry="4.5" transform="rotate(16 161.5 106)" fill="#FFFDF5" fillOpacity="0.45" />

            <ellipse cx="206" cy="166" rx="8.4" ry="12" transform="rotate(-12 206 166)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.9" />
            <ellipse cx="204" cy="162.5" rx="2" ry="4" transform="rotate(-12 204 162.5)" fill="#FFFDF5" fillOpacity="0.6" />

            <ellipse cx="272" cy="142" rx="8.2" ry="11.6" transform="rotate(28 272 142)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.9" />
            <ellipse cx="270" cy="139" rx="1.9" ry="3.8" transform="rotate(28 270 139)" fill="#FFFDF5" fillOpacity="0.55" />
          </g>
        </svg>
      </div>

      {/* MID-LEFT OUTER MARGIN OLIVE FRUITING SPRAY (Wide screens only) */}
      <div className="hidden 2xl:block absolute top-1/2 -translate-y-1/2 left-0 w-36 animate-olive-sway opacity-75">
        <svg viewBox="0 0 150 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible">
          <path d="M-4 40 C42 64 82 94 114 134" stroke="#7E6751" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M24 58 C46 42 74 36 96 44 C76 58 50 64 24 58 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
          <path d="M56 80 C82 68 108 70 128 84 C104 92 78 90 56 80 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
          <path d="M40 72 C32 98 34 126 48 144 C56 122 54 96 40 72 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
          <g className="animate-leaf-float">
            <ellipse cx="64" cy="108" rx="8.2" ry="11.6" transform="rotate(-14 64 108)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.85" />
            <ellipse cx="62" cy="104.5" rx="2" ry="3.8" transform="rotate(-14 62 104.5)" fill="#FFFDF5" fillOpacity="0.6" />
            <ellipse cx="94" cy="122" rx="7.8" ry="11.2" transform="rotate(18 94 122)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.85" />
            <ellipse cx="92" cy="118.8" rx="1.9" ry="3.6" transform="rotate(18 92 118.8)" fill="#FFFDF5" fillOpacity="0.45" />
            <ellipse cx="32" cy="104" rx="7.6" ry="11" transform="rotate(10 32 104)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.85" />
            <ellipse cx="30.2" cy="100.8" rx="1.8" ry="3.4" transform="rotate(10 30.2 100.8)" fill="#FFFDF5" fillOpacity="0.55" />
          </g>
        </svg>
      </div>

      {/* MID-RIGHT OUTER MARGIN OLIVE FRUITING SPRAY (Wide screens only) */}
      <div className="hidden 2xl:block absolute top-[54%] -translate-y-1/2 right-0 w-36 animate-olive-sway-right opacity-75">
        <svg viewBox="0 0 150 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible -scale-x-100">
          <path d="M-4 40 C42 64 82 94 114 134" stroke="#7E6751" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M24 58 C46 42 74 36 96 44 C76 58 50 64 24 58 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
          <path d="M56 80 C82 68 108 70 128 84 C104 92 78 90 56 80 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
          <path d="M40 72 C32 98 34 126 48 144 C56 122 54 96 40 72 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
          <g className="animate-olive-drop">
            <ellipse cx="64" cy="108" rx="8.2" ry="11.6" transform="rotate(-14 64 108)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.85" />
            <ellipse cx="62" cy="104.5" rx="2" ry="3.8" transform="rotate(-14 62 104.5)" fill="#FFFDF5" fillOpacity="0.55" />
            <ellipse cx="94" cy="122" rx="7.8" ry="11.2" transform="rotate(18 94 122)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.85" />
            <ellipse cx="92" cy="118.8" rx="1.9" ry="3.6" transform="rotate(18 92 118.8)" fill="#FFFDF5" fillOpacity="0.6" />
            <ellipse cx="32" cy="104" rx="7.6" ry="11" transform="rotate(10 32 104)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.85" />
            <ellipse cx="30.2" cy="100.8" rx="1.8" ry="3.4" transform="rotate(10 30.2 100.8)" fill="#FFFDF5" fillOpacity="0.45" />
          </g>
        </svg>
      </div>

      {/* BOTTOM-LEFT GROUNDED OLIVE GROVE SPRAY */}
      <div className="hidden md:block absolute -bottom-2 left-0 w-72 lg:w-96 opacity-90">
        <svg viewBox="0 0 360 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible">
          <path d="M-6 135 C75 112 152 84 265 44" stroke="#7E6751" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M62 115 C120 124 185 128 242 114" stroke="#8C735B" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M134 90 C168 62 212 36 276 26" stroke="#8C735B" strokeWidth="1.9" strokeLinecap="round" />

          <g>
            <path d="M46 116 C62 88 94 74 122 80 C102 100 76 112 46 116 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
            <path d="M108 96 C126 68 158 56 186 64 C164 84 138 94 108 96 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
            <path d="M174 72 C194 46 226 36 254 44 C232 62 204 70 174 72 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
            <path d="M234 52 C260 32 292 28 318 40 C292 54 264 56 234 52 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
            <path d="M84 120 C112 134 142 138 168 128 C142 114 114 112 84 120 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
            <path d="M164 122 C196 134 228 134 256 122 C226 110 194 112 164 122 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
          </g>

          <g className="animate-leaf-float">
            <ellipse cx="80" cy="108" rx="8.5" ry="12" transform="rotate(16 80 108)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.85" />
            <ellipse cx="78" cy="104.5" rx="2.1" ry="4" transform="rotate(16 78 104.5)" fill="#FFFDF5" fillOpacity="0.6" />

            <ellipse cx="148" cy="102" rx="9" ry="12.6" transform="rotate(-20 148 102)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.85" />
            <ellipse cx="146" cy="98.5" rx="2.2" ry="4.2" transform="rotate(-20 146 98.5)" fill="#FFFDF5" fillOpacity="0.45" />

            <ellipse cx="212" cy="86" rx="8.6" ry="12" transform="rotate(22 212 86)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.85" />
            <ellipse cx="210" cy="82.5" rx="2.1" ry="4" transform="rotate(22 210 82.5)" fill="#FFFDF5" fillOpacity="0.55" />

            <ellipse cx="280" cy="64" rx="8" ry="11.4" transform="rotate(-14 280 64)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.85" />
            <ellipse cx="278.2" cy="61" rx="1.9" ry="3.8" transform="rotate(-14 278.2 61)" fill="#FFFDF5" fillOpacity="0.55" />
          </g>
        </svg>
      </div>

      {/* BOTTOM-RIGHT GROUNDED OLIVE GROVE SPRAY */}
      <div className="hidden md:block absolute -bottom-2 right-0 w-72 lg:w-96 opacity-90">
        <svg viewBox="0 0 360 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible -scale-x-100">
          <path d="M-6 135 C75 112 152 84 265 44" stroke="#7E6751" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M62 115 C120 124 185 128 242 114" stroke="#8C735B" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M134 90 C168 62 212 36 276 26" stroke="#8C735B" strokeWidth="1.9" strokeLinecap="round" />

          <g>
            <path d="M46 116 C62 88 94 74 122 80 C102 100 76 112 46 116 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
            <path d="M108 96 C126 68 158 56 186 64 C164 84 138 94 108 96 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
            <path d="M174 72 C194 46 226 36 254 44 C232 62 204 70 174 72 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
            <path d="M234 52 C260 32 292 28 318 40 C292 54 264 56 234 52 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
            <path d="M84 120 C112 134 142 138 168 128 C142 114 114 112 84 120 Z" fill="url(#grove-leaf-light)" stroke="#445A38" strokeWidth="0.75" />
            <path d="M164 122 C196 134 228 134 256 122 C226 110 194 112 164 122 Z" fill="url(#grove-leaf-deep)" stroke="#3D5232" strokeWidth="0.75" />
          </g>

          <g className="animate-olive-drop">
            <ellipse cx="80" cy="108" rx="8.5" ry="12" transform="rotate(16 80 108)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.85" />
            <ellipse cx="78" cy="104.5" rx="2.1" ry="4" transform="rotate(16 78 104.5)" fill="#FFFDF5" fillOpacity="0.55" />

            <ellipse cx="148" cy="102" rx="9" ry="12.6" transform="rotate(-20 148 102)" fill="url(#grove-olive-gold)" stroke="#4C4F1A" strokeWidth="0.85" />
            <ellipse cx="146" cy="98.5" rx="2.2" ry="4.2" transform="rotate(-20 146 98.5)" fill="#FFFDF5" fillOpacity="0.6" />

            <ellipse cx="212" cy="86" rx="8.6" ry="12" transform="rotate(22 212 86)" fill="url(#grove-olive-ripe)" stroke="#241928" strokeWidth="0.85" />
            <ellipse cx="210" cy="82.5" rx="2.1" ry="4" transform="rotate(22 210 82.5)" fill="#FFFDF5" fillOpacity="0.45" />

            <ellipse cx="280" cy="64" rx="8" ry="11.4" transform="rotate(-14 280 64)" fill="url(#grove-olive-green)" stroke="#2F3D18" strokeWidth="0.85" />
            <ellipse cx="278.2" cy="61" rx="1.9" ry="3.8" transform="rotate(-14 278.2 61)" fill="#FFFDF5" fillOpacity="0.55" />
          </g>
        </svg>
      </div>
    </div>
  );
};
