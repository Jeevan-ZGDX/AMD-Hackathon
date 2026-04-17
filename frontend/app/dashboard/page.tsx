"use client";

import { useState, useEffect } from "react";
import Heatmap from "@/components/Heatmap";
import { TrendingUp, Users, Package, Activity, Layers, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
    fetchProducts();
  }, []);

  const fetchAnalytics = async () => {
    const res = await fetch("http://localhost:8000/api/v1/admin/analytics");
    setAnalytics(await res.json());
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8000/api/v1/products");
    setProducts(await res.json());
  };

  return (
    <main className="min-h-screen px-6 md:px-12 py-10 max-w-7xl mx-auto flex flex-col gap-10 bg-white">
      
      {/* White Theme Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <Activity className="w-3 h-3 text-blue-600" />
            Real-time Logistics Monitoring
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Operations <span className="text-slate-400">Dashboard</span></h1>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary !text-xs !px-4 shadow-sm">Export CSV</button>
          <button className="btn-primary !text-xs !px-4">System Settings</button>
        </div>
      </div>

      {/* Structured Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<TrendingUp className="text-blue-600" />} label="Total Revenue" value={`₹${analytics?.total_revenue || 0}`} trend="+12.4%" />
        <StatCard icon={<Users className="text-emerald-600" />} label="Active Sessions" value={analytics?.active_users || 0} trend="+8%" />
        <StatCard icon={<Package className="text-slate-400" />} label="Total Inventory" value={products.length} />
        <StatCard icon={<Layers className="text-blue-600" />} label="Order Fulfillment" value="98.2%" trend="+2.1%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Geographic Intelligence */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Geographic Demand Matrix</h3>
            <span className="text-[10px] text-slate-400 font-mono">LIVE FEED ACTIVE</span>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 shadow-inner">
            <Heatmap />
          </div>
        </div>

        {/* Alert Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">System Alerts</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {analytics?.stock_alerts?.map((sku: string) => (
              <div key={sku} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between group hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Inventory Risk</span>
                  <span className="text-xs font-bold text-slate-900">{sku}</span>
                </div>
                <button className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            
            {/* Predictive Analysis Card */}
            <div className="mt-4 bg-blue-600 p-6 rounded-2xl shadow-xl shadow-blue-500/20">
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Predictive Optimization</h4>
              <p className="text-xs text-blue-50 :leading-relaxed mb-6">
                Our model suggests a 3.2% price reduction on seasonal produce to capture upcoming weekend demand surge.
              </p>
              <button className="w-full bg-white text-blue-600 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg shadow-blue-900/10">
                Execute Adjustments
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">{icon}</div>
        {trend && <span className="text-[10px] font-bold text-emerald-600">{trend}</span>}
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}
