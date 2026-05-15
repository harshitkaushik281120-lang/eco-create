import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Section = 'home' | 'converter' | 'dashboard' | 'leaderboard' | 'quiz' | 'challenges';

interface Notification {
  icon: string;
  text: string;
  sub: string;
}

interface AppContextType {
  currentSection: Section;
  showSection: (s: Section) => void;
  userPoints: number;
  addPoints: (pts: number) => void;
  notification: Notification | null;
  showNotification: (n: Notification) => void;
  modalOpen: boolean;
  modalTitle: string;
  modalBody: string;
  openModal: (title: string, body: string) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [userPoints, setUserPoints] = useState(2340);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notifTimeout, setNotifTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

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

  const addPoints = useCallback((pts: number) => {
    setUserPoints(p => p + pts);
    showNotification({ icon: '⭐', text: `+${pts} Points Earned!`, sub: 'Keep up the great eco work!' });
  }, [showNotification]);

  const openModal = useCallback((title: string, body: string) => {
    setModalTitle(title);
    setModalBody(body);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <AppContext.Provider value={{
      currentSection, showSection,
      userPoints, addPoints,
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
