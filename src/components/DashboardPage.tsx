import React from 'react';
import { Users, CreditCard, BookOpen, Award, TrendingUp, AlertTriangle } from 'lucide-react';

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const kpiData = [
    {
      label: 'إجمالي الطلاب المسجلين',
      value: '14,820',
      delta: '▲ 14%',
      isUp: true,
      hint: 'طالب نشط',
      page: 'users',
    },
    {
      label: 'أولياء الأمور النشطين',
      value: '8,450',
      delta: '▲ 8%',
      isUp: true,
      hint: 'حساب موثق',
      page: 'users',
    },
    {
      label: 'الإيراد الشهري المتكرر',
      value: '184,200 ر.س',
      delta: '▲ 12%',
      isUp: true,
      hint: 'MRR الحالي',
      page: 'subscriptions',
    },
    {
      label: 'معدل التجديد والاحتفاظ',
      value: '91.4%',
      delta: '▲ 2.1%',
      isUp: true,
      hint: 'هذا الفصل',
      page: 'subscriptions',
    },
  ];

  const recentUsers = [
    {
      name: 'علي المطيري',
      role: 'طالب — السادس ابتدائي',
      plan: 'باقة متقدمة',
      date: '2026-03-02',
      status: 'active',
      statusLabel: 'نشط',
    },
    {
      name: 'سارة الدوسري',
      role: 'ولي أمر (طالبين)',
      plan: 'باقة عائلية',
      date: '2026-03-01',
      status: 'active',
      statusLabel: 'نشط',
    },
    {
      name: 'سعود العتيبي',
      role: 'طالب — الأول متوسط',
      plan: 'باقة أساسية',
      date: '2026-02-28',
      status: 'active',
      statusLabel: 'نشط',
    },
    {
      name: 'فهد القحطاني',
      role: 'ولي أمر (3 طلاب)',
      plan: 'منتهي',
      date: '2026-02-27',
      status: 'expired',
      statusLabel: 'معلّق',
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      title: 'بدء التسجيل للفصل الدراسي الثاني',
      time: 'التقويم الأكاديمي',
      type: 'info',
      icon: '📅',
    },
    {
      id: 2,
      title: 'تحديث منهج الرياضيات للصف الخامس (السعودية)',
      time: 'المناهج والدروس',
      type: 'success',
      icon: '📚',
    },
    {
      id: 3,
      title: '2 محادثة ذكاء اصطناعي بحاجة للمراجعة الأمنية',
      time: 'سلامة المحتوى',
      type: 'warn',
      icon: '🛡️',
    },
  ];

  return (
    <div className="flex flex-col gap-[14px] w-full">
      {/* 1. صف بطاقات الـ KPI العلوية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
        {kpiData.map((kpi, idx) => (
          <div
            key={idx}
            className={`kpi-card ${onNavigate ? 'cursor-pointer hover:border-[var(--teal)] transition-colors' : ''}`}
            onClick={() => onNavigate && onNavigate(kpi.page)}
          >
            <div className="flex flex-col">
              <span className="kpi-value font-latin">{kpi.value}</span>
              <span className="kpi-label">{kpi.label}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`kpi-delta ${kpi.isUp ? 'up' : 'down'}`}>
                {kpi.delta}
              </span>
              <span className="text-[9.5px] text-[var(--gray)] font-medium">
                {kpi.hint}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. الصف الأوسط: جدول أحدث المستخدمين + تنبيهات المنصة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px] items-start">
        {/* جدول أحدث المشتركين */}
        <div className="lg:col-span-2 admin-panel">
          <div className="panel-head mb-4 flex items-center justify-between">
            <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
              أحدث العمليات والمستخدمين
            </h4>
            {onNavigate && (
              <button
                type="button"
                className="abtn outline text-[10.5px] py-1 px-3"
                onClick={() => onNavigate('users')}
              >
                عرض كل المستخدمين ←
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table text-right min-w-[500px]">
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>الاسم / الحساب</th>
                  <th style={{ width: '28%' }}>نوع الحساب</th>
                  <th style={{ width: '22%' }}>الاشتراك</th>
                  <th style={{ width: '18%', textAlign: 'center' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-[#F9FBFC] transition-colors">
                    <td className="font-bold text-[11.5px] text-[var(--navy)]">
                      {u.name}
                    </td>
                    <td className="text-[11px] text-[var(--gray)]">
                      {u.role}
                    </td>
                    <td>
                      <span className="font-bold text-[10.5px] text-[var(--navy)]">
                        {u.plan}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={`badge-pill ${u.status === 'active' ? 'on' : 'danger'}`}
                      >
                        {u.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* تنبيهات النظام والإحصائيات السريعة */}
        <div className="flex flex-col gap-[14px]">
          <div className="admin-panel flex flex-col gap-3">
            <div className="panel-head mb-2">
              <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
                مستجدات المنصة
              </h4>
            </div>

            <div className="flex flex-col gap-2.5">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-[#FAFBFC] border border-[var(--border-light)] flex items-start gap-3"
                >
                  <span className="text-[16px] leading-none mt-0.5">
                    {alert.icon}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[var(--navy)] leading-snug">
                      {alert.title}
                    </span>
                    <span className="text-[9.5px] text-[var(--gray)] mt-1 font-medium">
                      {alert.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="admin-panel flex flex-col gap-2">
            <h4 className="text-[12.5px] font-extrabold text-[#17325C] mb-2">
              إجراءات سريعة
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {onNavigate && (
                <>
                  <button
                    type="button"
                    className="abtn outline text-[10.5px] py-1.5 justify-center"
                    onClick={() => onNavigate('countries')}
                  >
                    🌍 إدارة الدول
                  </button>
                  <button
                    type="button"
                    className="abtn outline text-[10.5px] py-1.5 justify-center"
                    onClick={() => onNavigate('calendar')}
                  >
                    📅 التقويم الدراسي
                  </button>
                  <button
                    type="button"
                    className="abtn outline text-[10.5px] py-1.5 justify-center"
                    onClick={() => onNavigate('subscriptions')}
                  >
                    💳 خطط الاشتراك
                  </button>
                  <button
                    type="button"
                    className="abtn outline text-[10.5px] py-1.5 justify-center"
                    onClick={() => onNavigate('users')}
                  >
                    👥 إدارة المستخدمين
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
