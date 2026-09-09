import React, { useState } from 'react';
import { Check, Trash2, CheckCircle2 } from 'lucide-react';
import { QuestionItem } from './QuestionBankPage';

interface EditQuestionScreenProps {
  question: QuestionItem;
  onSave: (updatedQuestion: QuestionItem) => void;
  onCancel: () => void;
  onDelete: (questionId: string) => void;
}

export const EditQuestionScreen: React.FC<EditQuestionScreenProps> = ({
  question,
  onSave,
  onCancel,
  onDelete,
}) => {
  // نوع السؤال
  const [questionType, setQuestionType] = useState<string>(
    question.type === 'صح وخطأ'
      ? 'صح / خطأ'
      : question.type === 'مقالي'
      ? 'مقالي قصير'
      : question.type || 'اختيار من متعدد'
  );

  // نص السؤال
  const [questionText, setQuestionText] = useState<string>(
    question.question || 'ما ناتج 25 + 17 ؟'
  );

  // الخيارات الأربعة (Default from screenshot: 42 (صح), 41, 32, 52)
  const [options, setOptions] = useState<
    { id: string; text: string; isCorrect: boolean }[]
  >(
    question.options && question.options.length > 0
      ? question.options
      : [
          { id: 'opt-1', text: '42', isCorrect: true },
          { id: 'opt-2', text: '41', isCorrect: false },
          { id: 'opt-3', text: '32', isCorrect: false },
          { id: 'opt-4', text: '52', isCorrect: false },
        ]
  );

  // صح / خطأ خيار الإجابة
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean>(true);

  // مقالي قصير
  const [essayAnswer, setEssayAnswer] = useState<string>(
    'يتم جمع الآحاد مع الآحاد (5 + 7 = 12) ثم العشرات (20 + 10 + 10 = 40) الناتج = 42'
  );

  // المجموعة
  const [group, setGroup] = useState<string>(question.group || 'الجمع والطرح');

  // الدرس
  const [lesson, setLesson] = useState<string>(question.lesson || 'lesson-1');

  // مستوى الصعوبة
  const [difficulty, setDifficulty] = useState<'سهل' | 'متوسط' | 'صعب'>(
    question.difficulty || 'سهل'
  );

  // وسم المهارة
  const [skillTag, setSkillTag] = useState<'فهم' | 'تطبيق' | 'تحليل' | 'تذكر'>(
    question.skillTag || 'فهم'
  );

  // حالة مودال تأكيد الحذف
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // نجاح الحفظ الإشعاري
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // تبديل الإجابة الصحيحة في الاختيار من متعدد
  const handleSelectCorrectOption = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.id === id,
      }))
    );
  };

  // تعديل نص خيار معين
  const handleUpdateOptionText = (id: string, text: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, text } : opt))
    );
  };

  // حفظ التعديلات
  const handleSave = () => {
    const updated: QuestionItem = {
      ...question,
      question: questionText,
      type:
        questionType === 'صح / خطأ'
          ? 'صح وخطأ'
          : questionType === 'مقالي قصير'
          ? 'مقالي'
          : 'اختيار من متعدد',
      difficulty,
      group,
      lesson,
      skillTag,
      options: questionType === 'اختيار من متعدد' ? options : undefined,
    };

    onSave(updated);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onCancel();
    }, 600);
  };

  return (
    <div className="flex flex-col gap-4 w-full" dir="rtl">
      {/* إشعار نجاح الحفظ إن وجد */}
      {saveToast && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#E3F7F4] text-[var(--teal)] text-[11px] font-bold rounded-lg animate-in fade-in self-start">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>تم حفظ التعديلات بنجاح</span>
        </div>
      )}

      {/* لوحة البيانات الأساسية (مطابقة للصورة بدقة وفقاً لنظام التصميم) */}
      <div className="admin-panel shadow-xs">
        {/* الترويسة */}
        <div className="panel-head mb-5 pb-3 border-b border-[var(--border-light)]">
          <h4 className="text-[14px] font-extrabold text-[#17325C] m-0">
            البيانات الأساسية
          </h4>
        </div>

        <div className="flex flex-col gap-5 w-full">
          {/* 1. نوع السؤال * */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-2">
              نوع السؤال <span className="text-[var(--coral)]">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'اختيار من متعدد', label: 'اختيار من متعدد' },
                { id: 'صح / خطأ', label: 'صح / خطأ' },
                { id: 'مقالي قصير', label: 'مقالي قصير' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setQuestionType(item.id)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    questionType === item.id
                      ? 'bg-[var(--teal)] text-white shadow-xs'
                      : 'bg-white text-[var(--navy)] border border-[var(--border-light)] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. نص السؤال * */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              نص السؤال <span className="text-[var(--coral)]">*</span>
            </label>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="اكتب نص السؤال هنا..."
              className="admin-input w-full text-[12px] text-[var(--navy)] font-medium"
            />
          </div>

          {/* 3. الخيارات * — حدد الإجابة الصحيحة */}
          {questionType === 'اختيار من متعدد' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-[var(--navy)]">
                  الخيارات <span className="text-[var(--coral)]">*</span> — حدد الإجابة الصحيحة
                </label>
                <span className="text-[10px] text-[var(--gray)]">
                  اضغط على الدائرة لاختيار الإجابة الصحيحة
                </span>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                {options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2.5 w-full">
                    {/* مؤشر الإجابة الصحيحة */}
                    <button
                      type="button"
                      onClick={() => handleSelectCorrectOption(opt.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        opt.isCorrect
                          ? 'bg-[var(--teal)] text-white shadow-xs'
                          : 'border-2 border-[#CBD5E1] hover:border-[var(--teal)] bg-white'
                      }`}
                      title={opt.isCorrect ? 'الإجابة الصحيحة المحددة' : 'تحديد كإجابة صحيحة'}
                    >
                      {opt.isCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    {/* حقل نص الخيار */}
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleUpdateOptionText(opt.id, e.target.value)}
                      placeholder={`الخيار ${idx + 1}`}
                      className={`admin-input w-full text-[12px] font-medium ${
                        opt.isCorrect
                          ? 'border-[var(--teal)]/40 bg-[#F2FBF9]/30 text-[var(--navy)]'
                          : 'text-[var(--navy)]'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* في حال صح / خطأ */}
          {questionType === 'صح / خطأ' && (
            <div>
              <label className="block text-[11px] font-bold text-[var(--navy)] mb-2">
                الإجابة الصحيحة <span className="text-[var(--coral)]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setTrueFalseAnswer(true)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-[12px] font-bold cursor-pointer transition-all ${
                    trueFalseAnswer
                      ? 'border-[var(--teal)] bg-[#E3F7F4]/40 text-[var(--teal)]'
                      : 'border-[var(--border-light)] bg-white text-[var(--navy)] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      trueFalseAnswer ? 'bg-[var(--teal)] text-white' : 'border border-[#CBD5E1]'
                    }`}
                  >
                    {trueFalseAnswer && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span>صحيح (صح)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrueFalseAnswer(false)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-[12px] font-bold cursor-pointer transition-all ${
                    !trueFalseAnswer
                      ? 'border-[var(--teal)] bg-[#E3F7F4]/40 text-[var(--teal)]'
                      : 'border-[var(--border-light)] bg-white text-[var(--navy)] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      !trueFalseAnswer ? 'bg-[var(--teal)] text-white' : 'border border-[#CBD5E1]'
                    }`}
                  >
                    {!trueFalseAnswer && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span>خطأ (غير صحيح)</span>
                </button>
              </div>
            </div>
          )}

          {/* في حال مقالي قصير */}
          {questionType === 'مقالي قصير' && (
            <div>
              <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
                الإجابة النموذجية أو معايير التصحيح <span className="text-[var(--coral)]">*</span>
              </label>
              <textarea
                value={essayAnswer}
                onChange={(e) => setEssayAnswer(e.target.value)}
                rows={3}
                placeholder="اكتب الإجابة النموذجية المرجعية..."
                className="admin-input w-full text-[12px] text-[var(--navy)] font-medium leading-relaxed resize-y"
              />
            </div>
          )}

          {/* 4. المجموعة * */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              المجموعة <span className="text-[var(--coral)]">*</span>
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="admin-select w-full text-[11px] font-bold text-[var(--navy)] cursor-pointer"
            >
              <option value="الجمع والطرح">الجمع والطرح</option>
              <option value="group-add-sub">الجمع والطرح</option>
              <option value="group-mul-div">الضرب والقسمة</option>
              <option value="group-mixed">العمليات المركبة</option>
              <option value="الكسور والعمليات عليها">الكسور والعمليات عليها</option>
            </select>
          </div>

          {/* 5. الدرس (اختياري) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-[var(--navy)]">
                الدرس
              </label>
              <span className="text-[9.5px] text-[var(--gray)] font-normal">اختياري</span>
            </div>
            <select
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className="admin-select w-full text-[11px] font-bold text-[var(--navy)] cursor-pointer"
            >
              <option value="lesson-1">الدرس 1: مقدمة في جمع وطرح الأعداد</option>
              <option value="lesson-2">الدرس 2: خصائص الجمع والطرح</option>
              <option value="lesson-3">الدرس 3: حل المسائل وتقدير النواتج</option>
              <option value="lesson-4">الدرس 4: الحساب الذهني والتطبيقات</option>
            </select>
          </div>

          {/* 6. مستوى الصعوبة * */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-2">
              مستوى الصعوبة <span className="text-[var(--coral)]">*</span>
            </label>
            <div className="flex items-center gap-2">
              {(['سهل', 'متوسط', 'صعب'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-[var(--teal)] text-white shadow-xs'
                      : 'bg-white text-[var(--navy)] border border-[var(--border-light)] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 6. وسم المهارة */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-2">
              وسم المهارة
            </label>
            <div className="flex items-center gap-2">
              {(['فهم', 'تطبيق', 'تحليل', 'تذكر'] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSkillTag(tag)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    skillTag === tag
                      ? 'bg-[var(--teal)] text-white shadow-xs'
                      : 'bg-white text-[var(--navy)] border border-[var(--border-light)] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 7. منطقة الحذف (Danger Zone) */}
          <div className="w-full p-4 rounded-xl bg-[#FFF5F5] border border-[#FED7D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
            <div>
              <h5 className="text-[12.5px] font-extrabold text-[#E53E3E] mb-1">
                حذف السؤال
              </h5>
              <p className="text-[10.8px] text-[#C53030] font-medium leading-relaxed m-0">
                لا يمكن التراجع عن حذف السؤال بعد تأكيده — سيتم إزالته نهائياً من بنك الأسئلة والمجموعات المرتبطة.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="abtn coral py-1.5 px-4 text-[11px] shrink-0 font-bold cursor-pointer"
            >
              حذف السؤال
            </button>
          </div>

          {/* 8. شريط أزرار الحفظ والإلغاء السفلي */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-[var(--border-light)]">
            <button
              type="button"
              onClick={handleSave}
              className="abtn teal py-2 px-5 text-[11.5px] font-bold cursor-pointer shadow-xs"
            >
              حفظ السؤال
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="abtn outline py-2 px-5 text-[11.5px] font-bold cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>

      {/* مودال تأكيد الحذف طبقاً لـ RULE[AGENTS_md] */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3">
          <div className="max-w-[340px] sm:max-w-[360px] w-full p-5 rounded-xl bg-white shadow-xl flex flex-col items-center text-center">
            {/* أيقونة الحذف المركزية */}
            <div className="w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>

            {/* العنوان */}
            <h4 className="text-[13px] font-extrabold text-[var(--navy)] mb-2">
              حذف السؤال
            </h4>

            {/* صندوق التنبيه */}
            <div className="w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center mb-4">
              <p className="text-[10.8px] leading-relaxed text-[#E53E3E] font-medium m-0">
                هل أنت متأكد من رغبتك في حذف هذا السؤال؟ لن تتمكن من استرجاعه بعد الحذف.
              </p>
            </div>

            {/* أزرار الإجراء */}
            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="abtn outline flex-1 py-1.5 text-[11px] font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(question.id);
                  setShowDeleteModal(false);
                }}
                className="abtn coral flex-1 py-1.5 text-[11px] font-bold cursor-pointer"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
