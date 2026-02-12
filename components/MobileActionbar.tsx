import React from 'react';
import { Product } from '../types';

interface MobileActionbarProps {
  product: Product;
  onOpenReward: () => void;
}

const MobileActionbar: React.FC<MobileActionbarProps> = ({ product, onOpenReward }) => {
  const progress = Math.min((product.currentAmount / product.goalAmount) * 100, 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-safe z-40 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-500">
      <div className="flex items-center gap-3">
        {/* Left: Status Summary */}
        <div className="flex flex-col justify-center pl-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[#00c7ae] font-bold text-sm">{Math.round(progress)}%</span>
            <span className="text-slate-400 text-xs">달성</span>
          </div>
          <span className="text-slate-900 font-bold text-sm">{product.currentAmount.toLocaleString()}원</span>
        </div>

        {/* Right: Action Button */}
        <button 
          onClick={onOpenReward}
          className="flex-1 bg-[#00c7ae] text-white font-bold text-lg h-12 rounded-lg hover:bg-[#00b29b] transition-colors shadow-sm active:scale-[0.98]"
        >
          후원하기
        </button>
      </div>
      {/* iOS Safe Area Spacer is handled by padding-bottom utility if configured, utilizing standard padding for now */}
      <div className="h-1"></div>
    </div>
  );
};

export default MobileActionbar;