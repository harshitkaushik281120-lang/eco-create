import { AppProvider, useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import NotificationToast from '@/components/NotificationToast';
import Modal from '@/components/Modal';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Converter from '@/pages/Converter';
import Dashboard from '@/pages/Dashboard';
import Leaderboard from '@/pages/Leaderboard';
import Quiz from '@/pages/Quiz';
import Challenges from '@/pages/Challenges';

function AppContent() {
  const { currentSection } = useApp();

  return (
    <>
      <Navbar />
      <NotificationToast />
      <Modal />
      <main>
        {currentSection === 'home' && <Home />}
        {currentSection === 'converter' && <Converter />}
        {currentSection === 'dashboard' && <Dashboard />}
        {currentSection === 'leaderboard' && <Leaderboard />}
        {currentSection === 'quiz' && <Quiz />}
        {currentSection === 'challenges' && <Challenges />}
      </main>
      {currentSection === 'home' && <Footer />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
