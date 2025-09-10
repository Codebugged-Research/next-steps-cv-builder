import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Dashboard/Header'
import Footer from './components/Dashboard/Footer'
import Sidebar from './components/Dashboard/Sidebar'
import CVBuilder from './components/Dashboard/CVBuilder/CVBuilder'
import SystematicReviews from './components/Dashboard/SystematicReview/SystematicReviews'
import CaseReports from './components/Dashboard/CaseReports/CaseReports'
import Conferences from './components/Dashboard/Conferences/Conferences'
import Existingcv from './components/Dashboard/ExistingCV/Existingcv'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './utils/api';

function App() {
  const [activeSection, setActiveSection] = useState('cv-builder');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCVStep, setCurrentCVStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/users/current-user', { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setActiveSection('cv-builder');
      // Reset CV builder states on logout
      setCurrentCVStep(1);
      setCompletedSteps([]);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Reset CV step when switching to CV builder from other sections
    if (section === 'cv-builder' && activeSection !== 'cv-builder') {
      setCurrentCVStep(1);
    }
  };

  const handleCVStepChange = (step) => {
    setCurrentCVStep(step);
  };

  const handleStepComplete = (step) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step].sort((a, b) => a - b));
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'cv-builder':
        return (
          <CVBuilder
            key={user?._id || "guest"}
            user={user}
            currentStep={currentCVStep}
            onStepChange={handleCVStepChange}
            onStepComplete={handleStepComplete}
          />
        );

      case 'existing-cv':
        return (
          <Existingcv onBack={() => setActiveSection('cv-builder')} />
        );

      case 'systematic-reviews':
        return (
          <SystematicReviews
            onBack={() => setActiveSection('cv-builder')}
            user={user}
          />
        );

      case 'case-reports':
        return (
          <CaseReports
            onBack={() => setActiveSection('cv-builder')}
            user={user}
          />
        );

      case 'conferences':
        return (
          <Conferences
            onBack={() => setActiveSection('cv-builder')}
            user={user}
          />
        );

      case 'workshops':
        return (
          <Workshops
            onBack={() => setActiveSection('cv-builder')}
            user={user}
          />
        );

      case 'emr-training':
        return (
          <EMRTraining
            onBack={() => setActiveSection('cv-builder')}
            user={user}
          />
        );

      default:
        return (
          <CVBuilder
            key={user?._id || "guest"}
            user={user}
            currentStep={currentCVStep}
            onStepChange={handleCVStepChange}
            onStepComplete={handleStepComplete}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-[#04445E]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        showRegister ? (
          <Register
            onRegister={handleRegister}
            onNavigateToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onNavigateToRegister={() => setShowRegister(true)}
          />
        )
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header user={user} onLogout={handleLogout} />

          <div className="flex-1 max-w-full w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8 h-full">
              <Sidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                user={user}
                // CV Builder specific props - only pass when CV Builder is active
                currentStep={activeSection === 'cv-builder' ? currentCVStep : null}
                onStepChange={activeSection === 'cv-builder' ? handleCVStepChange : null}
                completedSteps={activeSection === 'cv-builder' ? completedSteps : []}
              />
              <div className="flex-1">
                {renderActiveSection()}
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;