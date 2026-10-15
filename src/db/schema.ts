import { pgTable, text, integer, timestamp, serial, boolean } from 'drizzle-orm/pg-core';

// Users table (synced with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('student'),
  avatar: text('avatar'),
  gender: text('gender'),
  faculty: text('faculty'),
  points: integer('points').default(0).notNull(),
  level: integer('level').default(1).notNull(),
  savedPlansCount: integer('saved_plans_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Courses table
export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug'),
  description: text('description'),
  category: text('category').notNull(),
  level: text('level').default('ทุกระดับ'),
  durationHours: integer('duration_hours').default(10),
  lessonsCount: integer('lessons_count').default(5),
  rating: integer('rating').default(5),
  studentsCount: integer('students_count').default(0),
  instructorName: text('instructor_name'),
  instructorTitle: text('instructor_title'),
  thumbnail: text('thumbnail'),
  isFree: boolean('is_free').default(true),
  hasCertificate: boolean('has_certificate').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blogs & Community Posts
export const blogs = pgTable('blogs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  author: text('author').notNull(),
  authorRole: text('author_role'),
  authorAvatar: text('author_avatar'),
  coverImage: text('cover_image'),
  content: text('content').notNull(),
  likesCount: integer('likes_count').default(0).notNull(),
  views: integer('views').default(0).notNull(),
  status: text('status').default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Peer Stories
export const peerStories = pgTable('peer_stories', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  authorName: text('author_name').notNull(),
  authorFaculty: text('author_faculty'),
  authorYear: text('author_year'),
  careerTrack: text('career_track'),
  content: text('content').notNull(),
  keyTakeaway: text('key_takeaway'),
  likes: integer('likes').default(0).notNull(),
  commentsCount: integer('comments_count').default(0).notNull(),
  status: text('status').default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Events & Workshops
export const events = pgTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').default('Onsite').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  speaker: text('speaker').notNull(),
  speakerTitle: text('speaker_title'),
  seatsTotal: integer('seats_total').default(60).notNull(),
  seatsBooked: integer('seats_booked').default(0).notNull(),
  category: text('category'),
  image: text('image'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Student Course Notes
export const courseNotes = pgTable('course_notes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  studentName: text('student_name'),
  courseId: text('course_id').notNull(),
  courseTitle: text('course_title').notNull(),
  lessonId: text('lesson_id'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Site Settings (Hero Banner, etc.)
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(),
  heroBannerUrl: text('hero_banner_url').notNull(),
  updatedBy: text('updated_by'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
