import { createClient } from '@supabase/supabase-js';
import { Course, BlogTopic, PeerStory, EventItem, CourseNote } from '../types';

// Supabase Project Credentials provided by user
export const SUPABASE_URL = 'https://pzxpvlaepiiovnhcvfqq.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable__6G-t74Dup1uQmFcNHqfdQ_rV7bjCQP';
export const SUPABASE_PROJECT_ID = 'pzxpvlaepiiovnhcvfqq';
export const SUPABASE_PROJECT_REGION = 'ap-northeast-1';
export const SUPABASE_PROJECT_NAME = "viewpafunchusang-hash's Project";

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseStatus {
  connected: boolean;
  message: string;
  projectId: string;
  projectRegion: string;
  url: string;
  tablesAvailable?: string[];
}

/**
 * Checks connectivity to the Supabase endpoint
 */
export async function checkSupabaseHealth(): Promise<SupabaseStatus> {
  try {
    // Attempt a light ping or query to Supabase REST
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const isConnected = res.status < 500;
    return {
      connected: isConnected,
      message: isConnected ? 'เชื่อมต่อ Supabase สำเร็จ (Active)' : `สถานะ: ${res.statusText}`,
      projectId: SUPABASE_PROJECT_ID,
      projectRegion: SUPABASE_PROJECT_REGION,
      url: SUPABASE_URL,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err.message || 'ไม่สามารถติดต่อ Supabase ได้',
      projectId: SUPABASE_PROJECT_ID,
      projectRegion: SUPABASE_PROJECT_REGION,
      url: SUPABASE_URL,
    };
  }
}

/**
 * Sync or Save a Course into Supabase
 */
export async function syncCourseToSupabase(course: Course): Promise<boolean> {
  try {
    const { error } = await supabase.from('courses').upsert({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration_hours: course.durationHours,
      lessons_count: course.lessonsCount,
      rating: course.rating,
      students_count: course.studentsCount,
      instructor_name: course.instructor?.name || '',
      instructor_title: course.instructor?.title || '',
      thumbnail: course.thumbnail,
      is_free: course.isFree,
      has_certificate: course.hasCertificate,
    });
    if (error) {
      console.warn('Supabase course sync notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase course sync exception:', err);
    return false;
  }
}

/**
 * Sync or Save a Blog Post into Supabase
 */
export async function syncBlogToSupabase(blog: BlogTopic): Promise<boolean> {
  try {
    const { error } = await supabase.from('blogs').upsert({
      id: blog.id,
      title: blog.title,
      category: blog.category,
      author: blog.author,
      author_role: blog.authorRole,
      author_avatar: blog.authorAvatar,
      cover_image: blog.coverImage,
      content: blog.content,
      likes_count: blog.likesCount,
      views: blog.views,
      status: blog.status,
    });
    if (error) {
      console.warn('Supabase blog sync notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase blog sync exception:', err);
    return false;
  }
}

/**
 * Sync or Save a Peer Story into Supabase
 */
export async function syncStoryToSupabase(story: PeerStory): Promise<boolean> {
  try {
    const { error } = await supabase.from('peer_stories').upsert({
      id: story.id,
      title: story.title,
      author_name: story.authorName,
      author_faculty: story.authorFaculty,
      author_year: story.authorYear,
      career_track: story.careerTrack,
      content: story.content,
      key_takeaway: story.keyTakeaway,
      likes: story.likes,
      comments_count: story.commentsCount,
      status: story.status,
    });
    if (error) {
      console.warn('Supabase story sync notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase story sync exception:', err);
    return false;
  }
}

/**
 * Sync or Save an Event into Supabase
 */
export async function syncEventToSupabase(event: EventItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('events').upsert({
      id: event.id,
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
      speaker: event.speaker,
      speaker_title: event.speakerTitle,
      seats_total: event.seatsTotal,
      seats_booked: event.seatsBooked,
      category: event.category,
      image: event.image,
      description: event.description,
    });
    if (error) {
      console.warn('Supabase event sync notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase event sync exception:', err);
    return false;
  }
}

/**
 * Sync Course Note to Supabase
 */
export async function syncCourseNoteToSupabase(note: CourseNote): Promise<boolean> {
  try {
    const { error } = await supabase.from('course_notes').upsert({
      id: note.id,
      user_id: note.userId,
      student_name: note.studentName,
      course_id: note.courseId,
      course_title: note.courseTitle,
      lesson_id: note.lessonId,
      title: note.title,
      content: note.content,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('Supabase note sync notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase note sync exception:', err);
    return false;
  }
}

/**
 * Delete Course from Supabase
 */
export async function deleteCourseFromSupabase(courseId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete Blog from Supabase
 */
export async function deleteBlogFromSupabase(blogId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('blogs').delete().eq('id', blogId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete Peer Story from Supabase
 */
export async function deleteStoryFromSupabase(storyId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('peer_stories').delete().eq('id', storyId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete Event from Supabase
 */
export async function deleteEventFromSupabase(eventId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete Course Note from Supabase
 */
export async function deleteCourseNoteFromSupabase(noteId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('course_notes').delete().eq('id', noteId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Sync Hero Banner URL to Supabase
 */
export async function syncHeroBannerToSupabase(heroBannerUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('site_settings').upsert({
      id: 'landing',
      hero_banner_url: heroBannerUrl,
      updated_by: 'admin',
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Ready-to-use SQL Schema for Supabase SQL Editor
 */
export const SUPABASE_SQL_SETUP = `
-- ============================================================
-- SQL Setup Script สำหรับ Supabase (PostgreSQL)
-- สามารถคัดลอกไปรันใน Supabase -> SQL Editor ได้ทันที
-- ============================================================

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'ทุกระดับ',
  duration_hours INT DEFAULT 10,
  lessons_count INT DEFAULT 5,
  rating INT DEFAULT 5,
  students_count INT DEFAULT 0,
  instructor_name TEXT,
  instructor_title TEXT,
  thumbnail TEXT,
  is_free BOOLEAN DEFAULT true,
  has_certificate BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT,
  author_avatar TEXT,
  cover_image TEXT,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  views INT DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Peer Stories Table
CREATE TABLE IF NOT EXISTS public.peer_stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_faculty TEXT,
  author_year TEXT,
  career_track TEXT,
  content TEXT NOT NULL,
  key_takeaway TEXT,
  likes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Onsite',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  speaker TEXT NOT NULL,
  speaker_title TEXT,
  seats_total INT DEFAULT 60,
  seats_booked INT DEFAULT 0,
  category TEXT,
  image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Course Notes Table
CREATE TABLE IF NOT EXISTS public.course_notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  student_name TEXT,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  lesson_id TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY,
  hero_banner_url TEXT NOT NULL,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Read
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update courses" ON public.courses FOR ALL USING (true);

CREATE POLICY "Allow public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update blogs" ON public.blogs FOR ALL USING (true);

CREATE POLICY "Allow public read peer_stories" ON public.peer_stories FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update peer_stories" ON public.peer_stories FOR ALL USING (true);

CREATE POLICY "Allow public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update events" ON public.events FOR ALL USING (true);

CREATE POLICY "Allow public read notes" ON public.course_notes FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update notes" ON public.course_notes FOR ALL USING (true);

CREATE POLICY "Allow public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update settings" ON public.site_settings FOR ALL USING (true);
`;
