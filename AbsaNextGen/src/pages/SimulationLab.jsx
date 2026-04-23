

import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/SimulationLab.css';

const STUDIOS = [
  {
    id: 'lifestyle',
    path: '/simulation-lab/lifestyle-studio',
    icon: '🚗',
    title: 'Lifestyle Studio',
    subtitle: 'Spend vs Invest',
    description: 'Compare the financial impact of lifestyle choices like a car purchase against investing that money instead. Discover your financial identity.',
    tag: 'Establish a Lifestyle Identity',
    colour: '#E8490F',
  },
  {
    id: 'lifepath',
    path: '/simulation-lab/life-path-studio',
    icon: '🗺️',
    title: 'Life Path Studio',
    subtitle: 'Lifestyle Cost Simulation',
    description: 'Design your life according to your finances. Choose where you want to live and your lifestyle level to see the real financial impact.',
    tag: 'Design Your Life',
    colour: '#3B82F6',
  },
  {
    id: 'futurewealth',
    path: '/simulation-lab/future-wealth-studio',
    icon: '🔮',
    title: 'Future Wealth Studio',
    subtitle: 'Savings and Investment Growth',
    description: 'See your life five years from now. Project your net worth, savings and milestones based on your current financial habits.',
    tag: 'See Your Life 5 Years From Now',
    colour: '#8B5CF6',
  },
];

function SimulationLab() {
  const navigate = useNavigate();
  const { userData, formatCurrency } = useUser();

  return (
    <div className="simlab-wrapper">

      {/* ---- PAGE HEADER ---- */}
      <div className="page-header">
        <h1>Know Your Money using <span className="text-orange">Simulation Studios</span></h1>
        <p>Interactive tools that help you explore how your financial choices shape your future. No stress, just insight.</p>
      </div>

      {/* ---- INTRO BANNER ---- */}
      <div className="simlab-banner">
        <div className="simlab-banner-text">
          <div className="simlab-banner-title">Welcome to the Simulation Lab</div>
          <div className="simlab-banner-desc">
            Unlike traditional financial calculators, our studios focus on storytelling,
            identity and behavioural insight. Pick a studio below to get started.
          </div>
        </div>
        <div className="simlab-banner-stat">
          <div className="simlab-banner-stat-label">Your Net Income</div>
          <div className="simlab-banner-stat-value">{formatCurrency(userData.netMonthly)}</div>
          <div className="simlab-banner-stat-sub">per month to work with</div>
        </div>
      </div>

      {/* ---- STUDIO CARDS ---- */}
      <div className="simlab-studios">
        {STUDIOS.map((studio) => (
          <div
            key={studio.id}
            className="studio-card"
            style={{ '--studio-colour': studio.colour }}
            onClick={() => navigate(studio.path)}
          >
            <div className="studio-card-top">
              <div className="studio-icon">{studio.icon}</div>
              <div className="studio-tag">{studio.tag}</div>
            </div>

            <div className="studio-title">{studio.title}</div>
            <div className="studio-subtitle">{studio.subtitle}</div>
            <div className="studio-desc">{studio.description}</div>

            <div className="studio-cta">
              Enter Studio →
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default SimulationLab;
