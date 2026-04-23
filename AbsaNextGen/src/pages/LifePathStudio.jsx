
import { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Studios.css';

// Location cost estimates per month (rent + living costs)
const LOCATIONS = [
  { id: 'sandton', name: 'Sandton', baseCost: 18000, emoji: '🏙️' },
  { id: 'rosebank', name: 'Rosebank', baseCost: 15000, emoji: '🌆' },
  { id: 'midrand', name: 'Midrand', baseCost: 11000, emoji: '🏘️' },
  { id: 'pretoria', name: 'Pretoria', baseCost: 9000, emoji: '🏛️' },
  { id: 'ruimsig', name: 'Ruimsig', baseCost: 10000, emoji: '🌳' },
  { id: 'soweto', name: 'Soweto', baseCost: 6000, emoji: '🏡' },
];

// Lifestyle multipliers
const LIFESTYLE_LEVELS = [
  { id: 'minimal', label: 'Minimal', multiplier: 0.7, emoji: '🌱', desc: 'Basic needs, no frills' },
  { id: 'comfortable', label: 'Comfortable', multiplier: 1.0, emoji: '😊', desc: 'Balanced lifestyle' },
  { id: 'premium', label: 'Premium', multiplier: 1.5, emoji: '✨', desc: 'High-end living' },
];

function getStressLevel(leftover, netMonthly) {
  const ratio = leftover / netMonthly;
  if (ratio > 0.25) return { label: 'Comfortable', colour: '#2ECC71', level: 20 };
  if (ratio > 0.10) return { label: 'Moderate', colour: '#F4D03F', level: 55 };
  if (ratio > 0) return { label: 'Tight', colour: '#E8490F', level: 80 };
  return { label: 'Critical', colour: '#E74C3C', level: 100 };
}

function LifePathStudio() {
  const { userData, formatCurrency } = useUser();
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState('sandton');
  const [lifestyleLevel, setLifestyleLevel] = useState('comfortable');
  const [hasSimulated, setHasSimulated] = useState(false);

  const netMonthly = userData.netMonthly || 39000;
  const location = LOCATIONS.find(l => l.id === selectedLocation);
  const lifestyle = LIFESTYLE_LEVELS.find(l => l.id === lifestyleLevel);

  const results = useMemo(() => {
    const housingCost = location.baseCost * lifestyle.multiplier;
    const otherLiving = (netMonthly * 0.25) * lifestyle.multiplier;
    const totalCost = housingCost + otherLiving;
    const leftover = netMonthly - totalCost;
    const savingsPotential = Math.max(0, leftover * 0.5);
    const stress = getStressLevel(leftover, netMonthly);

    return {
      housingCost: Math.round(housingCost),
      otherLiving: Math.round(otherLiving),
      totalCost: Math.round(totalCost),
      leftover: Math.round(leftover),
      savingsPotential: Math.round(savingsPotential),
      stress,
    };
  }, [selectedLocation, lifestyleLevel, netMonthly, location, lifestyle]);

  return (
    <div className="studio-wrapper">
      <button className="studio-back-btn" onClick={() => navigate('/simulation-lab')}>
        ← Back to Studios
      </button>

      <div className="studio-header">
        <div className="studio-header-icon">🗺️</div>
        <div>
          <h1>Life Path <span className="text-orange">Studio</span></h1>
          <p>Design your life according to your finances. Choose your location and lifestyle level to see the real impact.</p>
        </div>
      </div>

      <div className="studio-content">

        {/* ---- LEFT: Controls ---- */}
        <div className="studio-controls">

          <div className="studio-card-block">
            <div className="studio-block-title">Your Monthly Income</div>
            <div className="studio-income-display">{formatCurrency(netMonthly)}</div>
            <div className="studio-income-sub">take-home per month</div>
          </div>

          {/* Location picker */}
          <div className="studio-card-block">
            <div className="studio-block-title">Where Would You Like to Live?</div>
            <div className="location-grid">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc.id}
                  className={`location-card ${selectedLocation === loc.id ? 'active' : ''}`}
                  onClick={() => setSelectedLocation(loc.id)}
                >
                  <div className="location-emoji">{loc.emoji}</div>
                  <div className="location-name">{loc.name}</div>
                  <div className="location-cost">{formatCurrency(loc.baseCost)}/mo</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle level */}
          <div className="studio-card-block">
            <div className="studio-block-title">Lifestyle Level</div>
            <div className="lifestyle-options">
              {LIFESTYLE_LEVELS.map((level) => (
                <div
                  key={level.id}
                  className={`lifestyle-option ${lifestyleLevel === level.id ? 'active' : ''}`}
                  onClick={() => setLifestyleLevel(level.id)}
                >
                  <div className="lifestyle-emoji">{level.emoji}</div>
                  <div className="lifestyle-label">{level.label}</div>
                  <div className="lifestyle-desc">{level.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="studio-simulate-btn"
            onClick={() => setHasSimulated(true)}
          >
            Design My Life →
          </button>
        </div>

        {/* ---- RIGHT: Results ---- */}
        <div className="studio-results">
          {!hasSimulated ? (
            <div className="studio-results-placeholder">
              <div className="studio-placeholder-icon">🗺️</div>
              <div className="studio-placeholder-text">Choose your location and lifestyle, then hit Design My Life</div>
            </div>
          ) : (
            <>
              {/* Financial stress meter */}
              <div className="studio-card-block">
                <div className="studio-block-title">Financial Stress Indicator</div>
                <div className="stress-label" style={{ color: results.stress.colour }}>
                  {results.stress.label}
                </div>
                <div className="stress-bar-track">
                  <div
                    className="stress-bar-fill"
                    style={{
                      width: `${results.stress.level}%`,
                      background: results.stress.colour,
                    }}
                  />
                </div>
                <div className="stress-bar-labels">
                  <span style={{ color: '#2ECC71' }}>Comfortable</span>
                  <span style={{ color: '#E74C3C' }}>Critical</span>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="studio-card-block">
                <div className="studio-block-title">Monthly Cost Breakdown</div>
                <div className="lifepath-breakdown">
                  <div className="lifepath-row">
                    <span>Housing in {location.name}</span>
                    <span style={{ color: '#E74C3C' }}>{formatCurrency(results.housingCost)}</span>
                  </div>
                  <div className="lifepath-row">
                    <span>Living Costs ({lifestyle.label})</span>
                    <span style={{ color: '#E74C3C' }}>{formatCurrency(results.otherLiving)}</span>
                  </div>
                  <div className="lifepath-divider" />
                  <div className="lifepath-row bold">
                    <span>Total Monthly Costs</span>
                    <span>{formatCurrency(results.totalCost)}</span>
                  </div>
                  <div className="lifepath-row bold">
                    <span>Monthly Leftover</span>
                    <span style={{ color: results.leftover > 0 ? '#2ECC71' : '#E74C3C' }}>
                      {formatCurrency(results.leftover)}
                    </span>
                  </div>
                  <div className="lifepath-row">
                    <span>Savings Potential</span>
                    <span style={{ color: '#00C9B1' }}>{formatCurrency(results.savingsPotential)}</span>
                  </div>
                </div>
              </div>

              {/* Narrative */}
              <div className="studio-narrative">
                <div className="studio-narrative-title">Your Story</div>
                <div className="studio-narrative-text">
                  {results.leftover < 2000
                    ? `Living in ${location.name} with a ${lifestyle.label.toLowerCase()} lifestyle leaves you only ${formatCurrency(results.leftover)} per month. Consider scaling down your location or lifestyle until you generate more wealth.`
                    : `Living in ${location.name} with a ${lifestyle.label.toLowerCase()} lifestyle leaves you ${formatCurrency(results.leftover)} per month. You could save up to ${formatCurrency(results.savingsPotential)} if you put half your leftover away consistently.`
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LifePathStudio;
