import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Globe } from 'lucide-react';

export interface CountryItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  defaultLang: string;
  curriculumSystem: string;
  classesCount: number;
  status: 'active' | 'coming_soon';
}

export const CountriesPage: React.FC = () => {
  const [countries, setCountries] = useState<CountryItem[]>([
    {
      id: 'c-1',
      code: 'SA',
      nameAr: 'السعودية',
      nameEn: 'Saudi Arabia',
      defaultLang: 'العربية (SA)',
      curriculumSystem: 'فصلين دراسيين',
      classesCount: 12,
      status: 'active',
    },
    {
      id: 'c-2',
      code: 'EG',
      nameAr: 'مصر',
      nameEn: 'Egypt',
      defaultLang: 'العربية (EG)',
      curriculumSystem: 'فصلين دراسيين',
      classesCount: 12,
      status: 'active',
    },
    {
      id: 'c-3',
      code: 'AE',
      nameAr: 'الإمارات',
      nameEn: 'United Arab Emirates',
      defaultLang: 'العربية (AE)',
      curriculumSystem: 'ثلاثة فصول',
      classesCount: 13,
      status: 'active',
    },
    {
      id: 'c-4',
      code: 'JO',
      nameAr: 'الأردن',
      nameEn: 'Jordan',
      defaultLang: 'العربية (JO)',
      curriculumSystem: 'فصلين دراسيين',
      classesCount: 12,
      status: 'coming_soon',
    },
  ]);

  // Modal State for Add / Edit
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CountryItem | null>(null);

  // Form State
  const [formCode, setFormCode] = useState<string>('');
  const [formNameAr, setFormNameAr] = useState<string>('');
  const [formNameEn, setFormNameEn] = useState<string>('');
  const [formDefaultLang, setFormDefaultLang] = useState<string>('العربية');
  const [formCurriculumSystem, setFormCurriculumSystem] = useState<string>('فصلين دراسيين');
  const [formClassesCount, setFormClassesCount] = useState<number>(12);
  const [formStatus, setFormStatus] = useState<'active' | 'coming_soon'>('active');

  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<CountryItem | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormCode('KW');
    setFormNameAr('الكويت');
    setFormNameEn('Kuwait');
    setFormDefaultLang('العربية (KW)');
    setFormCurriculumSystem('فصلين دراسيين');
    setFormClassesCount(12);
    setFormStatus('active');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item: CountryItem) => {
    setEditingItem(item);
    setFormCode(item.code);
    setFormNameAr(item.nameAr);
    setFormNameEn(item.nameEn);
    setFormDefaultLang(item.defaultLang);
    setFormCurriculumSystem(item.curriculumSystem);
    setFormClassesCount(item.classesCount);
    setFormStatus(item.status);
    setIsFormModalOpen(true);
  };

  const handleSave = () => {
    if (!formCode.trim() || !formNameAr.trim()) return;

    if (editingItem) {
      setCountries((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                code: formCode.toUpperCase().trim(),
                nameAr: formNameAr.trim(),
                nameEn: formNameEn.trim(),
                defaultLang: formDefaultLang,
                curriculumSystem: formCurriculumSystem,
                classesCount: formClassesCount,
                status: formStatus,
              }
            : c
        )
      );
    } else {
      const newItem: CountryItem = {
        id: `c-${Date.now()}`,
        code: formCode.toUpperCase().trim(),
        nameAr: formNameAr.trim(),
        nameEn: formNameEn.trim(),
        defaultLang: formDefaultLang,
        curriculumSystem: formCurriculumSystem,
        classesCount: formClassesCount,
        status: formStatus,
      };
      setCountries((prev) => [...prev, newItem]);
    }

    setIsFormModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setCountries((prev) => prev.filter((c) => c.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-[14px] w-full">
      {/* شريط الإجراءات العلوي */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="abtn teal"
          onClick={handleOpenAdd}
        >
          + إضافة دولة
        </button>
      </div>

      {/* بطاقة إدارة الدول */}
      <div className="admin-panel">
        <div className="panel-head mb-4 flex items-center justify-between">
          <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
            إدارة الدول ({countries.length})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table text-right min-w-[700px]">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>الدولة</th>
                <th style={{ width: '10%' }}>الكود</th>
                <th style={{ width: '16%' }}>اللغة الافتراضية</th>
                <th style={{ width: '16%' }}>نظام المنهج</th>
                <th style={{ width: '12%' }}>عدد الصفوف</th>
                <th style={{ width: '12%' }}>الحالة</th>
                <th style={{ width: '12%', textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((item) => (
                <tr key={item.id} className="hover:bg-[#F9FBFC] transition-colors">
                  {/* الدولة */}
                  <td>
                    <div className="flex flex-col">
                      <div className="font-bold text-[12px] text-[var(--navy)] flex items-center gap-1.5">
                        <span className="font-latin text-[11px] text-[var(--gray)]">{item.code}</span>
                        <span>{item.nameAr}</span>
                      </div>
                      <div className="text-[10px] text-[var(--gray)] font-latin">
                        {item.nameEn}
                      </div>
                    </div>
                  </td>

                  {/* الكود */}
                  <td className="font-latin font-bold text-[11px] text-[var(--navy)]">
                    {item.code}
                  </td>

                  {/* اللغة الافتراضية */}
                  <td className="text-[11px] text-[var(--navy)]">
                    {item.defaultLang}
                  </td>

                  {/* نظام المنهج */}
                  <td className="text-[11px] text-[var(--navy)]">
                    {item.curriculumSystem}
                  </td>

                  {/* عدد الصفوف */}
                  <td className="font-latin text-[11.5px] font-bold text-[var(--navy)]">
                    {item.classesCount}
                  </td>

                  {/* الحالة */}
                  <td>
                    {item.status === 'active' ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#E3F7F4] text-[var(--teal)]">
                        نشط
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#F1F3F5] text-[var(--gray)]">
                        قريباً
                      </span>
                    )}
                  </td>

                  {/* إجراءات */}
                  <td>
                    <div className="flex items-center justify-center gap-1.5">
                      {/* زر الحذف */}
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="w-[26px] h-[26px] rounded-[7px] bg-[#FBE4DF] text-[var(--coral)] hover:bg-[#F9D2CA] flex items-center justify-center transition-colors cursor-pointer border-none"
                        title="حذف الدولة"
                      >
                        <Trash2 size={12} strokeWidth={2.2} />
                      </button>

                      {/* زر التعديل */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="w-[26px] h-[26px] rounded-[7px] bg-[#EEF2F6] text-[#E8604C] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer border-none"
                        title="تعديل الدولة"
                      >
                        <Edit2 size={12} strokeWidth={2.2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* تذييل الجدول */}
        <div className="mt-4 pt-3 border-t border-[var(--border-light)] flex items-center justify-between text-[10.5px] text-[var(--gray)] font-latin">
          <span>Rows 1–{countries.length} of {countries.length}</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* مودل الحذف الموحد المتناسق مع باقي النظام               */}
      {/* ======================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl w-full max-w-[350px] shadow-xl p-5 text-center flex flex-col items-center gap-3 animate-in zoom-in-95 duration-150 border border-[var(--border-light)]">
            {/* أيقونة الحذف الموحدة */}
            <div className="w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center">
              <Trash2 size={20} strokeWidth={2.2} />
            </div>

            {/* عنوان الحذف الموحد */}
            <h3 className="text-[13px] font-extrabold text-[var(--navy)] m-0">
              حذف الدولة: {itemToDelete.code} {itemToDelete.nameAr}
            </h3>

            {/* صندوق التنبيه الوردي المدمج */}
            <div className="w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center">
              <p className="text-[10.8px] leading-relaxed text-[#E53E3E] font-medium m-0">
                لا يمكن حذف دولة مرتبطة بصفوف دراسية — يجب حذف أو نقل الصفوف المرتبطة بها أولاً ({itemToDelete.classesCount} صف حالياً)
              </p>
            </div>

            {/* أزرار الإجراءات الموحدة مثل باقي التطبيق */}
            <div className="flex items-center justify-center gap-2 w-full mt-1">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="abtn outline flex-1 py-1.5 text-[11px]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="abtn coral flex-1 py-1.5 text-[11px]"
              >
                حذف الدولة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة إضافة / تعديل الدولة */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E3F7F4] text-[var(--teal)] flex items-center justify-center">
                  <Globe size={15} />
                </div>
                <h3 className="text-[12.5px] font-extrabold text-[var(--navy)]">
                  {editingItem ? 'تعديل بيانات الدولة' : 'إضافة دولة جديدة'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="w-6 h-6 rounded-lg text-[var(--gray)] hover:bg-[#F1F3F5] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--navy)] mb-1">
                    اسم الدولة (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder="السعودية"
                    className="admin-input h-8 text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--navy)] mb-1">
                    اسم الدولة (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="Saudi Arabia"
                    className="admin-input h-8 text-[11px] font-latin"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--navy)] mb-1">
                    كود الدولة (ISO)
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="SA"
                    maxLength={3}
                    className="admin-input h-8 text-[11px] font-latin font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--navy)] mb-1">
                    الحالة
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'active' | 'coming_soon')}
                    className="admin-select h-8 text-[11px]"
                  >
                    <option value="active">نشط</option>
                    <option value="coming_soon">قريباً</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--navy)] mb-1">
                    نظام المنهج
                  </label>
                  <select
                    value={formCurriculumSystem}
                    onChange={(e) => setFormCurriculumSystem(e.target.value)}
                    className="admin-select h-8 text-[11px]"
                  >
                    <option value="فصلين دراسيين">فصلين دراسيين</option>
                    <option value="ثلاثة فصول">ثلاثة فصول</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--navy)] mb-1">
                    عدد الصفوف
                  </label>
                  <input
                    type="number"
                    value={formClassesCount}
                    onChange={(e) => setFormClassesCount(Number(e.target.value))}
                    className="admin-input h-8 text-[11px] font-latin"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-2.5 bg-[#FAFBFC] border-t border-[var(--border-light)]">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="abtn outline text-[10.5px] py-1 px-3"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="abtn teal text-[10.5px] py-1 px-3.5"
              >
                <Check size={13} />
                <span>{editingItem ? 'حفظ التعديلات' : 'إضافة الدولة'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
