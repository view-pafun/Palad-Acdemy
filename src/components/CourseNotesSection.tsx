import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Search, 
  Tag, 
  Copy, 
  Check, 
  Download, 
  Cloud, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles,
  Lock,
  X,
  Share2,
  Bookmark
} from 'lucide-react';
import { Course, CourseNote, User } from '../types';
import { saveCourseNote, fetchUserCourseNotes, deleteCourseNote, signInWithGoogleAuth } from '../lib/firebase';
import { syncCourseNoteToSupabase, deleteCourseNoteFromSupabase } from '../lib/supabase';

interface CourseNotesSectionProps {
  course: Course;
  currentUser: User | null;
  activeLessonId?: string;
  onRequireLogin?: () => void;
}

export const CourseNotesSection: React.FC<CourseNotesSectionProps> = ({
  course,
  currentUser,
  activeLessonId,
  onRequireLogin
}) => {
  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  // Editor modal/panel state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState<string[]>(['แนวคิดสำคัญ']);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(activeLessonId || '');

  // Feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Available common quick tags for students
  const availableTags = [
    'แนวคิดสำคัญ',
    'ประเด็นที่ต้องทบทวน',
    'ข้อสอบ/ประเมินผล',
    'ไอเดียประยุกต์ใช้ในชุมชน',
    'คำถามสำหรับอาจารย์'
  ];

  // Helper to find lesson title by ID
  const getLessonTitle = (lessonId?: string): string => {
    if (!lessonId) return 'ภาพรวมหลักสูตร';
    for (const module of course.modules) {
      const found = module.lessons.find((l) => l.id === lessonId);
      if (found) return found.title;
    }
    return 'ภาพรวมหลักสูตร';
  };

  // Sync selectedLessonId when activeLessonId changes
  useEffect(() => {
    if (activeLessonId) {
      setSelectedLessonId(activeLessonId);
    }
  }, [activeLessonId]);

  // Load notes from Firebase when user or course changes
  useEffect(() => {
    let isMounted = true;
    if (currentUser?.id) {
      setIsLoading(true);
      fetchUserCourseNotes(currentUser.id, course.id)
        .then((fetchedNotes) => {
          if (isMounted) {
            setNotes(fetchedNotes);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch course notes:', err);
          if (isMounted) {
            setIsLoading(false);
          }
        });
    } else {
      // Local fallback for guest students
      try {
        const local = localStorage.getItem(`guest_notes_${course.id}`);
        if (local) {
          setNotes(JSON.parse(local));
        } else {
          setNotes([]);
        }
      } catch {
        setNotes([]);
      }
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, course.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open note creator
  const handleOpenNewNote = () => {
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags(['แนวคิดสำคัญ']);
    setSelectedLessonId(activeLessonId || course.modules[0]?.lessons[0]?.id || '');
    setIsEditorOpen(true);
  };

  // Open editor for existing note
  const handleOpenEditNote = (note: CourseNote) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags && note.tags.length > 0 ? note.tags : ['แนวคิดสำคัญ']);
    setSelectedLessonId(note.lessonId || '');
    setIsEditorOpen(true);
  };

  // Toggle tag selection
  const handleToggleTag = (tag: string) => {
    if (noteTags.includes(tag)) {
      if (noteTags.length > 1) {
        setNoteTags(noteTags.filter((t) => t !== tag));
      }
    } else {
      setNoteTags([...noteTags, tag]);
    }
  };

  // Save or update note
  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      showToast('กรุณากรอกเนื้อหาของโน้ตก่อนบันทึก');
      return;
    }

    setIsSaving(true);
    const now = new Date().toISOString();
    const resolvedTitle = noteTitle.trim() || `บันทึกช่วยจำ (${new Date().toLocaleDateString('th-TH')})`;
    const currentLessonName = getLessonTitle(selectedLessonId);

    const noteId = editingNoteId || `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const studentUid = currentUser?.id || 'guest-student';

    const noteData: CourseNote = {
      id: noteId,
      userId: studentUid,
      studentName: currentUser?.name || 'นักศึกษาผู้เรียน',
      courseId: course.id,
      courseTitle: course.title,
      lessonId: selectedLessonId || undefined,
      lessonTitle: currentLessonName,
      title: resolvedTitle,
      content: noteContent.trim(),
      tags: noteTags,
      createdAt: editingNoteId ? (notes.find((n) => n.id === editingNoteId)?.createdAt || now) : now,
      updatedAt: now
    };

    try {
      if (currentUser?.id) {
        // Save to Firebase Firestore
        await saveCourseNote(noteData);
        // Mirror to Supabase PostgreSQL database
        syncCourseNoteToSupabase(noteData).catch(() => {});
        showToast('☁️ บันทึกโน้ตลงในระบบ Firebase และ Supabase เรียบร้อยแล้ว');
      } else {
        // Guest local storage fallback
        showToast('บันทึกโน้ตในอุปกรณ์นี้แล้ว (เข้าสู่ระบบเพื่อซิงค์ไปยัง Firebase)');
      }

      // Optimistic update
      setNotes((prev) => {
        const exists = prev.some((n) => n.id === noteData.id);
        const updated = exists 
          ? prev.map((n) => (n.id === noteData.id ? noteData : n)) 
          : [noteData, ...prev];
        
        if (!currentUser?.id) {
          localStorage.setItem(`guest_notes_${course.id}`, JSON.stringify(updated));
        }
        return updated;
      });

      setIsEditorOpen(false);
    } catch (err) {
      console.error('Error saving note:', err);
      showToast('เกิดข้อผิดพลาดในการบันทึกลง Firebase กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    try {
      if (currentUser?.id) {
        await deleteCourseNote(currentUser.id, noteId);
        deleteCourseNoteFromSupabase(noteId).catch(() => {});
        showToast('ลบโน้ตออกจากระบบเรียบร้อย');
      } else {
        showToast('ลบโน้ตเรียบร้อย');
      }

      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== noteId);
        if (!currentUser?.id) {
          localStorage.setItem(`guest_notes_${course.id}`, JSON.stringify(updated));
        }
        return updated;
      });
    } catch (err) {
      console.error('Error deleting note:', err);
      showToast('เกิดข้อผิดพลาดในการลบโน้ต');
    }
  };

  // Copy note content
  const handleCopyNote = (note: CourseNote) => {
    const fullText = `[บันทึกการเรียน: ${course.title}]\nบทเรียน: ${note.lessonTitle || 'ภาพรวม'}\nหัวข้อ: ${note.title}\n\n${note.content}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopiedNoteId(note.id);
      setTimeout(() => setCopiedNoteId(null), 2500);
    }
  };

  // Export notes as text file
  const handleExportNotes = () => {
    if (notes.length === 0) {
      showToast('ยังไม่มีโน้ตที่จะส่งออก');
      return;
    }

    let textContent = `======================================================\n`;
    textContent += `บันทึกการเรียนรู้ส่วนตัว: ${course.title}\n`;
    textContent += `ผู้เรียน: ${currentUser?.name || 'นักศึกษา'}\n`;
    textContent += `ส่งออกเมื่อ: ${new Date().toLocaleDateString('th-TH')} ${new Date().toLocaleTimeString('th-TH')}\n`;
    textContent += `======================================================\n\n`;

    notes.forEach((n, idx) => {
      textContent += `[โน้ตที่ ${idx + 1}] ${n.title}\n`;
      textContent += `บทเรียน: ${n.lessonTitle || 'ภาพรวม'}\n`;
      textContent += `วันที่บันทึก: ${new Date(n.updatedAt || n.createdAt).toLocaleString('th-TH')}\n`;
      if (n.tags && n.tags.length > 0) {
        textContent += `แท็ก: ${n.tags.join(', ')}\n`;
      }
      textContent += `------------------------------------------------------\n`;
      textContent += `${n.content}\n\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes_${course.id}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์สรุปโน้ตเรียบร้อย');
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.lessonTitle && n.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || (n.tags && n.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>สมุดจดโน้ตส่วนตัว (Personal Study Notes)</span>
                {currentUser?.id && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <Cloud className="w-3 h-3 text-emerald-600" />
                    <span>ผูกกับ Firebase ID: {currentUser.id.substring(0, 6)}...</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                บันทึกประเด็นสำคัญ สรุปความรู้ หรือข้อสงสัยระหว่างเรียน โดยข้อมูลจะถูกผูกกับบัญชีนักศึกษาของคุณใน Firebase
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {notes.length > 0 && (
            <button
              onClick={handleExportNotes}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
              title="ส่งออกโน้ตเป็นไฟล์ข้อความ (.txt)"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>ส่งออกโน้ต</span>
            </button>
          )}

          <button
            onClick={handleOpenNewNote}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มโน้ตใหม่</span>
          </button>
        </div>
      </div>

      {/* Guest Warning / Login Prompt Banner if not logged in */}
      {!currentUser && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              ขณะนี้คุณกำลังใช้งานในโหมดผู้เยี่ยมชม โน้ตจะถูกบันทึกชั่วคราวในเบราว์เซอร์นี้ หากต้องการสำรองข้อมูลบน Firebase ถาวร กรุณาเข้าสู่ระบบ
            </span>
          </div>
          {onRequireLogin && (
            <button
              onClick={onRequireLogin}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shrink-0 self-start sm:self-auto"
            >
              เข้าสู่ระบบด้วย Google
            </button>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาข้อความในโน้ต หรือชื่อบทเรียน..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs scrollbar-none">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
              selectedTag === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            ทั้งหมด ({notes.length})
          </button>
          {availableTags.map((tag) => {
            const count = notes.filter((n) => n.tags && n.tags.includes(tag)).length;
            if (count === 0 && selectedTag !== tag) return null;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
                  selectedTag === tag
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                #{tag} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes List / Empty State */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>กำลังโหลดโน้ตส่วนตัวจาก Firebase...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="max-w-sm">
            <h4 className="text-sm font-bold text-slate-800">
              {notes.length === 0 ? 'ยังไม่มีโน้ตในหลักสูตรนี้' : 'ไม่พบบันทึกที่ตรงกับคำค้นหา'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              คลิกปุ่ม "เพิ่มโน้ตใหม่" เพื่อเริ่มจดสรุปความรู้ สูตร ข้อคิด หรือเตรียมตัวสอบได้ทันที
            </p>
          </div>
          <button
            onClick={handleOpenNewNote}
            className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างโน้ตแรกของคุณ</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-2xl bg-[#fafbfa] hover:bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Lesson & Tag Bar */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 max-w-[200px] truncate border border-emerald-100">
                    <BookOpen className="w-3 h-3 shrink-0 text-emerald-600" />
                    <span className="truncate">{note.lessonTitle || 'ภาพรวมคอร์ส'}</span>
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString('th-TH')}</span>
                  </span>
                </div>

                {/* Note Title */}
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-1">
                  {note.title}
                </h4>

                {/* Note Content */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal mt-2 whitespace-pre-wrap line-clamp-4">
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {note.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100/80">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-emerald-500" />
                  <span>ผูกกับ ID: {note.userId.substring(0, 5)}...</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyNote(note)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="คัดลอกเนื้อหาโน้ต"
                  >
                    {copiedNoteId === note.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEditNote(note)}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 transition cursor-pointer"
                    title="แก้ไขโน้ต"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="ลบโน้ตนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* Editor Modal for Adding / Editing Notes                      */}
      {/* ============================================================ */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingNoteId ? 'แก้ไขบันทึกโน้ต' : 'จดโน้ตบทเรียนใหม่'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ข้อมูลจะถูกบันทึกลงใน Firestore เชื่อมโยงกับรหัสนักศึกษาของคุณ
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* Lesson Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ผูกกับบทเรียน / คลิป:
                </label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">📌 บันทึกทั่วไป (ภาพรวมทั้งหลักสูตร)</option>
                  {course.modules.flatMap((m, mIdx) => 
                    m.lessons.map((l, lIdx) => (
                      <option key={l.id} value={l.id}>
                        ตอนที่ {mIdx + 1}.{lIdx + 1}: {l.title} ({l.durationMinutes} นาที)
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Note Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  หัวข้อโน้ต (Topic):
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="เช่น สรุป 3 ขั้นตอนการลงพื้นที่แก้ปัญหาน้ำชุมชน..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Note Content Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    เนื้อหาบันทึก (Content):
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {noteContent.length}/10,000 ตัวอักษร
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="พิมพ์ประเด็นสำคัญที่อาจารย์เน้นย้ำ ข้อคิดที่ได้ หรือขั้นตอนที่ต้องนำไปปฏิบัติจริง..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none font-normal"
                />
              </div>

              {/* Quick Tags Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  เลือกแท็กหมวดหมู่:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = noteTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-bold shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                        <span>#{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>บันทึกไปยัง Firebase โดยตรง</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                >
                  ยกเลิก
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveNote}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกโน้ต'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
