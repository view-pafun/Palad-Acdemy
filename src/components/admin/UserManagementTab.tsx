import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Key, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  X,
  Lock,
  Mail,
  Building
} from 'lucide-react';
import { User, Course, UserRole, UserEnrollment } from '../../types';

interface UserManagementTabProps {
  courses: Course[];
  users: User[];
  onAddUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onEnrollUser: (userId: string, enrollment: UserEnrollment) => void;
  onRevokeEnrollment: (userId: string, courseId: string) => void;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  courses,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onEnrollUser,
  onRevokeEnrollment,
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseSegmentFilter, setCourseSegmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [enrollingUser, setEnrollingUser] = useState<User | null>(null);
  const [passwordResetUser, setPasswordResetUser] = useState<{ user: User; tempPass: string } | null>(null);
  const [segmentBroadcastModal, setSegmentBroadcastModal] = useState<{ course: Course; count: number } | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState({ subject: '', content: '' });

  // Add User Form State (with conditional fields)
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    password: '',
    gender: 'other' as 'male' | 'female' | 'other',
    studentId: '',
    institute: 'มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)',
    faculty: 'คณะครุศาสตร์',
    major: 'เทคโนโลยีการศึกษา',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  });

  // Manual Enrollment Form State
  const [enrollForm, setEnrollForm] = useState({
    courseId: courses[0]?.id || '',
    durationMonths: 12, // default 1 year
    isLifetime: false,
    paymentRef: 'โอนเงินผ่านธนาคาร (Manual Bank Transfer)',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all') {
      const userStatus = u.status || 'active';
      if (userStatus !== statusFilter) return false;
    }
    if (courseSegmentFilter !== 'all' && !u.enrolledCourseIds?.includes(courseSegmentFilter)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchStudentId = u.studentId?.toLowerCase().includes(q);
      const matchFaculty = u.faculty?.toLowerCase().includes(q);
      const matchMajor = u.major?.toLowerCase().includes(q);
      return matchName || matchEmail || matchStudentId || matchFaculty || matchMajor;
    }
    return true;
  });

  // KPI Metrics
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalInstructors = users.filter((u) => u.role === 'instructor' || u.role === 'lecturer').length;
  const totalGeneral = users.filter((u) => u.role === 'general').length;
  const totalEnrollments = users.reduce((acc, u) => acc + (u.enrolledCourseIds?.length || 0), 0);

  // Handle Add User Submit
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;

    const isStudentOrInstructor = newUserForm.role === 'student' || newUserForm.role === 'instructor';

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: newUserForm.role,
      avatar: newUserForm.avatar,
      gender: newUserForm.gender,
      studentId: newUserForm.role === 'student' ? newUserForm.studentId.trim() : undefined,
      institute: isStudentOrInstructor ? newUserForm.institute.trim() : undefined,
      faculty: isStudentOrInstructor ? newUserForm.faculty.trim() : undefined,
      major: isStudentOrInstructor ? newUserForm.major.trim() : undefined,
      status: 'active',
      enrolledCourseIds: [],
      enrollments: [],
      completedCourseIds: [],
      savedPlansCount: 0,
      points: 100,
      level: 1,
      badges: ['badge-1'],
      createdAt: new Date().toISOString(),
      lastLogin: 'เพิ่งสร้างบัญชี',
    };

    onAddUser(newUser);
    setShowAddUserModal(false);
    showToast(`สร้างบัญชีผู้ใช้ "${newUser.name}" เรียบร้อยแล้ว`);

    // Reset Form
    setNewUserForm({
      name: '',
      email: '',
      role: 'student',
      password: '',
      gender: 'other',
      studentId: '',
      institute: 'มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)',
      faculty: 'คณะครุศาสตร์',
      major: 'เทคโนโลยีการศึกษา',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    });
  };

  // Handle Edit User Submit
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser(editingUser);
    setEditingUser(null);
    showToast(`อัปเดตข้อมูลผู้ใช้งาน "${editingUser.name}" สำเร็จ`);
  };

  // Toggle Suspend / Active status
  const handleToggleSuspend = (user: User) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const updated: User = { ...user, status: nextStatus };
    onUpdateUser(updated);
    showToast(`${nextStatus === 'suspended' ? 'ระงับการใช้งาน' : 'ปลดระงับการใช้งาน'} บัญชี ${user.name}`);
  };

  // Reset Password with Temp Password Generator
  const handleTriggerPasswordReset = (user: User) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$';
    let tempPass = 'Udru@';
    for (let i = 0; i < 5; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordResetUser({ user, tempPass });
  };

  // Handle Manual Enrollment Grant
  const handleGrantEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingUser || !enrollForm.courseId) return;

    const course = courses.find((c) => c.id === enrollForm.courseId);
    const now = new Date();
    let expiresAt: string | null = null;

    if (!enrollForm.isLifetime) {
      const expDate = new Date();
      expDate.setMonth(now.getMonth() + enrollForm.durationMonths);
      expiresAt = expDate.toISOString();
    }

    const newEnrollment: UserEnrollment = {
      courseId: enrollForm.courseId,
      courseTitle: course?.title || 'หลักสูตรออนไลน์',
      enrolledAt: now.toISOString(),
      expiresAt,
      accessDurationMonths: enrollForm.isLifetime ? undefined : enrollForm.durationMonths,
      status: 'active',
      paymentReference: enrollForm.paymentRef.trim() || 'Manual Grant',
    };

    onEnrollUser(enrollingUser.id, newEnrollment);

    // Update local enrollingUser instance
    const updatedEnrollments = [...(enrollingUser.enrollments || []).filter(e => e.courseId !== enrollForm.courseId), newEnrollment];
    const updatedEnrolledIds = Array.from(new Set([...enrollingUser.enrolledCourseIds, enrollForm.courseId]));
    setEnrollingUser({
      ...enrollingUser,
      enrolledCourseIds: updatedEnrolledIds,
      enrollments: updatedEnrollments,
    });

    showToast(`ลงทะเบียนเข้าเรียน "${course?.title}" ให้กับ ${enrollingUser.name} เรียบร้อย (${enrollForm.isLifetime ? 'ตลอดชีพ' : `อายุ ${enrollForm.durationMonths} เดือน`})`);
  };

  // Handle Send Segment Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!segmentBroadcastModal || !broadcastMessage.subject.trim()) return;

    showToast(`ส่งข้อความประชาสัมพันธ์ถึงผู้เรียนกลุ่ม "${segmentBroadcastModal.course.title}" (${segmentBroadcastModal.count} คน) สำเร็จ!`);
    setSegmentBroadcastModal(null);
    setBroadcastMessage({ subject: '', content: '' });
  };

  return (
    <div className="space-y-8 font-['Prompt',sans-serif] text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2.5 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>การจัดการผู้ใช้ & สิทธิ์การเข้าเรียน</span>
            <span aria-hidden="true">·</span>
            <span>Role-Based Access Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>จัดการผู้ใช้งานและการลงทะเบียน (User & Access Management)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ควบคุมสิทธิ์การเข้าถึง กำหนดอายุการลงทะเบียนเรียนรายบุคคล และจัดกลุ่มผู้เรียน (Segmentation)
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มผู้ใช้งานใหม่ (Create User)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">นักศึกษา (Students)</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{totalStudents.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">เข้าถึงบทเรียนและส่งงาน</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">อาจารย์/ผู้สอน (Instructors)</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{totalInstructors.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">ตรวจการบ้าน & จัดการคอร์ส</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">บุคคลทั่วไป (General Public)</span>
            <Building className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{totalGeneral.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">เรียนรู้ตลอดชีวิต</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">สิทธิ์การลงทะเบียนทั้งหมด</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{totalEnrollments.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">รวมการลงทะเบียนทุกคอร์ส</span>
        </div>
      </div>

      {/* User Segmentation Overview Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400">แดชบอร์ดกลุ่มผู้เรียน</span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">Targeted Segmentation</span>
            </div>
            <h3 className="text-base font-bold text-white">
              จัดกลุ่มผู้เรียนตามหลักสูตร เพื่อการสื่อสารและมอบสิทธิ์ที่ตรงจุด
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              เลือกหลักสูตรเพื่อดูรายชื่อนักศึกษาที่ลงทะเบียน และส่งข้อความประชาสัมพันธ์เฉพาะกลุ่มได้ทันที
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {courses.slice(0, 3).map((course) => {
              const enrolledCount = users.filter(u => u.enrolledCourseIds?.includes(course.id)).length;
              return (
                <button
                  key={course.id}
                  onClick={() => setSegmentBroadcastModal({ course, count: enrolledCount })}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer flex items-center gap-2"
                >
                  <span className="truncate max-w-[140px]">{course.title}</span>
                  <span className="font-mono font-bold text-emerald-400 text-[11px]">({enrolledCount})</span>
                  <Send className="w-3 h-3 text-slate-300" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อ, อีเมล, รหัสนักศึกษา, คณะ หรือสาขาวิชา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Role Segment Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'student', label: 'นักศึกษา' },
              { id: 'instructor', label: 'อาจารย์ผู้สอน' },
              { id: 'general', label: 'บุคคลทั่วไป' },
              { id: 'admin', label: 'ผู้ดูแลระบบ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Course Filter Dropdown & Status Filter */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">กรองตามคอร์สที่ลงทะเบียน:</span>
            <select
              value={courseSegmentFilter}
              onChange={(e) => setCourseSegmentFilter(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="all">ทุกหลักสูตร (All Courses)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">สถานะบัญชี:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">ใช้งานปกติ (Active)</option>
              <option value="suspended">ถูกระงับชั่วคราว (Suspended)</option>
            </select>
          </div>

          <span className="text-slate-400 ml-auto">
            พบผู้ใช้งาน {filteredUsers.length} รายการ
          </span>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">ผู้ใช้งาน / โปรไฟล์</th>
                <th className="py-3 px-4">อีเมล</th>
                <th className="py-3 px-4">บทบาท (Role)</th>
                <th className="py-3 px-4">สถาบัน / คณะ / สาขา</th>
                <th className="py-3 px-4 text-center">คอร์สที่ลงทะเบียน</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    ไม่พบผู้ใช้งานตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSuspended = user.status === 'suspended';
                  const isGeneral = user.role === 'general';
                  const enrolledCount = user.enrolledCourseIds?.length || 0;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                          <div>
                            <p className="font-semibold text-slate-900 leading-snug">{user.name}</p>
                            {user.studentId && (
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                รหัส: {user.studentId}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Role Label */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">
                          {user.role === 'student' && 'นักศึกษา'}
                          {user.role === 'instructor' && 'อาจารย์ผู้สอน'}
                          {user.role === 'lecturer' && 'อาจารย์พิเศษ'}
                          {user.role === 'general' && 'บุคคลทั่วไป'}
                          {user.role === 'admin' && 'ผู้ดูแลระบบ'}
                        </span>
                      </td>

                      {/* Educational Institution & Department */}
                      <td className="py-3 px-4 max-w-xs text-slate-600">
                        {isGeneral ? (
                          <span className="text-slate-400 text-[11px]">— บุคคลทั่วไป —</span>
                        ) : (
                          <div>
                            <p className="text-[11px] font-medium text-slate-800 line-clamp-1">
                              {user.faculty || user.institute || 'มรภ.อุดรธานี'}
                            </p>
                            {user.major && (
                              <p className="text-[10px] text-slate-400 line-clamp-1">
                                สาขา: {user.major}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Enrolled Courses Count & Manual Enrollment Access Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setEnrollingUser(user);
                            setEnrollForm((prev) => ({ ...prev, courseId: courses[0]?.id || '' }));
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition cursor-pointer text-[11px]"
                          title="คลิกเพื่อจัดการสิทธิ์ลงทะเบียนเรียนและกำหนดอายุ"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{enrolledCount} คอร์ส</span>
                          <Plus className="w-3 h-3 text-slate-400" />
                        </button>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleSuspend(user)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            isSuspended
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {isSuspended ? 'ถูกระงับ' : 'ปกติ'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Manual Enrollment Trigger */}
                          <button
                            onClick={() => {
                              setEnrollingUser(user);
                              setEnrollForm((prev) => ({ ...prev, courseId: courses[0]?.id || '' }));
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                            title="ลงทะเบียนเรียนให้ผู้ใช้นี้ (Manual Enrollment & Expiry)"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => setEditingUser(JSON.parse(JSON.stringify(user)))}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="แก้ไขข้อมูลผู้ใช้"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => handleTriggerPasswordReset(user)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                            title="รีเซ็ตรหัสผ่าน (Reset Password)"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                            title="ลบผู้ใช้งาน"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Create User Modal with Dynamic Conditional Fields */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-emerald-800">การลงทะเบียนบัญชีใหม่</span>
              <h3 className="text-lg font-bold text-slate-900">เพิ่มผู้ใช้งานใหม่ (Create New User)</h3>
              <p className="text-xs text-slate-500">กำหนดบทบาทและข้อมูลสังกัดตามเงื่อนไขที่เลือก</p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              
              {/* Role Selection Dropdown (Critical Requirement) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-900 block">เลือกบทบาทผู้ใช้งาน (Role Selection) *</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="student">🎓 นักศึกษา (Student)</option>
                  <option value="instructor">👨‍🏫 อาจารย์ / ผู้สอน (Instructor)</option>
                  <option value="general">🌍 บุคคลทั่วไป (General Public)</option>
                  <option value="admin">🛡️ ผู้ดูแลระบบ (Administrator)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  {newUserForm.role === 'general' 
                    ? 'บุคคลทั่วไปไม่ต้องกรอกข้อมูลสังกัด สถาบัน หรือสาขาวิชา' 
                    : 'นักศึกษาและอาจารย์จะแสดงฟิลด์ข้อมูลสถาบัน คณะ และสาขาวิชาเพิ่มเติม'}
                </p>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ชื่อ - นามสกุล *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ดร. ณัฐพงษ์ วิริยะ"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">อีเมล (Email) *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@udru.ac.th"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Conditional Student ID (Only for students) */}
              {newUserForm.role === 'student' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">รหัสนักศึกษา (Student ID)</label>
                  <input
                    type="text"
                    placeholder="เช่น 6614020123"
                    value={newUserForm.studentId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, studentId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
                  />
                </div>
              )}

              {/* CONDITIONAL FIELDS: Show for Student & Instructor, HIDE for General Public */}
              {(newUserForm.role === 'student' || newUserForm.role === 'instructor' || newUserForm.role === 'lecturer') && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                  <span className="text-[11px] font-bold text-emerald-900 block">
                    ข้อมูลสังกัดและสถานศึกษา (สำหรับนักศึกษา & อาจารย์)
                  </span>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">สถาบัน / มหาวิทยาลัย (Institution / University)</label>
                    <input
                      type="text"
                      placeholder="เช่น มหาวิทยาลัยราชภัฏอุดรธานี"
                      value={newUserForm.institute}
                      onChange={(e) => setNewUserForm({ ...newUserForm, institute: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">คณะ / ภาควิชา (Faculty / Department)</label>
                      <input
                        type="text"
                        placeholder="เช่น คณะครุศาสตร์"
                        value={newUserForm.faculty}
                        onChange={(e) => setNewUserForm({ ...newUserForm, faculty: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">สาขาวิชา / หลักสูตร (Major / Program)</label>
                      <input
                        type="text"
                        placeholder="เช่น นวัตกรรมการศึกษา"
                        value={newUserForm.major}
                        onChange={(e) => setNewUserForm({ ...newUserForm, major: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold transition cursor-pointer shadow-sm"
                >
                  บันทึกและสร้างบัญชี
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-blue-700">แก้ไขข้อมูลผู้ใช้งาน</span>
              <h3 className="text-lg font-bold text-slate-900">{editingUser.name}</h3>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
              
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">บทบาท (Role)</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-medium"
                >
                  <option value="student">นักศึกษา (Student)</option>
                  <option value="instructor">อาจารย์ / ผู้สอน (Instructor)</option>
                  <option value="general">บุคคลทั่วไป (General Public)</option>
                  <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                </select>
              </div>

              {editingUser.role !== 'general' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">คณะ / สังกัด</label>
                    <input
                      type="text"
                      value={editingUser.faculty || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, faculty: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">สาขาวิชา</label>
                    <input
                      type="text"
                      value={editingUser.major || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, major: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold transition cursor-pointer shadow-sm"
                >
                  บันทึกการแก้ไข
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Manual Enrollment & Access Expiry Control */}
      {enrollingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            
            <button
              onClick={() => setEnrollingUser(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-emerald-800">การลงทะเบียนเรียนด้วยตนเอง (Manual Enrollment)</span>
              <h3 className="text-lg font-bold text-slate-900">
                จัดการสิทธิ์การเข้าเรียน: {enrollingUser.name}
              </h3>
              <p className="text-xs text-slate-500">
                รองรับการลงทะเบียนจากการโอนเงินนอกระบบ พร้อมกำหนดอายุสิทธิ์เข้าเรียน (Access Duration)
              </p>
            </div>

            {/* Grant New Enrollment Form */}
            <form onSubmit={handleGrantEnrollment} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 mb-5 text-xs">
              <span className="font-bold text-slate-900 block text-xs">มอบสิทธิ์เข้าเรียนหลักสูตรใหม่:</span>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">เลือกหลักสูตรที่ต้องการมอบสิทธิ์ *</label>
                <select
                  value={enrollForm.courseId}
                  onChange={(e) => setEnrollForm({ ...enrollForm, courseId: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-medium"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Expiry Settings per Enrollment (Critical Requirement) */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 block">กำหนดระยะเวลาอายุสิทธิ์ (Expiry Duration):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { months: 3, label: '3 เดือน' },
                    { months: 6, label: '6 เดือน' },
                    { months: 12, label: '1 ปี (12 เดือน)' },
                    { months: 24, label: '2 ปี' },
                  ].map((dur) => (
                    <button
                      key={dur.months}
                      type="button"
                      onClick={() => setEnrollForm({ ...enrollForm, durationMonths: dur.months, isLifetime: false })}
                      className={`p-2 rounded-xl text-center border text-[11px] font-semibold transition cursor-pointer ${
                        !enrollForm.isLifetime && enrollForm.durationMonths === dur.months
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 pt-1 text-slate-700 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={enrollForm.isLifetime}
                    onChange={(e) => setEnrollForm({ ...enrollForm, isLifetime: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>สิทธิ์การเข้าถึงตลอดชีพ (Lifetime Access / ไม่มีวันหมดอายุ)</span>
                </label>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">เลขอ้างอิงการชำระเงิน / หลักฐานสลิป (Payment Reference)</label>
                <input
                  type="text"
                  placeholder="เช่น สลิปโอนเงินกสิกร #KBANK-88421"
                  value={enrollForm.paymentRef}
                  onChange={(e) => setEnrollForm({ ...enrollForm, paymentRef: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันการมอบสิทธิ์เข้าเรียน</span>
              </button>
            </form>

            {/* Current Active Enrollments List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                หลักสูตรที่ผู้ใช้มีสิทธิ์ในปัจจุบัน ({enrollingUser.enrolledCourseIds.length} คอร์ส):
              </span>

              {enrollingUser.enrolledCourseIds.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl">
                  ยังไม่ได้ลงทะเบียนในคอร์สใด
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {enrollingUser.enrolledCourseIds.map((courseId) => {
                    const c = courses.find(item => item.id === courseId);
                    const enrollmentData = enrollingUser.enrollments?.find(e => e.courseId === courseId);

                    return (
                      <div
                        key={courseId}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{c?.title || courseId}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {enrollmentData?.expiresAt 
                                ? `หมดอายุ: ${new Date(enrollmentData.expiresAt).toLocaleDateString('th-TH')}` 
                                : 'สิทธิ์ตลอดชีพ (Lifetime)'}
                            </span>
                            {enrollmentData?.paymentReference && (
                              <span>· {enrollmentData.paymentReference}</span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onRevokeEnrollment(enrollingUser.id, courseId);
                            setEnrollingUser({
                              ...enrollingUser,
                              enrolledCourseIds: enrollingUser.enrolledCourseIds.filter(id => id !== courseId),
                              enrollments: (enrollingUser.enrollments || []).filter(e => e.courseId !== courseId),
                            });
                            showToast(`เพิกถอนสิทธิ์หลักสูตร "${c?.title}" เรียบร้อย`);
                          }}
                          className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition cursor-pointer shrink-0"
                        >
                          เพิกถอน
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setEnrollingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 4: Password Reset Confirmation Modal */}
      {passwordResetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">รีเซ็ตรหัสผ่านสำเร็จ</h4>
              <p className="text-xs text-slate-500 mt-1">
                สำหรับผู้ใช้งาน: {passwordResetUser.user.name} ({passwordResetUser.user.email})
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-medium">รหัสผ่านชั่วคราวใหม่ (Temporary Password):</span>
              <p className="font-mono text-base font-bold text-slate-900 select-all tracking-wider">
                {passwordResetUser.tempPass}
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(passwordResetUser.tempPass);
                showToast('คัดลอกรหัสผ่านชั่วคราวเรียบร้อย');
                setPasswordResetUser(null);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              คัดลอกรหัสผ่าน & ปิด
            </button>
          </div>
        </div>
      )}

      {/* Modal 5: Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">ยืนยันการลบบัญชีผู้ใช้?</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {userToDelete.name} ({userToDelete.email})
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
                onClick={() => {
                  onDeleteUser(userToDelete.id);
                  showToast(`ลบบัญชีผู้ใช้ "${userToDelete.name}" เรียบร้อยแล้ว`);
                  setUserToDelete(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                ลบบัญชี
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: User Segmentation Targeted Broadcast Modal */}
      {segmentBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            
            <button
              onClick={() => setSegmentBroadcastModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-emerald-800">ส่งข้อความเฉพาะกลุ่มผู้เรียน (Targeted Announcement)</span>
              <h3 className="text-base font-bold text-slate-900">
                กลุ่มผู้เรียน: {segmentBroadcastModal.course.title}
              </h3>
              <p className="text-xs text-slate-500">
                จะส่งถึงนักศึกษาที่ลงทะเบียนในคอร์สนี้ทั้งหมด {segmentBroadcastModal.count} คน
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">หัวข้อประกาศ / แจ้งเตือน *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น แจ้งกำหนดการส่งงานโครงงานรอบสุดท้าย..."
                  value={broadcastMessage.subject}
                  onChange={(e) => setBroadcastMessage({ ...broadcastMessage, subject: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ข้อความรายละเอียด *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="พิมพ์ข้อความที่ต้องการแจ้งเตือนหรือประชาสัมพันธ์แก่นักศึกษาในคอร์สนี้..."
                  value={broadcastMessage.content}
                  onChange={(e) => setBroadcastMessage({ ...broadcastMessage, content: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSegmentBroadcastModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งประกาศถึง {segmentBroadcastModal.count} คน</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
