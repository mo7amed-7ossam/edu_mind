import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';

interface SectionPlaceholderPageProps {
  title: string;
  category: string;
  description: string;
  badge?: string;
  items?: { id: string; name: string; detail: string; status: string }[];
}

export const SectionPlaceholderPage: React.FC<SectionPlaceholderPageProps> = ({
  title,
  category,
  description,
  badge = 'نشط',
  items = [
    { id: '1', name: 'عنصر نموذجي 1', detail: 'تفاصيل البيانات الأساسية للنظام', status: 'مفعل' },
    { id: '2', name: 'عنصر نموذجي 2', detail: 'الإعدادات المعتمدة وفق اللائحة', status: 'مفعل' },
    { id: '3', name: 'عنصر نموذجي 3', detail: 'سجل العمليات والربط التلقائي', status: 'قيد المراجعة' },
  ],
}) => {
  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-150">
      {/* شريط الإجراءات والبحث */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="inline-flex bg-[#F1F3F5] p-[3px] rounded-full self-start">
          <button
            type="button"
            className="px-5 py-1.5 rounded-full text-[12px] font-bold bg-[var(--teal)] text-white shadow-sm"
          >
            الكل ({items.length})
          </button>
          <button
            type="button"
            className="px-5 py-1.5 rounded-full text-[12px] font-bold text-[var(--navy)] hover:text-black bg-transparent"
          >
            النشطة
          </button>
          <button
            type="button"
            className="px-5 py-1.5 rounded-full text-[12px] font-bold text-[var(--navy)] hover:text-black bg-transparent"
          >
            المؤرشفة
          </button>
        </div>

        <button type="button" className="abtn teal">
          <Plus size={14} />
          <span>+ إضافة إلى {title}</span>
        </button>
      </div>

      {/* اللوحة الرئيسية */}
      <div className="admin-panel flex flex-col gap-3">
        <div className="panel-head flex items-center justify-between">
          <div>
            <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
              قائمة {title}
            </h4>
            <p className="text-[11px] text-[#5A6472] mt-0.5 mb-0">
              {description}
            </p>
          </div>
          <span className="badge-pill on text-[10px]">
            {badge}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table text-right min-w-[500px]">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>الاسم / التعريف</th>
                <th style={{ width: '45%' }}>الوصف والتفاصيل</th>
                <th style={{ width: '15%' }}>الحالة</th>
                <th style={{ width: '10%', textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F9FBFC] transition-colors">
                  <td className="font-bold text-[11.5px] text-[var(--navy)]">
                    {item.name}
                  </td>
                  <td className="text-[11px] text-[#5A6472]">
                    {item.detail}
                  </td>
                  <td>
                    <span className="badge-pill on text-[10px]">
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="abtn outline py-1 px-2.5 text-[10px]"
                    >
                      عرض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
