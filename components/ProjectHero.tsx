import React, { useState } from 'react';
import { Product } from '../types';

interface ProjectHeroProps {
  product: Product;
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const progress = Math.min((product.currentAmount / product.goalAmount) * 100, 100);
  const today = new Date();
  const endDate = new Date(product.endDate);
  const diffTime = Math.abs(endDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Helper to ensure paths are absolute (start with /) for public folder assets
  const resolvePath = (path: string) => {
    const trimmed = path.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('data:')) return trimmed;
    // If it doesn't start with /, add it.
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevent infinite loop
    // Fallback placeholder service
    e.currentTarget.src = 'https://placehold.co/800x600/f1f5f9/94a3b8?text=Image+Not+Found';
    e.currentTarget.alt = '이미지를 불러올 수 없습니다';
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-10 mb-10">
      {/* Left: Image Area (Gallery) */}
      <div className="w-full lg:w-[60%] flex-shrink-0 flex flex-col gap-3">
        {/* Main Large Image */}
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative group">
           <img 
             key={activeImageIndex} // Re-render on change for animation if needed
             src={resolvePath(product.images[activeImageIndex] || product.images[0])} 
             alt="Main Project Visual" 
             className="w-full h-full object-cover transition-opacity duration-300"
             onError={handleImageError}
           />
        </div>
        
        {/* Thumbnails (Only if more than 1 image) */}
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx 
                  ? 'border-[#00c7ae] ring-1 ring-[#00c7ae]' 
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                <img 
                  src={resolvePath(img)} 
                  alt={`Thumbnail ${idx}`} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Project Info */}
      <div className="w-full lg:w-[40%] flex flex-col pt-2">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[13px] font-bold text-[#00c7ae] bg-[#e0f7f4] px-2 py-0.5 rounded">
               {product.category}
             </span>
          </div>
          <h1 className="text-[28px] font-bold text-slate-900 leading-snug break-keep tracking-tight">
            {product.title}
          </h1>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-[14px] text-slate-500 font-medium">모인 금액</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-1">
               <span className="text-[32px] font-bold text-slate-900 font-['Roboto']">{product.currentAmount.toLocaleString()}</span>
               <span className="text-[18px] font-normal text-slate-900">원</span>
            </div>
            <span className="text-[24px] font-bold text-[#00c7ae]">{progress}%</span>
          </div>
          
          <div className="w-full h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-[#00c7ae]" style={{ width: `${progress}%` }}></div>
          </div>
          
          <p className="text-[15px] font-medium text-slate-900">
            <span className="text-[#00c7ae] font-bold">{product.supporterCount}명</span>이 후원했어요
          </p>
        </div>

        {/* Definition List */}
        <div className="space-y-4 mb-8 text-[15px] flex-1">
           <div className="flex items-start pb-4 border-b border-slate-50">
             <span className="w-24 text-slate-500 font-medium flex-shrink-0">목표 금액</span>
             <span className="text-slate-900 font-medium">{product.goalAmount.toLocaleString()}원</span>
           </div>
           <div className="flex items-start pb-4 border-b border-slate-50">
             <span className="w-24 text-slate-500 font-medium flex-shrink-0">펀딩 기간</span>
             <div className="flex flex-col">
                <span className="text-slate-900 font-medium">{product.startDate.replace(/-/g, '.')} ~ {product.endDate.replace(/-/g, '.')}</span>
                <span className="text-[#ff6b6b] bg-[#fff0f0] px-2 py-0.5 rounded text-[12px] font-bold self-start mt-1.5">{diffDays}일 남음</span>
             </div>
           </div>
           <div className="flex items-start">
             <span className="w-24 text-slate-500 font-medium flex-shrink-0">펀딩 방식</span>
             <span className="text-slate-900 font-medium flex items-center gap-1">
               무조건 리워드
               <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </span>
           </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 h-[56px]">
           <button className="w-[56px] h-full border border-slate-200 rounded-lg flex flex-col items-center justify-center hover:bg-slate-50 transition-colors group">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">0</span>
           </button>
           <button 
             className="flex-1 bg-[#00c7ae] text-white text-[18px] font-bold rounded-lg hover:bg-[#00b29b] shadow-sm hover:shadow transition-all"
             onClick={() => document.getElementById('reward-section')?.scrollIntoView({ behavior: 'smooth' })}
           >
             이 프로젝트 후원하기
           </button>
           <button className="w-[56px] h-full border border-slate-200 rounded-lg flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
             <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
             <span className="text-[10px] text-slate-500 font-medium mt-0.5">공유</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHero;