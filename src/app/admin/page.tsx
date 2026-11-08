'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Search,
  Edit,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Bell,
  MessageSquare,
  Package,
  Truck,
  CheckSquare,
  Square,
  Copy,
  Check,
  MessageCircle,
  ArrowRight,
  X,
  Send,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Key,
  Trash2,
} from 'lucide-react';
import { Order, Product } from '@/lib/db';

export interface AdminCustomer {
  accountId: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  registeredAt: string;
  lastActiveAt: string;
  provider?: string;
  source?: string;
  ordersCount: number;
  totalSpent: number;
  pendingBalance: number;
  recentOrderId?: string | null;
  orders?: Order[];
  inquiries?: any[];
  lackingGaps?: Array<{
    type: 'delivery' | 'inquiry' | 'address' | 'payment' | 'tracking';
    severity: 'high' | 'medium' | 'info';
    title: string;
    description: string;
    orderId?: string;
    inquiryId?: string;
  }>;
  lackingCount?: number;
  statusScore?: 'Lacking Attention' | 'All Clear';
}

export interface CustomerRequest {
  id: string;
  accountId?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category?: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
  adminNote?: string;
  resolvedAt?: string | null;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    products: Product[];
    orders: Order[];
    customers: AdminCustomer[];
    requests?: CustomerRequest[];
    subscribers?: any[];
    stats: {
      totalOrders: number;
      fullyPaidCount: number;
      deliveredCount?: number;
      pendingDeliveryCount?: number;
      partiallyPaidCount: number;
      totalRevenueCollected: number;
      totalPendingBalances: number;
      totalBottlesReserved: number;
      openRequestsCount?: number;
      totalRegisteredCustomers: number;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'requests' | 'customers' | 'products'>('orders');

  // Filter States
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending_delivery' | 'delivered' | 'paid' | 'deposit'>('all');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'cancellation' | 'damage' | 'resolved'>('all');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'lacking' | 'all_clear'>('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Modals & Dossiers
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Tracking edit states (per order)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { partner: string; awb: string }>>({});
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Request response notes
  const [requestNotes, setRequestNotes] = useState<Record<string, string>>({});
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);

  // Editing product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchAdminData();
    }, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const json = await res.json();
      if (json.authenticated) {
        setIsAuthenticated(true);
        fetchAdminData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchAdminData();
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify username and password.');
      }
    } catch {
      setLoginError('Network error connecting to Atelier auth server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setData(null);
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      setData(json);

      // Pre-fill tracking inputs
      if (json.orders) {
        const tMap: Record<string, { partner: string; awb: string }> = {};
        json.orders.forEach((o: any) => {
          tMap[o.id] = {
            partner: o.trackingPartner || '',
            awb: o.trackingNumber || '',
          };
        });
        setTrackingInputs(tMap);
      }

      // Pre-fill request notes
      if (json.requests) {
        const rMap: Record<string, string> = {};
        json.requests.forEach((r: any) => {
          rMap[r.id] = r.adminNote || '';
        });
        setRequestNotes(rMap);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Helper to copy text to clipboard with feedback
  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  // 1. One-click Toggle Delivery Tick Checkbox
  const handleToggleDelivery = async (orderId: string, currentDelivered: boolean) => {
    setUpdatingOrderId(orderId);
    const newDeliveredState = !currentDelivered;

    // Optimistic UI update
    if (data) {
      const updatedOrders = data.orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            isDelivered: newDeliveredState,
            orderStatus: (newDeliveredState ? 'Delivered' : 'Ready for Fulfilment') as any,
            deliveredAt: newDeliveredState ? new Date().toISOString() : null,
          };
        }
        return o;
      });
      setData({ ...data, orders: updatedOrders as Order[] });
    }

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          isDelivered: newDeliveredState,
          note: newDeliveredState
            ? `Admin ticked order as DELIVERED to client.`
            : `Admin unticked delivered status. Reset to Ready for Fulfilment.`,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setNotificationBanner(
          newDeliveredState
            ? `✓ Order ${orderId} marked as DELIVERED to customer.`
            : `Order ${orderId} delivery tick removed.`
        );
        fetchAdminData();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(resData.order);
        }
      }
    } catch (e) {
      console.error(e);
      fetchAdminData(); // rollback
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Save Courier Tracking Info
  const handleSaveTracking = async (orderId: string) => {
    const input = trackingInputs[orderId];
    if (!input) return;
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          trackingPartner: input.partner,
          trackingNumber: input.awb,
          note: `Courier updated: ${input.partner} (AWB: ${input.awb})`,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setNotificationBanner(`✓ Saved tracking info for ${orderId}: ${input.partner} (${input.awb})`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete Order #${orderId}? This will remove it from local and cloud databases.`)) {
      return;
    }
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders?id=${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
      });
      const resData = await res.json();
      if (resData.success) {
        setNotificationBanner(`✓ Order #${orderId} deleted successfully.`);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        fetchAdminData();
      } else {
        alert(resData.error || 'Failed to delete order');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // 2. One-click Toggle Request Resolved Tick
  const handleToggleRequestResolved = async (requestId: string, currentResolved: boolean) => {
    setUpdatingRequestId(requestId);
    const newResolvedState = !currentResolved;

    try {
      const res = await fetch('/api/admin/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          resolved: newResolvedState,
          adminNote: requestNotes[requestId] || '',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setNotificationBanner(
          newResolvedState
            ? `✓ Customer request ${requestId} marked as RESOLVED.`
            : `Customer request ${requestId} reopened.`
        );
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingRequestId(null);
    }
  };

  // Save Request Note
  const handleSaveRequestNote = async (requestId: string) => {
    setUpdatingRequestId(requestId);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          adminNote: requestNotes[requestId] || '',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setNotificationBanner(`✓ Saved internal concierge note for request ${requestId}.`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingRequestId(null);
    }
  };

  // Product toggle & save
  const handleToggleProductStatus = async (
    product: Product,
    newStatus: 'Pre-order' | 'Available' | 'Coming Soon'
  ) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          status: newStatus,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setNotificationBanner(`"${product.name}" status updated to ${newStatus}.`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProductChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: editingProduct.id,
          status: editingProduct.status,
          inventory: Number(editingProduct.inventory),
          shortDescription: editingProduct.shortDescription,
          notes: editingProduct.notes,
          fullPrice: editingProduct.fullPrice,
          standardPrice: editingProduct.standardPrice,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setNotificationBanner(`Saved changes for ${editingProduct.name}.`);
        setEditingProduct(null);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProduct(false);
    }
  };

  // 1. Auth Checking State
  if (authChecking) {
    return (
      <div className="bg-[#FAF8F5] text-[#110D09] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-[#8C6D42] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#8C6D42] font-mono font-semibold">
          Verifying Atelier Security Credentials...
        </p>
        <p className="text-[11px] text-[#110D09]/40 mt-1 font-serif italic">
          Valcura Haute Parfumerie &bull; Executive Portal
        </p>
      </div>
    );
  }

  // 2. Login Gate if Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#110D09] text-[#FAF8F5] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle Luxury Gradient Background Elements */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#8C6D42]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1A140E] border border-[#8C6D42]/40 text-[#C5A059] mb-4 shadow-xl">
              <Lock className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono font-semibold">
              Maison Valcura
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-widest uppercase text-[#FAF8F5] mt-1">
              Atelier Command Center
            </h1>
            <p className="text-xs text-[#FAF8F5]/60 mt-1.5 font-sans">
              Executive dashboard for orders, delivery tracking &amp; client relations
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#1A140E]/95 border border-[#8C6D42]/30 rounded-lg p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#8C6D42]/20">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#C5A059] tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Restricted Access Gate</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8C6D42]/20 text-[#C5A059] border border-[#8C6D42]/30">
                256-Bit SSL
              </span>
            </div>

            {loginError && (
              <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 rounded text-red-200 text-xs font-mono flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-[#FAF8F5]/70 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#FAF8F5]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="valcura08@gmail.com"
                    className="w-full bg-[#110D09] border border-[#8C6D42]/40 rounded px-3 py-2.5 pl-9 text-xs text-[#FAF8F5] placeholder-[#FAF8F5]/25 focus:outline-none focus:border-[#C5A059] transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-[#FAF8F5]/70 mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#FAF8F5]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full bg-[#110D09] border border-[#8C6D42]/40 rounded px-3 py-2.5 pl-9 pr-10 text-xs text-[#FAF8F5] placeholder-[#FAF8F5]/25 focus:outline-none focus:border-[#C5A059] transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF8F5]/40 hover:text-[#FAF8F5] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#8C6D42] hover:bg-[#A3804F] text-[#FAF8F5] py-3 px-4 rounded text-xs uppercase tracking-luxury font-mono font-medium transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loginLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#FAF8F5] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Atelier Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Unlock Atelier Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Back to Storefront */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs text-[#FAF8F5]/60 hover:text-[#C5A059] font-mono transition-colors"
            >
              <span>&larr; Return to Valcura Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Loading Data State
  if (loading || !data) {
    return (
      <div className="bg-[#FAF8F5] text-[#110D09] min-h-screen py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#110D09] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#110D09]/60 mt-4 font-mono">
          Loading VALCURA Atelier Executive Command Center...
        </p>
      </div>
    );
  }

  // Filter Orders
  const filteredOrders = data.orders.filter((order: any) => {
    const isPaid =
      order.paymentStatus === 'Fully Paid' ||
      order.orderStatus === 'Ready for Fulfilment' ||
      order.orderStatus === 'Delivered';

    if (orderFilter === 'pending_delivery') {
      if (!isPaid || order.isDelivered || order.orderStatus === 'Delivered') return false;
    }
    if (orderFilter === 'delivered' && !order.isDelivered && order.orderStatus !== 'Delivered') {
      return false;
    }
    if (orderFilter === 'paid' && !isPaid) return false;
    if (orderFilter === 'deposit' && order.plan !== 'deposit') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = order.customer?.fullName?.toLowerCase().includes(q);
      const matchId = order.id?.toLowerCase().includes(q);
      const matchAccount = order.customer?.accountId?.toLowerCase().includes(q);
      const matchEmail = order.customer?.email?.toLowerCase().includes(q);
      const matchPhone = order.customer?.phone?.toLowerCase().includes(q);
      const matchCity = order.customer?.city?.toLowerCase().includes(q);
      const matchUtr = order.paymentTransactionId?.toLowerCase().includes(q);
      return matchName || matchId || matchAccount || matchEmail || matchPhone || matchCity || matchUtr;
    }
    return true;
  });

  // Filter Customer Requests
  const requestsList = data.requests || [];
  const filteredRequests = requestsList.filter((req) => {
    if (requestFilter === 'pending' && req.status === 'Resolved') return false;
    if (requestFilter === 'resolved' && req.status !== 'Resolved') return false;
    if (requestFilter === 'cancellation' && !req.category?.includes('Cancellation') && !req.subject?.toLowerCase().includes('cancel')) {
      return false;
    }
    if (requestFilter === 'damage' && !req.category?.includes('Damaged') && !req.subject?.toLowerCase().includes('damage')) {
      return false;
    }

    if (requestSearchQuery) {
      const q = requestSearchQuery.toLowerCase();
      const matchName = req.name?.toLowerCase().includes(q);
      const matchEmail = req.email?.toLowerCase().includes(q);
      const matchSubject = req.subject?.toLowerCase().includes(q);
      const matchMessage = req.message?.toLowerCase().includes(q);
      const matchPhone = req.phone?.toLowerCase().includes(q);
      const matchAccount = req.accountId?.toLowerCase().includes(q);
      return matchName || matchEmail || matchSubject || matchMessage || matchPhone || matchAccount;
    }
    return true;
  });

  // Filter Customers
  const filteredCustomers = (data.customers || []).filter((cust) => {
    if (customerFilter === 'lacking' && cust.statusScore !== 'Lacking Attention') return false;
    if (customerFilter === 'all_clear' && cust.statusScore !== 'All Clear') return false;

    if (customerSearchQuery) {
      const q = customerSearchQuery.toLowerCase();
      const matchName = cust.fullName?.toLowerCase().includes(q);
      const matchEmail = cust.email?.toLowerCase().includes(q);
      const matchPhone = cust.phone?.toLowerCase().includes(q);
      const matchAccount = cust.accountId?.toLowerCase().includes(q);
      const matchAddr = cust.address?.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchAccount || matchAddr;
    }
    return true;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#110D09] min-h-screen pb-24">
      {/* TOP ATELIER EXECUTIVE HEADER */}
      <section className="bg-white border-b border-[#E8E2D8] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
              <ShieldCheck className="w-4 h-4 text-[#8C6D42]" />
              <span>Valcura Executive Atelier Command Center</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Ledger Active
              </span>
            </div>
            <h1 className="text-3xl font-serif uppercase tracking-wide text-[#110D09] mt-1">
              Atelier Management Portal
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setLoading(true);
                fetchAdminData();
              }}
              className="bg-white border border-[#D5CDC2] text-xs text-[#110D09] px-4 py-2 hover:bg-[#FAF8F5] transition-all flex items-center space-x-2 font-mono shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Ledger</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="text-xs tracking-luxury uppercase border border-[#E8E2D8] text-[#110D09] px-4 py-2 hover:border-[#110D09] transition-colors font-mono flex items-center space-x-1.5"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3 text-[#8C6D42]" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs tracking-luxury uppercase bg-[#110D09] text-[#FAF8F5] px-4 py-2 hover:bg-[#8C6D42] transition-colors font-mono flex items-center space-x-1.5 shadow-sm"
              title="Sign out of Atelier Command Center"
            >
              <LogOut className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* NOTIFICATION TOAST BANNER */}
      {notificationBanner && (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-3 text-xs text-amber-900 flex items-center justify-between font-mono animate-fade-in">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>{notificationBanner}</span>
          </div>
          <button
            onClick={() => setNotificationBanner(null)}
            className="text-amber-700 hover:text-amber-950 text-xs font-mono font-bold"
          >
            [Dismiss ✕]
          </button>
        </div>
      )}

      {/* COPIED ALERT */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#110D09] text-[#FAF8F5] px-4 py-2.5 rounded shadow-xl text-xs font-mono flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Copied {copiedText} to clipboard</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* EXECUTIVE KPI OVERVIEW METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* KPI 1: Total Revenue */}
          <div className="bg-white border border-[#E8E2D8] p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Pre-Order Revenue
            </span>
            <p className="text-2xl font-serif text-[#110D09] font-bold">
              ₹{data.stats.totalRevenueCollected}
            </p>
            <p className="text-[10px] text-emerald-700 font-mono font-medium">Flat ₹399 Privileges</p>
          </div>

          {/* KPI 2: Flacons Reserved */}
          <div className="bg-white border border-[#E8E2D8] p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Flacons Reserved
            </span>
            <p className="text-2xl font-serif text-[#110D09] font-bold">
              {data.stats.totalBottlesReserved}
            </p>
            <p className="text-[10px] text-[#8C6D42] font-mono">50 ML Cacaoveil Trilogy</p>
          </div>

          {/* KPI 3: Delivered Flacons (Ticked) */}
          <div className="bg-white border border-[#E8E2D8] p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Delivered Flacons
            </span>
            <p className="text-2xl font-serif text-emerald-700 font-bold">
              {data.stats.deliveredCount || 0}
            </p>
            <p className="text-[10px] text-emerald-800 font-mono font-medium">✓ Client Ticked</p>
          </div>

          {/* KPI 4: Pending Delivery Tick */}
          <div className="bg-white border border-[#E8E2D8] p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Pending Delivery
            </span>
            <p className="text-2xl font-serif text-amber-700 font-bold">
              {data.stats.pendingDeliveryCount || 0}
            </p>
            <p className="text-[10px] text-amber-700/80 font-mono">Awaiting dispatch/tick</p>
          </div>

          {/* KPI 5: Customer Requests & Inquiries */}
          <div className="bg-white border border-[#E8E2D8] p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Website Requests
            </span>
            <p className="text-2xl font-serif text-[#110D09] font-bold">
              {data.stats.openRequestsCount || 0}
              <span className="text-xs font-normal text-[#110D09]/40 ml-1">open</span>
            </p>
            <p className="text-[10px] text-amber-700 font-mono">Inquiries & Policy notes</p>
          </div>

          {/* KPI 6: Registered Patrons */}
          <div className="bg-white border border-[#E8E2D8] p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Client Accounts
            </span>
            <p className="text-2xl font-serif text-[#8C6D42] font-bold">
              {data.customers?.length || 0}
            </p>
            <p className="text-[10px] text-[#110D09]/60 font-mono">Dossiers tracked</p>
          </div>
        </div>

        {/* FOUR MAIN NAVIGATION TABS */}
        <div className="flex border-b border-[#E8E2D8] overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-6 text-xs tracking-luxury uppercase font-mono transition-all border-b-2 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#110D09] text-[#110D09] font-bold'
                : 'border-transparent text-[#110D09]/50 hover:text-[#110D09]'
            }`}
          >
            <Package className="w-4 h-4 text-[#8C6D42]" />
            <span>Orders & Deliveries ({data.orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-4 px-6 text-xs tracking-luxury uppercase font-mono transition-all border-b-2 flex items-center space-x-2 whitespace-nowrap relative ${
              activeTab === 'requests'
                ? 'border-[#110D09] text-[#110D09] font-bold'
                : 'border-transparent text-[#110D09]/50 hover:text-[#110D09]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#8C6D42]" />
            <span>Customer Requests & Messages ({requestsList.length})</span>
            {(data.stats.openRequestsCount || 0) > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-bold">
                {data.stats.openRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-4 px-6 text-xs tracking-luxury uppercase font-mono transition-all border-b-2 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'customers'
                ? 'border-[#110D09] text-[#110D09] font-bold'
                : 'border-transparent text-[#110D09]/50 hover:text-[#110D09]'
            }`}
          >
            <Users className="w-4 h-4 text-[#8C6D42]" />
            <span>Client Dossiers & Gaps ({data.customers?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-6 text-xs tracking-luxury uppercase font-mono transition-all border-b-2 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#110D09] text-[#110D09] font-bold'
                : 'border-transparent text-[#110D09]/50 hover:text-[#110D09]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#8C6D42]" />
            <span>Inventory & Availability ({data.products.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & DELIVERIES (WITH ONE-CLICK DELIVERY TICK) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white border border-[#E8E2D8] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#8C6D42] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by Client, Account ID, Order ID, Phone, City, UTR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] pl-9 pr-3 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { id: 'all', label: `All Orders (${data.orders.length})` },
                  { id: 'paid', label: `Fully Paid (${data.stats.fullyPaidCount || 0})` },
                  { id: 'pending_delivery', label: `Awaiting Delivery Tick (${data.stats.pendingDeliveryCount || 0})` },
                  { id: 'delivered', label: `Delivered ✓ (${data.stats.deliveredCount || 0})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id as any)}
                    className={`px-3 py-1.5 border transition-all ${
                      orderFilter === f.id
                        ? 'border-[#110D09] bg-[#110D09] text-white font-medium'
                        : 'border-[#E8E2D8] text-[#110D09]/70 hover:border-[#110D09]/40 bg-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards Grid / Table View */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white border border-[#E8E2D8] p-12 text-center text-[#110D09]/50 font-mono shadow-sm">
                  No orders match your filter criteria.
                </div>
              ) : (
                filteredOrders.map((order: any) => {
                  const isDelivered = order.isDelivered === true || order.orderStatus === 'Delivered';
                  const accountId = order.customer?.accountId || 'VAL-CUST-84920';
                  const tracking = trackingInputs[order.id] || { partner: '', awb: '' };

                  return (
                    <div
                      key={order.id}
                      className={`bg-white border transition-all shadow-sm p-5 space-y-4 ${
                        isDelivered
                          ? 'border-emerald-300 bg-emerald-50/15'
                          : 'border-[#E8E2D8] hover:border-[#110D09]'
                      }`}
                    >
                      {/* Top Order Row: ID, Client Account ID, and Delivery Tick Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D8] pb-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-base font-bold text-[#110D09]">
                            {order.id}
                          </span>

                          {/* Client Account ID Badge */}
                          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#FAF8F5] border border-[#D5CDC2] text-[11px] font-mono">
                            <span className="text-[#8C6D42] font-semibold">Account:</span>
                            <span className="text-[#110D09] font-bold">{accountId}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const matchedCust = data.customers.find(
                                  (c) => c.accountId === accountId || c.email === order.customer?.email
                                );
                                if (matchedCust) setSelectedCustomer(matchedCust);
                              }}
                              className="text-[10px] text-[#8C6D42] hover:text-[#110D09] underline font-sans ml-1"
                            >
                              [View Dossier]
                            </button>
                          </div>

                          <span className="text-[11px] text-[#110D09]/50 font-mono">
                            {new Date(order.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>

                        {/* ONE-CLICK DELIVERY TICK BUTTON */}
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleToggleDelivery(order.id, isDelivered)}
                            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center space-x-2 transition-all border ${
                              isDelivered
                                ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-sm'
                                : 'bg-white border-amber-400 text-amber-900 hover:bg-amber-50 shadow-sm'
                            }`}
                          >
                            {isDelivered ? (
                              <>
                                <CheckSquare className="w-4 h-4 text-white" />
                                <span>✓ DELIVERED (Ticked)</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-4 h-4 text-amber-600" />
                                <span>TICK WHEN DELIVERED</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="text-xs text-[#8C6D42] hover:text-[#110D09] font-mono underline"
                          >
                            Inspect Dossier →
                          </button>

                          <button
                            type="button"
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 rounded border border-rose-200 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Grid: Order Summary, Delivery Address, and Payment/Tracking */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                        {/* Column 1: Order Summary (Items & Price) */}
                        <div className="md:col-span-4 space-y-2">
                          <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                            Order Summary
                          </span>
                          <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] space-y-2">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-start">
                                <div>
                                  <p className="font-serif text-sm font-semibold text-[#110D09]">
                                    {item.productName || 'Cacao Citrine'}
                                  </p>
                                  <p className="text-[11px] text-[#110D09]/60 font-mono">
                                    {item.category || '50 ML Extrait de Parfum'} • Qty: {item.quantity}
                                  </p>
                                </div>
                                <span className="font-mono font-bold text-[#110D09]">
                                  ₹{item.paidToday || 399}
                                </span>
                              </div>
                            ))}

                            <div className="pt-2 border-t border-[#E8E2D8] flex justify-between font-mono">
                              <span className="text-[#110D09]/60">Pre-Order Amount Paid:</span>
                              <span className="text-emerald-800 font-bold">₹{order.amountPaidToday || 399}</span>
                            </div>

                            {/* UTR / Transaction badge */}
                            <div className="text-[11px] font-mono text-[#110D09]/80 flex items-center justify-between pt-1">
                              <span className="text-[#110D09]/50">UTR / Ref:</span>
                              <div className="flex items-center space-x-1">
                                <span className="font-bold text-[#110D09]">
                                  {order.paymentTransactionId || 'Awaiting UTR'}
                                </span>
                                {order.paymentTransactionId && (
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(order.paymentTransactionId, 'UTR')}
                                    className="p-1 hover:text-[#8C6D42]"
                                    title="Copy UTR"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {order.receiptImageUrl && (
                              <div className="text-[11px] font-mono text-[#110D09]/80 flex items-center justify-between pt-1 border-t border-[#E8E2D8]/60 mt-1">
                                <span className="text-[#110D09]/50">Receipt Proof:</span>
                                <a
                                  href={order.receiptImageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-[11px] text-[#8C6D42] hover:text-[#110D09] underline font-semibold"
                                >
                                  <span>View Screenshot</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 2: Client Delivery Address */}
                        <div className="md:col-span-4 space-y-2">
                          <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                            Delivery Address & Contact
                          </span>
                          <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] space-y-1.5">
                            <p className="font-semibold text-sm text-[#110D09]">
                              {order.customer.fullName}
                            </p>

                            {/* Mobile with 1-Click WhatsApp & Call */}
                            <div className="flex items-center space-x-3 text-xs font-mono">
                              <span className="text-[#110D09]">+91 {order.customer.phone}</span>
                              <a
                                href={`https://wa.me/91${order.customer.phone?.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                              >
                                <MessageCircle className="w-3 h-3 text-emerald-700" />
                                <span>WhatsApp</span>
                              </a>
                              <a
                                href={`tel:+91${order.customer.phone}`}
                                className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100"
                              >
                                <Phone className="w-3 h-3 text-blue-700" />
                                <span>Call</span>
                              </a>
                            </div>

                            <p className="text-[#110D09]/60 font-mono text-[11px]">
                              {order.customer.email}
                            </p>

                            {/* Street Address */}
                            <div className="pt-1.5 border-t border-[#E8E2D8] text-[11px] text-[#110D09]/80 space-y-1">
                              <p>{order.customer.addressLine1 || order.customer.address}</p>
                              {order.customer.addressLine2 && <p>{order.customer.addressLine2}</p>}

                              {/* Highlighted Landmark */}
                              {order.customer.landmark ? (
                                <div className="p-1.5 bg-amber-50/80 border border-amber-200 text-amber-900 rounded font-mono text-[10px] flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-amber-700 flex-shrink-0" />
                                  <span>Landmark: <strong>{order.customer.landmark}</strong></span>
                                </div>
                              ) : (
                                <p className="text-amber-800 text-[10px] italic">Landmark not specified</p>
                              )}

                              <p className="font-semibold text-[#110D09]">
                                {order.customer.city}, {order.customer.state} — {order.customer.pincode}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Courier Tracking & Status Timeline */}
                        <div className="md:col-span-4 space-y-2">
                          <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                            Courier Dispatch & Status
                          </span>
                          <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] space-y-2.5">
                            {/* Status Pill */}
                            <div className="flex items-center justify-between">
                              <span className="text-[#110D09]/50 font-mono">Current Status:</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  isDelivered
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {order.orderStatus}
                              </span>
                            </div>

                            {order.deliveredAt && (
                              <p className="text-[10px] text-emerald-800 font-mono">
                                Delivered at: {new Date(order.deliveredAt).toLocaleString('en-IN')}
                              </p>
                            )}

                            {/* Courier Input Fields */}
                            <div className="space-y-1.5 pt-1 border-t border-[#E8E2D8]">
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Courier (e.g. Blue Dart)"
                                  value={tracking.partner}
                                  onChange={(e) =>
                                    setTrackingInputs({
                                      ...trackingInputs,
                                      [order.id]: { ...tracking, partner: e.target.value },
                                    })
                                  }
                                  className="p-1.5 text-[11px] bg-white border border-[#D5CDC2] font-mono text-[#110D09] focus:outline-none focus:border-[#110D09]"
                                />
                                <input
                                  type="text"
                                  placeholder="AWB / Tracking #"
                                  value={tracking.awb}
                                  onChange={(e) =>
                                    setTrackingInputs({
                                      ...trackingInputs,
                                      [order.id]: { ...tracking, awb: e.target.value },
                                    })
                                  }
                                  className="p-1.5 text-[11px] bg-white border border-[#D5CDC2] font-mono text-[#110D09] focus:outline-none focus:border-[#110D09]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSaveTracking(order.id)}
                                disabled={updatingOrderId === order.id}
                                className="w-full py-1 bg-white border border-[#110D09] text-[10px] font-mono uppercase tracking-wider text-[#110D09] hover:bg-[#110D09] hover:text-white transition-colors"
                              >
                                Save Courier Info
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER REQUESTS & MESSAGES (SEPARATE SECTION) */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Header & Filter Controls */}
            <div className="bg-white border border-[#E8E2D8] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#8C6D42] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer requests by name, email, message, subject..."
                  value={requestSearchQuery}
                  onChange={(e) => setRequestSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] pl-9 pr-3 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                />
              </div>

              {/* Request Category Filters */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { id: 'all', label: `All Requests (${requestsList.length})` },
                  { id: 'pending', label: `Open / Needs Response (${data.stats.openRequestsCount || 0})` },
                  { id: 'cancellation', label: '24h Free Cancellation Requests' },
                  { id: 'damage', label: 'Damaged Bottle (100% Refund)' },
                  { id: 'resolved', label: 'Resolved ✓' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setRequestFilter(f.id as any)}
                    className={`px-3 py-1.5 border transition-all ${
                      requestFilter === f.id
                        ? 'border-[#110D09] bg-[#110D09] text-white font-medium'
                        : 'border-[#E8E2D8] text-[#110D09]/70 hover:border-[#110D09]/40 bg-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Cards */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="bg-white border border-[#E8E2D8] p-12 text-center text-[#110D09]/50 font-mono shadow-sm">
                  No customer requests match your filter.
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const isResolved = req.status === 'Resolved';
                  const isCancellation =
                    req.category?.includes('Cancellation') || req.subject?.toLowerCase().includes('cancel');
                  const isDamage =
                    req.category?.includes('Damaged') || req.subject?.toLowerCase().includes('damage');

                  return (
                    <div
                      key={req.id}
                      className={`bg-white border p-6 space-y-4 transition-all shadow-sm ${
                        isResolved
                          ? 'border-emerald-300 bg-emerald-50/10'
                          : isCancellation || isDamage
                          ? 'border-amber-400 bg-amber-50/20'
                          : 'border-[#E8E2D8]'
                      }`}
                    >
                      {/* Top Row: Request ID, Category, Client Account, and Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D8] pb-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#110D09]">
                            {req.id}
                          </span>

                          {/* Category Tag */}
                          <span
                            className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                              isCancellation
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : isDamage
                                ? 'bg-orange-100 text-orange-900 border border-orange-300'
                                : 'bg-[#FAF8F5] text-[#8C6D42] border border-[#D5CDC2]'
                            }`}
                          >
                            {req.category || 'Customer Inquiry'}
                          </span>

                          {/* Client Account ID */}
                          {req.accountId && (
                            <span className="text-[11px] font-mono text-[#110D09]/70">
                              Client: <strong>{req.accountId}</strong>
                            </span>
                          )}

                          <span className="text-[11px] text-[#110D09]/40 font-mono flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-[#8C6D42]" />
                            <span>
                              {new Date(req.createdAt).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </span>
                        </div>

                        {/* ONE-CLICK RESOLVE TICK BUTTON */}
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            disabled={updatingRequestId === req.id}
                            onClick={() => handleToggleRequestResolved(req.id, isResolved)}
                            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center space-x-2 transition-all border ${
                              isResolved
                                ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-sm'
                                : 'bg-white border-amber-400 text-amber-900 hover:bg-amber-50 shadow-sm'
                            }`}
                          >
                            {isResolved ? (
                              <>
                                <CheckSquare className="w-4 h-4 text-white" />
                                <span>✓ RESOLVED (Ticked)</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-4 h-4 text-amber-600" />
                                <span>TICK TO RESOLVE</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Customer Details & Subject */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                        <div className="md:col-span-4 space-y-1">
                          <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block">
                            Customer Details
                          </span>
                          <p className="font-semibold text-sm text-[#110D09]">{req.name}</p>
                          <p className="text-xs text-[#110D09]/70 font-mono">{req.email}</p>
                          {req.phone && (
                            <div className="flex items-center space-x-2 pt-1 font-mono">
                              <span className="text-[#110D09]">+91 {req.phone}</span>
                              <a
                                href={`https://wa.me/91${req.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 hover:underline inline-flex items-center space-x-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-8 space-y-2">
                          <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block">
                            Message & Request Details
                          </span>
                          <p className="font-serif text-sm font-semibold text-[#110D09]">
                            {req.subject || 'Website Inquiry'}
                          </p>
                          <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] text-xs text-[#110D09] font-light leading-relaxed whitespace-pre-wrap">
                            {req.message}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar & Concierge Response Notes */}
                      <div className="pt-3 border-t border-[#E8E2D8] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
                        {/* Concierge Internal Note Input */}
                        <div className="flex items-center space-x-2 flex-grow">
                          <input
                            type="text"
                            placeholder="Add internal concierge resolution note (e.g. called client, 100% refund initiated)..."
                            value={requestNotes[req.id] || ''}
                            onChange={(e) =>
                              setRequestNotes({ ...requestNotes, [req.id]: e.target.value })
                            }
                            className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3 py-1.5 text-xs text-[#110D09] font-mono focus:outline-none focus:border-[#110D09]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRequestNote(req.id)}
                            disabled={updatingRequestId === req.id}
                            className="bg-white border border-[#110D09] px-3 py-1.5 text-xs font-mono uppercase text-[#110D09] hover:bg-[#110D09] hover:text-white transition-colors flex-shrink-0"
                          >
                            Save Note
                          </button>
                        </div>

                        {/* Quick Communications Buttons */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <a
                            href={`mailto:${req.email}?subject=VALCURA Atelier Concierge - Re: ${encodeURIComponent(
                              req.subject || req.id
                            )}`}
                            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDC2] text-xs font-mono text-[#110D09] hover:bg-[#110D09] hover:text-white transition-colors flex items-center space-x-1"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply Email</span>
                          </a>

                          {req.phone && (
                            <a
                              href={`https://wa.me/91${req.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                                req.name
                              )},%20this%20is%20the%20VALCURA%20Concierge%20regarding%20your%20inquiry.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-900 hover:bg-emerald-600 hover:text-white transition-colors flex items-center space-x-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT DOSSIERS & "WHERE WE ARE LACKING" DIAGNOSTIC RADAR */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Header & Filter Controls */}
            <div className="bg-white border border-[#E8E2D8] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#8C6D42] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by client name, Account ID (VAL-CUST-...), email, phone..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] pl-9 pr-3 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                />
              </div>

              {/* Filter */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { id: 'all', label: `All Clients (${data.customers.length})` },
                  { id: 'lacking', label: '⚠️ Needs Attention / Gaps' },
                  { id: 'all_clear', label: '✓ All Clear (Fulfilled)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCustomerFilter(f.id as any)}
                    className={`px-3 py-1.5 border transition-all ${
                      customerFilter === f.id
                        ? 'border-[#110D09] bg-[#110D09] text-white font-medium'
                        : 'border-[#E8E2D8] text-[#110D09]/70 hover:border-[#110D09]/40 bg-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white border border-[#E8E2D8] overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D8] bg-[#FAF8F5] text-[10px] tracking-widest font-mono uppercase text-[#110D09]/60">
                    <th className="py-3 px-4">Client & Account ID</th>
                    <th className="py-3 px-4">Contact Channels</th>
                    <th className="py-3 px-4">Orders & Spend</th>
                    <th className="py-3 px-4">Action Radar: "Where We Are Lacking"</th>
                    <th className="py-3 px-4 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8]">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#110D09]/50 font-mono">
                        No clients matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const hasGaps = (cust.lackingCount || 0) > 0;

                      return (
                        <tr
                          key={cust.email}
                          className="hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer"
                          onClick={() => setSelectedCustomer(cust)}
                        >
                          {/* Client Name & Account ID */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-sm text-[#110D09] block">
                              {cust.fullName}
                            </span>
                            <span className="font-mono text-[11px] text-[#8C6D42] font-semibold">
                              {cust.accountId}
                            </span>
                            <span className="text-[10px] text-[#110D09]/40 font-mono block">
                              Active: {new Date(cust.lastActiveAt).toLocaleDateString('en-IN')}
                            </span>
                          </td>

                          {/* Contact */}
                          <td className="py-3.5 px-4 font-mono text-[11px] space-y-1">
                            <div className="flex items-center space-x-1.5 text-[#110D09]">
                              <Mail className="w-3 h-3 text-[#8C6D42]" />
                              <span>{cust.email}</span>
                            </div>
                            {cust.phone && (
                              <div className="flex items-center space-x-1.5 text-[#110D09]/80">
                                <Phone className="w-3 h-3 text-[#8C6D42]" />
                                <span>+91 {cust.phone}</span>
                              </div>
                            )}
                          </td>

                          {/* Orders & Spend */}
                          <td className="py-3.5 px-4 font-mono">
                            <span className="text-[#110D09] font-bold block">
                              {cust.ordersCount} Flacon(s)
                            </span>
                            <span className="text-emerald-800 font-bold text-xs">
                              ₹{cust.totalSpent} Paid
                            </span>
                          </td>

                          {/* Action Radar: Gaps / Where We Are Lacking */}
                          <td className="py-3.5 px-4">
                            {hasGaps ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                                  <span>{cust.lackingCount} Action Gap(s)</span>
                                </span>
                                <ul className="text-[10px] text-amber-900 font-mono space-y-0.5 max-w-sm">
                                  {cust.lackingGaps?.slice(0, 2).map((gap, i) => (
                                    <li key={i} className="truncate">
                                      • {gap.title}
                                    </li>
                                  ))}
                                  {(cust.lackingGaps?.length || 0) > 2 && (
                                    <li className="text-[9px] text-amber-800 italic">
                                      +{(cust.lackingGaps?.length || 0) - 2} more gaps (click to view)
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle className="w-3 h-3 text-emerald-700" />
                                <span>Zero Gaps • All Fulfilled</span>
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCustomer(cust);
                              }}
                              className="text-xs text-[#8C6D42] hover:text-[#110D09] font-mono underline font-medium"
                            >
                              Open Dossier →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS & INVENTORY MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.products.map((product) => {
                const isAvail = product.status === 'Available';
                const isPre = product.status === 'Pre-order';
                const isSoon = product.status === 'Coming Soon';

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-[#E8E2D8] p-6 flex flex-col justify-between space-y-6 shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="relative aspect-[4/3] bg-[#F8F5F0] border border-[#E8E2D8] overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 border ${
                              isAvail
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : isPre
                                ? 'bg-[#110D09] text-white font-semibold'
                                : 'bg-white/90 text-[#110D09] border border-[#D5CDC2]'
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] tracking-widest uppercase text-[#8C6D42] font-mono font-medium">
                          {product.category} • {product.volume}
                        </span>
                        <h3 className="text-2xl font-serif uppercase tracking-wide text-[#110D09]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#110D09]/70 font-light mt-1">
                          {product.shortDescription || 'Teaser status • formulation in progress'}
                        </p>
                      </div>

                      <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-[#110D09]/50">Inventory Count:</span>
                          <span className="text-[#110D09]">{product.inventory} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#110D09]/50">Flat Pre-Order Price:</span>
                          <span className="text-[#110D09] font-semibold">₹399 (List ₹599)</span>
                        </div>
                        {product.notes.length > 0 && (
                          <div className="pt-1 text-[11px] text-[#110D09]/70">
                            Notes: {product.notes.join(' • ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
                      <span className="text-[10px] tracking-luxury uppercase text-[#110D09]/50 font-mono block">
                        Change Availability Status:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(product, 'Pre-order')}
                          className={`py-2 text-[10px] font-mono border transition-all ${
                            isPre
                              ? 'border-[#110D09] bg-[#110D09] text-white font-bold'
                              : 'border-[#E8E2D8] text-[#110D09]/70 hover:border-[#110D09]'
                          }`}
                        >
                          Pre-order
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(product, 'Available')}
                          className={`py-2 text-[10px] font-mono border transition-all ${
                            isAvail
                              ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                              : 'border-[#E8E2D8] text-[#110D09]/70 hover:border-emerald-600'
                          }`}
                        >
                          Available 🔔
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(product, 'Coming Soon')}
                          className={`py-2 text-[10px] font-mono border transition-all ${
                            isSoon
                              ? 'border-amber-600 bg-amber-600 text-white font-bold'
                              : 'border-[#E8E2D8] text-[#110D09]/70 hover:border-amber-600'
                          }`}
                        >
                          Teaser
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...product })}
                        className="w-full py-2 bg-[#FAF8F5] border border-[#D5CDC2] text-xs text-[#110D09] hover:bg-[#F3EFE8] transition-colors flex items-center justify-center space-x-2 font-mono font-medium"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Price, Stock & Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SEPARATE CUSTOMER HEADER PAGE & DOSSIER MODAL ("WHERE WE ARE LACKING" REPORT) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E8E2D8] w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-[#110D09]/60 hover:text-[#110D09] text-sm font-mono font-bold"
            >
              [Close ✕]
            </button>

            {/* CLIENT HEADER BANNER */}
            <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D8] pb-4">
                <div>
                  <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-semibold">
                    Atelier Patron Dossier
                  </span>
                  <div className="flex items-center space-x-3 mt-1">
                    <h2 className="text-2xl sm:text-3xl font-serif text-[#110D09]">
                      {selectedCustomer.fullName}
                    </h2>
                    <span className="px-2.5 py-1 bg-[#110D09] text-[#FAF8F5] text-xs font-mono font-bold">
                      {selectedCustomer.accountId}
                    </span>
                  </div>
                </div>

                {/* Direct Action Contacts */}
                <div className="flex items-center space-x-2">
                  {selectedCustomer.phone && (
                    <a
                      href={`https://wa.me/91${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-900 hover:bg-emerald-600 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {selectedCustomer.phone && (
                    <a
                      href={`tel:+91${selectedCustomer.phone}`}
                      className="px-3 py-1.5 bg-blue-50 border border-blue-300 text-xs font-mono text-blue-900 hover:bg-blue-600 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDC2] text-xs font-mono text-[#110D09] hover:bg-[#110D09] hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Lifetime Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[#110D09]/50 block">Flacons Reserved:</span>
                  <span className="text-base text-[#110D09] font-bold">
                    {selectedCustomer.ordersCount} Units
                  </span>
                </div>
                <div>
                  <span className="text-[#110D09]/50 block">Lifetime Spend:</span>
                  <span className="text-base text-emerald-800 font-bold">
                    ₹{selectedCustomer.totalSpent}
                  </span>
                </div>
                <div>
                  <span className="text-[#110D09]/50 block">Customer Since:</span>
                  <span className="text-[#110D09] font-medium">
                    {new Date(selectedCustomer.registeredAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[#110D09]/50 block">Source:</span>
                  <span className="text-[#8C6D42] font-medium">
                    {selectedCustomer.source || 'Direct Pre-Order'}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION RADAR: "WHERE WE ARE LACKING" DIAGNOSTIC CHECKLIST */}
            <div className="p-6 border space-y-4 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-[#8C6D42]" />
                  <h3 className="text-lg font-serif uppercase tracking-wide text-[#110D09]">
                    Diagnostic Radar: Where We Are Lacking / Action Gaps
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                    (selectedCustomer.lackingCount || 0) > 0
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {(selectedCustomer.lackingCount || 0) > 0
                    ? `⚠️ ${selectedCustomer.lackingCount} Attention Item(s)`
                    : '✓ All Statuses 100% Fulfilled'}
                </span>
              </div>

              <div className="space-y-3">
                {(selectedCustomer.lackingGaps || []).length === 0 ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono rounded flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      Zero Gaps Detected: Delivery is marked delivered, zero pending inquiries, complete street address with landmark recorded, and payments verified.
                    </span>
                  </div>
                ) : (
                  selectedCustomer.lackingGaps?.map((gap, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 border rounded space-y-1 text-xs ${
                        gap.severity === 'high'
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : gap.severity === 'medium'
                          ? 'bg-orange-50 border-orange-300 text-orange-950'
                          : 'bg-blue-50 border-blue-200 text-blue-950'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono font-bold">
                        <span className="flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>{gap.title}</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border">
                          {gap.type}
                        </span>
                      </div>
                      <p className="text-[11px] font-light leading-relaxed pl-5">
                        {gap.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DELIVERY ADDRESS SLIP (WITH COPY HELPER) */}
            <div className="bg-[#FAF8F5] p-5 border border-[#E8E2D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-semibold">
                  Complete Shipping Label Address
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const fullLabel = `${selectedCustomer.fullName}\nPhone: ${selectedCustomer.phone}\n${selectedCustomer.addressLine1 || selectedCustomer.address}\n${selectedCustomer.addressLine2 ? selectedCustomer.addressLine2 + '\n' : ''}${selectedCustomer.landmark ? 'Landmark: ' + selectedCustomer.landmark + '\n' : ''}${selectedCustomer.city}, ${selectedCustomer.state} - ${selectedCustomer.pincode}`;
                    handleCopy(fullLabel, 'Address Slip');
                  }}
                  className="text-xs text-[#110D09] hover:text-[#8C6D42] font-mono flex items-center space-x-1 border border-[#D5CDC2] px-2 py-1 bg-white"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Shipping Label</span>
                </button>
              </div>

              <div className="text-xs font-mono text-[#110D09] space-y-1">
                <p className="font-bold text-sm">{selectedCustomer.fullName}</p>
                <p>Phone: +91 {selectedCustomer.phone}</p>
                <p>{selectedCustomer.addressLine1 || selectedCustomer.address}</p>
                {selectedCustomer.addressLine2 && <p>{selectedCustomer.addressLine2}</p>}
                {selectedCustomer.landmark && (
                  <p className="text-amber-800 font-bold">
                    Nearby Landmark: {selectedCustomer.landmark}
                  </p>
                )}
                <p>
                  {selectedCustomer.city}, {selectedCustomer.state} — {selectedCustomer.pincode}
                </p>
              </div>
            </div>

            {/* CLIENT ORDERS LEDGER (WITH DELIVERY TICK) */}
            <div className="space-y-3">
              <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Orders & Flacon Allocations
              </span>

              <div className="space-y-3">
                {(selectedCustomer.orders || []).map((o: any) => {
                  const isDel = o.isDelivered || o.orderStatus === 'Delivered';
                  return (
                    <div
                      key={o.id}
                      className="p-4 bg-white border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-sm text-[#110D09] block">{o.id}</span>
                        <span className="text-[#110D09]/60 text-[11px] block">
                          {o.items?.[0]?.productName || 'Cacao Citrine'} • ₹{o.amountPaidToday} Paid • UTR: {o.paymentTransactionId || 'Pending'}
                        </span>
                        {o.receiptImageUrl && (
                          <a
                            href={o.receiptImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[11px] text-[#8C6D42] hover:text-[#110D09] underline font-medium mt-0.5"
                          >
                            <span>Receipt Proof</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleToggleDelivery(o.id, isDel)}
                          className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center space-x-2 border transition-all ${
                            isDel
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-white border-amber-400 text-amber-900 hover:bg-amber-50'
                          }`}
                        >
                          {isDel ? (
                            <>
                              <CheckSquare className="w-4 h-4 text-white" />
                              <span>✓ Delivered</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-4 h-4 text-amber-600" />
                              <span>Tick When Delivered</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CLIENT MESSAGES & REQUESTS */}
            {(selectedCustomer.inquiries || []).length > 0 && (
              <div className="space-y-3 pt-3 border-t border-[#E8E2D8]">
                <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                  Client Messages & Website Inquiries
                </span>
                <div className="space-y-2">
                  {selectedCustomer.inquiries?.map((inq: any) => (
                    <div
                      key={inq.id}
                      className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] text-xs space-y-1.5 font-mono"
                    >
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-[#110D09]">{inq.subject}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            inq.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-[#110D09]/80 font-sans font-light">{inq.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ORDER INSPECTOR DOSSIER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E8E2D8] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-[#110D09]/60 hover:text-[#110D09] text-sm font-mono font-bold"
            >
              [Close ✕]
            </button>

            <div className="border-b border-[#E8E2D8] pb-4">
              <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Atelier Order Dossier
              </span>
              <h2 className="text-2xl font-serif text-[#110D09]">{selectedOrder.id}</h2>
              <p className="text-xs text-[#110D09]/50 font-mono">
                Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Delivery Tick Checkbox */}
            <div className="p-4 bg-amber-50/70 border border-amber-300 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-950 block">
                  Delivery Fulfilment State
                </span>
                <span className="text-[11px] text-amber-900 font-mono">
                  {(selectedOrder as any).isDelivered || selectedOrder.orderStatus === 'Delivered'
                    ? 'Flacon is marked as DELIVERED to client.'
                    : 'Awaiting dispatch / delivery tick.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleToggleDelivery(
                    selectedOrder.id,
                    (selectedOrder as any).isDelivered || selectedOrder.orderStatus === 'Delivered'
                  )
                }
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center space-x-2 border ${
                  (selectedOrder as any).isDelivered || selectedOrder.orderStatus === 'Delivered'
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white border-amber-500 text-amber-900'
                }`}
              >
                {(selectedOrder as any).isDelivered || selectedOrder.orderStatus === 'Delivered' ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-white" />
                    <span>✓ Delivered</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-amber-600" />
                    <span>Tick Delivered</span>
                  </>
                )}
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-[#FAF8F5] p-4 border border-[#E8E2D8] text-xs space-y-2">
              <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Client Contact & Delivery Address
              </span>
              <p className="text-sm font-serif text-[#110D09] font-semibold">
                {selectedOrder.customer.fullName}
              </p>
              <p className="text-[#110D09]/80 font-mono">
                Phone: +91 {selectedOrder.customer.phone} • Email: {selectedOrder.customer.email}
              </p>
              <p className="text-[#110D09]/70 font-light">
                {selectedOrder.customer.addressLine1 || selectedOrder.customer.address}
                {selectedOrder.customer.addressLine2 ? ', ' + selectedOrder.customer.addressLine2 : ''}
              </p>
              {selectedOrder.customer.landmark && (
                <p className="text-amber-800 font-mono text-[11px]">
                  Landmark: {selectedOrder.customer.landmark}
                </p>
              )}
              <p className="text-[#110D09]/80 font-mono">
                {selectedOrder.customer.city}, {selectedOrder.customer.state} — {selectedOrder.customer.pincode}
              </p>
            </div>

            {/* Financial Status */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF8F5] border border-[#E8E2D8] text-xs font-mono">
              <div>
                <span className="text-[#110D09]/50 block">Pre-Order Paid:</span>
                <span className="text-base text-emerald-800 font-bold">
                  ₹{selectedOrder.amountPaidToday}
                </span>
              </div>
              <div>
                <span className="text-[#110D09]/50 block">UTR / Transaction ID:</span>
                <span className="text-sm text-[#110D09] font-bold">
                  {selectedOrder.paymentTransactionId || 'Pending'}
                </span>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
              <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Ledger History Timeline
              </span>
              <div className="space-y-2 text-xs font-mono max-h-40 overflow-y-auto pr-1">
                {(selectedOrder.history || []).map((h, i) => (
                  <div key={i} className="p-2.5 bg-[#FAF8F5] border border-[#E8E2D8] space-y-1">
                    <div className="flex justify-between text-[10px] text-[#110D09]/50">
                      <span className="text-[#110D09] font-semibold">{h.status}</span>
                      <span>{new Date(h.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-[#110D09]/80 font-light">{h.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT DETAILS */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveProductChanges}
            className="bg-white border border-[#E8E2D8] w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-[#110D09]/60 hover:text-[#110D09] text-sm font-mono font-bold"
            >
              [Close ✕]
            </button>

            <div>
              <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Fragrance Catalog Editor
              </span>
              <h2 className="text-2xl font-serif text-[#110D09]">{editingProduct.name}</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#110D09]/70 font-mono mb-1">Inventory Count</label>
                <input
                  type="number"
                  value={editingProduct.inventory}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, inventory: Number(e.target.value) })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2 text-[#110D09] font-mono focus:outline-none focus:border-[#110D09]"
                />
              </div>

              <div>
                <label className="block text-[#110D09]/70 font-mono mb-1">
                  Pre-Order Privilege Price (₹)
                </label>
                <input
                  type="number"
                  value={editingProduct.fullPrice || 399}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, fullPrice: Number(e.target.value) })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2 text-[#110D09] font-mono focus:outline-none focus:border-[#110D09]"
                />
              </div>

              <div>
                <label className="block text-[#110D09]/70 font-mono mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2 text-[#110D09] focus:outline-none focus:border-[#110D09]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-xs font-mono border border-[#E8E2D8] text-[#110D09]/70 hover:border-[#110D09]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProduct}
                className="btn-luxury px-6 py-2 text-xs font-mono font-bold"
              >
                {savingProduct ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
