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
  
  const [formData, setFormData] = useState({
    contactName: '',
    contactPhone: '',
    depositorName: '',
    address: '현장수령' 
  });

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
    <div id="reward-section" className="space-y-3 pb-10">
       <h3 className="font-bold text-slate-900 text-[18px] mb-4">리워드 선택</h3>
        {product.rewards.map((reward) => (
          <div 
            key={reward.id}
            onClick={() => handleRewardClick(reward)}
            className={`bg-white border rounded-xl p-6 cursor-pointer transition-all hover:border-[#00c7ae] hover:shadow-sm group relative ${selectedReward?.id === reward.id ? 'border-[#00c7ae] ring-1 ring-[#00c7ae]' : 'border-slate-200'}`}
          >
            {/* Header: Backer Count */}
            <div className="flex items-center gap-1.5 mb-3">
               <svg className="w-5 h-5 text-[#00c7ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span className="text-[#00c7ae] font-bold text-[14px]">0명 후원</span>
            </div>

            {/* Price & Remaining */}
            <div className="flex items-center justify-between mb-3">
               <span className="text-[24px] font-bold text-slate-900 tracking-tight">{reward.price.toLocaleString()}원+</span>
               <span className="text-[12px] text-[#ff6b6b] bg-[#fff0f0] px-2 py-1 rounded font-bold">{reward.remaining}개 남음</span>
            </div>
            
            {/* Title */}
            <p className="text-slate-800 text-[16px] font-medium mb-5">{reward.title}</p>
            
            {/* Delivery Info Block */}
            <div className="flex items-start gap-2.5">
               <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               <div className="flex flex-col">
                 <span className="text-[13px] font-bold text-slate-700 mb-1">배송일</span>
                 <p className="text-[13px] text-slate-500 leading-relaxed break-keep">
                   현장에서는 펀딩 참여자 이름으로 입장을 확인합니다. 실명이 아닌 닉네임으로 입장하고 싶은 경우, 결제 단계의 수령인 정보에서 이름을 닉네임으로 변경해 주세요.
                 </p>
               </div>
            </div>

            {/* Selected Form (Expandable) */}
            {selectedReward?.id === reward.id && (
              <div className="mt-5 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-1">성함 (실명 또는 닉네임)</label>
                    <input 
                      type="text" 
                      name="contactName" 
                      value={formData.contactName}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-[14px] focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-1">연락처</label>
                    <input 
                      type="text" 
                      name="contactPhone" 
                      placeholder="- 없이 입력"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-[14px] focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-1">입금자명</label>
                    <input 
                      type="text" 
                      name="depositorName" 
                      value={formData.depositorName}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-[14px] focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none"
                    />
                  </div>
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#00c7ae] text-white font-bold py-3.5 rounded-lg hover:bg-[#00b29b] transition-colors mt-2 text-[15px] shadow-sm"
                  >
                    {loading ? '처리 중...' : '밀어주기'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default OrderForm;