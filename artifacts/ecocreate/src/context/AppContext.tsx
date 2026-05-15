import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type Section = 'home' | 'converter' | 'dashboard' | 'leaderboard' | 'quiz' | 'challenges';

export interface GalleryPhoto {
  type: 'upload';
  src: string;
  caption: string;
  date: string;
}

export interface QuizAttempt {
  score: number;
  total: number;
  date: string;
}

export interface DailyTask {
  label: string;
  pts: number;
  done: boolean;
}

export interface UserProfile {
  username: string;
  points: number;
  creations: number;
  gallery: GalleryPhoto[];
  quizHistory: QuizAttempt[];
  joinedChallenges: string[];
  dailyTasks: DailyTask[];
  lastTaskDate: string;
  joinedAt: string;
}

interface Notification {
  icon: string;
  text: string;
  sub: string;
}

const DEFAULT_TASKS: DailyTask[] = [
  { label: 'Convert 1 waste material', pts: 25, done: false },
  { label: 'Take the daily eco quiz', pts: 15, done: false },
  { label: 'Upload a creation photo', pts: 20, done: false },
  { label: 'Share a tip with community', pts: 10, done: false },
];

const STORAGE_KEY = 'ecocreate_users';
const ACTIVE_KEY = 'ecocreate_active_user';

function loadAllUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllUsers(users: Record<string, UserProfile>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch { /* storage full — ignore */ }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function freshUserProfile(username: string): UserProfile {
  return {
    username,
    points: 0,
    creations: 0,
    gallery: [],
    quizHistory: [],
    joinedChallenges: [],
    dailyTasks: DEFAULT_TASKS.map(t => ({ ...t })),
    lastTaskDate: todayStr(),
    joinedAt: new Date().toISOString(),
  };
}

function maybeResetDailyTasks(profile: UserProfile): UserProfile {
  if (profile.lastTaskDate !== todayStr()) {
    return {
      ...profile,
      dailyTasks: DEFAULT_TASKS.map(t => ({ ...t })),
      lastTaskDate: todayStr(),
    };
  }
  return profile;
}

interface AppContextType {
  // Auth
  currentUser: UserProfile | null;
  login: (username: string) => void;
  logout: () => void;

  // Navigation
  currentSection: Section;
  showSection: (s: Section) => void;

  // User stats (derived from currentUser, but convenient)
  userPoints: number;
  addPoints: (pts: number) => void;

  // Gallery
  gallery: GalleryPhoto[];
  addToGallery: (photo: GalleryPhoto) => void;

  // Quiz
  quizHistory: QuizAttempt[];
  recordQuizAttempt: (score: number, total: number) => void;

  // Daily tasks
  dailyTasks: DailyTask[];
  completeTask: (index: number) => void;

  // Challenges
  joinedChallenges: string[];
  joinChallenge: (id: string) => void;

  // Notifications
  notification: Notification | null;
  showNotification: (n: Notification) => void;

  // Modal
  modalOpen: boolean;
  modalTitle: string;
  modalBody: string;
  openModal: (title: string, body: string) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const activeUsername = localStorage.getItem(ACTIVE_KEY);
    if (!activeUsername) return null;
    const users = loadAllUsers();
    const profile = users[activeUsername];
    if (!profile) return null;
    return maybeResetDailyTasks(profile);
  });

  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notifTimeout, setNotifTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  // Persist user whenever it changes
  useEffect(() => {
    if (!currentUser) return;
    const users = loadAllUsers();
    users[currentUser.username] = currentUser;
    saveAllUsers(users);
  }, [currentUser]);

  const login = useCallback((username: string) => {
    const users = loadAllUsers();
    let profile = users[username];
    if (!profile) {
      profile = freshUserProfile(username);
    } else {
      profile = maybeResetDailyTasks(profile);
    }
    users[username] = profile;
    saveAllUsers(users);
    localStorage.setItem(ACTIVE_KEY, username);
    setCurrentUser(profile);
    setCurrentSection('home');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACTIVE_KEY);
    setCurrentUser(null);
    setCurrentSection('home');
  }, []);

  const showSection = useCallback((s: Section) => {
    setCurrentSection(s);
    window.scrollTo(0, 0);
  }, []);

  const showNotification = useCallback((n: Notification) => {
    setNotification(n);
    if (notifTimeout) clearTimeout(notifTimeout);
    const t = setTimeout(() => setNotification(null), 3500);
    setNotifTimeout(t);
  }, [notifTimeout]);

  const updateUser = useCallback((updater: (prev: UserProfile) => UserProfile) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      return updater(prev);
    });
  }, []);

  const addPoints = useCallback((pts: number) => {
    updateUser(prev => ({ ...prev, points: prev.points + pts }));
    showNotification({ icon: '⭐', text: `+${pts} Points Earned!`, sub: 'Keep up the great eco work!' });
  }, [updateUser, showNotification]);

  const addToGallery = useCallback((photo: GalleryPhoto) => {
    updateUser(prev => ({
      ...prev,
      gallery: [photo, ...prev.gallery],
      creations: prev.creations + 1,
    }));
  }, [updateUser]);

  const recordQuizAttempt = useCallback((score: number, total: number) => {
    const attempt: QuizAttempt = {
      score, total,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    updateUser(prev => ({
      ...prev,
      quizHistory: [attempt, ...prev.quizHistory].slice(0, 20),
    }));
  }, [updateUser]);

  const completeTask = useCallback((index: number) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      if (prev.dailyTasks[index]?.done) return prev;
      const updated = prev.dailyTasks.map((t, i) => i === index ? { ...t, done: true } : t);
      const pts = prev.dailyTasks[index].pts;
      const next = { ...prev, dailyTasks: updated, points: prev.points + pts };
      showNotification({ icon: '✅', text: `Task complete! +${pts} pts`, sub: prev.dailyTasks[index].label });
      return next;
    });
  }, [showNotification]);

  const joinChallenge = useCallback((id: string) => {
    updateUser(prev => {
      if (prev.joinedChallenges.includes(id)) return prev;
      return { ...prev, joinedChallenges: [...prev.joinedChallenges, id] };
    });
  }, [updateUser]);

  const openModal = useCallback((title: string, body: string) => {
    setModalTitle(title); setModalBody(body); setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      currentSection, showSection,
      userPoints: currentUser?.points ?? 0,
      addPoints,
      gallery: currentUser?.gallery ?? [],
      addToGallery,
      quizHistory: currentUser?.quizHistory ?? [],
      recordQuizAttempt,
      dailyTasks: currentUser?.dailyTasks ?? DEFAULT_TASKS.map(t => ({ ...t })),
      completeTask,
      joinedChallenges: currentUser?.joinedChallenges ?? [],
      joinChallenge,
      notification, showNotification,
      modalOpen, modalTitle, modalBody, openModal, closeModal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
