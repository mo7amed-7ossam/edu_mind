import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Upload,
  Edit2,
  Trash2,
  Sparkles,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { EditQuestionScreen } from './EditQuestionScreen';
import { ImportQuestionsModal } from './ImportQuestionsModal';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionItem {
  id: string;
  question: string;
  type: 'اختيار من متعدد' | 'صح وخطأ' | 'إكمال الفراغ' | 'مقالي' | 'مقالي قصير';
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  countryCode: string;
  system?: 'national' | 'international';
  year?: string;
  grade: string;
  semester?: string;
  subject: string;
  unit?: string;
  group?: string;
  lesson?: string;
  skillTag?: 'فهم' | 'تطبيق' | 'تحليل' | 'تذكر';
  options?: QuestionOption[];
  source?: 'manual' | 'ai' | 'file';
  sourceFileName?: string;
}

export interface UploadedFileItem {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  fileFormat: 'pdf' | 'excel' | 'word';
  isVisible: boolean;
  isExpanded: boolean;
  questions: QuestionItem[];
}

interface DeleteModalTarget {
  type: 'manual_question' | 'ai_question' | 'file_question' | 'file';
  id: string;
  fileId?: string;
  title: string;
  name?: string;
  warningText: string;
  confirmText: string;
}

export interface QuestionBankPageProps {
  onSubScreenChange?: (isSub: boolean, title?: string) => void;
  onBackRequest?: (fn: () => void) => void;
}

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({
  onSubScreenChange,
  onBackRequest,
}) => {
  // حالة السؤال الجاري تعديله (Sub-Screen)
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);

  // حالة فتح مودال استيراد ملف جديد (Pop-up مع تحليل AI)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // حالة مودال تأكيد الحذف الموحد
  const [deleteModalTarget, setDeleteModalTarget] = useState<DeleteModalTarget | null>(null);

  // نطاق التصفية (Cascading Scope State)
  // المحددات الإلزامية (Required *)
  const [selectedCountry, setSelectedCountry] = useState<string>('SA');
  const [selectedSystem, setSelectedSystem] = useState<'national' | 'international'>('national');
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');
  const [selectedGrade, setSelectedGrade] = useState<string>('grade-6');
  const [selectedSemester, setSelectedSemester] = useState<string>('sem-1');
  const [selectedSubject, setSelectedSubject] = useState<string>('math');

  // المحددات غير الإلزامية (اللى مش ريكوايرد: الوحدة، المجموعة، الدرس)
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<string>('all');

  // تصفيات إضافية (الصعوبة والنوع)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // نظام التبويبات (3 تبويبات رئيسية)
  const [activeTab, setActiveTab] = useState<'manual' | 'ai' | 'files'>('manual');

  // 1. التابة الأولى: الأسئلة العادية المسجلة (مطابقة لبيانات النموذج في الصورة)
  const [manualQuestions, setManualQuestions] = useState<QuestionItem[]>([
    {
      id: 'mq-1',
      question: 'ما ناتج 25 + 17 ؟',
      type: 'اختيار من متعدد',
      difficulty: 'سهل',
      skillTag: 'فهم',
      countryCode: 'SA',
      system: 'national',
      year: '2025-2026',
      grade: 'grade-6',
      semester: 'sem-1',
      subject: 'math',
      unit: 'unit-1',
      group: 'group-add-sub',
      lesson: 'lesson-1',
      source: 'manual',
      options: [
        { id: 'opt-1', text: '42', isCorrect: true },
        { id: 'opt-2', text: '41', isCorrect: false },
        { id: 'opt-3', text: '32', isCorrect: false },
        { id: 'opt-4', text: '52', isCorrect: false },
      ],
    },
    {
      id: 'mq-2',
      question: '48 - 19 = ؟',
      type: 'اختيار من متعدد',
      difficulty: 'متوسط',
      countryCode: 'SA',
      system: 'national',
      year: '2025-2026',
      grade: 'grade-6',
      semester: 'sem-1',
      subject: 'math',
      unit: 'unit-1',
      group: 'group-add-sub',
      lesson: 'lesson-1',
      source: 'manual',
    },
    {
      id: 'mq-3',
      question: 'ناتج جمع 124 + 356 هو 480',
      type: 'صح وخطأ',
      difficulty: 'سهل',
      countryCode: 'SA',
      system: 'national',
      year: '2025-2026',
      grade: 'grade-6',
      semester: 'sem-1',
      subject: 'math',
      unit: 'unit-1',
      group: 'group-add-sub',
      lesson: 'lesson-2',
      source: 'manual',
    },
    {
      id: 'mq-4',
      question: 'إذا كان مع أحمد 150 ريالاً وأنفق 67 ريالاً، فكم تبقى معه؟',
      type: 'اختيار من متعدد',
      difficulty: 'متوسط',
      countryCode: 'SA',
      system: 'national',
      year: '2025-2026',
      grade: 'grade-6',
      semester: 'sem-1',
      subject: 'math',
      unit: 'unit-1',
      group: 'group-add-sub',
      lesson: 'lesson-3',
      source: 'manual',
    },
    {
      id: 'mq-5',
      question: 'أوجد ناتج العملية التالية ذهنياً: 1000 - 438',
      type: 'اختيار من متعدد',
      difficulty: 'صعب',
      countryCode: 'SA',
      system: 'national',
      year: '2025-2026',
      grade: 'grade-6',
      semester: 'sem-1',
      subject: 'math',
      unit: 'unit-1',
      group: 'group-add-sub',
      lesson: 'lesson-4',
      source: 'manual',
    },
    {
      id: 'mq-6',
      question: 'اشترى خالد 3 كتب بقيمة 45 ريالاً لكل كتاب وحقيبة بـ 120 ريالاً، فما إجمالي ما دفعه؟',
      type: 'اختيار من متعدد',
      difficulty: 'صعب',
      countryCode: 'SA',
      system: 'national',
      year: '2025-2026',
      grade: 'grade-6',
      semester: 'sem-1',
      subject: 'math',
      unit: 'unit-1',
      group: 'group-add-sub',
      lesson: 'lesson-3',
      source: 'manual',
    },
  ]);

  // 2. التابة الثانية: أسئلة الذكاء الاصطناعي (تبدأ فارغة)
  const [aiQuestions, setAiQuestions] = useState<QuestionItem[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiGenerationCount, setAiGenerationCount] = useState<number>(0);

  // 3. التابة الثالثة: الأسئلة المستخرجة من الملفات المرفوعة
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([
    {
      id: 'file-1',
      fileName: 'بنك_تمارين_الفصل_الأول_معتمد.pdf',
      fileSize: '2.4 MB',
      uploadDate: '2026/08/28',
      fileFormat: 'pdf',
      isVisible: true,
      isExpanded: true,
      questions: [
        {
          id: 'fq-1',
          question: 'ما هو ناتج قسمة 72 ÷ 8 ؟',
          type: 'اختيار من متعدد',
          difficulty: 'سهل',
          countryCode: 'SA',
          grade: 'grade-6',
          subject: 'math',
          unit: 'unit-1',
          group: 'group-add-sub',
          source: 'file',
          sourceFileName: 'بنك_تمارين_الفصل_الأول_معتمد.pdf',
        },
        {
          id: 'fq-2',
          question: 'حاصل ضرب 15 × 6 يساوي 90',
          type: 'صح وخطأ',
          difficulty: 'سهل',
          countryCode: 'SA',
          grade: 'grade-6',
          subject: 'math',
          unit: 'unit-1',
          group: 'group-add-sub',
          source: 'file',
          sourceFileName: 'بنك_تمارين_الفصل_الأول_معتمد.pdf',
        },
        {
          id: 'fq-3',
          question: 'إذا تضاعف العدد 35 ثلاث مرات، فما الناتج النهائي؟',
          type: 'اختيار من متعدد',
          difficulty: 'متوسط',
          countryCode: 'SA',
          grade: 'grade-6',
          subject: 'math',
          unit: 'unit-1',
          group: 'group-add-sub',
          source: 'file',
          sourceFileName: 'بنك_تمارين_الفصل_الأول_معتمد.pdf',
        },
        {
          id: 'fq-4',
          question: 'في عملية القسمة المطولة 45 ÷ 6 ، ما هو باقي القسمة الصحيح؟',
          type: 'اختيار من متعدد',
          difficulty: 'متوسط',
          countryCode: 'SA',
          grade: 'grade-6',
          subject: 'math',
          unit: 'unit-1',
          group: 'group-add-sub',
          source: 'file',
          sourceFileName: 'بنك_تمارين_الفصل_الأول_معتمد.pdf',
        },
      ],
    },
    {
      id: 'file-2',
      fileName: 'نماذج_اختبارات_الوزارة_رياضيات.xlsx',
      fileSize: '850 KB',
      uploadDate: '2026/09/02',
      fileFormat: 'excel',
      isVisible: true,
      isExpanded: false,
      questions: [
        {
          id: 'fq-5',
          question: 'مجموع قياسات زوايا المثلث الداخلية يساوي دائماً 180 درجة',
          type: 'صح وخطأ',
          difficulty: 'سهل',
          countryCode: 'SA',
          grade: 'grade-6',
          subject: 'math',
          unit: 'unit-1',
          group: 'group-add-sub',
          source: 'file',
          sourceFileName: 'نماذج_اختبارات_الوزارة_رياضيات.xlsx',
        },
        {
          id: 'fq-6',
          question: 'محيط مربع طول ضلعه 7 سم يساوي:',
          type: 'اختيار من متعدد',
          difficulty: 'متوسط',
          countryCode: 'SA',
          grade: 'grade-6',
          subject: 'math',
          unit: 'unit-1',
          group: 'group-add-sub',
          source: 'file',
          sourceFileName: 'نماذج_اختبارات_الوزارة_رياضيات.xlsx',
        },
        {
          id: 'fq-7',
          question: 'أوجد مساحة مستطيل طوله 8 سم وعرضه 5 سم:',
          type: 'اختيار من متعدد',
          difficulty: 'متوسط',
          countryCode: 'SA',
          grade: 'grade-6',
          subject: 'math',
          unit: 'unit-1',
          group: 'group-add-sub',
          source: 'file',
          sourceFileName: 'نماذج_اختبارات_الوزارة_رياضيات.xlsx',
        },
      ],
    },
  ]);

  // توليد الأسئلة بواسطة الذكاء الاصطناعي وإضافتها وتخزينها
  const handleGenerateAiQuestions = () => {
    setIsGeneratingAi(true);

    setTimeout(() => {
      const nextBatchIndex = aiGenerationCount + 1;
      const batches: QuestionItem[][] = [
        [
          {
            id: `ai-q-${Date.now()}-1`,
            question: 'احسب القيمة التقريبية لأقرب عشرة للمقدار: 624 + 198 ؟',
            type: 'اختيار من متعدد',
            difficulty: 'متوسط',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
          {
            id: `ai-q-${Date.now()}-2`,
            question: 'العدد الذي إذا طرحنا منه 85 أصبح الناتج 215 هو 300',
            type: 'صح وخطأ',
            difficulty: 'سهل',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
          {
            id: `ai-q-${Date.now()}-3`,
            question: 'أوجد الفرق بين أكبر عدد مكون من 3 أرقام مختلفة وأصغر عدد مكون من 3 أرقام مختلفة:',
            type: 'اختيار من متعدد',
            difficulty: 'صعب',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
        ],
        [
          {
            id: `ai-q-${Date.now()}-4`,
            question: 'إذا كان س - 45 = 120 ، فإن قيمة المتغير س هي:',
            type: 'اختيار من متعدد',
            difficulty: 'متوسط',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
          {
            id: `ai-q-${Date.now()}-5`,
            question: 'ناتج طرح أي عدد صحيح من نفسه يساوي صفراً دائماً',
            type: 'صح وخطأ',
            difficulty: 'سهل',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
          {
            id: `ai-q-${Date.now()}-6`,
            question: 'وفر زياد 250 ريالاً ثم اشترى لعبة بـ 95 ريالاً وقميصاً بـ 60 ريالاً، فكم تبقى معه؟',
            type: 'اختيار من متعدد',
            difficulty: 'صعب',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
        ],
        [
          {
            id: `ai-q-${Date.now()}-7`,
            question: 'ما هو المضاعف المشترك الأصغر (م.م.أ) للعددين 4 و 6 ؟',
            type: 'اختيار من متعدد',
            difficulty: 'صعب',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
          {
            id: `ai-q-${Date.now()}-8`,
            question: 'إذا كان ناتج جمع ثلاثة أعداد صحيحة متتالية هو 45، فما هو العدد الأوسط؟',
            type: 'اختيار من متعدد',
            difficulty: 'متوسط',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
          {
            id: `ai-q-${Date.now()}-9`,
            question: 'العملية العكسية لعملية الجمع هي عملية الطرح',
            type: 'صح وخطأ',
            difficulty: 'سهل',
            countryCode: selectedCountry,
            grade: selectedGrade,
            subject: selectedSubject,
            unit: selectedUnit,
            group: selectedGroup,
            source: 'ai',
          },
        ],
      ];

      const chosenBatch = batches[(nextBatchIndex - 1) % batches.length].map((q) => ({
        ...q,
        countryCode: selectedCountry,
        system: selectedSystem,
        year: selectedYear,
        grade: selectedGrade,
        semester: selectedSemester,
        subject: selectedSubject,
        unit: selectedUnit === 'all' ? 'unit-1' : selectedUnit,
        group: selectedGroup === 'all' ? 'group-add-sub' : selectedGroup,
        lesson: selectedLesson === 'all' ? 'lesson-1' : selectedLesson,
      }));
      setAiQuestions((prev) => [...prev, ...chosenBatch]);
      setAiGenerationCount(nextBatchIndex);
      setIsGeneratingAi(false);
    }, 650);
  };

  // تأكيد وتنفيذ الحذف من المودال الموحد
  const handleConfirmDelete = () => {
    if (!deleteModalTarget) return;

    if (deleteModalTarget.type === 'manual_question') {
      setManualQuestions((prev) => prev.filter((q) => q.id !== deleteModalTarget.id));
    } else if (deleteModalTarget.type === 'ai_question') {
      setAiQuestions((prev) => prev.filter((q) => q.id !== deleteModalTarget.id));
    } else if (deleteModalTarget.type === 'file') {
      setUploadedFiles((prev) => prev.filter((f) => f.id !== deleteModalTarget.id));
    } else if (deleteModalTarget.type === 'file_question') {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.id === deleteModalTarget.fileId) {
            return {
              ...f,
              questions: f.questions.filter((q) => q.id !== deleteModalTarget.id),
            };
          }
          return f;
        })
      );
    }

    setDeleteModalTarget(null);
  };

  // فتح نافذة تأكيد حذف سؤال مسجل
  const handleDeleteManualQuestion = (q: QuestionItem) => {
    setDeleteModalTarget({
      type: 'manual_question',
      id: q.id,
      title: 'حذف السؤال',
      name: q.question,
      warningText: 'هل أنت متأكد من رغبتك في حذف هذا السؤال؟ لن تتمكن من استرجاعه بعد الحذف.',
      confirmText: 'حذف السؤال',
    });
  };

  // فتح نافذة تأكيد حذف سؤال الذكاء الاصطناعي
  const handleDeleteAiQuestion = (q: QuestionItem) => {
    setDeleteModalTarget({
      type: 'ai_question',
      id: q.id,
      title: 'حذف السؤال',
      name: q.question,
      warningText: 'هل أنت متأكد من رغبتك في حذف هذا السؤال المولد بالذكاء الاصطناعي؟ لن تتمكن من استرجاعه بعد الحذف.',
      confirmText: 'حذف السؤال',
    });
  };

  // تفريغ أسئلة الذكاء الاصطناعي
  const handleClearAiQuestions = () => {
    setAiQuestions([]);
    setAiGenerationCount(0);
  };

  // تبديل إظهار / إخفاء أسئلة ملف من الملفات
  const handleToggleFileVisibility = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, isVisible: !file.isVisible } : file
      )
    );
  };

  // تبديل طي / توسيع عرض أسئلة ملف
  const handleToggleFileExpand = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, isExpanded: !file.isExpanded } : file
      )
    );
  };

  // فتح نافذة تأكيد حذف ملف كامل بأسئلته
  const handleDeleteFile = (file: UploadedFileItem) => {
    setDeleteModalTarget({
      type: 'file',
      id: file.id,
      title: `حذف الملف: ${file.fileName}`,
      name: file.fileName,
      warningText: `هل أنت متأكد من رغبتك في حذف هذا الملف بالكامل؟ سيتم إزالة كافة الأسئلة المستخرجة منه (${file.questions.length} أسئلة) ولا يمكن التراجع.`,
      confirmText: 'حذف الملف',
    });
  };

  // استلام الملف المرفوع بعد اكتمال تحليل الذكاء الاصطناعي
  const handleImportFileSuccess = (newFile: UploadedFileItem) => {
    setUploadedFiles((prev) => [newFile, ...prev]);
    setActiveTab('files');
  };

  // تصفية الأسئلة المسجلة بناءً على المحددات الإلزامية والاختيارية والصعوبة والنوع
  const filteredManualQuestions = useMemo(() => {
    return manualQuestions.filter((q) => {
      // المحددات الإلزامية
      if (selectedCountry && q.countryCode && q.countryCode !== selectedCountry) return false;
      if (selectedSystem && q.system && q.system !== selectedSystem) return false;
      if (selectedYear && q.year && q.year !== selectedYear) return false;
      if (selectedGrade && q.grade && q.grade !== selectedGrade) return false;
      if (selectedSubject && q.subject && q.subject !== selectedSubject) return false;
      if (
        selectedSemester &&
        q.semester &&
        selectedSemester !== 'sem-1-2' &&
        q.semester !== 'sem-1-2' &&
        q.semester !== selectedSemester
      )
        return false;

      // المحددات غير الإلزامية (اللى مش ريكوايرد: الوحدة، المجموعة، الدرس)
      if (selectedUnit !== 'all' && q.unit && q.unit !== selectedUnit) return false;
      if (
        selectedGroup !== 'all' &&
        q.group &&
        q.group !== selectedGroup &&
        !(selectedGroup === 'group-add-sub' && q.group === 'الجمع والطرح')
      )
        return false;
      if (selectedLesson !== 'all' && q.lesson && q.lesson !== selectedLesson) return false;

      // تصفيات إضافية
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'all' && q.type !== selectedType) return false;

      return true;
    });
  }, [
    manualQuestions,
    selectedCountry,
    selectedSystem,
    selectedYear,
    selectedGrade,
    selectedSemester,
    selectedSubject,
    selectedUnit,
    selectedGroup,
    selectedLesson,
    selectedDifficulty,
    selectedType,
  ]);

  // تصفية أسئلة الذكاء الاصطناعي بناءً على المحددات الإلزامية والاختيارية والصعوبة والنوع
  const filteredAiQuestions = useMemo(() => {
    return aiQuestions.filter((q) => {
      // المحددات الإلزامية
      if (selectedCountry && q.countryCode && q.countryCode !== selectedCountry) return false;
      if (selectedSystem && q.system && q.system !== selectedSystem) return false;
      if (selectedYear && q.year && q.year !== selectedYear) return false;
      if (selectedGrade && q.grade && q.grade !== selectedGrade) return false;
      if (selectedSubject && q.subject && q.subject !== selectedSubject) return false;
      if (
        selectedSemester &&
        q.semester &&
        selectedSemester !== 'sem-1-2' &&
        q.semester !== 'sem-1-2' &&
        q.semester !== selectedSemester
      )
        return false;

      // المحددات غير الإلزامية (اللى مش ريكوايرد: الوحدة، المجموعة، الدرس)
      if (selectedUnit !== 'all' && q.unit && q.unit !== selectedUnit) return false;
      if (selectedGroup !== 'all' && q.group && q.group !== selectedGroup) return false;
      if (selectedLesson !== 'all' && q.lesson && q.lesson !== selectedLesson) return false;

      // تصفيات إضافية
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'all' && q.type !== selectedType) return false;

      return true;
    });
  }, [
    aiQuestions,
    selectedCountry,
    selectedSystem,
    selectedYear,
    selectedGrade,
    selectedSemester,
    selectedSubject,
    selectedUnit,
    selectedGroup,
    selectedLesson,
    selectedDifficulty,
    selectedType,
  ]);

  // إجمالي الأسئلة المستخرجة من الملفات المرفوعة
  const totalFileQuestionsCount = useMemo(() => {
    return uploadedFiles.reduce((acc, f) => acc + f.questions.length, 0);
  }, [uploadedFiles]);

  // فتح شاشة تعديل السؤال
  const handleStartEdit = (q: QuestionItem) => {
    setEditingQuestion(q);
    onSubScreenChange?.(true, 'تعديل السؤال');
    onBackRequest?.(() => {
      setEditingQuestion(null);
      onSubScreenChange?.(false, '');
    });
  };

  // إلغاء التعديل والعودة
  const handleCancelEdit = () => {
    setEditingQuestion(null);
    onSubScreenChange?.(false, '');
  };

  // حفظ التعديلات على السؤال
  const handleSaveQuestion = (updated: QuestionItem) => {
    const existsInManual = manualQuestions.some((q) => q.id === updated.id);
    if (existsInManual) {
      setManualQuestions((prev) =>
        prev.map((q) => (q.id === updated.id ? updated : q))
      );
    } else {
      const existsInAi = aiQuestions.some((q) => q.id === updated.id);
      if (existsInAi) {
        setAiQuestions((prev) =>
          prev.map((q) => (q.id === updated.id ? updated : q))
        );
      } else {
        const existsInFiles = uploadedFiles.some((f) =>
          f.questions.some((q) => q.id === updated.id)
        );
        if (existsInFiles) {
          setUploadedFiles((prev) =>
            prev.map((file) => ({
              ...file,
              questions: file.questions.map((q) => (q.id === updated.id ? updated : q)),
            }))
          );
        } else {
          // إضافة جديدة للأسئلة المسجلة
          setManualQuestions((prev) => [updated, ...prev]);
        }
      }
    }
    setEditingQuestion(null);
    onSubScreenChange?.(false, '');
  };

  // حذف السؤال من شاشة التعديل
  const handleDeleteQuestionFromEdit = (questionId: string) => {
    setManualQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setAiQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setUploadedFiles((prev) =>
      prev.map((file) => ({
        ...file,
        questions: file.questions.filter((q) => q.id !== questionId),
      }))
    );
    setEditingQuestion(null);
    onSubScreenChange?.(false, '');
  };

  // إضافة سؤال مسجل يدوي جديد
  const handleAddNewManualQuestion = () => {
    const newDraft: QuestionItem = {
      id: `mq-${Date.now()}`,
      question: '',
      type: 'اختيار من متعدد',
      difficulty: 'سهل',
      skillTag: 'فهم',
      countryCode: selectedCountry,
      system: selectedSystem,
      year: selectedYear,
      grade: selectedGrade,
      semester: selectedSemester,
      subject: selectedSubject,
      unit: selectedUnit === 'all' ? 'unit-1' : selectedUnit,
      group: selectedGroup === 'all' ? 'group-add-sub' : selectedGroup,
      lesson: selectedLesson === 'all' ? 'lesson-1' : selectedLesson,
      source: 'manual',
      options: [
        { id: 'opt-1', text: '', isCorrect: true },
        { id: 'opt-2', text: '', isCorrect: false },
        { id: 'opt-3', text: '', isCorrect: false },
        { id: 'opt-4', text: '', isCorrect: false },
      ],
    };
    handleStartEdit(newDraft);
  };

  // إذا كانت شاشة التعديل نشطة، يتم عرضها مباشرة وفقاً للتصميم المطلوب
  if (editingQuestion) {
    return (
      <EditQuestionScreen
        question={editingQuestion}
        onSave={handleSaveQuestion}
        onCancel={handleCancelEdit}
        onDelete={handleDeleteQuestionFromEdit}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full" dir="rtl">
      {/* 1. نطاق الأسئلة المعروضة */}
      <div className="admin-panel shadow-xs">
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[13.5px] font-extrabold text-[var(--navy)] m-0">نطاق الأسئلة المعروضة</h3>
            <span className="text-[10px] text-[var(--teal)] bg-[#E3F7F4] px-2 py-0.5 rounded-full font-bold">
              تصفية مخصصة
            </span>
          </div>
          <p className="text-[11px] text-[var(--gray)] m-0 leading-relaxed">
            المحددات الرئيسية للمنهج (الدولة، نظام المنهج، السنة، الصف، الفصل، المادة) إلزامية لتحديد نطاق المحتوى، ويمكن حصر الأسئلة بدقة أكبر حسب الوحدة أو المجموعة أو الدرس (اختياري).
          </p>
        </div>

        {/* الصف الأول: المحددات الأساسية الإلزامية (الدولة، نظام المنهج، السنة، الصف، الفصل، المادة) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
          {/* 1. الدولة */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              الدولة <span className="text-[var(--coral)]">*</span>
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="admin-select text-[11px] font-bold text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="SA">SA السعودية 🇸🇦</option>
              <option value="EG">EG مصر 🇪🇬</option>
              <option value="AE">AE الإمارات 🇦🇪</option>
              <option value="KW">KW الكويت 🇰🇼</option>
              <option value="QA">QA قطر 🇶🇦</option>
              <option value="JO">JO الأردن 🇯🇴</option>
            </select>
          </div>

          {/* 2. نظام المنهج */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              نظام المنهج <span className="text-[var(--coral)]">*</span>
            </label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value as 'national' | 'international')}
              className="admin-select text-[11px] font-bold text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="national">وطني (حكومي / أهلي)</option>
              <option value="international">دولي (أمريكي / بريطاني)</option>
            </select>
          </div>

          {/* 3. السنة */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              السنة <span className="text-[var(--coral)]">*</span>
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="admin-select text-[11px] font-bold text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="2025-2026">2025 - 2026</option>
              <option value="2024-2025">2024 - 2025</option>
              <option value="2023-2024">2023 - 2024</option>
            </select>
          </div>

          {/* 4. الصف */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              الصف <span className="text-[var(--coral)]">*</span>
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="admin-select text-[11px] font-bold text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="grade-4">الرابع الابتدائي</option>
              <option value="grade-5">الخامس الابتدائي</option>
              <option value="grade-6">السادس الابتدائي</option>
              <option value="prep-1">الأول المتوسط / الإعدادي</option>
              <option value="prep-2">الثاني المتوسط</option>
              <option value="prep-3">الثالث المتوسط</option>
            </select>
          </div>

          {/* 5. الفصل */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              الفصل <span className="text-[var(--coral)]">*</span>
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="admin-select text-[11px] font-bold text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="sem-1">الفصل الأول</option>
              <option value="sem-2">الفصل الثاني</option>
              <option value="sem-1-2">الفصل الأول و الثاني</option>
            </select>
          </div>

          {/* 6. المادة */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              المادة <span className="text-[var(--coral)]">*</span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="admin-select text-[11px] font-bold text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="math">رياضيات 🔢</option>
              <option value="science">علوم 🧪</option>
              <option value="arabic">لغة عربية 📖</option>
              <option value="english">لغة إنجليزية 🔤</option>
              <option value="islamic">دراسات إسلامية 🕌</option>
              <option value="social">دراسات اجتماعية 🌍</option>
            </select>
          </div>
        </div>

        {/* الصف الثاني: تفريعات المنهج غير الإلزامية (الوحدة، المجموعة، الدرس) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3.5 pt-3.5 border-t border-[var(--border-light)] w-full">
          {/* 7. الوحدة (مش ريكوايرد - اختياري) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-[var(--navy)]">
                الوحدة
              </label>
              <span className="text-[9.5px] text-[var(--gray)] font-normal">اختياري</span>
            </div>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="admin-select text-[11px] text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="all">جميع الوحدات</option>
              <option value="unit-1">الوحدة 1 — الأعداد والعمليات</option>
              <option value="unit-2">الوحدة 2 — الكسور والعمليات عليها</option>
              <option value="unit-3">الوحدة 3 — الهندسة والقياس</option>
              <option value="unit-4">الوحدة 4 — الإحصاء والاحتمال</option>
            </select>
          </div>

          {/* 8. المجموعة (مش ريكوايرد - اختياري) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-[var(--navy)]">
                المجموعة
              </label>
              <span className="text-[9.5px] text-[var(--gray)] font-normal">اختياري</span>
            </div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="admin-select text-[11px] text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="all">جميع المجموعات</option>
              <option value="group-add-sub">الجمع والطرح</option>
              <option value="group-mul-div">الضرب والقسمة</option>
              <option value="group-mixed">العمليات المركبة</option>
              <option value="group-geom">الأشكال الهندسية</option>
            </select>
          </div>

          {/* 9. الدرس (مش ريكوايرد - اختياري) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-[var(--navy)]">
                الدرس
              </label>
              <span className="text-[9.5px] text-[var(--gray)] font-normal">اختياري</span>
            </div>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="admin-select text-[11px] text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="all">جميع الدروس</option>
              <option value="lesson-1">الدرس 1: مقدمة في جمع وطرح الأعداد</option>
              <option value="lesson-2">الدرس 2: خصائص الجمع والطرح</option>
              <option value="lesson-3">الدرس 3: حل المسائل وتقدير النواتج</option>
              <option value="lesson-4">الدرس 4: الحساب الذهني والتطبيقات</option>
            </select>
          </div>
        </div>

        {/* الصف الثالث: فلاتر خصائص السؤال (الصعوبة والنوع في row جديد) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5 pt-3.5 border-t border-[var(--border-light)] w-full">
          {/* 10. الصعوبة */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              مستوى الصعوبة
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="admin-select text-[11px] text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="all">جميع المستويات</option>
              <option value="سهل">سهل</option>
              <option value="متوسط">متوسط</option>
              <option value="صعب">صعب</option>
            </select>
          </div>

          {/* 11. النوع */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
              نوع السؤال
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="admin-select text-[11px] text-[var(--navy)] cursor-pointer w-full"
            >
              <option value="all">جميع الأنواع</option>
              <option value="اختيار من متعدد">اختيار من متعدد</option>
              <option value="صح وخطأ">صح وخطأ</option>
              <option value="إكمال الفراغ">إكمال الفراغ</option>
              <option value="مقالي">مقالي</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. شريط التبويبات الثلاثة (Segmented Tabs) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="inline-flex bg-[#F1F3F5] p-[3px] rounded-full self-start">
          {/* التابة 1: الأسئلة المسجلة */}
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-[var(--teal)] text-white shadow-sm'
                : 'text-[var(--navy)] hover:text-black bg-transparent'
            }`}
          >
            <span>الأسئلة المسجلة</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-latin font-bold ${
                activeTab === 'manual'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#E2E8F0] text-[var(--navy)]'
              }`}
            >
              {filteredManualQuestions.length}
            </span>
          </button>

          {/* التابة 2: أسئلة الذكاء الاصطناعي */}
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-[var(--teal)] text-white shadow-sm'
                : 'text-[var(--navy)] hover:text-black bg-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>أسئلة الذكاء الاصطناعي</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-latin font-bold ${
                activeTab === 'ai'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#E2E8F0] text-[var(--navy)]'
              }`}
            >
              {aiQuestions.length}
            </span>
          </button>

          {/* التابة 3: أسئلة الملفات المرفوعة */}
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'files'
                ? 'bg-[var(--teal)] text-white shadow-sm'
                : 'text-[var(--navy)] hover:text-black bg-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>أسئلة الملفات المرفوعة</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-latin font-bold ${
                activeTab === 'files'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#E2E8F0] text-[var(--navy)]'
              }`}
            >
              {uploadedFiles.length}
            </span>
          </button>
        </div>

        {/* زر الإجراء السريع بحسب التبويب النشط */}
        <div>
          {activeTab === 'manual' && (
            <button
              type="button"
              onClick={handleAddNewManualQuestion}
              className="abtn teal flex items-center gap-1.5 text-[11px] py-1.5 px-3.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة سؤال مسجل</span>
            </button>
          )}

          {activeTab === 'ai' && (
            <div className="flex items-center gap-2">
              {aiQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAiQuestions}
                  className="abtn outline text-[11px] py-1.5 px-3 cursor-pointer text-[var(--coral)] border-[var(--coral)]/30 hover:bg-[#FFF5F5]"
                  title="مسح كافة الأسئلة المولدة"
                >
                  مسح الأسئلة المولدة
                </button>
              )}
              <button
                type="button"
                onClick={handleGenerateAiQuestions}
                disabled={isGeneratingAi}
                className="abtn teal flex items-center gap-1.5 text-[11px] py-1.5 px-3.5 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري التوليد...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiQuestions.length === 0 ? 'توليد أسئلة بالذكاء الاصطناعي' : 'توليد دفعة جديدة'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'files' && (
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="abtn teal flex items-center gap-1.5 text-[11px] py-1.5 px-3.5 shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>استيراد ملف جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. محتوى التبويب الأول: الأسئلة العادية المسجلة */}
      {activeTab === 'manual' && (
        <div className="admin-panel shadow-xs">
          <div className="panel-head mb-3 flex items-center justify-between pb-3 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <h4 className="text-[13.5px] font-extrabold text-[#17325C] m-0">
                الأسئلة المسجلة ({filteredManualQuestions.length})
              </h4>
              <span className="text-[10px] text-[var(--gray)]">
                الأسئلة اليدوية والمعتمدة للمجموعة
              </span>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="admin-table text-right w-full min-w-[650px]">
              <thead>
                <tr>
                  <th style={{ width: '52%' }}>السؤال</th>
                  <th style={{ width: '20%' }}>النوع</th>
                  <th style={{ width: '14%' }}>الصعوبة</th>
                  <th style={{ width: '14%', textAlign: 'center' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredManualQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-[11px] text-[var(--gray)]">
                      لا توجد أسئلة مسجلة تطابق معايير التصفية المختارة.
                    </td>
                  </tr>
                ) : (
                  filteredManualQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-[#F9FBFC] transition-colors">
                      {/* نص السؤال */}
                      <td className="font-bold text-[11.5px] text-[var(--navy)] py-3">
                        {q.question}
                      </td>

                      {/* نوع السؤال */}
                      <td className="text-[11px] text-[var(--navy)] font-medium">
                        {q.type}
                      </td>

                      {/* مستوى الصعوبة */}
                      <td>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10.5px] font-bold ${
                            q.difficulty === 'سهل'
                              ? 'bg-[#E3F7F4] text-[var(--teal)]'
                              : q.difficulty === 'متوسط'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-[#FEE2E2] text-[#DC2626]'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>

                      {/* الإجراءات */}
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(q)}
                            className="w-[26px] h-[26px] rounded-[7px] bg-[#F1F3F5] text-[var(--navy)] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer"
                            title="تعديل"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteManualQuestion(q)}
                            className="w-[26px] h-[26px] rounded-[7px] bg-[#FBE4DF] text-[var(--coral)] hover:bg-[#FED7D7] flex items-center justify-center transition-colors cursor-pointer"
                            title="حذف السؤال"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* 4. محتوى التبويب الثاني: أسئلة الذكاء الاصطناعي */}
      {activeTab === 'ai' && (
        <div className="admin-panel shadow-xs">
          <div className="panel-head mb-3 flex items-center justify-between pb-3 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <h4 className="text-[13.5px] font-extrabold text-[#17325C] m-0">
                أسئلة الذكاء الاصطناعي ({filteredAiQuestions.length})
              </h4>
              {aiQuestions.length > 0 && (
                <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-[#E3F7F4] text-[var(--teal)] font-bold">
                  تم التوليد وتخزين {aiQuestions.length} سؤالاً بنجاح
                </span>
              )}
            </div>
          </div>

          {/* في حال كانت التابة فارغة تماماً */}
          {aiQuestions.length === 0 ? (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E3F7F4] flex items-center justify-center text-[var(--teal)] mb-3 shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <h5 className="text-[14px] font-extrabold text-[var(--navy)] mb-1.5">
                لم يتم توليد أي أسئلة ذكاء اصطناعي بعد
              </h5>
              <p className="text-[11.5px] text-[var(--gray)] max-w-md mb-5 leading-relaxed">
                اضغط على زر التوليد بالأسفل ليقوم المحرك الذكي بتحليل معايير المنهج، وصياغة حزم أسئلة متوافقة ومبتكرة قابلة للتخزين المباشر في بنك الأسئلة.
              </p>
              <button
                type="button"
                onClick={handleGenerateAiQuestions}
                disabled={isGeneratingAi}
                className="abtn teal flex items-center gap-2 text-[12px] py-2 px-5 shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري صياغة الأسئلة الذكية...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد أسئلة بالذكاء الاصطناعي الآن ✨</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="admin-table text-right w-full min-w-[650px]">
                <thead>
                  <tr>
                    <th style={{ width: '48%' }}>السؤال</th>
                    <th style={{ width: '18%' }}>النوع</th>
                    <th style={{ width: '14%' }}>الصعوبة</th>
                    <th style={{ width: '10%' }}>المصدر</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAiQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-[11px] text-[var(--gray)]">
                        لا توجد أسئلة ذكاء اصطناعي تطابق التصفية الحالية.
                      </td>
                    </tr>
                  ) : (
                    filteredAiQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-[#F9FBFC] transition-colors">
                        {/* نص السؤال */}
                        <td className="font-bold text-[11.5px] text-[var(--navy)] py-3">
                          {q.question}
                        </td>

                        {/* النوع */}
                        <td className="text-[11px] text-[var(--navy)] font-medium">
                          {q.type}
                        </td>

                        {/* الصعوبة */}
                        <td>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md text-[10.5px] font-bold ${
                              q.difficulty === 'سهل'
                                ? 'bg-[#E3F7F4] text-[var(--teal)]'
                                : q.difficulty === 'متوسط'
                                ? 'bg-[#FEF3C7] text-[#D97706]'
                                : 'bg-[#FEE2E2] text-[#DC2626]'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>

                        {/* شارة المصدر AI */}
                        <td>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EBF4FF] text-[#2B6CB0] text-[10px] font-bold">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>AI</span>
                          </span>
                        </td>

                        {/* الإجراءات */}
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(q)}
                              className="w-[26px] h-[26px] rounded-[7px] bg-[#F1F3F5] text-[var(--navy)] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer"
                              title="تعديل"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAiQuestion(q)}
                              className="w-[26px] h-[26px] rounded-[7px] bg-[#FBE4DF] text-[var(--coral)] hover:bg-[#FED7D7] flex items-center justify-center transition-colors cursor-pointer"
                              title="حذف هذا السؤال"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. محتوى التبويب الثالث: أسئلة الملفات المرفوعة */}
      {activeTab === 'files' && (
        <div className="flex flex-col gap-3.5 w-full">
          {uploadedFiles.length === 0 ? (
            <div className="admin-panel py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F3F5] flex items-center justify-center text-[var(--gray)] mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h5 className="text-[14px] font-extrabold text-[var(--navy)] mb-1.5">
                لا توجد ملفات مرفوعة حالياً
              </h5>
              <p className="text-[11.5px] text-[var(--gray)] max-w-md mb-4">
                قم باستيراد ملفات الأسئلة (PDF, Excel, Word) لاستخراج وتصنيف الأسئلة التابعة لها فورياً.
              </p>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="abtn teal flex items-center gap-2 text-[11.5px] py-2 px-4 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>استيراد ملف جديد الآن</span>
              </button>
            </div>
          ) : (
            uploadedFiles.map((file) => (
              <div
                key={file.id}
                className={`admin-panel transition-all shadow-xs ${
                  !file.isVisible ? 'bg-[#FAFAFA] border-dashed opacity-85' : 'bg-white'
                }`}
              >
                {/* رأس بطاقة الملف */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-light)]">
                  {/* اسم وتفاصيل الملف */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        file.fileFormat === 'pdf'
                          ? 'bg-[#FFF5F5] text-[#E53E3E]'
                          : file.fileFormat === 'excel'
                          ? 'bg-[#E6FFFA] text-[#319795]'
                          : 'bg-[#EBF8FF] text-[#3182CE]'
                      }`}
                    >
                      {file.fileFormat === 'excel' ? (
                        <FileSpreadsheet className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[12.5px] text-[var(--navy)]">
                          {file.fileName}
                        </span>
                        {/* شارة حالة العرض */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            file.isVisible
                              ? 'bg-[#E3F7F4] text-[var(--teal)]'
                              : 'bg-[#EDF2F7] text-[var(--gray)]'
                          }`}
                        >
                          {file.isVisible ? 'معروض ونشط' : 'مخفي مؤقتاً'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[10.5px] text-[var(--gray)] mt-0.5 font-latin">
                        <span>الحجم: {file.fileSize}</span>
                        <span>•</span>
                        <span>تاريخ الرفع: {file.uploadDate}</span>
                        <span>•</span>
                        <span className="font-bold text-[var(--navy)]">
                          {file.questions.length} أسئلة مستخرجة
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* إجراءات الملف: إخفاء/إظهار، طي/توسيع، حذف */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* زر إخفاء / إظهار أسئلة هذا الملف */}
                    <button
                      type="button"
                      onClick={() => handleToggleFileVisibility(file.id)}
                      className={`abtn outline text-[11px] py-1 px-2.5 flex items-center gap-1.5 cursor-pointer ${
                        !file.isVisible
                          ? 'border-[var(--teal)] text-[var(--teal)] bg-[#E3F7F4]/30'
                          : 'text-[var(--navy)]'
                      }`}
                      title={file.isVisible ? 'إخفاء أسئلة هذا الملف' : 'إظهار أسئلة هذا الملف'}
                    >
                      {file.isVisible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-[var(--gray)]" />
                          <span>إخفاء الأسئلة</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[var(--teal)]" />
                          <span>إظهار الأسئلة</span>
                        </>
                      )}
                    </button>

                    {/* زر طي / توسيع عرض الأسئلة */}
                    <button
                      type="button"
                      onClick={() => handleToggleFileExpand(file.id)}
                      className="w-[28px] h-[28px] rounded-[7px] bg-[#F1F3F5] text-[var(--navy)] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer"
                      title={file.isExpanded ? 'طي قائمة الأسئلة' : 'عرض أسئلة الملف'}
                    >
                      {file.isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* زر حذف الملف بالكامل */}
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file)}
                      className="w-[28px] h-[28px] rounded-[7px] bg-[#FBE4DF] text-[var(--coral)] hover:bg-[#FED7D7] flex items-center justify-center transition-colors cursor-pointer"
                      title="حذف الملف بالكامل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* قائمة الأسئلة التابعة للملف (تحت بعضها) عند التوسيع */}
                {file.isExpanded && (
                  <div className="mt-3">
                    {!file.isVisible ? (
                      <div className="p-3 bg-[#FFF5F5] border border-[#FED7D7] rounded-lg text-center flex items-center justify-center gap-2 text-[11px] text-[#C53030]">
                        <Info className="w-4 h-4 shrink-0" />
                        <span>
                          أسئلة هذا الملف مخفية حالياً ولا تظهر للطلاب أو الاختبارات. يمكنك إعادتها بالضغط على "إظهار الأسئلة".
                        </span>
                      </div>
                    ) : (
                      <div className="overflow-x-auto w-full">
                        <table className="admin-table text-right w-full min-w-[600px]">
                          <thead>
                            <tr>
                              <th style={{ width: '54%' }}>السؤال المستخرج</th>
                              <th style={{ width: '20%' }}>النوع</th>
                              <th style={{ width: '14%' }}>الصعوبة</th>
                              <th style={{ width: '12%', textAlign: 'center' }}>إجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {file.questions.map((q) => (
                              <tr key={q.id} className="hover:bg-[#F9FBFC] transition-colors">
                                <td className="font-bold text-[11px] text-[var(--navy)] py-2.5">
                                  {q.question}
                                </td>
                                <td className="text-[10.5px] text-[var(--gray)]">
                                  {q.type}
                                </td>
                                <td>
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                      q.difficulty === 'سهل'
                                        ? 'bg-[#E3F7F4] text-[var(--teal)]'
                                        : q.difficulty === 'متوسط'
                                        ? 'bg-[#FEF3C7] text-[#D97706]'
                                        : 'bg-[#FEE2E2] text-[#DC2626]'
                                    }`}
                                  >
                                    {q.difficulty}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(q)}
                                      className="w-[24px] h-[24px] rounded-[6px] bg-[#F1F3F5] text-[var(--navy)] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer"
                                      title="تعديل"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeleteModalTarget({
                                          type: 'file_question',
                                          id: q.id,
                                          fileId: file.id,
                                          title: 'حذف السؤال المستخرج',
                                          name: q.question,
                                          warningText: 'هل أنت متأكد من رغبتك في حذف هذا السؤال من الملف؟ لن تتمكن من استرجاعه بعد الحذف.',
                                          confirmText: 'حذف السؤال',
                                        })
                                      }
                                      className="w-[24px] h-[24px] rounded-[6px] bg-[#FBE4DF] text-[var(--coral)] hover:bg-[#FED7D7] flex items-center justify-center transition-colors cursor-pointer"
                                      title="حذف هذا السؤال"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* مودال استيراد ملف الأسئلة مع محاكاة تحليل AI */}
      <ImportQuestionsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        scopeInfo={{
          countryCode: selectedCountry,
          system: selectedSystem,
          year: selectedYear,
          grade: selectedGrade,
          semester: selectedSemester,
          subject: selectedSubject,
          unit: selectedUnit === 'all' ? 'unit-1' : selectedUnit,
          group: selectedGroup === 'all' ? 'group-add-sub' : selectedGroup,
          lesson: selectedLesson === 'all' ? 'lesson-1' : selectedLesson,
        }}
        onImportSuccess={handleImportFileSuccess}
      />

      {/* مودال تأكيد الحذف الموحد طبقاً لـ RULE[AGENTS_md] */}
      {deleteModalTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in duration-150"
          dir="rtl"
        >
          <div className="w-full max-w-[340px] sm:max-w-[360px] p-5 rounded-xl bg-white shadow-xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150 border border-[var(--border-light)]">
            {/* Central top trash icon */}
            <div className="w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>

            {/* Title */}
            <h4 className="text-[13px] font-extrabold text-[var(--navy)] mb-2 line-clamp-2">
              {deleteModalTarget.title}
            </h4>

            {/* Alert message box */}
            <div className="w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center mb-4">
              <p className="text-[10.8px] leading-relaxed text-[#E53E3E] font-medium m-0">
                {deleteModalTarget.warningText}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                className="abtn outline flex-1 py-1.5 text-[11px] font-bold cursor-pointer"
                onClick={() => setDeleteModalTarget(null)}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="abtn coral flex-1 py-1.5 text-[11px] font-bold cursor-pointer"
                onClick={handleConfirmDelete}
              >
                {deleteModalTarget.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
