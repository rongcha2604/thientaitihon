import React from 'react';

interface MascotProps {
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`${className}`}>
      <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <g transform="scale(0.95) translate(4, 4)">
          {/* Background */}
          <circle cx="75" cy="75" r="70" fill="#FFFBEB" />
          
          {/* Sun */}
          <circle cx="125" cy="35" r="12" fill="#FFDE7A" />
          <path d="M125 20 v-3 M140 35 h3 M125 50 v3 M110 35 h-3" stroke="#FFDE7A" strokeWidth="2" strokeLinecap="round" />

          {/* Clouds */}
          <path d="M 20 150 C 0 150 0 120 20 120 C 30 100 60 100 70 120 C 100 120 100 150 70 150 Z" fill="white" opacity="0.9" />
          <path d="M 130 140 C 110 140 110 110 130 110 C 140 90 170 90 180 110 C 210 110 210 140 180 140 Z" fill="white" opacity="0.9" />

          {/* Character */}
          <g transform="translate(15, 10)">
            {/* Feet & Sandals */}
            <path d="M50 128 l 10 0" stroke="#6B4F35" strokeWidth="1.5" />
            <ellipse cx="55" cy="130" rx="7" ry="3" fill="#D2B48C" />

            <path d="M75 128 l 10 0" stroke="#6B4F35" strokeWidth="1.5" />
            <ellipse cx="80" cy="130" rx="7" ry="3" fill="#D2B48C" />
            
            {/* Pants */}
            <rect x="53" y="115" width="10" height="15" fill="#6B4F35" />
            <rect x="78" y="115" width="10" height="15" fill="#6B4F35" />

            {/* Body */}
            <path d="M 45 120 C 45 80, 105 80, 105 120 Z" fill="#89CFF0" />
            <path d="M65 90 c 3 -3 6 -3 6 0 c 3 3 0 3 -3 3" fill="#FFD700" opacity="0.8" />
            <path d="M85 105 c 3 -3 6 -3 6 0 c 3 3 0 3 -3 3" fill="#FFD700" opacity="0.8" />
            
            {/* Sash */}
            <path d="M 55 113 H 95" stroke="#E53E3E" strokeWidth="6" strokeLinecap="round"/>

            {/* Head */}
            <circle cx="75" cy="65" r="25" fill="#FFE4C4" />
            
            {/* Hair */}
            <path d="M 75,35 C 50,40 50,65 50,65 H 100 C 100,65 100,40 75,35 Z" fill="#4A3731"/>
            <circle cx="75" cy="32" r="8" fill="#4A3731" />
            <rect x="70" y="28" width="10" height="2.5" fill="#FFD700" rx="1"/>
            <text x="71" y="30" fill="#4A3731" fontSize="2.5" fontWeight="bold">Ước</text>
            
            {/* Face */}
            <circle cx="65" cy="65" r="2.5" fill="#4A3731" />
            <circle cx="85" cy="65" r="2.5" fill="#4A3731" />
            <path d="M 70 75 Q 75 80, 80 75" stroke="#4A3731" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

            {/* Arms & Hands */}
            {/* Right arm with brush */}
            <path d="M50 90 C 35 100, 35 110, 35 110" stroke="#89CFF0" fill="none" strokeWidth="8" strokeLinecap="round" />
            <circle cx="35" cy="110" r="4" fill="#FFE4C4" />
            <line x1="33" y1="110" x2="20" y2="95" stroke="#663300" strokeWidth="3" strokeLinecap="round" />
            <path d="M 20 95 L 17 92 L 23 92 Z" fill="#4A3731" />
            <rect x="25" y="110" width="5" height="12" fill="#F5DEB3" rx="1" transform="rotate(20 27.5 116)"/>


            {/* Left arm pointing */}
            <path d="M100 90 C 115 85, 120 75, 120 75" stroke="#89CFF0" fill="none" strokeWidth="8" strokeLinecap="round" />
            <path d="M120 75 L 123 70 L 117 72 Z" fill="#FFE4C4"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Mascot;