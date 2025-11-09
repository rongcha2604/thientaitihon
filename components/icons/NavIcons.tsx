import React from 'react';

const commonProps = {
    className: "h-8 w-8 transition-all duration-300",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as 'round',
    strokeLinejoin: "round" as 'round',
}

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-amber-100/50">
        {children}
    </div>
);

export const IconHoc: React.FC = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" {...commonProps}>
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
    </IconWrapper>
);

export const IconOnTap: React.FC = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" {...commonProps}>
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    </IconWrapper>
);

export const IconAlbum: React.FC = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" {...commonProps}>
           <path d="M9 21c0-2.21.895-4.21 2.343-5.657A8.003 8.003 0 0115 14a8 8 0 015.657 2.343C21.105 16.79 22 18.79 22 21H9zM6 14a6 6 0 1112 0h-3a3 3 0 00-3 3v2a3 3 0 00-3-3H6zM4 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        </svg>
    </IconWrapper>
);

export const IconHoSo: React.FC = () => (
     <IconWrapper>
         <svg xmlns="http://www.w3.org/2000/svg" {...commonProps}>
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
        </svg>
     </IconWrapper>
);
