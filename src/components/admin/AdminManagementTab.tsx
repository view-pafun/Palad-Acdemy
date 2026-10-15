import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Shield, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Lock, 
  Unlock, 
  Mail, 
  Key, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  Calendar,
  Award,
  BookOpen,
  Send,
  CreditCard,
  RefreshCw,
  Copy,
  CheckCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { AdminUser, Course, User, UserRole, UserEnrollment } from '../../types';
import { INITIAL_ADMIN_USERS, INITIAL_REGISTERED_USERS } from '../../data/adminMockData';
import { saveDocument, removeDocument } from '../../lib/firebase';

interface AdminManagementTabProps {
  currentAdmin: AdminUser;
  courses?: Course[];
}

type ManagementSubTab = 'allUsers' | 'enrollment' | 'segmentation' | 'subAdmins';

export const AdminManagementTab: React.FC<AdminManagementTabProps> = ({
  currentAdmin,
  courses = [],
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ManagementSubTab>('allUsers');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sub-Admins State
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);

  // All Users State (Multi-Role: Student, Instructor, General Public, Admin)
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('udru_registered_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    // Initial default seed users spanning all roles
    return [
      {
        id: 'u-1',
        name: 'ณภัทร วงศ์เจริญ',
        email: 'naphat.w@udru.ac.th',
        role: 'student',
        studentId: '6514020101',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'สาขาสิ่งแวดล้อม',
        institute: 'มหาวิทยาลัยราชภัฏอุดรธานี',
        province: 'อุดรธานี',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        enrolledCourseIds: ['course-1', 'course-2'],
        enrollments: [
          {
            courseId: 'course-1',
            courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
            enrolledAt: '2026-08-15',
            accessDurationMonths: 12,
            expiresAt: '2027-08-15',
            status: 'active',
            paymentReference: 'SLIP-SCB-8831'
          },
          {
            courseId: 'course-2',
            courseTitle: 'AI & Digital Tools for Next-Gen Learning',
            enrolledAt: '2026-08-20',
            accessDurationMonths: 6,
            expiresAt: '2027-02-20',
            status: 'active',
            paymentReference: 'TRANSFER-KBANK-1049'
          }
        ],
        completedCourseIds: [],
        savedPlansCount: 2,
        points: 850,
        level: 2,
        badges: ['badge-1'],
        createdAt: '2026-08-15'
      },
      {
        id: 'u-2',
        name: 'กานต์ธิดา โชคประสิทธิ์',
        email: 'kanthida.c@udru.ac.th',
        role: 'student',
        studentId: '6511030452',
        faculty: 'คณะวิทยาการจัดการ',
        major: 'สาขาการตลาด',
        institute: 'มหาวิทยาลัยราชภัฏอุดรธานี',
        province: 'อุดรธานี',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        enrolledCourseIds: ['course-1'],
        enrollments: [
          {
            courseId: 'course-1',
            courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
            enrolledAt: '2026-08-20',
            accessDurationMonths: 12,
            expiresAt: '2027-08-20',
            status: 'active',
            paymentReference: 'ONLINE-PROMO'
          }
        ],
        completedCourseIds: [],
        savedPlansCount: 1,
        points: 720,
        level: 2,
        badges: ['badge-1'],
        createdAt: '2026-08-20'
      },
      {
        id: 'u-3',
        name: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
        email: 'teerapat.w@udru.ac.th',
        role: 'instructor',
        faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
        major: 'การพัฒนาชุมชนเชิงพื้นที่',
        institute: 'มหาวิทยาลัยราชภัฏอุดรธานี',
        province: 'อุดรธานี',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        enrolledCourseIds: ['course-1'],
        enrollments: [
          {
            courseId: 'course-1',
            courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
            enrolledAt: '2026-01-10',
            accessDurationMonths: 36,
            expiresAt: '2029-01-10',
            status: 'active',
            paymentReference: 'INSTRUCTOR-GRANT'
          }
        ],
        completedCourseIds: [],
        savedPlansCount: 5,
        points: 3500,
        level: 4,
        badges: ['badge-1', 'badge-2', 'badge-3'],
        createdAt: '2026-01-10'
      },
      {
        id: 'u-4',
        name: 'สมศักดิ์ เจริญพร',
        email: 'somsak.c@community-biz.org',
        role: 'general',
        organization: 'วิสาหกิจชุมชนเกษตรอินทรีย์บ้านผือ',
        province: 'อุดรธานี',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        enrolledCourseIds: ['course-1', 'course-3'],
        enrollments: [
          {
            courseId: 'course-1',
            courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
            enrolledAt: '2026-09-01',
            accessDurationMonths: 12,
            expiresAt: '2027-09-01',
            status: 'active',
            paymentReference: 'BANK-TRANSFER-9942'
          }
        ],
        completedCourseIds: [],
        savedPlansCount: 0,
        points: 320,
        level: 1,
        badges: ['badge-1'],
        createdAt: '2026-09-01'
      },
      {
        id: 'u-5',
        name: 'นงนุช รักวิชา',
        email: 'nongnuch.rak@gmail.com',
        role: 'general',
        organization: 'บุคคลทั่วไป',
        province: 'ขอนแก่น',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        status: 'active',
        enrolledCourseIds: ['course-2'],
        enrollments: [
          {
            courseId: 'course-2',
            courseTitle: 'AI & Digital Tools for Next-Gen Learning',
            enrolledAt: '2026-09-10',
            accessDurationMonths: 6,
            expiresAt: '2027-03-10',
            status: 'active',
            paymentReference: 'SLIP-PROMPT-7721'
          }
        ],
        completedCourseIds: [],
        savedPlansCount: 1,
        points: 410,
        level: 1,
        badges: [],
        createdAt: '2026-09-10'
      }
    ];
  });

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Modal States for User Management
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [resetPasswordModalUser, setResetPasswordModalUser] = useState<User | null>(null);
  const [generatedTempPassword, setGeneratedTempPassword] = useState('');
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Manual Enrollment Modal State
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedUserForEnrollment, setSelectedUserForEnrollment] = useState<string>('');
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<string>('');
  const [enrollmentDurationMonths, setEnrollmentDurationMonths] = useState<number>(12);
  const [enrollmentPaymentRef, setEnrollmentPaymentRef] = useState<string>('');

  // Segmentation & Targeted Broadcast State
  const [selectedSegmentationCourse, setSelectedSegmentationCourse] = useState<string>('all');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastPromoCode, setBroadcastPromoCode] = useState('');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  // Form State for Adding New User
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    studentId: '',
    faculty: '',
    major: '',
    institute: 'มหาวิทยาลัยราชภัฏอุดรธานี',
    province: 'อุดรธานี',
    password: '',
  });

  // Form State for Adding Sub-Admin
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    roleTitle: 'ฝ่ายบริหารจัดการระบบ',
    canRead: true,
    canWrite: true,
    canEdit: false,
    canDelete: false,
    modules: {
      dashboard: true,
      admins: false,
      posts: true,
      knowledgeBase: true,
      courses: false,
      pricing: false,
      landingPage: false,
      events: true,
    }
  });

  // Toast Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync users to storage whenever updated
  const syncUsersToStorage = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    try {
      localStorage.setItem('udru_registered_users', JSON.stringify(updatedUsers));
    } catch {}
  };

  // 1. Create New User Handler
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: newUserForm.role,
      avatar: newUserForm.role === 'instructor' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      studentId: newUserForm.role === 'student' ? newUserForm.studentId : undefined,
      institute: newUserForm.role !== 'general' ? newUserForm.institute : undefined,
      faculty: newUserForm.role !== 'general' ? newUserForm.faculty : undefined,
      major: newUserForm.role !== 'general' ? newUserForm.major : undefined,
      organization: newUserForm.role === 'general' ? 'บุคคลทั่วไป' : newUserForm.faculty,
      province: newUserForm.province,
      status: 'active',
      password: newUserForm.password || 'Udru2026!',
      enrolledCourseIds: [],
      enrollments: [],
      completedCourseIds: [],
      savedPlansCount: 0,
      points: 100,
      level: 1,
      badges: ['badge-1'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const nextList = [newUser, ...users];
    syncUsersToStorage(nextList);
    saveDocument('users', newUser).catch(() => {});
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(() => {});

    setShowAddUserModal(false);
    showToast(`สร้างผู้ใช้งาน "${newUser.name}" (${newUser.role}) สำเร็จแล้ว`);
    setNewUserForm({
      name: '',
      email: '',
      role: 'student',
      studentId: '',
      faculty: '',
      major: '',
      institute: 'มหาวิทยาลัยราชภัฏอุดรธานี',
      province: 'อุดรธานี',
      password: '',
    });
  };

  // 2. Save Edited User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const nextList = users.map(u => u.id === editingUser.id ? editingUser : u);
    syncUsersToStorage(nextList);
    saveDocument('users', editingUser).catch(() => {});
    fetch(`/api/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingUser)
    }).catch(() => {});

    showToast(`อัปเดตข้อมูลผู้ใช้งาน "${editingUser.name}" เรียบร้อยแล้ว`);
    setEditingUser(null);
  };

  // 3. Toggle User Suspend / Active Status
  const handleToggleUserStatus = (userId: string) => {
    const nextList = users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
        const updated = { ...u, status: nextStatus as 'active' | 'suspended' };
        saveDocument('users', updated).catch(() => {});
        return updated;
      }
      return u;
    });
    syncUsersToStorage(nextList);
    showToast('ปรับสถานะการเข้าใช้งานของผู้ใช้เรียบร้อย');
  };

  // 4. Delete User
  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    const nextList = users.filter(u => u.id !== userToDelete.id);
    syncUsersToStorage(nextList);
    removeDocument('users', userToDelete.id).catch(() => {});
    fetch(`/api/users/${userToDelete.id}`, { method: 'DELETE' }).catch(() => {});
    showToast(`ลบผู้ใช้งาน "${userToDelete.name}" ออกจากระบบแล้ว`);
    setUserToDelete(null);
  };

  // 5. Reset Password Handler
  const handleTriggerResetPassword = (user: User) => {
    const tempPass = 'UdruPass' + Math.floor(1000 + Math.random() * 9000) + '!';
    setGeneratedTempPassword(tempPass);
    setResetPasswordModalUser(user);
    setCopiedPassword(false);

    // Save temporary password on user
    const updatedUser = { ...user, password: tempPass };
    const nextList = users.map(u => u.id === user.id ? updatedUser : u);
    syncUsersToStorage(nextList);
    fetch(`/api/users/${user.id}/reset-password`, { method: 'POST' }).catch(() => {});
  };

  // 6. Manual Enrollment Handler (Off-system Bank Transfers)
  const handlePerformManualEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEnrollment || !selectedCourseForEnrollment) {
      showToast('⚠️ กรุณาเลือกผู้เรียนและหลักสูตรที่ต้องการลงทะเบียน');
      return;
    }

    const courseObj = courses.find(c => c.id === selectedCourseForEnrollment);
    const courseTitle = courseObj ? courseObj.title : 'หลักสูตรออนไลน์';

    const now = new Date();
    let expiresAt: string | null = null;
    if (enrollmentDurationMonths > 0) {
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + enrollmentDurationMonths);
      expiresAt = expDate.toISOString().split('T')[0];
    }

    const newEnrollment: UserEnrollment = {
      courseId: selectedCourseForEnrollment,
      courseTitle,
      enrolledAt: now.toISOString().split('T')[0],
      accessDurationMonths: enrollmentDurationMonths,
      expiresAt,
      status: 'active',
      paymentReference: enrollmentPaymentRef || 'BANK-TRANSFER-MANUAL'
    };

    const nextList = users.map(u => {
      if (u.id === selectedUserForEnrollment) {
        const existingEnrollments = u.enrollments || [];
        const filteredEnrollments = existingEnrollments.filter(e => e.courseId !== selectedCourseForEnrollment);
        const updatedEnrollments = [newEnrollment, ...filteredEnrollments];
        const enrolledCourseIds = Array.from(new Set([selectedCourseForEnrollment, ...(u.enrolledCourseIds || [])]));

        const updated = {
          ...u,
          enrolledCourseIds,
          enrollments: updatedEnrollments
        };
        saveDocument('users', updated).catch(() => {});
        return updated;
      }
      return u;
    });

    syncUsersToStorage(nextList);
    setShowEnrollmentModal(false);
    setSelectedCourseForEnrollment('');
    setEnrollmentPaymentRef('');
    showToast(`อนุมัติและเพิ่มสิทธิ์การเข้าเรียนหลักสูตร "${courseTitle}" สำเร็จ!`);
  };

  // 7. Revoke or Expire Enrollment
  const handleRevokeEnrollment = (userId: string, courseId: string) => {
    const nextList = users.map(u => {
      if (u.id === userId) {
        const updatedEnrollments = (u.enrollments || []).map(e => {
          if (e.courseId === courseId) {
            return { ...e, status: 'expired' as const };
          }
          return e;
        });
        const updatedCourseIds = (u.enrolledCourseIds || []).filter(id => id !== courseId);
        const updated = {
          ...u,
          enrolledCourseIds: updatedCourseIds,
          enrollments: updatedEnrollments
        };
        saveDocument('users', updated).catch(() => {});
        return updated;
      }
      return u;
    });
    syncUsersToStorage(nextList);
    showToast('เพิกถอนสิทธิ์การเข้าเรียนหลักสูตรเรียบร้อย');
  };

  // 8. Send Targeted Broadcast Announcement
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      showToast('⚠️ กรุณากรอกหัวข้อและข้อความประกาศ');
      return;
    }

    setIsSendingBroadcast(true);
    fetch('/api/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetCourseId: selectedSegmentationCourse,
        title: broadcastTitle,
        message: broadcastMessage,
        promoCode: broadcastPromoCode,
        sentBy: currentAdmin.name
      })
    }).catch(() => {});

    setTimeout(() => {
      setIsSendingBroadcast(false);
      showToast(`📢 ส่งประกาศและโปรโมชันไปยังกลุ่มเป้าหมายสำเร็จ! (${targetedUsers.length} คนได้รับข้อความ)`);
      setBroadcastTitle('');
      setBroadcastMessage('');
      setBroadcastPromoCode('');
    }, 600);
  };

  // Sub-Admins Handlers
  const handleAddSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.username || !newAdminForm.email) return;

    const newSubAdmin: AdminUser = {
      id: `admin-sub-${Date.now()}`,
      username: newAdminForm.username.toLowerCase().trim(),
      name: `${newAdminForm.name} (Sub-Admin)`,
      email: newAdminForm.email.trim(),
      role: 'sub_admin',
      roleTitle: newAdminForm.roleTitle,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      permissions: {
        canRead: newAdminForm.canRead,
        canWrite: newAdminForm.canWrite,
        canEdit: newAdminForm.canEdit,
        canDelete: newAdminForm.canDelete,
        modules: { ...newAdminForm.modules }
      },
      status: 'active',
      createdAt: 'วันนี้',
      lastLogin: 'ยังไม่เคยเข้าสู่ระบบ'
    };

    setAdmins([...admins, newSubAdmin]);
    setShowAddSubAdminModal(false);
    showToast(`เพิ่มผู้ดูแลระบบย่อย "${newSubAdmin.name}" สำเร็จแล้ว`);
  };

  const handleSaveEditedPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setAdmins(admins.map(a => a.id === editingAdmin.id ? editingAdmin : a));
    setEditingAdmin(null);
    showToast(`อัปเดตสิทธิ์ของ "${editingAdmin.name}" เรียบร้อยแล้ว`);
  };

  const handleToggleAdminStatus = (adminId: string) => {
    setAdmins(admins.map(a => {
      if (a.id === adminId) {
        return { ...a, status: a.status === 'active' ? 'suspended' : 'active' };
      }
      return a;
    }));
    showToast('ปรับปรุงสถานะผู้ดูแลระบบเรียบร้อย');
  };

  const handleDeleteAdmin = (admin: AdminUser) => {
    if (admin.id === 'admin-super-1' || admin.role === 'super_admin') {
      showToast('⚠️ ไม่สามารถลบ Super Admin หลักของระบบได้');
      return;
    }
    setAdminToDelete(admin);
  };

  // Filtered Users computation
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch = searchTerm.trim() === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId && user.studentId.includes(searchTerm)) ||
      (user.faculty && user.faculty.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesStatus && matchesSearch;
  });

  // Targeted users for Segmentation
  const targetedUsers = users.filter(u => {
    if (selectedSegmentationCourse === 'all') return true;
    return (u.enrolledCourseIds || []).includes(selectedSegmentationCourse);
  });

  return (
    <div className="space-y-6 font-['Mitr',sans-serif]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-2.5 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>จัดการผู้ใช้งานและสิทธิ์ (Users & RBAC Management)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            ระบบจัดการสิทธิ์ผู้ใช้งานทุกระดับ (CRUD), การลงทะเบียนเรียนแบบกำหนดอายุ และระบบจัดกลุ่มผู้เรียน (Segmentation)
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {activeSubTab === 'allUsers' && (
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-300" />
              <span>+ เพิ่มผู้ใช้งานใหม่</span>
            </button>
          )}

          {activeSubTab === 'enrollment' && (
            <button
              onClick={() => setShowEnrollmentModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>+ ลงทะเบียนเรียนด้วยสลิปโอนเงิน</span>
            </button>
          )}

          {activeSubTab === 'subAdmins' && (
            <button
              onClick={() => setShowAddSubAdminModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-300" />
              <span>+ เพิ่มแอดมินย่อย (Sub-Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('allUsers')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'allUsers'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>ผู้ใช้งานทั้งหมด ({users.length} คน)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('enrollment')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'enrollment'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>การลงทะเบียนเรียน & กำหนดวันหมดอายุ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('segmentation')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'segmentation'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-4 h-4 text-purple-600" />
          <span>จัดกลุ่มผู้เรียน & บรอดแคสต์ (Segmentation)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('subAdmins')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'subAdmins'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-600" />
          <span>ผู้ดูแลระบบย่อย (Sub-Admins & สิทธิ์)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: ALL USERS MANAGEMENT (CRUD & RBAC) */}
      {/* ======================================================== */}
      {activeSubTab === 'allUsers' && (
        <div className="space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาด้วยชื่อ, อีเมล, รหัสนักศึกษา หรือคณะ..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>บทบาท:</span>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">ทั้งหมด (All Roles)</option>
                <option value="student">นักศึกษา (Student)</option>
                <option value="instructor">อาจารย์ (Instructor)</option>
                <option value="general">บุคคลทั่วไป (General)</option>
                <option value="admin">ผู้ดูแลระบบ (Admin)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">ทุกสถานะ (All Status)</option>
                <option value="active">ปกติ (Active)</option>
                <option value="suspended">ระงับการใช้งาน (Suspended)</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">
                รายชื่อผู้ใช้งานทั้งหมด ({filteredUsers.length} จาก {users.length} คน)
              </span>
              <span className="text-xs text-slate-400">ระบบ Role-Based Access Control (RBAC)</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">ผู้ใช้งาน</th>
                    <th className="py-3.5 px-4">บทบาท (Role)</th>
                    <th className="py-3.5 px-4">สังกัด / คณะ / สาขา</th>
                    <th className="py-3.5 px-4 text-center">คอร์สที่เรียน</th>
                    <th className="py-3.5 px-4 text-center">สถานะ</th>
                    <th className="py-3.5 px-4 text-right">การจัดการ (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                            {user.studentId && (
                              <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                                รหัส: {user.studentId}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.role === 'admin' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : user.role === 'instructor'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : user.role === 'student'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-purple-100 text-purple-900 border border-purple-200'
                        }`}>
                          {user.role === 'admin' ? '👑 Admin' :
                           user.role === 'instructor' ? '👨‍🏫 อาจารย์' :
                           user.role === 'student' ? '🎓 นักศึกษา' : '🌐 บุคคลทั่วไป'}
                        </span>
                      </td>

                      {/* Affiliation / Faculty */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {user.faculty || user.organization || '-'}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {user.major ? `สาขา ${user.major}` : user.institute || user.province || '-'}
                        </p>
                      </td>

                      {/* Enrolled Courses Count */}
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-800">
                        {user.enrolledCourseIds ? user.enrolledCourseIds.length : 0} คอร์ส
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            user.status !== 'suspended'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {user.status !== 'suspended' ? '● ใช้งานปกติ' : '✕ ระงับสิทธิ์'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleTriggerResetPassword(user)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                            title="รีเซ็ตรหัสผ่าน (Reset Password)"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setEditingUser(JSON.parse(JSON.stringify(user)))}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                            title="แก้ไขข้อมูลผู้ใช้"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                            title="ลบผู้ใช้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: MANUAL ENROLLMENT & EXPIRY CONTROL */}
      {/* ======================================================== */}
      {activeSubTab === 'enrollment' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold mb-0.5">
                ระบบจัดการสิทธิ์เข้าเรียนและการโอนเงินนอกระบบ (Manual Enrollment):
              </strong>
              สำหรับกรณีผู้เรียนชำระเงินผ่านการโอนบัญชีธนาคาร (Off-system bank transfer) แอดมินสามารถกำหนดสิทธิ์เข้าเรียนรายคอร์ส พร้อมระบุระยะเวลาเข้าถึง (Access Duration) เช่น 1 เดือน, 6 เดือน, 1 ปี หรือตลอดชีพ ระบบจะตัดสิทธิ์อัตโนมัติเมื่อครบกำหนด
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>ประวัติและสถานะการลงทะเบียนเรียนทั้งหมด</span>
              </h3>
              <button
                onClick={() => setShowEnrollmentModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                + เพิ่มสิทธิ์เรียนรายบุคคล
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">ผู้เรียน</th>
                    <th className="py-3.5 px-4">หลักสูตรที่ลงทะเบียน</th>
                    <th className="py-3.5 px-4">วันที่ลงทะเบียน</th>
                    <th className="py-3.5 px-4">ระยะเวลา / วันหมดอายุ</th>
                    <th className="py-3.5 px-4">เลขอ้างอิงชำระเงิน</th>
                    <th className="py-3.5 px-4 text-center">สถานะสิทธิ์</th>
                    <th className="py-3.5 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.flatMap(u => (u.enrollments || []).map(en => ({ user: u, enrollment: en }))).map(({ user, enrollment }, idx) => (
                    <tr key={`${user.id}-${enrollment.courseId}-${idx}`} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs">
                        {enrollment.courseTitle || enrollment.courseId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {enrollment.enrolledAt}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">
                          {enrollment.accessDurationMonths === 0 ? 'ตลอดชีพ (Lifetime)' : `${enrollment.accessDurationMonths || 12} เดือน`}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          หมดอายุ: {enrollment.expiresAt || 'ไม่มีกำหนด'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-800 font-semibold">
                        {enrollment.paymentReference || 'SLIP-VERIFIED'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          enrollment.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {enrollment.status === 'active' ? 'กำลังเรียน (Active)' : 'หมดอายุ (Expired)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {enrollment.status === 'active' ? (
                          <button
                            onClick={() => handleRevokeEnrollment(user.id, enrollment.courseId)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition cursor-pointer"
                          >
                            เพิกถอนสิทธิ์
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedUserForEnrollment(user.id);
                              setSelectedCourseForEnrollment(enrollment.courseId);
                              setShowEnrollmentModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition cursor-pointer"
                          >
                            ต่ออายุสิทธิ์
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: USER SEGMENTATION DASHBOARD & BROADCAST */}
      {/* ======================================================== */}
      {activeSubTab === 'segmentation' && (
        <div className="space-y-6">
          
          {/* Cohort Segmentation Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <span>จัดกลุ่มผู้เรียนตามหลักสูตรที่ลงทะเบียน (User Segmentation)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  คัดกรองกลุ่มเป้าหมายเพื่อส่งประกาศแจ้งเตือน บทเรียนใหม่ หรือโปรโมชันพิเศษ
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">เลือกกลุ่มหลักสูตร:</span>
                <select
                  value={selectedSegmentationCourse}
                  onChange={(e) => setSelectedSegmentationCourse(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="all">ทุกหลักสูตร (ทั้งหมด {users.length} คน)</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Segment KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-950">
                <span className="text-[11px] font-bold text-purple-700 block">จำนวนผู้เรียนในกลุ่มนี้</span>
                <p className="text-2xl font-black font-mono mt-1">{targetedUsers.length} คน</p>
                <span className="text-[10px] text-purple-600">
                  {Math.round((targetedUsers.length / (users.length || 1)) * 100)}% ของผู้ใช้ทั้งหมด
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                <span className="text-[11px] font-bold text-emerald-700 block">สถานะการเรียนที่เปิดใช้งาน</span>
                <p className="text-2xl font-black font-mono mt-1">
                  {targetedUsers.filter(u => u.status !== 'suspended').length} คน
                </p>
                <span className="text-[10px] text-emerald-600">Active Learners</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950">
                <span className="text-[11px] font-bold text-blue-700 block">อัตราการสะสมคะแนนเฉลี่ย</span>
                <p className="text-2xl font-black font-mono mt-1">
                  {Math.round(targetedUsers.reduce((sum, u) => sum + (u.points || 0), 0) / (targetedUsers.length || 1))} แต้ม
                </p>
                <span className="text-[10px] text-blue-600">UDRU XP Leaderboard</span>
              </div>
            </div>

            {/* Targeted Users Preview List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-800 block">
                รายชื่อผู้เรียนในกลุ่มเป้าหมายนี้ ({targetedUsers.length} คน):
              </span>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                {targetedUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-[11px]">
                    <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                    <span className="font-semibold text-slate-800">{u.name}</span>
                    <span className="text-[9px] text-slate-400">({u.role})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Broadcast Announcement Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <span>ส่งประกาศหรือโปรโมชันเฉพาะกลุ่ม (Targeted Announcement)</span>
              </h3>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                ถึงผู้เรียน {targetedUsers.length} คน
              </span>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">หัวข้อประกาศ *</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="เช่น ประกาศกำหนดส่งงานโปรเจกต์นวัตกรรม หรือ ส่วนลด 20% คอร์สถัดไป"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">ข้อความประกาศฉบับเต็ม *</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="พิมพ์ข้อความที่ต้องการแจ้งเตือนไปยังกลุ่มผู้เรียนนี้โดยเฉพาะ..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">โค้ดส่วนลดโปรโมชัน (ถ้ามี)</label>
                  <input
                    type="text"
                    value={broadcastPromoCode}
                    onChange={(e) => setBroadcastPromoCode(e.target.value.toUpperCase())}
                    placeholder="เช่น UDRU-NEXT-20"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ช่องทางการแจ้งเตือน</label>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4 text-slate-600">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>In-App Banner</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>Email Digest</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSendingBroadcast}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  <span>{isSendingBroadcast ? 'กำลังส่งประกาศ...' : 'ส่งประกาศทันที (Broadcast)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: SUB-ADMINS & GRANULAR PERMISSIONS */}
      {/* ======================================================== */}
      {activeSubTab === 'subAdmins' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold mb-0.5">
                การควบคุมสิทธิ์ผู้ดูแลระบบย่อย (Sub-Admin RBAC):
              </strong>
              Super Admin สามารถแต่งตั้งผู้ดูแลระบบย่อย พร้อมจำกัดสิทธิ์การเข้าถึงแต่ละโมดูล (Dashboard, Admins, Posts, KnowledgeBase, Courses, Pricing, Events) และระดับการกระทำ (Read, Write, Edit, Delete)
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">รายชื่อผู้ดูแลระบบ ({admins.length} คน)</span>
              <span className="text-xs text-slate-400">สถานะ: เข้ารหัสระดับสูง</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">ผู้ดูแลระบบ</th>
                    <th className="py-3.5 px-4">บทบาท / ตำแหน่ง</th>
                    <th className="py-3.5 px-4">สิทธิ์การดำเนินการ (Permissions)</th>
                    <th className="py-3.5 px-4 text-center">สถานะ</th>
                    <th className="py-3.5 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900">{admin.name}</p>
                              {admin.role === 'super_admin' && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[9px]">
                                  👑 SUPER
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">@{admin.username} · {admin.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-medium block">{admin.roleTitle}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            admin.permissions.canRead ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400 line-through'
                          }`}>
                            อ่าน (R)
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            admin.permissions.canWrite ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400 line-through'
                          }`}>
                            เขียน (W)
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            admin.permissions.canEdit ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400 line-through'
                          }`}>
                            แก้ไข (E)
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            admin.permissions.canDelete ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400 line-through'
                          }`}>
                            ลบ (D)
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleAdminStatus(admin.id)}
                          disabled={admin.role === 'super_admin'}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            admin.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {admin.status === 'active' ? '● ปกติ' : '✕ ระงับสิทธิ์'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingAdmin(JSON.parse(JSON.stringify(admin)))}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                            title="แก้ไขสิทธิ์"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {admin.role !== 'super_admin' && (
                            <button
                              onClick={() => handleDeleteAdmin(admin)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                              title="ลบแอดมินย่อย"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD NEW USER (Student / Instructor / General) */}
      {/* ======================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">เพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ</h3>
                <p className="text-xs text-slate-500">กำหนดบทบาทและรายละเอียดข้อมูลส่วนบุคคล</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold text-slate-800 block mb-1">เลือกบทบาท (Role) *</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="student">🎓 นักศึกษา (Student)</option>
                  <option value="instructor">👨‍🏫 อาจารย์ / ผู้สอน (Instructor)</option>
                  <option value="general">🌐 บุคคลทั่วไป (General Public)</option>
                  <option value="admin">👑 ผู้ดูแลระบบ (Admin)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="เช่น นายกฤษฎา พรหมเสน"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">อีเมล (Email) *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="name@udru.ac.th หรือ name@gmail.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">รหัสผ่านเริ่มต้น *</label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="หากเว้นว่าง จะตั้งเป็น Udru2026!"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Conditional fields for student & instructor */}
              {newUserForm.role !== 'general' && (
                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2.5">
                  <span className="text-[11px] font-bold text-emerald-950 block">ข้อมูลสถาบันการศึกษา:</span>
                  
                  {newUserForm.role === 'student' && (
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">รหัสนักศึกษา</label>
                      <input
                        type="text"
                        value={newUserForm.studentId}
                        onChange={(e) => setNewUserForm({ ...newUserForm, studentId: e.target.value })}
                        placeholder="เช่น 6514020101"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">คณะ / หน่วยงาน</label>
                      <input
                        type="text"
                        value={newUserForm.faculty}
                        onChange={(e) => setNewUserForm({ ...newUserForm, faculty: e.target.value })}
                        placeholder="เช่น คณะวิทยาศาสตร์"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">สาขาวิชา</label>
                      <input
                        type="text"
                        value={newUserForm.major}
                        onChange={(e) => setNewUserForm({ ...newUserForm, major: e.target.value })}
                        placeholder="เช่น สิ่งแวดล้อม"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  สร้างบัญชีผู้ใช้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT USER */}
      {/* ======================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">แก้ไขข้อมูลผู้ใช้งาน</h3>
                <p className="text-xs text-slate-500">{editingUser.name}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">บทบาท (Role) *</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  <option value="student">🎓 นักศึกษา (Student)</option>
                  <option value="instructor">👨‍🏫 อาจารย์ / ผู้สอน (Instructor)</option>
                  <option value="general">🌐 บุคคลทั่วไป (General Public)</option>
                  <option value="admin">👑 ผู้ดูแลระบบ (Admin)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">อีเมล *</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">คณะ / หน่วยงาน</label>
                  <input
                    type="text"
                    value={editingUser.faculty || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, faculty: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">สาขาวิชา</label>
                  <input
                    type="text"
                    value={editingUser.major || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, major: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">สถานะบัญชี</label>
                <select
                  value={editingUser.status || 'active'}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="active">ปกติ (Active)</option>
                  <option value="suspended">ระงับการใช้งาน (Suspended)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: MANUAL ENROLLMENT FOR BANK TRANSFER */}
      {/* ======================================================== */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            <button
              onClick={() => setShowEnrollmentModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">อนุมัติสิทธิ์เข้าเรียน (Manual Enrollment)</h3>
                <p className="text-xs text-slate-500">สำหรับยอดชำระโอนเงินผ่านธนาคารหรือบัญชีออฟไลน์</p>
              </div>
            </div>

            <form onSubmit={handlePerformManualEnrollment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">เลือกผู้เรียน *</label>
                <select
                  required
                  value={selectedUserForEnrollment}
                  onChange={(e) => setSelectedUserForEnrollment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  <option value="">-- กรุณาเลือกผู้เรียน --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) - {u.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">เลือกหลักสูตรที่ต้องการลงทะเบียน *</label>
                <select
                  required
                  value={selectedCourseForEnrollment}
                  onChange={(e) => setSelectedCourseForEnrollment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  <option value="">-- กรุณาเลือกหลักสูตร --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.isFree ? 'ฟรี' : `฿${c.price}`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">ระยะเวลาการเข้าถึง (Expiry Duration) *</label>
                <select
                  value={enrollmentDurationMonths}
                  onChange={(e) => setEnrollmentDurationMonths(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  <option value={1}>1 เดือน (30 วัน)</option>
                  <option value={3}>3 เดือน (90 วัน)</option>
                  <option value={6}>6 เดือน (180 วัน)</option>
                  <option value={12}>1 ปี (365 วัน - ค่าเริ่มต้น)</option>
                  <option value={24}>2 ปี (730 วัน)</option>
                  <option value={0}>ตลอดชีพ (Lifetime Access)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">หมายเลขอ้างอิงสลิป / บัญชีโอนเงิน</label>
                <input
                  type="text"
                  value={enrollmentPaymentRef}
                  onChange={(e) => setEnrollmentPaymentRef(e.target.value)}
                  placeholder="เช่น SLIP-SCB-84920 หรือ KBANK-TRANSFER-55"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEnrollmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  อนุมัติการลงทะเบียนเรียน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: RESET PASSWORD POPUP */}
      {/* ======================================================== */}
      {resetPasswordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-base">รีเซ็ตรหัสผ่านสำเร็จ</h4>
              <p className="text-xs text-slate-500 mt-1">
                สร้างรหัสผ่านชั่วคราวสำหรับ: <strong className="text-slate-800">{resetPasswordModalUser.name}</strong>
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="font-mono font-black text-sm text-slate-900 tracking-wider">
                {generatedTempPassword}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedTempPassword);
                  setCopiedPassword(true);
                  setTimeout(() => setCopiedPassword(false), 2000);
                }}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                title="คัดลอกรหัสผ่าน"
              >
                {copiedPassword ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[10px] text-slate-400">
              ผู้ใช้สามารถเข้าสู่ระบบด้วยรหัสผ่านนี้ และสามารถเปลี่ยนรหัสใหม่ได้ที่หน้าโปรไฟล์
            </p>

            <button
              onClick={() => setResetPasswordModalUser(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: DELETE USER CONFIRMATION */}
      {/* ======================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">ยืนยันการลบบัญชีผู้ใช้?</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีของ <strong>{userToDelete.name}</strong> ({userToDelete.email}) ข้อมูลการเรียนจะไม่สามารถกู้คืนได้
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                ลบบัญชีผู้ใช้
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ADD SUB-ADMIN */}
      {/* ======================================================== */}
      {showAddSubAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            <button
              onClick={() => setShowAddSubAdminModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">เพิ่มผู้ดูแลระบบย่อย (Sub-Admin)</h3>
                <p className="text-xs text-slate-500">กำหนดสิทธิ์การดูแลแต่ละส่วนอย่างละเอียด</p>
              </div>
            </div>

            <form onSubmit={handleAddSubAdmin} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="เช่น ผศ.ดร. ภาสกร เมธาพงศ์"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">ชื่อผู้ใช้ (Username) *</label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.username}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                    placeholder="เช่น passakorn.m"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">อีเมล *</label>
                  <input
                    type="email"
                    required
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="passakorn@udru.ac.th"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">ตำแหน่ง / ฝ่าย *</label>
                <input
                  type="text"
                  required
                  value={newAdminForm.roleTitle}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, roleTitle: e.target.value })}
                  placeholder="เช่น ฝ่ายบริหารหลักสูตรและวิชาการ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">สิทธิ์การดำเนินการ (CRUD):</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminForm.canRead}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, canRead: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>อ่านข้อมูล (Read)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminForm.canWrite}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, canWrite: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>สร้างข้อมูล (Write)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminForm.canEdit}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, canEdit: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>แก้ไขข้อมูล (Edit)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminForm.canDelete}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, canDelete: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>ลบข้อมูล (Delete)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSubAdminModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  บันทึกแอดมินย่อย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: EDIT SUB-ADMIN PERMISSIONS */}
      {/* ======================================================== */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            <button
              onClick={() => setEditingAdmin(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">แก้ไขสิทธิ์ของ {editingAdmin.name}</h3>
                <p className="text-xs text-slate-500">{editingAdmin.roleTitle}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditedPermissions} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">สิทธิ์การดำเนินการ (Actions):</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingAdmin.permissions.canRead}
                      onChange={(e) => setEditingAdmin({
                        ...editingAdmin,
                        permissions: { ...editingAdmin.permissions, canRead: e.target.checked }
                      })}
                      className="rounded text-emerald-600"
                    />
                    <span>อ่านข้อมูล (Read)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingAdmin.permissions.canWrite}
                      onChange={(e) => setEditingAdmin({
                        ...editingAdmin,
                        permissions: { ...editingAdmin.permissions, canWrite: e.target.checked }
                      })}
                      className="rounded text-emerald-600"
                    />
                    <span>เขียนข้อมูล (Write)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingAdmin.permissions.canEdit}
                      onChange={(e) => setEditingAdmin({
                        ...editingAdmin,
                        permissions: { ...editingAdmin.permissions, canEdit: e.target.checked }
                      })}
                      className="rounded text-emerald-600"
                    />
                    <span>แก้ไขข้อมูล (Edit)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingAdmin.permissions.canDelete}
                      onChange={(e) => setEditingAdmin({
                        ...editingAdmin,
                        permissions: { ...editingAdmin.permissions, canDelete: e.target.checked }
                      })}
                      className="rounded text-emerald-600"
                    />
                    <span>ลบข้อมูล (Delete)</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">โมดูลที่อนุญาตให้เข้าถึง:</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  {Object.entries(editingAdmin.permissions.modules).map(([moduleKey, isAllowed]) => (
                    <label key={moduleKey} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAllowed}
                        onChange={(e) => setEditingAdmin({
                          ...editingAdmin,
                          permissions: {
                            ...editingAdmin.permissions,
                            modules: {
                              ...editingAdmin.permissions.modules,
                              [moduleKey]: e.target.checked
                            }
                          }
                        })}
                        className="rounded text-emerald-600"
                      />
                      <span className="capitalize">{moduleKey}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  บันทึกสิทธิ์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: DELETE SUB-ADMIN CONFIRMATION */}
      {/* ======================================================== */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">ยืนยันการลบผู้ดูแลระบบย่อย?</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {adminToDelete.name} ({adminToDelete.roleTitle})
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAdminToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdmins(admins.filter(a => a.id !== adminToDelete.id));
                  showToast(`ลบแอดมินย่อย "${adminToDelete.name}" เรียบร้อยแล้ว`);
                  setAdminToDelete(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                ลบแอดมิน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
