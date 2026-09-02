import React, { useState, useEffect } from 'react';
import { Eye, User, Search, X } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  letter: string;
  avatarColor: string;
  grade: string;
  subscriptionStatus: 'subscribed' | 'inactive';
  subscriptionLabel: string;
}

interface ParentUser {
  id: string;
  name: string;
  phone: string;
  registerDate: string;
  childrenCount: number;
  status: 'active' | 'suspended';
  statusLabel: string;
  email?: string;
  city?: string;
  children: Child[];
}

interface StudentUser {
  id: string;
  name: string;
  parentName: string;
  parentPhone: string;
  grade: string;
  school?: string;
  subscriptionStatus: 'subscribed' | 'inactive';
  subscriptionLabel: string;
  status: 'active' | 'suspended';
  statusLabel: string;
  registerDate: string;
  letter: string;
  avatarColor: string;
}

interface UsersPageProps {
  onBackRequest?: (handleBack: (() => void) | null) => void;
  onSubScreenChange?: (isSubScreen: boolean, subTitle?: string) => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ onBackRequest, onSubScreenChange }) => {
  const [activeTab, setActiveTab] = useState<'parents' | 'students'>('parents');
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  // إشعار الشريط العلوي بتغير الشاشة الفرعية وتمرير دالة الرجوع
  useEffect(() => {
    if (onSubScreenChange) {
      if (viewMode === 'details') {
        onSubScreenChange(true, 'تفاصيل المستخدم');
      } else {
        onSubScreenChange(false);
      }
    }
    if (onBackRequest) {
      if (viewMode === 'details') {
        onBackRequest(() => setViewMode('list'));
      } else {
        onBackRequest(null);
      }
    }
  }, [viewMode, onSubScreenChange, onBackRequest]);

  // بيانات أولياء الأمور
  const [parents, setParents] = useState<ParentUser[]>([
    {
      id: 'p1',
      name: 'خالد المطيري',
      phone: '05XXXXXXXX',
      registerDate: '2026-02-11',
      childrenCount: 2,
      status: 'active',
      statusLabel: 'نشط',
      email: 'khaled.m@example.com',
      city: 'الرياض',
      children: [
        {
          id: 'c1',
          name: 'علي',
          letter: 'ع',
          avatarColor: '#5B4B9E',
          grade: 'السادس ابتدائي',
          subscriptionStatus: 'subscribed',
          subscriptionLabel: 'مشترك',
        },
        {
          id: 'c2',
          name: 'لين',
          letter: 'ل',
          avatarColor: '#E8604C',
          grade: 'الرابع ابتدائي',
          subscriptionStatus: 'subscribed',
          subscriptionLabel: 'مشترك',
        },
      ],
    },
    {
      id: 'p2',
      name: 'مي العتيبي',
      phone: '05XXXXXXXX',
      registerDate: '2026-03-02',
      childrenCount: 1,
      status: 'active',
      statusLabel: 'نشط',
      email: 'mai.otaibi@example.com',
      city: 'جدة',
      children: [
        {
          id: 'c3',
          name: 'سعود',
          letter: 'س',
          avatarColor: '#169E92',
          grade: 'الأول متوسط',
          subscriptionStatus: 'subscribed',
          subscriptionLabel: 'مشترك',
        },
      ],
    },
    {
      id: 'p3',
      name: 'فهد القحطاني',
      phone: '05XXXXXXXX',
      registerDate: '2026-01-20',
      childrenCount: 3,
      status: 'suspended',
      statusLabel: 'معلّق',
      email: 'fahad.q@example.com',
      city: 'الدمام',
      children: [
        {
          id: 'c4',
          name: 'نورة',
          letter: 'ن',
          avatarColor: '#E8604C',
          grade: 'الثالث ابتدائي',
          subscriptionStatus: 'inactive',
          subscriptionLabel: 'منتهي',
        },
        {
          id: 'c5',
          name: 'راكان',
          letter: 'ر',
          avatarColor: '#5B4B9E',
          grade: 'الخامس ابتدائي',
          subscriptionStatus: 'inactive',
          subscriptionLabel: 'منتهي',
        },
      ],
    },
    {
      id: 'p4',
      name: 'سارة الدوسري',
      phone: '05XXXXXXXX',
      registerDate: '2026-02-28',
      childrenCount: 1,
      status: 'active',
      statusLabel: 'نشط',
      email: 'sara.d@example.com',
      city: 'الرياض',
      children: [
        {
          id: 'c6',
          name: 'عبدالله',
          letter: 'ع',
          avatarColor: '#169E92',
          grade: 'الثاني متوسط',
          subscriptionStatus: 'subscribed',
          subscriptionLabel: 'مشترك',
        },
      ],
    },
    {
      id: 'p5',
      name: 'عبدالرحمن الشهري',
      phone: '05XXXXXXXX',
      registerDate: '2026-03-01',
      childrenCount: 2,
      status: 'active',
      statusLabel: 'نشط',
      email: 'abdulrahman.sh@example.com',
      city: 'أبها',
      children: [
        {
          id: 'c7',
          name: 'ريما',
          letter: 'ر',
          avatarColor: '#E8604C',
          grade: 'الأول ابتدائي',
          subscriptionStatus: 'subscribed',
          subscriptionLabel: 'مشترك',
        },
      ],
    },
  ]);

  // بيانات الطلاب
  const [students, setStudents] = useState<StudentUser[]>([
    {
      id: 's1',
      name: 'علي المطيري',
      parentName: 'خالد المطيري',
      parentPhone: '05XXXXXXXX',
      grade: 'السادس ابتدائي',
      school: 'مدرسة الرواد الأهلية',
      subscriptionStatus: 'subscribed',
      subscriptionLabel: 'مشترك',
      status: 'active',
      statusLabel: 'نشط',
      registerDate: '2026-02-11',
      letter: 'ع',
      avatarColor: '#5B4B9E',
    },
    {
      id: 's2',
      name: 'لين المطيري',
      parentName: 'خالد المطيري',
      parentPhone: '05XXXXXXXX',
      grade: 'الرابع ابتدائي',
      school: 'مدرسة المنهل النموذجية',
      subscriptionStatus: 'subscribed',
      subscriptionLabel: 'مشترك',
      status: 'active',
      statusLabel: 'نشط',
      registerDate: '2026-02-11',
      letter: 'ل',
      avatarColor: '#E8604C',
    },
    {
      id: 's3',
      name: 'سعود العتيبي',
      parentName: 'مي العتيبي',
      parentPhone: '05XXXXXXXX',
      grade: 'الأول متوسط',
      school: 'مدرسة الأندلس المتوسطة',
      subscriptionStatus: 'subscribed',
      subscriptionLabel: 'مشترك',
      status: 'active',
      statusLabel: 'نشط',
      registerDate: '2026-03-02',
      letter: 'س',
      avatarColor: '#169E92',
    },
    {
      id: 's4',
      name: 'نورة القحطاني',
      parentName: 'فهد القحطاني',
      parentPhone: '05XXXXXXXX',
      grade: 'الثالث ابتدائي',
      school: 'مدارس الفيصلية',
      subscriptionStatus: 'inactive',
      subscriptionLabel: 'غير مشترك',
      status: 'suspended',
      statusLabel: 'معلّق',
      registerDate: '2026-01-20',
      letter: 'ن',
      avatarColor: '#E8604C',
    },
    {
      id: 's5',
      name: 'عبدالله الدوسري',
      parentName: 'سارة الدوسري',
      parentPhone: '05XXXXXXXX',
      grade: 'الثاني متوسط',
      school: 'مدارس دار العلوم',
      subscriptionStatus: 'subscribed',
      subscriptionLabel: 'مشترك',
      status: 'active',
      statusLabel: 'نشط',
      registerDate: '2026-02-28',
      letter: 'ع',
      avatarColor: '#169E92',
    },
    {
      id: 's6',
      name: 'ريما الشهري',
      parentName: 'عبدالرحمن الشهري',
      parentPhone: '05XXXXXXXX',
      grade: 'الأول ابتدائي',
      school: 'مدارس المستقبل',
      subscriptionStatus: 'subscribed',
      subscriptionLabel: 'مشترك',
      status: 'active',
      statusLabel: 'نشط',
      registerDate: '2026-03-01',
      letter: 'ر',
      avatarColor: '#E8604C',
    },
  ]);

  // بحث
  const [searchQuery, setSearchQuery] = useState<string>('');

  // المستخدم المحدد حالياً
  const [selectedParentId, setSelectedParentId] = useState<string>('p1');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s1');

  // تصفية أولياء الأمور
  const filteredParents = parents.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      p.children.some((c) => c.name.toLowerCase().includes(q))
    );
  });

  // تصفية الطلاب
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q) ||
      s.parentPhone.includes(q) ||
      s.grade.toLowerCase().includes(q) ||
      (s.school && s.school.toLowerCase().includes(q))
    );
  });

  const selectedParent =
    parents.find((p) => p.id === selectedParentId) ||
    filteredParents[0] ||
    parents[0];
  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) ||
    filteredStudents[0] ||
    students[0];

  // تبديل حالة الحساب (تعليق / تفعيل)
  const toggleParentStatus = (parentId: string) => {
    setParents((prev) =>
      prev.map((p) => {
        if (p.id === parentId) {
          const newStatus = p.status === 'active' ? 'suspended' : 'active';
          return {
            ...p,
            status: newStatus,
            statusLabel: newStatus === 'active' ? 'نشط' : 'معلّق',
          };
        }
        return p;
      })
    );
  };

  const toggleStudentStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newStatus = s.status === 'active' ? 'suspended' : 'active';
          return {
            ...s,
            status: newStatus,
            statusLabel: newStatus === 'active' ? 'نشط' : 'معلّق',
          };
        }
        return s;
      })
    );
  };

  // ==========================================
  // شاشة تفاصيل المستخدم (صفحة كاملة مطابقة للصورة المرفقة)
  // ==========================================
  if (viewMode === 'details') {
    return (
      <div className="flex flex-col gap-4">
        {activeTab === 'parents' ? (
          <div className="flex flex-col gap-4">
            {/* البطاقة 1: رأس الصفحة والملف التعريفي */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border-light)] flex items-center justify-between shadow-xs">
              {/* بيانات المستخدم الأساسية والأفاتار (يمين) */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#182C4A] text-white flex items-center justify-center text-[19px] font-extrabold flex-shrink-0">
                  {selectedParent.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-[17px] font-extrabold text-[var(--navy)] m-0 leading-tight">
                    {selectedParent.name}
                  </h1>
                  <p className="text-[12px] text-[var(--gray)] mt-0.5 m-0 font-medium">
                    ولي أمر — مسجل منذ <span className="font-latin">{selectedParent.registerDate}</span>
                  </p>
                </div>
              </div>

              {/* شارة الحالة (يسار) */}
              <div>
                <span
                  className={`badge-pill !px-4 !py-1 text-[11.5px] ${
                    selectedParent.status === 'active' ? 'on' : 'danger'
                  }`}
                >
                  {selectedParent.statusLabel}
                </span>
              </div>
            </div>

            {/* البطاقة 2: البيانات الأساسية */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border-light)] shadow-xs">
              <h2 className="text-[14px] font-extrabold text-[var(--navy)] mb-4">
                البيانات الأساسية
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-[12px]">
                {/* العمود الأيمن */}
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">الاسم</span>
                    <span className="font-bold text-[var(--navy)] text-[13px]">{selectedParent.name}</span>
                  </div>

                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">تاريخ التسجيل</span>
                    <span className="font-bold font-latin text-[var(--navy)] text-[13px]">{selectedParent.registerDate}</span>
                  </div>
                </div>

                {/* العمود الأيسر */}
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">رقم الجوال</span>
                    <span className="font-bold font-latin text-[var(--navy)] text-[13px]">{selectedParent.phone}</span>
                  </div>

                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">عدد الأبناء المرتبطين</span>
                    <span className="font-bold font-latin text-[var(--navy)] text-[13px]">{selectedParent.childrenCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* البطاقة 3: الأبناء المرتبطون */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border-light)] shadow-xs">
              <h2 className="text-[14px] font-extrabold text-[var(--navy)] mb-4">
                الأبناء المرتبطون
              </h2>

              <div className="w-full">
                {/* رأس قائمة الأبناء */}
                <div className="grid grid-cols-3 pb-3 text-[11.5px] text-[var(--gray)] font-medium border-b border-[var(--border-light)]">
                  <div className="text-right">الاسم</div>
                  <div className="text-center">الصف الدراسي</div>
                  <div className="text-left pl-3">حالة الاشتراك</div>
                </div>

                {/* صفوف الأبناء */}
                <div className="divide-y divide-[var(--border-light)]">
                  {selectedParent.children.map((child) => (
                    <div key={child.id} className="grid grid-cols-3 py-3.5 items-center text-[12.5px]">
                      <div className="font-bold text-[var(--navy)] text-right">
                        {child.name}
                      </div>
                      <div className="text-[var(--navy)] text-center">
                        {child.grade}
                      </div>
                      <div className="text-left pl-3">
                        <span
                          className={`badge-pill ${
                            child.subscriptionStatus === 'subscribed' ? 'on' : 'off'
                          }`}
                        >
                          {child.subscriptionLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* زر الإجراء: تعليق / تفعيل الحساب */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => toggleParentStatus(selectedParent.id)}
                className="px-6 py-2.5 rounded-xl text-[12.5px] font-bold border border-[var(--navy)] text-[var(--navy)] bg-white hover:bg-[#F1F3F5] transition-colors shadow-xs"
              >
                {selectedParent.status === 'active' ? 'تعليق الحساب' : 'تفعيل الحساب'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* البطاقة العلوية للطالب */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border-light)] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-full text-white flex items-center justify-center text-[19px] font-extrabold flex-shrink-0"
                  style={{ backgroundColor: selectedStudent.avatarColor }}
                >
                  {selectedStudent.letter}
                </div>
                <div>
                  <h1 className="text-[17px] font-extrabold text-[var(--navy)] m-0 leading-tight">
                    {selectedStudent.name}
                  </h1>
                  <p className="text-[12px] text-[var(--gray)] mt-0.5 m-0 font-medium">
                    طالب — ولي الأمر: <span className="font-bold text-[var(--navy)]">{selectedStudent.parentName}</span>
                  </p>
                </div>
              </div>

              <div>
                <span
                  className={`badge-pill !px-4 !py-1 text-[11.5px] ${
                    selectedStudent.status === 'active' ? 'on' : 'danger'
                  }`}
                >
                  {selectedStudent.statusLabel}
                </span>
              </div>
            </div>

            {/* بطاقة البيانات الأساسية للطالب */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--border-light)] shadow-xs">
              <h2 className="text-[14px] font-extrabold text-[var(--navy)] mb-4">
                البيانات الأساسية
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-[12px]">
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">اسم الطالب</span>
                    <span className="font-bold text-[var(--navy)] text-[13px]">{selectedStudent.name}</span>
                  </div>

                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">الصف الدراسي</span>
                    <span className="font-bold text-[var(--navy)] text-[13px]">{selectedStudent.grade}</span>
                  </div>

                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">المدرسة</span>
                    <span className="font-bold text-[var(--navy)] text-[13px]">{selectedStudent.school}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">ولي الأمر</span>
                    <span className="font-bold text-[var(--navy)] text-[13px]">{selectedStudent.parentName}</span>
                  </div>

                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">رقم جوال ولي الأمر</span>
                    <span className="font-bold font-latin text-[var(--navy)] text-[13px]">{selectedStudent.parentPhone}</span>
                  </div>

                  <div>
                    <span className="block text-[11.5px] text-[var(--gray)] mb-1">حالة الاشتراك</span>
                    <span className={`badge-pill inline-block mt-0.5 ${selectedStudent.subscriptionStatus === 'subscribed' ? 'on' : 'off'}`}>
                      {selectedStudent.subscriptionLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* زر الإجراء: تعليق / تفعيل الحساب */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => toggleStudentStatus(selectedStudent.id)}
                className="px-6 py-2.5 rounded-xl text-[12.5px] font-bold border border-[var(--navy)] text-[var(--navy)] bg-white hover:bg-[#F1F3F5] transition-colors shadow-xs"
              >
                {selectedStudent.status === 'active' ? 'تعليق الحساب' : 'تفعيل الحساب'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // شاشة قائمة المستخدمين الرئيسية (جدول + لوحة جانبية)
  // ==========================================
  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px] items-start">
        {/* عمود الجدول ومعه التبويبات والبحث في الأعلى */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* شريط التحكم: التبويبات ومربع البحث مباشرة فوق الجدول */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* التبويبات: أولياء الأمور / الطلاب */}
            <div className="inline-flex bg-[#F1F3F5] p-[3px] rounded-full self-start sm:self-auto">
              <button
                type="button"
                className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all duration-150 ${
                  activeTab === 'parents'
                    ? 'bg-[var(--teal)] text-white shadow-sm'
                    : 'text-[var(--navy)] hover:text-black bg-transparent'
                }`}
                onClick={() => setActiveTab('parents')}
              >
                أولياء الأمور
              </button>
              <button
                type="button"
                className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all duration-150 ${
                  activeTab === 'students'
                    ? 'bg-[var(--teal)] text-white shadow-sm'
                    : 'text-[var(--navy)] hover:text-black bg-transparent'
                }`}
                onClick={() => setActiveTab('students')}
              >
                الطلاب
              </button>
            </div>

            {/* مربع البحث */}
            <div className="relative flex-1 max-w-xs self-stretch sm:self-auto">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--gray)]">
                <Search size={14} strokeWidth={2.2} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'parents'
                    ? 'بحث بالاسم، الجوال، أو اسم الابن...'
                    : 'بحث باسم الطالب، ولي الأمر، أو الصف...'
                }
                className={`field !pr-9 !pl-8 !w-full ${searchQuery ? 'filled' : ''}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[var(--gray)] hover:text-[var(--navy)]"
                  title="مسح البحث"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* لوحة الجدول */}
          <div className="admin-panel !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === 'parents' ? (
                <table className="admin-table w-full">
                  <thead>
                    <tr className="bg-transparent border-b border-[var(--border-light)]">
                      <th className="!text-right pr-4 py-3">الاسم</th>
                      <th className="!text-center py-3">الجوال</th>
                      <th className="!text-center py-3">تاريخ التسجيل</th>
                      <th className="!text-center py-3">الأبناء</th>
                      <th className="!text-center py-3">الحالة</th>
                      <th className="!text-center pl-4 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-[var(--gray)] text-[12px]">
                          لا توجد نتائج مطابقة لبحثك "{searchQuery}"
                        </td>
                      </tr>
                    ) : (
                      filteredParents.map((parent) => {
                        const isSelected = parent.id === selectedParentId;
                        return (
                          <tr
                            key={parent.id}
                            onClick={() => setSelectedParentId(parent.id)}
                            className={`cursor-pointer transition-colors duration-150 ${
                              isSelected ? 'bg-[#EAFBF9]' : 'hover:bg-[#F8FAFC]'
                            }`}
                          >
                            {/* الاسم */}
                            <td className="!text-right pr-4 py-3.5 font-bold text-[var(--navy)] text-[12px]">
                              {parent.name}
                            </td>

                            {/* الجوال */}
                            <td className="!text-center py-3.5 text-[var(--navy)] font-latin text-[11.5px]">
                              {parent.phone}
                            </td>

                            {/* تاريخ التسجيل */}
                            <td className="!text-center py-3.5 text-[var(--navy)] font-latin text-[11.5px]">
                              {parent.registerDate}
                            </td>

                            {/* عدد الأبناء */}
                            <td className="!text-center py-3.5 text-[var(--navy)] font-latin font-bold text-[12px]">
                              {parent.childrenCount}
                            </td>

                            {/* الحالة */}
                            <td className="!text-center py-3.5">
                              <span
                                className={`badge-pill ${
                                  parent.status === 'active' ? 'on' : 'danger'
                                }`}
                              >
                                {parent.statusLabel}
                              </span>
                            </td>

                            {/* زر العرض */}
                            <td className="!text-center pl-4 py-3.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParentId(parent.id);
                                  setViewMode('details');
                                }}
                                className="w-7 h-7 rounded-lg bg-[#F1F3F5] hover:bg-[#E2E8F0] text-[var(--gray)] hover:text-[var(--navy)] inline-flex items-center justify-center transition-colors"
                                title="عرض التفاصيل"
                              >
                                <Eye size={13} strokeWidth={2.2} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="admin-table w-full">
                  <thead>
                    <tr className="bg-transparent border-b border-[var(--border-light)]">
                      <th className="!text-right pr-4 py-3">اسم الطالب</th>
                      <th className="!text-center py-3">ولي الأمر</th>
                      <th className="!text-center py-3">الصف الدراسي</th>
                      <th className="!text-center py-3">الاشتراك</th>
                      <th className="!text-center py-3">الحالة</th>
                      <th className="!text-center pl-4 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-[var(--gray)] text-[12px]">
                          لا توجد نتائج مطابقة لبحثك "{searchQuery}"
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => {
                        const isSelected = student.id === selectedStudentId;
                        return (
                          <tr
                            key={student.id}
                            onClick={() => setSelectedStudentId(student.id)}
                            className={`cursor-pointer transition-colors duration-150 ${
                              isSelected ? 'bg-[#EAFBF9]' : 'hover:bg-[#F8FAFC]'
                            }`}
                          >
                            {/* اسم الطالب */}
                            <td className="!text-right pr-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10.5px] flex-shrink-0"
                                  style={{ backgroundColor: student.avatarColor }}
                                >
                                  {student.letter}
                                </div>
                                <span className="font-bold text-[var(--navy)] text-[12px]">
                                  {student.name}
                                </span>
                              </div>
                            </td>

                            {/* ولي الأمر */}
                            <td className="!text-center py-3.5 text-[var(--navy)] text-[11.5px]">
                              {student.parentName}
                            </td>

                            {/* الصف الدراسي */}
                            <td className="!text-center py-3.5 text-[var(--navy)] text-[11.5px]">
                              {student.grade}
                            </td>

                            {/* الاشتراك */}
                            <td className="!text-center py-3.5">
                              <span
                                className={`badge-pill ${
                                  student.subscriptionStatus === 'subscribed' ? 'on' : 'off'
                                }`}
                              >
                                {student.subscriptionLabel}
                              </span>
                            </td>

                            {/* الحالة */}
                            <td className="!text-center py-3.5">
                              <span
                                className={`badge-pill ${
                                  student.status === 'active' ? 'on' : 'danger'
                                }`}
                              >
                                {student.statusLabel}
                              </span>
                            </td>

                            {/* زر العرض */}
                            <td className="!text-center pl-4 py-3.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudentId(student.id);
                                  setViewMode('details');
                                }}
                                className="w-7 h-7 rounded-lg bg-[#F1F3F5] hover:bg-[#E2E8F0] text-[var(--gray)] hover:text-[var(--navy)] inline-flex items-center justify-center transition-colors"
                                title="عرض التفاصيل"
                              >
                                <Eye size={13} strokeWidth={2.2} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* لوحة التفاصيل الجانبية للمستخدم المحدد */}
        {activeTab === 'parents' ? (
          <div className="admin-panel flex flex-col gap-4">
            {/* بطاقة معلومات ولي الأمر */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <User size={15} className="text-[var(--navy)]" strokeWidth={2.5} />
                  <h3 className="text-[14px] font-extrabold text-[var(--navy)] m-0">
                    {selectedParent.name}
                  </h3>
                </div>
                <span
                  className={`badge-pill ${
                    selectedParent.status === 'active' ? 'on' : 'danger'
                  }`}
                >
                  {selectedParent.statusLabel}
                </span>
              </div>
              <div className="text-[10.5px] text-[var(--gray)] font-medium">
                مسجل منذ <span className="font-latin">{selectedParent.registerDate}</span> —{' '}
                <span className="font-latin">{selectedParent.childrenCount}</span> من الأبناء
              </div>
            </div>

            {/* الأبناء المرتبطون */}
            <div>
              <h4 className="text-[12.5px] font-extrabold text-[var(--navy)] mb-3">
                الأبناء المرتبطون:
              </h4>
              <div className="flex flex-col gap-2">
                {selectedParent.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFBFC] border border-[var(--border-light)]"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                        style={{ backgroundColor: child.avatarColor }}
                      >
                        {child.letter}
                      </div>
                      <span className="font-bold text-[12px] text-[var(--navy)]">
                        {child.name}
                      </span>
                      <span className="text-[11px] text-[var(--gray)]">
                        ({child.grade})
                      </span>
                    </div>
                    <span
                      className={`badge-pill ${
                        child.subscriptionStatus === 'subscribed' ? 'on' : 'off'
                      }`}
                    >
                      {child.subscriptionLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* أزرار الإجراءات السفلية */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[var(--border-light)] mt-2">
              <button
                type="button"
                className="abtn navy !w-full"
                onClick={() => setViewMode('details')}
              >
                عرض التفاصيل
              </button>
              <button
                type="button"
                className="abtn outline !w-full"
                onClick={() => toggleParentStatus(selectedParent.id)}
              >
                {selectedParent.status === 'active' ? 'تعليق الحساب' : 'تفعيل الحساب'}
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-panel flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[11px]"
                    style={{ backgroundColor: selectedStudent.avatarColor }}
                  >
                    {selectedStudent.letter}
                  </div>
                  <h3 className="text-[14px] font-extrabold text-[var(--navy)] m-0">
                    {selectedStudent.name}
                  </h3>
                </div>
                <span
                  className={`badge-pill ${
                    selectedStudent.status === 'active' ? 'on' : 'danger'
                  }`}
                >
                  {selectedStudent.statusLabel}
                </span>
              </div>
              <div className="text-[10.5px] text-[var(--gray)] font-medium">
                {selectedStudent.grade} — {selectedStudent.school}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[var(--border-light)] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--gray)]">ولي الأمر:</span>
                <span className="font-bold text-[var(--navy)]">{selectedStudent.parentName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--gray)]">رقم الجوال:</span>
                <span className="font-latin text-[var(--navy)]">{selectedStudent.parentPhone}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--gray)]">حالة الاشتراك:</span>
                <span
                  className={`badge-pill ${
                    selectedStudent.subscriptionStatus === 'subscribed' ? 'on' : 'off'
                  }`}
                >
                  {selectedStudent.subscriptionLabel}
                </span>
              </div>
            </div>

            {/* أزرار الإجراءات السفلية */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[var(--border-light)] mt-2">
              <button
                type="button"
                className="abtn navy !w-full"
                onClick={() => setViewMode('details')}
              >
                عرض التفاصيل
              </button>
              <button
                type="button"
                className="abtn outline !w-full"
                onClick={() => toggleStudentStatus(selectedStudent.id)}
              >
                {selectedStudent.status === 'active' ? 'تعليق الحساب' : 'تفعيل الحساب'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
