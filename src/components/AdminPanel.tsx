import React, { useState, useEffect } from 'react';
import { Package, XCircle, FileText, Printer, ChevronDown, ChevronUp, Search, RefreshCw, DollarSign, TrendingUp } from 'lucide-react';
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
    userInfo?: {
    displayName: string | null;
    email: string | null;
  };
}

export const AdminPanel = ({ user }: { user: User | null }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<{userId: string, orderId: string} | null>(null);
  const [selectedBill, setSelectedBill] = useState<Order | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchOrders = async (showUIRefresh = false) => {
    if (showUIRefresh) setIsRefreshing(true);
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      const formattedOrders = data.map((o: any) => ({
        ...o,
        id: o._id || o.id,
        createdAt: {
          toDate: () => new Date(o.createdAt)
        }
      }));
      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      // fallback so we don't break UI on error if we already have cache
      setOrders(prev => prev.length ? prev : []); 
    } finally {
      if (showUIRefresh) setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Check if user is the admin (hardcoded for now to harshgupta07h@gmail.com)
    if (user.email !== 'harshgupta07h@gmail.com') {
      setError("You do not have administrative privileges.");
      setLoading(false);
      return;
    }

    fetchOrders();
    
    const interval = setInterval(() => fetchOrders(false), 10000);
    return () => clearInterval(interval);
  }, [user]);

  const updateOrderStatus = async (_userId: string, orderId: string, newStatus: string) => {
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

  const filteredOrders = orders.filter(o => {
    // Status filter
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    
    // Payment method filter
    if (paymentFilter !== 'all' && o.paymentMethod !== paymentFilter) return false;
    
    // Price range filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'under-1000' && o.totalAmount >= 1000) return false;
      if (priceFilter === '1000-5000' && (o.totalAmount < 1000 || o.totalAmount > 5000)) return false;
      if (priceFilter === '5000-10000' && (o.totalAmount < 5000 || o.totalAmount > 10000)) return false;
      if (priceFilter === 'over-10000' && o.totalAmount <= 10000) return false;
    }
    
    // Date range filter
    if (dateFilter !== 'all') {
      const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'today' && daysDiff !== 0) return false;
      if (dateFilter === 'yesterday' && daysDiff !== 1) return false;
      if (dateFilter === 'last-7-days' && daysDiff > 7) return false;
      if (dateFilter === 'last-30-days' && daysDiff > 30) return false;
      if (dateFilter === 'last-90-days' && daysDiff > 90) return false;
    }
    
    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        (o.id && o.id.toLowerCase().includes(query)) ||
        (o.userId && o.userId.toLowerCase().includes(query)) ||
        (o.shippingInfo?.fullName && o.shippingInfo.fullName.toLowerCase().includes(query)) ||
        (o.userInfo?.displayName && o.userInfo.displayName.toLowerCase().includes(query)) ||
        (o.userInfo?.email && o.userInfo.email.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPending = orders.filter(o => o.status === 'pending').length;

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
      
      {/* Header and Stats */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-gold/10 rounded-xl">
              <Package className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-brand-ink">Order Management</h2>
              <p className="text-sm text-brand-ink/60 mt-1">Manage and track customer orders, update statuses, and generate bills.</p>
            </div>
          </div>
          <button 
            onClick={() => fetchOrders(true)} 
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-brand-ink/20 hover:bg-brand-ink/5 rounded-lg text-brand-ink transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-brand-surface p-6 rounded-2xl border border-brand-ink/10 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-brand-ink/5 rounded-full text-brand-ink">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-brand-ink/60 font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-brand-ink">{orders.length}</h3>
            </div>
          </div>
          <div className="bg-brand-surface p-6 rounded-2xl border border-brand-ink/10 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-full text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-brand-ink/60 font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-brand-ink">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          <div className="bg-brand-surface p-6 rounded-2xl border border-brand-ink/10 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-brand-gold/10 rounded-full text-brand-gold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-brand-ink/60 font-medium">Action Needed</p>
              <h3 className="text-2xl font-bold text-brand-ink">{totalPending} Pending</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-brand-surface p-4 rounded-xl border border-brand-ink/10 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-[200px] xl:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink/40" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-ink/10 rounded-lg text-sm bg-transparent focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
            <div className="flex flex-wrap lg:flex-nowrap gap-3 flex-1">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 border border-brand-ink/10 rounded-lg text-xs bg-transparent focus:outline-none focus:border-brand-gold cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select 
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 border border-brand-ink/10 rounded-lg text-xs bg-transparent focus:outline-none focus:border-brand-gold cursor-pointer"
              >
                <option value="all">All Payments</option>
                <option value="cod">Cash on Delivery</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>

              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 border border-brand-ink/10 rounded-lg text-xs bg-transparent focus:outline-none focus:border-brand-gold cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under-1000">Under ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="over-10000">Over ₹10,000</option>
              </select>

              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 border border-brand-ink/10 rounded-lg text-xs bg-transparent focus:outline-none focus:border-brand-gold cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
              </select>
               <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                  setPriceFilter('all');
                  setDateFilter('all');
                }}
                className="px-4 py-2 bg-brand-gold text-brand-bg rounded-lg text-sm font-medium hover:bg-brand-gold/90 transition-colors"
              >
                Clear Filters
              </button>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-ink/50 backdrop-blur-sm p-2 md:p-6 print:p-0 print:bg-transparent print:block">
          <div className="bg-brand-surface p-6 md:p-10 rounded-none md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto print:max-h-none print:shadow-none print:overflow-visible relative">
            <div className="print:hidden absolute top-4 right-4 flex gap-2">
              <button onClick={printBill} className="p-2 bg-brand-gold text-brand-bg rounded hover:bg-brand-ink transition-colors" title="Print Bill">
                <Printer className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedBill(null)} className="p-2 bg-brand-ink/10 text-brand-ink/80 rounded hover:bg-brand-ink/20 transition-colors" title="Close">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-8 border-b-2 border-brand-ink/10 pb-6">
              <h1 className="text-3xl font-serif text-brand-ink font-bold mb-2">INVOICE</h1>
              <h2 className="text-xl text-brand-gold font-serif">Harsh Imporium & Anand Jewellars</h2>
              <p className="text-sm text-brand-ink/60 mt-2">Ambedkar Nagar, Uttar Pradesh</p>
              <p className="text-sm text-brand-ink/60">harshgupta07h@gmail.com | +91 8875810604</p>
            </div>

            <div className="flex justify-between mb-8 text-sm">
              <div>
                <p className="text-brand-ink/60 font-medium mb-1">Billed To:</p>
                {selectedBill.shippingInfo ? (
                  <>
                    <p className="font-bold text-brand-ink text-base">{selectedBill.shippingInfo.fullName}</p>
                    <p className="text-brand-ink/80">{selectedBill.shippingInfo.address}</p>
                    <p className="text-brand-ink/80">{selectedBill.shippingInfo.city}, {selectedBill.shippingInfo.state} {selectedBill.shippingInfo.zipCode}</p>
                    <p className="text-brand-ink/80 mt-1">{selectedBill.shippingInfo.phone}</p>
                    <p className="text-brand-ink/80">{selectedBill.shippingInfo.email}</p>
                  </>
                ) : (
                  <p className="text-brand-ink/80">Customer ID: {selectedBill.userId}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-brand-ink/60 font-medium mb-1">Invoice Details:</p>
                <p className="text-brand-ink/80"><span className="font-medium text-brand-ink">Order ID:</span> {selectedBill.id}</p>
                <p className="text-brand-ink/80"><span className="font-medium text-brand-ink">Date:</span> {selectedBill.createdAt?.toDate ? selectedBill.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
                <p className="text-brand-ink/80"><span className="font-medium text-brand-ink">Payment Method:</span> {selectedBill.paymentMethod || 'Credit Card'}</p>
                <p className="text-brand-ink/80"><span className="font-medium text-brand-ink">Status:</span> {selectedBill.status.toUpperCase()}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-8">
              <thead>
                <tr className="bg-brand-ink/5 text-brand-ink text-xs uppercase tracking-widest">
                  <th className="p-3 font-semibold rounded-tl">Product Name</th>
                  <th className="p-3 font-semibold text-center">Qty</th>
                  <th className="p-3 font-semibold text-right rounded-tr">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.items.map((item, idx) => {
                  const product = PRODUCTS.find(p => p.id === item.productId);
                  return (
                  <tr key={idx} className="border-b border-brand-ink/10 text-sm py-2">
                    <td className="p-3 text-brand-ink">
                      {product ? product.name : item.productId}
                      {item.variant && Object.keys(item.variant).length > 0 && (
                        <div className="text-xs text-brand-ink/50 mt-0.5">
                          {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center text-brand-ink/80">{item.quantity}</td>
                    <td className="p-3 text-right text-brand-ink">{product ? `₹${(product.price * item.quantity).toLocaleString('en-IN')}` : '-'}</td>
                  </tr>
                )})}
              </tbody>
            </table>

            <div className="flex justify-end border-t-2 border-brand-ink/10 pt-4">
              <div className="w-64">
                <div className="flex justify-between mb-2 text-brand-ink/80">
                  <span>Subtotal:</span>
                  <span>₹{selectedBill.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2 text-brand-ink/80">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-brand-ink mt-2 border-t border-brand-ink/10 pt-2">
                  <span>Total:</span>
                  <span className="text-brand-gold">₹{selectedBill.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center text-xs text-brand-ink/50 border-t border-brand-ink/5 pt-6">
              <p>Thank you for shopping with us! This is a computer-generated invoice.</p>
              <p className="mt-1">Returns and exchanges are valid for 7 days from the date of delivery.</p>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-24 bg-brand-surface rounded-2xl border border-brand-ink/10 flex flex-col items-center">
          <div className="w-20 h-20 bg-brand-ink/5 rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-brand-ink/40" />
          </div>
          <h3 className="text-2xl font-serif text-brand-ink mb-2">
            {orders.length === 0 ? "No Orders Yet" : "No Matching Orders"}
          </h3>
          <p className="text-brand-ink/60">
            {orders.length === 0 ? "When customers place orders, they will appear here." : "Try adjusting your search criteria."}
          </p>
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
                {filteredOrders.map((order) => {
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
                            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md focus:ring-2 focus:ring-brand-gold/50 cursor-pointer border ${
                              order.status === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                              order.status === 'shipped' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                              order.status === 'processing' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                              order.status === 'cancelled' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                              'bg-brand-ink/5 text-brand-ink/60 border-brand-ink/10'
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
                                    <li key={idx} className="flex justify-between text-sm text-brand-ink/80 bg-brand-surface p-2 rounded border border-brand-ink/5">
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
                                <div className="bg-brand-surface p-4 rounded-lg border border-brand-ink/5">
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
                                <div className="bg-brand-surface p-4 rounded-lg border border-brand-ink/5 flex items-center justify-center text-sm text-brand-ink/50">
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

