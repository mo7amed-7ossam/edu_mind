import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  FileText,
  X,
  Send,
  Check,
  CheckCircle2,
  RefreshCw,
  Plus,
  BookOpen,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Video,
  FileCheck,
  RotateCcw,
  MessageSquare,
  Eye,
  CheckCheck,
} from 'lucide-react';
import { UnitItem, LessonItem, LessonGroup, DifficultyLevel } from './CurriculumPage';

interface AiCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCurriculum: (newUnits: UnitItem[]) => void;
  currentSubjectName: string;
  currentGradeName: string;
  currentCountryName: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  actionApplied?: string;
}

export const AiCurriculumModal: React.FC<AiCurriculumModalProps> = ({
  isOpen,
  onClose,
  onApplyCurriculum,
  currentSubjectName,
  currentGradeName,
  currentCountryName,
}) => {
  // Navigation & Step State
  const [step, setStep] = useState<'upload' | 'analyzing' | 'review'>('upload');
  const [activeTab, setActiveTab] = useState<'chat' | 'preview'>('chat'); // For mobile responsive toggle

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis Animation State
  const [analysisPhase, setAnalysisPhase] = useState<number>(0);

  // Proposed Curriculum Data
  const [proposedUnits, setProposedUnits] = useState<UnitItem[]>([]);
  const [expandedUnitIds, setExpandedUnitIds] = useState<Record<string, boolean>>({});

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  if (!isOpen) return null;

  // Handle Real File Selection
  const handleRealFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ['.pdf', '.docx', '.doc', '.pptx', '.txt'];
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
    if (!validExtensions.includes(ext)) {
      setUploadError('يرجى رفع ملف كتاب أو توصيف بصيغة مدعومة (PDF, DOCX, DOC, PPTX).');
      return;
    }
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFile({
      name: file.name,
      size: `${sizeMb} MB`,
      type: ext.replace('.', '').toUpperCase(),
    });
  };

  // Trigger Analysis and Simulation
  const startAiAnalysis = () => {
    if (!uploadedFile) {
      setUploadError('يرجى اختيار أو رفع ملف المنهج أولاً.');
      return;
    }

    setStep('analyzing');
    setAnalysisPhase(0);

    // Progressive phases
    const phaseTimers = [
      setTimeout(() => setAnalysisPhase(1), 700),
      setTimeout(() => setAnalysisPhase(2), 1600),
      setTimeout(() => setAnalysisPhase(3), 2600),
      setTimeout(() => {
        finishAnalysis();
      }, 3400),
    ];

    return () => phaseTimers.forEach(clearTimeout);
  };

  // Generate Initial Curriculum Structure from File
  const finishAnalysis = () => {
    const fileName = uploadedFile?.name || 'الملف المرفوع';

    // Tailor curriculum structure based on subject
    const isMath = currentSubjectName.includes('رياضيات') || fileName.includes('رياضيات');
    const isScience = currentSubjectName.includes('علوم') || fileName.includes('علوم');

    let generated: UnitItem[] = [];

    if (isMath) {
      generated = [
        {
          id: `u-ai-1`,
          title: 'الوحدة الأولى: القيمة المنزلية والعمليات',
          titleEn: 'Unit 1: Place Value & Operations',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: 'g-ai-1-1',
              title: 'القيمة المنزلية والمقارنة',
              titleEn: 'Place Value & Comparison',
              lessons: [
                {
                  id: 'l-ai-1',
                  title: 'القيمة المنزلية ضمن مئات الألوف',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يحدد الطالب القيمة المنزلية لأي رقم في عدد حتى ستة أرقام', 'يكتب الأعداد بالصيغ القياسية واللفظية والتحليلية'],
                  videoName: 'place_value_intro.mp4',
                  videoSize: '48 MB',
                },
                {
                  id: 'l-ai-2',
                  title: 'المقارنة بين الأعداد الكبيرة وترتيبها',
                  contentType: 'file',
                  status: 'published',
                  difficulty: 'medium',
                  goals: ['يقارن بين عددين باستخدام الرموز (>، <، =)', 'يرتب مجموعة أعداد تصاعدياً وتنازلياً'],
                  fileName: 'numbers_comparison_worksheet.pdf',
                  fileSize: '3.2 MB',
                },
              ],
            },
            {
              id: 'g-ai-1-2',
              title: 'مهارات الجمع والطرح المتقدمة',
              titleEn: 'Addition & Subtraction Skills',
              lessons: [
                {
                  id: 'l-ai-3',
                  title: 'تقدير نواتج الجمع والطرح',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'medium',
                  goals: ['يقرب الأعداد إلى أقرب عشرة ومئة وألف للتقدير السريع'],
                  videoName: 'estimation_skills.mp4',
                  videoSize: '54 MB',
                },
              ],
            },
          ],
        },
        {
          id: `u-ai-2`,
          title: 'الوحدة الثانية: الضرب والقسمة في الرياضيات',
          titleEn: 'Unit 2: Multiplication & Division',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: 'g-ai-2-1',
              title: 'حقائق الضرب والأنماط',
              titleEn: 'Multiplication Facts',
              lessons: [
                {
                  id: 'l-ai-4',
                  title: 'الضرب في مضاعفات العشرة والمئة',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يستعمل الأنماط وحقائق الضرب الأساسية للضرب ذهنياً'],
                  videoName: 'mental_math_multiplication.mp4',
                  videoSize: '62 MB',
                },
                {
                  id: 'l-ai-5',
                  title: 'الضرب في عدد من رقمين مع إعادة التجميع',
                  contentType: 'video',
                  status: 'draft',
                  difficulty: 'hard',
                  goals: ['يطبق خوارزمية الضرب الرأسي بدقة', 'يحل مسائل من واقع الحياة على الضرب'],
                  videoName: 'multi_digit_mult.mp4',
                  videoSize: '85 MB',
                },
              ],
            },
          ],
        },
        {
          id: `u-ai-3`,
          title: 'الوحدة الثالثة: الهندسة والقياس وتطبيقاتها',
          titleEn: 'Unit 3: Geometry & Measurement',
          status: 'draft',
          isExpanded: false,
          groups: [
            {
              id: 'g-ai-3-1',
              title: 'المحيط والمساحة للأشكال المستوية',
              titleEn: 'Perimeter & Area',
              lessons: [
                {
                  id: 'l-ai-6',
                  title: 'إيجاد محيط المستطيل والمربع',
                  contentType: 'file',
                  status: 'draft',
                  difficulty: 'easy',
                  goals: ['يحسب محيط الأشكال الهندسية بوحدات الطول المعيارية'],
                  fileName: 'geometry_perimeter.pdf',
                  fileSize: '4.1 MB',
                },
              ],
            },
          ],
        },
      ];
    } else {
      // Default versatile curriculum structure
      generated = [
        {
          id: `u-ai-1`,
          title: `الوحدة الأولى: الأساسيات والمفاهيم الجوهرية في ${currentSubjectName}`,
          titleEn: 'Unit 1: Core Concepts & Fundamentals',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: 'g-ai-1-1',
              title: 'المدخل التأسيسي والنظري',
              titleEn: 'Theoretical Introduction',
              lessons: [
                {
                  id: 'l-ai-1',
                  title: `مقدمة في ${currentSubjectName} وأهميتها`,
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يتعرف الطالب على المفاهيم والمصطلحات الأساسية', 'يربط بين المادة وتطبيقات الحياة اليومية'],
                  videoName: 'intro_fundamentals.mp4',
                  videoSize: '45 MB',
                },
                {
                  id: 'l-ai-2',
                  title: 'المفاهيم المحورية والتحليل',
                  contentType: 'file',
                  status: 'published',
                  difficulty: 'medium',
                  goals: ['يحلل الطالب العناصر الأساسية للموضوع', 'يستنتج العلاقات والتأثيرات المتبادلة'],
                  fileName: 'analysis_guide.pdf',
                  fileSize: '2.9 MB',
                },
              ],
            },
          ],
        },
        {
          id: `u-ai-2`,
          title: 'الوحدة الثانية: التطبيقات العملية وحل المشكلات',
          titleEn: 'Unit 2: Practical Applications',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: 'g-ai-2-1',
              title: 'نماذج وتطبيقات تفاعلية',
              titleEn: 'Applied Models',
              lessons: [
                {
                  id: 'l-ai-3',
                  title: 'دراسة حالة وتطبيق عملي',
                  contentType: 'video',
                  status: 'draft',
                  difficulty: 'medium',
                  goals: ['يطبق المهارات المكتسبة على مسائل ونماذج واقعية'],
                  videoName: 'practical_case.mp4',
                  videoSize: '70 MB',
                },
              ],
            },
          ],
        },
      ];
    }

    setProposedUnits(generated);

    // Initial expand state
    const exp: Record<string, boolean> = {};
    generated.forEach((u) => {
      exp[u.id] = true;
    });
    setExpandedUnitIds(exp);

    // Calculate count
    const totalLessons = generated.reduce(
      (acc, u) => acc + u.groups.reduce((gAcc, g) => gAcc + g.lessons.length, 0),
      0
    );

    // Set Welcome AI Message
    const welcomeMsg: ChatMessage = {
      id: 'm-1',
      sender: 'ai',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      text: `مرحباً بك! قمت بتحليل وثيقة المنهج «${fileName}» واستخراج خريطة تعليمية متكاملة لـ (${currentSubjectName} - ${currentGradeName}) تضم ${generated.length} وحدات و ${totalLessons} دروس مع نواتج التعلم وتحديد مستويات الصعوبة ونوع المحتوى.\n\nهل هذا الهيكل مطابق لمنهجك المعتمد؟ يمكنك الضغط على «اعتماد وتطبيق» مباشرة، أو إخباري بأي تعديلات تريدها (مثال: "أنت غلطان في اسم كذا"، "ضيف درس زيادة"، "احذف درس"، إلخ).`,
    };

    setMessages([welcomeMsg]);
    setStep('review');
  };

  // Handle User Sending a Message in AI Chat
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isAiResponding) return;

    const userMsg: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsAiResponding(true);

    // Simulate smart AI response & curriculum modification
    setTimeout(() => {
      processAiInstruction(text);
      setIsAiResponding(false);
    }, 900);
  };

  // Process user feedback to modify proposed curriculum map
  const processAiInstruction = (userInput: string) => {
    const lower = userInput.toLowerCase();
    const timeNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    let responseText = '';
    let actionTag: string | undefined = undefined;

    // 1. Case: Adding a new lesson (ضيف درس / أضف درس)
    if (lower.includes('ضيف درس') || lower.includes('اضف درس') || lower.includes('أضف درس') || lower.includes('درس جديد') || lower.includes('درس زياده')) {
      // Extract title if mentioned or generate a meaningful lesson
      let lessonName = 'خطة حل المسألة والتفكير المنطقي';
      if (userInput.includes('باسم') || userInput.includes('بعنوان')) {
        const parts = userInput.split(/باسم|بعنوان/);
        if (parts[1]) lessonName = parts[1].trim().replace(/['"«»]/g, '');
      } else if (userInput.includes('درس')) {
        const afterLesson = userInput.substring(userInput.indexOf('درس') + 4).trim();
        if (afterLesson && afterLesson.length > 2 && afterLesson.length < 50) {
          lessonName = afterLesson.replace(/['"«»]/g, '');
        }
      }

      const newLesson: LessonItem = {
        id: `l-ai-custom-${Date.now()}`,
        title: lessonName,
        contentType: 'video',
        status: 'published',
        difficulty: 'medium',
        goals: ['يطبق استراتيجية التفكير المنطقي لحل المسائل', 'يتحقق من صحة الحل باستخدام التقدير'],
        videoName: 'new_lesson_overview.mp4',
        videoSize: '40 MB',
      };

      setProposedUnits((prev) => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        const targetUnit = copy[0];
        if (targetUnit && targetUnit.groups.length > 0) {
          targetUnit.groups[0].lessons.push(newLesson);
        }
        return copy;
      });

      actionTag = `تمت إضافة درس: ${lessonName}`;
      responseText = `أبشر! تمت إضافة الدرس الجديد «${lessonName}» بنجاح في الوحدة الأولى مع صياغة نواتج التعلم وتحديد مستوى الصعوبة ونوع المحتوى (فيديو).\n\nتم تحديث خريطة المنهج المقترحة أمامك، هل هناك أي درس آخر أو تعديل إضافي؟`;
    }

    // 2. Case: Correction / User points out an error ("أنت غلطان" / "في خطأ" / "عدل اسم الوحدة")
    else if (
      lower.includes('غلطان') ||
      lower.includes('خطأ') ||
      lower.includes('عدل اسم') ||
      lower.includes('غير اسم') ||
      lower.includes('تعديل اسم')
    ) {
      let newTitle = 'الأعداد والعمليات الحسابية المتقدمة';
      if (userInput.includes('إلى') || userInput.includes('الي') || userInput.includes('خليها')) {
        const parts = userInput.split(/إلى|الي|خليها/);
        if (parts[1]) newTitle = parts[1].trim().replace(/['"«»]/g, '');
      }

      setProposedUnits((prev) => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        if (copy[0]) {
          copy[0].title = newTitle.startsWith('الوحدة') ? newTitle : `الوحدة الأولى: ${newTitle}`;
        }
        return copy;
      });

      actionTag = `تم تصحيح المسمى إلى: ${newTitle}`;
      responseText = `حقك علي، واعتذر عن هذا الخطأ! تم تعديل اسم الوحدة الأولى فوراً إلى «${newTitle}» وتحديث الخريطة المقترحة أمامك بدقة.\n\nهل تفضل مراجعة أي جزئية أخرى في المنهج؟`;
    }

    // 3. Case: Delete lesson (احذف درس / إزالة درس)
    else if (lower.includes('احذف') || lower.includes('حذف') || lower.includes('شيل درس')) {
      let removedTitle = 'الدرس المحدد';
      setProposedUnits((prev) => {
        const copy = [...prev];
        for (const u of copy) {
          for (const g of u.groups) {
            if (g.lessons.length > 1) {
              const popped = g.lessons.pop();
              if (popped) removedTitle = popped.title;
              return copy;
            }
          }
        }
        return copy;
      });

      actionTag = `تم حذف ${removedTitle}`;
      responseText = `تم حذف «${removedTitle}» من هيكل المنهج وتحديث الخريطة المقترحة.\n\nهل تود إجراء أي تعديل آخر؟`;
    }

    // 4. Case: Change difficulty or content type
    else if (lower.includes('صعوبة') || lower.includes('صعب') || lower.includes('سهل') || lower.includes('متوسط')) {
      const targetDiff: DifficultyLevel = lower.includes('صعب')
        ? 'hard'
        : lower.includes('متوسط')
        ? 'medium'
        : 'easy';

      const diffAr = targetDiff === 'hard' ? 'صعب' : targetDiff === 'medium' ? 'متوسط' : 'سهل';

      setProposedUnits((prev) => {
        const copy = [...prev];
        if (copy[0]?.groups[0]?.lessons[0]) {
          copy[0].groups[0].lessons[0].difficulty = targetDiff;
        }
        return copy;
      });

      actionTag = `تم تحديث مستوى الصعوبة إلى: ${diffAr}`;
      responseText = `تم ضبط مستوى صعوبة الدرس على (${diffAr}) وفق توجيهك. تم تحديث الشارة في خريطة المنهج.`;
    }

    // 5. Case: General Affirmation or Positive Feedback ("تمام", "كويس", "ممتاز", "موافق", "اعتمد")
    else if (lower.includes('تمام') || lower.includes('ممتاز') || lower.includes('اعتمد') || lower.includes('موافق') || lower.includes('صح')) {
      responseText = `يسعدني جداً أن الهيكل نال إعجابك وتوافق مع متطلباتك! يمكنك الآن الضغط على زر «اعتماد وتطبيق على المنهج الحالي» بالأسفل لتثبيت هذا الهيكل فوراً في منصتك والبدء في إدارة وتدريس الدروس.`;
    }

    // 6. Generic intelligent response
    else {
      responseText = `فهمت طلبك بخصوص «${userInput}». قمت بمراجعة عناصر المنهج المقترحة وتحديثها بما يضمن التدرج البيداغوجي وتكامل نواتج التعلم مع خطتك الدراسية.\n\nهل هناك أي ملاحظة أخرى، أم تود اعتماد الخريطة الآن؟`;
    }

    const aiMsg: ChatMessage = {
      id: `m-ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      time: timeNow,
      actionApplied: actionTag,
    };

    setMessages((prev) => [...prev, aiMsg]);
  };

  // Toggle unit expand in preview
  const toggleUnitExpand = (uId: string) => {
    setExpandedUnitIds((prev) => ({
      ...prev,
      [uId]: !prev[uId],
    }));
  };

  // Apply to Main Curriculum
  const handleApply = () => {
    if (proposedUnits.length === 0) return;
    onApplyCurriculum(proposedUnits);
    onClose();
  };

  // Quick suggestion prompts for user convenience
  const suggestionPrompts = [
    'أنت غلطان، عدل اسم الوحدة الأولى إلى: الأعداد الكلية',
    'ضيف درس زيادة باسم: استراتيجيات حل المسألة',
    'احذف آخر درس من الوحدة الأولى',
    'النتيجة ممتازة واعتمد المنهج كما هو',
  ];

  // Total counts helper
  const totalUnits = proposedUnits.length;
  const totalLessons = proposedUnits.reduce(
    (acc, u) => acc + u.groups.reduce((gAcc, g) => gAcc + g.lessons.length, 0),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-2.5 sm:p-4 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-[var(--border-light)] w-full max-w-5xl h-[92vh] max-h-[760px] flex flex-col overflow-hidden">
        {/* 1. Modal Header */}
        <div className="px-5 py-3.5 border-b border-[var(--border-light)] bg-gradient-to-r from-white via-[#FAFCFB] to-[#F2FBF9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E3F7F4] text-[var(--teal)] flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-[var(--teal)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[var(--navy)] m-0">
                  مساعد المنهج الذكي (AI Curriculum Architect)
                </h3>
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[var(--teal)] text-white font-latin">
                  AI Model
                </span>
              </div>
              <p className="text-[10.5px] text-[var(--gray)] m-0 mt-0.5">
                توليد وهيكلة شجرة المنهج، الوحدات، والدروس آلياً من وثيقة المنهج مع مراجعة حية بالمحادثة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'review' && (
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="abtn outline text-[10.5px] py-1 px-2.5 hidden sm:flex items-center gap-1 hover:border-[var(--teal)] hover:text-[var(--teal)]"
                title="إعادة رفع ملف آخر"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ملف جديد</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--gray)] hover:text-black p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Step 1: Uploading the Curriculum Document */}
        {step === 'upload' && (
          <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center">
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F3F5] text-[11px] font-bold text-[var(--navy)] mb-4">
              <span>{currentCountryName}</span>
              <span>•</span>
              <span>{currentGradeName}</span>
              <span>•</span>
              <span className="text-[var(--teal)]">{currentSubjectName}</span>
            </div>

            <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[var(--navy)] mb-2">
              ارفع وثيقة المنهج لتحليلها وهيكلتها آلياً
            </h2>
            <p className="text-[12px] text-[var(--gray)] max-w-lg mb-6 leading-relaxed">
              سيتولى الذكاء الاصطناعي قراءة فهرس الكتاب أو وثيقة التوصيف، واستخراج شجرة متكاملة تضم
              الوحدات، المجموعات، الدروس، نواتج التعلم، وتحديد مستويات الصعوبة مع إمكانية مناقشته وتعديله.
            </p>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleRealFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-2xl p-6 sm:p-8 cursor-pointer transition-all ${
                isDragging
                  ? 'border-[var(--teal)] bg-[#E3F7F4]'
                  : 'border-[var(--border-mid)] hover:border-[var(--teal)] bg-[#FAFBFD] hover:bg-[#F2FBF9]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.docx,.doc,.pptx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleRealFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#E3F7F4] text-[var(--teal)] flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="text-[13px] font-extrabold text-[var(--navy)] font-latin">
                    {uploadedFile.name}
                  </div>
                  <div className="text-[11px] text-[var(--gray)] font-latin">
                    {uploadedFile.size} • صيغة {uploadedFile.type}
                  </div>
                  <span className="text-[10.5px] text-[var(--teal)] font-bold mt-1">
                    جاهز للتحليل (اضغط لتغيير الملف)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF2F7] text-[var(--navy)] flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-[var(--teal)]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[var(--navy)]">
                      اسحب وأفلت ملف المنهج هنا أو اضغط للتصفح
                    </div>
                    <div className="text-[10.5px] text-[var(--gray)] mt-1 font-latin">
                      الصيغ المدعومة: PDF, DOCX, DOC, PPTX (كتاب مدرسي، فهرس، أو توصيف وزاري)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="mt-3 text-[11px] text-[#E53E3E] bg-[#FFF5F5] border border-[#FED7D7] p-2.5 rounded-lg flex items-center gap-2 w-full text-right">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 w-full justify-center">
              <button
                type="button"
                className="abtn outline px-5 py-2 text-[11.5px]"
                onClick={onClose}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={startAiAnalysis}
                disabled={!uploadedFile}
                className={`abtn teal px-6 py-2.5 text-[12px] font-bold shadow-xs flex items-center gap-2 ${
                  !uploadedFile ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>بدء التحليل والتوليد الذكي</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Step 2: Analyzing Simulation Screen */}
        {step === 'analyzing' && (
          <div className="p-8 overflow-y-auto flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E3F7F4] text-[var(--teal)] flex items-center justify-center mb-5 relative animate-pulse shadow-sm">
              <Sparkles className="w-8 h-8" />
              <div className="absolute -inset-1 rounded-2xl border-2 border-[var(--teal)]/40 animate-ping opacity-30"></div>
            </div>

            <h3 className="text-[16px] font-extrabold text-[var(--navy)] mb-1">
              جاري فحص وهيكلة المنهج ذكياً...
            </h3>
            <p className="text-[11.5px] text-[var(--gray)] mb-6 font-latin truncate max-w-xs">
              {uploadedFile?.name}
            </p>

            {/* Animated Progress Steps */}
            <div className="w-full space-y-3 text-right bg-[#FAFBFD] p-4 rounded-xl border border-[var(--border-light)]">
              <div className={`flex items-center gap-2.5 text-[11px] ${analysisPhase >= 0 ? 'text-[var(--teal)] font-bold' : 'text-[var(--gray)]'}`}>
                {analysisPhase > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--teal)]" />
                ) : (
                  <RefreshCw className="w-4 h-4 animate-spin text-[var(--teal)]" />
                )}
                <span>1. قراءة واستخراج فهرس الموضوعات والمفاهيم...</span>
              </div>

              <div className={`flex items-center gap-2.5 text-[11px] ${analysisPhase >= 1 ? 'text-[var(--teal)] font-bold' : 'text-[var(--gray)]'}`}>
                {analysisPhase > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--teal)]" />
                ) : analysisPhase === 1 ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[var(--teal)]" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[var(--border-mid)]"></div>
                )}
                <span>2. تنظيم الهيكل إلى وحدات ومجموعات دروس منطقية...</span>
              </div>

              <div className={`flex items-center gap-2.5 text-[11px] ${analysisPhase >= 2 ? 'text-[var(--teal)] font-bold' : 'text-[var(--gray)]'}`}>
                {analysisPhase > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--teal)]" />
                ) : analysisPhase === 2 ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[var(--teal)]" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[var(--border-mid)]"></div>
                )}
                <span>3. صياغة نواتج التعلم وتحديد مستويات الصعوبة...</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Step 3: Interactive Review (Chat + Live Curriculum Preview) */}
        {step === 'review' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex border-b border-[var(--border-light)] bg-[#FAFBFD] p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-[var(--teal)] text-white shadow-xs'
                    : 'text-[var(--navy)] hover:bg-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>محادثة الذكاء الاصطناعي (AI Chat)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-[var(--teal)] text-white shadow-xs'
                    : 'text-[var(--navy)] hover:bg-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>الخريطة المقترحة ({totalLessons} دروس)</span>
              </button>
            </div>

            {/* Main Dual Panels (Desktop: Side-by-side) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              {/* Left/Right Column 1: AI Chat Assistant (7 cols on lg) */}
              <div
                className={`lg:col-span-7 flex flex-col border-l border-[var(--border-light)] bg-white h-full min-h-0 ${
                  activeTab === 'chat' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Chat Header Status */}
                <div className="px-4 py-2 bg-[#FAFCFD] border-b border-[var(--border-light)] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-[11px] font-bold text-[var(--navy)]">
                      مساعد المنهج متصل وجاهز لتنفيذ تعديلاتك
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--gray)] font-latin truncate max-w-[160px]">
                    {uploadedFile?.name}
                  </span>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 max-w-[88%] ${
                        m.sender === 'user' ? 'mr-auto flex-row-reverse text-left' : 'ml-auto text-right'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold ${
                          m.sender === 'user'
                            ? 'bg-[var(--navy)]'
                            : 'bg-[var(--teal)] shadow-xs'
                        }`}
                      >
                        {m.sender === 'user' ? 'أنت' : <Sparkles className="w-4 h-4" />}
                      </div>

                      {/* Bubble */}
                      <div>
                        <div
                          className={`p-3 rounded-2xl text-[11.5px] leading-relaxed whitespace-pre-line shadow-xs ${
                            m.sender === 'user'
                              ? 'bg-[var(--navy)] text-white rounded-tl-none'
                              : 'bg-[#F2FBF9] text-[var(--navy)] border border-[#C5EDE6] rounded-tr-none'
                          }`}
                        >
                          {m.text}
                        </div>

                        {/* Action applied badge */}
                        {m.actionApplied && (
                          <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-[var(--teal)] bg-[#E3F7F4] px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3" />
                            <span>{m.actionApplied}</span>
                          </div>
                        )}

                        <div className="text-[9.5px] text-[var(--gray)] mt-0.5 px-1 font-latin">
                          {m.time}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* AI Responding typing indicator */}
                  {isAiResponding && (
                    <div className="flex gap-2.5 max-w-[80%] ml-auto text-right">
                      <div className="w-7 h-7 rounded-lg bg-[var(--teal)] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Sparkles className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="p-2.5 rounded-2xl bg-[#F2FBF9] border border-[#C5EDE6] rounded-tr-none flex items-center gap-1.5 text-[11px] text-[var(--teal)] font-medium">
                        <span className="animate-pulse">جاري تحليل طلبك وتحديث خريطة المنهج...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Suggestions Chips */}
                <div className="px-3 pt-2 pb-1 bg-white border-t border-[var(--border-light)] overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
                  <span className="text-[10px] text-[var(--gray)] font-bold shrink-0">اقتراحات سريعة:</span>
                  {suggestionPrompts.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(sug)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#FAFBFD] hover:bg-[#E3F7F4] border border-[var(--border-light)] hover:border-[var(--teal)] text-[var(--navy)] whitespace-nowrap cursor-pointer transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-white border-t border-[var(--border-light)] flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="اطلب أي تعديل (مثال: أضف درس كذا، أنت غلطان في اسم الوحدة، احذف، إلخ)..."
                    className="admin-input flex-1 text-[11.5px] py-2"
                  />
                  <button
                    type="submit"
                    disabled={!inputPrompt.trim() || isAiResponding}
                    className={`abtn teal py-2 px-3 text-[11px] font-bold flex items-center gap-1.5 shrink-0 ${
                      !inputPrompt.trim() || isAiResponding ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span>إرسال</span>
                    <Send className="w-3.5 h-3.5 -scale-x-100" />
                  </button>
                </form>
              </div>

              {/* Left/Right Column 2: Live Proposed Curriculum Map Preview (5 cols on lg) */}
              <div
                className={`lg:col-span-5 flex flex-col bg-[#FAFBFD] h-full min-h-0 ${
                  activeTab === 'preview' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Preview Panel Header */}
                <div className="px-4 py-2.5 bg-[#F4F6F9] border-b border-[var(--border-light)] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[var(--teal)]" />
                    <span className="text-[11.5px] font-extrabold text-[var(--navy)]">
                      خريطة المنهج المقترحة (محدثة حياً)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--gray)] font-latin">
                    <span className="font-bold text-[var(--navy)]">{totalUnits} وحدات</span>
                    <span>•</span>
                    <span className="font-bold text-[var(--teal)]">{totalLessons} دروس</span>
                  </div>
                </div>

                {/* Tree Units Scroll View */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
                  {proposedUnits.map((u, uIdx) => {
                    const isExpanded = expandedUnitIds[u.id] !== false;
                    const uLessonCount = u.groups.reduce((acc, g) => acc + g.lessons.length, 0);

                    return (
                      <div
                        key={u.id}
                        className="border border-[var(--border-light)] rounded-xl bg-white shadow-xs overflow-hidden transition-all"
                      >
                        {/* Unit Row */}
                        <div
                          onClick={() => toggleUnitExpand(u.id)}
                          className="px-3 py-2.5 bg-[#FAFBFD] hover:bg-[#F3FAF8] flex items-center justify-between cursor-pointer transition-colors border-b border-[var(--border-light)]/60"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-[#E3F7F4] text-[var(--teal)] text-[10px] font-extrabold flex items-center justify-center font-latin shrink-0">
                              {uIdx + 1}
                            </span>
                            <div className="min-w-0 text-right">
                              <div className="text-[11.5px] font-bold text-[var(--navy)] truncate">
                                {u.title}
                              </div>
                              {u.titleEn && (
                                <div className="text-[9.5px] text-[var(--gray)] font-latin truncate">
                                  {u.titleEn}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-white border border-[var(--border-light)] text-[var(--gray)] font-latin">
                              {uLessonCount} دروس
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[var(--gray)]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[var(--gray)]" />
                            )}
                          </div>
                        </div>

                        {/* Groups and Lessons under Unit */}
                        {isExpanded && (
                          <div className="p-2 space-y-2 bg-white">
                            {u.groups.map((grp) => (
                              <div
                                key={grp.id}
                                className="bg-[#FAFBFD] p-2 rounded-lg border border-[var(--border-light)]/80 space-y-1.5"
                              >
                                <div className="text-[10.5px] font-bold text-[var(--navy)] px-1 flex items-center justify-between">
                                  <span className="truncate">{grp.title}</span>
                                  {grp.titleEn && (
                                    <span className="text-[9px] text-[var(--gray)] font-latin">
                                      {grp.titleEn}
                                    </span>
                                  )}
                                </div>

                                {/* Lessons */}
                                <div className="space-y-1">
                                  {grp.lessons.map((lsn) => (
                                    <div
                                      key={lsn.id}
                                      className="p-1.5 rounded-md bg-white border border-[var(--border-light)] text-right flex items-center justify-between gap-2"
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        {lsn.contentType === 'file' ? (
                                          <FileText className="w-3.5 h-3.5 text-[var(--teal)] shrink-0" />
                                        ) : (
                                          <Video className="w-3.5 h-3.5 text-[var(--teal)] shrink-0" />
                                        )}
                                        <span className="text-[11px] font-semibold text-[var(--navy)] truncate">
                                          {lsn.title}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1 shrink-0">
                                        <span
                                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                            lsn.difficulty === 'easy'
                                              ? 'bg-[#E3F7F4] text-[var(--teal)]'
                                              : lsn.difficulty === 'hard'
                                              ? 'bg-[#FFF5F5] text-[#E53E3E]'
                                              : 'bg-[#FEF3C7] text-[#D97706]'
                                          }`}
                                        >
                                          {lsn.difficulty === 'easy'
                                            ? 'سهل'
                                            : lsn.difficulty === 'hard'
                                            ? 'صعب'
                                            : 'متوسط'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. Modal Footer Action Bar */}
            <div className="px-5 py-3 border-t border-[var(--border-light)] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-[11px] text-[var(--navy)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--teal)] shrink-0" />
                <span>
                  جاهز للاعتماد: <strong className="font-latin">{totalUnits}</strong> وحدات و{' '}
                  <strong className="font-latin">{totalLessons}</strong> دروس مقترحة
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  className="abtn outline px-4 py-2 text-[11px]"
                  onClick={onClose}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="abtn teal px-6 py-2 text-[11.5px] font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>اعتماد وتطبيق على المنهج الحالي</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
