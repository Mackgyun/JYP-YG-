import React, { useEffect } from 'react';

interface RewardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const RewardDrawer: React.FC<RewardDrawerProps> = ({ isOpen, onClose, children }) => {
  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      {/* Drawer Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-5 pb-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900">리워드 선택</h3>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 pb-10 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RewardDrawer;