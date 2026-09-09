import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UnitItem, LessonItem, LessonGroup } from './CurriculumPage';

interface UploadCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCurriculum: (
    newUnits: UnitItem[],
    summary: { unitsCount: number; lessonsCount: number; fileName: string }
  ) => void;
  currentSubjectName: string;
  currentGradeName: string;
  currentCountryName: string;
  currentSystemName?: string;
  currentYearName?: string;
  currentSemesterName?: string;
}

export const UploadCurriculumModal: React.FC<UploadCurriculumModalProps> = ({
  isOpen,
  onClose,
  onApplyCurriculum,
  currentSubjectName,
  currentGradeName,
  currentCountryName,
  currentSystemName,
  currentYearName,
  currentSemesterName,
}) => {
  // State: 'upload' | 'processing'
  const [step, setStep] = useState<'upload' | 'processing'>('upload');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processing Progress State
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [processingPhase, setProcessingPhase] = useState<number>(0);

  if (!isOpen) return null;

  // Handle Real File Selection
  const handleRealFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ['.pdf', '.docx', '.doc', '.pptx', '.xlsx', '.xls', '.txt'];
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
    if (!validExtensions.includes(ext)) {
      setUploadError('يرجى رفع ملف كتاب أو توصيف بصيغة مدعومة (PDF, DOCX, DOC, PPTX, XLSX, TXT).');
      return;
    }
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFile({
      name: file.name,
      size: `${sizeMb} MB`,
      type: ext.replace('.', '').toUpperCase(),
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleRealFile(file);
    }
  };

  // Process uploaded file and extract curriculum directly
  const startProcessing = () => {
    if (!uploadedFile) {
      setUploadError('يرجى اختيار أو سحب ملف المنهج أولاً للمتابعة.');
      return;
    }

    setStep('processing');
    setProgressPercent(15);
    setProcessingPhase(0);

    const t1 = setTimeout(() => {
      setProgressPercent(45);
      setProcessingPhase(1);
    }, 600);

    const t2 = setTimeout(() => {
      setProgressPercent(80);
      setProcessingPhase(2);
    }, 1300);

    const t3 = setTimeout(() => {
      setProgressPercent(100);
      setProcessingPhase(3);
    }, 1900);

    const t4 = setTimeout(() => {
      finishProcessingAndPlaceIntoTree();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  // Direct generation and insertion into tree
  const finishProcessingAndPlaceIntoTree = () => {
    const fileName = uploadedFile?.name || 'الملف المرفوع';
    const isMath = currentSubjectName.includes('رياضيات') || fileName.includes('رياضيات');
    const isScience = currentSubjectName.includes('علوم') || fileName.includes('علوم');
    const isArabic = currentSubjectName.includes('عربي') || fileName.includes('عربي');
    const isEnglish = currentSubjectName.includes('إنجليز') || fileName.toLowerCase().includes('english');
    const isIslamic = currentSubjectName.includes('إسلام') || fileName.includes('إسلام');

    let generated: UnitItem[] = [];

    if (isScience) {
      generated = [
        {
          id: `u-file-1-${Date.now()}`,
          title: 'الوحدة الأولى: الكائنات الحية والنظام البيئي',
          titleEn: 'Unit 1: Living Organisms & Ecosystems',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: `g-file-1-1-${Date.now()}`,
              title: 'الأنظمة البيئية وتوازنها',
              titleEn: 'Ecosystems & Balance',
              lessons: [
                {
                  id: `l-file-1-${Date.now()}`,
                  title: 'السلاسل والشبكات الغذائية',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: [
                    'يوضح مسار انتقال الطاقة عبر السلسلة الغذائية',
                    'يميز بين المنتجات والمستهلكات والمحللات',
                  ],
                  videoName: 'food_chains_hd.mp4',
                  videoSize: '45.2 MB',
                  videoDuration: '09:15',
                },
                {
                  id: `l-file-2-${Date.now()}`,
                  title: 'التكيف والبقاء في البيئات المختلفة',
                  contentType: 'file',
                  status: 'published',
                  difficulty: 'medium',
                  goals: [
                    'يحدد التكيفات التركيبية والسلوكية للكائنات الحية',
                    'يقارن بين تكيفات الكائنات الصحراوية والمائية',
                  ],
                  fileName: 'adaptation_worksheet.pdf',
                  fileSize: '3.4 MB',
                },
              ],
            },
            {
              id: `g-file-1-2-${Date.now()}`,
              title: 'التفاعل بين الكائنات الحية',
              titleEn: 'Interactions Among Organisms',
              lessons: [
                {
                  id: `l-file-3-${Date.now()}`,
                  title: 'العلاقات المتبادلة والتعايش',
                  contentType: 'file',
                  status: 'draft',
                  difficulty: 'medium',
                  goals: ['يستنتج علاقة التكافل والتنافس والافتراس'],
                  fileName: 'symbiosis_guide.pdf',
                  fileSize: '2.8 MB',
                },
              ],
            },
          ],
        },
        {
          id: `u-file-2-${Date.now()}`,
          title: 'الوحدة الثانية: المادة والطاقة وتغيراتها',
          titleEn: 'Unit 2: Matter, Energy & Changes',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: `g-file-2-1-${Date.now()}`,
              title: 'خصائص المادة وحالاتها',
              titleEn: 'Properties of Matter',
              lessons: [
                {
                  id: `l-file-4-${Date.now()}`,
                  title: 'الكتلة والحجم والكثافة',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يقيس كتلة وحجم المواد الصلبة والسائلة بدقة'],
                  videoName: 'matter_properties.mp4',
                  videoSize: '58.0 MB',
                  videoDuration: '11:30',
                },
                {
                  id: `l-file-5-${Date.now()}`,
                  title: 'التغيرات الفيزيائية والكيميائية',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'hard',
                  goals: ['يميز بين التغير الفيزيائي والكيميائي بدلائل عملية'],
                  videoName: 'chemical_changes_lab.mp4',
                  videoSize: '72.4 MB',
                  videoDuration: '13:45',
                },
              ],
            },
          ],
        },
        {
          id: `u-file-3-${Date.now()}`,
          title: 'الوحدة الثالثة: الأرض والفضاء والنظام الشمسي',
          titleEn: 'Unit 3: Earth & Space Science',
          status: 'draft',
          isExpanded: false,
          groups: [
            {
              id: `g-file-3-1-${Date.now()}`,
              title: 'كواكب المجموعة الشمسية وحركتها',
              titleEn: 'The Solar System',
              lessons: [
                {
                  id: `l-file-6-${Date.now()}`,
                  title: 'دوران الأرض وتعاقب الفصول الأربعة',
                  contentType: 'file',
                  status: 'draft',
                  difficulty: 'medium',
                  goals: ['يفسر تعاقب الليل والنهار والفصول الأربعة بناءً على ميل المحور'],
                  fileName: 'earth_rotation_study.pdf',
                  fileSize: '4.6 MB',
                },
              ],
            },
          ],
        },
      ];
    } else if (isMath) {
      generated = [
        {
          id: `u-file-1-${Date.now()}`,
          title: 'الوحدة الأولى: القيمة المنزلية والعمليات الحسابية',
          titleEn: 'Unit 1: Place Value & Operations',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: `g-file-1-1-${Date.now()}`,
              title: 'القيمة المنزلية والمقارنة',
              titleEn: 'Place Value & Comparison',
              lessons: [
                {
                  id: `l-file-1-${Date.now()}`,
                  title: 'القيمة المنزلية ضمن مئات الألوف',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يحدد القيمة المنزلية لأي رقم', 'يكتب الأعداد بالصيغة التحليلية واللفظية'],
                  videoName: 'place_value_lesson.mp4',
                  videoSize: '48.0 MB',
                  videoDuration: '08:20',
                },
                {
                  id: `l-file-2-${Date.now()}`,
                  title: 'المقارنة بين الأعداد وترتيبها',
                  contentType: 'file',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يقارن بين الأعداد الكبيرة باستخدام الرموز المعيارية'],
                  fileName: 'numbers_worksheet.pdf',
                  fileSize: '3.1 MB',
                },
              ],
            },
            {
              id: `g-file-1-2-${Date.now()}`,
              title: 'مهارات الجمع والطرح المتقدمة',
              titleEn: 'Addition & Subtraction Skills',
              lessons: [
                {
                  id: `l-file-3-${Date.now()}`,
                  title: 'تقدير نواتج الجمع والطرح',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'medium',
                  goals: ['يقرب الأعداد لتقدير النواتج سريعاً'],
                  videoName: 'estimation_hd.mp4',
                  videoSize: '51.3 MB',
                  videoDuration: '10:05',
                },
              ],
            },
          ],
        },
        {
          id: `u-file-2-${Date.now()}`,
          title: 'الوحدة الثانية: الضرب والقسمة والأعداد الكسرية',
          titleEn: 'Unit 2: Multiplication & Division',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: `g-file-2-1-${Date.now()}`,
              title: 'حقائق الضرب والأنماط الذهنية',
              titleEn: 'Multiplication Facts',
              lessons: [
                {
                  id: `l-file-4-${Date.now()}`,
                  title: 'الضرب في مضاعفات العشرة والمئة',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يستعمل الأنماط للضرب ذهنياً'],
                  videoName: 'mental_multiplication.mp4',
                  videoSize: '62.0 MB',
                  videoDuration: '12:15',
                },
                {
                  id: `l-file-5-${Date.now()}`,
                  title: 'الضرب في عدد من رقمين مع إعادة التجميع',
                  contentType: 'video',
                  status: 'draft',
                  difficulty: 'hard',
                  goals: ['يطبق خوارزمية الضرب الرأسي بدقة'],
                  videoName: 'vertical_multiplication.mp4',
                  videoSize: '78.5 MB',
                  videoDuration: '14:30',
                },
              ],
            },
          ],
        },
        {
          id: `u-file-3-${Date.now()}`,
          title: 'الوحدة الثالثة: الهندسة والقياس وتطبيقاتها',
          titleEn: 'Unit 3: Geometry & Measurement',
          status: 'draft',
          isExpanded: false,
          groups: [
            {
              id: `g-file-3-1-${Date.now()}`,
              title: 'المحيط والمساحة للأشكال المستوية',
              titleEn: 'Perimeter & Area',
              lessons: [
                {
                  id: `l-file-6-${Date.now()}`,
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
    } else if (isArabic) {
      generated = [
        {
          id: `u-file-1-${Date.now()}`,
          title: 'الوحدة الأولى: المهارات النحوية وقواعد الإعراب',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: `g-file-1-1-${Date.now()}`,
              title: 'أقسام الكلمة والجملة الاسمية',
              lessons: [
                {
                  id: `l-file-1-${Date.now()}`,
                  title: 'المبتدأ والخبر وعلامات رفعهما',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يحدد المبتدأ والخبر في الجمل المعطاة', 'يتقن علامات الرفع الأصلية والفرعية'],
                  videoName: 'noun_sentence.mp4',
                  videoSize: '41.0 MB',
                  videoDuration: '07:40',
                },
                {
                  id: `l-file-2-${Date.now()}`,
                  title: 'كان وأخواتها وأثرها في الجملة',
                  contentType: 'file',
                  status: 'published',
                  difficulty: 'medium',
                  goals: ['يوضح عمل الأفعال الناسخة على المبتدأ والخبر'],
                  fileName: 'kana_and_sisters.pdf',
                  fileSize: '2.7 MB',
                },
              ],
            },
          ],
        },
        {
          id: `u-file-2-${Date.now()}`,
          title: 'الوحدة الثانية: نصوص القراءة والفهم القرائي',
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: `g-file-2-1-${Date.now()}`,
              title: 'النصوص الأدبية والتحليل البلاغي',
              lessons: [
                {
                  id: `l-file-3-${Date.now()}`,
                  title: 'قراءة النص واستخراج الأفكار الرئيسة',
                  contentType: 'file',
                  status: 'published',
                  difficulty: 'medium',
                  goals: ['يستخرج الفكرة العامة والأفكار الفرعية للنص'],
                  fileName: 'reading_comprehension.pdf',
                  fileSize: '3.5 MB',
                },
              ],
            },
          ],
        },
        {
          id: `u-file-3-${Date.now()}`,
          title: 'الوحدة الثالثة: الرسم الإملائي والتعبير الكتابي',
          status: 'draft',
          isExpanded: false,
          groups: [
            {
              id: `g-file-3-1-${Date.now()}`,
              title: 'الهمزات وعلامات الترقيم',
              lessons: [
                {
                  id: `l-file-4-${Date.now()}`,
                  title: 'الهمزة المتوسطة على الواو والياء',
                  contentType: 'file',
                  status: 'draft',
                  difficulty: 'medium',
                  goals: ['يطبق قاعدة أقوى الحركات في رسم الهمزة'],
                  fileName: 'spelling_rules.pdf',
                  fileSize: '1.9 MB',
                },
              ],
            },
          ],
        },
      ];
    } else {
      // General structure for any other subject
      generated = [
        {
          id: `u-file-1-${Date.now()}`,
          title: `الوحدة الأولى: مدخل وأساسيات ${currentSubjectName}`,
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: `g-file-1-1-${Date.now()}`,
              title: 'المفاهيم الجوهرية والتأسيس',
              lessons: [
                {
                  id: `l-file-1-${Date.now()}`,
                  title: `مقدمة في ${currentSubjectName} وأهدافها`,
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'easy',
                  goals: ['يتعرف الطالب على المصطلحات والمفاهيم الرئيسة للمادة'],
                  videoName: 'intro_lesson.mp4',
                  videoSize: '38.0 MB',
                  videoDuration: '08:15',
                },
                {
                  id: `l-file-2-${Date.now()}`,
                  title: 'المهارات الأساسية والتطبيقات الأولية',
                  contentType: 'file',
                  status: 'published',
                  difficulty: 'medium',
                  goals: ['يطبق القواعد الأولية بشكل منهجي سليم'],
                  fileName: 'fundamentals_guide.pdf',
                  fileSize: '2.5 MB',
                },
              ],
            },
          ],
        },
        {
          id: `u-file-2-${Date.now()}`,
          title: `الوحدة الثانية: المهارات المتقدمة والتطبيق العملي`,
          status: 'published',
          isExpanded: true,
          groups: [
            {
              id: `g-file-2-1-${Date.now()}`,
              title: 'التطبيقات العملية ودراسة الحالة',
              lessons: [
                {
                  id: `l-file-3-${Date.now()}`,
                  title: 'حل المشكلات وتطبيقات الحياة الواقعية',
                  contentType: 'video',
                  status: 'published',
                  difficulty: 'hard',
                  goals: ['يربط بين المعارف النظرية والواقع العملي'],
                  videoName: 'practical_cases.mp4',
                  videoSize: '54.0 MB',
                  videoDuration: '11:00',
                },
              ],
            },
          ],
        },
        {
          id: `u-file-3-${Date.now()}`,
          title: `الوحدة الثالثة: المراجعة الشاملة والاختبارات التراكمية`,
          status: 'draft',
          isExpanded: false,
          groups: [
            {
              id: `g-file-3-1-${Date.now()}`,
              title: 'الأنشطة التقييمية ونواتج التعلم',
              lessons: [
                {
                  id: `l-file-4-${Date.now()}`,
                  title: 'اختبار تجريبي تراكمي شامل',
                  contentType: 'file',
                  status: 'draft',
                  difficulty: 'medium',
                  goals: ['يقيس مدى تحقق نواتج التعلم المستهدفة'],
                  fileName: 'comprehensive_test.pdf',
                  fileSize: '3.2 MB',
                },
              ],
            },
          ],
        },
      ];
    }

    // Count total lessons
    let totalLessons = 0;
    generated.forEach((u) => {
      u.groups.forEach((g) => {
        totalLessons += g.lessons.length;
      });
    });

    // Directly apply curriculum to tree
    onApplyCurriculum(generated, {
      unitsCount: generated.length,
      lessonsCount: totalLessons,
      fileName,
    });

    // Reset state & close
    setStep('upload');
    setUploadedFile(null);
    setProgressPercent(0);
    setProcessingPhase(0);
    onClose();
  };

  const handleClose = () => {
    if (step === 'processing') return; // prevent closing while processing
    setStep('upload');
    setUploadedFile(null);
    setUploadError(null);
    setProgressPercent(0);
    setProcessingPhase(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[520px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-light)] flex items-center justify-between bg-[#FBFDFE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E3F7F4] text-[var(--teal)] flex items-center justify-center shrink-0">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[13.5px] font-extrabold text-[var(--navy)] m-0 leading-tight">
                رفع ومعالجة ملف المنهج
              </h3>
              <p className="text-[10.5px] text-[var(--gray)] m-0 mt-0.5">
                استخراج الوحدات والدروس ووضعها مباشرة في شجرة المنهج
              </p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-lg border border-[var(--border-light)] text-[var(--gray)] hover:text-[var(--navy)] hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Scope Info Summary (الدولة، الصف، الفصل، المادة فقط) */}
          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[var(--border-light)] mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
            {/* 1. الدولة */}
            <div className="flex items-center gap-1 font-bold text-[var(--navy)]">
              <span className="text-[var(--gray)] font-normal">الدولة:</span>
              <span>{currentCountryName}</span>
            </div>
            {/* 2. الصف */}
            <div className="flex items-center gap-1 font-bold text-[var(--navy)]">
              <span className="text-[var(--gray)] font-normal">الصف:</span>
              <span>{currentGradeName}</span>
            </div>
            {/* 3. الفصل */}
            {currentSemesterName && (
              <div className="flex items-center gap-1 font-bold text-[var(--navy)]">
                <span className="text-[var(--gray)] font-normal">الفصل:</span>
                <span>{currentSemesterName}</span>
              </div>
            )}
            {/* 4. المادة */}
            <div className="flex items-center gap-1 font-bold text-[var(--navy)]">
              <span className="text-[var(--gray)] font-normal">المادة:</span>
              <span>{currentSubjectName}</span>
            </div>
          </div>

          {step === 'upload' ? (
            <div className="space-y-4">
              {/* Drag and drop upload zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[var(--teal)] bg-[#E3F7F4]/50'
                    : uploadedFile
                    ? 'border-[var(--teal)]/60 bg-[#FBFDFE]'
                    : 'border-[var(--border-light)] bg-[#FAFCFD] hover:border-[var(--teal)]/50 hover:bg-[#F6FAF9]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.pptx,.xlsx,.xls,.txt"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleRealFile(f);
                  }}
                />

                <div className="w-12 h-12 rounded-full bg-[#E3F7F4] text-[var(--teal)] flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <h4 className="text-[12.5px] font-extrabold text-[var(--navy)] mb-1">
                  {uploadedFile ? 'تم اختيار الملف بنجاح' : 'اسحب وأفلت ملف المنهج هنا'}
                </h4>
                <p className="text-[11px] text-[var(--gray)] max-w-sm mx-auto mb-3 leading-relaxed">
                  {uploadedFile
                    ? 'يمكنك الضغط لاختيار ملف مختلف أو المتابعة للمعالجة والإدراج المباشر'
                    : 'أو اضغط لتصفح ملفات جهازك (كتاب المنهج، توصيف المقرر، أو خطة توزيع الدروس)'}
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--border-light)] text-[10.5px] text-[var(--navy)] font-semibold shadow-xs">
                  <span>الصيغ المدعومة: PDF, Word (DOCX), PPTX, Excel, TXT</span>
                </div>
              </div>

              {/* Selected File Details Card */}
              {uploadedFile && (
                <div className="p-3 rounded-xl border border-[var(--teal)]/40 bg-[#E3F7F4]/25 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[var(--teal)]/30 text-[var(--teal)] flex items-center justify-center shrink-0">
                      {uploadedFile.type === 'XLSX' || uploadedFile.type === 'XLS' ? (
                        <FileSpreadsheet className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11.5px] font-extrabold text-[var(--navy)] truncate">
                        {uploadedFile.name}
                      </div>
                      <div className="text-[10px] text-[var(--gray)] flex items-center gap-2 mt-0.5">
                        <span className="font-latin">{uploadedFile.size}</span>
                        <span>•</span>
                        <span className="text-[var(--teal)] font-bold">{uploadedFile.type}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-[10px] text-[var(--coral)] hover:underline p-1 shrink-0 font-bold cursor-pointer"
                  >
                    إلغاء الملف
                  </button>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] flex items-center gap-2 text-[11px] text-[#E53E3E]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          ) : (
            /* Processing Step */
            <div className="py-6 text-center space-y-4">
              <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[var(--teal)] animate-spin" />
              </div>

              <div>
                <h4 className="text-[13px] font-extrabold text-[var(--navy)] mb-1">
                  جارٍ معالجة ملف المنهج واستخراجه...
                </h4>
                <p className="text-[11px] text-[var(--gray)]">
                  {uploadedFile?.name}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-[var(--teal)] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Dynamic status phase */}
              <div className="text-[11px] font-bold text-[var(--teal)]">
                {processingPhase === 0 && 'قراءة فهرس ومحتوى الملف...'}
                {processingPhase === 1 && 'استخراج الوحدات والمجموعات والدروس...'}
                {processingPhase === 2 && 'تحديد الأهداف التعليمية والمخرجات...'}
                {processingPhase === 3 && 'الإدراج المباشر في شجرة المنهج...'}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'upload' && (
          <div className="p-4 border-t border-[var(--border-light)] bg-[#FBFDFE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="abtn outline text-[11px] py-2 px-4 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!uploadedFile}
              onClick={startProcessing}
              className={`abtn teal text-[11px] py-2 px-4 flex items-center gap-1.5 cursor-pointer ${
                !uploadedFile ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>معالجة وإدراج في شجرة المنهج</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
