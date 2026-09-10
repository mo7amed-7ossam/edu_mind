import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { EditAdminUserScreen } from './EditAdminUserScreen';

export interface AdminUser {
  id: string;
  name: string;
  initial: string;
  avatarBg: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  role: string;
  lastLogin: string;
  status: 'active' | 'suspended';
}

interface AdminUsersPageProps {
  onSubScreenChange?: (isSubScreen: boolean, title?: string) => void;
  onBackRequest?: (handleBack: (() => void) | null) => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({
  onSubScreenChange,
  onBackRequest,
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: 'adm-1',
      name: 'سارة أحمد',
      initial: 'س',
      avatarBg: '#17325C',
      email: 'sara.ahmed@smartlearn.sa',
      phone: '0501234567',
      username: 'sara.ahmed',
      password: 'password123',
      role: 'مشرف عام',
      lastLogin: 'قبل 10 دقائق',
      status: 'active',
    },
    {
      id: 'adm-2',
      name: 'خالد عمر',
      initial: 'خ',
      avatarBg: '#6366F1',
      email: 'khalid.omar@smartlearn.sa',
      phone: '0559876543',
      username: 'khalid.omar',
      password: 'password123',
      role: 'محرر محتوى',
      lastLogin: 'قبل ساعتين',
      status: 'active',
    },
    {
      id: 'adm-3',
      name: 'منى الشمري',
      initial: 'م',
      avatarBg: '#E8604C',
      email: 'mona.shamri@smartlearn.sa',
      phone: '0543219876',
      username: 'mona.shamri',
      password: 'password123',
      role: 'دعم فني',
      lastLogin: 'أمس',
      status: 'active',
    },
    {
      id: 'adm-4',
      name: 'فيصل الحربي',
      initial: 'ف',
      avatarBg: '#169E92',
      email: 'faisal.harbi@smartlearn.sa',
      phone: '0567891234',
      username: 'faisal.harbi',
      password: 'password123',
      role: 'محلل بيانات',
      lastLogin: 'قبل 3 أيام',
      status: 'active',
    },
    {
      id: 'adm-5',
      name: 'ريم القحطاني',
      initial: 'ر',
      avatarBg: '#F59E0B',
      email: 'reem.qahtani@smartlearn.sa',
      phone: '0505551234',
      username: 'reem.qahtani',
      password: 'password123',
      role: 'دعم فني',
      lastLogin: 'منذ أسبوعين',
      status: 'suspended',
    },
  ]);

  // وضع العرض: قائمة أو تعديل أو إضافة شاشة كاملة
  const [activeView, setActiveView] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // حالة مودال الحذف
  const [itemToDelete, setItemToDelete] = useState<AdminUser | null>(null);

  // إشعار الشريط العلوي بتغير الشاشة الفرعية وتمرير دالة الرجوع
  useEffect(() => {
    if (activeView !== 'list') {
      const title =
        activeView === 'create'
          ? 'إضافة مسؤول جديد'
          : `بيانات المسؤول: ${selectedAdmin?.name || ''}`;
      onSubScreenChange?.(true, title);
      onBackRequest?.(() => {
        setActiveView('list');
        setSelectedAdmin(null);
      });
    } else {
      onSubScreenChange?.(false);
      onBackRequest?.(null);
    }
  }, [activeView, selectedAdmin, onSubScreenChange, onBackRequest]);

  // فتح شاشة الإضافة
  const handleOpenAdd = () => {
    setSelectedAdmin(null);
    setActiveView('create');
  };

  // فتح شاشة التعديل
  const handleOpenEdit = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setActiveView('edit');
  };

  // حفظ التعديلات أو الإضافة من شاشة المسؤول
  const handleSaveAdmin = (savedAdmin: AdminUser) => {
    if (activeView === 'edit') {
      setAdmins((prev) =>
        prev.map((item) => (item.id === savedAdmin.id ? savedAdmin : item))
      );
    } else {
      setAdmins((prev) => [savedAdmin, ...prev]);
    }
    setActiveView('list');
    setSelectedAdmin(null);
  };

  // إلغاء والعودة للقائمة
  const handleCancelScreen = () => {
    setActiveView('list');
    setSelectedAdmin(null);
  };

  // تأكيد الحذف
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setAdmins((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // إذا كنا في شاشة الإضافة أو التعديل، اعرض شاشة المسؤول كاملة
  if (activeView !== 'list') {
    return (
      <EditAdminUserScreen
        admin={selectedAdmin}
        onSave={handleSaveAdmin}
        onCancel={handleCancelScreen}
      />
    );
  }

  return (
    <div className="flex flex-col gap-[14px] w-full">
      {/* شريط الإجراءات العلوي */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          className="abtn teal cursor-pointer"
          onClick={handleOpenAdd}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>إضافة مسؤول</span>
        </button>
      </div>

      {/* بطاقة إدارة مسؤولي النظام */}
      <div className="admin-panel">
        <div className="panel-head mb-4 flex items-center justify-between">
          <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
            إدارة مسؤولي النظام ({admins.length})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table text-right min-w-[760px]">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>المسؤول</th>
                <th style={{ width: '25%' }}>البريد الإلكتروني</th>
                <th style={{ width: '15%' }}>الدور الوظيفي</th>
                <th style={{ width: '15%' }}>آخر تسجيل دخول</th>
                <th style={{ width: '10%' }}>الحالة</th>
                <th style={{ width: '10%', textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[var(--gray)] text-[12px]">
                    لا يوجد مسؤولو نظام حالياً
                  </td>
                </tr>
              ) : (
                admins.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9FBFC] transition-colors">
                    {/* المسؤول */}
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: item.avatarBg }}
                        >
                          {item.initial}
                        </div>
                        <span className="font-bold text-[12px] text-[var(--navy)]">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* البريد الإلكتروني */}
                    <td className="font-latin text-[11px] text-[var(--gray)] font-medium">
                      {item.email}
                    </td>

                    {/* الدور الوظيفي */}
                    <td className="text-[11px] text-[var(--navy)] font-medium">
                      {item.role}
                    </td>

                    {/* آخر تسجيل دخول */}
                    <td className="text-[11px] text-[var(--gray)] font-medium">
                      {item.lastLogin}
                    </td>

                    {/* الحالة */}
                    <td>
                      {item.status === 'active' ? (
                        <span className="inline-block px-3 py-0.5 rounded-full text-[10.5px] font-bold bg-[#E3F7F4] text-[var(--teal)]">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FBE4DF] text-[var(--coral)]">
                          معلّق
                        </span>
                      )}
                    </td>

                    {/* إجراءات */}
                    <td>
                      <div className="flex items-center justify-center gap-1.5">
                        {/* زر التعديل */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="w-[26px] h-[26px] rounded-[7px] bg-[#EEF2F6] text-[#E8604C] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer border-none"
                          title="تعديل المسؤول"
                        >
                          <Edit2 size={12} strokeWidth={2.2} />
                        </button>

                        {/* زر الحذف */}
                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="w-[26px] h-[26px] rounded-[7px] bg-[#FBE4DF] text-[var(--coral)] hover:bg-[#F9D2CA] flex items-center justify-center transition-colors cursor-pointer border-none"
                          title="حذف المسؤول"
                        >
                          <Trash2 size={12} strokeWidth={2.2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* تذييل الجدول */}
        <div className="mt-4 pt-3 border-t border-[var(--border-light)] flex items-center justify-between text-[11px] text-[var(--gray)] font-medium">
          <span>
            الصفوف 1–{admins.length} من {admins.length}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* مودل الحذف الموحد المتناسق مع مواصفات النظام الصارمة    */}
      {/* ======================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl w-full max-w-[340px] sm:max-w-[360px] shadow-xl p-5 text-center flex flex-col items-center gap-3 animate-in zoom-in-95 duration-150 border border-[var(--border-light)]">
            {/* أيقونة الحذف الموحدة */}
            <div className="w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center">
              <Trash2 size={20} strokeWidth={2.2} />
            </div>

            {/* عنوان الحذف الموحد */}
            <h3 className="text-[13px] font-extrabold text-[var(--navy)] m-0">
              حذف المسؤول: {itemToDelete.name}
            </h3>

            {/* صندوق التنبيه الوردي المدمج */}
            <div className="w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center">
              <p className="text-[10.8px] leading-relaxed text-[#E53E3E] font-medium m-0">
                سيتم إلغاء وصول هذا المسؤول إلى لوحة التحكم فوراً وسحب كافة الصلاحيات الممنوحة له.
              </p>
            </div>

            {/* أزرار الإجراءات الموحدة */}
            <div className="flex items-center justify-center gap-2 w-full mt-1">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="abtn outline flex-1 py-1.5 text-[11px] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="abtn coral flex-1 py-1.5 text-[11px] cursor-pointer"
              >
                حذف المسؤول
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
