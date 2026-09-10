import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AdminUser } from './AdminUsersPage';

interface EditAdminUserScreenProps {
  admin: AdminUser | null;
  onSave: (adminData: AdminUser) => void;
  onCancel: () => void;
}

export const EditAdminUserScreen: React.FC<EditAdminUserScreenProps> = ({
  admin,
  onSave,
  onCancel,
}) => {
  const isEditMode = Boolean(admin);

  // حقول النموذج
  const [name, setName] = useState<string>(admin?.name || '');
  const [email, setEmail] = useState<string>(admin?.email || '');
  const [phone, setPhone] = useState<string>(admin?.phone || '');
  const [role, setRole] = useState<string>(admin?.role || 'مشرف عام');
  const [username, setUsername] = useState<string>(admin?.username || '');
  const [password, setPassword] = useState<string>(admin?.password || '••••••••');
  const [isActive, setIsActive] = useState<boolean>(
    admin ? admin.status === 'active' : true
  );

  // إشعار نجاح الحفظ
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // معالجة الحفظ
  const handleSave = () => {
    if (!name.trim()) {
      setErrorMessage('يرجى إدخال الاسم الكامل للمسؤول');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني للمسؤول');
      return;
    }
    if (!username.trim()) {
      setErrorMessage('يرجى إدخال اسم المستخدم');
      return;
    }

    setErrorMessage('');

    const avatarColors = ['#17325C', '#169E92', '#E8604C', '#6366F1', '#F59E0B'];
    const randomBg = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const updatedUser: AdminUser = {
      id: admin ? admin.id : `adm-${Date.now()}`,
      name: name.trim(),
      initial: name.trim().charAt(0) || 'م',
      avatarBg: admin ? admin.avatarBg : randomBg,
      email: email.trim(),
      phone: phone.trim() || undefined,
      username: username.trim(),
      password: password,
      role: role,
      lastLogin: admin ? admin.lastLogin : 'لم يسجل دخول بعد',
      status: isActive ? 'active' : 'suspended',
    };

    onSave(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onCancel();
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 w-full" dir="rtl">
      {/* تنبيه الخطأ إن وجد */}
      {errorMessage && (
        <div className="p-3 bg-[#FFF5F5] border border-[#FED7D7] rounded-lg text-[11.5px] font-bold text-[#E53E3E] animate-in fade-in">
          {errorMessage}
        </div>
      )}

      {/* إشعار نجاح الحفظ */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 bg-[#E3F7F4] border border-[#BCEEE7] rounded-lg text-[11.5px] font-bold text-[var(--teal)] animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>تم حفظ بيانات المسؤول بنجاح</span>
        </div>
      )}

      {/* البطاقة الأولى: البيانات الأساسية */}
      <div className="admin-panel shadow-xs bg-white rounded-xl border border-[var(--border-light)] p-5 sm:p-6">
        <div className="panel-head mb-5">
          <h4 className="text-[14px] font-extrabold text-[#17325C] m-0">
            البيانات الأساسية
          </h4>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* الاسم الكامل * */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              الاسم الكامل <span className="text-[var(--coral)]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="سارة أحمد"
              className="admin-input text-[12px] h-[38px] w-full"
            />
          </div>

          {/* البريد الإلكتروني * + رقم الجوال */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* البريد الإلكتروني * */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
                البريد الإلكتروني <span className="text-[var(--coral)]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sara.ahmed@smartlearn.sa"
                dir="ltr"
                className="admin-input font-latin text-[12px] h-[38px] w-full text-right"
              />
            </div>

            {/* رقم الجوال */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
                رقم الجوال
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                dir="ltr"
                className="admin-input font-latin text-[12px] h-[38px] w-full text-right"
              />
            </div>
          </div>

          {/* الدور الوظيفي * */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              الدور الوظيفي <span className="text-[var(--coral)]">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="admin-select text-[12px] h-[38px] w-full cursor-pointer font-medium"
            >
              <option value="مشرف عام">مشرف عام</option>
              <option value="محرر محتوى">محرر محتوى</option>
              <option value="دعم فني">دعم فني</option>
              <option value="محلل بيانات">محلل بيانات</option>
              <option value="مدير النظام">مدير النظام</option>
            </select>
            <p className="text-[10px] text-[var(--gray)] mt-1.5 font-medium leading-normal">
              القائمة مرتبطة بالأدوار المعرّفة في شاشة "الأدوار والصلاحيات" — الصلاحيات تُطبّق تلقائياً حسب الدور المختار.
            </p>
          </div>

          {/* اسم المستخدم * */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              اسم المستخدم <span className="text-[var(--coral)]">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="sara.ahmed"
              dir="ltr"
              className="admin-input font-latin text-[12px] h-[38px] w-full text-right"
            />
            <p className="text-[10px] text-[var(--gray)] mt-1.5 font-medium leading-normal">
              يُستخدم لتسجيل الدخول للوحة الإدارة — يجب أن يكون فريداً.
            </p>
          </div>

          {/* كلمة المرور المبدئية * */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              كلمة المرور المبدئية <span className="text-[var(--coral)]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              className="admin-input font-latin text-[12px] h-[38px] w-full text-right"
            />
            <p className="text-[10px] text-[var(--gray)] mt-1.5 font-medium leading-normal">
              سيُطلب من المسؤول تغييرها عند أول تسجيل دخول.
            </p>
          </div>

          {/* تفعيل الحساب (سويتش) مطابق للصورة بدقة ومحاذى لليمين */}
          <div className="flex items-center justify-start pt-2">
            <div
              className="inline-flex items-center gap-3 cursor-pointer select-none"
              onClick={() => setIsActive(!isActive)}
              dir="ltr"
            >
              <span className="text-[12px] font-bold text-[var(--navy)]">
                تفعيل الحساب (يسمح بتسجيل الدخول فوراً)
              </span>

              {/* شكل السويتش البيضاوي مع الدائرة البيضاء مطابق للصورة */}
              <div
                role="switch"
                aria-checked={isActive}
                className={`relative w-[46px] h-[24px] rounded-full transition-colors duration-200 ease-in-out shrink-0 ${
                  isActive ? 'bg-[var(--teal)]' : 'bg-[#CBD5E1]'
                }`}
              >
                <div
                  className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-xs transition-all duration-200 ease-in-out ${
                    isActive ? 'left-[2px]' : 'left-[24px]'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* البطاقة الثانية: تعليق الحساب (في وضع التعديل) */}
      {isEditMode && (
        <div className="rounded-xl p-5 border border-[#FED7D7] bg-[#FFF5F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-[13.5px] font-extrabold text-[#E53E3E] mb-1">
              تعليق الحساب
            </h4>
            <p className="text-[11px] text-[var(--gray)] font-medium m-0">
              سيُمنع هذا المسؤول من تسجيل الدخول للوحة الإدارة فوراً حتى إعادة التفعيل يدوياً.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsActive(false)}
            disabled={!isActive}
            className={`abtn shrink-0 text-[11.5px] font-bold px-5 py-2 transition-opacity cursor-pointer ${
              isActive ? 'coral' : 'outline opacity-60 cursor-not-allowed'
            }`}
          >
            تعليق الحساب
          </button>
        </div>
      )}

      {/* أزرار الإجراءات السفلية */}
      <div className="flex items-center justify-end gap-3 pt-1 mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="abtn outline text-[12px] font-bold px-6 py-2 cursor-pointer"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="abtn teal text-[12px] font-bold px-6 py-2 cursor-pointer"
        >
          حفظ بيانات المسؤول
        </button>
      </div>
    </div>
  );
};
