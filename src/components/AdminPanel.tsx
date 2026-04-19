import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, FileText, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import { PRODUCTS } from '../App';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface OrderItem {
  productId: string;
  quantity: number;
  variant?: Record<string, string>;
}

interface Order {
  _id?: string;
  id?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  userId: string;
  shippingInfo?: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod?: string;
}

export const AdminPanel = ({ user }: { user: User | null }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<{userId: string, orderId: string} | null>(null);
  const [selectedBill, setSelectedBill] = useState<Order | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Check if user is the admin (hardcoded for now to harshgupta07h@gmail.com)
    if (user.email !== 'harshgupta07h@gmail.com') {
      setError("You do not have administrative privileges.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        // Standardize IDs for the UI
        const formattedOrders = data.map((o: any) => ({
          ...o,
          id: o._id || o.id,
          createdAt: {
            toDate: () => new Date(o.createdAt)
          } // Mock the Firestore Timestamp object structure here to not ruin the UI logic
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please check your connection to MongoDB.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Minimal polling setup since we removed onSnapshot
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const updateOrderStatus = async (userId: string, orderId: string, newStatus: string) => {
    try {
      setActionMessage('');
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
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
      const response = await fetch(`/api/orders/${orderToDelete.orderId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete order');
      
      setOrders(prev => prev.filter(o => o.id !== orderToDelete.orderId));
      setOrderToDelete(null);
      setActionMessage("Order deleted.");
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error("Error deleting order:", err);
      setActionMessage("Failed to delete order.");
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
  };

  const printBill = () => {
    window.print();
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
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto min-h-[60vh]">
      {actionMessage && (
        <div className="mb-6 p-4 bg-brand-ink text-brand-bg rounded-lg shadow-md w-full lg:w-max flex items-center justify-between z-50 fixed bottom-4 right-4 animate-in slide-in-from-bottom-5">
          {actionMessage}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-brand-ink/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-gold/10 rounded-xl">
            <Package className="w-8 h-8 text-brand-gold" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-brand-ink">Order Management</h2>
            <p className="text-sm text-brand-ink/60 mt-1">Manage and track customer orders, update statuses, and generate bills.</p>
          </div>
        </div>
      </div>

      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/50 backdrop-blur-sm p-4">
          <div className="bg-brand-bg p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-brand-ink/10">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-brand-ink mb-2">Delete Order?</h3>
            <p className="text-sm text-brand-ink/70 mb-8">This action cannot be undone. Are you sure you want to permanently delete order <span className="font-semibold text-brand-ink">{orderToDelete.orderId}</span>?</p>
            <div className="flex gap-3 justify-center">
              <button 
                className="px-6 py-2.5 border border-brand-ink/20 text-brand-ink rounded-lg font-medium hover:bg-brand-ink/5 transition-colors"
                onClick={() => setOrderToDelete(null)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-md transition-all"
                onClick={confirmDelete}
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBill && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-ink/50 backdrop-blur-sm p-2 md:p-6 print:p-0 print:bg-white print:block">
          <div className="bg-white p-6 md:p-10 rounded-none md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto print:max-h-none print:shadow-none print:overflow-visible relative">
            <div className="print:hidden absolute top-4 right-4 flex gap-2">
              <button onClick={printBill} className="p-2 bg-brand-gold text-brand-bg rounded hover:bg-brand-ink transition-colors" title="Print Bill">
                <Printer className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedBill(null)} className="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors" title="Close">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-8 border-b-2 border-brand-ink/10 pb-6">
              <h1 className="text-3xl font-serif text-brand-ink font-bold mb-2">INVOICE</h1>
              <h2 className="text-xl text-brand-gold font-serif">Harsh Imporium & Anand Jewellars</h2>
              <p className="text-sm text-gray-500 mt-2">Ambedkar Nagar, Uttar Pradesh</p>
              <p className="text-sm text-gray-500">harshgupta07h@gmail.com | +91 8875810604</p>
            </div>

            <div className="flex justify-between mb-8 text-sm">
              <div>
                <p className="text-gray-500 font-medium mb-1">Billed To:</p>
                {selectedBill.shippingInfo ? (
                  <>
                    <p className="font-bold text-brand-ink text-base">{selectedBill.shippingInfo.fullName}</p>
                    <p className="text-gray-600">{selectedBill.shippingInfo.address}</p>
                    <p className="text-gray-600">{selectedBill.shippingInfo.city}, {selectedBill.shippingInfo.state} {selectedBill.shippingInfo.zipCode}</p>
                    <p className="text-gray-600 mt-1">{selectedBill.shippingInfo.phone}</p>
                    <p className="text-gray-600">{selectedBill.shippingInfo.email}</p>
                  </>
                ) : (
                  <p className="text-gray-600">Customer ID: {selectedBill.userId}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-medium mb-1">Invoice Details:</p>
                <p className="text-gray-600"><span className="font-medium text-brand-ink">Order ID:</span> {selectedBill.id}</p>
                <p className="text-gray-600"><span className="font-medium text-brand-ink">Date:</span> {selectedBill.createdAt?.toDate ? selectedBill.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
                <p className="text-gray-600"><span className="font-medium text-brand-ink">Payment Method:</span> {selectedBill.paymentMethod || 'Credit Card'}</p>
                <p className="text-gray-600"><span className="font-medium text-brand-ink">Status:</span> {selectedBill.status.toUpperCase()}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-8">
              <thead>
                <tr className="bg-gray-100 text-brand-ink text-xs uppercase tracking-widest">
                  <th className="p-3 font-semibold rounded-tl">Product Name</th>
                  <th className="p-3 font-semibold text-center">Qty</th>
                  <th className="p-3 font-semibold text-right rounded-tr">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.items.map((item, idx) => {
                  const product = PRODUCTS.find(p => p.id === item.productId);
                  return (
                  <tr key={idx} className="border-b border-gray-200 text-sm py-2">
                    <td className="p-3 text-gray-800">
                      {product ? product.name : item.productId}
                      {item.variant && Object.keys(item.variant).length > 0 && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="p-3 text-right text-gray-800">{product ? `₹${(product.price * item.quantity).toLocaleString('en-IN')}` : '-'}</td>
                  </tr>
                )})}
              </tbody>
            </table>

            <div className="flex justify-end border-t-2 border-brand-ink/10 pt-4">
              <div className="w-64">
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{selectedBill.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-brand-ink mt-2 border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-brand-gold">₹{selectedBill.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
              <p>Thank you for shopping with us! This is a computer-generated invoice.</p>
              <p className="mt-1">Returns and exchanges are valid for 7 days from the date of delivery.</p>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-brand-surface rounded-2xl border border-brand-ink/10 flex flex-col items-center">
          <div className="w-20 h-20 bg-brand-ink/5 rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-brand-ink/40" />
          </div>
          <h3 className="text-2xl font-serif text-brand-ink mb-2">No Orders Yet</h3>
          <p className="text-brand-ink/60">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-brand-bg rounded-2xl border border-brand-ink/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-surface/50 border-b border-brand-ink/20 text-[10px] md:text-xs uppercase tracking-widest text-brand-ink/60">
                  <th className="p-4 md:p-5 font-semibold w-12"></th>
                  <th className="p-4 md:p-5 font-semibold">Order ID & Date</th>
                  <th className="p-4 md:p-5 font-semibold">Customer</th>
                  <th className="p-4 md:p-5 font-semibold">Total Amount</th>
                  <th className="p-4 md:p-5 font-semibold">Status</th>
                  <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/10">
                {orders.map((order) => {
                  const isExpanded = expandedOrders.includes(order.id);
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-brand-surface/30 transition-colors">
                        <td className="p-4 text-center">
                          <button onClick={() => toggleExpand(order.id)} className="p-1 hover:bg-brand-ink/5 rounded text-brand-ink/50">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-brand-ink text-xs md:text-sm">{order.id}</div>
                          <div className="text-[10px] md:text-xs text-brand-ink/50 mt-1">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'} {' '}
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleTimeString('en-IN', { hour: '2-digit', minute:'2-digit' }) : ''}
                          </div>
                        </td>
                        <td className="p-4">
                          {order.shippingInfo ? (
                            <>
                              <div className="font-medium text-brand-ink text-xs md:text-sm">{order.shippingInfo.fullName}</div>
                              <div className="text-[10px] md:text-xs text-brand-ink/60">{order.shippingInfo.city || 'N/A'}</div>
                            </>
                          ) : (
                            <div className="text-xs text-brand-ink/60 truncate max-w-[120px]" title={order.userId}>{order.userId}</div>
                          )}
                        </td>
                        <td className="p-4 font-medium text-brand-gold text-sm">
                          ₹{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.userId, order.id, e.target.value)}
                            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md border-0 focus:ring-2 focus:ring-brand-gold/50 cursor-pointer ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="pending">PENDING</option>
                            <option value="processing">PROCESSING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setSelectedBill(order)}
                              className="inline-flex items-center justify-center p-2 bg-brand-surface border border-brand-ink/10 hover:bg-brand-gold hover:text-brand-bg hover:border-brand-gold text-brand-ink transition-all rounded"
                              title="Generate Bill"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setOrderToDelete({ userId: order.userId, orderId: order.id })}
                              className="inline-flex items-center justify-center p-2 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white text-red-600 transition-all rounded"
                              title="Delete Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-brand-surface/40">
                          <td colSpan={6} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-ink/80 mb-3 border-b border-brand-ink/10 pb-2">Order Items ({order.items.reduce((a,b)=>a+b.quantity, 0)})</h4>
                                <ul className="space-y-2">
                                  {order.items.map((item, idx) => {
                                    const product = PRODUCTS.find(p => p.id === item.productId);
                                    return (
                                    <li key={idx} className="flex justify-between text-sm text-brand-ink/80 bg-white p-2 rounded border border-brand-ink/5">
                                      <span>
                                        <span className="font-medium text-brand-ink text-xs">{item.quantity}x</span> {product ? product.name : item.productId}
                                        {item.variant && Object.keys(item.variant).length > 0 && (
                                          <span className="text-[10px] ml-2 bg-brand-ink/5 px-2 py-0.5 rounded-full">
                                            {Object.entries(item.variant).map(([k,v]) => `${k}: ${v}`).join(', ')}
                                          </span>
                                        )}
                                      </span>
                                    </li>
                                  )})}
                                </ul>
                              </div>
                              {order.shippingInfo ? (
                                <div className="bg-white p-4 rounded-lg border border-brand-ink/5">
                                  <h4 className="text-xs font-bold uppercase tracking-widest text-brand-ink/80 mb-3 border-b border-brand-ink/10 pb-2">Shipping Details</h4>
                                  <div className="space-y-1 text-sm text-brand-ink/80">
                                    <p><span className="font-medium text-brand-ink">Name:</span> {order.shippingInfo.fullName}</p>
                                    <p><span className="font-medium text-brand-ink">Address:</span> {order.shippingInfo.address}</p>
                                    <p><span className="font-medium text-brand-ink">City:</span> {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
                                    <p><span className="font-medium text-brand-ink">Contact:</span> {order.shippingInfo.phone} | {order.shippingInfo.email}</p>
                                    <p className="mt-2 text-xs"><span className="font-medium text-brand-ink">Payment:</span> {order.paymentMethod || 'Credit Card'}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white p-4 rounded-lg border border-brand-ink/5 flex items-center justify-center text-sm text-brand-ink/50">
                                  No shipping details available for this legacy order.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

