import React from 'react';

// Component cho một bụi tre, có thể lật ngược để dùng cho cả hai bên
const BambooCluster: React.FC<{ flipped?: boolean }> = ({ flipped = false }) => (
    <svg
        viewBox="0 0 200 600"
        className="w-full h-auto"
        style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
        preserveAspectRatio="xMaxYMax meet"
    >
        <defs>
            <linearGradient id="bambooGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6A994E" />
                <stop offset="50%" stopColor="#A7C957" />
                <stop offset="100%" stopColor="#6A994E" />
            </linearGradient>
        </defs>
        <g opacity="0.9">
            {/* Thân tre 1 (sau) */}
            <path d="M 120,600 C 122,400 115,200 130,0" stroke="url(#bambooGradient)" strokeWidth="18" fill="none" />
            {/* Đốt tre 1 */}
            {[...Array(8)].map((_, i) => (
                <path key={`stalk1-node-${i}`} d={`M 111,${550 - i * 70} q 19,3 38,0`} stroke="#386641" strokeWidth="3" fill="none" opacity="0.6"/>
            ))}
            {/* Lá tre 1 */}
            <path d="M 130,200 Q 180,180 200,150" stroke="#386641" strokeWidth="2" fill="#6A994E"/>
            <path d="M 130,205 Q 175,200 190,180" stroke="#386641" strokeWidth="2" fill="#A7C957"/>

            {/* Thân tre 2 (trước) */}
            <path d="M 80,600 C 85,400 70,200 60,0" stroke="url(#bambooGradient)" strokeWidth="25" fill="none" />
            {/* Đốt tre 2 */}
             {[...Array(7)].map((_, i) => (
                <path key={`stalk2-node-${i}`} d={`M 67.5,${520 - i * 80} q 25,4 50,0`} stroke="#386641" strokeWidth="4" fill="none" opacity="0.7"/>
            ))}
            {/* Lá tre 2 */}
            <path d="M 60,300 Q 120,280 150,250" stroke="#386641" strokeWidth="2" fill="#6A994E"/>
            <path d="M 60,305 Q 115,300 130,280" stroke="#386641" strokeWidth="2" fill="#A7C957"/>
            <path d="M 60,100 Q 10,80 -10,50" stroke="#386641" strokeWidth="2" fill="#6A994E"/>
        </g>
    </svg>
);

const VietnameseScenery: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Bầu trời chuyển màu nhẹ nhàng */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-[#FDFBF5]"></div>

            {/* Con đường làng */}
            <div className="absolute inset-x-0 bottom-0 h-full flex justify-center">
                <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMax slice">
                    <path
                        d="M 150 800 C 160 600, 250 500, 220 300 S 180 100, 200 0"
                        fill="#D6C4A5"
                        opacity="0.8"
                    />
                </svg>
            </div>

            {/* Các bụi tre hai bên */}
            <div className="absolute bottom-0 left-0 w-1/4 max-w-[250px] opacity-90">
               <BambooCluster />
            </div>
            <div className="absolute bottom-0 right-0 w-1/4 max-w-[250px] opacity-90">
               <BambooCluster flipped={true} />
            </div>
        </div>
    );
};

export default VietnameseScenery;