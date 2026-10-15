import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  BookOpen, 
  FileText, 
  Calendar, 
  Terminal,
  Activity,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Course, BlogTopic, PeerStory, EventItem } from '../../types';
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  SUPABASE_PROJECT_ID, 
  SUPABASE_PROJECT_REGION, 
  SUPABASE_PROJECT_NAME,
  SUPABASE_SQL_SETUP,
  checkSupabaseHealth,
  syncCourseToSupabase,
  syncBlogToSupabase,
  syncStoryToSupabase,
  syncEventToSupabase
} from '../../lib/supabase';

interface DatabaseManagementTabProps {
  courses: Course[];
  blogs: BlogTopic[];
  stories: PeerStory[];
  events: EventItem[];
}

export const DatabaseManagementTab: React.FC<DatabaseManagementTabProps> = ({
  courses,
  blogs,
  stories,
  events,
}) => {
  const [status, setStatus] = useState<{
    connected: boolean;
    loading: boolean;
    message: string;
    checkedAt: string | null;
  }>({
    connected: true,
    loading: false,
    message: 'เชื่อมต่อแล้ว (Connected)',
    checkedAt: null,
  });

  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    syncedCount: number;
    message: string;
  } | null>(null);

  // Check health on mount
  useEffect(() => {
    handleCheckHealth();
  }, []);

  const handleCheckHealth = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await checkSupabaseHealth();
      setStatus({
        connected: res.connected,
        loading: false,
        message: res.connected ? 'เชื่อมต่อแล้ว (Connected)' : `ขาดการเชื่อมต่อ (${res.message})`,
        checkedAt: new Date().toLocaleTimeString('th-TH'),
      });
    } catch (e: any) {
      setStatus({
        connected: false,
        loading: false,
        message: `ข้อผิดพลาด: ${e.message}`,
        checkedAt: new Date().toLocaleTimeString('th-TH'),
      });
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(SUPABASE_ANON_KEY);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    let totalSynced = 0;

    try {
      // 1. Sync Courses
      for (const course of courses) {
        await syncCourseToSupabase(course);
        totalSynced++;
      }
      // 2. Sync Blogs
      for (const blog of blogs) {
        await syncBlogToSupabase(blog);
        totalSynced++;
      }
      // 3. Sync Stories
      for (const story of stories) {
        await syncStoryToSupabase(story);
        totalSynced++;
      }
      // 4. Sync Events
      for (const ev of events) {
        await syncEventToSupabase(ev);
        totalSynced++;
      }

      setSyncResult({
        success: true,
        syncedCount: totalSynced,
        message: `ส่งข้อมูลคำร้องซิงค์ทั้งหมด ${courses.length + blogs.length + stories.length + events.length} รายการ ไปยัง Supabase เรียบร้อย`,
      });
    } catch (err: any) {
      setSyncResult({
        success: false,
        syncedCount: totalSynced,
        message: `การซิงค์มีข้อผิดพลาด: ${err.message}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 font-['Mitr',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>จัดการฐานข้อมูล Supabase (PostgreSQL)</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Connected
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                เชื่อมต่อโครงการ Supabase: <strong>{SUPABASE_PROJECT_NAME}</strong> ({SUPABASE_PROJECT_ID})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCheckHealth}
            disabled={status.loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status.loading ? 'animate-spin text-amber-500' : 'text-slate-500'}`} />
            <span>ทดสอบสถานะการเชื่อมต่อ</span>
          </button>

          <a
            href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <span>เปิด Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>
      </div>

      {/* Grid: Credentials & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">สถานะการเชื่อมต่อ API</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-lg font-bold text-slate-900">
                {status.message}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              ภูมิภาคโครงการ (Region): <strong className="text-slate-800 font-mono">{SUPABASE_PROJECT_REGION}</strong>
            </p>
            {status.checkedAt && (
              <p className="text-[11px] text-slate-400 mt-1">
                ตรวจเช็คล่าสุดเมื่อ: {status.checkedAt}
              </p>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'กำลังซิงค์ข้อมูล...' : 'ซิงค์ข้อมูลทั้งหมดไปยัง Supabase'}</span>
            </button>
            {syncResult && (
              <div className={`mt-3 p-3 rounded-xl text-xs font-medium border ${
                syncResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {syncResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Project Credentials Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              รายละเอียดการตั้งค่าการเชื่อมต่อ (Connection Config)
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              REST v1 · PostgreSQL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Project Name
              </span>
              <span className="font-bold text-slate-900 mt-1 block truncate">
                {SUPABASE_PROJECT_NAME}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Project ID
              </span>
              <span className="font-bold text-slate-900 font-mono mt-1 block">
                {SUPABASE_PROJECT_ID}
              </span>
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                API Base URL
              </span>
              <span className="font-mono text-slate-800 mt-1 block truncate">
                {SUPABASE_URL}
              </span>
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div className="truncate">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Publishable / Anon API Key
                </span>
                <span className="font-mono text-slate-700 mt-1 block truncate text-[11px]">
                  {SUPABASE_ANON_KEY}
                </span>
              </div>
              <button
                onClick={handleCopyKey}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                title="คัดลอก API Key"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Status by Tables */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>ตารางข้อมูลและสถานะการซิงค์ (Database Schema & Entities)</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            ระบบอัปเดตอัตโนมัติพร้อมการสำรองข้อมูล
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-slate-900">courses</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">คอร์สเรียนออนไลน์</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900 font-mono">{courses.length}</span>
              <span className="text-[10px] block text-emerald-600 font-semibold">พร้อมซิงค์</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-xs text-slate-900">blogs</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">บทความและบล็อก</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900 font-mono">{blogs.length}</span>
              <span className="text-[10px] block text-emerald-600 font-semibold">พร้อมซิงค์</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-xs text-slate-900">peer_stories</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">เรื่องเล่าพี่ถึงน้อง</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900 font-mono">{stories.length}</span>
              <span className="text-[10px] block text-emerald-600 font-semibold">พร้อมซิงค์</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" />
                <span className="font-bold text-xs text-slate-900">events</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">กิจกรรม & เวิร์กช็อป</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900 font-mono">{events.length}</span>
              <span className="text-[10px] block text-emerald-600 font-semibold">พร้อมซิงค์</span>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Setup Script Helper */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-800" />
            <span className="text-sm font-bold text-slate-900">
              สคริปต์ SQL สำหรับสร้างตารางใน Supabase (SQL Editor Script)
            </span>
          </div>

          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-bold">คัดลอกเรียบร้อย!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>คัดลอกคำสั่ง SQL</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          หากเปิดโครงการ Supabase ใหม่ สามารถนำคำสั่ง SQL ด้านล่างนี้ไปวางในหน้า <strong>Supabase Dashboard &rarr; SQL Editor</strong> แล้วกด Run ได้ทันที เพื่อสร้างตารางทั้งหมดพร้อมระบบ Row Level Security (RLS)
        </p>

        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-4 max-h-56 overflow-y-auto font-mono text-xs text-slate-300 shadow-inner">
          <pre>{SUPABASE_SQL_SETUP.trim()}</pre>
        </div>
      </div>
    </div>
  );
};
