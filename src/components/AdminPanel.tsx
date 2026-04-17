import React, { useState, useEffect } from 'react';
import { collectionGroup, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

interface OrderItem {
  productId: string;
  quantity: number;
  variant?: Record<string, string>;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  userId: string;
}

export const AdminPanel = ({ user }: { user: User | null }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<{userId: string, orderId: string} | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collectionGroup(db, 'orders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        // Extract userId from the path: users/{userId}/orders/{orderId}
        const pathSegments = doc.ref.path.split('/');
        const userId = pathSegments[1];
        ordersData.push({ id: doc.id, ...doc.data(), userId } as Order);
      });
      // Sort by createdAt descending
      ordersData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setOrders(ordersData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. You may not have admin privileges.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateOrderStatus = async (userId: string, orderId: string, newStatus: string) => {
    try {
      setActionMessage('');
      const orderRef = doc(db, 'users', userId, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setActionMessage("Order status updated.");
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error("Error updating order status:", err);
      setActionMessage("Failed to update order status.");
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      setActionMessage('');
      const orderRef = doc(db, 'users', orderToDelete.userId, 'orders', orderToDelete.orderId);
      await deleteDoc(orderRef);
      setOrderToDelete(null);
      setActionMessage("Order deleted.");
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error("Error deleting order:", err);
      setActionMessage("Failed to delete order.");
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto min-h-[50vh]">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-[60vh]">
      {actionMessage && (
        <div className="mb-6 p-4 bg-brand-ink text-brand-bg rounded w-full lg:w-max">
          {actionMessage}
        </div>
      )}
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-brand-gold" />
        <h2 className="text-3xl font-serif text-brand-ink">Order Management</h2>
      </div>

      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-brand-surface p-6 rounded shadow-2xl max-w-md w-full text-center">
            <h3 className="text-xl font-serif font-bold text-brand-ink mb-4">Delete Order?</h3>
            <p className="text-sm text-brand-ink/80 mb-6">Are you sure you want to permanently delete order {orderToDelete.orderId}?</p>
            <div className="flex gap-4 justify-center">
              <button 
                className="px-4 py-2 border border-brand-ink/20 rounded hover:bg-brand-ink/5"
                onClick={() => setOrderToDelete(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-brand-surface rounded-lg border border-brand-ink/10">
          <p className="text-brand-ink/60">No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-ink/20 text-xs uppercase tracking-widest text-brand-ink/60">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer ID</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-brand-ink/10 hover:bg-brand-surface/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-brand-ink">{order.id}</td>
                  <td className="p-4 text-sm text-brand-ink/70">
                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4 text-xs text-brand-ink/60 truncate max-w-[120px]" title={order.userId}>
                    {order.userId}
                  </td>
                  <td className="p-4 text-sm text-brand-ink/70">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                  </td>
                  <td className="p-4 text-sm font-medium text-brand-gold">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status === 'pending' && <Clock className="w-3 h-3" />}
                      {order.status === 'processing' && <Package className="w-3 h-3" />}
                      {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                      {order.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                      {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.userId, order.id, e.target.value)}
                      className="text-xs border border-brand-ink/20 rounded px-2 py-1 bg-transparent focus:outline-none focus:border-brand-gold text-brand-ink"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => setOrderToDelete({ userId: order.userId, orderId: order.id })}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      title="Delete Order"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
