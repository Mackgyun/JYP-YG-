import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenOrders: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout, onOpenOrders }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 h-16 flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="cursor-pointer flex items-center gap-1 select-none">
            <span className="text-2xl font-bold text-slate-700 tracking-tighter">OHMY</span>
            <span className="text-2xl font-bold text-[#00c7ae] tracking-tighter">COMPANY</span>
          </div>

          {/* Simplified Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-[16px] font-bold text-[#00c7ae]">후원하기</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               <button 
                onClick={onOpenOrders}
                className="text-[15px] font-medium text-slate-500 hover:text-[#00c7ae] transition-colors"
              >
                {user.email?.includes('admin') ? '관리' : '내 후원'}
              </button>
              <div className="w-px h-3 bg-slate-300"></div>
              <button 
                onClick={onLogout}
                className="text-[15px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                로그아웃
              </button>
              <div className="w-9 h-9 rounded-full bg-[#e0f7f4] flex items-center justify-center text-[#00c7ae] font-bold border border-[#b2ebe4]">
                {user.displayName?.[0] || 'U'}
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="text-[15px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;