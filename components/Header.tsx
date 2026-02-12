import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenOrders: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout, onOpenOrders }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 h-14 lg:h-16 flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Logo */}
          <div className="cursor-pointer flex items-center gap-0.5 select-none" onClick={() => window.location.reload()}>
            <span className="text-[20px] lg:text-2xl font-bold text-slate-700 tracking-tighter">OHMY</span>
            <span className="text-[20px] lg:text-2xl font-bold text-[#00c7ae] tracking-tighter">COMPANY</span>
          </div>

          {/* Simplified Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-[16px] font-bold text-[#00c7ae]">후원하기</a>
          </nav>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {user ? (
            <div className="flex items-center gap-2 lg:gap-4">
               {/* My Orders / Admin Button - Always Visible */}
               <button 
                onClick={onOpenOrders}
                className="text-[13px] lg:text-[15px] font-medium text-slate-500 hover:text-[#00c7ae] transition-colors whitespace-nowrap"
              >
                {user.email?.includes('admin') ? '관리' : '내 후원'}
              </button>
              
              {/* Desktop Divider & Logout Button (Hidden on Mobile) */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="w-px h-3 bg-slate-300"></div>
                <button 
                    onClick={onLogout}
                    className="text-[15px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                    로그아웃
                </button>
              </div>

              {/* Profile Avatar & Dropdown Trigger */}
              <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#e0f7f4] flex items-center justify-center text-[#00c7ae] font-bold border border-[#b2ebe4] hover:bg-[#d0f0ec] transition-colors"
                  >
                    {user.displayName?.[0] || 'U'}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                            <p className="text-xs text-slate-400 font-medium mb-0.5">로그인 정보</p>
                            <p className="text-sm font-bold text-slate-800 truncate leading-tight">{user.displayName}</p>
                            <p className="text-xs text-slate-400 truncate leading-tight mt-0.5">{user.email}</p>
                        </div>
                        
                        {/* Logout Button in Popup */}
                        <button 
                          onClick={() => {
                            onLogout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          로그아웃
                        </button>
                    </div>
                  )}
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="text-[13px] lg:text-[15px] font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg lg:bg-transparent lg:px-0 lg:py-0"
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