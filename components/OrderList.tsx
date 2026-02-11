import React, { useEffect, useState } from 'react';
import { Order, UserProfile, OrderStatus } from '../types';
import { fetchOrders, updateOrderStatus } from '../services/firebase';
import { ADMIN_EMAIL, ORDER_STATUS_LABELS } from '../constants';

interface OrderListProps {
  user: UserProfile;
}

const OrderList: React.FC<OrderListProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isAdmin = user.email === ADMIN_EMAIL || user.email === 'admin@gmail.com';

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchOrders(user.email || '', isAdmin);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    const success = await updateOrderStatus(orderId, newStatus);
    if (!success) {
      alert("상태 변경 실패");
      loadOrders(); 
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
        <button onClick={loadOrders} className="text-sm text-orange-600 hover:text-orange-700 font-medium">새로고침</button>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-orange-200 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-800 text-base mb-1">{order.productName}</p>
                <div className="text-sm text-slate-500 space-y-0.5">
                   <p>수량: {order.quantity}개 | {new Date(order.createdAt).toLocaleDateString()}</p>
                   <p>받는 분: {order.contactName} ({order.contactPhone})</p>
                </div>
                {isAdmin && <p className="text-xs text-indigo-600 mt-1 font-mono">{order.userEmail}</p>}
              </div>
              
              <div className="flex flex-col items-end gap-2 min-w-[100px]">
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
                  <span className={`px-2.5 py-1 rounded border text-xs font-bold ${getStatusColor(order.status)}`}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 px-5 py-3 rounded-b-lg">
              <span className="font-bold text-xs text-slate-500 uppercase tracking-wider mr-2">배송지</span>
              <span className="text-sm text-slate-700">{order.address}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;