import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight, 
  Bell, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft,
  Database,
  Camera,
  Layers,
  Search,
  Activity,
  Home
} from 'lucide-react';
import { AdminUser, Course, BlogTopic, PeerStory, EventItem } from '../../types';

import { DashboardAnalyticsTab } from './DashboardAnalyticsTab';
import { AdminManagementTab } from './AdminManagementTab';
import { ContentManagementTab } from './ContentManagementTab';
import { KnowledgeBaseTab } from './KnowledgeBaseTab';
import { CoursePricingTab } from './CoursePricingTab';
import { LandingPageEventsTab } from './LandingPageEventsTab';
import { DatabaseManagementTab } from './DatabaseManagementTab';
import { ProfileAvatarModal } from '../ProfileAvatarModal';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  onLogout: () => void;
  onBackToSite: () => void;
  courses: Course[];
  blogs: BlogTopic[];
  stories: PeerStory[];
  events: EventItem[];
  heroBannerUrl: string;
  onUpdateHeroBanner: (newUrl: string) => void;
  onAddCourse: (newCourse: Course) => void;
  onUpdateCourse: (updatedCourse: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddBlog: (newBlog: BlogTopic) => void;
  onUpdateBlog: (updatedBlog: BlogTopic) => void;
  onDeleteBlog: (blogId: string) => void;
  onAddStory: (newStory: PeerStory) => void;
  onUpdateStory: (updatedStory: PeerStory) => void;
  onDeleteStory: (storyId: string) => void;
  onAddEvent: (newEvent: EventItem) => void;
  onUpdateEvent: (updatedEvent: EventItem) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateAdminAvatar?: (newUrl: string) => void;
}

export type AdminMenuTab = 
  | 'dashboard' 
  | 'admins' 
  | 'posts' 
  | 'knowledgeBase' 
  | 'courses' 
  | 'events'
  | 'database';

interface MenuGroup {
  groupName: string;
  items: {
    id: AdminMenuTab;
    label: string;
    subLabel: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  onLogout,
  onBackToSite,
  courses,
  blogs,
  stories,
  events,
  heroBannerUrl,
  onUpdateHeroBanner,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAddBlog,
  onUpdateBlog,
  onDeleteBlog,
  onAddStory,
  onUpdateStory,
  onDeleteStory,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onUpdateAdminAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<AdminMenuTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Grouped Navigation Structure for Systematic Organization
  const menuGroups: MenuGroup[] = [
    {
      groupName: 'ภาพรวมระบบ & สถิติ',
      items: [
        {
          id: 'dashboard',
          label: 'ภาพรวมระบบ (Analytics)',
          subLabel: 'สรุปผู้เรียน สถิติ และแบบทดสอบ',
          icon: LayoutDashboard,
          badge: 'เรียลไทม์',
        },
      ],
    },
    {
      groupName: 'ผู้ใช้งาน & สิทธิ์การเข้าถึง',
      items: [
        {
          id: 'admins',
          label: 'จัดการผู้ใช้งานและสิทธิ์ (RBAC)',
          subLabel: 'สิทธิ์ผู้เรียน/ผู้สอน, การลงทะเบียน, จัดกลุ่ม',
          icon: Users,
          badge: currentAdmin.role === 'super_admin' ? 'Super Admin' : undefined,
        },
      ],
    },
    {
      groupName: 'หลักสูตร & สื่อการเรียนรู้',
      items: [
        {
          id: 'courses',
          label: 'จัดการหลักสูตรและราคา (LMS)',
          subLabel: 'โครงสร้างบทเรียน, ล็อคเนื้อหา, คลังข้อสอบ',
          icon: DollarSign,
          badge: `${courses.length} คอร์ส`,
        },
      ],
    },
    {
      groupName: 'คอนเทนต์ & ชุมชนการเรียนรู้',
      items: [
        {
          id: 'posts',
          label: 'ตรวจสอบโพสต์และบล็อก',
          subLabel: 'อนุมัติ ลบ แก้ไขโพสต์ของผู้เรียน',
          icon: FileText,
          badge: `${blogs.length + stories.length}`,
        },
        {
          id: 'knowledgeBase',
          label: 'คลังความรู้ & เรื่องเล่าพี่ถึงน้อง',
          subLabel: 'สร้างและจัดหมวดหมู่บทความใหม่',
          icon: BookOpen,
          badge: 'เพิ่มบทความ',
        },
      ],
    },
    {
      groupName: 'หน้าเว็บไซต์ & โครงสร้างระบบ',
      items: [
        {
          id: 'events',
          label: 'แบนเนอร์และกิจกรรมหน้าแรก',
          subLabel: 'แบนเนอร์ Hero & เวิร์กช็อปนวัตกรรม',
          icon: Calendar,
          badge: `${events.length} กิจกรรม`,
        },
        {
          id: 'database',
          label: 'ฐานข้อมูล Supabase (PostgreSQL)',
          subLabel: 'เชื่อมต่อ API, ซิงค์ และคำสั่ง SQL',
          icon: Database,
          badge: 'Connected',
        },
      ],
    },
  ];

  // Helper for active tab title
  const currentTabInfo = menuGroups
    .flatMap((g) => g.items)
    .find((item) => item.id === activeTab);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-['Mitr',sans-serif]">
      {/* Topbar (Clean White Header) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
            aria-label="เปิดเมนูการจัดการ"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src="https://s.imgz.io/2026/10/09/-15c05850b66672cb62.png"
                alt="Logo"
                className="h-9 sm:h-11 w-auto object-contain shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
                  UDRU Admin Panel
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  ระบบบริหารจัดการ LMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ศูนย์การเรียนรู้ตลอดชีวิต มหาวิทยาลัยราชภัฏอุดรธานี
              </p>
            </div>
          </div>
        </div>

        {/* Topbar Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* System Online Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>เชื่อมต่อเรียลไทม์ · ปกติ</span>
          </div>

          {/* Back to Live Website Button */}
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs font-semibold border border-slate-200/90 shadow-2xs transition cursor-pointer"
            title="กลับไปยังหน้าบ้านของระบบ"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden xs:inline">ดูหน้าเว็บไซต์</span>
            <ExternalLink className="w-3 h-3 text-slate-400 hidden sm:inline" />
          </button>

          {/* Current Admin Profile Preview (Click to Crop / Upload Avatar) */}
          <div 
            onClick={() => setShowAvatarModal(true)}
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer group"
            title="คลิกเพื่ออัปโหลดและครอบตัดรูปโปรไฟล์ (Upload & Crop Profile Picture)"
          >
            <div className="relative">
              <img
                src={currentAdmin.avatar}
                alt={currentAdmin.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-amber-400 transition"
              />
              <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-white border border-slate-200 text-slate-700 group-hover:bg-amber-400 group-hover:text-slate-950 transition shadow-2xs">
                <Camera className="w-2.5 h-2.5" />
              </span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[140px] group-hover:text-amber-600 transition">
                {currentAdmin.name}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {currentAdmin.role === 'super_admin' ? 'Super Administrator' : 'ผู้ดูแลระบบย่อย'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setLogoutConfirm(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            title="ออกจากระบบ"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Tab Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-in fade-in"
          />
        )}

        {/* Sidebar (Clean White with Systematic Grouping) */}
        <aside
          className={`fixed lg:static top-16 sm:top-20 bottom-0 left-0 z-30 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Grouped Navigation Links */}
          <div className="p-4 space-y-6 overflow-y-auto">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {group.groupName}
                </div>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition cursor-pointer group ${
                          isActive
                            ? 'bg-slate-950 text-white shadow-xs font-bold'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-xl transition shrink-0 ${
                              isActive
                                ? 'bg-amber-400 text-slate-950 shadow-xs'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-200'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs truncate">{item.label}</p>
                            <p className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                              {item.subLabel}
                            </p>
                          </div>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer Info Card */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800 text-[11px]">สถานะเซิร์ฟเวอร์</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ออนไลน์
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                บัญชีใช้งาน: <strong className="text-slate-800">{currentAdmin.username}</strong>
              </p>
            </div>

            <button
              onClick={() => setLogoutConfirm(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer border border-rose-200 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>ออกจากระบบ (Logout)</span>
            </button>
          </div>
        </aside>

        {/* Content Area (Clean White & Organized) */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Breadcrumbs & Tab Header Bar */}
            <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium hover:text-slate-800 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Panel</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="font-bold text-slate-900 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                  {currentTabInfo?.label || 'แดชบอร์ด'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="hidden sm:inline">มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline" />
                <span className="font-mono text-slate-600">ภาคเรียนที่ 1/2569</span>
              </div>
            </div>

            {/* Dynamic Tab Content */}
            {activeTab === 'dashboard' && (
              <DashboardAnalyticsTab
                courses={courses}
                blogs={blogs}
                stories={stories}
              />
            )}

            {activeTab === 'admins' && (
              <AdminManagementTab
                currentAdmin={currentAdmin}
                courses={courses}
              />
            )}

            {activeTab === 'posts' && (
              <ContentManagementTab
                blogs={blogs}
                stories={stories}
                onUpdateBlog={onUpdateBlog}
                onDeleteBlog={onDeleteBlog}
                onUpdateStory={onUpdateStory}
                onDeleteStory={onDeleteStory}
              />
            )}

            {activeTab === 'knowledgeBase' && (
              <KnowledgeBaseTab
                onAddBlog={onAddBlog}
                onAddStory={onAddStory}
              />
            )}

            {activeTab === 'courses' && (
              <CoursePricingTab
                courses={courses}
                onAddCourse={onAddCourse}
                onUpdateCourse={onUpdateCourse}
                onDeleteCourse={onDeleteCourse}
              />
            )}

            {activeTab === 'events' && (
              <LandingPageEventsTab
                heroBannerUrl={heroBannerUrl}
                onUpdateHeroBanner={onUpdateHeroBanner}
                events={events}
                onAddEvent={onAddEvent}
                onUpdateEvent={onUpdateEvent}
                onDeleteEvent={onDeleteEvent}
              />
            )}

            {activeTab === 'database' && (
              <DatabaseManagementTab
                courses={courses}
                blogs={blogs}
                stories={stories}
                events={events}
              />
            )}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal (Clean White) */}
      {logoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                ยืนยันการออกจากระบบผู้ดูแล?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                เซสชันการดูแลระบบของคุณจะสิ้นสุดลง และระบบจะนำคุณกลับสู่หน้าเข้าสู่ระบบหลัก
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setLogoutConfirm(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  setLogoutConfirm(false);
                  onLogout();
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Avatar Crop & Upload Modal */}
      {showAvatarModal && (
        <ProfileAvatarModal
          currentUser={null}
          currentAdmin={currentAdmin}
          onClose={() => setShowAvatarModal(false)}
          onUpdateAvatar={(newUrl) => {
            if (onUpdateAdminAvatar) {
              onUpdateAdminAvatar(newUrl);
            }
            setShowAvatarModal(false);
          }}
        />
      )}
    </div>
  );
};
