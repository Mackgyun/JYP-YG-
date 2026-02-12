import React, { useEffect, useState } from 'react';
import { Order, UserProfile, OrderStatus } from '../types';
import { subscribeToOrders, updateOrderStatus } from '../services/firebase';
import { ADMIN_EMAIL, ORDER_STATUS_LABELS } from '../constants';

interface OrderListProps {
  user: UserProfile;
}

const OrderList: React.FC<OrderListProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use the constant strictly for admin check
  const isAdmin = user.email === ADMIN_EMAIL;

  useEffect(() => {
    setLoading(true);
    // Subscribe to real-time updates
    const unsubscribe = subscribeToOrders(user.email || '', isAdmin, (data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    const success = await updateOrderStatus(orderId, newStatus);
    if (!success) {
      alert("상태 변경 실패");
      // Revert is handled by the subscription usually, but we could force reload if needed
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipping': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">주문 내역을 불러오는 중...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mb-3 text-4xl">📦</div>
        <p className="text-slate-800 font-medium text-lg">참여한 펀딩 내역이 없습니다.</p>
        {!isAdmin && <p className="text-sm text-slate-500 mt-2">프로젝트를 후원하고 리워드를 받아보세요!</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">
          {isAdmin ? '전체 주문 관리 (관리자)' : '나의 참여 내역'}
        </h3>
        {/* With real-time listener, manual refresh is less critical but kept as fallback */}
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-orange-200 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 pr-4">
                 {/* Product Name (Small) */}
                 <p className="text-xs text-slate-400 mb-1">{order.productName}</p>
                 
                 {/* Reward Title (Main, Bold) */}
                 <p className="font-bold text-slate-800 text-base leading-snug mb-1">
                   {order.rewardTitle}
                 </p>

                 {/* Display Reward Items */}
                 {order.rewardItems && order.rewardItems.length > 0 && (
                   <div className="text-xs text-slate-600 bg-slate-50 px-2 py-1.5 rounded mb-2 inline-block">
                     <span className="font-bold text-slate-700 mr-1">구성:</span> 
                     {order.rewardItems.join(', ')}
                   </div>
                 )}

                 <div className="text-sm text-slate-500 space-y-0.5">
                   <p className="text-xs">수량: {order.quantity}개 | {new Date(order.createdAt).toLocaleDateString()}</p>
                   <p className="text-xs">받는 분: {order.contactName} ({order.contactPhone})</p>
                </div>
                {isAdmin && <p className="text-xs text-indigo-600 mt-1 font-mono">{order.userEmail}</p>}
              </div>
              
              <div className="flex flex-col items-end gap-2 min-w-[90px]">
                {isAdmin ? (
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white focus:border-orange-500 outline-none w-full"
                  >
                    {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-2.5 py-1 rounded border text-xs font-bold whitespace-nowrap ${getStatusColor(order.status)}`}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                )}
              </div>
            </div>
            
            {/* Payment Amount & Address */}
            <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 px-5 py-3 rounded-b-lg flex justify-between items-center">
              <div className="flex flex-col">
                 <span className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-0.5">결제 금액</span>
                 <span className="font-bold text-slate-900">{order.totalAmount?.toLocaleString()}원</span>
              </div>
              <div className="flex flex-col items-end text-right max-w-[50%]">
                 <span className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-0.5">배송지</span>
                 <span className="text-xs text-slate-700 truncate w-full">{order.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;