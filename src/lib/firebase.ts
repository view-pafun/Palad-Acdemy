import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Course, BlogTopic, PeerStory, EventItem, CourseNote } from '../types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore (handles both custom DB ID and standard default database)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics (Browser-safe check)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully.');
    }
  }).catch(() => {
    // Ignore unsupported environment
  });
}

// ============================================================
// Error Handling: FirestoreErrorInfo Standard
// ============================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================
// Connection Validation (Boot Test)
// ============================================================
export async function validateFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    } else {
      console.log('Firebase connection check response received.');
    }
    return false;
  }
}

// Run boot connection check
validateFirebaseConnection();

// ============================================================
// Authentication Services
// ============================================================
export async function signInWithGoogleAuth(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    return await syncUserProfile(fbUser);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signOutAuth(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Sync Firebase User to Firestore UserProfile
export async function syncUserProfile(fbUser: FirebaseUser, extraData?: Partial<User>): Promise<User> {
  const userDocRef = doc(db, 'users', fbUser.uid);
  const path = `users/${fbUser.uid}`;

  try {
    const snap = await getDoc(userDocRef);
    const isAdminEmail = fbUser.email === 'view.pafunchusang@gmail.com' || fbUser.email?.includes('admin');

    if (snap.exists()) {
      const data = snap.data() as User;
      const updatedUser: User = {
        ...data,
        id: fbUser.uid,
        name: data.name || fbUser.displayName || 'ผู้ใช้งาน UDRU',
        email: fbUser.email || data.email || '',
        avatar: data.avatar || fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: isAdminEmail ? 'admin' : (data.role || 'student'),
      };
      return updatedUser;
    } else {
      const newUser: User = {
        id: fbUser.uid,
        name: extraData?.name || fbUser.displayName || 'ผู้ใช้งาน UDRU',
        email: fbUser.email || extraData?.email || '',
        role: isAdminEmail ? 'admin' : (extraData?.role || 'student'),
        avatar: fbUser.photoURL || extraData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        organization: extraData?.organization || 'คณะครุศาสตร์ / มหาวิทยาลัยราชภัฏอุดรธานี',
        institute: extraData?.institute || 'มหาวิทยาลัยราชภัฏอุดรธานี',
        province: extraData?.province || 'อุดรธานี',
        points: extraData?.points || 150,
        level: extraData?.level || 1,
        enrolledCourseIds: extraData?.enrolledCourseIds || ['course-1'],
        completedCourseIds: extraData?.completedCourseIds || [],
        savedPlansCount: extraData?.savedPlansCount || 1,
        badges: extraData?.badges || ['badge-1']
      };

      await setDoc(userDocRef, {
        ...newUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // If admin, also seed admin record
      if (isAdminEmail) {
        await setDoc(doc(db, 'admins', fbUser.uid), {
          id: fbUser.uid,
          email: fbUser.email,
          name: newUser.name,
          role: 'admin',
          permissions: { read: true, write: true, edit: true, delete: true },
          createdAt: new Date().toISOString()
        });
      }

      return newUser;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ============================================================
// Firestore Data Collections Sync & Seed
// ============================================================

export async function fetchCollectionData<T>(collectionName: string): Promise<T[]> {
  const path = collectionName;
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    return snap.docs.map(d => ({ ...d.data() }) as T);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

function cleanFirestoreObject<T>(obj: T): any {
  if (obj === undefined) return null;
  return JSON.parse(JSON.stringify(obj, (_key, value) => {
    if (value === undefined) return null;
    return value;
  }));
}

export async function saveDocument<T extends { id: string }>(collectionName: string, item: T): Promise<void> {
  // 1. Immediately persist to Browser LocalStorage cache (synchronous guarantee)
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `udru_col_${collectionName}`;
      const saved = localStorage.getItem(storageKey);
      let list: any[] = saved ? JSON.parse(saved) : [];
      const idx = list.findIndex((x) => x.id === item.id);
      if (idx >= 0) {
        list[idx] = item;
      } else {
        list.unshift(item);
      }
      localStorage.setItem(storageKey, JSON.stringify(list));

      if (collectionName === 'users') {
        localStorage.setItem(`udru_user_${item.id}`, JSON.stringify(item));
        localStorage.setItem('udru_current_user', JSON.stringify(item));
      }

      if (collectionName === 'siteSettings' && (item as any).heroBannerUrl) {
        localStorage.setItem('udru_hero_banner', (item as any).heroBannerUrl);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 2. Mirror to Server REST API
    const apiEndpoint = collectionName === 'peerStories' ? 'peer-stories' : collectionName;
    fetch(`/api/${apiEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }).catch(() => {});
  }

  // 3. Persist to Firebase Firestore
  const path = `${collectionName}/${item.id}`;
  try {
    const cleanItem = cleanFirestoreObject(item);
    await setDoc(doc(db, collectionName, item.id), cleanItem, { merge: true });
  } catch (error) {
    console.warn(`Firestore saveDocument warning (${path}):`, error);
  }
}

export async function removeDocument(collectionName: string, id: string): Promise<void> {
  // 1. Remove immediately from Browser LocalStorage cache
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `udru_col_${collectionName}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        let list: any[] = JSON.parse(saved);
        list = list.filter((x) => x.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('LocalStorage remove error:', e);
    }

    // 2. Mirror deletion to Server REST API
    const apiEndpoint = collectionName === 'peerStories' ? 'peer-stories' : collectionName;
    fetch(`/api/${apiEndpoint}/${id}`, {
      method: 'DELETE',
    }).catch(() => {});
  }

  // 3. Remove from Firebase Firestore
  const path = `${collectionName}/${id}`;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.warn(`Firestore removeDocument warning (${path}):`, error);
  }
}

// Seed initial courses, blogs, stories, and events if empty
export async function seedInitialFirestoreData(
  initialCourses: Course[],
  initialBlogs: BlogTopic[],
  initialStories: PeerStory[],
  initialEvents: EventItem[]
): Promise<void> {
  try {
    // Check courses
    const coursesSnap = await getDocs(collection(db, 'courses'));
    if (coursesSnap.empty && initialCourses.length > 0) {
      console.log('Seeding initial courses to Firestore...');
      for (const course of initialCourses) {
        const cleanCourse = cleanFirestoreObject(course);
        await setDoc(doc(db, 'courses', course.id), cleanCourse, { merge: true });
      }
    }

    // Check blogs
    const blogsSnap = await getDocs(collection(db, 'blogs'));
    if (blogsSnap.empty && initialBlogs.length > 0) {
      console.log('Seeding initial blogs to Firestore...');
      for (const blog of initialBlogs) {
        const cleanBlog = cleanFirestoreObject(blog);
        await setDoc(doc(db, 'blogs', blog.id), cleanBlog, { merge: true });
      }
    } else if (!blogsSnap.empty && initialBlogs.length > 0) {
      // Check if blogs in Firestore are using legacy topics or have old text
      const needsBlogSync = blogsSnap.docs.some(d => {
        const data = d.data();
        return !data.credits || 
          (typeof data.title === 'string' && (data.title.includes('วศค') || data.title.includes('วิศวกรสังคม'))) ||
          (typeof data.author === 'string' && (data.author.includes('วศค') || data.author.includes('วิศวกรสังคม')));
      }) || !blogsSnap.docs.some(d => d.id === 'blog-1' && d.data()?.title?.includes('Daily Intention'));

      if (needsBlogSync) {
        console.log('Updating legacy blogs to Coach Fon articles in Firestore...');
        for (const blog of initialBlogs) {
          const cleanBlog = cleanFirestoreObject(blog);
          await setDoc(doc(db, 'blogs', blog.id), cleanBlog, { merge: true });
        }
      }
    }

    // Check stories
    const storiesSnap = await getDocs(collection(db, 'peerStories'));
    if (storiesSnap.empty && initialStories.length > 0) {
      console.log('Seeding initial stories to Firestore...');
      for (const story of initialStories) {
        const cleanStory = cleanFirestoreObject(story);
        await setDoc(doc(db, 'peerStories', story.id), cleanStory, { merge: true });
      }
    } else if (!storiesSnap.empty && initialStories.length > 0) {
      const needsStorySync = storiesSnap.docs.some(d => {
        const s = d.data();
        return (s.authorYear && s.authorYear.includes('วศค')) || 
               (s.authorName && s.authorName.includes('วศค')) ||
               (s.title && s.title.includes('วศค'));
      });
      if (needsStorySync) {
        console.log('Updating stories to remove วศค....');
        for (const story of initialStories) {
          const cleanStory = cleanFirestoreObject(story);
          await setDoc(doc(db, 'peerStories', story.id), cleanStory, { merge: true });
        }
      }
    }

    // Check events
    const eventsSnap = await getDocs(collection(db, 'events'));
    if (eventsSnap.empty && initialEvents.length > 0) {
      console.log('Seeding initial events to Firestore...');
      for (const ev of initialEvents) {
        const cleanEv = cleanFirestoreObject(ev);
        await setDoc(doc(db, 'events', ev.id), cleanEv, { merge: true });
      }
    }

    // Check landing settings
    const settingsDoc = await getDoc(doc(db, 'siteSettings', 'landing'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'siteSettings', 'landing'), {
        heroBannerUrl: 'https://s.imgz.io/2026/10/09/792ee306f311a1f20f74869bf0501cb8122544b471a93be1.png',
        updatedBy: 'system',
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Initial seed check notice:', err);
  }
}

// ============================================================
// Personal Course Notes Services (Bound to Student User ID)
// ============================================================

export async function saveCourseNote(note: CourseNote): Promise<void> {
  // 1. Immediately persist to LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const localKey = `course_notes_${note.userId}_${note.courseId}`;
      const saved = localStorage.getItem(localKey);
      let list: CourseNote[] = saved ? JSON.parse(saved) : [];
      const idx = list.findIndex(n => n.id === note.id);
      if (idx >= 0) {
        list[idx] = note;
      } else {
        list.unshift(note);
      }
      localStorage.setItem(localKey, JSON.stringify(list));
    } catch {
      // ignore
    }

    // Mirror to server API
    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    }).catch(() => {});
  }

  // 2. Persist to Firestore
  const path = `users/${note.userId}/notes/${note.id}`;
  try {
    const noteRef = doc(db, 'users', note.userId, 'notes', note.id);
    await setDoc(noteRef, note);

    try {
      await setDoc(doc(db, 'courseNotes', note.id), note);
    } catch {
      // ignore
    }
  } catch (error) {
    console.warn(`Firestore saveCourseNote notice (${path}):`, error);
  }
}

export async function fetchUserCourseNotes(userId: string, courseId: string): Promise<CourseNote[]> {
  const localKey = `course_notes_${userId}_${courseId}`;
  let localNotes: CourseNote[] = [];
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(localKey);
      if (saved) localNotes = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  try {
    const notesRef = collection(db, 'users', userId, 'notes');
    const snap = await getDocs(notesRef);
    if (!snap.empty) {
      const notes = snap.docs.map((d) => d.data() as CourseNote);
      const filtered = notes
        .filter((n) => n.courseId === courseId)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
      
      // Update local storage
      if (typeof window !== 'undefined' && filtered.length > 0) {
        localStorage.setItem(localKey, JSON.stringify(filtered));
      }
      return filtered;
    }
    return localNotes;
  } catch (error) {
    console.warn('Note fetch fallback to local cache:', error);
    return localNotes;
  }
}

export async function deleteCourseNote(userId: string, noteId: string): Promise<void> {
  // 1. Remove from local storage
  if (typeof window !== 'undefined') {
    try {
      // Search all course notes keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`course_notes_${userId}`)) {
          const saved = localStorage.getItem(key);
          if (saved) {
            let list: CourseNote[] = JSON.parse(saved);
            list = list.filter(n => n.id !== noteId);
            localStorage.setItem(key, JSON.stringify(list));
          }
        }
      }
    } catch {
      // ignore
    }

    // Mirror to server API
    fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    }).catch(() => {});
  }

  // 2. Remove from Firestore
  try {
    await deleteDoc(doc(db, 'users', userId, 'notes', noteId));
    try {
      await deleteDoc(doc(db, 'courseNotes', noteId));
    } catch {
      // ignore
    }
  } catch (error) {
    console.warn('Firestore delete note notice:', error);
  }
}

