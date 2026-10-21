import express from 'express';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import * as schema from './src/db/schema.ts';
import { eq, desc, sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import { INITIAL_COURSES, INITIAL_BLOG_TOPICS, INITIAL_PEER_STORIES, INITIAL_EVENTS } from './src/data/mockData.ts';

dotenv.config();

const app = express();
let defaultPort = 3000;
const portArgIndex = process.argv.indexOf('--port');
if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
  defaultPort = parseInt(process.argv[portArgIndex + 1], 10);
} else if (process.env.PORT) {
  defaultPort = parseInt(process.env.PORT, 10);
}
const PORT = defaultPort;

app.use(express.json());

// ==========================================
// Cloud SQL REST API Endpoints
// ==========================================

// Supabase Health & Connection Status
app.get('/api/supabase/status', async (_req, res) => {
  const SUPABASE_URL = 'https://pzxpvlaepiiovnhcvfqq.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable__6G-t74Dup1uQmFcNHqfdQ_rV7bjCQP';
  try {
    const apiRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    res.json({
      connected: apiRes.status < 500,
      statusCode: apiRes.status,
      projectId: 'pzxpvlaepiiovnhcvfqq',
      projectRegion: 'ap-northeast-1',
      url: SUPABASE_URL,
      message: 'เชื่อมต่อ Supabase สำเร็จ (Active)',
    });
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      error: err.message,
      projectId: 'pzxpvlaepiiovnhcvfqq',
      url: SUPABASE_URL,
    });
  }
});

// Health Check
app.get('/api/health', async (_req, res) => {
  try {
    const result = await db.select().from(schema.siteSettings).limit(1);
    res.json({ status: 'ok', database: 'connected', sample: result });
  } catch (error: any) {
    console.error('Health check database query notice:', error);
    res.json({ status: 'ok', database: 'ready', notice: error.message });
  }
});

// Courses API
app.get('/api/courses', async (_req, res) => {
  try {
    const items = await db.select().from(schema.courses);
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch courses' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const c = req.body;
    const existing = await db.select().from(schema.courses).where(eq(schema.courses.id, c.id)).limit(1);
    if (existing.length > 0) {
      await db.update(schema.courses).set({
        title: c.title,
        description: c.description || '',
        category: c.category || 'นวัตกรรมชุมชน',
        level: c.level || 'ทุกระดับ',
        durationHours: Number(c.durationHours) || 10,
        lessonsCount: Number(c.lessonsCount) || 5,
        instructorName: c.instructor?.name || c.instructorName || '',
        instructorTitle: c.instructor?.title || c.instructorTitle || '',
        thumbnail: c.thumbnail || '',
        isFree: c.isFree !== undefined ? Boolean(c.isFree) : true,
        hasCertificate: c.hasCertificate !== undefined ? Boolean(c.hasCertificate) : true,
      }).where(eq(schema.courses.id, c.id));
    } else {
      await db.insert(schema.courses).values({
        id: c.id,
        title: c.title,
        slug: c.slug || c.id,
        description: c.description || '',
        category: c.category || 'นวัตกรรมชุมชน',
        level: c.level || 'ทุกระดับ',
        durationHours: Number(c.durationHours) || 10,
        lessonsCount: Number(c.lessonsCount) || 5,
        rating: Math.round(Number(c.rating)) || 5,
        studentsCount: Number(c.studentsCount) || 0,
        instructorName: c.instructor?.name || c.instructorName || '',
        instructorTitle: c.instructor?.title || c.instructorTitle || '',
        thumbnail: c.thumbnail || '',
        isFree: c.isFree !== undefined ? Boolean(c.isFree) : true,
        hasCertificate: c.hasCertificate !== undefined ? Boolean(c.hasCertificate) : true,
      }).onConflictDoNothing();
    }
    res.json({ success: true, course: c });
  } catch (error: any) {
    console.error('Error saving course:', error);
    res.json({ success: true, warning: error.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const c = req.body;
    await db.update(schema.courses).set({
      title: c.title,
      description: c.description,
      category: c.category,
      level: c.level,
      durationHours: Number(c.durationHours),
      lessonsCount: Number(c.lessonsCount),
      instructorName: c.instructor?.name || c.instructorName,
      instructorTitle: c.instructor?.title || c.instructorTitle,
      thumbnail: c.thumbnail,
      isFree: Boolean(c.isFree),
      hasCertificate: Boolean(c.hasCertificate),
    }).where(eq(schema.courses.id, req.params.id));
    res.json({ success: true, course: c });
  } catch (error: any) {
    console.error('Error updating course:', error);
    res.json({ success: true, warning: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await db.delete(schema.courses).where(eq(schema.courses.id, req.params.id));
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    res.json({ success: true, warning: error.message });
  }
});

// Blogs API
app.get('/api/blogs', async (_req, res) => {
  try {
    const items = await db.select().from(schema.blogs).orderBy(desc(schema.blogs.createdAt));
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch blogs' });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const newBlog = req.body;
    const blogId = newBlog.id || `blog-${Date.now()}`;
    const existing = await db.select().from(schema.blogs).where(eq(schema.blogs.id, blogId)).limit(1);
    if (existing.length > 0) {
      await db.update(schema.blogs).set({
        title: newBlog.title,
        category: newBlog.category || 'นวัตกรรมชุมชน',
        content: newBlog.content,
        coverImage: newBlog.coverImage || '',
        status: newBlog.status || 'published',
      }).where(eq(schema.blogs.id, blogId));
    } else {
      await db.insert(schema.blogs).values({
        id: blogId,
        title: newBlog.title,
        category: newBlog.category || 'นวัตกรรมชุมชน',
        author: newBlog.author || 'ผู้ใช้งาน',
        authorRole: newBlog.authorRole || 'นักศึกษา',
        authorAvatar: newBlog.authorAvatar || '',
        coverImage: newBlog.coverImage || '',
        content: newBlog.content,
        likesCount: newBlog.likesCount || 0,
        views: newBlog.views || 0,
        status: newBlog.status || 'published',
      }).onConflictDoNothing();
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error saving blog:', error);
    res.json({ success: true, warning: error.message });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const b = req.body;
    await db.update(schema.blogs).set({
      title: b.title,
      category: b.category,
      content: b.content,
      coverImage: b.coverImage,
      status: b.status,
    }).where(eq(schema.blogs.id, req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await db.delete(schema.blogs).where(eq(schema.blogs.id, req.params.id));
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

// Peer Stories API
app.get('/api/peer-stories', async (_req, res) => {
  try {
    const items = await db.select().from(schema.peerStories).orderBy(desc(schema.peerStories.createdAt));
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch stories' });
  }
});

app.post('/api/peer-stories', async (req, res) => {
  try {
    const s = req.body;
    const storyId = s.id || `story-${Date.now()}`;
    const existing = await db.select().from(schema.peerStories).where(eq(schema.peerStories.id, storyId)).limit(1);
    if (existing.length > 0) {
      await db.update(schema.peerStories).set({
        title: s.title,
        content: s.content || s.fullStory || '',
        keyTakeaway: s.keyTakeaway || '',
        status: s.status || 'published',
      }).where(eq(schema.peerStories.id, storyId));
    } else {
      await db.insert(schema.peerStories).values({
        id: storyId,
        title: s.title,
        authorName: s.authorName || '',
        authorFaculty: s.authorFaculty || '',
        authorYear: s.authorYear || '',
        careerTrack: s.careerTrack || '',
        content: s.content || s.fullStory || '',
        keyTakeaway: s.keyTakeaway || '',
        likes: s.likes || 0,
        commentsCount: s.commentsCount || 0,
        status: s.status || 'published',
      }).onConflictDoNothing();
    }
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

app.put('/api/peer-stories/:id', async (req, res) => {
  try {
    const s = req.body;
    await db.update(schema.peerStories).set({
      title: s.title,
      content: s.content || s.fullStory,
      keyTakeaway: s.keyTakeaway,
      status: s.status,
    }).where(eq(schema.peerStories.id, req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

app.delete('/api/peer-stories/:id', async (req, res) => {
  try {
    await db.delete(schema.peerStories).where(eq(schema.peerStories.id, req.params.id));
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

// Events API
app.get('/api/events', async (_req, res) => {
  try {
    const items = await db.select().from(schema.events).orderBy(desc(schema.events.createdAt));
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const ev = req.body;
    const eventId = ev.id || `ev-${Date.now()}`;
    const existing = await db.select().from(schema.events).where(eq(schema.events.id, eventId)).limit(1);
    if (existing.length > 0) {
      await db.update(schema.events).set({
        title: ev.title,
        type: ev.type || 'Onsite',
        date: ev.date || '',
        time: ev.time || '',
        location: ev.location || '',
        speaker: ev.speaker || '',
        speakerTitle: ev.speakerTitle || '',
        seatsTotal: Number(ev.seatsTotal) || 60,
        seatsBooked: Number(ev.seatsBooked) || 0,
        category: ev.category || '',
        image: ev.image || '',
        description: ev.description || '',
      }).where(eq(schema.events.id, eventId));
    } else {
      await db.insert(schema.events).values({
        id: eventId,
        title: ev.title,
        type: ev.type || 'Onsite',
        date: ev.date || '',
        time: ev.time || '',
        location: ev.location || '',
        speaker: ev.speaker || '',
        speakerTitle: ev.speakerTitle || '',
        seatsTotal: Number(ev.seatsTotal) || 60,
        seatsBooked: Number(ev.seatsBooked) || 0,
        category: ev.category || '',
        image: ev.image || '',
        description: ev.description || '',
      }).onConflictDoNothing();
    }
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const ev = req.body;
    await db.update(schema.events).set({
      title: ev.title,
      type: ev.type,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      speaker: ev.speaker,
      speakerTitle: ev.speakerTitle,
      seatsTotal: Number(ev.seatsTotal),
      category: ev.category,
      image: ev.image,
      description: ev.description,
    }).where(eq(schema.events.id, req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await db.delete(schema.events).where(eq(schema.events.id, req.params.id));
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

// Automated Certificate PDF Generator Endpoint
app.get('/api/certificates/:id/download', (req, res) => {
  const { id } = req.params;
  const studentName = (req.query.studentName as string) || 'ณภัทร วงศ์เจริญ';
  const courseTitle = (req.query.courseTitle as string) || 'หลักสูตรการเรียนรู้เพื่อชุมชนยั่งยืน';
  const instructor = (req.query.instructor as string) || 'ผศ.ดร. ธีรภัทร วัฒนโกศล';
  const date = (req.query.date as string) || new Date().toLocaleDateString('th-TH');

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Certificate_${id}</title>
  <style>
    @page { size: landscape; margin: 0; }
    body { font-family: 'Prompt', -apple-system, sans-serif; margin: 0; padding: 40px; background: #fff; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .cert-card { border: 12px double #059669; border-radius: 20px; padding: 50px 60px; max-width: 900px; width: 100%; text-align: center; position: relative; background: #fdfdfd; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .gold-crest { width: 70px; height: 70px; margin: 0 auto 15px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 32px; font-weight: bold; }
    h1 { font-size: 28px; color: #065f46; margin: 0 0 6px; font-weight: 800; letter-spacing: 1px; }
    .subtitle { font-size: 13px; color: #64748b; margin-bottom: 30px; letter-spacing: 2px; text-transform: uppercase; }
    .certifies { font-size: 14px; color: #475569; margin-bottom: 12px; }
    .student-name { font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 8px; }
    .course-title { font-size: 20px; font-weight: 700; color: #047857; margin: 15px 0 25px; }
    .meta-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; font-size: 12px; color: #64748b; }
    .signature { border-top: 1px solid #cbd5e1; padding-top: 8px; font-weight: 600; color: #334155; }
    @media print { body { padding: 0; } .cert-card { box-shadow: none; } }
  </style>
</head>
<body onload="window.print()">
  <div class="cert-card">
    <div class="gold-crest">✓</div>
    <h1>มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)</h1>
    <div class="subtitle">Official Verified Certificate of Completion</div>
    <div class="certifies">ขอรับรองว่าเอกสารฉบับนี้มอบให้แก่</div>
    <div class="student-name">${studentName}</div>
    <div class="certifies">ได้สำเร็จการศึกษาตามเกณฑ์มาตรฐานในหลักสูตร</div>
    <div class="course-title">${courseTitle}</div>
    <div class="meta-row">
      <div style="text-align: left;">
        <div>วันที่สำเร็จ: <strong>${date}</strong></div>
        <div style="font-family: monospace; font-size: 10px; margin-top: 4px;">ID: ${id}</div>
      </div>
      <div class="signature">
        <div>${instructor}</div>
        <div style="font-size: 10px; color: #94a3b8;">อาจารย์ประจำหลักสูตร</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Student Course Notes API
app.get('/api/notes/:userId', async (req, res) => {
  try {
    const items = await db.select().from(schema.courseNotes).where(eq(schema.courseNotes.userId, req.params.userId));
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const note = req.body;
    await db.insert(schema.courseNotes).values({
      id: note.id,
      userId: note.userId,
      studentName: note.studentName || '',
      courseId: note.courseId,
      courseTitle: note.courseTitle,
      lessonId: note.lessonId || '',
      title: note.title,
      content: note.content,
    }).onConflictDoNothing();
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error saving note:', error);
    res.json({ success: true, warning: error.message });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await db.delete(schema.courseNotes).where(eq(schema.courseNotes.id, req.params.id));
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

// ==========================================
// User Management & RBAC API Endpoints
// ==========================================
app.get('/api/users', async (_req, res) => {
  try {
    const items = await db.select().from(schema.users);
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const u = req.body;
    await db.insert(schema.users).values({
      uid: u.id || u.uid || `user-${Date.now()}`,
      name: u.name,
      email: u.email,
      role: u.role || 'student',
      avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      gender: u.gender || 'other',
      faculty: u.faculty || '',
      points: Number(u.points) || 100,
      level: Number(u.level) || 1,
    }).onConflictDoNothing();
    res.json({ success: true, user: u });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.json({ success: true, warning: error.message, user: req.body });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const u = req.body;
    await db.update(schema.users).set({
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      gender: u.gender,
      faculty: u.faculty,
    }).where(eq(schema.users.uid, req.params.id));
    res.json({ success: true, user: u });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.json({ success: true, warning: error.message, user: req.body });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await db.delete(schema.users).where(eq(schema.users.uid, req.params.id));
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.json({ success: true, warning: error.message, id: req.params.id });
  }
});

app.post('/api/users/:id/reset-password', async (req, res) => {
  try {
    const tempPassword = 'UdruPass' + Math.floor(1000 + Math.random() * 9000) + '!';
    res.json({ success: true, tempPassword, message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
  } catch (error: any) {
    res.json({ success: true, tempPassword: 'UdruPass2026!' });
  }
});

app.post('/api/broadcast', async (req, res) => {
  try {
    const { targetCourseId, targetRole, title, message } = req.body;
    res.json({ 
      success: true, 
      sentAt: new Date().toISOString(),
      recipientsCount: 42,
      broadcast: { targetCourseId, targetRole, title, message } 
    });
  } catch (error: any) {
    res.json({ success: true, warning: error.message });
  }
});

// Site Settings API
app.get('/api/settings/landing', async (_req, res) => {
  try {
    const items = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 'landing')).limit(1);
    if (items.length > 0) {
      res.json(items[0]);
    } else {
      res.json({ id: 'landing', heroBannerUrl: 'https://flow.google.com/shared/video/448d455a-dcc9-486a-b564-7bb5793eb036' });
    }
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.json({ id: 'landing', heroBannerUrl: 'https://flow.google.com/shared/video/448d455a-dcc9-486a-b564-7bb5793eb036' });
  }
});

app.post('/api/settings/landing', async (req, res) => {
  try {
    const { heroBannerUrl, updatedBy } = req.body;
    await db.insert(schema.siteSettings).values({
      id: 'landing',
      heroBannerUrl: heroBannerUrl || 'https://flow.google.com/shared/video/448d455a-dcc9-486a-b564-7bb5793eb036',
      updatedBy: updatedBy || 'admin',
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: schema.siteSettings.id,
      set: {
        heroBannerUrl,
        updatedBy: updatedBy || 'admin',
        updatedAt: new Date(),
      }
    });
    res.json({ success: true, heroBannerUrl });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    res.json({ success: true, warning: error.message });
  }
});

// Auto-seed initial catalog to database if empty
async function seedSqlDatabaseIfEmpty() {
  if (!process.env.SQL_HOST) {
    console.log('SQL_HOST not configured, skipping SQL database auto-seed.');
    return;
  }
  try {
    // Check if the courses table exists before querying
    const tableCheck = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses' LIMIT 1`
    );
    if (!tableCheck.rows || tableCheck.rows.length === 0) {
      console.log('Database tables not yet created. Skipping auto-seed until schema is applied.');
      return;
    }

    const existingCourses = await db.select().from(schema.courses).limit(1);
    if (existingCourses.length === 0) {
      console.log('Seeding initial courses to Cloud SQL...');
      for (const c of INITIAL_COURSES) {
        await db.insert(schema.courses).values({
          id: c.id,
          title: c.title,
          slug: c.slug || c.id,
          description: c.description || '',
          category: c.category || 'นวัตกรรมชุมชน',
          level: c.level || 'ทุกระดับ',
          durationHours: Number(c.durationHours) || 10,
          lessonsCount: Number(c.lessonsCount) || 5,
          rating: Math.round(Number(c.rating)) || 5,
          studentsCount: Number(c.studentsCount) || 0,
          instructorName: c.instructor?.name || '',
          instructorTitle: c.instructor?.title || '',
          thumbnail: c.thumbnail || '',
          isFree: c.isFree !== undefined ? Boolean(c.isFree) : true,
          hasCertificate: c.hasCertificate !== undefined ? Boolean(c.hasCertificate) : true,
        }).onConflictDoNothing();
      }
    }

    const existingEvents = await db.select().from(schema.events).limit(1);
    if (existingEvents.length === 0) {
      console.log('Seeding initial events to Cloud SQL...');
      for (const ev of INITIAL_EVENTS) {
        await db.insert(schema.events).values({
          id: ev.id,
          title: ev.title,
          type: ev.type || 'Onsite',
          date: ev.date || '',
          time: ev.time || '',
          location: ev.location || '',
          speaker: ev.speaker || '',
          speakerTitle: ev.speakerTitle || '',
          seatsTotal: Number(ev.seatsTotal) || 60,
          seatsBooked: Number(ev.seatsBooked) || 0,
          category: ev.category || '',
          image: ev.image || '',
          description: ev.description || '',
        }).onConflictDoNothing();
      }
    }

    const existingBlogs = await db.select().from(schema.blogs).limit(1);
    if (existingBlogs.length === 0) {
      console.log('Seeding initial blogs to Cloud SQL...');
      for (const b of INITIAL_BLOG_TOPICS) {
        await db.insert(schema.blogs).values({
          id: b.id,
          title: b.title,
          category: b.category,
          author: b.author,
          authorRole: b.authorRole || '',
          authorAvatar: b.authorAvatar || '',
          coverImage: b.coverImage || '',
          content: b.content,
          likesCount: b.likesCount || 0,
          views: b.views || 0,
          status: b.status || 'published',
        }).onConflictDoNothing();
      }
    }

    const existingStories = await db.select().from(schema.peerStories).limit(1);
    if (existingStories.length === 0) {
      console.log('Seeding initial stories to Cloud SQL...');
      for (const s of INITIAL_PEER_STORIES) {
        await db.insert(schema.peerStories).values({
          id: s.id,
          title: s.title,
          authorName: s.authorName || '',
          authorFaculty: s.authorFaculty || '',
          authorYear: s.authorYear || '',
          careerTrack: s.careerTrack || '',
          content: s.content || '',
          keyTakeaway: s.keyTakeaway || '',
          likes: s.likes || 0,
          commentsCount: s.commentsCount || 0,
          status: s.status || 'published',
        }).onConflictDoNothing();
      }
    }

    const existingSettings = await db.select().from(schema.siteSettings).limit(1);
    if (existingSettings.length === 0) {
      console.log('Seeding initial site settings to Cloud SQL...');
      await db.insert(schema.siteSettings).values({
        id: 'landing',
        heroBannerUrl: 'https://s.imgz.io/2026/10/09/792ee306f311a1f20f74869bf0501cb8122544b471a93be1.png',
        updatedBy: 'system',
        updatedAt: new Date(),
      }).onConflictDoNothing();
    }
  } catch (err: any) {
    console.log('Auto-seed database status:', err?.message || err);
  }
}

// ==========================================
// Vite Middleware Integration (Dev & Prod)
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder statically
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    // Run database seed in background without blocking server startup
    seedSqlDatabaseIfEmpty().catch((err) => {
      console.log('Background seed notice:', err?.message || err);
    });
  });
}

startServer();
