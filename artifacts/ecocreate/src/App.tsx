import { AppProvider, useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import NotificationToast from '@/components/NotificationToast';
import Modal from '@/components/Modal';
import Footer from '@/components/Footer';
import EcoFactPopup from '@/components/EcoFactPopup';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Converter from '@/pages/Converter';
import Dashboard from '@/pages/Dashboard';
import Leaderboard from '@/pages/Leaderboard';
import Quiz from '@/pages/Quiz';
import Challenges from '@/pages/Challenges';

function AppContent() {
  const { currentUser, currentSection } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <>
      <Navbar />
      <NotificationToast />
      <Modal />
      <EcoFactPopup />
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
