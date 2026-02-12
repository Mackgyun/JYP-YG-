import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductDetail from './components/ProductDetail';
import OrderForm from './components/OrderForm';
import ProjectHero from './components/ProjectHero';
import Modal from './components/Modal';
import OrderList from './components/OrderList';
import { UserProfile } from './types';
import { MOCK_PRODUCT, ADMIN_EMAIL } from './constants';
import { 
  loginWithGoogle, 
  logoutUser, 
  subscribeToAuth,
  isFirebaseConfigured 
} from './services/firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
    } catch (error) {
      console.error("Login failed", error);
      alert("로그인에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        onOpenOrders={() => setIsModalOpen(true)}
      />

      <main className="w-full max-w-[1200px] mx-auto px-4 pt-10">
        {!isFirebaseConfigured && (
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded text-slate-600 text-xs flex items-center justify-center gap-2">
            <span className="font-bold bg-slate-200 px-2 py-0.5 rounded">DEMO MODE</span>
            <span>Firebase 키가 설정되지 않았습니다. 관리자: <code>{ADMIN_EMAIL}</code></span>
          </div>
        )}

        {/* 1. Project Hero Section (Image + Summary) */}
        <ProjectHero product={MOCK_PRODUCT} />

        {/* 2. Static Tabs (Not sticky) */}
        <div className="border-b border-slate-200 mb-10">
          <div className="flex gap-8">
            <button className="py-3 border-b-2 border-[#00c7ae] font-bold text-[#00c7ae] text-[15px]">프로젝트 소개</button>
            <button className="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors text-[15px]">커뮤니티</button>
            <button className="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors text-[15px]">후원자</button>
          </div>
        </div>

        {/* 3. Main Layout: Left Content + Right Sticky Rewards */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[60px] relative">
          
          {/* Left: Detail Content */}
          <div className="flex-1 min-w-0">
             <ProductDetail product={MOCK_PRODUCT} />
          </div>
          
          {/* Right: Creator Info + Sticky Rewards */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
             {/* Creator Info (Scrolls away) */}
             <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                     청년
                   </div>
                   <div>
                     <span className="font-bold text-slate-900 block text-[15px]">{MOCK_PRODUCT.creator}</span>
                     <span className="text-[11px] bg-[#e0f7f4] text-[#00c7ae] px-1.5 py-0.5 rounded font-bold">진행한 프로젝트 0</span>
                   </div>
                </div>
                <p className="text-[13px] text-slate-500 leading-snug">
                  '책'에 관한 '걸'쭉하고 '상'큼한 이야기! YG와 JYP의 책걸상
                </p>
             </div>

             {/* Sticky Container for Rewards */}
             <div className="sticky top-24">
                <OrderForm 
                  user={user}
                  product={MOCK_PRODUCT}
                  onLoginRequest={handleLogin}
                  onOrderSuccess={() => setIsModalOpen(true)}
                />
             </div>
          </div>
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isAdmin ? "관리자 대시보드" : "나의 후원 현황"}
      >
        {user ? (
          <OrderList user={user} />
        ) : (
          <p className="text-center text-slate-500 py-4">로그인이 필요합니다.</p>
        )}
      </Modal>
    </div>
  );
};

export default App;