// ============================================
// ABSA NEXTGEN WEALTH STUDIO — APP.JSX
// File location: src/App.jsx
// ============================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './styles/global.css';
import { UserProvider, useUser } from './context/UserContext';

// We will uncomment these one by one as we build each page
// import Sidebar from './components/Sidebar';
// import Onboarding from './pages/Onboarding';
// import Dashboard from './pages/Dashboard';
// import StrategyTracks from './pages/StrategyTracks';
// import SimulationLab from './pages/SimulationLab';
// import LifestyleStudio from './pages/LifestyleStudio';
// import LifePathStudio from './pages/LifePathStudio';
// import FutureWealthStudio from './pages/FutureWealthStudio';
// import BankingWrapped from './pages/BankingWrapped';
// import ChatBot from './pages/ChatBot';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';

// -----------------------------------------------
// TEMPORARY placeholder so the app doesnt crash
// while we are still building pages one by one.
// We will replace each one as we go.
// -----------------------------------------------
const Placeholder = ({ name }) => (
  <div style={{
    padding: '40px',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }}>
    {name} — coming soon
  </div>
);

function App() {
  // This tracks whether the user has completed onboarding
  // We will replace this with UserContext later
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Once the user finishes the onboarding form,
  // we call this to let them into the main app
  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
  };

  return (
    <Router>
      {/*
        If user has NOT onboarded yet,
        show the onboarding page no matter what URL they go to.
        Once they complete it, show the full app with sidebar.
      */}
      {!hasOnboarded ? (
        // We will replace this placeholder with the real Onboarding page next
        <div style={{ color: 'white', padding: '40px' }}>
          <h2>Onboarding page coming next!</h2>
          {/* Temporary button so you can test routing while we build */}
          <button
            onClick={handleOnboardingComplete}
            style={{
              marginTop: '20px',
              padding: '12px 28px',
              background: '#E8490F',
              color: 'white',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Skip to App (for testing only)
          </button>
        </div>
      ) : (
        // Full app layout with sidebar
        <div className="app-layout">

          {/* Sidebar goes here — we will uncomment once built */}
          {/* <Sidebar /> */}

          {/* Temporary sidebar placeholder so layout doesnt look broken */}
          <div style={{
            width: '220px',
            minHeight: '100vh',
            background: '#0A0A1F',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.8rem',
            position: 'fixed',
            left: 0,
            top: 0
          }}>
            Sidebar coming soon
          </div>

          {/* Main page content */}
          <div className="main-content">
            <Routes>
              {/* Default → Dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Core pages — replace Placeholder with real import as we build */}
              <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
              <Route path="/strategy-tracks" element={<Placeholder name="Strategy Tracks" />} />

              {/* Simulation Lab */}
              <Route path="/simulation-lab" element={<Placeholder name="Simulation Lab" />} />
              <Route path="/simulation-lab/lifestyle-studio" element={<Placeholder name="Lifestyle Studio" />} />
              <Route path="/simulation-lab/life-path-studio" element={<Placeholder name="Life Path Studio" />} />
              <Route path="/simulation-lab/future-wealth-studio" element={<Placeholder name="Future Wealth Studio" />} />

              {/* Other sections */}
              <Route path="/banking-wrapped" element={<Placeholder name="Banking Wrapped" />} />
              <Route path="/chatbot" element={<Placeholder name="ChatBot" />} />
              <Route path="/profile" element={<Placeholder name="Profile" />} />
              <Route path="/settings" element={<Placeholder name="Settings" />} />

              {/* Catch all unknown routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>

        </div>
      )}
    </Router>
  );
}

export default App;
