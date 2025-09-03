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


function App() {
  const [activeSection, setActiveSection] = useState('cv-builder');
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 max-w-full w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 h-full">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <div className="flex-1 ">
            {activeSection === 'cv-builder' && <CVBuilder />}
            {activeSection === 'systematic-reviews' && <SystematicReviews onBack={() => setActiveSection('cv-builder')} />}
            {activeSection === 'case-reports' && <CaseReports onClick={() => setActiveSection('cv-builder')} />}
            {activeSection === 'conferences' && <Conferences onClick={()=> setActiveSection('cv-builder')} />}
            {activeSection === 'workshops' && <div>Workshops Component</div>}
            {activeSection === 'emr-training' && <div>EMR Training Component</div>}
          </div>
        </div>
      </div>
      <Footer />
      <Login />
      <Register/>
    </div>
  )
}

export default App