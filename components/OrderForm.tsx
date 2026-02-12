import React, { useState } from 'react';
import { UserProfile, Product, Reward } from '../types';
import { createOrder } from '../services/firebase';

interface OrderFormProps {
  user: UserProfile | null;
  product: Product;
  onLoginRequest: () => void;
  onOrderSuccess: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ user, product, onLoginRequest, onOrderSuccess }) => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    contactName: '',
    contactPhone: '',
    depositorName: '',
    address: '현장수령' 
  });

  const progress = Math.min((product.currentAmount / product.goalAmount) * 100, 100);
  const today = new Date();
  const endDate = new Date(product.endDate);
  const diffTime = Math.abs(endDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  const handleRewardClick = (reward: Reward) => {
    if (!user) {
      if(confirm('로그인이 필요한 서비스입니다. 구글 로그인 하시겠습니까?')) {
        onLoginRequest();
      }
      return;
    }
    setSelectedReward(reward);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedReward) return;
    
    setLoading(true);
    
    const orderPayload = {
      userId: user.uid,
      userEmail: user.email || 'unknown',
      userName: user.displayName || 'Anonymous',
      productName: product.title,
      rewardTitle: selectedReward.title,
      totalAmount: selectedReward.price,
      ...formData,
      quantity: 1 
    };

    const success = await createOrder(orderPayload);
    setLoading(false);

    if (success) {
      alert("후원이 완료되었습니다!");
      setSelectedReward(null);
      setFormData({ contactName: '', contactPhone: '', depositorName: '', address: '현장수령' });
      onOrderSuccess();
    } else {
      alert("후원 처리에 실패했습니다.");
    }
  };

  return (
    <div className="hidden lg:block w-[340px] flex-shrink-0 relative">
      {/* TOP SECTION: Project Info (Static, scrolls away) */}
      <div className="bg-white pb-6">
        <div className="text-[13px] text-slate-500 font-bold mb-3 tracking-tight">
           {product.category}
        </div>
        
        <h2 className="text-[24px] font-bold text-slate-900 leading-snug break-keep tracking-tight mb-6">
          {product.title}
        </h2>

        <div className="space-y-4 mb-6">
           <div>
             <div className="text-[13px] text-slate-500 mb-1">모인 금액</div>
             <div className="flex items-baseline gap-1">
               <span className="text-[30px] font-bold text-slate-900 font-['Roboto']">{product.currentAmount.toLocaleString()}</span>
               <span className="text-[16px] font-normal text-slate-900">원</span>
             </div>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="text-[14px] text-slate-500">
                <span className="text-[#00c7ae] font-bold text-[18px] mr-1">{progress}%</span> 달성
              </div>
              <div className="text-[14px] text-slate-500">
                <span className="font-bold text-slate-900">{product.supporterCount}명</span> 후원
              </div>
           </div>
        </div>

        <hr className="border-slate-100 mb-5"/>

        {/* Info Rows */}
        <div className="space-y-3 text-[13px] mb-6">
           <div className="flex">
             <span className="w-20 text-slate-400 font-medium">목표 금액</span>
             <span className="text-slate-800 font-medium">{product.goalAmount.toLocaleString()}원</span>
           </div>
           <div className="flex">
             <span className="w-20 text-slate-400 font-medium">펀딩 기간</span>
             <div className="flex flex-col">
               <span className="text-slate-800 font-medium">{product.startDate.replaceAll('-','.')} ~ {product.endDate.replaceAll('-','.')}</span>
               <span className="text-[#ff6b6b] bg-[#fff0f0] px-1.5 py-0.5 rounded w-fit mt-1 font-bold text-[11px]">{diffDays}일 남음</span>
             </div>
           </div>
           <div className="flex">
             <span className="w-20 text-slate-400 font-medium">결제 시점</span>
             <span className="text-slate-800 font-medium">후원 시 즉시 결제</span>
           </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 h-12 mb-2">
           <button className="w-12 h-full border border-slate-200 rounded flex flex-col items-center justify-center gap-0.5 hover:border-slate-300 transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <span className="text-[10px] text-slate-500">0</span>
           </button>
           <button 
              className="flex-1 bg-[#e0f7f4] text-[#00c7ae] text-[16px] font-bold rounded hover:bg-[#00c7ae] hover:text-white transition-all"
              onClick={() => document.getElementById('reward-section')?.scrollIntoView({ behavior: 'smooth' })}
           >
             후원하기
           </button>
           <button className="w-12 h-full border border-slate-200 rounded flex flex-col items-center justify-center gap-0.5 hover:border-slate-300 transition-colors">
             <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
           </button>
        </div>
      </div>

      {/* BOTTOM SECTION: Rewards (Sticky) */}
      {/* Added border-t to create visual separation from the top section */}
      <div id="reward-section" className="sticky top-[80px] bg-white border-t border-slate-200 pt-6 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
        <h3 className="font-bold text-slate-900 text-[16px] mb-4 bg-white">리워드 선택</h3>
        <div className="space-y-3 pb-10">
          {product.rewards.map((reward) => (
            <div 
              key={reward.id}
              onClick={() => handleRewardClick(reward)}
              className={`border rounded-lg p-5 cursor-pointer transition-all hover:border-[#00c7ae] bg-white group ${selectedReward?.id === reward.id ? 'border-[#00c7ae] ring-1 ring-[#00c7ae]' : 'border-slate-200'}`}
            >
              <div className="flex justify-between items-center mb-1">
                 <div className="flex items-center gap-1 text-[#00c7ae] text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   선택하기
                 </div>
                 <span className="text-[11px] text-slate-400">0명 선택</span>
              </div>
              
              <div className="flex justify-between items-baseline mb-3">
                 <span className="text-[18px] font-bold text-slate-900 tracking-tight">{reward.price.toLocaleString()}원 +</span>
              </div>
              
              <p className="text-slate-600 text-[14px] mb-4 leading-snug">{reward.description}</p>
              
              <ul className="text-[12px] text-slate-500 list-disc list-inside space-y-0.5 border-t border-dashed border-slate-100 pt-3">
                 {reward.items.map((item, idx) => (
                   <li key={idx}>{item}</li>
                 ))}
              </ul>

              {selectedReward?.id === reward.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      name="contactName" 
                      placeholder="성함 (실명)"
                      value={formData.contactName}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-[13px] focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none"
                    />
                    <input 
                      type="text" 
                      name="contactPhone" 
                      placeholder="연락처 (- 없이)"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-[13px] focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none"
                    />
                    <input 
                      type="text" 
                      name="depositorName" 
                      placeholder="입금자명 (닉네임)"
                      value={formData.depositorName}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-[13px] focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none"
                    />
                    
                    <button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-[#00c7ae] text-white font-bold py-3 rounded hover:bg-[#00b29b] transition-colors mt-2 text-[14px]"
                    >
                      {loading ? '...' : '밀어주기'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;