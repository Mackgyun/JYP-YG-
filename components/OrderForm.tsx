import React from 'react';
import { UserProfile, Product, Reward } from '../types';

interface OrderFormProps {
  user: UserProfile | null;
  product: Product;
  onLoginRequest: () => void;
  onRewardSelected: (reward: Reward) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ user, product, onLoginRequest, onRewardSelected }) => {
  
  const handleRewardClick = (reward: Reward) => {
    // If user is not logged in, prompt login
    if (!user) {
      if(confirm('로그인이 필요한 서비스입니다. 구글 로그인 하시겠습니까?')) {
        onLoginRequest();
      }
      return;
    }
    // If logged in, proceed to checkout view in parent
    onRewardSelected(reward);
  };

  return (
    <div id="reward-section" className="space-y-3 pb-4 lg:pb-10">
       <h3 className="font-bold text-slate-900 text-[16px] mb-3 hidden lg:block">리워드 선택</h3>
        {product.rewards.map((reward) => (
          <div 
            key={reward.id}
            onClick={() => handleRewardClick(reward)}
            className={`bg-white border border-slate-200 rounded-xl p-5 cursor-pointer transition-all hover:border-[#00c7ae] hover:shadow-md group relative`}
          >
            {/* Header: Backer Count */}
            <div className="flex items-center gap-1.5 mb-2">
               <svg className="w-4 h-4 text-[#00c7ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span className="text-slate-500 font-medium text-[12px]">0명 참여</span>
            </div>

            {/* Price & Remaining */}
            <div className="flex items-center justify-between mb-2">
               <span className="text-[20px] font-bold text-slate-900 tracking-tight">{reward.price.toLocaleString()}원+</span>
               <span className="text-[11px] text-[#ff6b6b] bg-[#fff0f0] px-1.5 py-0.5 rounded font-bold">{reward.remaining}개 남음</span>
            </div>
            
            {/* Title */}
            <p className="text-slate-800 text-[14px] font-normal mb-4 leading-snug break-keep">{reward.title}</p>
            
            {/* Items List (Bullet points if needed, but currently simplistic) */}
            <ul className="mb-4 space-y-1">
              {reward.items.map((item, idx) => (
                <li key={idx} className="text-[13px] text-slate-500 flex items-start before:content-['•'] before:mr-1.5 before:text-slate-400">
                  {item}
                </li>
              ))}
            </ul>
            
            {/* Delivery Info Block - Simplified */}
            <div className="flex items-start gap-2 pt-3 border-t border-dashed border-slate-100">
               <div className="flex flex-col">
                 <p className="text-[13px] text-slate-600 leading-snug break-keep flex items-start gap-1">
                   <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                   <span>현장수령 (닉네임 입장 희망 시 성함을 닉네임으로 기재해주세요)</span>
                 </p>
               </div>
            </div>
            
            {/* Hover Action Text (Desktop) */}
            <div className="hidden lg:flex absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 items-center justify-center transition-opacity rounded-xl backdrop-blur-[1px]">
                <span className="bg-[#00c7ae] text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">이 리워드 선택하기</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OrderForm;