import { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../styles/Studios.css';

const INVESTMENT_STYLES = [
  { id: 'safe', label: 'Safe', rate: 0.07, emoji: '🛡️', desc: 'Money market and fixed deposits (~7% return)' },
  { id: 'balanced', label: 'Balanced Growth', rate: 0.10, emoji: '⚖️', desc: 'Unit trusts and TFSA mix (~10% return)' },
  { id: 'aggressive', label: 'Aggressive Growth', rate: 0.14, emoji: '🚀', desc: 'ETFs and offshore exposure (~14% return)' },
];

function getMilestone(netWorth, netMonthly) {
  const depositTarget = netMonthly * 12 * 2.5;
  if (netWorth >= depositTarget * 2) return { label: 'Financially Free', emoji: '🏆', colour: '#2ECC71' };
  if (netWorth >= depositTarget) return { label: 'Can Afford Property Deposit', emoji: '🏠', colour: '#00C9B1' };
  if (netWorth >= depositTarget * 0.5) return { label: 'Getting There', emoji: '📈', colour: '#F4D03F' };
  return { label: 'Still Building', emoji: '🔨', colour: '#E8490F' };
}

function FutureWealthStudio() {
  const { userData, formatCurrency } = useUser();
  const navigate = useNavigate();

  const [monthlySavings, setMonthlySavings] = useState(userData.monthlySavings || 3000);
  const [investmentStyle, setInvestmentStyle] = useState('balanced');
  const [hasSimulated, setHasSimulated] = useState(false);

  const netMonthly = userData.netMonthly || 39000;
  const style = INVESTMENT_STYLES.find(s => s.id === investmentStyle);

  // Build 5 year month-by-month projection
  const projectionData = useMemo(() => {
    const monthlyRate = style.rate / 12;
    let balance = 0;
    const data = [];

    for (let month = 0; month <= 60; month++) {
      if (month > 0) {
        balance = (balance + monthlySavings) * (1 + monthlyRate);
      }
      if (month % 12 === 0) {
        data.push({
          year: `Year ${month / 12}`,
          value: Math.round(balance),
        });
      }
    }
    return data;
  }, [monthlySavings, style]);

  const finalNetWorth = projectionData[projectionData.length - 1]?.value || 0;
  const milestone = getMilestone(finalNetWorth, netMonthly);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#1A1A35',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px 16px',
        }}>
          <p style={{ color: '#A0A0C0', fontSize: '0.78rem' }}>{label}</p>
          <p style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '1rem' }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="studio-wrapper">
      <button className="studio-back-btn" onClick={() => navigate('/simulation-lab')}>
        ← Back to Studios
      </button>

      <div className="studio-header">
        <div className="studio-header-icon">🔮</div>
        <div>
          <h1>Future Wealth <span className="text-orange">Studio</span></h1>
          <p>See your life five years from now based on your current savings and investment habits.</p>
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

          {/* Savings slider */}
          <div className="studio-card-block">
            <div className="studio-block-title">Monthly Savings Amount</div>
            <div className="studio-slider-value">{formatCurrency(monthlySavings)}</div>
            <input
              type="range"
              min={500}
              max={Math.round(netMonthly * 0.6)}
              step={500}
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="studio-slider purple"
            />
            <div className="studio-slider-labels">
              <span>R500</span>
              <span>{formatCurrency(Math.round(netMonthly * 0.6))}</span>
            </div>
            <div className="studio-percent-bar-label">
              That is <strong style={{ color: '#8B5CF6' }}>
                {Math.round((monthlySavings / netMonthly) * 100)}%
              </strong> of your income
            </div>
          </div>

          {/* Investment style */}
          <div className="studio-card-block">
            <div className="studio-block-title">Investment Style</div>
            <div className="invest-style-options">
              {INVESTMENT_STYLES.map((s) => (
                <div
                  key={s.id}
                  className={`invest-style-option ${investmentStyle === s.id ? 'active' : ''}`}
                  onClick={() => setInvestmentStyle(s.id)}
                >
                  <div className="invest-style-emoji">{s.emoji}</div>
                  <div className="invest-style-label">{s.label}</div>
                  <div className="invest-style-rate">{(s.rate * 100).toFixed(0)}% p.a.</div>
                  <div className="invest-style-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="studio-simulate-btn purple"
            onClick={() => setHasSimulated(true)}
          >
            Show My Future →
          </button>
        </div>

        {/* ---- RIGHT: Results ---- */}
        <div className="studio-results">
          {!hasSimulated ? (
            <div className="studio-results-placeholder">
              <div className="studio-placeholder-icon">🔮</div>
              <div className="studio-placeholder-text">Set your savings and investment style, then hit Show My Future</div>
            </div>
          ) : (
            <>
              {/* Milestone card */}
              <div className="studio-identity-card" style={{ borderColor: milestone.colour }}>
                <div className="studio-identity-emoji">{milestone.emoji}</div>
                <div className="studio-identity-label" style={{ color: milestone.colour }}>
                  {milestone.label}
                </div>
                <div className="studio-identity-desc">
                  In 5 years at your current pace, your projected net worth is{' '}
                  <strong style={{ color: '#8B5CF6' }}>{formatCurrency(finalNetWorth)}</strong>
                </div>
              </div>

              {/* Growth chart */}
              <div className="studio-card-block">
                <div className="studio-block-title">Your 5 Year Wealth Growth</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={projectionData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: '#A0A0C0', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#A0A0C0', fontSize: 10 }}
                      tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Year by year breakdown */}
              <div className="studio-card-block">
                <div className="studio-block-title">Year by Year Snapshot</div>
                <div className="future-breakdown">
                  {projectionData.slice(1).map((point, i) => (
                    <div key={i} className="future-breakdown-row">
                      <span className="future-year">{point.year}</span>
                      <div className="future-bar-track">
                        <div
                          className="future-bar-fill"
                          style={{
                            width: `${Math.round((point.value / finalNetWorth) * 100)}%`,
                            background: '#8B5CF6',
                          }}
                        />
                      </div>
                      <span className="future-value">{formatCurrency(point.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narrative */}
              <div className="studio-narrative">
                <div className="studio-narrative-title">Your Story</div>
                <div className="studio-narrative-text">
                  At your current pace, saving {formatCurrency(monthlySavings)} per month with a {style.label.toLowerCase()} investment approach,
                  you will accumulate approximately {formatCurrency(finalNetWorth)} in 5 years.
                  {finalNetWorth >= netMonthly * 30
                    ? ' This is enough for a solid property deposit and gives you real financial leverage.'
                    : ' Consider increasing your savings rate to unlock bigger financial milestones sooner.'
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

export default FutureWealthStudio;
