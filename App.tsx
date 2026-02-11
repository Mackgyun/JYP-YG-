import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductDetail from './components/ProductDetail';
import OrderForm from './components/OrderForm';
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

        {/* Flex Container for Left Content and Right Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[60px] relative">
          <ProductDetail product={MOCK_PRODUCT} />
          
          <OrderForm 
            user={user}
            product={MOCK_PRODUCT}
            onLoginRequest={handleLogin}
            onOrderSuccess={() => setIsModalOpen(true)}
          />
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