import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PathwayCards } from './components/PathwayCards';
import { HomeStats } from './components/HomeStats';
import { PopularBlogs } from './components/PopularBlogs';
import { FeaturedCourses } from './components/FeaturedCourses';
import { UpcomingEventsSlider } from './components/UpcomingEventsSlider';
import { ScrollReveal } from './components/ScrollReveal';
import { Footer } from './components/Footer';

import { LifePathBuilder } from './components/LifePathBuilder';
import { CourseLibrary } from './components/CourseLibrary';
import { CourseDetailPage } from './components/CourseDetailPage';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { CertificateModal } from './components/CertificateModal';
import { CertificateVaultModal } from './components/CertificateVaultModal';
import { BlogLibrary } from './components/BlogLibrary';
import { BlogEditorPage } from './components/BlogEditorPage';
import { PeerStories } from './components/PeerStories';
import { EventsCalendar } from './components/EventsCalendar';
import { CounselingSanctuary } from './components/CounselingSanctuary';
import { AboutUs } from './components/AboutUs';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { SearchModal } from './components/SearchModal';
import { PostDetailView } from './components/PostDetailView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { UserProfileDashboard } from './components/UserProfileDashboard';
import { ConcurrentLoginModal } from './components/ConcurrentLoginModal';

import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  INITIAL_COURSES, 
  INITIAL_BLOG_TOPICS, 
  INITIAL_PEER_STORIES, 
  INITIAL_EVENTS, 
  INITIAL_MENTORS,
  ACHIEVEMENT_BADGES,
  LEADERBOARD_USERS
} from './data/mockData';
import { 
  Course, 
  BlogTopic, 
  PeerStory, 
  CertificateData, 
  User, 
  AchievementBadge, 
  LeaderboardUser,
  AdminUser,
  EventItem
} from './types';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Zap, X, ShieldCheck } from 'lucide-react';
import { 
  auth, 
  db, 
  seedInitialFirestoreData, 
  saveDocument, 
  removeDocument, 
  syncUserProfile, 
  signOutAuth, 
  validateFirebaseConnection 
} from './lib/firebase';
import {
  syncCourseToSupabase,
  syncBlogToSupabase,
  syncStoryToSupabase,
  syncEventToSupabase,
  deleteCourseFromSupabase,
  deleteBlogFromSupabase,
  deleteStoryFromSupabase,
  deleteEventFromSupabase,
  syncHeroBannerToSupabase,
} from './lib/supabase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc } from 'firebase/firestore';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Admin authentication state & Route Guard (Hydrated from LocalStorage)
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('udru_current_admin');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Hero Banner customization state
  const [heroBannerUrl, setHeroBannerUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('udru_hero_banner');
      if (saved && saved.trim()) {
        // If saved value is an old banner or video, prefer the requested new hero background
        if (
          saved.includes('hero-banner-banner') ||
          saved.includes('Homedd44c76a') ||
          saved.includes('flow.google.com/shared/video')
        ) {
          return 'https://s.imgz.io/2026/10/09/792ee306f311a1f20f74869bf0501cb8122544b471a93be1.png';
        }
        return saved;
      }
    } catch {}
    return 'https://s.imgz.io/2026/10/09/792ee306f311a1f20f74869bf0501cb8122544b471a93be1.png';
  });

  // Main data states with immediate local cache hydration
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('udru_col_courses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COURSES;
  });

  const [blogs, setBlogs] = useState<BlogTopic[]>(() => {
    try {
      const saved = localStorage.getItem('udru_col_blogs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BLOG_TOPICS;
  });

  const [stories, setStories] = useState<PeerStory[]>(() => {
    try {
      const saved = localStorage.getItem('udru_col_peerStories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PEER_STORIES;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('udru_col_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_EVENTS;
  });
  const [mentors] = useState(INITIAL_MENTORS);
  const [badges, setBadges] = useState<AchievementBadge[]>(ACHIEVEMENT_BADGES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(LEADERBOARD_USERS);

  // Active Post Detail View (Images 2 & 3)
  const [activeDetailPost, setActiveDetailPost] = useState<{
    post: BlogTopic | PeerStory;
    type: 'blog' | 'story';
  } | null>(null);

  // Student Profile / Gamification Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('udru_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      id: 'user-demo-1',
      name: 'ณภัทร วงศ์เจริญ (นักศึกษา)',
      email: 'naphat.w@udru.ac.th',
      role: 'student',
      gender: 'male',
      avatar: 'https://s.imgz.io/2026/10/01/-2154c895934348119.png',
      studentId: '6514020101',
      faculty: 'คณะวิทยาศาสตร์ สาขาสิ่งแวดล้อม',
      enrolledCourseIds: ['course-1'],
      completedCourseIds: [],
      savedPlansCount: 1,
      points: 850,
      level: 2,
      badges: ['badge-1', 'badge-2', 'badge-3']
    };
  });

  // Reward Toast Notification
  const [rewardToast, setRewardToast] = useState<{ amount: number; reason: string } | null>(null);

  // Dedicated Course Detail Page State (NO popups/modals, direct full-page redirect)
  const [activeDetailCourse, setActiveDetailCourse] = useState<Course | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activePlayingCourse, setActivePlayingCourse] = useState<Course | null>(null);
  const [activePaymentCourse, setActivePaymentCourse] = useState<Course | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null);
  const [isCertificateVaultOpen, setIsCertificateVaultOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConcurrentLoginOpen, setIsConcurrentLoginOpen] = useState(false);

  // Concurrent Login Session Protection Listener
  useEffect(() => {
    if (!currentUser) return;
    
    let mySessionId = sessionStorage.getItem('udru_my_session');
    if (!mySessionId) {
      mySessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('udru_my_session', mySessionId);
    }
    
    const activeSessionKey = `udru_session_${currentUser.id}`;
    const currentActive = localStorage.getItem(activeSessionKey);
    if (!currentActive) {
      localStorage.setItem(activeSessionKey, mySessionId);
    } else if (currentActive !== mySessionId) {
      setIsConcurrentLoginOpen(true);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === activeSessionKey) {
        const localSess = sessionStorage.getItem('udru_my_session');
        if (e.newValue && e.newValue !== localSess) {
          setIsConcurrentLoginOpen(true);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  // Hash routing listener for direct /#admin access
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setCurrentTab('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Firebase Auth listener and live Firestore collections subscription
  useEffect(() => {
    // 1. Initial boot test & seed initial data to Firestore if empty
    validateFirebaseConnection();
    seedInitialFirestoreData(INITIAL_COURSES, INITIAL_BLOG_TOPICS, INITIAL_PEER_STORIES, INITIAL_EVENTS);

    // 2. Auth state subscription
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await syncUserProfile(fbUser);
          setCurrentUser(profile);
          if (profile.role === 'admin' || fbUser.email === 'view.pafunchusang@gmail.com') {
            setCurrentAdmin({
              id: fbUser.uid,
              username: fbUser.email || 'admin',
              name: profile.name || fbUser.displayName || 'ผู้ดูแลระบบ',
              email: fbUser.email || '',
              role: 'super_admin',
              roleTitle: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
              avatar: profile.avatar || fbUser.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
              permissions: {
                canRead: true,
                canWrite: true,
                canEdit: true,
                canDelete: true,
                modules: {
                  dashboard: true,
                  admins: true,
                  posts: true,
                  knowledgeBase: true,
                  courses: true,
                  pricing: true,
                  landingPage: true,
                  events: true,
                }
              },
              status: 'active',
              createdAt: new Date().toISOString(),
              lastLogin: 'วันนี้'
            });
          }
        } catch (err) {
          console.error('Error syncing auth user:', err);
        }
      }
    });

    // 3. Live real-time Firestore synchronization
    const unsubCourses = onSnapshot(collection(db, 'courses'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Course);
        setCourses(list);
        try { localStorage.setItem('udru_col_courses', JSON.stringify(list)); } catch {}
      }
    }, (err) => console.warn('Courses listener:', err));

    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as BlogTopic);
        setBlogs(list);
        try { localStorage.setItem('udru_col_blogs', JSON.stringify(list)); } catch {}
      }
    }, (err) => console.warn('Blogs listener:', err));

    const unsubStories = onSnapshot(collection(db, 'peerStories'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as PeerStory);
        setStories(list);
        try { localStorage.setItem('udru_col_peerStories', JSON.stringify(list)); } catch {}
      }
    }, (err) => console.warn('Stories listener:', err));

    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as EventItem);
        setEvents(list);
        try { localStorage.setItem('udru_col_events', JSON.stringify(list)); } catch {}
      }
    }, (err) => console.warn('Events listener:', err));

    const unsubSettings = onSnapshot(doc(db, 'siteSettings', 'landing'), (snap) => {
      if (snap.exists() && snap.data().heroBannerUrl) {
        const remoteUrl = snap.data().heroBannerUrl;
        // If the stored URL is an old static banner or old video, use the user's latest hero background
        if (
          remoteUrl.includes('hero-banner-banner') ||
          remoteUrl.includes('Homedd44c76a') ||
          remoteUrl.includes('flow.google.com/shared/video') ||
          remoteUrl === 'https://s.imgz.io/2026/10/01/hero-banner-banner-b5ba381015f6fcab2.png'
        ) {
          setHeroBannerUrl('https://s.imgz.io/2026/10/09/792ee306f311a1f20f74869bf0501cb8122544b471a93be1.png');
        } else {
          setHeroBannerUrl(remoteUrl);
          try { localStorage.setItem('udru_hero_banner', remoteUrl); } catch {}
        }
      }
    }, (err) => console.warn('Settings listener:', err));

    return () => {
      unsubscribeAuth();
      unsubCourses();
      unsubBlogs();
      unsubStories();
      unsubEvents();
      unsubSettings();
    };
  }, []);

  // Handlers
  const handleNavigate = (tab: string) => {
    setActiveDetailPost(null);
    setActiveDetailCourse(null);
    setCurrentTab(tab);
    if (tab === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin') {
      history.replaceState(null, '', ' ');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setActiveDetailPost(null);
    setActiveDetailCourse(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOutAuth();
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setCurrentAdmin(null);
  };

  const handleSwitchRole = (newRole: 'student' | 'instructor' | 'admin' | 'lecturer') => {
    if (newRole === 'admin') {
      const adminObj: AdminUser = {
        id: 'admin-main-1',
        username: 'admin',
        name: 'ดร. นริศรา มหาวงศ์ (ผู้ดูแลระบบสูงสุด)',
        email: 'admin@udru.ac.th',
        role: 'super_admin',
        roleTitle: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        permissions: {
          canRead: true,
          canWrite: true,
          canEdit: true,
          canDelete: true,
          modules: {
            dashboard: true,
            admins: true,
            posts: true,
            knowledgeBase: true,
            courses: true,
            pricing: true,
            events: true,
            landingPage: true
          }
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: 'วันนี้'
      };
      setCurrentAdmin(adminObj);
      try {
        localStorage.setItem('udru_current_admin', JSON.stringify(adminObj));
      } catch {}
      handleNavigate('admin');
      handleRewardXP(20, 'สลับสู่บทบาทผู้ดูแลระบบ (Admin Panel)');
      return;
    }

    if (!currentUser) return;
    const isInstructor = newRole === 'instructor' || newRole === 'lecturer';
    const updated: User = {
      ...currentUser,
      role: isInstructor ? 'instructor' : 'student',
      name: isInstructor ? 'ผศ.ดร. ธีรภัทร วัฒนโกศล (อาจารย์ผู้สอน)' : 'ณภัทร วงศ์เจริญ (นักศึกษา)',
      faculty: isInstructor ? 'คณะมนุษยศาสตร์และสังคมศาสตร์ UDRU' : 'คณะวิทยาศาสตร์ สาขาสิ่งแวดล้อม'
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('udru_current_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (auth.currentUser && auth.currentUser.uid === currentUser.id) {
      saveDocument('users', updated).catch(err => console.warn('User role update error:', err));
    }
    handleRewardXP(10, `สลับสู่บทบาท ${isInstructor ? 'ผู้สอน/ผู้ช่วยสอน (Instructor)' : 'นักศึกษา (Student)'}`);
  };

  const handleRewardXP = (amount: number, reason: string) => {
    if (!currentUser) return;
    const newPoints = currentUser.points + amount;
    const newLevel = Math.floor(newPoints / 500) + 1;

    const updated = {
      ...currentUser,
      points: newPoints,
      level: newLevel
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('udru_current_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (auth.currentUser && auth.currentUser.uid === currentUser.id) {
      saveDocument('users', updated).catch(err => console.warn('XP update error:', err));
    }

    setRewardToast({ amount, reason });
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setRewardToast(null);
    }, 4500);
  };

  const handleAddBlog = (newBlog: BlogTopic) => {
    setBlogs((prev) => [newBlog, ...prev]);
    saveDocument('blogs', newBlog).catch(err => console.warn('Add blog error:', err));
    syncBlogToSupabase(newBlog).catch(() => {});
    handleRewardXP(30, 'แบ่งปันไอเดียใหม่ในห้องสมุดความรู้');
  };

  const handleUpdateBlog = (updatedBlog: BlogTopic) => {
    setBlogs((prev) => prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
    saveDocument('blogs', updatedBlog).catch(err => console.warn('Update blog error:', err));
    syncBlogToSupabase(updatedBlog).catch(() => {});
  };

  const handleDeleteBlog = (blogId: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    removeDocument('blogs', blogId).catch(err => console.warn('Delete blog error:', err));
    deleteBlogFromSupabase(blogId).catch(() => {});
  };

  const handleAddStory = (newStory: PeerStory) => {
    setStories((prev) => [newStory, ...stories]);
    saveDocument('peerStories', newStory).catch(err => console.warn('Add story error:', err));
    syncStoryToSupabase(newStory).catch(() => {});
    handleRewardXP(40, 'แบ่งปันเรื่องเล่าสร้างแรงบันดาลใจ (พี่ถึงน้อง)');
  };

  const handleUpdateStory = (updatedStory: PeerStory) => {
    setStories((prev) => prev.map((s) => (s.id === updatedStory.id ? updatedStory : s)));
    saveDocument('peerStories', updatedStory).catch(err => console.warn('Update story error:', err));
    syncStoryToSupabase(updatedStory).catch(() => {});
  };

  const handleDeleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    removeDocument('peerStories', storyId).catch(err => console.warn('Delete story error:', err));
    deleteStoryFromSupabase(storyId).catch(() => {});
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    saveDocument('courses', newCourse).catch(err => console.warn('Add course error:', err));
    syncCourseToSupabase(newCourse).catch(() => {});
    handleRewardXP(50, `เพิ่มหลักสูตรใหม่ "${newCourse.title}"`);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    saveDocument('courses', updatedCourse).catch(err => console.warn('Update course error:', err));
    syncCourseToSupabase(updatedCourse).catch(() => {});
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    removeDocument('courses', courseId).catch(err => console.warn('Delete course error:', err));
    deleteCourseFromSupabase(courseId).catch(() => {});
  };

  const handleAddEvent = (newEvent: EventItem) => {
    setEvents((prev) => [newEvent, ...prev]);
    saveDocument('events', newEvent).catch(err => console.warn('Add event error:', err));
    syncEventToSupabase(newEvent).catch(() => {});
  };

  const handleUpdateEvent = (updatedEvent: EventItem) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    saveDocument('events', updatedEvent).catch(err => console.warn('Update event error:', err));
    syncEventToSupabase(updatedEvent).catch(() => {});
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    removeDocument('events', eventId).catch(err => console.warn('Delete event error:', err));
    deleteEventFromSupabase(eventId).catch(() => {});
  };

  const handleUpdateHeroBanner = (newUrl: string) => {
    setHeroBannerUrl(newUrl);
    try {
      localStorage.setItem('udru_hero_banner', newUrl);
    } catch {}
    saveDocument('siteSettings', {
      id: 'landing',
      heroBannerUrl: newUrl,
      updatedBy: currentAdmin?.name || 'admin',
      updatedAt: new Date().toISOString()
    }).catch(err => console.warn('Update hero banner error:', err));
    syncHeroBannerToSupabase(newUrl).catch(() => {});
  };

  const handleIssueCertificate = (cert: CertificateData) => {
    setActiveCertificate(cert);
    handleRewardXP(150, `สำเร็จการศึกษาหลักสูตร "${cert.courseTitle}"`);

    // Unlock badge if not unlocked
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === 'badge-2' && !b.unlocked) {
          return { ...b, unlocked: true, unlockedAt: 'วันนี้' };
        }
        return b;
      })
    );
  };

  const handleUpdateAdminAvatar = (newAvatarUrl: string) => {
    if (!currentAdmin) return;
    const updated = { ...currentAdmin, avatar: newAvatarUrl };
    setCurrentAdmin(updated);
    try {
      localStorage.setItem('udru_current_admin', JSON.stringify(updated));
    } catch {}
    saveDocument('admins', updated).catch(() => {});
  };

  const handleUpdateUserAvatar = (newAvatarUrl: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, avatar: newAvatarUrl };
    setCurrentUser(updated);
    try {
      localStorage.setItem('udru_current_user', JSON.stringify(updated));
    } catch {}
    saveDocument('users', updated).catch(() => {});
  };

  // -------------------------------------------------------------
  // Route Guard: Admin Panel Mode
  // If user requests admin route and is NOT logged in:
  // Show AdminLogin with default credentials (admin / adminx)
  // If authenticated: Show full AdminDashboard with management tabs
  // -------------------------------------------------------------
  if (currentTab === 'admin') {
    if (!currentAdmin) {
      return (
        <AdminLogin
          onLoginSuccess={(admin) => {
            setCurrentAdmin(admin);
            try {
              localStorage.setItem('udru_current_admin', JSON.stringify(admin));
            } catch {}
            handleRewardXP(50, `ยินดีต้อนรับเข้าสู่ระบบ Admin Panel: ${admin.name}`);
          }}
          onBackToSite={() => handleNavigate('home')}
        />
      );
    }

    return (
      <AdminDashboard
        currentAdmin={currentAdmin}
        onLogout={() => {
          setCurrentAdmin(null);
          try {
            localStorage.removeItem('udru_current_admin');
          } catch {}
          handleNavigate('home');
        }}
        onBackToSite={() => handleNavigate('home')}
        courses={courses}
        blogs={blogs}
        stories={stories}
        events={events}
        heroBannerUrl={heroBannerUrl}
        onUpdateHeroBanner={handleUpdateHeroBanner}
        onAddCourse={handleAddCourse}
        onUpdateCourse={handleUpdateCourse}
        onDeleteCourse={handleDeleteCourse}
        onAddBlog={handleAddBlog}
        onUpdateBlog={handleUpdateBlog}
        onDeleteBlog={handleDeleteBlog}
        onAddStory={handleAddStory}
        onUpdateStory={handleUpdateStory}
        onDeleteStory={handleDeleteStory}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        onUpdateAdminAvatar={handleUpdateAdminAvatar}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Mitr','Prompt',sans-serif] selection:bg-amber-300 selection:text-slate-950">
      {/* Header with Sanctuary prominently on menu, and onOpenProfile handler */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCertificateVault={() => setIsCertificateVaultOpen(true)}
        onSwitchRole={handleSwitchRole}
      />

      {/* Floating Gamification Reward Toast */}
      {rewardToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <div>
            <p className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>+{rewardToast.amount} XP สะสมเพิ่ม!</span>
              <Sparkles className="w-3.5 h-3.5" />
            </p>
            <p className="text-[11px] text-slate-300 line-clamp-1">{rewardToast.reason}</p>
          </div>
          <button
            onClick={() => setRewardToast(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Switcher */}
      <main className="flex-1 animate-in fade-in duration-1000">
        {/* Dedicated Course Detail Page (NO Modal/Popup, full-page redirect) */}
        {activeDetailCourse ? (
          <CourseDetailPage
            course={activeDetailCourse}
            currentUser={currentUser}
            onBack={() => setActiveDetailCourse(null)}
            onOpenPlayer={(course) => setActivePlayingCourse(course)}
            onOpenPayment={(course) => setActivePaymentCourse(course)}
            onIssueCertificate={handleIssueCertificate}
            onRequireLogin={() => handleOpenAuth('signin')}
          />
        ) : activeDetailPost ? (
          <PostDetailView
            post={activeDetailPost.post}
            type={activeDetailPost.type}
            currentUser={currentUser}
            onBack={() => setActiveDetailPost(null)}
            onRewardXP={handleRewardXP}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <div className="animate-in fade-in duration-1000">
                {/* Header Hero Section: Border frame removed, clear background matching Image 1 */}
                <HeroSection
                  onStartLifePath={() => handleNavigate('lifepath')}
                  onExploreCourses={() => handleNavigate('courses')}
                  heroBannerUrl={heroBannerUrl}
                />

                {/* Standalone Learning Pathway Section (เลือกก้าวแรกบนเส้นทางการเรียนรู้ของคุณ) */}
                <ScrollReveal>
                  <PathwayCards
                    onStartLifePath={() => handleNavigate('lifepath')}
                    onExploreCourses={() => handleNavigate('courses')}
                  />
                </ScrollReveal>

                {/* Real-time stats with animated count-up numbers */}
                <ScrollReveal>
                  <HomeStats />
                </ScrollReveal>

                {/* Popular Blogs / Ideas */}
                <ScrollReveal>
                  <PopularBlogs
                    topics={blogs}
                    onSelectTopic={(topic) => {
                      setActiveDetailPost({ post: topic, type: 'blog' });
                    }}
                    onExploreAll={() => handleNavigate('blog')}
                    onOpenCreateModal={() => setCurrentTab('create-blog')}
                  />
                </ScrollReveal>

                {/* Featured Courses Slider / Carousel */}
                <ScrollReveal>
                  <FeaturedCourses
                    courses={courses}
                    onSelectCourse={handleSelectCourse}
                    onExploreAllCourses={() => handleNavigate('courses')}
                  />
                </ScrollReveal>

                {/* Premium Upcoming Events Slider (Replacing Section 7 as requested) */}
                <ScrollReveal>
                  <UpcomingEventsSlider
                    events={events}
                    onSelectEvent={() => handleNavigate('events')}
                    onExploreAllEvents={() => handleNavigate('events')}
                  />
                </ScrollReveal>
              </div>
            )}


            {currentTab === 'lifepath' && (
              <LifePathBuilder onSelectCourse={handleSelectCourse} />
            )}

            {currentTab === 'courses' && (
              <CourseLibrary
                courses={courses}
                onSelectCourse={handleSelectCourse}
              />
            )}

            {currentTab === 'blog' && (
              <BlogLibrary
                topics={blogs}
                currentUser={currentUser}
                onAddTopic={handleAddBlog}
                onSelectTopic={(topic) => {
                  setActiveDetailPost({ post: topic, type: 'blog' });
                }}
                onOpenCreatePage={() => setCurrentTab('create-blog')}
                onSwitchRole={handleSwitchRole}
              />
            )}

            {currentTab === 'create-blog' && (
              <BlogEditorPage
                currentUser={currentUser}
                onBack={() => setCurrentTab('blog')}
                onPublish={(newTopic) => {
                  handleAddBlog(newTopic);
                  setActiveDetailPost({ post: newTopic, type: 'blog' });
                }}
                onSaveDraft={(draftTopic) => {
                  handleAddBlog(draftTopic);
                  setCurrentTab('blog');
                }}
              />
            )}

            {currentTab === 'stories' && (
              <PeerStories
                stories={stories}
                currentUser={currentUser}
                onAddStory={handleAddStory}
                onSelectStory={(story) => {
                  setActiveDetailPost({ post: story, type: 'story' });
                }}
                onSwitchRole={handleSwitchRole}
              />
            )}

            {currentTab === 'events' && <EventsCalendar events={events} />}

            {currentTab === 'sanctuary' && <CounselingSanctuary mentors={mentors} />}

            {currentTab === 'about' && <AboutUs />}

            {currentTab === 'profile' && (
              <UserProfileDashboard
                currentUser={currentUser}
                courses={courses}
                blogs={blogs}
                onSwitchRole={handleSwitchRole}
                onNavigateToTab={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      {isAuthOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            handleRewardXP(50, 'เข้าสู่ระบบสำเร็จ ยินดีต้อนรับสู่ระบบการเรียนรู้');
          }}
          onAdminLogin={(admin) => {
            setCurrentAdmin(admin);
            setCurrentTab('admin');
            setIsAuthOpen(false);
            handleRewardXP(50, `ยินดีต้อนรับเข้าสู่ระบบ Admin Panel: ${admin.name}`);
          }}
        />
      )}

      {/* User Profile Dashboard (Role-Based 3-Column Interface) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <UserProfileDashboard
            currentUser={currentUser}
            courses={courses}
            blogs={blogs}
            onSwitchRole={handleSwitchRole}
            onNavigateToTab={(tab) => {
              setIsProfileModalOpen(false);
              handleNavigate(tab);
            }}
            onClose={() => setIsProfileModalOpen(false)}
            onOpenCertificateVault={() => {
              setIsCertificateVaultOpen(true);
            }}
            onUpdateAvatar={handleUpdateUserAvatar}
          />
        </div>
      )}

      {/* Certificate Vault Modal (คลังประวัติเกียรติบัตรทั้งหมดแบบ Grid พร้อมดาวน์โหลด PDF และแชร์โซเชียล) */}
      {isCertificateVaultOpen && (
        <CertificateVaultModal
          isOpen={isCertificateVaultOpen}
          onClose={() => setIsCertificateVaultOpen(false)}
          studentName={currentUser?.name || 'ณภัทร วงศ์เจริญ'}
          onViewFullCertificate={(cert) => {
            setActiveCertificate(cert);
          }}
        />
      )}

      {activePlayingCourse && (
        <CoursePlayerModal
          course={activePlayingCourse}
          currentUser={currentUser}
          onClose={() => setActivePlayingCourse(null)}
          onIssueCertificate={handleIssueCertificate}
          onOpenPayment={(course) => {
            setActivePaymentCourse(course);
          }}
        />
      )}

      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {activePaymentCourse && (
        <PaymentModal
          course={activePaymentCourse}
          onClose={() => setActivePaymentCourse(null)}
        />
      )}

      {isSearchOpen && (
        <SearchModal
          courses={courses}
          blogs={blogs}
          events={events}
          onClose={() => setIsSearchOpen(false)}
          onSelectCourse={(course) => {
            setIsSearchOpen(false);
            handleSelectCourse(course);
          }}
          onSelectBlog={(blog) => {
            setIsSearchOpen(false);
            setActiveDetailPost({ post: blog, type: 'blog' });
          }}
          onNavigate={handleNavigate}
        />
      )}

      {/* Concurrent Login Protection Alert Modal */}
      <ConcurrentLoginModal
        isOpen={isConcurrentLoginOpen}
        userName={currentUser?.name || 'ผู้ใช้งาน'}
        onForceContinue={() => {
          if (!currentUser) return;
          const freshId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          sessionStorage.setItem('udru_my_session', freshId);
          localStorage.setItem(`udru_session_${currentUser.id}`, freshId);
          setIsConcurrentLoginOpen(false);
        }}
        onSignOut={() => {
          setIsConcurrentLoginOpen(false);
          handleSignOut();
        }}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
