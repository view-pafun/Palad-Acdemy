import React, { useState } from 'react';
import { 
  Layout, 
  Calendar, 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Save, 
  ExternalLink, 
  Sparkles, 
  MapPin, 
  Users, 
  Clock 
} from 'lucide-react';
import { EventItem } from '../../types';

interface LandingPageEventsTabProps {
  heroBannerUrl: string;
  onUpdateHeroBanner: (newUrl: string) => void;
  events: EventItem[];
  onAddEvent: (newEvent: EventItem) => void;
  onUpdateEvent: (updatedEvent: EventItem) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const LandingPageEventsTab: React.FC<LandingPageEventsTabProps> = ({
  heroBannerUrl,
  onUpdateHeroBanner,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const [currentHeroUrl, setCurrentHeroUrl] = useState(heroBannerUrl);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setCurrentHeroUrl(heroBannerUrl);
  }, [heroBannerUrl]);

  // New Event Form State
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    type: 'Onsite' as 'Onsite' | 'Online' | 'Hybrid',
    date: '15 พฤศจิกายน 2569',
    time: '09:00 - 16:30 น.',
    location: 'ห้องประชุมเฉลิมพระเกียรติ มหาวิทยาลัยราชภัฏอุดรธานี',
    speaker: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
    speakerTitle: 'หัวหน้าโครงการพัฒนาทักษะและการเรียนรู้ UDRU',
    seatsTotal: 60,
    seatsBooked: 0,
    category: 'เวิร์กช็อปนวัตกรรม',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    description: 'ร่วมพัฒนาทักษะ 4 ประการกับการวิเคราะห์ข้อมูลชุมชนเชิงลึก',
    tags: ['การเรียนรู้', 'UDRU', 'อบรมเชิงปฏิบัติการ']
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save Hero Banner
  const handleSaveHeroBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHeroUrl.trim()) return;

    onUpdateHeroBanner(currentHeroUrl.trim());
    showToast('อัปเดตภาพแบนเนอร์ Hero Section ของหน้าแรกเว็บไซต์สำเร็จแล้ว!');
  };

  // Add Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title.trim()) return;

    const newEvent: EventItem = {
      id: `ev-${Date.now()}`,
      title: newEventForm.title.trim(),
      type: newEventForm.type,
      date: newEventForm.date.trim(),
      time: newEventForm.time.trim(),
      location: newEventForm.location.trim(),
      speaker: newEventForm.speaker.trim(),
      speakerTitle: newEventForm.speakerTitle.trim(),
      seatsTotal: Number(newEventForm.seatsTotal) || 50,
      seatsBooked: 0,
      category: newEventForm.category,
      image: newEventForm.image,
      description: newEventForm.description.trim(),
      tags: newEventForm.tags
    };

    onAddEvent(newEvent);
    setShowAddEventModal(false);
    showToast(`เพิ่มกิจกรรมใหม่ "${newEvent.title}" เรียบร้อยแล้ว`);
  };

  // Save Event Edit
  const handleSaveEventEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    onUpdateEvent(editingEvent);
    setEditingEvent(null);
    showToast(`แก้ไขกิจกรรม "${editingEvent.title}" สำเร็จแล้ว`);
  };

  return (
    <div className="space-y-8 font-['Mitr',sans-serif]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-2.5 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layout className="w-6 h-6 text-emerald-600" />
            <span>จัดการหน้าเว็บแรกและกิจกรรม (Front-end Content Management)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            เปลี่ยนภาพแบนเนอร์ Hero Section ของหน้าหลัก และบริหารจัดการกิจกรรมและเวิร์กช็อปประชาสัมพันธ์
          </p>
        </div>
      </div>

      {/* 1. Hero Banner Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              <span>ภาพแบนเนอร์หลักหน้าแรก (Banner Hero Section)</span>
            </h3>
            <p className="text-xs text-slate-400 font-normal">
              เปลี่ยนภาพพื้นหลังของส่วน Hero ด้านบนสุดของเว็บไซต์หลัก
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            แสดงผลเต็มจอ Full Width
          </span>
        </div>

        <form onSubmit={handleSaveHeroBanner} className="space-y-4">
          {/* Live Preview of Hero Banner (Video or Image) */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md min-h-[180px] sm:min-h-[240px] flex items-center justify-center group">
            {currentHeroUrl && (currentHeroUrl.includes('hero-video') || currentHeroUrl.includes('video') || currentHeroUrl.includes('mp4') || currentHeroUrl.includes('flow.google.com/shared/video')) ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="/hero-video-poster.jpg"
                className="w-full h-full object-cover max-h-[300px]"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                <source
                  src="https://flow-content.google/video/788b525f-4877-429f-92ca-6d402f0f796f?Expires=1791296170&KeyName=labs-flow-prod-cdn-key&Signature=s8IiiijCxl3N5blqYrDJO9ZEj7g"
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={currentHeroUrl}
                alt="Hero Preview"
                className="w-full h-full object-cover max-h-[300px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://s.imgz.io/2026/10/01/Homedd44c76a87199196.png';
                }}
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 text-center">
              <div className="text-white space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  ตัวอย่างการแสดงผลบนหน้าแรก (Live Preview)
                </span>
                <p className="text-sm sm:text-base font-black drop-shadow-md">
                  Where Outliers Become Icons · UDRU
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              ลิงก์ URL วิดีโอหรือรูปภาพแบนเนอร์ใหม่:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                required
                value={currentHeroUrl}
                onChange={(e) => setCurrentHeroUrl(e.target.value)}
                placeholder="ใส่ URL วิดีโอ (.mp4) หรือลิงก์ Google Flow หรือรูปภาพ..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกแบนเนอร์ใหม่</span>
              </button>
            </div>
          </div>

          {/* Quick Presets for Official Banners & Videos */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">แบนเนอร์ & วิดีโอของระบบ:</span>
            {[
              {
                label: '🌟 ภาพแบนเนอร์ทางการใหม่ (Official Hero Section)',
                url: 'https://s.imgz.io/2026/10/09/792ee306f311a1f20f74869bf0501cb8122544b471a93be1.png'
              },
              {
                label: '🎬 วิดีโอเคลื่อนไหว Google Flow (AI Motion Video)',
                url: 'https://flow.google.com/shared/video/448d455a-dcc9-486a-b564-7bb5793eb036'
              },
              {
                label: 'ภาพถ่ายกิจกรรมภาคสนาม UDRU',
                url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80'
              },
              {
                label: 'ภาพเทคโนโลยี & นวัตกรรมชุมชน',
                url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1400&q=80'
              }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentHeroUrl(preset.url)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 2. Events Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>จัดการกิจกรรมและเวิร์กช็อป (Events & Workshops)</span>
            </h3>
            <p className="text-xs text-slate-400 font-normal">
              เพิ่มและแก้ไขข้อมูลกิจกรรมในแถบสไลเดอร์หน้าแรกและปฏิทินกิจกรรม
            </p>
          </div>

          <button
            onClick={() => setShowAddEventModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>+ เพิ่มกิจกรรมใหม่ (Add Event)</span>
          </button>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">กิจกรรม</th>
                <th className="py-3.5 px-4">วันที่ / เวลา</th>
                <th className="py-3.5 px-4">สถานที่</th>
                <th className="py-3.5 px-4">วิทยากร</th>
                <th className="py-3.5 px-4 text-center">ที่นั่งว่าง</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-14 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{ev.title}</p>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold mt-0.5">
                          {ev.type} · {ev.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-semibold block">{ev.date}</span>
                    <span className="text-[11px] text-slate-400">{ev.time}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-[160px] truncate">
                    {ev.location}
                  </td>

                  <td className="py-3.5 px-4 text-slate-800">
                    <span className="font-semibold block">{ev.speaker}</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">{ev.speakerTitle}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {ev.seatsBooked}/{ev.seatsTotal}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingEvent(JSON.parse(JSON.stringify(ev)))}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        title="แก้ไขกิจกรรม"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      </button>

                      <button
                        onClick={() => setEventToDelete(ev)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                        title="ลบกิจกรรม"
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

      {/* Modal 1: Add Event */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-800">
            
            <button
              onClick={() => setShowAddEventModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">เพิ่มกิจกรรมใหม่ (Create Event)</h3>
                <p className="text-xs text-slate-500">กรอกข้อมูลกิจกรรม วัน เวลา และสถานที่จัดงาน</p>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">ชื่อกิจกรรม / เวิร์กช็อป *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น อบรมเครื่องมือ 4 ประการสู่การปฏิบัติ"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">วันที่จัดกิจกรรม *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 15 พฤศจิกายน 2569"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">เวลา *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 09:00 - 16:30 น."
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">สถานที่จัดงาน</label>
                  <input
                    type="text"
                    placeholder="เช่น ห้องประชุมเฉลิมพระเกียรติ มรภ.อุดรฯ"
                    value={newEventForm.location}
                    onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">รูปแบบกิจกรรม</label>
                  <select
                    value={newEventForm.type}
                    onChange={(e) => setNewEventForm({ ...newEventForm, type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Onsite">Onsite (ที่มหาวิทยาลัย)</option>
                    <option value="Online">Online (ผ่าน Zoom / Meet)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">วิทยากรหลัก</label>
                  <input
                    type="text"
                    placeholder="เช่น ผศ.ดร. ธีรภัทร วัฒนโกศล"
                    value={newEventForm.speaker}
                    onChange={(e) => setNewEventForm({ ...newEventForm, speaker: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">จำนวนที่นั่งเปิดรับ</label>
                  <input
                    type="number"
                    value={newEventForm.seatsTotal}
                    onChange={(e) => setNewEventForm({ ...newEventForm, seatsTotal: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ลิงก์ภาพโปสเตอร์กิจกรรม (Image URL)</label>
                <input
                  type="url"
                  value={newEventForm.image}
                  onChange={(e) => setNewEventForm({ ...newEventForm, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition cursor-pointer shadow-sm"
                >
                  บันทึกและประกาศกิจกรรม
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 2: Edit Event */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-800">
            
            <button
              onClick={() => setEditingEvent(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">แก้ไขข้อมูลกิจกรรม</h3>
                <p className="text-xs text-slate-500">{editingEvent.title}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEventEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">ชื่อกิจกรรม *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">วันที่</label>
                  <input
                    type="text"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">เวลา</label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">สถานที่</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition cursor-pointer shadow-sm"
                >
                  บันทึกการแก้ไขกิจกรรม
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 3: Delete Event Confirmation */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">ยืนยันการลบกิจกรรม?</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{eventToDelete.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEvent(eventToDelete.id);
                  showToast(`ลบกิจกรรม "${eventToDelete.title}" แล้ว`);
                  setEventToDelete(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                ลบกิจกรรม
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
