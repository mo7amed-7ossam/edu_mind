# Unified Design System Guidelines & Project Rules

## Core Rule: Design System Authority
- The **Design System** established in this project is strictly authoritative and takes precedence over external screenshots or wireframes.
- Whenever a screenshot or mockup is provided by the user, extract the **functional data and fields** from it, but ALWAYS render and style them using the exact established components, tokens, typography, and spacing of our unified design system.

---

## 1. Unified Components & Classes

### Buttons (`.abtn`)
- **Primary / Main Action**: `<button className="abtn teal">+ إضافة ...</button>`
  - Color: Teal background (`var(--teal)` #169B8E), text white, standard padding, rounded-lg.
- **Secondary / Outline Action**: `<button className="abtn outline">...</button>`
  - White background, border `var(--border-light)`, text `var(--navy)`.
- **Danger Action**: `<button className="abtn coral">...</button>`
  - Coral background (`var(--coral)`), text white.

### Tab Navigation (Pills / Segmented Tabs)
- Container: `<div className="inline-flex bg-[#F1F3F5] p-[3px] rounded-full self-start">...</div>`
- Active Tab: `px-5 py-1.5 rounded-full text-[12px] font-bold bg-[var(--teal)] text-white shadow-sm`
- Inactive Tab: `px-5 py-1.5 rounded-full text-[12px] font-bold text-[var(--navy)] hover:text-black bg-transparent`

### Panels & Cards (`.admin-panel`)
- Container: `<div className="admin-panel">...</div>` (12px rounded, clean border, uniform padding).
- Header: `<div className="panel-head mb-4"><h4 className="text-[13.5px] font-extrabold text-[#17325C]">العنوان (العدد)</h4></div>`

### Tables (`.admin-table`)
- Standard table wrapper with `.admin-table`.
- Headers: `text-[10px]` bold uppercase/clean, `color: var(--gray)`.
- Cells: `text-[11px]` clean font, numbers/dates formatted with `font-latin`.
- Action buttons in tables: square `26x26px` rounded `7px` action icons (edit, delete, view).

### Inputs & Modals
- Input: `className="admin-input"`
- Select: `className="admin-select"`
- Modal backdrops: `fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3`
- Modal body: `bg-white rounded-xl shadow-xl`

### Delete Modal Specification
- Compact size: `max-w-[340px] sm:max-w-[360px] p-5 rounded-xl bg-white shadow-xl`
- Central top trash icon: `w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center` with `Trash2` (20px).
- Title: `text-[13px] font-extrabold text-[var(--navy)]` (e.g. `حذف الدولة: SA السعودية`).
- Alert message box: `w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center` with `text-[10.8px] leading-relaxed text-[#E53E3E] font-medium`.
- Action buttons using standard `.abtn`:
  - Cancel: `<button className="abtn outline flex-1 py-1.5 text-[11px]">إلغاء</button>`
  - Confirm Delete: `<button className="abtn coral flex-1 py-1.5 text-[11px]">حذف الدولة</button>` (Always Enabled & Interactive).

