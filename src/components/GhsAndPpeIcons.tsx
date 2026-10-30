import React from 'react';
import { GHSPictogramType, PPEType } from '../types/chemCard';

// Standard GHS Red-Border Diamond
export const GHSPictogram: React.FC<{ type: GHSPictogramType; className?: string }> = ({
  type,
  className = 'w-20 h-20',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center p-1.5 transition-transform ${className}`}
      title={`GHS: ${type}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White background diamond */}
        <polygon
          points="50,2 98,50 50,98 2,50"
          fill="#FFFFFF"
          stroke="#E01020"
          strokeWidth="7"
          strokeLinejoin="miter"
        />

        {/* Symbols based on GHS Classification */}
        {type === 'exclamation' && (
          <g fill="#111827">
            {/* Thick Exclamation Bar */}
            <rect x="44.5" y="24" width="11" height="34" rx="5.5" />
            {/* Exclamation Dot */}
            <circle cx="50" cy="71" r="5.5" />
          </g>
        )}

        {type === 'flame' && (
          <g fill="#111827">
            <path d="M50 20 C47 30 38 38 38 48 C38 58 45 68 50 78 C54 70 58 65 60 58 C62 50 55 42 55 35 C55 30 58 26 50 20 Z" />
            <path d="M43 55 C37 60 35 68 40 76 C42 80 47 82 50 82 C55 82 62 78 63 71 C65 64 59 60 56 55 C53 62 48 64 43 55 Z" />
            <path d="M50 83 C36 83 28 73 30 60 C32 48 42 42 43 32 C35 38 30 46 29 55 C27 46 32 37 38 30 C45 22 52 18 52 18 C52 24 50 28 50 33 C57 36 65 44 67 52 C70 62 67 74 58 80 C55 82 52 83 50 83 Z" />
          </g>
        )}

        {type === 'corrosion' && (
          <g fill="#111827">
            {/* Tube left */}
            <rect x="26" y="26" width="6" height="22" transform="rotate(-35 29 37)" rx="2" />
            {/* Tube right */}
            <rect x="68" y="26" width="6" height="22" transform="rotate(35 71 37)" rx="2" />
            {/* Liquid pouring drops */}
            <circle cx="43" cy="50" r="2.5" />
            <circle cx="57" cy="50" r="2.5" />
            {/* Metal bar left under attack */}
            <rect x="25" y="60" width="22" height="7" rx="1" />
            {/* Hand right under attack */}
            <path d="M54 62 C58 58 68 58 74 62 L74 68 L56 68 Z" />
            {/* Attack craters */}
            <circle cx="36" cy="60" r="3.5" fill="#FFFFFF" />
            <circle cx="64" cy="60" r="3" fill="#FFFFFF" />
          </g>
        )}

        {type === 'exploding-bomb' && (
          <g fill="#111827">
            <circle cx="50" cy="56" r="16" />
            {/* Burst lines */}
            <line x1="50" y1="20" x2="50" y2="34" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            <line x1="24" y1="36" x2="35" y2="44" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            <line x1="76" y1="36" x2="65" y2="44" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            <line x1="20" y1="62" x2="32" y2="60" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            <line x1="80" y1="62" x2="68" y2="60" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            <polygon points="46,36 54,36 50,26" />
          </g>
        )}

        {type === 'gas-cylinder' && (
          <g fill="#111827">
            <rect x="26" y="44" width="48" height="13" rx="6.5" />
            <rect x="22" y="48" width="5" height="5" rx="1" />
            <rect x="73" y="47" width="5" height="7" rx="1" />
            <line x1="33" y1="41" x2="33" y2="59" stroke="#111827" strokeWidth="3" />
          </g>
        )}

        {type === 'flame-over-circle' && (
          <g fill="#111827">
            <circle cx="50" cy="58" r="15" fill="none" stroke="#111827" strokeWidth="6" />
            <path d="M50 22 C48 30 42 36 42 42 C45 42 48 38 50 34 C52 38 56 42 58 42 C58 36 52 30 50 22 Z" />
            <path d="M46 36 C42 40 40 46 45 48 C47 45 48 44 48 42 Z" />
            <path d="M54 36 C58 40 60 46 55 48 C53 45 52 44 52 42 Z" />
          </g>
        )}

        {type === 'skull' && (
          <g fill="#111827">
            <path d="M35 48 C35 34 40 28 50 28 C60 28 65 34 65 48 C65 55 60 59 58 61 L58 66 L42 66 L42 61 C40 59 35 55 35 48 Z" />
            <ellipse cx="43" cy="46" rx="4.5" ry="5.5" fill="#FFFFFF" />
            <ellipse cx="57" cy="46" rx="4.5" ry="5.5" fill="#FFFFFF" />
            <polygon points="50,53 48,58 52,58" fill="#FFFFFF" />
            <line x1="46" y1="62" x2="46" y2="66" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="50" y1="62" x2="50" y2="66" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="54" y1="62" x2="54" y2="66" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Crossbones */}
            <line x1="22" y1="36" x2="78" y2="76" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
            <line x1="22" y1="76" x2="78" y2="36" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {type === 'health-hazard' && (
          <g fill="#111827">
            {/* Human bust silhouette */}
            <circle cx="50" cy="35" r="9" />
            <path d="M32 72 C32 55 40 50 50 50 C60 50 68 55 68 72 Z" />
            {/* Exploding / starburst inside chest */}
            <polygon
              points="50,54 53,60 59,57 56,63 62,65 56,68 58,74 52,70 50,76 48,70 42,74 44,68 38,65 44,63 41,57 47,60"
              fill="#FFFFFF"
            />
          </g>
        )}

        {type === 'environment' && (
          <g fill="#111827">
            {/* Dead tree */}
            <path d="M36 68 L36 44 L31 38 M36 50 L42 42 M36 56 L31 52" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            {/* Belly up dead fish */}
            <path d="M50 64 C58 58 68 62 74 65 C68 67 62 67 56 65 Z" />
            <polygon points="72,64 78,59 78,69" />
            {/* Water shore */}
            <path d="M22 72 Q35 68 50 72 T78 72" stroke="#111827" strokeWidth="3" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};

// Circular Blue PPE Icons exactly like template
export const PPEIcon: React.FC<{ type: PPEType; className?: string }> = ({
  type,
  className = 'w-13 h-13',
}) => {
  return (
    <div
      className={`rounded-full bg-[#0353a4] flex items-center justify-center p-2 text-white shadow-sm shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        {type === 'glasses' && (
          <g fill="#FFFFFF">
            {/* Safety Goggles / Glasses */}
            <path d="M50 36 C42 36 30 42 22 42 C16 42 16 52 18 64 C20 74 34 76 42 70 C46 66 48 58 50 58 C52 58 54 66 58 70 C66 76 80 74 82 64 C84 52 84 42 78 42 C70 42 58 36 50 36 Z M35 64 C27 64 24 54 26 48 C30 48 38 52 41 57 C39 62 37 64 35 64 Z M65 64 C63 64 61 62 59 57 C62 52 70 48 74 48 C76 54 73 64 65 64 Z" />
            {/* Strap */}
            <path d="M18 48 C14 49 10 52 10 56 C10 60 14 62 18 63" stroke="#FFFFFF" strokeWidth="4" fill="none" />
            <path d="M82 48 C86 49 90 52 90 56 C90 60 86 62 82 63" stroke="#FFFFFF" strokeWidth="4" fill="none" />
          </g>
        )}

        {type === 'gloves' && (
          <g fill="#FFFFFF">
            {/* Nitrile / Chemical Gloves */}
            <path d="M30 76 L30 52 C30 48 32 44 36 44 C40 44 41 48 41 52 L41 38 C41 34 43 31 47 31 C51 31 52 34 52 38 L52 34 C52 30 54 27 58 27 C62 27 63 30 63 34 L63 40 C63 36 65 33 69 33 C73 33 74 36 74 40 L74 62 C74 72 68 76 60 76 Z" />
            <path d="M28 56 C24 56 20 60 22 66 C24 72 30 74 34 72" fill="#FFFFFF" />
            <rect x="28" y="74" width="44" height="6" rx="2" fill="#FFFFFF" />
          </g>
        )}

        {type === 'clothing' && (
          <g fill="#FFFFFF">
            {/* Protective Lab Coat / Overall */}
            <path d="M34 26 L44 38 L38 42 L24 34 Z" />
            <path d="M66 26 L56 38 L62 42 L76 34 Z" />
            <path d="M43 28 L50 36 L57 28 L64 30 L62 76 L38 76 L36 30 Z" />
            <path d="M22 36 L16 58 L24 61 L28 44 Z" />
            <path d="M78 36 L84 58 L76 61 L72 44 Z" />
            <line x1="50" y1="44" x2="50" y2="76" stroke="#0353a4" strokeWidth="3" />
            {/* Pocket */}
            <rect x="42" y="52" width="6" height="7" rx="1" fill="#0353a4" />
          </g>
        )}

        {type === 'mask' && (
          <g fill="#FFFFFF">
            {/* Face Mask with Ear Loops */}
            <path d="M26 40 C26 36 36 32 50 32 C64 32 74 36 74 40 L72 62 C72 68 62 72 50 72 C38 72 28 68 28 62 Z" />
            {/* Pleat lines */}
            <line x1="32" y1="44" x2="68" y2="44" stroke="#0353a4" strokeWidth="2.5" />
            <line x1="32" y1="52" x2="68" y2="52" stroke="#0353a4" strokeWidth="2.5" />
            <line x1="34" y1="60" x2="66" y2="60" stroke="#0353a4" strokeWidth="2.5" />
            {/* Ear loops */}
            <path d="M26 42 C16 44 14 56 27 60" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
            <path d="M74 42 C84 44 86 56 73 60" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
          </g>
        )}

        {type === 'respirator' && (
          <g fill="#FFFFFF">
            {/* Half-mask Respirator with Cartridges */}
            <path d="M38 34 C38 30 46 26 50 26 C54 26 62 30 62 34 L66 54 C66 64 58 72 50 72 C42 72 34 64 34 54 Z" />
            {/* Left filter */}
            <rect x="22" y="46" width="14" height="18" rx="4" />
            {/* Right filter */}
            <rect x="64" y="46" width="14" height="18" rx="4" />
            {/* Center valve */}
            <circle cx="50" cy="56" r="6" fill="#0353a4" />
          </g>
        )}

        {type === 'boots' && (
          <g fill="#FFFFFF">
            {/* Safety Boots */}
            <path d="M34 26 L54 26 L54 54 L68 56 C74 58 78 64 76 72 L32 72 L32 30 C32 28 33 26 34 26 Z" />
            <rect x="30" y="72" width="48" height="5" rx="1.5" />
          </g>
        )}

        {type === 'shield' && (
          <g fill="#FFFFFF">
            {/* Face Shield */}
            <path d="M30 28 L70 28 C72 28 74 30 74 32 L74 38 L26 38 L26 32 C26 30 28 28 30 28 Z" />
            <path d="M30 40 L70 40 C68 62 62 76 50 78 C38 76 32 62 30 40 Z" />
          </g>
        )}
      </svg>
    </div>
  );
};

// Green First-Aid Rounded Icons
export const FirstAidIcon: React.FC<{
  type: 'skin' | 'eye' | 'inhalation' | 'ingestion';
  className?: string;
}> = ({ type, className = 'w-9 h-9' }) => {
  return (
    <div
      className={`rounded-lg bg-[#00875a] flex items-center justify-center p-1.5 text-white shadow-sm shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        {type === 'skin' && (
          <g fill="#FFFFFF">
            {/* Hands & Water Droplets */}
            <circle cx="50" cy="22" r="4.5" />
            <circle cx="42" cy="32" r="3.5" />
            <circle cx="58" cy="32" r="3.5" />
            {/* Reaching hands under water */}
            <path d="M26 68 C34 60 48 54 62 54 C68 54 74 56 76 60 C78 64 74 68 68 68 L48 68 L40 76 L26 76 Z" />
            <path d="M34 52 C38 48 46 46 54 46 C58 46 62 48 62 50 C62 52 58 54 54 54 L38 54 Z" />
          </g>
        )}

        {type === 'eye' && (
          <g fill="#FFFFFF">
            {/* Eye with Water Droplets */}
            <circle cx="50" cy="22" r="4.5" />
            <circle cx="43" cy="31" r="3" />
            <circle cx="57" cy="31" r="3" />
            {/* Eye shape */}
            <path d="M20 54 C32 38 68 38 80 54 C68 70 32 70 20 54 Z" fill="none" stroke="#FFFFFF" strokeWidth="6" />
            <circle cx="50" cy="54" r="8" fill="#FFFFFF" />
          </g>
        )}

        {type === 'inhalation' && (
          <g fill="#FFFFFF">
            {/* Head profile breathing fresh air */}
            <path d="M30 68 C30 52 38 46 44 46 C50 46 54 42 54 36 C54 28 48 24 40 24 C36 24 32 26 30 28 L30 20 C34 18 38 18 42 18 C54 18 62 26 62 38 C62 44 58 48 56 52 C64 56 68 64 68 74 L30 74 Z" />
            {/* Wind / Breath air waves */}
            <path d="M22 38 Q16 38 12 42" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M24 46 Q14 46 8 50" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M22 54 Q16 54 12 58" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {type === 'ingestion' && (
          <g fill="#FFFFFF">
            {/* Medical cross / ingest alert */}
            <rect x="42" y="22" width="16" height="56" rx="4" />
            <rect x="22" y="42" width="56" height="16" rx="4" />
          </g>
        )}
      </svg>
    </div>
  );
};

// Storage Thermometer Icon
export const StorageThermometerIcon: React.FC<{ className?: string }> = ({
  className = 'w-10 h-16',
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 50 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thermometer Stem */}
        <rect
          x="19"
          y="10"
          width="12"
          height="62"
          rx="6"
          fill="#FFFFFF"
          stroke="#003566"
          strokeWidth="3.5"
        />
        {/* Thermometer Bulb */}
        <circle
          cx="25"
          cy="78"
          r="15"
          fill="#0052cc"
          stroke="#003566"
          strokeWidth="3.5"
        />
        {/* Mercury Column */}
        <rect x="22" y="32" width="6" height="42" rx="3" fill="#0052cc" />
        {/* Measurement notches */}
        <line x1="33" y1="20" x2="39" y2="20" stroke="#003566" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="30" x2="42" y2="30" stroke="#003566" strokeWidth="3" strokeLinecap="round" />
        <line x1="33" y1="40" x2="39" y2="40" stroke="#003566" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="50" x2="42" y2="50" stroke="#003566" strokeWidth="3" strokeLinecap="round" />
        <line x1="33" y1="60" x2="39" y2="60" stroke="#003566" strokeWidth="2.5" strokeLinecap="round" />
        {/* Highlight on bulb */}
        <circle cx="21" cy="74" r="4" fill="#60a5fa" opacity="0.8" />
      </svg>
    </div>
  );
};

// Spill Response Icon
export const SpillResponseIcon: React.FC<{ className?: string }> = ({
  className = 'w-12 h-14',
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Falling droplets */}
        <path d="M50 12 C47 18 42 22 42 26 C42 30 46 34 50 34 C54 34 58 30 58 26 C58 22 53 18 50 12 Z" fill="#0284c7" />
        <circle cx="36" cy="24" r="3" fill="#0284c7" />
        <circle cx="64" cy="24" r="3" fill="#0284c7" />
        
        {/* Liquid puddle */}
        <ellipse cx="50" cy="46" rx="34" ry="10" fill="#0369a1" />
        
        {/* Absorbent Mat / Grid Pad */}
        <polygon points="26,62 74,62 84,86 16,86" fill="#f8fafc" stroke="#0369a1" strokeWidth="3" />
        {/* Grid dots on pad */}
        <circle cx="32" cy="70" r="2" fill="#0369a1" />
        <circle cx="44" cy="70" r="2" fill="#0369a1" />
        <circle cx="56" cy="70" r="2" fill="#0369a1" />
        <circle cx="68" cy="70" r="2" fill="#0369a1" />
        <circle cx="28" cy="78" r="2" fill="#0369a1" />
        <circle cx="42" cy="78" r="2" fill="#0369a1" />
        <circle cx="58" cy="78" r="2" fill="#0369a1" />
        <circle cx="72" cy="78" r="2" fill="#0369a1" />
      </svg>
    </div>
  );
};
