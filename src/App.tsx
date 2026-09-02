import { useState, useRef, useEffect, MouseEvent } from 'react';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { UsersPage } from './components/UsersPage';
import { AcademicCalendarPage } from './components/AcademicCalendarPage';
import { CountriesPage } from './components/CountriesPage';

const PAGE_GROUP_MAP: Record<string, string> = {
  countries: 'foundation',
  classes: 'foundation',
  subjects: 'foundation',
  curriculum: 'foundation',
  questions: 'foundation',
  calendar: 'foundation',
  users: 'users',
  subscriptions: 'users',
  rewards: 'motivation',
  'notif-templates': 'motivation',
  'ai-safety': 'ai',
  roles: 'governance',
  settings: 'governance',
  analytics: 'reports',
  'companion-catalog': 'companion',
  'design-system': 'system',
  dashboard: 'dashboard',
  feedback: 'feedback',
};

function getPageFromUrl(): string {
  if (typeof window === 'undefined') return 'dashboard';

  // 1. فحص معلمة الاستعلام ?page=...
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam && PAGE_GROUP_MAP[pageParam]) {
      return pageParam;
    }
  } catch {
    // ignore
  }

  // 2. فحص الهاش #/page أو #page
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  if (hash && PAGE_GROUP_MAP[hash]) {
    return hash;
  }

  // 3. فحص المسار /page المباشر
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').split('?')[0];
  if (path && PAGE_GROUP_MAP[path]) {
    return path;
  }

  // 4. استرجاع آخر صفحة كان يعمل عليها المستخدم من localStorage لمنع إجباره على المستخدمين عند حفظ الكود
  try {
    const saved = localStorage.getItem('admin_active_page');
    if (saved && PAGE_GROUP_MAP[saved]) {
      return saved;
    }
  } catch {
    // ignore
  }

  return 'calendar';
}

export default function App() {
  const [activePage, setActivePage] = useState<string>(() => getPageFromUrl());
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialPage = getPageFromUrl();
    const defaults: Record<string, boolean> = {
      users: true,
      foundation: true,
    };
    const matchedGroup = PAGE_GROUP_MAP[initialPage];
    if (matchedGroup && matchedGroup !== 'dashboard' && matchedGroup !== 'feedback') {
      defaults[matchedGroup] = true;
    }
    return defaults;
  });

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isAvatarOpen, setIsAvatarOpen] = useState<boolean>(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // حالة الشاشة الفرعية وزر الرجوع
  const [isSubScreen, setIsSubScreen] = useState<boolean>(false);
  const [subScreenTitle, setSubScreenTitle] = useState<string>('');
  const backHandlerRef = useRef<(() => void) | null>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: '👤',
      title: 'مستخدم جديد انضم: أحمد المطيري',
      time: 'منذ 3 دقائق',
      unread: true,
      bg: 'rgb(227, 247, 244)',
    },
    {
      id: 2,
      icon: '📝',
      title: 'تم رفع محتوى جديد بانتظار المراجعة',
      time: 'منذ 15 دقيقة',
      unread: true,
      bg: 'rgb(227, 247, 244)',
    },
    {
      id: 3,
      icon: '🏆',
      title: 'خالد الزهراني حقق إنجاز "المتعلم النشط"',
      time: 'منذ 42 دقيقة',
      unread: true,
      bg: 'rgb(227, 247, 244)',
    },
    {
      id: 4,
      icon: '💳',
      title: 'اشتراك جديد: الخطة المميزة — الإمارات',
      time: 'منذ ساعة',
      unread: false,
      bg: 'var(--light)',
    },
    {
      id: 5,
      icon: '🛡️',
      title: 'تنبيه محتوى: 2 محادثة تحتاج مراجعة يدوية',
      time: 'منذ ساعتين',
      unread: false,
      bg: 'var(--light)',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // المزامنة مع أزرار الرجوع والتنقل بالمتصفح
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromUrl();
      setActivePage(page);
      const matchedGroup = PAGE_GROUP_MAP[page];
      if (matchedGroup && matchedGroup !== 'dashboard' && matchedGroup !== 'feedback') {
        setOpenGroups((prev) => ({
          ...prev,
          [matchedGroup]: true,
        }));
      }
      setIsSubScreen(false);
      setSubScreenTitle('');
      backHandlerRef.current = null;
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // حفظ الصفحة الحالية في التخزين المحلي وتحديث شريط عنوان المتصفح فوراً
  useEffect(() => {
    try {
      localStorage.setItem('admin_active_page', activePage);
    } catch {
      // ignore
    }
    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '').split('?')[0];
    if (currentPath !== activePage && window.history.replaceState) {
      window.history.replaceState({ page: activePage }, '', `/${activePage}`);
    }
  }, [activePage]);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handlePageSelect = (page: string) => {
    setActivePage(page);
    try {
      localStorage.setItem('admin_active_page', page);
    } catch {
      // ignore
    }
    const matchedGroup = PAGE_GROUP_MAP[page];
    if (matchedGroup && matchedGroup !== 'dashboard' && matchedGroup !== 'feedback') {
      setOpenGroups((prev) => ({
        ...prev,
        [matchedGroup]: true,
      }));
    }
    setIsSubScreen(false);
    setSubScreenTitle('');
    backHandlerRef.current = null;
  };

  // التنقل مع تغيير الرابط في المتصفح ودعم الفتح في لسان جديد
  const navigateTo = (page: string, e?: MouseEvent) => {
    if (e) {
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
        e.preventDefault();
        const targetPath = `/${page}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ page }, '', targetPath);
        }
        handlePageSelect(page);
      }
    } else {
      const targetPath = `/${page}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', targetPath);
      }
      handlePageSelect(page);
    }
  };

  const getPageDetails = () => {
    switch (activePage) {
      case 'users':
        return {
          title: 'المستخدمون',
          crumb: 'المستخدمون / أولياء الأمور والطلاب',
        };
      case 'subscriptions':
        return {
          title: 'الاشتراكات والخطط',
          crumb: 'المستخدمون / الاشتراكات والخطط',
        };
      case 'countries':
        return {
          title: 'الدول',
          crumb: 'الإعداد التأسيسي / الدول',
        };
      case 'classes':
        return {
          title: 'الصفوف الدراسية',
          crumb: 'الإعداد التأسيسي / الصفوف الدراسية',
        };
      case 'subjects':
        return {
          title: 'المواد الدراسية',
          crumb: 'الإعداد التأسيسي / المواد الدراسية',
        };
      case 'curriculum':
        return {
          title: 'المنهج الدراسي',
          crumb: 'الإعداد التأسيسي / المنهج الدراسي',
        };
      case 'questions':
        return {
          title: 'بنك الأسئلة',
          crumb: 'الإعداد التأسيسي / بنك الأسئلة',
        };
      case 'calendar':
        return {
          title: 'التقويم الأكاديمي',
          crumb: 'البيانات الأساسية / التقويم الأكاديمي',
        };
      case 'dashboard':
        return {
          title: 'لوحة التحكم',
          crumb: 'الرئيسية',
        };
      case 'rewards':
        return {
          title: 'الإنجازات والمكافآت',
          crumb: 'التحفيز والإشعارات / الإنجازات والمكافآت',
        };
      case 'notif-templates':
        return {
          title: 'قوالب الإشعارات',
          crumb: 'التحفيز والإشعارات / قوالب الإشعارات',
        };
      case 'ai-safety':
        return {
          title: 'المساعد الذكي والسلامة',
          crumb: 'الذكاء الاصطناعي والسلامة / المساعد الذكي والسلامة',
        };
      case 'roles':
        return {
          title: 'الأدوار والصلاحيات',
          crumb: 'الحوكمة / الأدوار والصلاحيات',
        };
      case 'settings':
        return {
          title: 'الإعدادات العامة',
          crumb: 'الحوكمة / الإعدادات العامة',
        };
      case 'analytics':
        return {
          title: 'التقارير والتحليلات',
          crumb: 'التقارير / التقارير والتحليلات',
        };
      case 'companion-catalog':
        return {
          title: 'كتالوج الرفيق التعليمي',
          crumb: 'الرفيق التعليمي / كتالوج الرفيق التعليمي',
        };
      case 'design-system':
        return {
          title: 'نظام التصميم',
          crumb: 'النظام / نظام التصميم',
        };
      case 'feedback':
        return {
          title: 'مراجعة آراء أولياء الأمور',
          crumb: 'مراجعة آراء أولياء الأمور',
        };
      default:
        return {
          title: 'المستخدمون',
          crumb: 'المستخدمون',
        };
    }
  };

  const pageInfo = getPageDetails();

  const handleBackClick = () => {
    if (backHandlerRef.current) {
      backHandlerRef.current();
    } else {
      setIsSubScreen(false);
    }
  };

  return (
    <div className="admin-container">
      {/* السايد بار */}
      <div className="admin-sidebar">
        <a
          href="/dashboard"
          className="sidebar-brand no-underline text-inherit"
          onClick={(e) => navigateTo('dashboard', e)}
        >
          <span>🎓</span>
          <span>لوحة إدارة المنصة</span>
        </a>

        <a
          href="/dashboard"
          className={`sidebar-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={(e) => navigateTo('dashboard', e)}
        >
          <span className="ic">🏠</span>
          <span>لوحة التحكم</span>
        </a>

        <div>
          <div
            className={`sidebar-grp-header ${openGroups['foundation'] ? 'open' : ''}`}
            onClick={() => toggleGroup('foundation')}
          >
            <span>الإعداد التأسيسي</span>
            <span className="chev">‹</span>
          </div>
          <div
            className="sidebar-grp-children"
            style={{
              maxHeight: openGroups['foundation'] ? '400px' : '0px',
              opacity: openGroups['foundation'] ? 1 : 0,
            }}
          >
            <a
              href="/countries"
              className={`sidebar-item sub ${activePage === 'countries' ? 'active' : ''}`}
              onClick={(e) => navigateTo('countries', e)}
            >
              <span className="ic">🌍</span>
              <span>الدول</span>
            </a>
            <a
              href="/classes"
              className={`sidebar-item sub ${activePage === 'classes' ? 'active' : ''}`}
              onClick={(e) => navigateTo('classes', e)}
            >
              <span className="ic">🏫</span>
              <span>الصفوف الدراسية</span>
            </a>
            <a
              href="/subjects"
              className={`sidebar-item sub ${activePage === 'subjects' ? 'active' : ''}`}
              onClick={(e) => navigateTo('subjects', e)}
            >
              <span className="ic">📚</span>
              <span>المواد الدراسية</span>
            </a>
            <a
              href="/curriculum"
              className={`sidebar-item sub ${activePage === 'curriculum' ? 'active' : ''}`}
              onClick={(e) => navigateTo('curriculum', e)}
            >
              <span className="ic">🌳</span>
              <span>المنهج الدراسي</span>
            </a>
            <a
              href="/questions"
              className={`sidebar-item sub ${activePage === 'questions' ? 'active' : ''}`}
              onClick={(e) => navigateTo('questions', e)}
            >
              <span className="ic">❓</span>
              <span>بنك الأسئلة</span>
            </a>
            <a
              href="/calendar"
              className={`sidebar-item sub ${activePage === 'calendar' ? 'active' : ''}`}
              onClick={(e) => navigateTo('calendar', e)}
            >
              <span className="ic">📅</span>
              <span>التقويم الأكاديمي</span>
            </a>
          </div>
        </div>

        <div>
          <div
            className={`sidebar-grp-header ${openGroups['users'] ? 'open' : ''}`}
            onClick={() => toggleGroup('users')}
          >
            <span>المستخدمون</span>
            <span className="chev">‹</span>
          </div>
          <div
            className="sidebar-grp-children"
            style={{
              maxHeight: openGroups['users'] ? '200px' : '0px',
              opacity: openGroups['users'] ? 1 : 0,
            }}
          >
            <a
              href="/users"
              className={`sidebar-item sub ${activePage === 'users' ? 'active' : ''}`}
              onClick={(e) => navigateTo('users', e)}
            >
              <span className="ic">👥</span>
              <span>المستخدمون</span>
            </a>
            <a
              href="/subscriptions"
              className={`sidebar-item sub ${activePage === 'subscriptions' ? 'active' : ''}`}
              onClick={(e) => navigateTo('subscriptions', e)}
            >
              <span className="ic">💳</span>
              <span>الاشتراكات والخطط</span>
            </a>
          </div>
        </div>

        <div>
          <div
            className={`sidebar-grp-header ${openGroups['motivation'] ? 'open' : ''}`}
            onClick={() => toggleGroup('motivation')}
          >
            <span>التحفيز والإشعارات</span>
            <span className="chev">‹</span>
          </div>
          <div
            className="sidebar-grp-children"
            style={{
              maxHeight: openGroups['motivation'] ? '200px' : '0px',
              opacity: openGroups['motivation'] ? 1 : 0,
            }}
          >
            <a
              href="/rewards"
              className={`sidebar-item sub ${activePage === 'rewards' ? 'active' : ''}`}
              onClick={(e) => navigateTo('rewards', e)}
            >
              <span className="ic">🏆</span>
              <span>الإنجازات والمكافآت</span>
            </a>
            <a
              href="/notif-templates"
              className={`sidebar-item sub ${activePage === 'notif-templates' ? 'active' : ''}`}
              onClick={(e) => navigateTo('notif-templates', e)}
            >
              <span className="ic">🔔</span>
              <span>قوالب الإشعارات</span>
            </a>
          </div>
        </div>

        <div>
          <div
            className={`sidebar-grp-header ${openGroups['ai'] ? 'open' : ''}`}
            onClick={() => toggleGroup('ai')}
          >
            <span>الذكاء الاصطناعي والسلامة</span>
            <span className="chev">‹</span>
          </div>
          <div
            className="sidebar-grp-children"
            style={{
              maxHeight: openGroups['ai'] ? '200px' : '0px',
              opacity: openGroups['ai'] ? 1 : 0,
            }}
          >
            <a
              href="/ai-safety"
              className={`sidebar-item sub ${activePage === 'ai-safety' ? 'active' : ''}`}
              onClick={(e) => navigateTo('ai-safety', e)}
            >
              <span className="ic">🛡️</span>
              <span>المساعد الذكي والسلامة</span>
            </a>
          </div>
        </div>

        <div>
          <div
            className={`sidebar-grp-header ${openGroups['governance'] ? 'open' : ''}`}
            onClick={() => toggleGroup('governance')}
          >
            <span>الحوكمة</span>
            <span className="chev">‹</span>
          </div>
          <div
            className="sidebar-grp-children"
            style={{
              maxHeight: openGroups['governance'] ? '200px' : '0px',
              opacity: openGroups['governance'] ? 1 : 0,
            }}
          >
            <a
              href="/roles"
              className={`sidebar-item sub ${activePage === 'roles' ? 'active' : ''}`}
              onClick={(e) => navigateTo('roles', e)}
            >
              <span className="ic">🔐</span>
              <span>الأدوار والصلاحيات</span>
            </a>
            <a
              href="/settings"
              className={`sidebar-item sub ${activePage === 'settings' ? 'active' : ''}`}
              onClick={(e) => navigateTo('settings', e)}
            >
              <span className="ic">⚙️</span>
              <span>الإعدادات العامة</span>
            </a>
          </div>
        </div>

        <div>
          <div
            className={`sidebar-grp-header ${openGroups['reports'] ? 'open' : ''}`}
            onClick={() => toggleGroup('reports')}
          >
            <span>التقارير</span>
            <span className="chev">‹</span>
          </div>
          <div
            className="sidebar-grp-children"
            style={{
              maxHeight: openGroups['reports'] ? '200px' : '0px',
              opacity: openGroups['reports'] ? 1 : 0,
            }}
          >
            <a
              href="/analytics"
              className={`sidebar-item sub ${activePage === 'analytics' ? 'active' : ''}`}
              onClick={(e) => navigateTo('analytics', e)}
            >
              <span className="ic">📊</span>
              <span>التقارير والتحليلات</span>
            </a>
          </div>
        </div>

        <div>
          <div
            className={`sidebar-grp-header ${openGroups['companion'] ? 'open' : ''}`}
            onClick={() => toggleGroup('companion')}
          >
            <span>الرفيق التعليمي</span>
            <span className="chev">‹</span>
          </div>
          <div
            className="sidebar-grp-children"
            style={{
              maxHeight: openGroups['companion'] ? '200px' : '0px',
              opacity: openGroups['companion'] ? 1 : 0,
            }}
          >
            <a
              href="/companion-catalog"
              className={`sidebar-item sub ${activePage === 'companion-catalog' ? 'active' : ''}`}
              onClick={(e) => navigateTo('companion-catalog', e)}
            >
              <span className="ic">🧸</span>
              <span>كتالوج الرفيق التعليمي</span>
            </a>
          </div>
        </div>

        <div>
          <div
            className={`sidebar-grp-header ${openGroups['system'] ? 'open' : ''}`}
            onClick={() => toggleGroup('system')}
          >
            <span>النظام</span>
            <span className="chev">‹</span>
          </div>
          <div
            className="sidebar-grp-children"
            style={{
              maxHeight: openGroups['system'] ? '200px' : '0px',
              opacity: openGroups['system'] ? 1 : 0,
            }}
          >
            <a
              href="/design-system"
              className={`sidebar-item sub ${activePage === 'design-system' ? 'active' : ''}`}
              onClick={(e) => navigateTo('design-system', e)}
            >
              <span className="ic">🎨</span>
              <span>نظام التصميم</span>
            </a>
          </div>
        </div>

        <a
          href="/feedback"
          className={`sidebar-item bottom ${activePage === 'feedback' ? 'active' : ''}`}
          onClick={(e) => navigateTo('feedback', e)}
        >
          <span className="ic">💬</span>
          <span>مراجعة آراء أولياء الأمور</span>
        </a>
      </div>

      {/* المحتوى الرئيسي و الهيدر */}
      <div className="admin-main">
        {/* الهيدر */}
        <div className="admin-topbar">
          <div>
            <div className="topbar-title">{pageInfo.title}</div>
            <div className="topbar-crumb">
              {isSubScreen ? `${pageInfo.crumb} / ${subScreenTitle || 'تفاصيل'}` : pageInfo.crumb}
            </div>
          </div>
          <div className="topbar-tools" style={{ position: 'relative' }}>
            {isSubScreen && (
              <button
                type="button"
                className="abtn outline"
                style={{ fontSize: '10px', padding: '6px 12px', gap: '4px' }}
                onClick={handleBackClick}
              >
                ← رجوع
              </button>
            )}

            <div ref={notifRef} style={{ position: 'relative' }}>
              <div
                className="topbar-notif-btn"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                title="الإشعارات"
              >
                🔔{unreadCount > 0 && <span className="topbar-notif-dot"></span>}
              </div>

              {isNotifOpen && (
                <div
                  className="topbar-dropdown"
                  style={{ width: '310px', left: '0px', right: 'auto' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: '12.5px' }}>
                      الإشعارات{' '}
                      {unreadCount > 0 && (
                        <span
                          style={{
                            background: 'var(--coral)',
                            color: 'rgb(255, 255, 255)',
                            fontSize: '9px',
                            borderRadius: '10px',
                            padding: '1px 6px',
                            marginRight: '4px',
                          }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </span>
                    <span
                      onClick={markAllAsRead}
                      style={{
                        fontSize: '10px',
                        color: 'var(--teal)',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      تعيين الكل كمقروء
                    </span>
                  </div>

                  {notifications.map((notif, idx) => (
                    <div
                      key={notif.id}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        padding: '9px 0px',
                        borderBottom:
                          idx === notifications.length - 1
                            ? 'none'
                            : '1px solid var(--light)',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: notif.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          flexShrink: 0,
                        }}
                      >
                        {notif.icon}
                      </div>
                      <div style={{ flex: '1 1 0%', minWidth: '0px' }}>
                        <div
                          style={{
                            fontSize: '10.5px',
                            color: 'var(--navy)',
                            fontWeight: notif.unread ? 700 : 400,
                            lineHeight: 1.5,
                          }}
                        >
                          {notif.title}
                        </div>
                        <div
                          style={{
                            fontSize: '9px',
                            color: 'var(--gray)',
                            marginTop: '2px',
                          }}
                        >
                          {notif.time}
                        </div>
                      </div>
                      {notif.unread && (
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'var(--teal)',
                            flexShrink: 0,
                            marginTop: '4px',
                          }}
                        ></div>
                      )}
                    </div>
                  ))}

                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        color: 'var(--teal)',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      عرض كل الإشعارات ←
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div ref={avatarRef} style={{ position: 'relative' }}>
              <div
                className="avatar"
                onClick={() => setIsAvatarOpen((prev) => !prev)}
                style={{
                  background: 'var(--navy)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                title="قائمة المستخدم"
              >
                أد
              </div>

              {isAvatarOpen && (
                <div
                  className="topbar-dropdown"
                  style={{ width: '220px', left: '0px', right: 'auto' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--light)',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      className="avatar"
                      style={{
                        background: 'var(--navy)',
                        width: '36px',
                        height: '36px',
                        fontSize: '14px',
                        flexShrink: 0,
                      }}
                    >
                      أد
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '11.5px' }}>
                        المدير العام
                      </div>
                      <div
                        style={{
                          fontSize: '9.5px',
                          color: 'var(--gray)',
                          fontFamily: 'Poppins',
                        }}
                      >
                        admin@smartlearn.sa
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      cursor: 'pointer',
                      borderRadius: '7px',
                    }}
                    className="hover:bg-[#F1F3F5] transition-colors"
                  >
                    <span style={{ fontSize: '14px' }}>👤</span>
                    <span>الملف الشخصي</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      cursor: 'pointer',
                      borderRadius: '7px',
                    }}
                    className="hover:bg-[#F1F3F5] transition-colors"
                  >
                    <span style={{ fontSize: '14px' }}>⚙️</span>
                    <span>إعدادات الحساب</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      cursor: 'pointer',
                      borderRadius: '7px',
                    }}
                    className="hover:bg-[#F1F3F5] transition-colors"
                  >
                    <span style={{ fontSize: '14px' }}>🔐</span>
                    <span>الأدوار والصلاحيات</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      cursor: 'pointer',
                      borderRadius: '7px',
                    }}
                    className="hover:bg-[#F1F3F5] transition-colors"
                  >
                    <span style={{ fontSize: '14px' }}>📊</span>
                    <span>التقارير</span>
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--light)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '8px 4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--coral)',
                        cursor: 'pointer',
                        borderRadius: '7px',
                      }}
                      className="hover:bg-[#FFF5F5] transition-colors"
                    >
                      <span style={{ fontSize: '14px' }}>🚪</span>
                      <span>تسجيل الخروج</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* مساحة المحتوى */}
        <div className="admin-content">
          {activePage === 'users' ? (
            <UsersPage
              onSubScreenChange={(isSub, title) => {
                setIsSubScreen(isSub);
                setSubScreenTitle(title || '');
              }}
              onBackRequest={(fn) => {
                backHandlerRef.current = fn;
              }}
            />
          ) : activePage === 'subscriptions' ? (
            <SubscriptionsPage />
          ) : activePage === 'calendar' ? (
            <AcademicCalendarPage
              onSubScreenChange={(isSub, title) => {
                setIsSubScreen(isSub);
                setSubScreenTitle(title || '');
              }}
              onBackRequest={(fn) => {
                backHandlerRef.current = fn;
              }}
            />
          ) : activePage === 'countries' ? (
            <CountriesPage />
          ) : (
            <div className="admin-panel text-center py-12 text-[#5A6472]">
              الصفحة قيد التطوير
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


