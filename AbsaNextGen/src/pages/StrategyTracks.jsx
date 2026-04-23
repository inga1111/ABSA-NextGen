import { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/StrategyTracks.css';

 
const TRACK_MILESTONES = {
  property: [
    {
      year: 'Year 1',
      title: 'Financial Foundation',
      items: [
        'Build an emergency fund (target: 3 months of expenses)',
        'Reduce high-interest debt (student loan, credit)',
        'Begin structured savings (minimum 15% of income)',
      ],
    },
    {
      year: 'Year 2',
      title: 'Deposit Accumulation',
      items: [
        'Increase savings rate to 20-25% of income',
        'Target deposit fund: approximately R150 000 to R300 000',
        'Improve credit score and reduce debt-to-income ratio',
      ],
    },
    {
      year: 'Year 3',
      title: 'Pre-Approval and Purchase Preparation',
      items: [
        'Apply for home loan pre-approval',
        'Compare property options (e.g. Sandton vs Midrand affordability)',
        'Finalise purchase planning',
      ],
    },
    {
      year: 'Year 4',
      title: 'Property Ownership Transition',
      items: [
        'Adjust to bond repayments and additional costs',
        'Reduce discretionary spending if necessary',
        'Stabilise monthly financial commitments',
      ],
    },
    {
      year: 'Year 5',
      title: 'Stability and Growth',
      items: [
        'Begin investing alongside property ownership',
        'Explore growth and long-term asset value',
      ],
    },
  ],
  balanced: [
    {
      year: 'Year 1',
      title: 'Financial Awareness and Control',
      items: [
        'Establish a clear monthly budget',
        'Begin saving 10-15% of income',
        'Start building an emergency fund',
      ],
    },
    {
      year: 'Year 2',
      title: 'Stability and Security',
      items: [
        'Fully fund emergency savings (3-6 months of expenses)',
        'Begin contributing to a Tax-Free Savings Account (TFSA)',
        'Maintain controlled lifestyle spending',
      ],
    },
    {
      year: 'Year 3',
      title: 'Investment Growth',
      items: [
        'Increase contributions to investments (TFSA, unit trusts)',
        'Begin exploring additional goals (travel, property, etc.)',
      ],
    },
    {
      year: 'Year 4',
      title: 'Diversification',
      items: [
        'Expand investment portfolio (local and offshore exposure)',
        'Maintain consistent financial habits',
      ],
    },
    {
      year: 'Year 5',
      title: 'Flexibility and Choice',
      items: [
        'Lifestyle upgrades become affordable',
        'Property decisions now within reach',
        'Increased investment contributions possible',
      ],
    },
  ],
  growth: [
    {
      year: 'Year 1',
      title: 'High Savings Activation',
      items: [
        'Increase savings rate to 25-40% of income',
        'Ensure emergency fund is in place',
      ],
    },
    {
      year: 'Year 2',
      title: 'Investment Acceleration',
      items: [
        'Maximise TFSA contributions (R36 000 per year)',
        'Begin offshore investment exposure',
      ],
    },
    {
      year: 'Year 3',
      title: 'Portfolio Expansion',
      items: [
        'Diversify portfolio (ETFs, unit trusts, global funds)',
        'Increase monthly investment contributions',
      ],
    },
    {
      year: 'Year 4',
      title: 'Wealth Compounding',
      items: [
        'Significant portfolio growth through compound returns',
        'Begin generating passive income',
      ],
    },
    {
      year: 'Year 5',
      title: 'Financial Leverage and Freedom',
      items: [
        'Ability to invest further',
        'Purchase property with strong deposit',
        'Reduce reliance on active income',
      ],
    },
  ],
};

// -----------------------------------------------
// Track card info
// -----------------------------------------------
const TRACKS = [
  {
    id: 'property',
    icon: '🏠',
    title: 'Property-Focused Track',
    tagline: 'Build toward property ownership within 3-5 years',
    description: 'Ideal if you are currently renting, have a stable income but limited savings, and want to own a home within the next 3-5 years.',
    colour: '#3B82F6',
    priority: [
      'Saving aggressively for a property deposit (10-20%)',
      'Improving affordability and credit profile',
      'Reducing unnecessary lifestyle spending',
    ],
    avoids: [
      'High lifestyle inflation and frequent travel',
      'Taking on additional debt unnecessarily',
      'Delaying savings for short-term gratification',
    ],
  },
  {
    id: 'balanced',
    icon: '⚖️',
    title: 'Balanced Lifestyle Track',
    tagline: 'Maintain your lifestyle while building financial stability',
    description: 'Ideal if you value lifestyle experiences, want to build wealth without extreme restriction, and prefer a sustainable low-stress approach.',
    colour: '#00C9B1',
    priority: [
      'Balancing spending, saving and investing',
      'Maintaining a comfortable lifestyle while building security',
      'Avoiding burnout from over-restrictive financial planning',
    ],
    avoids: [
      'Extreme saving at the cost of quality of life',
      'Ignoring long-term investments',
      'Overcommitting to large financial decisions too early',
    ],
  },
  {
    id: 'growth',
    icon: '📈',
    title: 'Aggressive Growth Track',
    tagline: 'Maximise wealth growth and long-term financial independence',
    description: 'Ideal if you already have financial stability, want to maximise long-term wealth, and are comfortable with calculated financial risk.',
    colour: '#8B5CF6',
    priority: [
      'Maximising investment contributions',
      'Leveraging compound growth over time',
      'Increasing exposure to offshore and high-growth investments',
    ],
    avoids: [
      'Excessive lifestyle spending',
      'Idle cash that is not invested',
      'Over-investing in low-growth conservative assets',
    ],
  },
];

// -----------------------------------------------
// Generate smart nudges based on user data
// -----------------------------------------------
function getNudges(trackId, userData) {
  const { savingsRate, expenseRatio, monthlyInvestments, totalDebt, netMonthly } = userData;
  const nudges = [];

  if (trackId === 'property') {
    if ((savingsRate || 0) < 15) {
      nudges.push({ type: 'red', message: 'You are currently off track for your property deposit goal. Your savings rate needs to reach at least 15%.' });
    }
    if ((expenseRatio || 0) > 30) {
      nudges.push({ type: 'yellow', message: 'Reducing lifestyle spending could bring you closer to home ownership.' });
    }
    if ((savingsRate || 0) >= 20) {
      nudges.push({ type: 'green', message: 'You are on track! Keep saving consistently to reach your deposit goal.' });
    }
  }

  if (trackId === 'balanced') {
    if ((expenseRatio || 0) > 40) {
      nudges.push({ type: 'red', message: 'Your lifestyle spending may be limiting your long-term growth.' });
    }
    if ((savingsRate || 0) >= 10) {
      nudges.push({ type: 'green', message: 'You are maintaining a healthy financial balance. Keep it up!' });
    }
    if (!monthlyInvestments || monthlyInvestments === 0) {
      nudges.push({ type: 'yellow', message: 'Consider starting a TFSA to improve your long-term outcomes.' });
    }
  }

  if (trackId === 'growth') {
    if ((savingsRate || 0) < 25) {
      nudges.push({ type: 'red', message: 'You are underperforming for a high-growth strategy. Target 25-40% savings rate.' });
    }
    if (!monthlyInvestments || monthlyInvestments === 0) {
      nudges.push({ type: 'yellow', message: 'Uninvested funds are reducing your growth potential.' });
    }
    if ((savingsRate || 0) >= 25 && monthlyInvestments > 0) {
      nudges.push({ type: 'green', message: 'Your investments are performing well and building long-term wealth.' });
    }
  }

  return nudges;
}

function StrategyTracks() {
  const { userData, formatCurrency, selectedTrack, setSelectedTrack } = useUser();
  const [activeTrack, setActiveTrack] = useState(
    selectedTrack || userData.primaryGoal || 'property'
  );

  const currentTrack = TRACKS.find(t => t.id === activeTrack);
  const milestones = TRACK_MILESTONES[activeTrack];
  const nudges = getNudges(activeTrack, userData);

  const handleSelectTrack = (trackId) => {
    setActiveTrack(trackId);
    setSelectedTrack(trackId);
  };

  return (
    <div className="tracks-wrapper">

      {/* ---- PAGE HEADER ---- */}
      <div className="page-header">
        <h1>Strategy <span className="text-orange">Tracks</span></h1>
        <p>Welcome to Strategy Tracks — where you bring that 5 year plan to life.</p>
      </div>

      {/* ---- TRACK SELECTOR CARDS ---- */}
      <div className="tracks-selector">
        {TRACKS.map((track) => (
          <div
            key={track.id}
            className={`track-selector-card ${activeTrack === track.id ? 'active' : ''}`}
            style={{ '--track-colour': track.colour }}
            onClick={() => handleSelectTrack(track.id)}
          >
            <div className="track-selector-icon">{track.icon}</div>
            <div className="track-selector-title">{track.title}</div>
            <div className="track-selector-tagline">{track.tagline}</div>
            {userData.primaryGoal === track.id && (
              <div className="track-selector-badge">Your Goal</div>
            )}
          </div>
        ))}
      </div>

      {/* ---- ACTIVE TRACK DETAIL ---- */}
      {currentTrack && (
        <div className="track-detail">

          {/* Track header */}
          <div className="track-detail-header" style={{ borderColor: currentTrack.colour }}>
            <div className="track-detail-icon">{currentTrack.icon}</div>
            <div>
              <h2 style={{ color: currentTrack.colour }}>{currentTrack.title}</h2>
              <p>{currentTrack.description}</p>
            </div>
          </div>

          {/* Priority and avoids */}
          <div className="track-detail-grid">
            <div className="track-detail-card">
              <div className="track-detail-card-title">Core Priority</div>
              {currentTrack.priority.map((item, i) => (
                <div key={i} className="track-list-item">
                  <span className="track-list-dot" style={{ background: currentTrack.colour }} />
                  {item}
                </div>
              ))}
            </div>

            <div className="track-detail-card">
              <div className="track-detail-card-title">What This Track Avoids</div>
              {currentTrack.avoids.map((item, i) => (
                <div key={i} className="track-list-item">
                  <span className="track-list-dot" style={{ background: '#E74C3C' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* ---- NUDGES ---- */}
          {nudges.length > 0 && (
            <div className="track-nudges">
              <div className="track-nudges-title">Your Personal Nudges</div>
              <div className="track-nudges-list">
                {nudges.map((nudge, i) => (
                  <div key={i} className={`nudge-card nudge-${nudge.type}`}>
                    <span className="nudge-icon">
                      {nudge.type === 'green' ? '✅' : nudge.type === 'yellow' ? '⚠️' : '🚨'}
                    </span>
                    {nudge.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- 5 YEAR MILESTONE PLAN ---- */}
          <div className="milestones-section">
            <h3>Your 5 Year Milestone Plan</h3>
            <div className="milestones-timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="milestone-item">
                  {/* Year bubble */}
                  <div className="milestone-year-col">
                    <div
                      className="milestone-year-bubble"
                      style={{ background: currentTrack.colour }}
                    >
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="milestone-connector" />
                    )}
                  </div>

                  {/* Milestone content */}
                  <div className="milestone-content">
                    <div className="milestone-title">{milestone.title}</div>
                    {milestone.items.map((item, j) => (
                      <div key={j} className="milestone-list-item">
                        <span className="milestone-dot" style={{ background: currentTrack.colour }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default StrategyTracks;
