import React from 'react';
import { Page } from '../types';
import { IconHoc, IconOnTap, IconAlbum, IconHoSo, IconPhuHuynh } from './icons/NavIcons';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-green-800 scale-110';
  const inactiveClasses = 'text-amber-800/70 hover:text-amber-900';
  
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center space-y-1 transition-all duration-300 transform group focus:outline-none"
    >
      <div className={`transition-all duration-300 transform ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
        {icon}
      </div>
      <span className={`text-xs font-extrabold transition-colors duration-300 ${isActive ? activeClasses : inactiveClasses}`}>
        {label}
      </span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-5xl mx-auto h-24 md:h-28 bg-[#FDFBF5]/80 backdrop-blur-lg border-t-2 border-amber-700/20 rounded-t-3xl shadow-viet-style-raised z-50">
      <div className="flex justify-around items-center h-full px-2">
        <NavButton
          label="Học"
          icon={<IconHoc />}
          isActive={activePage === Page.Hoc}
          onClick={() => setActivePage(Page.Hoc)}
        />
        <NavButton
          label="Ôn tập"
          icon={<IconOnTap />}
          isActive={activePage === Page.OnTap}
          onClick={() => setActivePage(Page.OnTap)}
        />
        <NavButton
          label="Album"
          icon={<IconAlbum />}
          isActive={activePage === Page.Album}
          onClick={() => setActivePage(Page.Album)}
        />
        <NavButton
          label="Hồ sơ"
          icon={<IconHoSo />}
          isActive={activePage === Page.HoSo}
          onClick={() => setActivePage(Page.HoSo)}
        />
        <NavButton
          label="Ủng hộ"
          icon={<IconPhuHuynh />}
          isActive={activePage === Page.PhuHuynh}
          onClick={() => setActivePage(Page.PhuHuynh)}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
