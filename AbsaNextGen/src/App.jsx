import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import './styles/global.css';
import Onboarding from './pages/Onboarding';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StrategyTracks from './pages/StrategyTracks';
import SimulationLab from './pages/SimulationLab';
import LifestyleStudio from './pages/LifestyleStudio';
import LifePathStudio from './pages/LifePathStudio';
import FutureWealthStudio from './pages/FutureWealthStudio';
import BankingWrapped from './pages/BankingWrapped';
import ChatBot from './pages/ChatBot';

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
      <Sidebar />

      {/* All pages render here */}
      <div className="main-content">
        <Routes>
          {/* Default route goes to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Main pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/strategy-tracks" element={<StrategyTracks />} />
          <Route path="/simulation-lab" element={<SimulationLab />} />
          <Route path="/simulation-lab/lifestyle-studio" element={<LifestyleStudio />} />
          <Route path="/simulation-lab/life-path-studio" element={<LifePathStudio />} />
          <Route path="/simulation-lab/future-wealth-studio" element={<FutureWealthStudio />} />
          <Route path="/banking-wrapped" element={<BankingWrapped />} />
          <Route path="/chatbot" element={<ChatBot />} />
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
