import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/Sidebar.css';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '⊞',
  },
  {
    label: 'Strategy Tracks',
    path: '/strategy-tracks',
    icon: '🎯',
  },
  {
    label: 'Simulation Lab',
    path: '/simulation-lab',
    icon: '🧪',
  },
  {
    label: 'Banking Wrapped',
    path: '/banking-wrapped',
    icon: '🎵',
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: '👤',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: '⚙️',
  },
];

function Sidebar() {
  const { userData } = useUser();
  const location = useLocation();
  const isSimLabActive = location.pathname.startsWith('/simulation-lab');

  return (
    <div className="sidebar">

      {/* ---- TOP: ABSA Logo ---- */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-badge">absa</div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">NextGen</span>
          <span className="sidebar-logo-sub">Wealth Studio</span>
        </div>
      </div>

      {/* ---- USER GREETING ---- */}
      {userData.firstName && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {userData.firstName.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">
              {userData.firstName} {userData.lastName}
            </span>
            <span className="sidebar-user-occupation">
              {userData.occupation || 'Welcome back'}
            </span>
          </div>
        </div>
      )}

      <div className="sidebar-divider" />

      {/* ---- NAVIGATION LINKS ---- */}
      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Main Menu</p>

        {NAV_ITEMS.map((item) => {
          // Special case: keep Sim Lab highlighted on sub-pages
          const isActive =
            item.path === '/simulation-lab'
              ? isSimLabActive
              : location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label-text">{item.label}</span>

              {/* Active indicator dot */}
              {isActive && <span className="sidebar-nav-dot" />}
            </NavLink>
          );
        })}
      </nav>

      {/* ---- BOTTOM: Chatbot Button ---- */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <NavLink
          to="/chatbot"
          className={`sidebar-chatbot-btn ${location.pathname === '/chatbot' ? 'active' : ''}`}
        >
          <div className="sidebar-chatbot-icon">💬</div>
          <div className="sidebar-chatbot-text">
            <span className="sidebar-chatbot-title">Ask our ChatBot</span>
            <span className="sidebar-chatbot-sub">Financial assistant</span>
          </div>
        </NavLink>
      </div>

    </div>
  );
}

export default Sidebar;
