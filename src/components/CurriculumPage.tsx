import React, { useState, useRef, useEffect } from 'react';
import {
  Folder,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Eye,
  Video,
  FileText,
  AlertTriangle,
  Layers,
  BookOpen,
  Play,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
  Film,
  Sparkles,
} from 'lucide-react';
import { AiCurriculumModal } from './AiCurriculumModal';

export type PublishStatus = 'published' | 'draft';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface LessonItem {
  id: string;
  title: string;
  contentType?: 'video' | 'file';
  status: PublishStatus;
  difficulty: DifficultyLevel;
  goals: string[];
  videoName?: string;
  videoSize?: string;
  videoDuration?: string;
  fileName?: string;
  fileSize?: string;
}

export interface LessonGroup {
  id: string;
  title: string;
  titleEn?: string;
  lessons: LessonItem[];
}

export interface UnitItem {
  id: string;
  title: string;
  titleEn?: string;
  order?: number;
  status: PublishStatus;
  groups: LessonGroup[];
  isExpanded?: boolean;
}

interface CurriculumScope {
  country: string;
  grade: string;
  subject: string;
}

interface CurriculumPageProps {
  onSubScreenChange?: (isSub: boolean, title?: string) => void;
  onBackRequest?: (fn: () => void) => void;
}

export const CurriculumPage: React.FC<CurriculumPageProps> = () => {
  // نطاق المنهج المعروض (Scope filter)
  const [scope, setScope] = useState<CurriculumScope>({
    country: 'SA',
    grade: 'grade_6',
    subject: 'science', // مادة العلوم فارغة تماماً لعرض وتجربة تصميم المواد الحديثة عديمة البيانات
  });

  // Country options
  const countries = [
    { code: 'SA', name: 'SA السعودية' },
    { code: 'EG', name: 'EG مصر' },
    { code: 'AE', name: 'AE الإمارات' },
    { code: 'JO', name: 'JO الأردن' },
  ];

  // Grades list
  const grades = [
    { id: 'grade_4', name: 'الرابع الابتدائي' },
    { id: 'grade_5', name: 'الخامس الابتدائي' },
    { id: 'grade_6', name: 'السادس الابتدائي' },
    { id: 'grade_7', name: 'الأول المتوسط' },
    { id: 'grade_8', name: 'الثاني المتوسط' },
  ];

  // Subjects list
  const subjects = [
    { id: 'math', name: 'رياضيات' },
    { id: 'science', name: 'العلوم' },
    { id: 'arabic', name: 'لغة عربية' },
    { id: 'english', name: 'لغة إنجليزية' },
    { id: 'islamic', name: 'الدراسات الإسلامية' },
  ];

  // بيانات المناهج مفصلة حسب المادة (مادة العلوم فارغة تماماً لعرض تصميم المواد الحديثة عديمة البيانات)
  const [curriculumData, setCurriculumData] = useState<Record<string, UnitItem[]>>({
    science: [], // مادة حديثة عديمة البيانات تماماً
    math: [
      {
        id: 'u-1',
        title: 'الوحدة الأولى: الأعداد والعمليات',
        status: 'published',
        isExpanded: true,
        groups: [
          {
            id: 'g-1',
            title: 'الجمع والطرح',
            lessons: [
              {
                id: 'l-1',
                title: 'مقدمة في الجمع',
                contentType: 'video',
                status: 'published',
                difficulty: 'easy',
                goals: ['يفهم الطالب مفهوم الجمع', 'يطبق الجمع على أعداد من رقمين'],
                videoName: 'intro_to_addition_hd.mp4',
                videoSize: '42.6 MB',
                videoDuration: '08:45',
              },
              {
                id: 'l-2',
                title: 'الطرح بالاستلاف',
                contentType: 'file',
                status: 'draft',
                difficulty: 'medium',
                goals: ['إتقان الاستلاف من خانة العشرات', 'حل مسائل كلامية في الطرح'],
                fileName: 'subtraction_worksheet.pdf',
                fileSize: '3.8 MB',
              },
            ],
          },
          {
            id: 'g-2',
            title: 'الضرب والقسمة',
            lessons: [
              {
                id: 'l-3',
                title: 'جدول الضرب حتى 12',
                status: 'published',
                difficulty: 'medium',
                goals: ['حفظ جدول الضرب من 1 إلى 12', 'تطبيق الضرب التبادلي السريع'],
                videoName: 'multiplication_tables.mp4',
                videoSize: '68.1 MB',
                videoDuration: '14:20',
              },
            ],
          },
        ],
      },
      {
        id: 'u-2',
        title: 'الوحدة الثانية: الهندسة',
        status: 'draft',
        isExpanded: false,
        groups: [
          {
            id: 'g-3',
            title: 'المضلعات والمثلثات',
            lessons: [
              {
                id: 'l-4',
                title: 'أنواع المثلثات وخصائصها',
                status: 'draft',
                difficulty: 'medium',
                goals: ['التمييز بين أنواع المثلثات حسب الأضلاع والزوايا'],
              },
            ],
          },
        ],
      },
    ],
    arabic: [],
    english: [],
    islamic: [],
  });

  const units = curriculumData[scope.subject] || [];

  const setUnits = (updater: UnitItem[] | ((prev: UnitItem[]) => UnitItem[])) => {
    setCurriculumData((prevAll) => {
      const currentList = prevAll[scope.subject] || [];
      const updatedList = typeof updater === 'function' ? updater(currentList) : updater;
      return {
        ...prevAll,
        [scope.subject]: updatedList,
      };
    });
  };

  const currentSubject = subjects.find((s) => s.id === scope.subject);
  const currentGrade = grades.find((g) => g.id === scope.grade);
  const currentCountry = countries.find((c) => c.code === scope.country);

  // الدرس النشط حالياً للمعاينة والتعديل
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  // Find active items
  const activeUnit = units.find((u) => u.id === selectedUnitId) || units[0];
  const activeGroup = activeUnit?.groups?.find((g) => g.id === selectedGroupId) || activeUnit?.groups?.[0];
  const activeLesson = activeGroup?.lessons?.find((l) => l.id === selectedLessonId) || activeGroup?.lessons?.[0];

  // الحقول التفاعلية في المحرر
  const [lessonTitle, setLessonTitle] = useState<string>(activeLesson?.title || '');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(activeLesson?.difficulty || 'easy');
  const [goals, setGoals] = useState<string[]>(activeLesson?.goals || []);
  const [newGoalInput, setNewGoalInput] = useState<string>('');
  const [isAddingGoal, setIsAddingGoal] = useState<boolean>(false);
  const [status, setStatus] = useState<PublishStatus>(activeLesson?.status || 'published');
  const [lessonContentType, setLessonContentType] = useState<'video' | 'file'>(activeLesson?.contentType || 'video');
  const [videoFile, setVideoFile] = useState<{ name: string; size: string } | null>(
    activeLesson?.contentType === 'file'
      ? (activeLesson?.fileName ? { name: activeLesson.fileName, size: activeLesson.fileSize || '3.8 MB' } : null)
      : (activeLesson?.videoName ? { name: activeLesson.videoName, size: activeLesson.videoSize || '42 MB' } : null)
  );

  // تحديث الحقول عندما يتغير الدرس النشط أو تتغير المادة
  useEffect(() => {
    if (activeLesson) {
      setLessonTitle(activeLesson.title);
      setDifficulty(activeLesson.difficulty);
      setGoals(activeLesson.goals || []);
      setStatus(activeLesson.status);
      const currentType = activeLesson.contentType || 'video';
      setLessonContentType(currentType);
      if (currentType === 'file') {
        setVideoFile(
          activeLesson.fileName
            ? { name: activeLesson.fileName, size: activeLesson.fileSize || '3.8 MB' }
            : null
        );
      } else {
        setVideoFile(
          activeLesson.videoName
            ? { name: activeLesson.videoName, size: activeLesson.videoSize || '42 MB' }
            : null
        );
      }
      setIsAddingGoal(false);
      setVideoUploadError(null);
    } else {
      setLessonTitle('');
      setGoals([]);
      setVideoFile(null);
    }
  }, [activeLesson?.id, scope.subject]);

  // تبديل المادة وتحديث التحديد
  const handleSubjectChange = (newSubject: string) => {
    setScope((prev) => ({ ...prev, subject: newSubject }));
    const subjectUnits = curriculumData[newSubject] || [];
    if (subjectUnits.length > 0) {
      const firstUnit = subjectUnits[0];
      const firstGroup = firstUnit?.groups?.[0];
      const firstLesson = firstGroup?.lessons?.[0];
      setSelectedUnitId(firstUnit?.id || '');
      setSelectedGroupId(firstGroup?.id || '');
      setSelectedLessonId(firstLesson?.id || '');
    } else {
      setSelectedUnitId('');
      setSelectedGroupId('');
      setSelectedLessonId('');
    }
  };

  // Sync state when selected lesson changes
  const handleSelectLesson = (unitId: string, groupId: string, lesson: LessonItem) => {
    setSelectedUnitId(unitId);
    setSelectedGroupId(groupId);
    setSelectedLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setDifficulty(lesson.difficulty);
    setGoals(lesson.goals || []);
    setStatus(lesson.status);
    const currentType = lesson.contentType || 'video';
    setLessonContentType(currentType);
    if (currentType === 'file') {
      setVideoFile(lesson.fileName ? { name: lesson.fileName, size: lesson.fileSize || '3.8 MB' } : null);
    } else {
      setVideoFile(lesson.videoName ? { name: lesson.videoName, size: lesson.videoSize || '42 MB' } : null);
    }
    setIsAddingGoal(false);
    setVideoUploadError(null);
  };

  // Toggle unit collapse/expand
  const toggleUnitExpand = (unitId: string) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, isExpanded: !u.isExpanded } : u))
    );
  };

  // File upload simulation with format check and drag-and-drop
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState<boolean>(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);

  const handleContentTypeChange = (newType: 'video' | 'file') => {
    setLessonContentType(newType);
    setVideoUploadError(null);
    updateCurrentLesson({ contentType: newType });
    if (videoFile) {
      const isMp4 = videoFile.name.toLowerCase().endsWith('.mp4');
      if (newType === 'video' && !isMp4) {
        setVideoFile(null);
      } else if (newType === 'file' && isMp4) {
        setVideoFile(null);
      }
    }
  };

  const processVideoFile = (file: File) => {
    setVideoUploadError(null);

    if (lessonContentType === 'video') {
      // التحقق من صيغة الفيديو MP4 فقط
      const isMp4 = file.name.toLowerCase().endsWith('.mp4') || file.type === 'video/mp4';
      if (!isMp4) {
        setVideoUploadError('تنبيه: صيغة الملف غير مدعومة للفيديو. يرجى اختيار ملف بصيغة MP4 فقط.');
        return;
      }
      // الحد الأقصى لحجم الفيديو: 200MB
      const maxBytes = 200 * 1024 * 1024;
      if (file.size > maxBytes) {
        setVideoUploadError('تنبيه: حجم الفيديو يتجاوز الحد الأقصى المسموح به (200MB). يرجى اختيار ملف أصغر.');
        return;
      }
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const newFileObj = { name: file.name, size: `${sizeMb} MB` };
      setVideoFile(newFileObj);
      updateCurrentLesson({
        contentType: 'video',
        videoName: file.name,
        videoSize: `${sizeMb} MB`,
        videoDuration: activeLesson?.videoDuration || '09:20',
        fileName: undefined,
        fileSize: undefined,
      });
    } else {
      // التحقق من صيغة المستند والملفات
      const allowedExts = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt'];
      const fileExt = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
      if (!allowedExts.includes(fileExt)) {
        setVideoUploadError('تنبيه: صيغة الملف غير مدعومة. الصيغ المسموحة للملفات: PDF, DOC, DOCX, PPT, PPTX.');
        return;
      }
      // الحد الأقصى لحجم المستندات: 50MB
      const maxDocBytes = 50 * 1024 * 1024;
      if (file.size > maxDocBytes) {
        setVideoUploadError('تنبيه: حجم الملف يتجاوز الحد الأقصى المسموح به (50MB). يرجى اختيار ملف أصغر.');
        return;
      }
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const newFileObj = { name: file.name, size: `${sizeMb} MB` };
      setVideoFile(newFileObj);
      updateCurrentLesson({
        contentType: 'file',
        fileName: file.name,
        fileSize: `${sizeMb} MB`,
        videoName: undefined,
        videoSize: undefined,
        videoDuration: undefined,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleDeleteVideo = () => {
    setVideoFile(null);
    setVideoUploadError(null);
    updateCurrentLesson({
      videoName: undefined,
      videoSize: undefined,
      videoDuration: undefined,
      fileName: undefined,
      fileSize: undefined,
    });
  };

  // Helper to update current lesson in units state
  const updateCurrentLesson = (partial: Partial<LessonItem>) => {
    setUnits((prevUnits) =>
      prevUnits.map((u) => {
        if (u.id !== selectedUnitId) return u;
        return {
          ...u,
          groups: u.groups.map((g) => {
            if (g.id !== selectedGroupId) return g;
            return {
              ...g,
              lessons: g.lessons.map((l) => {
                if (l.id !== selectedLessonId) return l;
                return { ...l, ...partial };
              }),
            };
          }),
        };
      })
    );
  };

  // Update title
  const handleTitleChange = (newTitle: string) => {
    setLessonTitle(newTitle);
    updateCurrentLesson({ title: newTitle });
  };

  // Update difficulty
  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    updateCurrentLesson({ difficulty: diff });
  };

  // Toggle publish / unpublish
  const handleTogglePublish = () => {
    const newStatus: PublishStatus = status === 'published' ? 'draft' : 'published';
    setStatus(newStatus);
    updateCurrentLesson({ status: newStatus });
  };

  // حفظ كمسودة: يحفظ التعديلات المدخلة كمسودة دون المساس بحالة النشر إطلاقاً
  const [saveDraftFeedback, setSaveDraftFeedback] = useState<boolean>(false);
  const handleSaveDraft = () => {
    updateCurrentLesson({
      title: lessonTitle,
      difficulty,
      goals,
      videoName: videoFile ? videoFile.name : undefined,
      videoSize: videoFile ? videoFile.size : undefined,
    });
    setSaveDraftFeedback(true);
    setTimeout(() => {
      setSaveDraftFeedback(false);
    }, 2000);
  };

  // Goals management
  const handleAddGoal = () => {
    if (!newGoalInput.trim()) return;
    const updatedGoals = [...goals, newGoalInput.trim()];
    setGoals(updatedGoals);
    updateCurrentLesson({ goals: updatedGoals });
    setNewGoalInput('');
    setIsAddingGoal(false);
  };

  const handleRemoveGoal = (index: number) => {
    const updatedGoals = goals.filter((_, idx) => idx !== index);
    setGoals(updatedGoals);
    updateCurrentLesson({ goals: updatedGoals });
  };

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'lesson' | 'unit' | 'group' | 'attachment'; id: string; name: string } | null>(null);

  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState<boolean>(false);
  const [newUnitTitle, setNewUnitTitle] = useState<string>('');
  const [newUnitTitleEn, setNewUnitTitleEn] = useState<string>('');
  const [newUnitOrder, setNewUnitOrder] = useState<string>('1');

  const openAddUnitModal = () => {
    setNewUnitTitle('');
    setNewUnitTitleEn('');
    setNewUnitOrder((units.length + 1).toString());
    setIsAddUnitModalOpen(true);
  };

  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState<boolean>(false);
  const [groupParentUnitId, setGroupParentUnitId] = useState<string>('u-1');
  const [newGroupTitle, setNewGroupTitle] = useState<string>('');
  const [newGroupTitleEn, setNewGroupTitleEn] = useState<string>('');

  const openAddGroupModal = (unitId: string) => {
    setGroupParentUnitId(unitId);
    setNewGroupTitle('');
    setNewGroupTitleEn('');
    setIsAddGroupModalOpen(true);
  };

  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState<boolean>(false);
  const [lessonParentUnitId, setLessonParentUnitId] = useState<string>('u-1');
  const [lessonParentGroupId, setLessonParentGroupId] = useState<string>('g-1');
  const [newLessonTitle, setNewLessonTitle] = useState<string>('');
  const [newLessonContentType, setNewLessonContentType] = useState<'video' | 'file'>('video');

  const openAddLessonModal = (unitId: string, groupId: string) => {
    setLessonParentUnitId(unitId);
    setLessonParentGroupId(groupId);
    setNewLessonTitle('');
    setNewLessonContentType('video');
    setIsAddLessonModalOpen(true);
  };

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isAiCurriculumModalOpen, setIsAiCurriculumModalOpen] = useState<boolean>(false);

  // Apply AI Generated Curriculum
  const handleApplyAiCurriculum = (newUnits: UnitItem[]) => {
    setUnits(newUnits);
    if (newUnits.length > 0 && newUnits[0].groups.length > 0 && newUnits[0].groups[0].lessons.length > 0) {
      handleSelectLesson(newUnits[0].id, newUnits[0].groups[0].id, newUnits[0].groups[0].lessons[0]);
    }
  };

  // Edit Unit title modal
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState<boolean>(false);
  const [editingUnitId, setEditingUnitId] = useState<string>('');
  const [editingUnitTitle, setEditingUnitTitle] = useState<string>('');

  // Delete Action Confirm
  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'lesson') {
      setUnits((prev) =>
        prev.map((u) => ({
          ...u,
          groups: u.groups.map((g) => ({
            ...g,
            lessons: g.lessons.filter((l) => l.id !== deleteTarget.id),
          })),
        }))
      );
      // Select another lesson if available
      const remainingUnit = units[0];
      const remainingGroup = remainingUnit?.groups[0];
      const remainingLesson = remainingGroup?.lessons.find((l) => l.id !== deleteTarget.id);
      if (remainingLesson) {
        handleSelectLesson(remainingUnit.id, remainingGroup.id, remainingLesson);
      }
    } else if (deleteTarget.type === 'unit') {
      setUnits((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'group') {
      setUnits((prev) =>
        prev.map((u) => ({
          ...u,
          groups: u.groups.filter((g) => g.id !== deleteTarget.id),
        }))
      );
    } else if (deleteTarget.type === 'attachment') {
      handleDeleteVideo();
    }
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // Add Unit
  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitTitle.trim()) return;
    const newUnit: UnitItem = {
      id: `u-${Date.now()}`,
      title: newUnitTitle.trim(),
      titleEn: newUnitTitleEn.trim() || undefined,
      order: parseInt(newUnitOrder, 10) || (units.length + 1),
      status: 'draft',
      isExpanded: true,
      groups: [],
    };
    setUnits((prev) => [...prev, newUnit]);
    setNewUnitTitle('');
    setNewUnitTitleEn('');
    setNewUnitOrder('');
    setIsAddUnitModalOpen(false);
  };

  // Add Group
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;
    const newGrp: LessonGroup = {
      id: `g-${Date.now()}`,
      title: newGroupTitle.trim(),
      titleEn: newGroupTitleEn.trim() || undefined,
      lessons: [],
    };
    setUnits((prev) =>
      prev.map((u) => (u.id === groupParentUnitId ? { ...u, groups: [...u.groups, newGrp] } : u))
    );
    setNewGroupTitle('');
    setNewGroupTitleEn('');
    setIsAddGroupModalOpen(false);
  };

  // Add Lesson
  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;
    const newLsn: LessonItem = {
      id: `l-${Date.now()}`,
      title: newLessonTitle.trim(),
      contentType: newLessonContentType,
      status: 'draft',
      difficulty: 'easy',
      goals: ['فهم أساسيات ' + newLessonTitle.trim()],
      videoName: newLessonContentType === 'video' ? 'video_intro.mp4' : undefined,
      videoSize: newLessonContentType === 'video' ? '120 MB' : undefined,
      videoDuration: newLessonContentType === 'video' ? '08:30' : undefined,
      fileName: newLessonContentType === 'file' ? 'lesson_document.pdf' : undefined,
      fileSize: newLessonContentType === 'file' ? '2.5 MB' : undefined,
    };
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== lessonParentUnitId) return u;
        return {
          ...u,
          groups: u.groups.map((g) => {
            if (g.id !== lessonParentGroupId) return g;
            return {
              ...g,
              lessons: [...g.lessons, newLsn],
            };
          }),
        };
      })
    );
    // Switch to the newly created lesson
    handleSelectLesson(lessonParentUnitId, lessonParentGroupId, newLsn);
    setNewLessonTitle('');
    setNewLessonContentType('video');
    setIsAddLessonModalOpen(false);
  };

  // Save Unit title update
  const handleSaveUnitTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnitTitle.trim()) return;
    setUnits((prev) =>
      prev.map((u) => (u.id === editingUnitId ? { ...u, title: editingUnitTitle.trim() } : u))
    );
    setIsEditUnitModalOpen(false);
  };

  // Country name display helper
  const selectedCountryName = countries.find((c) => c.code === scope.country)?.name || scope.country;
  const selectedGradeName = grades.find((g) => g.id === scope.grade)?.name || scope.grade;
  const selectedSubjectName = subjects.find((s) => s.id === scope.subject)?.name || scope.subject;

  return (
    <div className="space-y-4" dir="rtl">
      {/* 1. نطاق المنهج المعروض (Scope Filter Panel) */}
      <div className="admin-panel shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div>
            <h3 className="text-[13.5px] font-extrabold text-[var(--navy)] m-0">نطاق المنهج المعروض</h3>
            <p className="text-[11px] text-[var(--gray)] m-0 leading-relaxed">
              اختر الدولة ثم الصف ثم المادة لعرض شجرة المنهج الخاصة بها — كل مستوى يُصفّي خيارات المستوى التالي.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAiCurriculumModalOpen(true)}
            className="abtn teal text-[11px] py-1.5 px-3.5 inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs shrink-0"
            title="توليد وهيكلة المنهج بالذكاء الاصطناعي من ملف"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>مساعد المنهج الذكي AI</span>
          </button>
        </div>

        {/* Filter Bar with chevrons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center bg-[#FAFBFC] p-2.5 rounded-xl border border-[var(--border-light)]">
          {/* 1. الدولة */}
          <div className="flex items-center gap-2">
            <select
              className="admin-select text-[11.5px] font-bold bg-white text-[var(--navy)] cursor-pointer"
              value={scope.country}
              onChange={(e) => setScope((prev) => ({ ...prev, country: e.target.value }))}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronLeft className="w-4 h-4 text-[var(--mid)] shrink-0 hidden md:block" />
          </div>

          {/* 2. الصف الدراسي */}
          <div className="flex items-center gap-2">
            <select
              className="admin-select text-[11.5px] font-bold bg-white text-[var(--navy)] cursor-pointer"
              value={scope.grade}
              onChange={(e) => setScope((prev) => ({ ...prev, grade: e.target.value }))}
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <ChevronLeft className="w-4 h-4 text-[var(--mid)] shrink-0 hidden md:block" />
          </div>

          {/* 3. المادة الدراسية */}
          <div>
            <select
              className="admin-select text-[11.5px] font-bold bg-white text-[var(--navy)] cursor-pointer"
              value={scope.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. الهيكل الرئيسي: شجرة المنهج + محرر الدرس */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* شجرة المنهج (Curriculum Tree) */}
        <div className="w-full lg:w-[360px] shrink-0">
          <div className="admin-panel shadow-xs p-4">
            {/* عنوان الشجرة وزر إضافة وحدة */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-light)]">
              <h3 className="text-[13.5px] font-extrabold text-[var(--navy)] m-0">شجرة المنهج</h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="abtn outline text-[10.5px] py-1.5 px-2.5 flex items-center gap-1 text-[var(--teal)] border-[var(--teal)]/40 hover:bg-[#E3F7F4] cursor-pointer"
                  onClick={() => setIsAiCurriculumModalOpen(true)}
                  title="توليد وهيكلة المنهج بالذكاء الاصطناعي من ملف"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--teal)]" />
                  <span>توليد AI</span>
                </button>
                <button
                  type="button"
                  className="abtn teal text-[10.5px] py-1.5 px-2.5"
                  onClick={openAddUnitModal}
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة وحدة
                </button>
              </div>
            </div>

            {/* قائمة الوحدات والمجموعات والدروس */}
            {units.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--border-light)] bg-[#FAFCFD] p-6 text-center flex flex-col items-center justify-center min-h-[220px]">
                <div className="w-11 h-11 rounded-full bg-[#E6F6F4] text-[var(--teal)] flex items-center justify-center mb-2.5">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-[12.5px] font-extrabold text-[var(--navy)] mb-1">
                  لا توجد وحدات بعد
                </h4>
                <p className="text-[11px] text-[var(--gray)] leading-relaxed max-w-[240px] mb-4">
                  مادة {currentSubject?.name || 'العلوم'} لا تزال جديدة ولا تحتوي على أي وحدات أو دروس في هذا الصف.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="abtn teal text-[11px] py-1.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer"
                    onClick={() => setIsAiCurriculumModalOpen(true)}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد المنهج بالـ AI</span>
                  </button>
                  <button
                    type="button"
                    className="abtn outline text-[11px] py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                    onClick={openAddUnitModal}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة يدوية</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {units.map((unit) => {
                const isSelectedUnit = unit.id === selectedUnitId;
                return (
                  <div
                    key={unit.id}
                    className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden"
                  >
                    {/* رأس الوحدة */}
                    <div className="flex items-center justify-between p-2.5 bg-[#FBFDFE] hover:bg-[#F6F8FB] transition-colors">
                      <div
                        className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                        onClick={() => toggleUnitExpand(unit.id)}
                      >
                        <Folder className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                        <span className="text-[11.8px] font-bold text-[var(--navy)] truncate">
                          {unit.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* حالة الوحدة */}
                        <span
                          className={`badge-pill ${unit.status === 'published' ? 'on' : 'draft'}`}
                          style={{ fontSize: '9px', padding: '2px 7px' }}
                        >
                          {unit.status === 'published' ? 'منشور' : 'مسودة'}
                        </span>

                        {/* تعديل عنوان الوحدة */}
                        <button
                          type="button"
                          title="تعديل الوحدة"
                          onClick={() => {
                            setEditingUnitId(unit.id);
                            setEditingUnitTitle(unit.title);
                            setIsEditUnitModalOpen(true);
                          }}
                          className="abtn-icon"
                          style={{ width: '22px', height: '22px' }}
                        >
                          <Edit2 className="w-3 h-3 text-[var(--gray)]" />
                        </button>

                        {/* حذف الوحدة */}
                        <button
                          type="button"
                          title="حذف الوحدة"
                          onClick={() => {
                            setDeleteTarget({
                              type: 'unit',
                              id: unit.id,
                              name: unit.title,
                            });
                            setIsDeleteModalOpen(true);
                          }}
                          className="abtn-icon"
                          style={{ width: '22px', height: '22px' }}
                        >
                          <Trash2 className="w-3 h-3 text-[var(--coral)]" />
                        </button>

                        {/* سهم الطي والفرد */}
                        <button
                          type="button"
                          onClick={() => toggleUnitExpand(unit.id)}
                          className="abtn-icon"
                          style={{ width: '22px', height: '22px' }}
                        >
                          {unit.isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[var(--gray)]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--gray)]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* محتوى الوحدة القابل للطي */}
                    {unit.isExpanded && (
                      <div className="p-3 pt-1 border-t border-[var(--border-light)] bg-white space-y-3">
                        {unit.groups.length === 0 ? (
                          <div className="text-center py-2 text-[10px] text-[var(--gray)]">
                            لا توجد مجموعات دروس في هذه الوحدة
                          </div>
                        ) : (
                          unit.groups.map((grp) => (
                            <div key={grp.id} className="space-y-1.5">
                              {/* عنوان المجموعة */}
                              <div className="flex items-center justify-between px-1 text-[11px] font-extrabold text-[var(--navy)]">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span>{grp.title}</span>
                                  {grp.titleEn && (
                                    <span className="text-[9.5px] font-normal text-[var(--gray)] font-latin">
                                      ({grp.titleEn})
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  title="حذف المجموعة"
                                  onClick={() => {
                                    setDeleteTarget({
                                      type: 'group',
                                      id: grp.id,
                                      name: grp.title,
                                    });
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="text-[9.5px] text-[var(--coral)] hover:underline cursor-pointer"
                                >
                                  حذف
                                </button>
                              </div>

                              {/* قائمة دروس المجموعة */}
                              <div className="space-y-1">
                                {grp.lessons.map((lsn) => {
                                  const isActive = selectedLessonId === lsn.id;
                                  return (
                                    <div
                                      key={lsn.id}
                                      onClick={() => handleSelectLesson(unit.id, grp.id, lsn)}
                                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                                        isActive
                                          ? 'bg-[#EAFBF9] border border-[var(--teal)]/40 text-[var(--teal)] font-bold shadow-xs'
                                          : 'bg-[#FAFBFD] hover:bg-[#F1F3F5] text-[var(--navy)] font-medium border border-transparent'
                                      }`}
                                    >
                                      {/* اليمين: الأيقونة والعنوان */}
                                      <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                                        <span className="text-[13px]">
                                          {lsn.contentType === 'file' ? '📄' : '📹'}
                                        </span>
                                        <span className="text-[11px] truncate">{lsn.title}</span>
                                      </div>

                                      {/* اليسار: شارة الحالة وزر الحذف */}
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span
                                          className={`badge-pill ${lsn.status === 'published' ? 'on' : 'draft'}`}
                                          style={{ fontSize: '8.5px', padding: '1.5px 6px' }}
                                        >
                                          {lsn.status === 'published' ? 'منشور' : 'مسودة'}
                                        </span>

                                        <button
                                          type="button"
                                          title="حذف الدرس"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteTarget({
                                              type: 'lesson',
                                              id: lsn.id,
                                              name: lsn.title,
                                            });
                                            setIsDeleteModalOpen(true);
                                          }}
                                          className="abtn-icon"
                                          style={{ width: '22px', height: '22px' }}
                                        >
                                          <Trash2 className="w-3 h-3 text-[var(--coral)]" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* زر إضافة درس بالمجموعة */}
                                <button
                                  type="button"
                                  onClick={() => openAddLessonModal(unit.id, grp.id)}
                                  className="abtn outline w-full justify-center text-[10px] py-1 border-dashed mt-1 hover:border-[var(--teal)]"
                                >
                                  <Plus className="w-3 h-3" />
                                  إضافة درس
                                </button>
                              </div>
                            </div>
                          ))
                        )}

                        {/* زر إضافة مجموعة جديدة بالوحدة */}
                        <button
                          type="button"
                          onClick={() => openAddGroupModal(unit.id)}
                          className="abtn outline w-full justify-center text-[10.5px] py-1.5 mt-2 bg-[#FAFBFD] hover:bg-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          إضافة مجموعة جديدة
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>

        {/* تفاصيل ومحرر الدرس */}
        <div className="w-full lg:flex-1 min-w-0">
          {activeLesson ? (
            <div className="admin-panel shadow-xs p-5">
              {/* مسار الدرس (Breadcrumb داخلي) */}
              <div className="text-[10px] text-[var(--gray)] font-medium mb-3 flex items-center gap-1.5 flex-wrap">
                <span>{activeUnit?.title || 'الوحدة'}</span>
                <span>/</span>
                <span>{activeGroup?.title || 'المجموعة'}</span>
                <span>/</span>
                <span className="font-bold text-[var(--navy)]">{lessonTitle}</span>
              </div>

              {/* رأس المحرر والإجراءات */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--border-light)]">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[15px] font-extrabold text-[var(--navy)] m-0 flex items-center gap-2">
                    <span>{lessonTitle}</span>
                    <span className="text-[14px]">
                      {activeLesson.contentType === 'file' ? '📄' : '📹'}
                    </span>
                  </h2>
                  <span
                    className={`badge-pill ${status === 'published' ? 'on' : 'draft'}`}
                    style={{ fontSize: '9.5px', padding: '3px 10px' }}
                  >
                    {status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </div>

                {/* أزرار الإجراءات العلوية */}
                <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                  <button
                    type="button"
                    className="abtn outline text-[11px] py-1.5 px-3"
                    onClick={() => setIsPreviewModalOpen(true)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    معاينة
                  </button>

                  <button
                    type="button"
                    className="abtn outline text-[11px] py-1.5 px-3 min-w-[85px] justify-center"
                    onClick={handleSaveDraft}
                  >
                    {saveDraftFeedback ? (
                      <span className="flex items-center gap-1 text-[var(--teal)] font-bold">
                        <Check className="w-3.5 h-3.5" />
                        تم الحفظ
                      </span>
                    ) : (
                      'حفظ كمسودة'
                    )}
                  </button>

                  {status === 'published' ? (
                    <button
                      type="button"
                      className="abtn coral text-[11px] py-1.5 px-3"
                      onClick={handleTogglePublish}
                    >
                      إلغاء النشر
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="abtn teal text-[11px] py-1.5 px-3"
                      onClick={handleTogglePublish}
                    >
                      <Check className="w-3.5 h-3.5" />
                      نشر الدرس
                    </button>
                  )}
                </div>
              </div>

              {/* حقول التعديل */}
              <div className="space-y-4">
                {/* 1. عنوان الدرس */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
                    عنوان الدرس <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input text-[11.5px]"
                    value={lessonTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="أدخل عنوان الدرس..."
                  />
                </div>

                {/* 2. الأهداف التعليمية */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
                    الأهداف التعليمية
                  </label>
                  <div className="flex items-center gap-2 flex-wrap min-h-[38px] p-2 rounded-lg bg-[#FAFBFC] border border-[var(--border-light)]">
                    {goals.map((goal, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-[#EAF1F8] text-[var(--navy)] text-[10.8px] font-medium px-2.5 py-1 rounded-full"
                      >
                        <span>{goal}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGoal(idx)}
                          className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-[var(--coral)] hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}

                    {isAddingGoal ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          className="admin-input text-[10.5px] py-1 px-2 w-[190px] h-[28px]"
                          value={newGoalInput}
                          autoFocus
                          onChange={(e) => setNewGoalInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddGoal();
                            }
                            if (e.key === 'Escape') {
                              setIsAddingGoal(false);
                            }
                          }}
                          placeholder="اكتب الهدف واضغط Enter..."
                        />
                        <button
                          type="button"
                          onClick={handleAddGoal}
                          className="abtn teal text-[10px] py-1 px-2 h-[28px]"
                        >
                          إضافة
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingGoal(false)}
                          className="abtn outline text-[10px] py-1 px-1.5 h-[28px]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingGoal(true)}
                        className="inline-flex items-center gap-1 border border-dashed border-[var(--teal)] text-[var(--teal)] hover:bg-[#E3F7F4] text-[10.5px] font-bold px-3 py-1 rounded-full cursor-pointer transition-colors bg-white"
                      >
                        <Plus className="w-3 h-3" />
                        إضافة هدف
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. نوع المحتوى */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
                    نوع المحتوى <span className="text-[var(--coral)]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleContentTypeChange('video')}
                      className={`py-2 px-3 rounded-lg text-[11.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        lessonContentType === 'video'
                          ? 'bg-[var(--teal)] text-white shadow-xs'
                          : 'bg-white border border-[var(--border-mid)] text-[var(--navy)] hover:bg-[#F6F8FB]'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>فيديو (MP4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentTypeChange('file')}
                      className={`py-2 px-3 rounded-lg text-[11.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        lessonContentType === 'file'
                          ? 'bg-[var(--teal)] text-white shadow-xs'
                          : 'bg-white border border-[var(--border-mid)] text-[var(--navy)] hover:bg-[#F6F8FB]'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>ملف (PDF / مستندات)</span>
                    </button>
                  </div>
                </div>

                {/* 4. مستوى الصعوبة */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5">
                    مستوى الصعوبة <span className="text-[var(--coral)]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDifficultyChange('easy')}
                      className={`py-2 px-3 rounded-lg text-[11.5px] font-bold text-center transition-all cursor-pointer ${
                        difficulty === 'easy'
                          ? 'bg-[var(--teal)] text-white shadow-xs'
                          : 'bg-white border border-[var(--border-mid)] text-[var(--navy)] hover:bg-[#F6F8FB]'
                      }`}
                    >
                      سهل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDifficultyChange('medium')}
                      className={`py-2 px-3 rounded-lg text-[11.5px] font-bold text-center transition-all cursor-pointer ${
                        difficulty === 'medium'
                          ? 'bg-[var(--teal)] text-white shadow-xs'
                          : 'bg-white border border-[var(--border-mid)] text-[var(--navy)] hover:bg-[#F6F8FB]'
                      }`}
                    >
                      متوسط
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDifficultyChange('hard')}
                      className={`py-2 px-3 rounded-lg text-[11.5px] font-bold text-center transition-all cursor-pointer ${
                        difficulty === 'hard'
                          ? 'bg-[var(--teal)] text-white shadow-xs'
                          : 'bg-white border border-[var(--border-mid)] text-[var(--navy)] hover:bg-[#F6F8FB]'
                      }`}
                    >
                      صعب
                    </button>
                  </div>
                </div>

                {/* 5. رفع وسائط / ملف الدرس حسب نوع المحتوى المختار */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-[var(--navy)]">
                      {lessonContentType === 'file'
                        ? 'رفع ملف الدرس (PDF, DOCX, PPTX، حتى 50MB)'
                        : 'رفع فيديو الدرس (MP4، حتى 200MB)'}
                    </label>
                    {videoFile ? (
                      <span className="text-[10px] text-[var(--teal)] font-bold">
                        {lessonContentType === 'file' ? 'ملف مرفوع' : 'فيديو مرفوع'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#D97706] font-bold">
                        الرفع مطلوب
                      </span>
                    )}
                  </div>

                  {/* Input غير مرئي لرفع الملف بالصيغ المحددة */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={
                      lessonContentType === 'file'
                        ? '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt'
                        : 'video/mp4,.mp4'
                    }
                    className="hidden"
                  />

                  {videoFile ? (
                    /* حالة وجود ملف: شريط بسيط وواضح */
                    <div className="border border-[var(--border-light)] rounded-xl bg-[#FAFBFD] p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-[#E3F7F4] text-[var(--teal)] flex items-center justify-center shrink-0">
                          {lessonContentType === 'file' ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <Video className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0 text-right">
                          <div className="text-[11.5px] font-bold text-[var(--navy)] truncate font-latin">
                            {videoFile.name}
                          </div>
                          <div className="text-[9.5px] text-[var(--gray)] font-latin">
                            {videoFile.size} •{' '}
                            {videoFile.name.split('.').pop()?.toUpperCase() ||
                              (lessonContentType === 'file' ? 'PDF' : 'MP4')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget({
                              type: 'attachment',
                              id: activeLesson?.id || '',
                              name: videoFile?.name || (lessonContentType === 'file' ? 'الملف المرفق' : 'الفيديو المرفق'),
                            });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-[var(--gray)] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-lg transition-colors cursor-pointer"
                          title={lessonContentType === 'file' ? 'حذف الملف' : 'حذف الفيديو'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* حالة عدم وجود ملف: صندوق رفع بسيط ومباشر بالصيغ الخاصة بالنوع المختار */
                    <div>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingVideo(true);
                        }}
                        onDragLeave={() => setIsDraggingVideo(false)}
                        onDrop={handleVideoDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                          isDraggingVideo
                            ? 'border-[var(--teal)] bg-[#E3F7F4]'
                            : 'border-[var(--border-mid)] hover:border-[var(--teal)] bg-[#FAFBFD] hover:bg-[#F3FAF8]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[var(--navy)]">
                          {lessonContentType === 'file' ? (
                            <FileText className="w-4 h-4 text-[var(--teal)]" />
                          ) : (
                            <Upload className="w-4 h-4 text-[var(--teal)]" />
                          )}
                          <span>اسحب الملف هنا أو اضغط للاختيار</span>
                        </div>
                        <div className="text-[9.5px] text-[var(--gray)] mt-1 font-latin">
                          {lessonContentType === 'file'
                            ? 'PDF, DOC, DOCX, PPT, PPTX • حتى 50MB'
                            : 'MP4 • حتى 200MB'}
                        </div>
                      </div>

                      {videoUploadError && (
                        <div className="mt-2 text-[10px] text-[#E53E3E] bg-[#FFF5F5] border border-[#FED7D7] p-2 rounded-lg font-medium text-center">
                          {videoUploadError}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 5. منطقة الخطر / حذف الدرس (Danger Zone) */}
                <div className="rounded-xl bg-[#FFF5F5] border border-[#FED7D7] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-5">
                  <div className="flex flex-col">
                    <span className="text-[11.5px] font-extrabold text-[#E53E3E]">حذف الدرس</span>
                    <span className="text-[10px] text-[#E53E3E]/80">
                      سيتم حذف هذا الدرس وكافة الأسئلة والأنشطة المرتبطة به نهائياً.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteTarget({
                        type: 'lesson',
                        id: activeLesson.id,
                        name: activeLesson.title,
                      });
                      setIsDeleteModalOpen(true);
                    }}
                    className="abtn coral text-[11px] py-1.5 px-3.5 shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف الدرس</span>
                  </button>
                </div>
              </div>
            </div>
          ) : units.length === 0 ? (
            <div className="admin-panel shadow-xs p-6 sm:p-10 text-center flex flex-col items-center justify-center min-h-[500px] bg-white">
              {/* شارة حالة المادة الحديثة */}
              <span className="badge-pill draft mb-3 text-[10.5px] px-3.5 py-1 font-bold">
                مادة حديثة — بانتظار المحتوى الأكاديمي
              </span>

              {/* الأيقونة الرسومية المركزية */}
              <div className="w-16 h-16 rounded-2xl bg-[#E6F6F4] border border-[var(--teal)]/20 text-[var(--teal)] flex items-center justify-center mb-4 shadow-xs">
                <BookOpen className="w-8 h-8" />
              </div>

              {/* العنوان والوصف */}
              <h3 className="text-[16px] font-black text-[var(--navy)] mb-2">
                مادة {currentSubject?.name || 'العلوم'} غير مجهزة بعد
              </h3>
              <p className="text-[12px] text-[var(--gray)] max-w-[490px] leading-relaxed mb-6">
                تمت إضافة مادة {currentSubject?.name || 'العلوم'} حديثاً إلى الخطة الدراسية للصف ({currentGrade?.name || 'السادس الابتدائي'})، ولم يتم إدراج أي وحدات أو دروس أو اختبارات بها حتى الآن. يمكنك البدء الآن في بناء الهيكل الأكاديمي للمادة.
              </p>

              {/* زر الإجراء الأساسي */}
              <button
                type="button"
                onClick={openAddUnitModal}
                className="abtn teal py-2 px-5 text-[12px] flex items-center gap-2 font-bold shadow-xs mb-8"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء الوحدة الأولى للمنهج</span>
              </button>

              {/* دليل الخطوات للمواد الحديثة (3 بطاقات متناسقة) */}
              <div className="w-full max-w-[580px] bg-[#F8FAFC] border border-[var(--border-light)] rounded-xl p-4 text-right">
                <div className="text-[11.5px] font-extrabold text-[var(--navy)] mb-3 pb-2 border-b border-[var(--border-light)] flex items-center justify-between">
                  <span>دليل البدء السريع لتجهيز المادة:</span>
                  <span className="text-[10px] font-bold text-[var(--teal)]">3 خطوات رئيسية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-[var(--border-light)] flex flex-col">
                    <span className="w-5 h-5 rounded-full bg-[#E6F6F4] text-[var(--teal)] text-[10px] font-extrabold flex items-center justify-center mb-1.5 self-start">
                      1
                    </span>
                    <span className="text-[11px] font-bold text-[var(--navy)] mb-1">إنشاء الوحدات</span>
                    <span className="text-[10px] text-[var(--gray)] leading-normal">
                      قسّم منهج {currentSubject?.name || 'العلوم'} إلى وحدات رئيسية (مثلاً: الكائنات الحية، المادة والطاقة).
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[var(--border-light)] flex flex-col">
                    <span className="w-5 h-5 rounded-full bg-[#E6F6F4] text-[var(--teal)] text-[10px] font-extrabold flex items-center justify-center mb-1.5 self-start">
                      2
                    </span>
                    <span className="text-[11px] font-bold text-[var(--navy)] mb-1">تنظيم المجموعات</span>
                    <span className="text-[10px] text-[var(--gray)] leading-normal">
                      أنشئ موضوعات ومجموعات متفرعة داخل كل وحدة لتسلسل الدروس منطقياً.
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[var(--border-light)] flex flex-col">
                    <span className="w-5 h-5 rounded-full bg-[#E6F6F4] text-[var(--teal)] text-[10px] font-extrabold flex items-center justify-center mb-1.5 self-start">
                      3
                    </span>
                    <span className="text-[11px] font-bold text-[var(--navy)] mb-1">إدراج الدروس والاختبارات</span>
                    <span className="text-[10px] text-[var(--gray)] leading-normal">
                      ارفع الفيديوهات التعليمية، حدد نواتج التعلم ومستوى الصعوبة وبنك الأسئلة.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-panel shadow-xs p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[var(--navy)] flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-[var(--gray)]" />
              </div>
              <h4 className="text-[13px] font-extrabold text-[var(--navy)] mb-1">
                لم يتم تحديد أي درس
              </h4>
              <p className="text-[11px] text-[var(--gray)] max-w-[340px] leading-relaxed mb-4">
                اختر درساً من شجرة المنهج على اليمين لعرض وتعديل تفاصيله، أو أضف درساً جديداً إلى المجموعات المتاحة.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. نافذة تأكيد الحذف الموحدة (Compliant with Delete Modal Spec in AGENTS.md) */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3">
          <div className="w-full max-w-[340px] sm:max-w-[360px] p-5 rounded-xl bg-white shadow-xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150">
            {/* Central top trash icon */}
            <div className="w-9 h-9 rounded-full bg-[#FBE4DF] text-[var(--coral)] flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>

            {/* Title */}
            <h4 className="text-[13px] font-extrabold text-[var(--navy)] mb-2">
              {deleteTarget.type === 'lesson' && `حذف الدرس: ${deleteTarget.name}`}
              {deleteTarget.type === 'unit' && `حذف الوحدة: ${deleteTarget.name}`}
              {deleteTarget.type === 'group' && `حذف المجموعة: ${deleteTarget.name}`}
              {deleteTarget.type === 'attachment' && `حذف المرفق: ${deleteTarget.name}`}
            </h4>

            {/* Alert message box */}
            <div className="w-full p-2.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-center mb-4">
              <p className="text-[10.8px] leading-relaxed text-[#E53E3E] font-medium m-0">
                {deleteTarget.type === 'attachment'
                  ? 'هل أنت متأكد من رغبتك في حذف هذا الملف المرفق من الدرس؟ لن تتمكن من استرجاعه بعد الحذف.'
                  : 'هل أنت متأكد من الحذف؟ سيتم إزالة هذا العنصر وكافة محتوياته فوراً من شجرة المنهج ولا يمكن التراجع.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                className="abtn outline flex-1 py-1.5 text-[11px]"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="abtn coral flex-1 py-1.5 text-[11px]"
                onClick={confirmDelete}
              >
                {deleteTarget.type === 'lesson' && 'حذف الدرس'}
                {deleteTarget.type === 'unit' && 'حذف الوحدة'}
                {deleteTarget.type === 'group' && 'حذف المجموعة'}
                {deleteTarget.type === 'attachment' && 'حذف المرفق'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. نافذة بيانات الوحدة (إضافة وحدة جديدة) */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3">
          <div className="w-full max-w-[390px] sm:max-w-[430px] p-6 rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* رأس النافذة: العنوان والملاحظة التوضيحية */}
            <div className="flex items-start justify-between mb-3 pb-2 border-b border-[var(--border-light)]">
              <div className="text-right">
                <h3 className="text-[16px] font-extrabold text-[var(--navy)] m-0">
                  بيانات الوحدة
                </h3>
                <p className="text-[11px] text-[var(--gray)] leading-relaxed mt-1 m-0">
                  الوحدة الجديدة تُنشأ دائماً بحالة «مسودة» — لا يمكن نشرها من هذه النافذة.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUnitModalOpen(false)}
                className="text-[var(--gray)] hover:text-black cursor-pointer p-1 -mt-1 -ml-1 transition-colors"
                title="إغلاق النافذة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* نموذج إدخال بيانات الوحدة */}
            <form onSubmit={handleCreateUnit} className="space-y-3.5 mt-4">
              {/* 1. اسم الوحدة (عربي) */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5 text-right">
                  اسم الوحدة (عربي) <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="text"
                  className="admin-input text-[11.5px] w-full"
                  placeholder="مثال: الوحدة الأولى: الأعداد"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              {/* 2. اسم الوحدة (إنجليزي) */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5 text-right">
                  اسم الوحدة (إنجليزي) <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  className="admin-input text-[11.5px] w-full font-latin text-right placeholder:text-right"
                  placeholder="e.g. Unit 1: Numbers"
                  value={newUnitTitleEn}
                  onChange={(e) => setNewUnitTitleEn(e.target.value)}
                  required
                />
              </div>

              {/* 3. الترتيب */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5 text-right">
                  الترتيب <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="admin-input text-[11.5px] w-full"
                  placeholder="مثال: 3"
                  value={newUnitOrder}
                  onChange={(e) => setNewUnitOrder(e.target.value)}
                  required
                />
              </div>

              {/* أزرار الإجراءات: محاذاة لليمين (justify-start في RTL) */}
              <div className="flex items-center justify-start gap-2.5 pt-3">
                <button
                  type="submit"
                  className="abtn teal px-5 py-2 text-[11.5px] font-bold shadow-xs cursor-pointer"
                >
                  حفظ الوحدة
                </button>
                <button
                  type="button"
                  className="abtn outline px-5 py-2 text-[11.5px]"
                  onClick={() => setIsAddUnitModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. نافذة تعديل عنوان الوحدة */}
      {isEditUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3">
          <div className="w-full max-w-[380px] p-5 rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[var(--border-light)]">
              <h4 className="text-[13px] font-extrabold text-[var(--navy)] m-0">تعديل عنوان الوحدة</h4>
              <button
                type="button"
                onClick={() => setIsEditUnitModalOpen(false)}
                className="text-[var(--gray)] hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUnitTitle} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1">
                  عنوان الوحدة <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="text"
                  className="admin-input text-[11.5px]"
                  value={editingUnitTitle}
                  onChange={(e) => setEditingUnitTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  className="abtn outline flex-1 py-1.5 text-[11px]"
                  onClick={() => setIsEditUnitModalOpen(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="abtn teal flex-1 py-1.5 text-[11px]">
                  حفظ التعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. نافذة بيانات المجموعة (إضافة مجموعة جديدة) */}
      {isAddGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3">
          <div className="w-full max-w-[390px] sm:max-w-[430px] p-6 rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* رأس النافذة: العنوان والملاحظة التوضيحية */}
            <div className="flex items-start justify-between mb-3 pb-2 border-b border-[var(--border-light)]">
              <div className="text-right">
                <h3 className="text-[16px] font-extrabold text-[var(--navy)] m-0">
                  بيانات المجموعة
                </h3>
                <p className="text-[11px] text-[var(--gray)] leading-relaxed mt-1 m-0">
                  طبقة تنظيمية فقط لتجميع الدروس — بلا حالة نشر مستقلة.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGroupModalOpen(false)}
                className="text-[var(--gray)] hover:text-black cursor-pointer p-1 -mt-1 -ml-1 transition-colors"
                title="إغلاق النافذة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* نموذج إدخال بيانات المجموعة */}
            <form onSubmit={handleCreateGroup} className="space-y-3.5 mt-4">
              {/* 1. اسم المجموعة (عربي) */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5 text-right">
                  اسم المجموعة (عربي) <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="text"
                  className="admin-input text-[11.5px] w-full"
                  placeholder="مثال: الجمع والطرح"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              {/* 2. اسم المجموعة (إنجليزي) */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5 text-right">
                  اسم المجموعة (إنجليزي) <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  className="admin-input text-[11.5px] w-full font-latin text-left"
                  placeholder="e.g. Addition & Subtraction"
                  value={newGroupTitleEn}
                  onChange={(e) => setNewGroupTitleEn(e.target.value)}
                  required
                />
              </div>

              {/* أزرار الإجراءات: محاذاة لليمين والزر الأساسي Primary باللون التيل الموحد */}
              <div className="flex items-center justify-start gap-2.5 pt-3">
                <button
                  type="submit"
                  className="abtn teal px-5 py-2 text-[11.5px] font-bold shadow-xs cursor-pointer"
                >
                  حفظ المجموعة
                </button>
                <button
                  type="button"
                  className="abtn outline px-5 py-2 text-[11.5px]"
                  onClick={() => setIsAddGroupModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. نافذة بيانات الدرس (إضافة درس جديد) */}
      {isAddLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3">
          <div className="w-full max-w-[390px] sm:max-w-[430px] p-6 rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* رأس النافذة: العنوان والملاحظة التوضيحية */}
            <div className="flex items-start justify-between mb-3 pb-2 border-b border-[var(--border-light)]">
              <div className="text-right">
                <h3 className="text-[16px] font-extrabold text-[var(--navy)] m-0">
                  بيانات الدرس
                </h3>
                <p className="text-[11px] text-[var(--gray)] leading-relaxed mt-1 m-0">
                  إنشاء سريع — أنشئ الدرس ثم أكمل الأهداف والصعوبة والملف من لوحة المحرّر.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddLessonModalOpen(false)}
                className="text-[var(--gray)] hover:text-black cursor-pointer p-1 -mt-1 -ml-1 transition-colors"
                title="إغلاق النافذة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* نموذج إدخال بيانات الدرس */}
            <form onSubmit={handleCreateLesson} className="space-y-4 mt-4">
              {/* 1. نوع المحتوى */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5 text-right">
                  نوع المحتوى <span className="text-[var(--coral)]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* زر فيديو */}
                  <button
                    type="button"
                    onClick={() => setNewLessonContentType('video')}
                    className={`py-2.5 px-4 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newLessonContentType === 'video'
                        ? 'bg-[var(--teal)] text-white shadow-xs border border-[var(--teal)]'
                        : 'bg-white border border-[var(--border-mid)] text-[var(--navy)] hover:bg-[#F6F8FB]'
                    }`}
                  >
                    <span>فيديو</span>
                    <span className="text-[14px]">🎬</span>
                  </button>

                  {/* زر ملف */}
                  <button
                    type="button"
                    onClick={() => setNewLessonContentType('file')}
                    className={`py-2.5 px-4 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newLessonContentType === 'file'
                        ? 'bg-[var(--teal)] text-white shadow-xs border border-[var(--teal)]'
                        : 'bg-white border border-[var(--border-mid)] text-[var(--navy)] hover:bg-[#F6F8FB]'
                    }`}
                  >
                    <span>ملف</span>
                    <span className="text-[14px]">📄</span>
                  </button>
                </div>
              </div>

              {/* 2. عنوان الدرس */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] mb-1.5 text-right">
                  عنوان الدرس <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="text"
                  className="admin-input text-[11.5px] w-full"
                  placeholder="مثال: مقدمة في الجمع"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              {/* أزرار الإجراءات: محاذاة لليمين والزر الأساسي Primary باللون التيل الموحد */}
              <div className="flex items-center justify-start gap-2.5 pt-3">
                <button
                  type="submit"
                  className="abtn teal px-5 py-2 text-[11.5px] font-bold shadow-xs cursor-pointer"
                >
                  إنشاء ومتابعة التحرير
                </button>
                <button
                  type="button"
                  className="abtn outline px-5 py-2 text-[11.5px]"
                  onClick={() => setIsAddLessonModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. نافذة المعاينة (Preview Modal) - متناسقة الحجم والأبعاد مع باقي النظام */}
      {isPreviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPreviewModalOpen(false);
          }}
        >
          <div className="w-full max-w-[360px] sm:max-w-[380px] p-5 rounded-xl bg-white shadow-xl text-right animate-in fade-in zoom-in-95 duration-150">
            {/* عنوان المعاينة والوصف التوضيحي */}
            <h3 className="text-[13.5px] font-extrabold text-[var(--navy)] mb-1">
              معاينة: {lessonTitle || 'مقدمة في الجمع'}
            </h3>
            <p className="text-[10.2px] text-[var(--gray)] mb-4 font-normal leading-relaxed">
              هكذا سيظهر الدرس للمستخدم النهائي، بصرف النظر عن حالة النشر الحالية.
            </p>

            {/* تفاصيل الدرس */}
            <div className="space-y-3">
              {/* نوع المحتوى */}
              <div>
                <div className="text-[10px] font-bold text-[var(--gray)] mb-0.5">نوع المحتوى</div>
                <div className="text-[12.5px] font-extrabold text-[var(--navy)] flex items-center gap-1.5">
                  <span>{lessonContentType === 'file' ? 'ملف مستندات' : 'فيديو'}</span>
                  <span className="text-[14px]">{lessonContentType === 'file' ? '📄' : '🎬'}</span>
                </div>
              </div>

              {/* الملف أو الفيديو المرفق */}
              {videoFile && (
                <div>
                  <div className="text-[10px] font-bold text-[var(--gray)] mb-0.5">
                    {lessonContentType === 'file' ? 'الملف المرفق' : 'الفيديو المرفق'}
                  </div>
                  <div className="text-[11.5px] font-bold text-[var(--navy)] font-latin truncate bg-[#FAFBFD] p-2 rounded-lg border border-[var(--border-light)] flex items-center gap-2">
                    {lessonContentType === 'file' ? (
                      <FileText className="w-3.5 h-3.5 text-[var(--teal)] shrink-0" />
                    ) : (
                      <Video className="w-3.5 h-3.5 text-[var(--teal)] shrink-0" />
                    )}
                    <span className="truncate">{videoFile.name}</span>
                    <span className="text-[9.5px] text-[var(--gray)] mr-auto shrink-0 font-latin">
                      {videoFile.size}
                    </span>
                  </div>
                </div>
              )}

              {/* مستوى الصعوبة */}
              <div>
                <div className="text-[10px] font-bold text-[var(--gray)] mb-0.5">مستوى الصعوبة</div>
                <div className="text-[12.5px] font-extrabold text-[var(--navy)]">
                  {difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'صعب'}
                </div>
              </div>

              {/* الأهداف التعليمية */}
              <div>
                <div className="text-[10px] font-bold text-[var(--gray)] mb-1.5">الأهداف التعليمية</div>
                <div className="flex flex-wrap gap-1.5">
                  {goals && goals.length > 0 ? (
                    goals.map((g, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-[10px] font-bold text-[var(--navy)] bg-[#EEF2F6]"
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold text-[var(--navy)] bg-[#EEF2F6]">
                      يفهم الطالب مفهوم الجمع
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* زر إغلاق المعاينة */}
            <div className="mt-5 pt-3 border-t border-[var(--border-light)] flex justify-start">
              <button
                type="button"
                className="abtn outline text-[10.5px] font-bold px-4 py-1.5 rounded-lg text-[var(--navy)]"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. نافذة مساعد المنهج بالذكاء الاصطناعي (AI Curriculum Assistant Modal) */}
      <AiCurriculumModal
        isOpen={isAiCurriculumModalOpen}
        onClose={() => setIsAiCurriculumModalOpen(false)}
        onApplyCurriculum={handleApplyAiCurriculum}
        currentSubjectName={selectedSubjectName}
        currentGradeName={selectedGradeName}
        currentCountryName={selectedCountryName}
      />
    </div>
  );
};
