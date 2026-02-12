import React, { useState, useEffect } from 'react';
import { UserProfile, Product, Reward } from '../types';
import { createOrder } from '../services/firebase';

interface CheckoutProps {
  user: UserProfile;
  product: Product;
  reward: Reward;
  onCancel: () => void;
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ user, product, reward, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: user.displayName || '',
    userPhone: '',
    recipientName: user.displayName || '',
    recipientPhone: '',
    address: '',
    memo: '배송 전 미리 연락주세요.',
    depositorName: user.displayName || ''
  });

  // State for mandatory agreements
  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false
  });

  const [useUserInfo, setUseUserInfo] = useState(true);

  // Sync recipient info with user info if checkbox is checked
  useEffect(() => {
    if (useUserInfo) {
      setFormData(prev => ({
        ...prev,
        recipientName: prev.userName,
        recipientPhone: prev.userPhone
      }));
    }
  }, [useUserInfo, formData.userName, formData.userPhone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // 1. Validate Agreements
    if (!agreements.privacy || !agreements.terms) {
      alert("필수 항목(개인정보 제공 동의, 유의사항 확인)에 모두 동의해주셔야 후원이 가능합니다.");
      return;
    }

    // 2. Basic Form Validation
    if (!formData.userName || !formData.recipientName || !formData.recipientPhone || !formData.depositorName) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    
    const orderPayload = {
      userId: user.uid,
      userEmail: user.email || 'unknown',
      userName: formData.userName,
      contactName: formData.recipientName,
      contactPhone: formData.recipientPhone,
      depositorName: formData.depositorName,
      address: formData.address || '현장수령',
      productName: product.title,
      rewardTitle: reward.title,
      totalAmount: reward.price,
      quantity: 1 
    };

    const success = await createOrder(orderPayload);
    setLoading(false);

    if (success) {
      onSuccess();
    } else {
      alert("주문 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-slate-900">프로젝트 후원하기</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Forms */}
        <div className="flex-1 space-y-8">
          
          {/* 1. Reward Info */}
          <div className="border-b border-slate-200 pb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">선택한 리워드</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="font-bold text-slate-800 mb-1">{product.title}</p>
              <p className="text-sm text-slate-600 mb-2">{reward.title}</p>
              <p className="text-right font-bold text-[#00c7ae]">{reward.price.toLocaleString()}원</p>
            </div>
          </div>

          {/* 2. Supporter Info */}
          <div className="border-b border-slate-200 pb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">후원자 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">이름</label>
                <input 
                  type="text" 
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="이름 입력"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">휴대폰 번호</label>
                <input 
                  type="text" 
                  name="userPhone"
                  value={formData.userPhone}
                  onChange={handleChange}
                  placeholder="01012345678"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 3. Shipping Info */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">리워드 수령 정보</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useUserInfo} 
                  onChange={(e) => setUseUserInfo(e.target.checked)}
                  className="w-4 h-4 text-[#00c7ae] rounded border-slate-300 focus:ring-[#00c7ae]" 
                />
                <span className="text-sm text-slate-600">후원자 정보와 동일</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1.5"><span className="text-[#00c7ae]">*</span> 받는 분</label>
                  <input 
                    type="text" 
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1.5"><span className="text-[#00c7ae]">*</span> 휴대폰 번호</label>
                  <input 
                    type="text" 
                    name="recipientPhone"
                    value={formData.recipientPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">주소 (현장수령 시 '현장수령' 입력)</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="주소를 입력해주세요"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">배송 메모</label>
                <select 
                  name="memo"
                  value={formData.memo}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none bg-white"
                >
                  <option>배송 전 미리 연락주세요.</option>
                  <option>부재 시 경비실에 맡겨주세요.</option>
                  <option>부재 시 문 앞에 놓아주세요.</option>
                  <option>직접 입력</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Payment Method - ONLY BANK TRANSFER */}
          <div>
             <h3 className="text-lg font-bold text-slate-900 mb-4">결제 수단</h3>
             <div className="border-2 border-[#00c7ae] bg-green-50/50 rounded-lg p-5 flex items-center justify-between cursor-pointer relative shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-100 text-2xl shadow-sm">
                        🏦
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-[#00c7ae]">무통장 입금 (계좌이체)</span>
                        <span className="text-xs text-slate-500 mt-0.5">후원 참여 완료 시 입금하실 계좌번호가 안내됩니다.</span>
                    </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-[#00c7ae] flex items-center justify-center bg-white">
                    <div className="w-3 h-3 rounded-full bg-[#00c7ae]"></div>
                </div>
             </div>
             
             {/* Depositor Name */}
             <div className="mt-4 p-5 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-bold text-slate-600 mb-1.5"><span className="text-[#00c7ae]">*</span> 입금자명</label>
                <input 
                  type="text" 
                  name="depositorName"
                  value={formData.depositorName}
                  onChange={handleChange}
                  placeholder="실제 입금하실 분의 성함을 입력해주세요"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded focus:border-[#00c7ae] focus:ring-1 focus:ring-[#00c7ae] outline-none transition-colors bg-white"
                />
             </div>
          </div>

        </div>

        {/* Right Column: Summary & Submit (Sticky) */}
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <div className="sticky top-24 border border-slate-200 rounded-lg p-6 shadow-sm bg-white">
            <h4 className="font-bold text-slate-900 text-lg mb-4">최종 후원 금액</h4>
            <div className="flex justify-between items-center mb-2">
               <span className="text-slate-500 text-sm">리워드 금액</span>
               <span className="text-slate-900 font-medium">{reward.price.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center mb-6">
               <span className="text-slate-500 text-sm">배송비</span>
               <span className="text-slate-900 font-medium">0원</span>
            </div>
            <hr className="border-slate-100 mb-6" />
            <div className="flex justify-between items-end mb-8">
               <span className="font-bold text-slate-900">최종 결제 금액</span>
               <span className="font-bold text-2xl text-[#00c7ae]">{reward.price.toLocaleString()}원</span>
            </div>

            <div className="space-y-3 mb-6">
               <label className="flex items-start gap-2 cursor-pointer group select-none">
                 <input 
                   type="checkbox" 
                   className="mt-1 w-4 h-4 text-[#00c7ae] rounded border-slate-300 focus:ring-[#00c7ae]" 
                   checked={agreements.privacy}
                   onChange={(e) => setAgreements(prev => ({ ...prev, privacy: e.target.checked }))}
                 />
                 <span className="text-xs text-slate-500 leading-snug group-hover:text-slate-800 transition-colors">개인정보 제 3자 제공 동의 <span className="text-[#00c7ae] font-bold">(필수)</span></span>
               </label>
               <label className="flex items-start gap-2 cursor-pointer group select-none">
                 <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 text-[#00c7ae] rounded border-slate-300 focus:ring-[#00c7ae]" 
                    checked={agreements.terms}
                    onChange={(e) => setAgreements(prev => ({ ...prev, terms: e.target.checked }))}
                  />
                 <span className="text-xs text-slate-500 leading-snug group-hover:text-slate-800 transition-colors">후원 유의사항 확인 <span className="text-[#00c7ae] font-bold">(필수)</span></span>
               </label>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#00c7ae] text-white font-bold py-4 rounded-md hover:bg-[#00b29b] transition-colors text-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : '후원하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;