import React from 'react';
import { Product } from '../types';
import { PROJECT_IMAGES } from '../constants';

interface ProjectHeroProps {
  product: Product;
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ product }) => {
  // Use URL string from constants
  const heroImages = [PROJECT_IMAGES.fourGrid];

  const progress = Math.min((product.currentAmount / product.goalAmount) * 100, 100);
  const today = new Date();
  const endDate = new Date(product.endDate);
  const diffTime = Math.abs(endDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevent infinite loop
    e.currentTarget.src = 'https://placehold.co/800x600/f1f5f9/94a3b8?text=Image+Not+Found';
    e.currentTarget.alt = '이미지를 불러올 수 없습니다';
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-12 mb-6 lg:mb-10">
      {/* Left: Image Area */}
      <div className="w-full lg:w-[60%] flex-shrink-0">
        {/* Mobile: Always show single main image */}
        <div className="block lg:hidden aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative">
             <img 
               src={heroImages[0]} 
               alt="Main Project Visual" 
               className="w-full h-full object-cover"
               onError={handleImageError}
             />
             <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
               1 / {heroImages.length}
             </div>
        </div>

        {/* Desktop: Grid or Full Layout */}
        <div className="hidden lg:block w-full h-full">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative group p-8 flex items-center justify-center">
              <img 
                src={heroImages[0]} 
                alt="Main Project Visual" 
                className="w-full h-full object-contain shadow-sm rounded-lg"
                onError={handleImageError}
              />
          </div>
        </div>
      </div>

      {/* Right: Project Info */}
      <div className="w-full lg:w-[40%] flex flex-col pt-1 lg:pt-2">
        <div className="mb-4 lg:mb-6">
          <div className="flex items-center gap-2 mb-2 lg:mb-3">
             <span className="text-[10px] lg:text-[13px] font-medium text-slate-500 hover:underline cursor-pointer bg-slate-100 px-2 py-0.5 rounded">
               {product.category}
             </span>
          </div>
          {/* Mobile Title Reduced to 18px */}
          <h1 className="text-[18px] lg:text-[28px] font-bold text-slate-900 leading-snug break-keep tracking-tight">
            {product.title}
          </h1>
        </div>

        <div className="mb-6 lg:mb-8">
          <div className="flex items-baseline gap-1 mb-1 lg:mb-2">
            <span className="text-[11px] lg:text-[14px] text-slate-500 font-medium">모인 금액</span>
          </div>
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="flex items-baseline gap-1">
               {/* Amount Reduced to 22px */}
               <span className="text-[22px] lg:text-[32px] font-bold text-slate-900 font-['Roboto']">{product.currentAmount.toLocaleString()}</span>
               <span className="text-[13px] lg:text-[18px] font-normal text-slate-900">원</span>
            </div>
            <span className="text-[16px] lg:text-[24px] font-bold text-[#00c7ae]">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full h-1.5 lg:h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-[#00c7ae]" style={{ width: `${progress}%` }}></div>
          </div>
          
          <p className="text-[12px] lg:text-[15px] font-medium text-slate-900">
            <span className="text-[#00c7ae] font-bold">{product.supporterCount}명</span>이 후원했어요
          </p>
        </div>

        {/* Definition List */}
        <div className="space-y-2 lg:space-y-3 mb-8 text-[12px] lg:text-[14px] flex-1 border-t border-slate-100 pt-5 lg:border-none lg:pt-0">
           <div className="flex items-start">
             <span className="w-20 lg:w-24 text-slate-500 font-medium flex-shrink-0">목표 금액</span>
             <span className="text-slate-900 font-medium">{product.goalAmount.toLocaleString()}원</span>
           </div>
           <div className="flex items-start">
             <span className="w-20 lg:w-24 text-slate-500 font-medium flex-shrink-0">펀딩 기간</span>
             <div className="flex flex-col">
                <span className="text-slate-900 font-medium">{product.startDate.replace(/-/g, '.')} ~ {product.endDate.replace(/-/g, '.')}</span>
                <span className="text-[#ff6b6b] bg-[#fff0f0] px-1.5 py-0.5 rounded text-[10px] lg:text-[11px] font-bold self-start mt-1">{diffDays}일 남음</span>
             </div>
           </div>
           <div className="flex items-start">
             <span className="w-20 lg:w-24 text-slate-500 font-medium flex-shrink-0">결제 시점</span>
             <span className="text-slate-900 font-medium">후원 시 즉시 결제</span>
           </div>
           <div className="flex items-start">
             <span className="w-20 lg:w-24 text-slate-500 font-medium flex-shrink-0">펀딩 방식</span>
             <span className="text-slate-900 font-medium flex items-center gap-1">
               무조건 리워드
             </span>
           </div>
        </div>

        {/* Desktop Buttons (Hidden on Mobile) */}
        <div className="hidden lg:flex gap-3 h-[52px]">
           <button className="w-[52px] h-full border border-slate-200 rounded-lg flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">0</span>
           </button>
           <button 
             className="flex-1 bg-[#e0f7f4] text-[#00c7ae] text-[18px] font-bold rounded-lg hover:bg-[#00c7ae] hover:text-white transition-all"
             onClick={() => document.getElementById('reward-section')?.scrollIntoView({ behavior: 'smooth' })}
           >
             후원하기
           </button>
           <button className="w-[52px] h-full border border-slate-200 rounded-lg flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
             <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
             <span className="text-[10px] text-slate-500 font-medium mt-0.5">0</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHero;