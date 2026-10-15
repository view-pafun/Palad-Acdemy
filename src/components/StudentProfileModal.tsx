import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Award, 
  Sparkles, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Lock, 
  GraduationCap, 
  User as UserIcon,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Camera
} from 'lucide-react';
import { User, AchievementBadge, LeaderboardUser } from '../types';
import { ProfileAvatarModal } from './ProfileAvatarModal';

interface StudentProfileModalProps {
  currentUser: User | null;
  badges: AchievementBadge[];
  leaderboard: LeaderboardUser[];
  onClose: () => void;
  onSwitchRole: (newRole: 'student' | 'lecturer') => void;
  onNavigateToCourses?: () => void;
  onNavigateToLifePath?: () => void;
  onUpdateAvatar?: (newUrl: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  currentUser,
  badges,
  leaderboard,
  onClose,
  onSwitchRole,
  onNavigateToCourses,
  onNavigateToLifePath,
  onUpdateAvatar
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'badges'>('overview');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'weekly' | 'faculty'>('all');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const userXP = currentUser?.points || 850;
  const userLevel = currentUser?.level || 2;
  const nextLevelXP = userLevel * 500;
  const levelProgress = Math.min(Math.round((userXP / nextLevelXP) * 100), 100);

  const levelTitles: Record<number, string> = {
    1: 'ผู้เริ่มต้นการเรียนรู้ (Novice)',
    2: 'นักสำรวจชุมชน (Community Explorer)',
    3: 'นักนวัตกรสร้างสรรค์ (Innovator)',
    4: 'ผู้นำการเปลี่ยนแปลง (Changemaker)',
    5: 'ผู้เชี่ยวชาญระดับสูง (Master)'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                โปรไฟล์นักศึกษา & ศูนย์เกียรติยศ (Gamification)
              </h3>
              <p className="text-[11px] text-slate-500">สะสมแต้ม XP เหรียญตรา และอันดับบนกระดานผู้นำ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Bento Card */}
        <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80'}
                  alt={currentUser?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md"
                />
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute -top-1.5 -right-1.5 p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition cursor-pointer"
                  title="เปลี่ยนและครอบตัดรูปโปรไฟล์ (Upload & Crop Profile Picture)"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <span className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono shadow-xs">
                  Lv.{userLevel}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h4 className="text-lg sm:text-xl font-bold text-white">{currentUser?.name}</h4>
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                  {levelTitles[userLevel]}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  รหัสนักศึกษา: {currentUser?.studentId || '6514020101'} · {currentUser?.faculty || 'คณะวิทยาศาสตร์ UDRU'}
                </p>

                {/* Role Switcher Button for testing */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">บทบาทปัจจุบัน:</span>
                  <button
                    onClick={() => onSwitchRole(currentUser?.role === 'student' ? 'lecturer' : 'student')}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-emerald-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="คลิกเพื่อสลับบทบาททดสอบระบบ"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{currentUser?.role === 'lecturer' ? 'อาจารย์' : 'นักศึกษา'} (คลิกสลับ)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* XP Progress Card */}
            <div className="w-full sm:w-64 bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300">คะแนนสะสม</span>
                <span className="text-amber-300 font-bold font-mono tabular-nums">{userXP} XP</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden mb-1.5">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>เลเวล {userLevel}</span>
                <span>เหลืออีก {nextLevelXP - userXP} XP สู่เลเวล {userLevel + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ภาพรวมและเหรียญตรา
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'leaderboard'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            กระดานผู้นำ (Leaderboard)
          </button>
        </div>

        {/* Tab 1: Overview & Badges */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-lg font-black text-slate-900 tabular-nums">1</p>
                <p className="text-[11px] text-slate-500 font-medium">คอร์สที่ลงทะเบียน</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-lg font-black text-slate-900 tabular-nums">1</p>
                <p className="text-[11px] text-slate-500 font-medium">แผนชีวิตที่บันทึก</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-lg font-black text-emerald-700 tabular-nums">3</p>
                <p className="text-[11px] text-slate-500 font-medium">เหรียญตราที่ปลดล็อก</p>
              </div>
            </div>

            {/* Badges List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm">เหรียญตราความสำเร็จ (Achievement Badges)</h4>
                <span className="text-xs text-slate-500">ปลดล็อกแล้ว 3 จาก {badges.length}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      b.unlocked
                        ? 'bg-amber-50/50 border-amber-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{b.icon}</div>
                    <h5 className="font-semibold text-slate-900 text-xs mb-0.5 line-clamp-1">{b.title}</h5>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{b.description}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 font-mono">
                      +{b.xpReward} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SBO & Cosmic Identity Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-slate-50 to-blue-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>ผลประเมินตัวตนแห่งจักรวาล & Student Base Outcome (12 มิติ)</span>
                </h5>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  กราฟใยแมงมุม Spider Radar และพลังประจำตัวในยานอวกาศ
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToLifePath) onNavigateToLifePath();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-black text-[#FFE600] text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1 shrink-0"
              >
                <span>ดูผลประเมิน</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="p-6 space-y-4">
            {/* Filter Toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-700">จัดอันดับนวัตกรสังคม UDRU</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setLeaderboardFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    leaderboardFilter === 'all' ? 'bg-white text-slate-950 shadow-2xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  ทั้งหมด
                </button>
                <button
                  onClick={() => setLeaderboardFilter('weekly')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    leaderboardFilter === 'weekly' ? 'bg-white text-slate-950 shadow-2xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  สัปดาห์นี้
                </button>
              </div>
            </div>

            {/* Leaderboard Table / Rows */}
            <div className="space-y-2">
              {leaderboard.slice(0, 7).map((user) => {
                const isMe = user.id === currentUser?.id || user.name.includes('ณภัทร');
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isMe 
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center font-bold text-sm font-mono text-slate-600">
                        {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                      </div>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                            {user.name}
                          </span>
                          {isMe && (
                            <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                              คุณ
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">{user.faculty}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm font-mono tabular-nums">
                        {user.xp.toLocaleString()} XP
                      </p>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Lv.{user.level} {user.levelTitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

        {/* Profile Avatar Crop & Upload Modal */}
        {showAvatarModal && (
          <ProfileAvatarModal
            currentUser={currentUser}
            onClose={() => setShowAvatarModal(false)}
            onUpdateAvatar={(newUrl) => {
              if (onUpdateAvatar) {
                onUpdateAvatar(newUrl);
              }
              setShowAvatarModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
