import React from 'react';
import { Reward } from '../types';
import { BANK_INFO } from '../constants';

interface PaymentSuccessProps {
  reward: Reward;
  onGoHome: () => void;
  onViewOrders: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ reward, onGoHome, onViewOrders }) => {
  return (
    <div className="max-w-xl mx-auto py-8 lg:py-16 px-4 text-center animate-in fade-in zoom-in duration-300 flex flex-col justify-center min-h-[60vh] lg:min-h-0">
      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
        <svg className="w-8 h-8 lg:w-10 lg:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">후원 참여 완료!</h2>
      <p className="text-sm lg:text-base text-slate-600 mb-6 lg:mb-10">아래 계좌로 입금을 완료해주시면 최종 확인됩니다.</p>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 lg:p-8 mb-6 lg:mb-8 shadow-sm">
         <p className="text-xs lg:text-sm text-slate-500 mb-2 font-bold uppercase tracking-wider">입금하실 계좌</p>
         <div className="flex flex-col gap-1 lg:gap-2 items-center">
            <span className="text-lg lg:text-xl font-medium text-slate-700">{BANK_INFO.bankName}</span>
            <span className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight select-all cursor-text">{BANK_INFO.accountNumber}</span>
            <span className="text-xs lg:text-sm text-slate-500">예금주: {BANK_INFO.holder}</span>
         </div>
         <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-slate-200 flex justify-between items-center text-sm">
            <span className="text-slate-500">입금 금액</span>
            <span className="font-bold text-[#00c7ae] text-lg lg:text-xl">{reward.price.toLocaleString()}원</span>
         </div>
      </div>

      <div className="flex flex-col gap-3 justify-center w-full">
        <button 
          onClick={onViewOrders}
          className="w-full px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm lg:text-base"
        >
          나의 후원 내역 보기
        </button>
        <button 
          onClick={onGoHome}
          className="w-full px-6 py-3 bg-[#00c7ae] text-white rounded-lg font-bold hover:bg-[#00b29b] transition-colors shadow-md text-sm lg:text-base"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;