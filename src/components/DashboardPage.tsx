import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Globe, CreditCard, Award, ShieldCheck, TrendingUp, ArrowLeft } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const kpiCards = [
    { label: 'إجمالي المستخدمين', value: '14,820', change: '+12%', isUp: true, icon: <Users size={18} className="text-[var(--teal)]" /> },
    { label: 'الدول النشطة', value: '4 دول', change: 'مفعل', isUp: true, icon: <Globe size={18} className="text-[#3B82F6]" /> },
    { label: 'التقويم الأكاديمي', value: '2026/2027', change: 'ساري', isUp: true, icon: <Calendar size={18} className="text-[var(--purple)]" /> },
    { label: 'الاشتراكات النشطة', value: '5,940', change: '+8.4%', isUp: true, icon: <CreditCard size={18} className="text-[var(--yellow)]" /> },
  ];

  const quickLinks = [
    { title: 'التقويم الأكاديمي', desc: 'إدارة الفصول الدراسية والإجازات الرسمية', to: '/calendar', color: 'bg-[#E3F7F4] text-[var(--teal)]' },
    { title: 'الدول والمناهج', desc: 'إعداد الدول والصفوف والمناهج المعتمدة', to: '/countries', color: 'bg-[#EFF6FF] text-[#2563EB]' },
    { title: 'المستخدمون والطلاب', desc: 'إدارة أولياء الأمور والطلاب وتوزيع الصلاحيات', to: '/users', color: 'bg-[#F1ECFB] text-[var(--purple)]' },
    { title: 'الاشتراكات والخطط', desc: 'باقات الاشتراك وأكواد الخصم والتقارير المالية', to: '/subscriptions', color: 'bg-[#FEF3C7] text-[#D97706]' },
  ];

  return (
    <div className="flex flex-col gap-5 w-full animate-in fade-in duration-150">
      {/* بطاقات المؤشرات الأساسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="kpi-card">
            <div className="flex items-center justify-between">
              <span className="kpi-label">{kpi.label}</span>
              <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center border border-[var(--border-light)]">
                {kpi.icon}
              </div>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="kpi-value font-latin">{kpi.value}</span>
              <span className={`kpi-delta ${kpi.isUp ? 'up' : 'down'} text-[10px]`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* روابط سريعة لأقسام المنصة */}
      <div className="admin-panel flex flex-col gap-4">
        <div className="panel-head">
          <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
            روابط الوصول السريع لأقسام المنصة
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {quickLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="p-4 rounded-xl border border-[var(--border-light)] bg-[#FAFBFC] hover:bg-white hover:shadow-md hover:border-[var(--teal)] transition-all flex items-center justify-between no-underline group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${item.color}`}>
                  {item.to === '/calendar' ? '📅' : item.to === '/countries' ? '🌍' : item.to === '/users' ? '👥' : '💳'}
                </div>
                <div className="flex flex-col">
                  <span className="text-[12.5px] font-bold text-[var(--navy)] group-hover:text-[var(--teal)] transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#5A6472] mt-0.5">
                    {item.desc}
                  </span>
                </div>
              </div>
              <ArrowLeft size={16} className="text-[#A0AEC0] group-hover:text-[var(--teal)] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
