import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductDetail from './components/ProductDetail';
import OrderForm from './components/OrderForm';
import ProjectHero from './components/ProjectHero';
import Modal from './components/Modal';
import OrderList from './components/OrderList';
import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';
import MobileActionbar from './components/MobileActionbar';
import RewardDrawer from './components/RewardDrawer';
import { UserProfile, Reward } from './types';
import { MOCK_PRODUCT, ADMIN_EMAIL } from './constants';
import { 
  loginWithGoogle, 
  logoutUser, 
  subscribeToAuth,
  isFirebaseConfigured,
  fetchProjectStats
} from './services/firebase.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRewardDrawerOpen, setIsRewardDrawerOpen] = useState(false);
  
  // Navigation State
  const [view, setView] = useState<'home' | 'checkout' | 'success'>('home');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  
  // Dynamic Product State (for Gauge/Supporter Count)
  const [product, setProduct] = useState(MOCK_PRODUCT);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Project Stats (Current Amount & Supporter Count)
  const refreshProjectStats = async () => {
    try {
      const stats = await fetchProjectStats();
      setProduct(prev => ({
        ...prev,
        currentAmount: stats.currentAmount,
        supporterCount: stats.supporterCount
      }));
    } catch (error) {
      console.error("Failed to load project stats", error);
    }
  };

  useEffect(() => {
    refreshProjectStats();
  }, []);

  const handleLogin = async () => {
    try {
      const loggedUser = await loginWithGoogle();
      if (loggedUser) {
        console.log("Google Login Success! User Info:", loggedUser);
      }
      setUser(loggedUser);
    } catch (error) {
      console.error("Login failed", error);
      // alert("로그인에 실패했습니다."); // Removed to prevent popup on cancel
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setIsModalOpen(false);
    setView('home'); // Reset view on logout
  };

  // --- Navigation Handlers ---

  const handleRewardSelected = (reward: Reward) => {
    setSelectedReward(reward);
    setIsRewardDrawerOpen(false); // Close drawer if open
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutCancel = () => {
    setSelectedReward(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutSuccess = async () => {
    await refreshProjectStats(); // Update gauge immediately after success
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedReward(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOrders = () => {
    setSelectedReward(null);
    setView('home');
    setIsModalOpen(true);
  };

  // --- Render Views ---

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-20 font-sans">
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        onOpenOrders={() => setIsModalOpen(true)}
      />

      <main className="w-full max-w-[1200px] mx-auto px-6 lg:px-4 pt-6 lg:pt-10">
        {/* Status Banner - Only visible to Admin */}
        {isAdmin && (
          !isFirebaseConfigured ? (
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded text-slate-600 text-xs flex items-center justify-center gap-2">
              <span className="font-bold bg-slate-200 px-2 py-0.5 rounded">DEMO MODE</span>
              <span>Firebase 키가 설정되지 않았습니다. 관리자: <code>{ADMIN_EMAIL}</code></span>
            </div>
          ) : (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded text-green-700 text-xs flex items-center justify-center gap-2 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-bold">LIVE</span>
              <span>Firebase와 정상적으로 연결되었습니다. (관리자 확인용)</span>
            </div>
          )
        )}

        {/* View Switching Logic */}
        
        {view === 'success' && selectedReward && (
          <PaymentSuccess 
            reward={selectedReward}
            onGoHome={handleGoHome}
            onViewOrders={handleViewOrders}
          />
        )}

        {view === 'checkout' && user && selectedReward && (
          <Checkout 
            user={user}
            product={product}
            reward={selectedReward}
            onCancel={handleCheckoutCancel}
            onSuccess={handleCheckoutSuccess}
          />
        )}

        {view === 'home' && (
          <>
            {/* 1. Project Hero Section (Image + Summary) */}
            <ProjectHero product={product} />

            {/* 2. Static Tabs (Not sticky) */}
            <div className="border-b border-slate-200 mb-6 lg:mb-10 overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
              <div className="flex gap-6 lg:gap-8 min-w-max">
                <button className="py-3 border-b-2 border-[#00c7ae] font-bold text-[#00c7ae] text-[15px]">프로젝트 소개</button>
                <button className="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors text-[15px]">커뮤니티</button>
                <button className="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors text-[15px]">후원자</button>
              </div>
            </div>

            {/* 3. Main Layout: Left Content + Right Sticky Rewards */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-[60px] relative">
              
              {/* Left: Detail Content */}
              <div className="flex-1 min-w-0">
                 <ProductDetail product={product} />
              </div>
              
              {/* Right: Creator Info + Sticky Rewards (Hidden on mobile mostly, simplified) */}
              <div className="w-full lg:w-[360px] flex-shrink-0">
                 {/* Creator Info */}
                 <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                         청년
                       </div>
                       <div>
                         <span className="font-bold text-slate-900 block text-[15px]">{product.creator}</span>
                         <span className="text-[11px] bg-[#e0f7f4] text-[#00c7ae] px-1.5 py-0.5 rounded font-bold">진행한 프로젝트 0</span>
                       </div>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-snug">
                      '책'에 관한 '걸'쭉하고 '상'큼한 이야기! YG와 JYP의 책걸상
                    </p>
                 </div>

                 {/* Sticky Container for Rewards (Desktop Only) */}
                 <div className="hidden lg:block sticky top-24">
                    <OrderForm 
                      user={user}
                      product={product}
                      onLoginRequest={handleLogin}
                      onRewardSelected={handleRewardSelected}
                    />
                 </div>
              </div>
            </div>

            {/* Mobile Bottom Action Bar */}
            <MobileActionbar 
              product={product}
              onOpenReward={() => setIsRewardDrawerOpen(true)}
            />

            {/* Mobile Reward Drawer */}
            <RewardDrawer 
              isOpen={isRewardDrawerOpen} 
              onClose={() => setIsRewardDrawerOpen(false)}
            >
               <OrderForm 
                  user={user}
                  product={product}
                  onLoginRequest={handleLogin}
                  onRewardSelected={handleRewardSelected}
                />
            </RewardDrawer>
          </>
        )}
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