'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
  Edit,
  Save,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { Order, Product } from '@/lib/db';

export interface AdminCustomer {
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  registeredAt: string;
  lastActiveAt: string;
  provider?: string;
  source?: string;
  ordersCount: number;
  totalSpent: number;
  pendingBalance: number;
  recentOrderId?: string | null;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    products: Product[];
    orders: Order[];
    customers?: AdminCustomer[];
    stats: {
      totalOrders: number;
      fullyPaidCount: number;
      partiallyPaidCount: number;
      totalRevenueCollected: number;
      totalPendingBalances: number;
      totalBottlesReserved: number;
      totalRegisteredCustomers?: number;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'products'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'full' | 'deposit' | 'balance_due' | 'fulfilment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Editing product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });
      const resData = await res.json();
      if (resData.success) {
        setNotificationBanner(`Order ${orderId} updated to "${newStatus}".`);
        fetchAdminData();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(resData.order);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

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
        if (resData.triggeredWorkflow) {
          setNotificationBanner(
            `"${product.name}" marked as AVAILABLE! Automated customer availability workflow triggered for ${resData.notifiedOrdersCount} order(s). Balance payment links generated.`
          );
        } else {
          setNotificationBanner(`"${product.name}" status updated to ${newStatus}.`);
        }
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

  if (loading || !data) {
    return (
      <div className="bg-[#FAF8F5] text-[#110D09] min-h-screen py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#110D09] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#110D09]/60 mt-4 font-mono">
          Loading VALCURA Atelier Dashboard...
        </p>
      </div>
    );
  }

  // Filter orders
  const filteredOrders = data.orders.filter((order) => {
    if (orderFilter === 'full' && order.plan !== 'full') return false;
    if (orderFilter === 'deposit' && order.plan !== 'deposit') return false;
    if (orderFilter === 'balance_due' && order.remainingBalance <= 0) return false;
    if (orderFilter === 'fulfilment' && order.orderStatus !== 'Ready for Fulfilment') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = order.customer.fullName.toLowerCase().includes(q);
      const matchId = order.id.toLowerCase().includes(q);
      const matchEmail = order.customer.email.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      return matchName || matchId || matchEmail || matchPhone;
    }
    return true;
  });

  // Filter registered customers
  const filteredCustomers = (data.customers || []).filter((cust) => {
    if (!customerSearchQuery) return true;
    const q = customerSearchQuery.toLowerCase();
    const matchName = cust.fullName?.toLowerCase().includes(q);
    const matchEmail = cust.email?.toLowerCase().includes(q);
    const matchPhone = cust.phone?.toLowerCase().includes(q);
    const matchAddr = cust.address?.toLowerCase().includes(q);
    return matchName || matchEmail || matchPhone || matchAddr;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#110D09] min-h-screen pb-24">
      {/* Top Header */}
      <section className="bg-white border-b border-[#E8E2D8] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
              <ShieldCheck className="w-4 h-4 text-[#8C6D42]" />
              <span>Owner & Maison Atelier Portal</span>
            </div>
            <h1 className="text-3xl font-serif uppercase tracking-wide text-[#110D09] mt-1">
              Atelier Management
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
              className="text-xs tracking-luxury uppercase border border-[#E8E2D8] text-[#110D09] px-4 py-2 hover:border-[#110D09] transition-colors font-mono"
            >
              View Live Storefront →
            </Link>
          </div>
        </div>
      </section>

      {/* Notification Banner */}
      {notificationBanner && (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-3 text-xs text-amber-900 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-700" />
            <span>{notificationBanner}</span>
          </div>
          <button
            onClick={() => setNotificationBanner(null)}
            className="text-amber-700 hover:text-amber-950 text-xs font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {/* KPI 1: Total Revenue Collected */}
          <div className="bg-white border border-[#E8E2D8] p-5 space-y-2 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Revenue Collected
            </span>
            <p className="text-2xl font-serif text-[#110D09] font-bold">
              ₹{data.stats.totalRevenueCollected}
            </p>
            <p className="text-[10px] text-emerald-700 font-mono font-medium">Verified in Bank/Gateway</p>
          </div>

          {/* KPI 2: Pending Outstanding Balances */}
          <div className="bg-white border border-[#E8E2D8] p-5 space-y-2 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Pending Balances
            </span>
            <p className="text-2xl font-serif text-amber-700 font-bold">
              ₹{data.stats.totalPendingBalances}
            </p>
            <p className="text-[10px] text-amber-700/80 font-mono">Payable on availability</p>
          </div>

          {/* KPI 3: Total Flacons Reserved */}
          <div className="bg-white border border-[#E8E2D8] p-5 space-y-2 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Flacons Reserved
            </span>
            <p className="text-2xl font-serif text-[#110D09] font-bold">
              {data.stats.totalBottlesReserved}
            </p>
            <p className="text-[10px] text-[#8C6D42] font-mono">Cacao Trilogy allocations</p>
          </div>

          {/* KPI 4: Fully Paid Orders */}
          <div className="bg-white border border-[#E8E2D8] p-5 space-y-2 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Fully Paid Orders
            </span>
            <p className="text-2xl font-serif text-emerald-700 font-bold">
              {data.stats.fullyPaidCount}
            </p>
            <p className="text-[10px] text-[#110D09]/50 font-mono">100% Settled</p>
          </div>

          {/* KPI 5: Partially Paid Deposit Orders */}
          <div className="bg-white border border-[#E8E2D8] p-5 space-y-2 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              70% Deposit Orders
            </span>
            <p className="text-2xl font-serif text-[#8C6D42] font-bold">
              {data.stats.partiallyPaidCount}
            </p>
            <p className="text-[10px] text-amber-700/80 font-mono">Awaiting balance settlement</p>
          </div>

          {/* KPI 6: Registered Clients */}
          <div className="bg-white border border-[#E8E2D8] p-5 space-y-2 shadow-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
              Registered Clients
            </span>
            <p className="text-2xl font-serif text-[#8C6D42] font-bold">
              {data.stats.totalRegisteredCustomers ?? data.customers?.length ?? 0}
            </p>
            <p className="text-[10px] text-emerald-700 font-mono">Saved in Cloud / DB</p>
          </div>
        </div>

        {/* TABS: Orders vs Clients vs Products */}
        <div className="flex border-b border-[#E8E2D8]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-6 text-xs tracking-luxury uppercase font-mono transition-all border-b-2 ${
              activeTab === 'orders'
                ? 'border-[#110D09] text-[#110D09] font-bold'
                : 'border-transparent text-[#110D09]/50 hover:text-[#110D09]'
            }`}
          >
            Orders & Reservations ({data.orders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-4 px-6 text-xs tracking-luxury uppercase font-mono transition-all border-b-2 ${
              activeTab === 'customers'
                ? 'border-[#110D09] text-[#110D09] font-bold'
                : 'border-transparent text-[#110D09]/50 hover:text-[#110D09]'
            }`}
          >
            Clients & Accounts ({data.customers?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-6 text-xs tracking-luxury uppercase font-mono transition-all border-b-2 ${
              activeTab === 'products'
                ? 'border-[#110D09] text-[#110D09] font-bold'
                : 'border-transparent text-[#110D09]/50 hover:text-[#110D09]'
            }`}
          >
            Products & Availability ({data.products.length})
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white border border-[#E8E2D8] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#8C6D42] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by client, Order ID, phone, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] pl-9 pr-3 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'full', label: 'Fully Paid' },
                  { id: 'deposit', label: '70% Deposit Paid' },
                  { id: 'balance_due', label: 'Balance Due' },
                  { id: 'fulfilment', label: 'Ready for Fulfilment' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id as any)}
                    className={`px-3 py-1.5 border transition-all ${
                      orderFilter === f.id
                        ? 'border-[#110D09] bg-[#110D09] text-white font-medium'
                        : 'border-[#E8E2D8] text-[#110D09]/70 hover:border-[#110D09]/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-[#E8E2D8] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D8] text-[#110D09] font-mono text-[10px] tracking-wider uppercase bg-[#FAF8F5]">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Item & Plan</th>
                    <th className="py-3 px-4">Paid Today</th>
                    <th className="py-3 px-4">Pending Balance</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8] font-light">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#110D09]/50 font-mono">
                        No orders match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isDep = order.plan === 'deposit';
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="py-3.5 px-4 font-mono">
                            <span className="text-[#110D09] font-semibold block">{order.id}</span>
                            <span className="text-[10px] text-[#110D09]/40">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-[#110D09] font-medium block">
                              {order.customer.fullName}
                            </span>
                            <span className="text-[11px] text-[#110D09]/60 font-mono block">
                              {order.customer.phone}
                            </span>
                            <span className="text-[10px] text-[#110D09]/40 font-mono">
                              {order.customer.city}, {order.customer.state}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-[#110D09] block">
                              {order.items[0]?.productName || 'Cacao Citrine'}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 inline-block mt-0.5 ${
                                isDep
                                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              Qty: {order.totalQuantity} •{' '}
                              {isDep ? '70% Deposit Plan' : 'Full Payment'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[#110D09] font-semibold">
                            ₹{order.amountPaidToday}
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            {order.remainingBalance > 0 ? (
                              <span className="text-amber-700 font-semibold">
                                ₹{order.remainingBalance}
                              </span>
                            ) : (
                              <span className="text-emerald-700 text-[11px] font-medium">₹0 (Fully Paid)</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-mono px-2.5 py-1 border inline-block ${
                                order.orderStatus === 'Ready for Fulfilment'
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                  : order.orderStatus === 'Ready for Balance Payment'
                                  ? 'border-amber-500 bg-amber-50 text-amber-800'
                                  : order.orderStatus.includes('Deposit Paid')
                                  ? 'border-amber-300 bg-amber-50/50 text-amber-900'
                                  : 'border-[#110D09]/30 text-[#110D09]'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              className="text-xs text-[#110D09] hover:text-[#8C6D42] font-mono underline font-medium"
                            >
                              Inspect Order →
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

        {/* TAB 2: REGISTERED CLIENTS & ACCOUNTS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Header & Search */}
            <div className="bg-white border border-[#E8E2D8] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#8C6D42] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by client name, email, phone..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] pl-9 pr-3 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono text-[#110D09]/60">
                <span>
                  Showing {filteredCustomers.length} of {data.customers?.length || 0} registered clients
                </span>
              </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white border border-[#E8E2D8] overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D8] bg-[#FAF8F5] text-[10px] tracking-widest font-mono uppercase text-[#110D09]/60">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Delivery Address</th>
                    <th className="py-3 px-4 text-center">Orders</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Outstanding</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8]">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#110D09]/50 font-mono">
                        No clients matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const initials = (cust.fullName || 'CL')
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <tr key={cust.email} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-[#3D2314] text-[#FAF7F2] font-mono text-xs flex items-center justify-center font-bold flex-shrink-0">
                                {initials || 'CL'}
                              </div>
                              <div>
                                <span className="font-bold text-[#110D09] block">{cust.fullName}</span>
                                <span className="text-[10px] text-[#8C6D42] font-mono">
                                  {cust.provider === 'google'
                                    ? 'Google Account'
                                    : cust.provider === 'microsoft'
                                    ? 'Microsoft Account'
                                    : cust.source || 'Atelier Member'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="text-[#110D09] flex items-center space-x-1.5">
                              <Mail className="w-3 h-3 text-[#8C6D42]" />
                              <span>{cust.email}</span>
                            </div>
                            {cust.phone && (
                              <div className="text-[#110D09]/70 flex items-center space-x-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-[#8C6D42]" />
                                <span>{cust.phone}</span>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-[11px] text-[#110D09]/75 max-w-xs truncate">
                            {cust.address ? (
                              <div className="flex items-start space-x-1">
                                <MapPin className="w-3 h-3 text-[#8C6D42] flex-shrink-0 mt-0.5" />
                                <span className="truncate">{cust.address}</span>
                              </div>
                            ) : (
                              <span className="text-[#110D09]/40 italic">Not provided yet</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-bold text-[#110D09]">
                            {cust.ordersCount}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                            ₹{cust.totalSpent}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-amber-700">
                            {cust.pendingBalance > 0 ? `₹${cust.pendingBalance}` : '—'}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[10px] text-[#110D09]/60">
                            {new Date(cust.lastActiveAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {cust.ordersCount > 0 ? (
                              <button
                                onClick={() => {
                                  setSearchQuery(cust.email);
                                  setActiveTab('orders');
                                }}
                                className="text-xs text-[#8C6D42] hover:text-[#110D09] font-mono underline font-medium"
                              >
                                View Orders ({cust.ordersCount}) →
                              </button>
                            ) : (
                              <span className="text-[10px] font-mono text-[#110D09]/40">No orders yet</span>
                            )}
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

        {/* TAB 3: PRODUCTS & AVAILABILITY WORKFLOW */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E8E2D8] p-6 space-y-3 shadow-sm">
              <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Product Lifecycle & Notification Workflow Engine
              </span>
              <p className="text-xs sm:text-sm text-[#110D09]/75 font-light leading-relaxed max-w-3xl">
                When an admin transitions a product from <strong className="text-[#110D09]">Pre-order</strong> to{' '}
                <strong className="text-emerald-700">Available</strong>, the system automatically
                executes the availability workflow:
              </p>
              <ul className="text-xs text-[#110D09]/70 font-mono space-y-1 pl-4 list-disc">
                <li>Partially paid deposit customers are notified and assigned status &ldquo;Ready for Balance Payment&rdquo;.</li>
                <li>A secure payment link (/pay-balance/[orderId]) is generated for their remaining balance (₹141/bottle).</li>
                <li>Fully paid customers are notified and assigned status &ldquo;Ready for Fulfilment&rdquo;.</li>
              </ul>
            </div>

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

                      {/* Pricing & Inventory details */}
                      <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-[#110D09]/50">Inventory Count:</span>
                          <span className="text-[#110D09]">{product.inventory} units</span>
                        </div>
                        {product.fullPrice && (
                          <div className="flex justify-between">
                            <span className="text-[#110D09]/50">Pre-Order Price:</span>
                            <span className="text-[#110D09] font-semibold">₹{product.fullPrice} (List ₹{product.standardPrice})</span>
                          </div>
                        )}
                        {product.notes.length > 0 && (
                          <div className="pt-1 text-[11px] text-[#110D09]/70">
                            Notes: {product.notes.join(' • ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Switcher & Edit Actions */}
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
                          title="Triggers availability notification workflow"
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
                        <span>Edit Price, Notes & Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ORDER INSPECTOR DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E8E2D8] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-[#110D09]/60 hover:text-[#110D09] text-sm font-mono"
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
                {selectedOrder.customer.address}, {selectedOrder.customer.city},{' '}
                {selectedOrder.customer.state} — {selectedOrder.customer.pincode}
              </p>
            </div>

            {/* Financial Status */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#FAF8F5] border border-[#E8E2D8] text-xs font-mono">
              <div>
                <span className="text-[#110D09]/50 block">Paid Today:</span>
                <span className="text-base text-[#110D09] font-bold">
                  ₹{selectedOrder.amountPaidToday}
                </span>
              </div>
              <div>
                <span className="text-[#110D09]/50 block">Pending Balance:</span>
                <span className="text-base text-amber-700 font-bold">
                  ₹{selectedOrder.remainingBalance}
                </span>
              </div>
              <div>
                <span className="text-[#110D09]/50 block">Total Plan:</span>
                <span className="text-base text-[#110D09] font-bold">
                  ₹{selectedOrder.totalOrderValue}
                </span>
              </div>
            </div>

            {/* Direct Balance Payment Link */}
            {selectedOrder.remainingBalance > 0 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 space-y-1.5 text-xs">
                <span className="text-[10px] tracking-widest uppercase text-amber-900 font-mono block font-semibold">
                  Customer Balance Payment Link
                </span>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/pay-balance/${selectedOrder.id}`}
                    className="w-full bg-white border border-[#D5CDC2] p-2 text-xs font-mono text-[#110D09] select-all"
                  />
                  <Link
                    href={`/pay-balance/${selectedOrder.id}`}
                    target="_blank"
                    className="bg-[#110D09] text-white px-3 py-2 text-xs font-mono font-semibold flex items-center space-x-1 hover:bg-[#2A221B]"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Order Status Action Controls */}
            <div className="space-y-3">
              <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Update Order Status:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  'Deposit Paid — Awaiting Availability',
                  'Ready for Balance Payment',
                  'Fully Paid',
                  'Ready for Fulfilment',
                  'Shipped',
                  'Completed',
                  'Cancelled',
                  'Refunded',
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                    className={`px-3 py-1.5 border transition-all ${
                      selectedOrder.orderStatus === st
                        ? 'border-[#110D09] bg-[#110D09] text-white font-bold'
                        : 'border-[#E8E2D8] text-[#110D09]/70 hover:border-[#110D09]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
              <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Ledger History Timeline
              </span>
              <div className="space-y-2 text-xs font-mono max-h-40 overflow-y-auto pr-1">
                {selectedOrder.history.map((h, i) => (
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
              className="absolute top-4 right-4 text-[#110D09]/60 hover:text-[#110D09] text-sm font-mono"
            >
              [Cancel ✕]
            </button>

            <div className="border-b border-[#E8E2D8] pb-3">
              <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Product Management
              </span>
              <h2 className="text-2xl font-serif text-[#110D09]">{editingProduct.name}</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#110D09]/70 font-mono mb-1">Inventory Allocation:</label>
                <input
                  type="number"
                  value={editingProduct.inventory}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, inventory: Number(e.target.value) })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-[#110D09] font-mono focus:outline-none focus:border-[#110D09]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#110D09]/70 font-mono mb-1">Standard Price (₹):</label>
                  <input
                    type="number"
                    value={editingProduct.standardPrice || 500}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, standardPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-[#110D09] font-mono focus:outline-none focus:border-[#110D09]"
                  />
                </div>
                <div>
                  <label className="block text-[#110D09]/70 font-mono mb-1">Full Pre-order Price (₹):</label>
                  <input
                    type="number"
                    value={editingProduct.fullPrice || 450}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, fullPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-[#110D09] font-mono focus:outline-none focus:border-[#110D09]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#110D09]/70 font-mono mb-1">Short Description:</label>
                <textarea
                  rows={3}
                  value={editingProduct.shortDescription}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09]"
                />
              </div>

              <div>
                <label className="block text-[#110D09]/70 font-mono mb-1">
                  Fragrance Notes (comma separated):
                </label>
                <input
                  type="text"
                  value={editingProduct.notes.join(', ')}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      notes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Citrus, Creamy Hazelnut, Fresh"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E2D8] flex space-x-3">
              <button
                type="submit"
                disabled={savingProduct}
                className="w-full btn-luxury-primary py-3 text-xs tracking-luxury uppercase flex items-center justify-center space-x-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProduct ? 'Saving...' : 'Save Product Record'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
