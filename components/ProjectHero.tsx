import React from 'react';
import { Product } from '../types';

interface ProjectHeroProps {
  product: Product;
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ product }) => {
  const progress = Math.min((product.currentAmount / product.goalAmount) * 100, 100);
  const today = new Date();
  const endDate = new Date(product.endDate);
  const diffTime = Math.abs(endDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 mb-10">
      {/* Left: Image Grid (4-split) */}
      <div className="w-full lg:w-[60%] flex-shrink-0">
        <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-[4/3] rounded-xl overflow-hidden bg-slate-50">
          {product.images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative w-full h-full group overflow-hidden">
               <img 
                 src={img} 
                 alt={`Slide ${idx}`} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
            </div>
          ))}
          {/* Fill remaining slots if less than 4 images */}
          {product.images.length < 4 && Array.from({ length: 4 - product.images.length }).map((_, idx) => (
             <div key={`placeholder-${idx}`} className="bg-slate-200 w-full h-full flex items-center justify-center text-slate-400">
                <span className="text-2xl">No Image</span>
             </div>
          ))}
        </div>
      </div>

      {/* Right: Project Info */}
      <div className="w-full lg:w-[40%] flex flex-col pt-2">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[13px] font-medium text-slate-500 hover:underline cursor-pointer">
               &lt; {product.category}
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
        <div className="space-y-3 mb-8 text-[14px] flex-1">
           <div className="flex items-start">
             <span className="w-24 text-slate-500 font-medium flex-shrink-0">목표 금액</span>
             <span className="text-slate-900 font-medium">{product.goalAmount.toLocaleString()}원</span>
           </div>
           <div className="flex items-start">
             <span className="w-24 text-slate-500 font-medium flex-shrink-0">펀딩 기간</span>
             <div className="flex flex-col">
                <span className="text-slate-900 font-medium">{product.startDate.replaceAll('-','.')} ~ {product.endDate.replaceAll('-','.')}</span>
                <span className="text-[#ff6b6b] bg-[#fff0f0] px-1.5 py-0.5 rounded text-[11px] font-bold self-start mt-1">{diffDays}일 남음</span>
             </div>
           </div>
           <div className="flex items-start">
             <span className="w-24 text-slate-500 font-medium flex-shrink-0">결제 시점</span>
             <span className="text-slate-900 font-medium">후원 시 즉시 결제</span>
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
        <div className="flex gap-3 h-[52px]">
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