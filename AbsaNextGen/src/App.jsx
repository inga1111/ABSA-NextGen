

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import './styles/global.css';


import Onboarding from './pages/Onboarding';



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


function AppRoutes() {
  const { hasOnboarded } = useUser();

  
  if (!hasOnboarded) {
    return <Onboarding />;
  }

  
  return (
    <div className="app-layout">

      {/* Sidebar — swap this placeholder when we build Sidebar.jsx */}
      {/* <Sidebar /> */}
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

      {/* All pages render here */}
      <div className="main-content">
        <Routes>
          {/* Default route goes to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Swap Placeholder with real import as we build each page */}
          <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
          <Route path="/strategy-tracks" element={<Placeholder name="Strategy Tracks" />} />
          <Route path="/simulation-lab" element={<Placeholder name="Simulation Lab" />} />
          <Route path="/simulation-lab/lifestyle-studio" element={<Placeholder name="Lifestyle Studio" />} />
          <Route path="/simulation-lab/life-path-studio" element={<Placeholder name="Life Path Studio" />} />
          <Route path="/simulation-lab/future-wealth-studio" element={<Placeholder name="Future Wealth Studio" />} />
          <Route path="/banking-wrapped" element={<Placeholder name="Banking Wrapped" />} />
          <Route path="/chatbot" element={<Placeholder name="ChatBot" />} />
          <Route path="/profile" element={<Placeholder name="Profile" />} />
          <Route path="/settings" element={<Placeholder name="Settings" />} />

          {/* Catch all unknown routes back to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>

    </div>
  );
}


function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
