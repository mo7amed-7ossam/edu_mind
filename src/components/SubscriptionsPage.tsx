import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string;
  subscribers: string;
  available?: boolean;
}

interface Coupon {
  code: string;
  discount: string;
  expiryDate: string;
  uses: string;
  status: 'active' | 'expired';
  statusLabel: string;
}

export const SubscriptionsPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'basic',
      name: 'أساسية',
      price: '29',
      period: 'ر.س/شهر',
      features: 'مادة واحدة، تقارير أسبوعية',
      subscribers: '1,240 مشترك',
      available: true,
    },
    {
      id: 'advanced',
      name: 'متقدمة',
      price: '59',
      period: 'ر.س/شهر',
      features: 'كل المواد، تقارير يومية، مساعد ذكي',
      subscribers: '3,680 مشترك',
      available: true,
    },
    {
      id: 'family',
      name: 'عائلية',
      price: '99',
      period: 'ر.س/شهر',
      features: 'حتى 4 أبناء، كل المزايا',
      subscribers: '1,020 مشترك',
      available: true,
    },
  ]);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formFeatures, setFormFeatures] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Coupon state & modal
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      code: 'WELCOME20',
      discount: '20%',
      expiryDate: '2026-09-01',
      uses: '412',
      status: 'active',
      statusLabel: 'نشط',
    },
    {
      code: 'RAMADAN30',
      discount: '30%',
      expiryDate: '2026-03-15',
      uses: '980',
      status: 'expired',
      statusLabel: 'منتهٍ',
    },
  ]);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);
  const [editingCouponCode, setEditingCouponCode] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>('WELCOME20');
  const [couponDiscount, setCouponDiscount] = useState<string>('20');
  const [couponExpiry, setCouponExpiry] = useState<string>('2026-09-01');
  const [couponActive, setCouponActive] = useState<boolean>(true);

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormName(plan.name);
    setFormPrice(plan.price);
    setFormFeatures(plan.features);
    setIsAvailable(plan.available ?? true);
  };

  const handleClose = () => {
    setEditingPlan(null);
  };

  const handleSave = () => {
    if (!editingPlan) return;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              name: formName,
              price: formPrice,
              features: formFeatures,
              available: isAvailable,
            }
          : p
      )
    );
    setEditingPlan(null);
  };

  const handleOpenNewCoupon = () => {
    setEditingCouponCode(null);
    setCouponCode('WELCOME20');
    setCouponDiscount('20');
    setCouponExpiry('2026-09-01');
    setCouponActive(true);
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCoupon = (coupon: Coupon) => {
    setEditingCouponCode(coupon.code);
    setCouponCode(coupon.code);
    setCouponDiscount(coupon.discount.replace('%', ''));
    setCouponExpiry(coupon.expiryDate);
    setCouponActive(coupon.status === 'active');
    setIsCouponModalOpen(true);
  };

  const handleCloseCouponModal = () => {
    setIsCouponModalOpen(false);
    setEditingCouponCode(null);
  };

  const handleSaveCoupon = () => {
    const formattedDiscount = couponDiscount.endsWith('%') ? couponDiscount : `${couponDiscount}%`;
    const newStatus = couponActive ? 'active' : 'expired';
    const newStatusLabel = couponActive ? 'نشط' : 'منتهٍ';

    if (editingCouponCode) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code === editingCouponCode
            ? {
                ...c,
                code: couponCode.trim().toUpperCase(),
                discount: formattedDiscount,
                expiryDate: couponExpiry,
                status: newStatus,
                statusLabel: newStatusLabel,
              }
            : c
        )
      );
    } else {
      setCoupons((prev) => [
        ...prev,
        {
          code: couponCode.trim().toUpperCase() || 'NEWCODE',
          discount: formattedDiscount,
          expiryDate: couponExpiry || '2026-12-31',
          uses: '0',
          status: newStatus,
          statusLabel: newStatusLabel,
        },
      ]);
    }
    setIsCouponModalOpen(false);
    setEditingCouponCode(null);
  };

  return (
    <div className="flex flex-col gap-[14px]">
      {/* 8. بطاقات KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
        {/* Card 1 */}
        <div className="kpi-card">
          <div className="flex flex-col">
            <span className="kpi-value">5,940</span>
            <span className="kpi-label">مشتركون نشطون</span>
          </div>
          <div className="mt-3 flex items-center">
            <span className="kpi-delta up">▲ 9%</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="kpi-card">
          <div className="flex flex-col">
            <span className="kpi-value">184,200 ر.س</span>
            <span className="kpi-label">الإيراد الشهري</span>
          </div>
          <div className="mt-3 flex items-center">
            <span className="kpi-delta up">▲ 12%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="kpi-card">
          <div className="flex flex-col">
            <span className="kpi-value">91%</span>
            <span className="kpi-label">معدل التجديد</span>
          </div>
          <div className="mt-3 flex items-center">
            <span className="kpi-delta up">▲ 2%</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="kpi-card">
          <div className="flex flex-col">
            <span className="kpi-value">3.4%</span>
            <span className="kpi-label">معدل الإلغاء</span>
          </div>
          <div className="mt-3 flex items-center">
            <span className="kpi-delta down">▼ 0.5%</span>
          </div>
        </div>
      </div>

      {/* 9. خطط الاشتراك - Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
        {plans.map((plan) => (
          <div key={plan.id} className="admin-panel flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[13.5px] font-extrabold text-[#17325C]">
                  {plan.name}
                </h4>
                <button
                  type="button"
                  className="abtn outline"
                  onClick={() => handleOpenEdit(plan)}
                >
                  تعديل
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-2.5">
                <span className="text-[20px] font-extrabold text-[#17325C] leading-none">
                  {plan.price}
                </span>
                <span className="text-[11.5px] font-bold text-[#17325C]">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <p className="text-[11.5px] font-normal text-[#5A6472] leading-normal mb-6">
                {plan.features}
              </p>
            </div>

            {/* Subscribers Count */}
            <div>
              <span className="text-[11.5px] font-extrabold text-[#169E92]">
                {plan.subscribers}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 10. أكواد الخصم - Discount Coupons Panel */}
      <div className="admin-panel">
        <div className="panel-head mb-4">
          <h4 className="text-[13.5px] font-extrabold text-[#17325C]">أكواد الخصم</h4>
          <button
            type="button"
            className="abtn teal"
            onClick={handleOpenNewCoupon}
          >
            + كود جديد
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>الكود</th>
                <th style={{ width: '15%' }}>النسبة</th>
                <th style={{ width: '20%' }}>ينتهي في</th>
                <th style={{ width: '18%' }}>مرات الاستخدام</th>
                <th style={{ width: '14%' }}>الحالة</th>
                <th style={{ width: '8%', textAlign: 'center' }}>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.code}>
                  <td className="font-latin !font-bold text-[#17325C]">
                    {coupon.code}
                  </td>
                  <td className="font-latin font-semibold text-[#17325C]">
                    {coupon.discount}
                  </td>
                  <td className="font-latin text-[#5A6472]">
                    {coupon.expiryDate}
                  </td>
                  <td className="font-latin font-medium text-[#17325C]">
                    {coupon.uses}
                  </td>
                  <td>
                    <span
                      className={`badge-pill ${
                        coupon.status === 'active' ? 'on' : 'off'
                      }`}
                    >
                      {coupon.statusLabel}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="abtn-icon text-[#169E92] hover:text-[#13877d]"
                      title="تعديل"
                      onClick={() => handleOpenEditCoupon(coupon)}
                    >
                      <Edit2 size={12} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop up تعديل بيانات الخطة */}
      <div
        className={`modal-overlay ${editingPlan ? 'show' : ''}`}
        id="modal-plan"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        {editingPlan && (
          <div className="modal-box">
            <h3>بيانات الخطة: {editingPlan.name}</h3>
            <div className="sub">
              عدِّل تفاصيل الخطة الظاهرة للمشتركين — أي تغيير في السعر يُطبَّق على
              الاشتراكات الجديدة فقط، ولا يؤثر على المشتركين الحاليين حتى موعد
              تجديدهم.
            </div>

            <div className="field-label">
              اسم الخطة <span className="req">*</span>
            </div>
            <input
              className="field filled"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              style={{ marginBottom: '12px' }}
            />

            <div className="field-label">
              السعر الشهري (ر.س) <span className="req">*</span>
            </div>
            <input
              className="field filled"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              style={{ marginBottom: '12px' }}
            />

            <div className="field-label">
              المزايا <span className="req">*</span>
            </div>
            <textarea
              className="field"
              rows={2}
              value={formFeatures}
              onChange={(e) => setFormFeatures(e.target.value)}
              style={{ marginBottom: '4px' }}
            />

            <div
              className="toggle-row"
              onClick={() => setIsAvailable(!isAvailable)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`toggle ${isAvailable ? 'on' : ''}`}></div>
              <span className="toggle-label">
                الخطة: {isAvailable ? 'متاحة للاشتراك الجديد' : 'غير متاحة للاشتراك الجديد'}
              </span>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="abtn navy"
                onClick={handleSave}
              >
                حفظ الخطة
              </button>
              <button
                type="button"
                className="abtn outline"
                onClick={handleClose}
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pop up بيانات كود الخصم (كود جديد / تعديل) */}
      <div
        className={`modal-overlay ${isCouponModalOpen ? 'show' : ''}`}
        id="modal-coupon"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseCouponModal();
        }}
      >
        {isCouponModalOpen && (
          <div className="modal-box">
            <h3>بيانات كود الخصم</h3>
            <div className="sub">
              أنشئ كود خصم جديد أو عدّل كوداً قائماً — يُطبَّق الخصم تلقائياً عند إدخال الكود في شاشة
              الاشتراك.
            </div>

            {/* الكود */}
            <div className="field-label">
              الكود <span className="req">*</span>
            </div>
            <input
              className="field filled font-latin"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="مثال: WELCOME20"
              style={{ marginBottom: '12px' }}
            />

            {/* نسبة الخصم + تاريخ الانتهاء */}
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '12px' }}>
              <div>
                <div className="field-label">
                  نسبة الخصم (%) <span className="req">*</span>
                </div>
                <input
                  className="field filled font-latin"
                  value={couponDiscount}
                  onChange={(e) => setCouponDiscount(e.target.value)}
                  placeholder="20"
                />
              </div>
              <div>
                <div className="field-label">
                  تاريخ الانتهاء <span className="req">*</span>
                </div>
                <input
                  className="field filled font-latin"
                  type="text"
                  value={couponExpiry}
                  onChange={(e) => setCouponExpiry(e.target.value)}
                  placeholder="2026-09-01"
                />
              </div>
            </div>

            {/* الحالة / التبديل */}
            <div
              className="toggle-row"
              onClick={() => setCouponActive(!couponActive)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '10px',
                marginTop: '16px',
                marginBottom: '20px',
              }}
            >
              <div className={`toggle ${couponActive ? 'on' : ''}`}></div>
              <span className="toggle-label">
                الحالة: {couponActive ? 'نشط (قابل للاستخدام الآن)' : 'غير نشط (معطل)'}
              </span>
            </div>

            {/* أزرار الإجراءات */}
            <div className="modal-actions">
              <button
                type="button"
                className="abtn navy"
                onClick={handleSaveCoupon}
              >
                حفظ الكود
              </button>
              <button
                type="button"
                className="abtn outline"
                onClick={handleCloseCouponModal}
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

