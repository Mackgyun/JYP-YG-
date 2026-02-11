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
    address: '현장수령' // Default for this event
  });

  const progress = Math.min((product.currentAmount / product.goalAmount) * 100, 100);
  // Calculate remaining days roughly
  const today = new Date();
  const endDate = new Date(product.endDate);
  const diffTime = Math.abs(endDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  const handleRewardClick = (reward: Reward) => {
    if (!user) {
      if(confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
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
      quantity: 1 // Default to 1 for this event logic
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
    <div className="hidden lg:block w-[360px] flex-shrink-0">
      <div className="sticky top-24 space-y-8">
        
        {/* Project Meta Info */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-slate-500 mb-1">문화·출판</div>
          <h2 className="text-2xl font-bold text-slate-900 leading-snug break-keep">
            {product.title}
          </h2>

          <div className="space-y-1">
             <div className="text-sm text-slate-500">모인 금액</div>
             <div className="flex items-baseline gap-2">
               <span className="text-3xl font-bold text-slate-900">{product.currentAmount.toLocaleString()}</span>
               <span className="text-xl font-normal text-slate-900">원</span>
               <span className="text-2xl font-bold text-teal-500 ml-auto">{progress}%</span>
             </div>
          </div>

          <div className="text-sm text-slate-500 flex items-center gap-1">
             <span className="font-bold text-slate-900">{product.supporterCount}명</span>이 후원했어요
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm border border-slate-100">
             <div className="flex">
               <span className="w-20 text-slate-500 font-medium">목표 금액</span>
               <span className="text-slate-900">{product.goalAmount.toLocaleString()}원</span>
             </div>
             <div className="flex">
               <span className="w-20 text-slate-500 font-medium">펀딩 기간</span>
               <span className="text-slate-900">{product.startDate} ~ {product.endDate} <span className="text-red-400 text-xs bg-red-50 px-1 py-0.5 rounded ml-1">{diffDays}일 남음</span></span>
             </div>
             <div className="flex">
               <span className="w-20 text-slate-500 font-medium">결제 시점</span>
               <span className="text-slate-900">후원 시 즉시 결제</span>
             </div>
          </div>

          <div className="flex gap-3">
             <button className="flex-1 border border-slate-200 rounded-lg py-3 flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span className="text-sm text-slate-600">0</span>
             </button>
             <button className="flex-[3] bg-teal-50 text-teal-600 font-bold rounded-lg py-3 hover:bg-teal-100 transition-colors">
               후원하기
             </button>
             <button className="flex-1 border border-slate-200 rounded-lg py-3 flex items-center justify-center hover:bg-slate-50 transition-colors">
               <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
             </button>
          </div>
        </div>

        {/* Reward List */}
        <div className="space-y-4">
          {product.rewards.map((reward) => (
            <div 
              key={reward.id}
              onClick={() => handleRewardClick(reward)}
              className={`border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${selectedReward?.id === reward.id ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50/20' : 'border-slate-200 bg-white'}`}
            >
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-1 text-teal-500 text-sm font-medium">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   0명 후원
                 </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                 <span className="text-xl font-bold text-slate-900">{reward.price.toLocaleString()}원+</span>
                 <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-medium">{reward.remaining}개 남음</span>
              </div>
              
              <p className="text-slate-600 text-sm mb-4">{reward.description}</p>
              
              <div className="space-y-1">
                 <p className="text-xs font-bold text-slate-500">리워드 구성</p>
                 <ul className="text-xs text-slate-500 list-disc list-inside">
                   {reward.items.map((item, idx) => (
                     <li key={idx}>{item}</li>
                   ))}
                 </ul>
              </div>

              {selectedReward?.id === reward.id && (
                <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-bold text-sm text-slate-800 mb-3">후원 정보 입력</h4>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      name="contactName" 
                      placeholder="후원자 성함 (실명)"
                      value={formData.contactName}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                    <input 
                      type="text" 
                      name="contactPhone" 
                      placeholder="연락처"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                    <input 
                      type="text" 
                      name="depositorName" 
                      placeholder="입금자명 (닉네임)"
                      value={formData.depositorName}
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                    <div className="text-xs text-slate-400 px-1">
                      * 현장 수령 상품입니다. (배송지 입력 불필요)
                    </div>
                    <button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? '처리 중...' : `${reward.price.toLocaleString()}원 후원하기`}
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