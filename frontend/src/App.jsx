import { useState } from 'react'
import './App.css'
import Header from './components/Dashboard/Header'
import Footer from './components/Dashboard/Footer'
import Sidebar from './components/Dashboard/Sidebar'
import CVBuilder from './components/Dashboard/CVBuilder/CVBuilder'
import SystematicReviews from './components/Dashboard/SystematicReview/SystematicReviews'
import CaseReports from './components/Dashboard/CaseReports/CaseReports'
import Conferences from './components/Dashboard/Conferences/Conferences'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeSection, setActiveSection] = useState('cv-builder');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

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

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setActiveSection('cv-builder');
  };

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
                onSectionChange={setActiveSection}
                user={user}
              />
              <div className="flex-1">
                {activeSection === 'cv-builder' && <CVBuilder user={user} />}
                {activeSection === 'systematic-reviews' && <SystematicReviews onBack={() => setActiveSection('cv-builder')} />}
                {activeSection === 'case-reports' && <CaseReports onBack={() => setActiveSection('cv-builder')} />}
                {activeSection === 'conferences' && <Conferences onBack={() => setActiveSection('cv-builder')} />}
                {activeSection === 'workshops' && <div>Workshops Component</div>}
                {activeSection === 'emr-training' && <div>EMR Training Component</div>}
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