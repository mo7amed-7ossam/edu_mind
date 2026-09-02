import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, Plus, Calendar as CalendarIcon, Check, ArrowRight } from 'lucide-react';

export interface OfficialHoliday {
  id: string;
  name: string;
  fromDate: string; // e.g. "09-23" or "2026-09-23"
  toDate: string;   // e.g. "09-23" or "2026-09-23"
}

export interface AcademicCalendarItem {
  id: string;
  countryCode: 'SA' | 'EG' | 'AE';
  countryName: string;
  academicYear: string; // e.g. "2027 / 2026"
  term1Start: string;   // e.g. "2026-08-24"
  term1End: string;     // e.g. "2026-12-18"
  term2Start: string;   // e.g. "2027-01-10"
  term2End: string;     // e.g. "2027-05-20"
  holidays: OfficialHoliday[];
  notes?: string;
}

interface AcademicCalendarPageProps {
  onSubScreenChange?: (isSub: boolean, title?: string) => void;
  onBackRequest?: (fn: (() => void) | null) => void;
}

export const AcademicCalendarPage: React.FC<AcademicCalendarPageProps> = ({
  onSubScreenChange,
  onBackRequest,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<'SA' | 'EG' | 'AE'>('SA');
  const [view, setView] = useState<'list' | 'form'>('list');

  // Initial Academic Calendar Data matching the design
  const [calendars, setCalendars] = useState<AcademicCalendarItem[]>([
    {
      id: 'cal-sa-1',
      countryCode: 'SA',
      countryName: 'السعودية',
      academicYear: '2027 / 2026',
      term1Start: '2026-08-24',
      term1End: '2026-12-18',
      term2Start: '2027-01-10',
      term2End: '2027-05-20',
      holidays: [
        { id: 'h-1', name: 'اليوم الوطني', fromDate: '09-23', toDate: '09-23' },
        { id: 'h-2', name: 'إجازة منتصف الفصل', fromDate: '10-20', toDate: '10-24' },
        { id: 'h-3', name: 'إجازة نهاية الفصل الأول', fromDate: '12-19', toDate: '01-09' },
      ],
    },
    {
      id: 'cal-sa-2',
      countryCode: 'SA',
      countryName: 'السعودية',
      academicYear: '2026 / 2025',
      term1Start: '2025-08-25',
      term1End: '2025-12-19',
      term2Start: '2026-01-11',
      term2End: '2026-05-21',
      holidays: [
        { id: 'h-4', name: 'اليوم الوطني', fromDate: '09-23', toDate: '09-23' },
        { id: 'h-5', name: 'يوم التأسيس', fromDate: '02-22', toDate: '02-22' },
      ],
    },
    {
      id: 'cal-eg-1',
      countryCode: 'EG',
      countryName: 'مصر',
      academicYear: '2026 / 2025',
      term1Start: '2025-09-20',
      term1End: '2026-01-22',
      term2Start: '2026-02-07',
      term2End: '2026-06-04',
      holidays: [
        { id: 'h-6', name: 'نصر 6 أكتوبر', fromDate: '10-06', toDate: '10-06' },
        { id: 'h-7', name: 'إجازة نصف العام', fromDate: '01-25', toDate: '02-06' },
      ],
    },
    {
      id: 'cal-ae-1',
      countryCode: 'AE',
      countryName: 'الإمارات',
      academicYear: '2026 / 2025',
      term1Start: '2025-08-25',
      term1End: '2025-12-12',
      term2Start: '2026-01-05',
      term2End: '2026-07-03',
      holidays: [
        { id: 'h-8', name: 'اليوم الوطني', fromDate: '12-02', toDate: '12-03' },
        { id: 'h-9', name: 'إجازة الشتاء', fromDate: '12-15', toDate: '01-02' },
      ],
    },
  ]);

  // Editing state
  const [editingItem, setEditingItem] = useState<AcademicCalendarItem | null>(null);

  // Form Fields State
  const [formCountry, setFormCountry] = useState<'SA' | 'EG' | 'AE'>('SA');
  const [formYear, setFormYear] = useState<string>('2027 / 2026');
  const [formTerm1Start, setFormTerm1Start] = useState<string>('2026-08-24');
  const [formTerm1End, setFormTerm1End] = useState<string>('2026-12-18');
  const [formTerm2Start, setFormTerm2Start] = useState<string>('2027-01-10');
  const [formTerm2End, setFormTerm2End] = useState<string>('2027-05-20');
  const [formHolidays, setFormHolidays] = useState<OfficialHoliday[]>([]);

  // Holiday Modal State
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState<boolean>(false);
  const [editingHoliday, setEditingHoliday] = useState<OfficialHoliday | null>(null);
  const [holidayName, setHolidayName] = useState<string>('');
  const [holidayFrom, setHolidayFrom] = useState<string>('');
  const [holidayTo, setHolidayTo] = useState<string>('');

  // Unified Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<AcademicCalendarItem | null>(null);
  const [holidayToDelete, setHolidayToDelete] = useState<OfficialHoliday | null>(null);

  const countries = [
    { code: 'SA', name: 'السعودية' },
    { code: 'EG', name: 'مصر' },
    { code: 'AE', name: 'الإمارات' },
  ] as const;

  const filteredCalendars = calendars.filter((item) => item.countryCode === selectedCountry);
  const currentCountryObj = countries.find((c) => c.code === selectedCountry);

  // Sync sub-screen back handler with App header
  useEffect(() => {
    if (view === 'form') {
      const title = editingItem ? 'تعديل تقويم أكاديمي' : 'إضافة تقويم أكاديمي';
      onSubScreenChange?.(true, title);
      onBackRequest?.(() => {
        handleBackToList();
      });
    } else {
      onSubScreenChange?.(false, '');
      onBackRequest?.(null);
    }
  }, [view, editingItem]);

  const handleBackToList = () => {
    setView('list');
    setEditingItem(null);
    onSubScreenChange?.(false, '');
    onBackRequest?.(null);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormCountry(selectedCountry);
    setFormYear('2028 / 2027');
    setFormTerm1Start('2027-08-23');
    setFormTerm1End('2027-12-17');
    setFormTerm2Start('2028-01-09');
    setFormTerm2End('2028-05-19');
    setFormHolidays([
      { id: 'h-temp-1', name: 'اليوم الوطني', fromDate: '09-23', toDate: '09-23' },
      { id: 'h-temp-2', name: 'إجازة منتصف الفصل', fromDate: '10-20', toDate: '10-24' },
      { id: 'h-temp-3', name: 'إجازة نهاية الفصل الأول', fromDate: '12-19', toDate: '01-09' },
    ]);
    setView('form');
  };

  const handleOpenEdit = (item: AcademicCalendarItem) => {
    setEditingItem(item);
    setFormCountry(item.countryCode);
    setFormYear(item.academicYear);
    setFormTerm1Start(item.term1Start);
    setFormTerm1End(item.term1End);
    setFormTerm2Start(item.term2Start);
    setFormTerm2End(item.term2End);
    setFormHolidays([...item.holidays]);
    setView('form');
  };

  const handleSaveCalendar = () => {
    const countryName = countries.find((c) => c.code === formCountry)?.name || 'السعودية';

    if (editingItem) {
      setCalendars((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                countryCode: formCountry,
                countryName,
                academicYear: formYear.trim(),
                term1Start: formTerm1Start,
                term1End: formTerm1End,
                term2Start: formTerm2Start,
                term2End: formTerm2End,
                holidays: [...formHolidays],
              }
            : c
        )
      );
    } else {
      const newItem: AcademicCalendarItem = {
        id: `cal-${formCountry.toLowerCase()}-${Date.now()}`,
        countryCode: formCountry,
        countryName,
        academicYear: formYear.trim(),
        term1Start: formTerm1Start,
        term1End: formTerm1End,
        term2Start: formTerm2Start,
        term2End: formTerm2End,
        holidays: [...formHolidays],
      };
      setCalendars((prev) => [newItem, ...prev]);
    }
    handleBackToList();
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setCalendars((prev) => prev.filter((c) => c.id !== itemToDelete.id));
      setItemToDelete(null);
      if (view === 'form') {
        handleBackToList();
      }
    }
  };

  // Holiday management
  const handleOpenAddHoliday = () => {
    setEditingHoliday(null);
    setHolidayName('');
    setHolidayFrom('');
    setHolidayTo('');
    setIsHolidayModalOpen(true);
  };

  const handleOpenEditHoliday = (holiday: OfficialHoliday) => {
    setEditingHoliday(holiday);
    setHolidayName(holiday.name);
    setHolidayFrom(holiday.fromDate);
    setHolidayTo(holiday.toDate);
    setIsHolidayModalOpen(true);
  };

  const handleSaveHoliday = () => {
    if (!holidayName.trim() || !holidayFrom.trim()) return;

    if (editingHoliday) {
      setFormHolidays((prev) =>
        prev.map((h) =>
          h.id === editingHoliday.id
            ? {
                ...h,
                name: holidayName.trim(),
                fromDate: holidayFrom.trim(),
                toDate: holidayTo.trim() || holidayFrom.trim(),
              }
            : h
        )
      );
    } else {
      const newHoliday: OfficialHoliday = {
        id: `h-${Date.now()}`,
        name: holidayName.trim(),
        fromDate: holidayFrom.trim(),
        toDate: holidayTo.trim() || holidayFrom.trim(),
      };
      setFormHolidays((prev) => [...prev, newHoliday]);
    }
    setIsHolidayModalOpen(false);
    setEditingHoliday(null);
  };

  const handleDeleteHoliday = (holidayId: string) => {
    setFormHolidays((prev) => prev.filter((h) => h.id !== holidayId));
  };

  // ==========================================
  // 1. شاشة العرض الرئيسية (الجدول والتبويبات)
  // ==========================================
  if (view === 'list') {
    return (
      <div className="flex flex-col gap-[14px] w-full">
        {/* شريط التحكم: التبويبات وزر الإضافة */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* التبويبات الموحدة */}
          <div className="inline-flex bg-[#F1F3F5] p-[3px] rounded-full self-start sm:self-auto">
            {countries.map((country) => {
              const isActive = selectedCountry === country.code;
              return (
                <button
                  key={country.code}
                  type="button"
                  className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--teal)] text-white shadow-sm'
                      : 'text-[var(--navy)] hover:text-black bg-transparent'
                  }`}
                  onClick={() => setSelectedCountry(country.code)}
                >
                  {country.name}
                </button>
              );
            })}
          </div>

          {/* زر الإضافة القياسي */}
          <button
            type="button"
            className="abtn teal"
            onClick={handleOpenAdd}
          >
            + إضافة تقويم أكاديمي
          </button>
        </div>

        {/* بطاقة جدول التقاويم */}
        <div className="admin-panel">
          <div className="panel-head mb-4 flex items-center justify-between">
            <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
              تقاويم {currentCountryObj?.name} ({filteredCalendars.length})
            </h4>
          </div>

          {/* الجدول */}
          <div className="overflow-x-auto">
            <table className="admin-table text-right min-w-[650px]">
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>السنة الدراسية</th>
                  <th style={{ width: '16%' }}>بداية الفصل الأول</th>
                  <th style={{ width: '16%' }}>نهاية الفصل الأول</th>
                  <th style={{ width: '16%' }}>بداية الفصل الثاني</th>
                  <th style={{ width: '16%' }}>نهاية الفصل الثاني</th>
                  <th style={{ width: '10%' }}>عدد الإجازات</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalendars.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[var(--gray)] text-[11px]">
                      لا توجد تقاويم أكاديمية مسجلة لهذه الدولة حتى الآن.
                    </td>
                  </tr>
                ) : (
                  filteredCalendars.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F9FBFC] transition-colors"
                    >
                      {/* السنة الدراسية */}
                      <td className="font-bold font-latin text-[11px] text-[var(--navy)]">
                        {item.academicYear}
                      </td>

                      {/* بداية الفصل الأول */}
                      <td className="font-latin text-[10.5px] text-[var(--navy)]">
                        {item.term1Start}
                      </td>

                      {/* نهاية الفصل الأول */}
                      <td className="font-latin text-[10.5px] text-[var(--navy)]">
                        {item.term1End}
                      </td>

                      {/* بداية الفصل الثاني */}
                      <td className="font-latin text-[10.5px] text-[var(--navy)]">
                        {item.term2Start}
                      </td>

                      {/* نهاية الفصل الثاني */}
                      <td className="font-latin text-[10.5px] text-[var(--navy)]">
                        {item.term2End}
                      </td>

                      {/* عدد الإجازات */}
                      <td>
                        <span className="font-latin text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-[#EEF2F6] text-[var(--navy)]">
                          {item.holidays?.length || 0}
                        </span>
                      </td>

                      {/* أزرار الإجراءات (تعديل وحذف) */}
                      <td>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* زر الحذف */}
                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="w-[26px] h-[26px] rounded-[7px] bg-[#FBE4DF] text-[var(--coral)] hover:bg-[#F9D2CA] flex items-center justify-center transition-colors cursor-pointer border-none"
                            title="حذف التقويم"
                          >
                            <Trash2 size={12} strokeWidth={2.2} />
                          </button>

                          {/* زر التعديل */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="w-[26px] h-[26px] rounded-[7px] bg-[#EEF2F6] text-[#E8604C] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer border-none"
                            title="تعديل التقويم"
                          >
                            <Edit2 size={12} strokeWidth={2.2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* مودل الحذف الموحد */}
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-xl w-full max-w-[350px] shadow-xl p-5 text-center flex flex-col items-center gap-3 animate-in zoom-in-95 duration-150 border border-[var(--border-light)]">
              <div className="w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center">
                <Trash2 size={20} strokeWidth={2.2} />
              </div>

              <h3 className="text-[13px] font-extrabold text-[var(--navy)] m-0">
                حذف التقويم الأكاديمي ({itemToDelete.academicYear})
              </h3>

              <div className="w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center">
                <p className="text-[10.8px] leading-relaxed text-[#E53E3E] font-medium m-0">
                  هل أنت متأكد من رغبتك في حذف التقويم للعام الدراسي {itemToDelete.academicYear} لدولة {itemToDelete.countryName}؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>

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
                  حذف التقويم
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. شاشة إضافة / تعديل التقويم الأكاديمي (طبقا للتصميم المعتمد والمطلوب)
  // =========================================================================
  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-200">
      {/* شبكة اللوحتين: البيانات الأساسية (يمين) و الإجازات الرسمية (يسار) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* اللوحة اليمنى (البيانات الأساسية) - lg:col-span-7 */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="admin-panel flex flex-col gap-4">
            {/* عنوان اللوحة */}
            <div className="panel-head">
              <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
                البيانات الأساسية
              </h4>
            </div>

            {/* الصف الأول: الدولة والسنة الدراسية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1">
                  الدولة <span className="text-[var(--coral)]">*</span>
                </label>
                <select
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value as 'SA' | 'EG' | 'AE')}
                  className="admin-select h-9 text-[11.5px]"
                >
                  <option value="SA">SA السعودية</option>
                  <option value="EG">EG مصر</option>
                  <option value="AE">AE الإمارات</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1">
                  السنة الدراسية <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="text"
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                  placeholder="2027 / 2026"
                  className="admin-input h-9 text-[11.5px] font-latin font-bold text-right"
                />
              </div>
            </div>

            {/* قسم الفصل الأول */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-light)]">
              <h5 className="text-[12px] font-extrabold text-[var(--navy)]">
                الفصل الأول
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--gray)] mb-1">
                    تاريخ البداية <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTerm1Start}
                    onChange={(e) => setFormTerm1Start(e.target.value)}
                    className="admin-input h-9 text-[11px] font-latin"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--gray)] mb-1">
                    تاريخ النهاية <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTerm1End}
                    onChange={(e) => setFormTerm1End(e.target.value)}
                    className="admin-input h-9 text-[11px] font-latin"
                  />
                </div>
              </div>
            </div>

            {/* قسم الفصل الثاني */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-light)]">
              <h5 className="text-[12px] font-extrabold text-[var(--navy)]">
                الفصل الثاني
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--gray)] mb-1">
                    تاريخ البداية <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTerm2Start}
                    onChange={(e) => setFormTerm2Start(e.target.value)}
                    className="admin-input h-9 text-[11px] font-latin"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-[var(--gray)] mb-1">
                    تاريخ النهاية <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTerm2End}
                    onChange={(e) => setFormTerm2End(e.target.value)}
                    className="admin-input h-9 text-[11px] font-latin"
                  />
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* صندوق الحذف: يظهر فقط عند التعديل (الحذف فى التعديل فقط) */}
            {/* ======================================================== */}
            {editingItem && (
              <div className="w-full p-3.5 rounded-xl bg-[#FFF5F5] border border-dashed border-[#FED7D7] flex items-center justify-between flex-wrap gap-3 mt-1">
                <div className="flex flex-col">
                  <span className="text-[12px] font-extrabold text-[var(--coral)]">
                    حذف التقويم الأكاديمي
                  </span>
                  <span className="text-[10.5px] text-[#718096] font-medium mt-0.5">
                    سيتم حذف هذا التقويم بفصليه وجميع إجازاته الرسمية نهائياً.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setItemToDelete(editingItem)}
                  className="abtn coral text-[11px] py-1.5 px-4"
                >
                  حذف التقويم
                </button>
              </div>
            )}

            {/* أزرار الإجراءات السفلية */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border-light)] mt-2">
              <button
                type="button"
                onClick={handleBackToList}
                className="abtn outline text-[11px] py-2 px-5"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveCalendar}
                className="abtn teal text-[11.5px] py-2 px-6"
              >
                حفظ التقويم
              </button>
            </div>
          </div>
        </div>

        {/* اللوحة اليسرى (الإجازات الرسمية) - lg:col-span-5 */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="admin-panel flex flex-col gap-3">
            {/* ترويسة الإجازات وزر الإضافة */}
            <div className="panel-head flex items-center justify-between">
              <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
                الإجازات الرسمية
              </h4>
              <button
                type="button"
                className="abtn teal text-[10.5px] py-1 px-3 gap-1"
                onClick={handleOpenAddHoliday}
              >
                <Plus size={13} />
                <span>إضافة إجازة</span>
              </button>
            </div>

            {/* جدول الإجازات الرسمية */}
            <div className="overflow-x-auto">
              <table className="admin-table text-right min-w-[320px]">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>الإجازة</th>
                    <th style={{ width: '20%' }}>من</th>
                    <th style={{ width: '20%' }}>إلى</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {formHolidays.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[var(--gray)] text-[10.5px]">
                        لا توجد إجازات رسمية مضافة.
                      </td>
                    </tr>
                  ) : (
                    formHolidays.map((holiday) => (
                      <tr key={holiday.id} className="hover:bg-[#F9FBFC] transition-colors">
                        {/* اسم الإجازة */}
                        <td className="text-[11px] font-bold text-[var(--navy)]">
                          {holiday.name}
                        </td>

                        {/* تاريخ البداية */}
                        <td className="font-latin text-[10.5px] text-[var(--navy)]">
                          {holiday.fromDate}
                        </td>

                        {/* تاريخ النهاية */}
                        <td className="font-latin text-[10.5px] text-[var(--navy)]">
                          {holiday.toDate}
                        </td>

                        {/* إجراءات الإجازة */}
                        <td>
                          <div className="flex items-center justify-center gap-1.5">
                            {/* حذف إجازة */}
                            <button
                              type="button"
                              onClick={() => setHolidayToDelete(holiday)}
                              className="w-[24px] h-[24px] rounded-[6px] bg-[#FBE4DF] text-[var(--coral)] hover:bg-[#F9D2CA] flex items-center justify-center transition-colors cursor-pointer border-none"
                              title="حذف الإجازة"
                            >
                              <Trash2 size={11} strokeWidth={2.2} />
                            </button>

                            {/* تعديل إجازة */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditHoliday(holiday)}
                              className="w-[24px] h-[24px] rounded-[6px] bg-[#EEF2F6] text-[#E8604C] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer border-none"
                              title="تعديل الإجازة"
                            >
                              <Edit2 size={11} strokeWidth={2.2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* نافذة منبثقة لإضافة / تعديل إجازة رسمية (بيانات الإجازة)   */}
      {/* ======================================================== */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150 border border-[var(--border-light)] text-right">
            {/* الترويسة والعنوان الفرعي */}
            <div className="flex flex-col">
              <h3 className="text-[15px] font-extrabold text-[var(--navy)] m-0">
                بيانات الإجازة
              </h3>
              <p className="text-[11.5px] text-[#718096] font-medium mt-1 mb-0">
                أضف إجازة رسمية جديدة أو عدّل إجازة قائمة ضمن التقويم الأكاديمي الحالي.
              </p>
            </div>

            {/* حقول الإدخال */}
            <div className="flex flex-col gap-3.5 mt-1">
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1">
                  اسم الإجازة <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="text"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  placeholder="مثال: اليوم الوطني"
                  className="admin-input h-9 text-[11.5px] text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--navy)] mb-1">
                    من <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="text"
                    value={holidayFrom}
                    onChange={(e) => setHolidayFrom(e.target.value)}
                    placeholder="09-23"
                    className="admin-input h-9 text-[11.5px] font-latin font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--navy)] mb-1">
                    إلى <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="text"
                    value={holidayTo}
                    onChange={(e) => setHolidayTo(e.target.value)}
                    placeholder="09-23"
                    className="admin-input h-9 text-[11.5px] font-latin font-bold text-center"
                  />
                </div>
              </div>
            </div>

            {/* صندوق الحذف: يظهر فقط عند تعديل إجازة قائمة */}
            {editingHoliday && (
              <div className="w-full p-3 rounded-xl bg-[#FFF5F5] border border-dashed border-[#FED7D7] flex items-center justify-between gap-3 mt-1">
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-extrabold text-[var(--coral)]">
                    حذف الإجازة
                  </span>
                  <span className="text-[10px] text-[#718096] font-medium mt-0.5">
                    سيُحذف هذا التاريخ نهائياً من التقويم الأكاديمي.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHolidayToDelete(editingHoliday);
                  }}
                  className="abtn coral text-[10.5px] py-1 px-3.5 font-bold"
                >
                  حذف
                </button>
              </div>
            )}

            {/* أزرار الإجراءات السفلية */}
            <div className="flex items-center justify-end gap-2.5 pt-2 mt-1 border-t border-[var(--border-light)]">
              <button
                type="button"
                onClick={() => setIsHolidayModalOpen(false)}
                className="abtn outline text-[11px] py-1.5 px-4"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveHoliday}
                className="abtn teal text-[11.5px] py-1.5 px-5 font-bold"
              >
                حفظ الإجازة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودل حذف الإجازة الموحد                                  */}
      {/* ======================================================== */}
      {holidayToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl w-full max-w-[340px] shadow-xl p-5 text-center flex flex-col items-center gap-3 animate-in zoom-in-95 duration-150 border border-[var(--border-light)]">
            <div className="w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center">
              <Trash2 size={20} strokeWidth={2.2} />
            </div>

            <h3 className="text-[13px] font-extrabold text-[var(--navy)] m-0">
              حذف الإجازة: {holidayToDelete.name}
            </h3>

            <div className="w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center">
              <p className="text-[10.8px] leading-relaxed text-[#E53E3E] font-medium m-0">
                هل أنت متأكد من رغبتك في حذف إجازة ({holidayToDelete.name}) من الفترة ({holidayToDelete.fromDate} إلى {holidayToDelete.toDate})؟
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 w-full mt-1">
              <button
                type="button"
                onClick={() => setHolidayToDelete(null)}
                className="abtn outline flex-1 py-1.5 text-[11px]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteHoliday(holidayToDelete.id);
                  setHolidayToDelete(null);
                  if (isHolidayModalOpen) {
                    setIsHolidayModalOpen(false);
                    setEditingHoliday(null);
                  }
                }}
                className="abtn coral flex-1 py-1.5 text-[11px]"
              >
                حذف الإجازة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودل الحذف الموحد المتناسق مع باقي النظام               */}
      {/* ======================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl w-full max-w-[350px] shadow-xl p-5 text-center flex flex-col items-center gap-3 animate-in zoom-in-95 duration-150 border border-[var(--border-light)]">
            <div className="w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center">
              <Trash2 size={20} strokeWidth={2.2} />
            </div>

            <h3 className="text-[13px] font-extrabold text-[var(--navy)] m-0">
              حذف التقويم الأكاديمي ({itemToDelete.academicYear})
            </h3>

            <div className="w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center">
              <p className="text-[10.8px] leading-relaxed text-[#E53E3E] font-medium m-0">
                هل أنت متأكد من رغبتك في حذف التقويم للعام الدراسي {itemToDelete.academicYear} لدولة {itemToDelete.countryName}؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>

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
                حذف التقويم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
