import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Sparkles, 
  Users, 
  Calendar, 
  Heart, 
  Info, 
  LogIn, 
  Menu, 
  X, 
  Search, 
  GraduationCap,
  MessageSquare,
  Trophy,
  Zap,
  Bell,
  Check,
  User as UserIcon,
  Award
} from 'lucide-react';
import { User } from '../types';
import { UserDropdown } from '@/components/ui/user-dropdown';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenCertificateVault?: () => void;
  onSwitchRole?: (newRole: 'student' | 'instructor' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenSearch,
  onOpenProfile,
  onOpenCertificateVault,
  onSwitchRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<string>('online');

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Course completed',
      detail: 'คุณสำเร็จการเรียนหลักสูตร "4 ทักษะสำคัญกับการพัฒนาท้องถิ่น"',
      time: '10 นาทีที่แล้ว',
      read: false,
      type: 'course',
      icon: GraduationCap,
      color: 'text-emerald-700 bg-emerald-100',
      actionTab: 'courses'
    },
    {
      id: 'notif-2',
      title: 'Badge earned',
      detail: 'ยินดีด้วย! คุณได้รับเหรียญตรา "นวัตกรชุมชนรุ่นเยาว์" (+150 XP)',
      time: '1 ชั่วโมงที่แล้ว',
      read: false,
      type: 'badge',
      icon: Trophy,
      color: 'text-amber-700 bg-amber-100',
      actionTab: 'profile'
    },
    {
      id: 'notif-3',
      title: 'New blog comment',
      detail: 'ผศ.ดร. ธีรภัทร วัฒนโกศล แสดงความคิดเห็นในบทความของคุณ: "แนวคิดดีมาก ชื่นชมการลงมือปฏิบัติจริงครับ"',
      time: '3 ชั่วโมงที่แล้ว',
      read: false,
      type: 'comment',
      icon: MessageSquare,
      color: 'text-blue-700 bg-blue-100',
      actionTab: 'blog'
    },
    {
      id: 'notif-4',
      title: 'New Activity',
      detail: 'โครงการ "ค่ายพัฒนาผู้นำเยาวชน UDRU 2026" เปิดรับสมัครแล้ว',
      time: '1 วันที่แล้ว',
      read: true,
      type: 'event',
      icon: Sparkles,
      color: 'text-purple-700 bg-purple-100',
      actionTab: 'events'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: typeof notifications[0]) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setNotificationsOpen(false);
    if (item.actionTab === 'profile') {
      onOpenProfile();
    } else if (item.actionTab) {
      onNavigate(item.actionTab);
    }
  };

  const navLinks = [
    { id: 'home', label: 'หน้าแรก', icon: null },
    { id: 'lifepath', label: 'ออกแบบเส้นทางชีวิต', icon: Compass },
    { id: 'courses', label: 'หลักสูตรออนไลน์', icon: BookOpen },
    { id: 'blog', label: 'ห้องสมุดความรู้', icon: Sparkles },
    { id: 'stories', label: 'พี่ถึงน้อง', icon: Users },
    { id: 'events', label: 'กิจกรรม', icon: Calendar },
    { id: 'sanctuary', label: 'ช่องทางพักใจ', icon: Heart, heart: true },
    { id: 'about', label: 'เกี่ยวกับเรา', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center cursor-pointer group shrink-0"
          >
            <img 
              src="https://s.imgz.io/2026/10/09/-15c05850b66672cb62.png"
              alt="โลโก้แพลตฟอร์ม"
              className="h-11 sm:h-13 md:h-14 w-auto max-w-[260px] object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-xs"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden 2xl:flex items-center gap-1 font-['Mitr',sans-serif]">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-slate-950 bg-amber-400 font-bold shadow-xs'
                      : 'text-slate-700 hover:text-black hover:bg-amber-100/60 font-medium'
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        link.heart
                          ? 'text-rose-500'
                          : isActive
                          ? 'text-slate-950'
                          : 'text-slate-400'
                      }`}
                    />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Compact Nav for XL screens */}
          <nav className="hidden xl:flex 2xl:hidden items-center gap-1 font-['Mitr',sans-serif]">
            {navLinks.slice(0, 7).map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    isActive ? 'text-slate-950 bg-amber-400 font-bold shadow-xs' : 'text-slate-700 hover:text-black hover:bg-amber-100/60 font-medium'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 font-['Mitr',sans-serif]">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              title="ค้นหา"
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-black hover:bg-amber-100/60 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                title="การแจ้งเตือน"
                className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-black hover:bg-amber-100/60 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-black text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">การแจ้งเตือน</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                          ใหม่ {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>อ่านทั้งหมด</span>
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-50 max-h-[360px] overflow-y-auto">
                    {notifications.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative ${
                            !item.read ? 'bg-emerald-50/20' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <p className={`text-xs ${!item.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                {item.title}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {item.detail}
                            </p>
                          </div>
                          {!item.read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                    >
                      ปิดหน้าต่าง
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User State */}
            {currentUser ? (
              <div className="flex items-center">
                <UserDropdown
                  user={{
                    name: currentUser.name || "Palad Academy",
                    username: currentUser.email ? `@${currentUser.email.split('@')[0]}` : "@Palad-Academy",
                    avatar: currentUser.avatar || "https://s.imgz.io/2026/10/19/-384c3bd9ee217dc12.png",
                    initials: (currentUser.name || "PA").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
                    status: userStatus,
                    role: currentUser.role,
                    email: currentUser.email
                  }}
                  selectedStatus={userStatus}
                  onStatusChange={(status) => setUserStatus(status)}
                  onAction={(action) => {
                    switch (action) {
                      case 'profile':
                      case 'settings':
                        onOpenProfile();
                        break;
                      case 'notifications':
                        setNotificationsOpen(true);
                        break;
                      case 'upgrade':
                        onNavigate('courses');
                        break;
                      case 'Missions':
                        onNavigate('lifepath');
                        break;
                      case 'help':
                        onNavigate('sanctuary');
                        break;
                      case 'switch':
                        if (onSwitchRole && currentUser) {
                          const nextRole = currentUser.role === 'student' ? 'instructor' : currentUser.role === 'instructor' ? 'admin' : 'student';
                          onSwitchRole(nextRole);
                        } else {
                          onOpenProfile();
                        }
                        break;
                      case 'logout':
                        onSignOut();
                        break;
                      default:
                        break;
                    }
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#000000] bg-[#FFC800] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 shadow-[0_2px_8px_rgba(255,200,0,0.35)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-200 cursor-pointer flex items-center gap-1.5 font-['Mitr',sans-serif] group/auth"
              >
                <LogIn className="w-3.5 h-3.5 text-[#000000] group-hover/auth:text-white transition-colors" />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/98 border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg font-['Mitr',sans-serif]">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'text-slate-950 bg-amber-400 font-bold border-l-4 border-slate-950'
                    : 'text-slate-700 hover:bg-amber-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 ${
                        link.heart
                          ? 'text-rose-500 fill-rose-200'
                          : isActive
                          ? 'text-slate-950'
                          : 'text-slate-400'
                      }`}
                    />
                  )}
                  <span>{link.label}</span>
                </div>
              </button>
            );
          })}
          {currentUser && (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 text-amber-800 bg-amber-50/80 cursor-pointer mt-2"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>โปรไฟล์นักศึกษา & กระดานผู้นำ ({currentUser.points || 850} XP)</span>
              </button>

              {onOpenCertificateVault && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCertificateVault();
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 text-amber-900 bg-amber-100/90 cursor-pointer mt-1"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Certificate Vault (คลังเกียรติบัตร) 🏆</span>
                </button>
              )}
            </>
          )}

          {!currentUser && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-[#000000] bg-[#FFC800] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 transition cursor-pointer font-['Mitr',sans-serif] group/mob"
              >
                <LogIn className="w-4 h-4 text-[#000000] group-hover/mob:text-white transition-colors" />
                <span>เข้าสู่ระบบ</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
