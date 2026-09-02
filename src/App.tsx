import { useState, useRef, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { UsersPage } from './components/UsersPage';
import { AcademicCalendarPage } from './components/AcademicCalendarPage';
import { CountriesPage } from './components/CountriesPage';
import { DashboardPage } from './components/DashboardPage';
import { SectionPlaceholderPage } from './components/SectionPlaceholderPage';

export default function App() {
  const location = useLocation();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    users: true,
    foundation: true,
    motivation: false,
    ai: false,
    governance: false,
    reports: false,
    companion: false,
    system: false,
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
    const handleClickOutside = (event: MouseEvent) => {
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

  // فتح المجموعة المناسبة تلقائياً حسب المسار وإعادة تعيين الشاشة الفرعية
  useEffect(() => {
    const path = location.pathname;
    if (['/countries', '/classes', '/subjects', '/curriculum', '/questions', '/calendar', '/academic-calendar'].includes(path)) {
      setOpenGroups((prev) => ({ ...prev, foundation: true }));
    } else if (['/users', '/subscriptions'].includes(path)) {
      setOpenGroups((prev) => ({ ...prev, users: true }));
    } else if (['/rewards', '/notif-templates'].includes(path)) {
      setOpenGroups((prev) => ({ ...prev, motivation: true }));
    } else if (['/ai-safety'].includes(path)) {
      setOpenGroups((prev) => ({ ...prev, ai: true }));
    } else if (['/roles', '/settings'].includes(path)) {
      setOpenGroups((prev) => ({ ...prev, governance: true }));
    } else if (['/analytics'].includes(path)) {
      setOpenGroups((prev) => ({ ...prev, reports: true }));
    } else if (['/companion-catalog'].includes(path)) {
      setOpenGroups((prev) => ({ ...prev, companion: true }));
    } else if (['/design-system'].includes(path)) {
      setOpenGroups((prev) => ({ ...prev, system: true }));
    }

    setIsSubScreen(false);
    setSubScreenTitle('');
    backHandlerRef.current = null;
  }, [location.pathname]);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const getPageDetails = () => {
    const path = location.pathname;
    switch (path) {
      case '/users':
        return {
          title: 'المستخدمون',
          crumb: 'المستخدمون / أولياء الأمور والطلاب',
        };
      case '/subscriptions':
        return {
          title: 'الاشتراكات والخطط',
          crumb: 'المستخدمون / الاشتراكات والخطط',
        };
      case '/countries':
        return {
          title: 'الدول',
          crumb: 'الإعداد التأسيسي / الدول',
        };
      case '/classes':
        return {
          title: 'الصفوف الدراسية',
          crumb: 'الإعداد التأسيسي / الصفوف الدراسية',
        };
      case '/subjects':
        return {
          title: 'المواد الدراسية',
          crumb: 'الإعداد التأسيسي / المواد الدراسية',
        };
      case '/curriculum':
        return {
          title: 'المنهج الدراسي',
          crumb: 'الإعداد التأسيسي / المنهج الدراسي',
        };
      case '/questions':
        return {
          title: 'بنك الأسئلة',
          crumb: 'الإعداد التأسيسي / بنك الأسئلة',
        };
      case '/calendar':
      case '/academic-calendar':
        return {
          title: 'التقويم الأكاديمي',
          crumb: 'البيانات الأساسية / التقويم الأكاديمي',
        };
      case '/rewards':
        return {
          title: 'الإنجازات والمكافآت',
          crumb: 'التحفيز والإشعارات / الإنجازات والمكافآت',
        };
      case '/notif-templates':
        return {
          title: 'قوالب الإشعارات',
          crumb: 'التحفيز والإشعارات / قوالب الإشعارات',
        };
      case '/ai-safety':
        return {
          title: 'المساعد الذكي والسلامة',
          crumb: 'الذكاء الاصطناعي والسلامة / المساعد الذكي والسلامة',
        };
      case '/roles':
        return {
          title: 'الأدوار والصلاحيات',
          crumb: 'الحوكمة / الأدوار والصلاحيات',
        };
      case '/settings':
        return {
          title: 'الإعدادات العامة',
          crumb: 'الحوكمة / الإعدادات العامة',
        };
      case '/analytics':
        return {
          title: 'التقارير والتحليلات',
          crumb: 'التقارير / التقارير والتحليلات',
        };
      case '/companion-catalog':
        return {
          title: 'كتالوج الرفيق التعليمي',
          crumb: 'الرفيق التعليمي / كتالوج الرفيق التعليمي',
        };
      case '/design-system':
        return {
          title: 'نظام التصميم',
          crumb: 'النظام / نظام التصميم',
        };
      case '/feedback':
        return {
          title: 'الملاحظات والدعم',
          crumb: 'النظام / الملاحظات والدعم',
        };
      case '/dashboard':
      case '/':
        return {
          title: 'لوحة التحكم',
          crumb: 'الرئيسية',
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
        <div className="sidebar-brand">
          <span>🎓</span>
          <span>لوحة إدارة المنصة</span>
        </div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-item ${isActive || location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="ic">🏠</span>
          <span>لوحة التحكم</span>
        </NavLink>

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
            <NavLink
              to="/countries"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🌍</span>
              <span>الدول</span>
            </NavLink>
            <NavLink
              to="/classes"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🏫</span>
              <span>الصفوف الدراسية</span>
            </NavLink>
            <NavLink
              to="/subjects"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">📚</span>
              <span>المواد الدراسية</span>
            </NavLink>
            <NavLink
              to="/curriculum"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🌳</span>
              <span>المنهج الدراسي</span>
            </NavLink>
            <NavLink
              to="/questions"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">❓</span>
              <span>بنك الأسئلة</span>
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) => `sidebar-item sub ${isActive || location.pathname === '/academic-calendar' ? 'active' : ''}`}
            >
              <span className="ic">📅</span>
              <span>التقويم الأكاديمي</span>
            </NavLink>
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
            <NavLink
              to="/users"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">👥</span>
              <span>المستخدمون</span>
            </NavLink>
            <NavLink
              to="/subscriptions"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">💳</span>
              <span>الاشتراكات والخطط</span>
            </NavLink>
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
            <NavLink
              to="/rewards"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🏆</span>
              <span>الإنجازات والمكافآت</span>
            </NavLink>
            <NavLink
              to="/notif-templates"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🔔</span>
              <span>قوالب الإشعارات</span>
            </NavLink>
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
            <NavLink
              to="/ai-safety"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🛡️</span>
              <span>المساعد الذكي والسلامة</span>
            </NavLink>
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
            <NavLink
              to="/roles"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🔐</span>
              <span>الأدوار والصلاحيات</span>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">⚙️</span>
              <span>الإعدادات العامة</span>
            </NavLink>
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
            <NavLink
              to="/analytics"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">📊</span>
              <span>التقارير والتحليلات</span>
            </NavLink>
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
            <NavLink
              to="/companion-catalog"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🧸</span>
              <span>كتالوج الرفيق التعليمي</span>
            </NavLink>
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
            <NavLink
              to="/design-system"
              className={({ isActive }) => `sidebar-item sub ${isActive ? 'active' : ''}`}
            >
              <span className="ic">🎨</span>
              <span>نظام التصميم</span>
            </NavLink>
          </div>
        </div>

        <NavLink
          to="/feedback"
          className={({ isActive }) => `sidebar-item bottom ${isActive ? 'active' : ''}`}
        >
          <span className="ic">💬</span>
          <span>مراجعة آراء أولياء الأمور</span>
        </NavLink>
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
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/users"
              element={
                <UsersPage
                  onSubScreenChange={(isSub, title) => {
                    setIsSubScreen(isSub);
                    setSubScreenTitle(title || '');
                  }}
                  onBackRequest={(fn) => {
                    backHandlerRef.current = fn;
                  }}
                />
              }
            />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route
              path="/calendar"
              element={
                <AcademicCalendarPage
                  onSubScreenChange={(isSub, title) => {
                    setIsSubScreen(isSub);
                    setSubScreenTitle(title || '');
                  }}
                  onBackRequest={(fn) => {
                    backHandlerRef.current = fn;
                  }}
                />
              }
            />
            <Route
              path="/academic-calendar"
              element={
                <AcademicCalendarPage
                  onSubScreenChange={(isSub, title) => {
                    setIsSubScreen(isSub);
                    setSubScreenTitle(title || '');
                  }}
                  onBackRequest={(fn) => {
                    backHandlerRef.current = fn;
                  }}
                />
              }
            />
            <Route
              path="/classes"
              element={
                <SectionPlaceholderPage
                  title="الصفوف الدراسية"
                  category="الإعداد التأسيسي"
                  description="إدارة وتحديد المراحل والصفوف الدراسية وتوزيع المناهج عليها"
                />
              }
            />
            <Route
              path="/subjects"
              element={
                <SectionPlaceholderPage
                  title="المواد الدراسية"
                  category="الإعداد التأسيسي"
                  description="إدارة المقررات والمواد الدراسية ونواتج التعلم لكل مرحلة"
                />
              }
            />
            <Route
              path="/curriculum"
              element={
                <SectionPlaceholderPage
                  title="المنهج الدراسي"
                  category="الإعداد التأسيسي"
                  description="هيكلة شجرة الوحدات التعليمية والدروس وربطها بالسنوات الأكاديمية"
                />
              }
            />
            <Route
              path="/questions"
              element={
                <SectionPlaceholderPage
                  title="بنك الأسئلة"
                  category="الإعداد التأسيسي"
                  description="إدارة وتصنيف بنك الأسئلة الشامل والاختبارات التفاعلية والتقييمات"
                />
              }
            />
            <Route
              path="/rewards"
              element={
                <SectionPlaceholderPage
                  title="الإنجازات والمكافآت"
                  category="التحفيز والإشعارات"
                  description="إدارة الأوسمة ومحفزات النقاط ولوحات الشرف للطلاب"
                />
              }
            />
            <Route
              path="/notif-templates"
              element={
                <SectionPlaceholderPage
                  title="قوالب الإشعارات"
                  category="التحفيز والإشعارات"
                  description="إدارة وصياغة قوالب الرسائل والإشعارات التلقائية لأولياء الأمور"
                />
              }
            />
            <Route
              path="/ai-safety"
              element={
                <SectionPlaceholderPage
                  title="المساعد الذكي والسلامة"
                  category="الذكاء الاصطناعي والسلامة"
                  description="سياسات السلامة وحوكمة إجابات المساعد الذكي وفلاتر الأمان"
                />
              }
            />
            <Route
              path="/roles"
              element={
                <SectionPlaceholderPage
                  title="الأدوار والصلاحيات"
                  category="الحوكمة"
                  description="تعريف الأدوار الوظيفية وصلاحيات المشرفين ومديري النظام"
                />
              }
            />
            <Route
              path="/settings"
              element={
                <SectionPlaceholderPage
                  title="الإعدادات العامة"
                  category="الحوكمة"
                  description="تهيئة إعدادات المنصة الأساسية ووسائل الدفع والاتصال"
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <SectionPlaceholderPage
                  title="التقارير والتحليلات"
                  category="التقارير"
                  description="متابعة نمو الاشتراكات وتفاعل الطلاب والإحصاءات المتقدمة"
                />
              }
            />
            <Route
              path="/companion-catalog"
              element={
                <SectionPlaceholderPage
                  title="كتالوج الرفيق التعليمي"
                  category="الرفيق التعليمي"
                  description="إدارة وتخصيص شخصيات وأصوات الرفيق التعليمي للطلاب"
                />
              }
            />
            <Route
              path="/design-system"
              element={
                <SectionPlaceholderPage
                  title="نظام التصميم"
                  category="النظام"
                  description="الدليل الإرشادي الموحد للألوان والمكونات وواجهات الاستخدام"
                />
              }
            />
            <Route
              path="/feedback"
              element={
                <SectionPlaceholderPage
                  title="مراجعة آراء أولياء الأمور"
                  category="النظام"
                  description="متابعة تذاكر الدعم الفني وتقييمات أولياء الأمور والطلاب"
                />
              }
            />
            <Route path="*" element={<Navigate to="/calendar" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}


