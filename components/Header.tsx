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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 h-16 sm:h-20 flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo - Text based to emulate the image */}
          <div className="cursor-pointer flex items-center gap-1">
            <span className="text-2xl font-bold text-slate-600 tracking-tighter">OHMY</span>
            <span className="text-2xl font-bold text-teal-500 tracking-tighter">COMPANY</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-[17px] font-bold text-teal-500 hover:text-teal-600">후원하기</a>
            <a href="#" className="text-[17px] font-bold text-slate-700 hover:text-teal-500">투자하기</a>
            <a href="#" className="text-[17px] font-bold text-slate-700 hover:text-teal-500">오픈예정</a>
            <a href="#" className="text-[17px] font-bold text-slate-700 hover:text-teal-500">가이드</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
               <button 
                onClick={onOpenOrders}
                className="text-sm font-medium text-slate-500 hover:text-teal-600"
              >
                {user.email?.includes('admin') ? '관리' : '내 후원'}
              </button>
              <div className="w-px h-3 bg-slate-300"></div>
              <button 
                onClick={onLogout}
                className="text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                로그아웃
              </button>
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                {user.displayName?.[0] || 'U'}
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              로그인
            </button>
          )}

          <button className="hidden sm:block px-5 py-2.5 bg-teal-500 text-white font-bold rounded hover:bg-teal-600 transition-colors shadow-sm text-sm">
            펀딩 신청하기
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;